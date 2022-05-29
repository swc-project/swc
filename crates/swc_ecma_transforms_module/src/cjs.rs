use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{js_word::is_valid_prop_ident, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    module_decl_strip::{Export, Link, LinkItem, ModuleDeclStrip, Specifier},
    util::{has_use_strict, local_name_for_src, use_strict},
};

pub fn cjs() -> impl Fold + VisitMut {
    as_folder(CJS::default())
}

#[derive(Debug, Default)]
pub struct CJS {
    config: Config,

    /// ```javascript
    /// import foo, { a as b, c } from "mod";
    /// import * as x from "x";
    /// foo, b, c;
    /// x;
    /// ```
    /// ->
    /// ```javascript
    /// _mod.default, _mod.a, _mod.c;
    /// _x;
    ///
    /// Map(
    ///     foo => (_mod, Some("default", DUMMY_SP)),
    ///     b => (_mod, Some("a", #0)),
    ///     c => (_mod, Some("c", #0)),
    ///     x => (_x, None),
    /// )
    /// ```
    import_map: AHashMap<Id, (Ident, Option<(JsWord, Span)>)>,
}

impl VisitMut for CJS {
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

        stmts.extend(self.handle_import_export(link, export).map(Into::into));

        stmts.extend(n.take());

        stmts.visit_mut_children_with(self);

        *n = stmts;
    }
}

impl CJS {
    fn handle_import_export(&mut self, link: Link, export: Export) -> impl Iterator<Item = Stmt> {
        let mut stmts = Vec::with_capacity(link.len());

        let mut module_export = None;
        let mut export_obj_prop_list: Vec<(JsWord, Span, Expr)> = export
            .into_iter()
            .map(|((key, span), ident)| (key, span, ident.into()))
            .collect();

        link.into_iter().for_each(|(src, LinkItem(src_span, set))| {
            let mut import_ident = None;
            let mut should_wrap_with_to_esm = false;
            let mut should_re_export = false;

            set.into_iter().for_each(|s| match s {
                Specifier::ImportNamed { imported, local } => {
                    let binding_ident = lazy_ident_from_src(&src, &mut import_ident);

                    self.import_map.insert(
                        local.to_id(),
                        (
                            binding_ident,
                            imported.or_else(|| Some((local.sym.clone(), local.span))),
                        ),
                    );
                }
                Specifier::ImportDefault(ident) => {
                    let binding_ident = lazy_ident_from_src(&src, &mut import_ident);

                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    self.import_map.insert(
                        ident.to_id(),
                        (binding_ident, Some((js_word!("default"), DUMMY_SP))),
                    );
                }
                Specifier::ImportStarAs(ident) => {
                    let binding_ident = lazy_ident_from_src(&src, &mut import_ident);

                    if !self.config.no_interop {
                        should_wrap_with_to_esm = true;
                    }

                    self.import_map.insert(ident.to_id(), (binding_ident, None));
                }
                Specifier::ExportNamed { orig, exported } => {
                    let binding_ident = lazy_ident_from_src(&src, &mut import_ident);

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
                    let binding_ident = lazy_ident_from_src(&src, &mut import_ident);

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
            // TODO: use make_require
            let import_expr = quote_ident!("require").as_call(
                DUMMY_SP,
                vec![Expr::Lit(
                    Str {
                        span: src_span,
                        value: src,
                        raw: None,
                    }
                    .into(),
                )
                .as_arg()],
            );

            // __reExport(_module_exports, require("mod"), module.exports);
            let import_expr = if should_re_export {
                let module_export = lazy_module_exports_ident(&mut module_export);

                // TODO: use swc helper
                quote_ident!("__reExport").as_call(
                    DUMMY_SP,
                    vec![
                        module_export.as_arg(),
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

            if let Some(import_ident) = import_ident {
                let var_declarator = VarDeclarator {
                    span: DUMMY_SP,
                    name: import_ident.into(),
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

            let module_export = lazy_module_exports_ident(&mut module_export);

            // TODO: use swc helper
            quote_ident!("__export")
                .as_call(DUMMY_SP, vec![module_export.as_arg(), obj_lit.as_arg()])
                .into_stmt()
        });

        let to_cjs = module_export.clone().map(|ident| {
            quote_ident!("__toCJS")
                .as_call(DUMMY_SP, vec![ident.as_arg()])
                .make_assign_to(
                    op!("="),
                    quote_ident!("module").make_member(quote_ident!("exports")),
                )
                .into_stmt()
        });

        let export_init = module_export.map(|ident| {
            let var_declarator = VarDeclarator {
                span: DUMMY_SP,
                name: ident.into(),
                init: Some(Box::new(ObjectLit::dummy().into())),
                definite: false,
            };

            let var_decl = VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![var_declarator],
            };

            Stmt::Decl(Decl::Var(var_decl))
        });

        export_init
            .into_iter()
            .chain(export_call)
            .chain(to_cjs)
            .chain(stmts)
    }
}

fn lazy_ident_from_src(src: &JsWord, ident: &mut Option<Ident>) -> Ident {
    ident.clone().unwrap_or_else(|| {
        let new_ident = private_ident!(local_name_for_src(src));
        *ident = Some(new_ident.clone());
        new_ident
    })
}

fn lazy_module_exports_ident(ident: &mut Option<Ident>) -> Ident {
    ident.clone().unwrap_or_else(|| {
        let new_ident = private_ident!("_module_exports");
        *ident = Some(new_ident.clone());
        new_ident
    })
}

fn prop_name(key: JsWord, span: Span) -> PropName {
    if is_valid_prop_ident(&key) {
        PropName::Ident(Ident::new(key, span))
    } else {
        PropName::Str(Str {
            span,
            value: key,
            raw: None,
        })
    }
}

/// ```javascript
/// {
///     prop: () => expr,
/// }
/// ```
fn _prop_arrow((key, span, expr): (JsWord, Span, Expr)) -> PropOrSpread {
    let key = prop_name(key, span);

    PropOrSpread::Prop(Box::new(
        KeyValueProp {
            key,
            value: Box::new(
                ArrowExpr {
                    span: DUMMY_SP,
                    params: Default::default(),
                    body: expr.into(),
                    is_async: false,
                    is_generator: false,
                    type_params: None,
                    return_type: None,
                }
                .into(),
            ),
        }
        .into(),
    ))
}

/// ```javascript
/// {
///     prop() {
///         return expr;
///     }
/// }
/// ```
fn _prop_method((key, span, expr): (JsWord, Span, Expr)) -> PropOrSpread {
    let key = prop_name(key, span);

    let return_stmt = ReturnStmt {
        span,
        arg: Some(Box::new(expr)),
    };

    PropOrSpread::Prop(Box::new(
        MethodProp {
            key,
            function: Function {
                params: Default::default(),
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![return_stmt.into()],
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            },
        }
        .into(),
    ))
}

/// ```javascript
/// {
///     prop: function() {
///         return expr;
///     }
/// }
/// ```
fn prop_function((key, span, expr): (JsWord, Span, Expr)) -> PropOrSpread {
    let key = prop_name(key, span);

    let return_stmt = ReturnStmt {
        span,
        arg: Some(Box::new(expr)),
    };

    PropOrSpread::Prop(Box::new(
        KeyValueProp {
            key,
            value: Box::new(
                FnExpr {
                    ident: None,
                    function: Function {
                        params: Default::default(),
                        decorators: Default::default(),
                        span: DUMMY_SP,
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![return_stmt.into()],
                        }),
                        is_generator: Default::default(),
                        is_async: Default::default(),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    },
                }
                .into(),
            ),
        }
        .into(),
    ))
}
