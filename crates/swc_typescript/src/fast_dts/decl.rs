use swc_common::Spanned;
use swc_ecma_ast::{Decl, DefaultDecl, Pat, TsNamespaceBody};

use super::{any_type_ann, type_ann, FastDts};

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
            Decl::Var(_) | Decl::Using(_) => {
                let decls = match decl {
                    Decl::Var(var_decl) => {
                        var_decl.declare = is_declare;
                        &mut var_decl.decls
                    }
                    Decl::Using(using_decl) => &mut using_decl.decls,
                    _ => todo!(),
                };

                for decl in decls.iter_mut() {
                    if let Pat::Ident(ident) = &mut decl.name {
                        if ident.type_ann.is_some() {
                            decl.init = None;
                            continue;
                        }

                        let ts_type = decl
                            .init
                            .take()
                            .and_then(|init| self.infer_type_from_expr(&init, false, true))
                            .map(type_ann)
                            .or_else(|| {
                                self.variable_must_have_explicit_type(ident.span());
                                Some(any_type_ann())
                            });
                        ident.type_ann = ts_type;
                    } else {
                        self.binding_element_export(decl.name.span());
                    }

                    decl.init = None;
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

    pub(crate) fn transform_default_decl(&mut self, decl: &mut DefaultDecl) {
        match decl {
            DefaultDecl::Class(class_expr) => {
                self.transform_class(&mut class_expr.class);
            }
            DefaultDecl::Fn(fn_expr) => {
                fn_expr.function.body = None;
                if fn_expr.function.return_type.is_none() {
                    // self.mark_diagnostic(DtsIssueKind::FunctionExplicitType,
                    // fn_expr.span());
                }
            }
            DefaultDecl::TsInterfaceDecl(_) => {}
        };
    }

    pub(crate) fn transform_ts_namespace_decl(&mut self, body: &mut TsNamespaceBody) {
        let original_is_top_level = self.is_top_level;
        self.is_top_level = false;
        match body {
            TsNamespaceBody::TsModuleBlock(ts_module_block) => {
                self.transform_module_items(&mut ts_module_block.body);
            }
            TsNamespaceBody::TsNamespaceDecl(ts_ns) => {
                self.transform_ts_namespace_decl(&mut ts_ns.body)
            }
        };
        self.is_top_level = original_is_top_level;
    }
}
