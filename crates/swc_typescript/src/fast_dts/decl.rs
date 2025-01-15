use swc_common::Spanned;
use swc_ecma_ast::{
    Decl, DefaultDecl, Expr, Lit, Pat, TsNamespaceBody, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::VisitMutWith;

use super::{
    type_ann,
    util::{ast_ext::PatExt, types::any_type_ann},
    visitors::internal_annotation::InternalAnnotationTransformer,
    FastDts,
};

impl FastDts {
    pub(crate) fn transform_decl(&mut self, decl: &mut Decl, check_binding: bool) {
        let is_declare = self.is_top_level;
        match decl {
            Decl::Class(class_decl) => {
                if class_decl.declare {
                    return;
                }

                if check_binding && !self.used_refs.contains(&class_decl.ident.to_id()) {
                    return;
                }

                class_decl.declare = is_declare;
                self.transform_class(&mut class_decl.class);
            }
            Decl::Fn(fn_decl) => {
                if fn_decl.declare {
                    return;
                }

                if check_binding && !self.used_refs.contains(&fn_decl.ident.to_id()) {
                    return;
                }

                fn_decl.declare = is_declare;
                self.transform_fn(&mut fn_decl.function, Some(fn_decl.ident.span));
            }
            Decl::Var(var) => {
                if var.declare {
                    return;
                }

                var.declare = is_declare;
                for decl in var.decls.iter_mut() {
                    if check_binding
                        && decl
                            .name
                            .as_ident()
                            .map_or(false, |ident| !self.used_refs.contains(&ident.to_id()))
                    {
                        return;
                    }
                    self.transform_variables_declarator(var.kind, decl, check_binding);
                }
            }
            Decl::Using(using) => {
                for decl in using.decls.iter_mut() {
                    if check_binding
                        && decl
                            .name
                            .as_ident()
                            .map_or(false, |ident| !self.used_refs.contains(&ident.to_id()))
                    {
                        return;
                    }
                    self.transform_variables_declarator(VarDeclKind::Const, decl, check_binding);
                }
            }
            Decl::TsEnum(ts_enum) => {
                ts_enum.declare = is_declare;
                if check_binding && !self.used_refs.contains(&ts_enum.id.to_id()) {
                    return;
                }
                self.transform_enum(ts_enum.as_mut());
            }
            Decl::TsModule(ts_module) => {
                if ts_module.declare {
                    return;
                }

                if !ts_module.global
                    && !ts_module.id.is_str()
                    && check_binding
                    && ts_module
                        .id
                        .as_ident()
                        .map_or(false, |ident| !self.used_refs.contains(&ident.to_id()))
                {
                    return;
                }

                ts_module.declare = is_declare;
                if let Some(body) = ts_module.body.as_mut() {
                    self.transform_ts_namespace_decl(
                        body,
                        ts_module.global || ts_module.id.is_str(),
                    );
                }
            }
            Decl::TsInterface(ts_interface) => {
                if let Some(internal_annotations) = self.internal_annotations.as_ref() {
                    ts_interface.visit_mut_children_with(&mut InternalAnnotationTransformer::new(
                        internal_annotations,
                    ))
                }
                for type_element in ts_interface.body.body.iter() {
                    self.check_ts_signature(type_element);
                }
            }
            Decl::TsTypeAlias(ts_type_alias) => {
                if let Some(internal_annotations) = self.internal_annotations.as_ref() {
                    ts_type_alias.visit_mut_children_with(&mut InternalAnnotationTransformer::new(
                        internal_annotations,
                    ))
                }
                if let Some(ts_lit) = ts_type_alias.type_ann.as_ts_type_lit() {
                    for type_element in ts_lit.members.iter() {
                        self.check_ts_signature(type_element);
                    }
                }
            }
        }
    }

    pub(crate) fn transform_variables_declarator(
        &mut self,
        kind: VarDeclKind,
        decl: &mut VarDeclarator,
        check_binding: bool,
    ) {
        let pat = match &decl.name {
            Pat::Assign(assign_pat) => &assign_pat.left,
            _ => &decl.name,
        };

        if matches!(pat, Pat::Array(_) | Pat::Object(_)) {
            pat.bound_names(&mut |ident| {
                if !check_binding || self.used_refs.contains(&ident.to_id()) {
                    self.binding_element_export(ident.span);
                }
            });
            return;
        }

        let mut binding_type = None;
        let mut init = None;

        if pat.get_type_ann().is_none() {
            if let Some(init_expr) = &decl.init {
                if kind == VarDeclKind::Const
                    && !Self::need_to_infer_type_from_expression(init_expr)
                {
                    if let Some(tpl) = init_expr.as_tpl() {
                        init = self
                            .tpl_to_string(tpl)
                            .map(|s| Box::new(Expr::Lit(Lit::Str(s))));
                    } else {
                        init = Some(init_expr.clone());
                    }
                } else if kind != VarDeclKind::Const || !init_expr.is_tpl() {
                    binding_type = self.infer_type_from_expr(init_expr).map(type_ann);
                }
            }

            if init.is_none() && binding_type.is_none() {
                binding_type = Some(any_type_ann());
                if !decl
                    .init
                    .as_ref()
                    .is_some_and(|init| init.is_fn_expr() || init.is_arrow())
                {
                    self.variable_must_have_explicit_type(decl.name.span());
                }
            }
        }

        decl.init = init;
        if binding_type.is_some() {
            decl.name.set_type_ann(binding_type);
        }
    }

    pub(crate) fn transform_default_decl(&mut self, decl: &mut DefaultDecl) {
        match decl {
            DefaultDecl::Class(class_expr) => {
                self.transform_class(&mut class_expr.class);
            }
            DefaultDecl::Fn(fn_expr) => {
                self.transform_fn(
                    &mut fn_expr.function,
                    fn_expr.ident.as_ref().map(|ident| ident.span),
                );
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        };
    }

    pub(crate) fn transform_ts_namespace_decl(
        &mut self,
        body: &mut TsNamespaceBody,
        in_global_or_lit_module: bool,
    ) {
        let original_is_top_level = self.is_top_level;
        self.is_top_level = false;
        match body {
            TsNamespaceBody::TsModuleBlock(ts_module_block) => {
                self.transform_module_body(&mut ts_module_block.body, in_global_or_lit_module);
            }
            TsNamespaceBody::TsNamespaceDecl(ts_ns) => {
                self.transform_ts_namespace_decl(&mut ts_ns.body, ts_ns.global)
            }
        };
        self.is_top_level = original_is_top_level;
    }
}
