use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{is_valid_prop_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    import_ref_rewriter::{ImportMap, ImportRefRewriter},
    module_decl_strip::{Export, Link, LinkItem, ModuleDeclStrip, Specifier},
    path::{ImportResolver, Resolver},
    util::{
        cjs_dynamic_import, define_es_module, has_use_strict, lazy_ident_from_src, prop_function,
        use_strict,
    },
};

pub fn cjs(unresolved_mark: Mark, config: Config) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Default,
        unresolved_mark,

        exports: None,
    })
}

pub fn cjs_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Real { base, resolver },
        unresolved_mark,

        exports: None,
    })
}

pub struct Cjs {
    config: Config,
    resolver: Resolver,
    unresolved_mark: Mark,

    exports: Option<Ident>,
}

impl VisitMut for Cjs {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut strip = ModuleDeclStrip::default();
        n.visit_mut_with(&mut strip);

        let mut stmts: Vec<ModuleItem> = Vec::with_capacity(n.len() + 4);

        // "use strict";
        if self.config.strict_mode && !has_use_strict(n) {
            stmts.push(use_strict().into());
        }

        let ModuleDeclStrip { link, export, .. } = strip;

        let mut import_map = Default::default();

        stmts.extend(
            self.handle_import_export(&mut import_map, link, export)
                .map(Into::into),
        );

        stmts.extend(n.take());

        stmts.visit_mut_children_with(&mut ImportRefRewriter { import_map });

        if !self.config.ignore_dynamic {
            stmts.visit_mut_children_with(&mut DynamicImport {
                unresolved_mark: self.unresolved_mark,
                es_module_interop: !self.config.no_interop,
            })
        }

        *n = stmts;
    }
}

impl Cjs {
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        link: Link,
        export: Export,
    ) -> impl Iterator<Item = Stmt> {
        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list: Vec<(JsWord, Span, Expr)> = export
            .into_iter()
            .map(|((key, span), ident)| (key, span, ident.into()))
            .collect();

        link.into_iter().for_each(|(src, LinkItem(src_span, set))| {
            let mut mod_ident = None;

            // - 0b01 named
            // - 0b10 default
            // - 0b11 star
            let mut import_flag = 0u8;

            let mut should_re_export = false;

            set.into_iter().for_each(|s| match s {
                Specifier::ImportNamed { imported, local } => {
                    // `import { default as bar } from "foo"`
                    if imported == Some(js_word!("default")) {
                        import_flag |= 0b10;
                    } else {
                        import_flag |= 0b01;
                    }

                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    import_map.insert(local.clone(), (binding_ident, imported.or(Some(local.0))));
                }
                Specifier::ImportDefault(id) => {
                    import_flag |= 0b10;

                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    import_map.insert(id, (binding_ident, Some(js_word!("default"))));
                }
                Specifier::ImportStarAs(id) => {
                    import_flag |= 0b11;

                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    import_map.insert(id, (binding_ident, None));
                }
                Specifier::ExportNamed { orig, exported } => {
                    // `export { default as bar } from "foo"`
                    if orig.0 == js_word!("default") {
                        import_flag |= 0b10;
                    } else {
                        import_flag |= 0b01;
                    }

                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    let (key, span) = exported.unwrap_or_else(|| orig.clone());

                    let expr = {
                        let (name, span) = orig;
                        if is_valid_prop_ident(&name) {
                            binding_ident.make_member(Ident::new(name, span))
                        } else {
                            binding_ident.computed_member(Str {
                                span,
                                value: name,
                                raw: None,
                            })
                        }
                    };
                    export_obj_prop_list.push((key, span, expr))
                }
                Specifier::ExportStarAs(key, span) => {
                    import_flag |= 0b11;

                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    let expr = binding_ident.into();
                    export_obj_prop_list.push((key, span, expr))
                }
                Specifier::ExportStar => {
                    should_re_export = true;
                }
            });

            if self.config.no_interop {
                import_flag &= 1;
            }

            // require("mod");
            let import_expr = self
                .resolver
                .make_require_call(self.unresolved_mark, src, src_span);

            // _reExport(exports, require("mod"));
            let import_expr = if should_re_export {
                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(re_export, "reExport"),
                    args: vec![self.exports().as_arg(), import_expr.as_arg()],
                    type_args: Default::default(),
                }
                .into()
            } else {
                import_expr
            };

            // _introp(require("mod"));
            let import_expr = if import_flag == 0b11 {
                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(interop_require_wildcard, "interopRequireWildcard"),
                    args: vec![import_expr.as_arg()],
                    type_args: Default::default(),
                }
                .into()
            } else if import_flag == 0b10 {
                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(interop_require_default, "interopRequireDefault"),
                    args: vec![import_expr.as_arg()],
                    type_args: Default::default(),
                }
                .into()
            } else {
                import_expr
            };

            if let Some(mod_ident) = mod_ident {
                let var_declarator = VarDeclarator {
                    span: DUMMY_SP,
                    name: mod_ident.into(),
                    init: Some(Box::new(import_expr)),
                    definite: false,
                };

                let var_decl = VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![var_declarator],
                };
                let stmt = Stmt::Decl(Decl::Var(var_decl));

                stmts.push(stmt)
            } else {
                stmts.push(import_expr.into_stmt());
            }
        });

        let export_call = (!export_obj_prop_list.is_empty()).then(|| {
            export_obj_prop_list.sort_by(|a, b| a.0.cmp(&b.0));

            let props = export_obj_prop_list
                .into_iter()
                .map(prop_function)
                .collect();

            let obj_lit = ObjectLit {
                span: DUMMY_SP,
                props,
            };

            CallExpr {
                span: DUMMY_SP,
                callee: helper!(export, "export"),
                args: vec![self.exports().as_arg(), obj_lit.as_arg()],
                type_args: Default::default(),
            }
            .into_stmt()
        });

        self.exports
            .clone()
            .map(define_es_module)
            .into_iter()
            .chain(export_call)
            .chain(stmts)
    }

    fn exports(&mut self) -> Ident {
        self.exports.clone().unwrap_or_else(|| {
            let new_ident = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "exports");
            self.exports = Some(new_ident.clone());
            new_ident
        })
    }
}

struct DynamicImport {
    unresolved_mark: Mark,
    es_module_interop: bool,
}

impl VisitMut for DynamicImport {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Call(CallExpr {
                span,
                callee: Callee::Import(Import { span: import_span }),
                args,
                ..
            }) => {
                let require_span = import_span.apply_mark(self.unresolved_mark);
                *n = cjs_dynamic_import(
                    *span,
                    args.take(),
                    quote_ident!(require_span, "require"),
                    self.es_module_interop,
                );
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}
