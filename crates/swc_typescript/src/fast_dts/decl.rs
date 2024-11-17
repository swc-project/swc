use swc_common::Spanned;
use swc_ecma_ast::{
    Decl, DefaultDecl, Expr, Lit, ModuleDecl, ModuleItem, Pat, Stmt, TsNamespaceBody, VarDeclKind,
    VarDeclarator,
};

use super::{
    type_ann,
    util::{any_type_ann, PatExt},
    FastDts,
};

impl FastDts {
    pub(crate) fn transform_decl(&mut self, decl: &mut Decl) {
        let is_declare = self.is_top_level;
        match decl {
            Decl::Class(class_decl) => {
                if class_decl.declare {
                    return;
                }

                class_decl.declare = is_declare;
                self.transform_class(&mut class_decl.class);
            }
            Decl::Fn(fn_decl) => {
                if fn_decl.declare {
                    return;
                }

                fn_decl.declare = is_declare;
                self.transform_fn(&mut fn_decl.function);
            }
            Decl::Var(var) => {
                if var.declare {
                    return;
                }

                var.declare = is_declare;
                for decl in var.decls.iter_mut() {
                    self.transform_variables_declarator(var.kind, decl);
                }
            }
            Decl::Using(using) => {
                for decl in using.decls.iter_mut() {
                    self.transform_variables_declarator(VarDeclKind::Const, decl);
                }
            }
            Decl::TsEnum(ts_enum) => {
                ts_enum.declare = is_declare;
                self.transform_enum(ts_enum.as_mut());
            }
            Decl::TsModule(ts_module) => {
                ts_module.declare = is_declare;
                if let Some(body) = ts_module.body.as_mut() {
                    self.transform_ts_namespace_decl(body);
                }
            }
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
        }
    }

    pub(crate) fn transform_variables_declarator(
        &mut self,
        kind: VarDeclKind,
        decl: &mut VarDeclarator,
    ) {
        let pat = match &decl.name {
            Pat::Assign(assign_pat) => &assign_pat.left,
            _ => &decl.name,
        };

        if matches!(pat, Pat::Array(_) | Pat::Object(_)) {
            self.binding_element_export(decl.name.span());
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
                if !decl.init.as_ref().is_some_and(|init| init.is_fn_expr()) {
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
                self.transform_fn(&mut fn_expr.function);
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        };
    }

    pub(crate) fn transform_ts_namespace_decl(&mut self, body: &mut TsNamespaceBody) {
        let original_is_top_level = self.is_top_level;
        self.is_top_level = false;
        match body {
            TsNamespaceBody::TsModuleBlock(ts_module_block) => {
                ts_module_block
                    .body
                    .retain(|item| item.as_stmt().map(|stmt| stmt.is_decl()).unwrap_or(true));
                self.transform_module_items(&mut ts_module_block.body);
            }
            TsNamespaceBody::TsNamespaceDecl(ts_ns) => {
                self.transform_ts_namespace_decl(&mut ts_ns.body)
            }
        };
        self.is_top_level = original_is_top_level;
    }
}
