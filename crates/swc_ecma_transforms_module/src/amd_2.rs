use anyhow::Context;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{is_valid_prop_ident, private_ident, quote_ident, quote_str, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    module_decl_strip::{Export, Link, LinkItem, ModuleDeclStrip, Specifier},
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        amd_dynamic_import, define_es_module, has_use_strict, local_name_for_src, prop_function,
        use_strict,
    },
};

pub fn amd(unresolved_mark: Mark, config: Config) -> impl Fold + VisitMut {
    as_folder(Amd {
        config,
        unresolved_mark,
        resolver: Resolver::Default,

        dep_list: Default::default(),
        exports: Default::default(),
    })
}

pub fn amd_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
) -> impl Fold + VisitMut {
    as_folder(Amd {
        config,
        unresolved_mark,
        resolver: Resolver::Real { base, resolver },

        dep_list: Default::default(),
        exports: Default::default(),
    })
}

pub struct Amd {
    config: Config,
    unresolved_mark: Mark,
    resolver: Resolver,

    dep_list: Vec<(Ident, JsWord, Span)>,
    exports: Option<Ident>,
}

impl VisitMut for Amd {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut strip = ModuleDeclStrip::default();
        n.visit_mut_with(&mut strip);

        let mut stmts: Vec<Stmt> = Vec::with_capacity(n.len() + 4);

        // "use strict";
        if self.config.strict_mode && !has_use_strict(n) {
            stmts.push(use_strict());
        }

        let ModuleDeclStrip { link, export, .. } = strip;

        let mut import_map = Default::default();

        stmts.extend(
            self.handle_import_export(&mut import_map, link, export)
                .map(Into::into),
        );

        stmts.extend(n.take().into_iter().map(|i| match i {
            ModuleItem::ModuleDecl(_) => {
                unreachable!("All ModuleDecl should be removed by ModuleDeclStrip")
            }
            ModuleItem::Stmt(stmt) => stmt,
        }));

        stmts.visit_mut_children_with(&mut ModuleRefRewriter {
            import_map,
            top_level: true,
        });

        let require = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require");

        if !self.config.ignore_dynamic {
            stmts.visit_mut_children_with(&mut DynamicImport {
                es_module_interop: !self.config.no_interop,
                require: require.clone(),
            })
        }

        // ====================
        //  Emit
        // ====================

        let mut elems = vec![Some(quote_str!("require").as_arg())];
        let mut params = vec![require.into()];

        if let Some(exports) = self.exports.take() {
            elems.push(Some(quote_str!("exports").as_arg()));
            params.push(exports.into())
        }

        self.dep_list
            .take()
            .into_iter()
            .for_each(|(ident, src_path, src_span)| {
                let src_path = match &self.resolver {
                    Resolver::Real { resolver, base } => resolver
                        .resolve_import(base, &src_path)
                        .with_context(|| format!("failed to resolve `{}`", src_path))
                        .unwrap(),
                    Resolver::Default => src_path,
                };

                elems.push(Some(quote_str!(src_span, src_path).as_arg()));
                params.push(ident.into());
            });

        *n = vec![quote_ident!("define")
            .as_call(
                DUMMY_SP,
                vec![
                    ArrayLit {
                        span: DUMMY_SP,
                        elems,
                    }
                    .as_arg(),
                    FnExpr {
                        ident: None,
                        function: Function {
                            params,
                            decorators: Default::default(),
                            span: DUMMY_SP,
                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                stmts,
                            }),
                            is_generator: Default::default(),
                            is_async: Default::default(),
                            type_params: Default::default(),
                            return_type: Default::default(),
                        },
                    }
                    .as_arg(),
                ],
            )
            .into_stmt()
            .into()];
    }
}

impl Amd {
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
            let mod_ident = private_ident!(local_name_for_src(&src));
            self.dep_list.push((mod_ident.clone(), src, src_span));

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

                    import_map.insert(
                        local.clone(),
                        (mod_ident.clone(), imported.or(Some(local.0))),
                    );
                }
                Specifier::ImportDefault(id) => {
                    import_flag |= 0b10;

                    import_map.insert(id, (mod_ident.clone(), Some(js_word!("default"))));
                }
                Specifier::ImportStarAs(id) => {
                    import_flag |= 0b11;

                    import_map.insert(id, (mod_ident.clone(), None));
                }
                Specifier::ExportNamed { orig, exported } => {
                    // `export { default as bar } from "foo"`

                    if orig.0 == js_word!("default") {
                        import_flag |= 0b10;
                    } else {
                        import_flag |= 0b01;
                    }

                    let (key, span) = exported.unwrap_or_else(|| orig.clone());

                    let expr = {
                        let (name, span) = orig;
                        if is_valid_prop_ident(&name) {
                            mod_ident.clone().make_member(Ident::new(name, span))
                        } else {
                            mod_ident.clone().computed_member(Str {
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

                    let expr = mod_ident.clone().into();
                    export_obj_prop_list.push((key, span, expr))
                }
                Specifier::ExportStar => {
                    should_re_export = true;
                }
            });

            if self.config.no_interop {
                import_flag &= 1;
            }

            if should_re_export || import_flag > 1 {
                // _reExport(exports, mod);
                let import_expr: Expr = if should_re_export {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(re_export, "reExport"),
                        args: vec![self.exports().as_arg(), mod_ident.clone().as_arg()],
                        type_args: Default::default(),
                    }
                    .into()
                } else {
                    mod_ident.clone().into()
                };

                // mod = _introp(mod);
                let import_expr = if import_flag == 0b11 {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(interop_require_wildcard, "interopRequireWildcard"),
                        args: vec![import_expr.as_arg()],
                        type_args: Default::default(),
                    }
                    .make_assign_to(op!("="), mod_ident.as_pat_or_expr())
                } else if import_flag == 0b10 {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(interop_require_default, "interopRequireDefault"),
                        args: vec![import_expr.as_arg()],
                        type_args: Default::default(),
                    }
                    .make_assign_to(op!("="), mod_ident.as_pat_or_expr())
                } else {
                    import_expr
                };

                stmts.push(import_expr.into_stmt())
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
            let new_ident = private_ident!("exports");
            self.exports = Some(new_ident.clone());
            new_ident
        })
    }
}

struct DynamicImport {
    es_module_interop: bool,
    require: Ident,
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
                let mut require = self.require.clone();
                require.span = import_span.apply_mark(require.span.ctxt().outer());

                *n = amd_dynamic_import(*span, args.take(), require, self.es_module_interop);
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}
