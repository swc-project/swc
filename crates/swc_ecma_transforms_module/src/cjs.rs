use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{is_valid_prop_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    import_ref_rewriter::{ImportMap, ImportRefRewriter},
    module_decl_strip::{Export, Link, LinkItem, ModuleDeclStrip, Specifier},
    path::{ImportResolver, Resolver},
    util::{has_use_strict, lazy_ident_from_src, prop_function, use_strict},
};

pub fn cjs(unresolved_mark: Mark, config: Config) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Default,
        unresolved_mark,
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
    })
}

pub struct Cjs {
    config: Config,

    resolver: Resolver,
    unresolved_mark: Mark,
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

        *n = stmts;
    }
}

impl Cjs {
    fn handle_import_export(
        &self,
        import_map: &mut ImportMap,
        link: Link,
        export: Export,
    ) -> impl Iterator<Item = Stmt> {
        let mut stmts = Vec::with_capacity(link.len());

        let exports = quote_ident!("exports");
        let mut export_obj_prop_list: Vec<(JsWord, Span, Expr)> = export
            .into_iter()
            .map(|((key, span), ident)| (key, span, ident.into()))
            .collect();

        link.into_iter().for_each(|(src, LinkItem(src_span, set))| {
            let mut mod_ident = None;
            let mut should_wrap_with_to_esm = false;
            let mut should_re_export = false;

            set.into_iter().for_each(|s| match s {
                Specifier::ImportNamed { imported, local } => {
                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    import_map.insert(local.clone(), (binding_ident, imported.or(Some(local.0))));
                }
                Specifier::ImportDefault(id) => {
                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    import_map.insert(id, (binding_ident, Some(js_word!("default"))));
                }
                Specifier::ImportStarAs(id) => {
                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    import_map.insert(id, (binding_ident, None));
                }
                Specifier::ExportNamed { orig, exported } => {
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
                    let binding_ident = lazy_ident_from_src(&src, &mut mod_ident);

                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    let expr = binding_ident.into();
                    export_obj_prop_list.push((key, span, expr))
                }
                Specifier::ExportStar => {
                    should_re_export = true;
                }
            });

            // require("mod");
            let import_expr = self
                .resolver
                .make_require_call(self.unresolved_mark, src, src_span);

            // __reExport(_module_exports, require("mod"), module.exports);
            let import_expr = if should_re_export {
                // TODO: use swc helper
                quote_ident!("__reExport").as_call(
                    DUMMY_SP,
                    vec![
                        exports.clone().as_arg(),
                        import_expr.as_arg(),
                        quote_ident!("module")
                            .make_member(quote_ident!("exports"))
                            .as_arg(),
                    ],
                )
            } else {
                import_expr
            };

            // __toESM(require("mod"));
            let import_expr = if should_wrap_with_to_esm {
                // TODO: use swc helper
                quote_ident!("__toESM").as_call(DUMMY_SP, vec![import_expr.as_arg()])
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

            // TODO: use swc helper
            quote_ident!("__export")
                .as_call(DUMMY_SP, vec![exports.clone().as_arg(), obj_lit.as_arg()])
                .into_stmt()
        });

        let to_cjs = export_call.as_ref().map(|_| {
            quote_ident!("__toCJS")
                .as_call(DUMMY_SP, vec![exports.clone().as_arg()])
                .make_assign_to(
                    op!("="),
                    quote_ident!("module").make_member(quote_ident!("exports")),
                )
                .into_stmt()
        });

        export_call.into_iter().chain(to_cjs).chain(stmts)
    }
}
