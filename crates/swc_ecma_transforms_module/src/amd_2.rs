use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{is_valid_prop_ident, private_ident, quote_ident, quote_str, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    import_ref_rewriter::{ImportMap, ImportRefRewriter},
    module_decl_strip::{Export, Link, LinkItem, ModuleDeclStrip, Specifier},
    util::{define_es_module, has_use_strict, local_name_for_src, prop_function, use_strict},
};

pub fn amd(unresolved_mark: Mark, config: Config) -> impl Fold + VisitMut {
    as_folder(Amd {
        config,
        unresolved_mark,
        dep_list: Default::default(),
        exports: Default::default(),
    })
}

pub struct Amd {
    config: Config,

    unresolved_mark: Mark,

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

        stmts.visit_mut_children_with(&mut ImportRefRewriter { import_map });

        // ====================
        //  Emit
        // ====================

        let mut elems = vec![Some(quote_str!("require").as_arg())];
        let mut params =
            vec![quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require").into()];

        if let Some(exports) = self.exports.take() {
            elems.push(Some(quote_str!("exports").as_arg()));
            params.push(exports.into())
        }

        self.dep_list
            .take()
            .into_iter()
            .for_each(|(ident, src_path, src_span)| {
                // TODO: handle swc helpers import
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

            let mut should_wrap_with_to_esm = false;
            let mut should_re_export = false;

            set.into_iter().for_each(|s| match s {
                Specifier::ImportNamed { imported, local } => {
                    import_map.insert(
                        local.clone(),
                        (mod_ident.clone(), imported.or(Some(local.0))),
                    );
                }
                Specifier::ImportDefault(id) => {
                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    import_map.insert(id, (mod_ident.clone(), Some(js_word!("default"))));
                }
                Specifier::ImportStarAs(id) => {
                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    import_map.insert(id, (mod_ident.clone(), None));
                }
                Specifier::ExportNamed { orig, exported } => {
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
                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    let expr = mod_ident.clone().into();
                    export_obj_prop_list.push((key, span, expr))
                }
                Specifier::ExportStar => {
                    should_re_export = true;
                }
            });

            if should_re_export || should_wrap_with_to_esm {
                // __reExport(_exports, require("mod"));
                let import_expr: Expr = if should_re_export {
                    // TODO: use swc helper
                    quote_ident!("__reExport").as_call(
                        DUMMY_SP,
                        vec![self.exports().as_arg(), mod_ident.clone().as_arg()],
                    )
                } else {
                    mod_ident.clone().into()
                };

                // __toESM(require("mod"));
                let import_expr = if should_wrap_with_to_esm {
                    // TODO: use swc helper
                    quote_ident!("__toESM")
                        .as_call(DUMMY_SP, vec![import_expr.as_arg()])
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

            // TODO: use swc helper
            quote_ident!("__export")
                .as_call(DUMMY_SP, vec![self.exports().as_arg(), obj_lit.as_arg()])
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
            let new_ident = private_ident!("_exports");
            self.exports = Some(new_ident.clone());
            new_ident
        })
    }
}
