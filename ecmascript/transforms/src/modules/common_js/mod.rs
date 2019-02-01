use super::util::{define_property, local_name_for_src, make_require_call};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{undefined, ExprFactory, State},
};
use ast::*;
use fxhash::FxHashMap;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext, DUMMY_SP};

#[cfg(test)]
mod tests;

#[derive(Default, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub lazy: bool,
}

pub fn common_js(helpers: Arc<Helpers>) -> impl Pass + Clone {
    CommonJs {
        helpers,
        scope: Default::default(),
    }
}

#[derive(Clone)]
struct CommonJs {
    helpers: Arc<Helpers>,
    scope: State<Scope>,
}

#[derive(Clone, Default)]
struct Scope {
    /// Map from source file to ident
    ///
    /// e.g.
    ///
    ///  - `import 'foo'`
    ///   -> `{'foo': None}`
    ///
    ///  - `import { foo } from 'bar';`
    ///   -> `{'bar': Some(_bar)}`
    ///
    ///  - `import * as bar1 from 'bar';`
    ///   -> `{'bar': Some(bar1)}`
    imports: FxHashMap<JsWord, Option<(JsWord, Span)>>,
    ///
    /// - `true` is wildcard (`_interopRequireWildcard`)
    /// - `false` is default (`_interopRequireDefault`)
    import_types: FxHashMap<JsWord, bool>,

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    idents: FxHashMap<(JsWord, SyntaxContext), (JsWord, JsWord)>,
}

impl Fold<Vec<ModuleItem>> for CommonJs {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(items.len() + 4);
        let mut extra_stmts = Vec::with_capacity(items.len());

        stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Lit(Lit::Str(
            quote_str!("use strict"),
        )))));

        let mut has_export = false;
        let mut has_default_export = false;

        for item in items {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(mut import)) => {
                    if import.specifiers.is_empty() {
                        // import 'foo';
                        //   -> require('foo');
                        self.scope.imports.insert(import.src.value.clone(), None);
                    } else if import.specifiers.len() == 1
                        && match import.specifiers[0] {
                            ImportSpecifier::Namespace(..) => true,
                            _ => false,
                        }
                    {
                        // import * as foo from 'src';
                        let specifier = match import.specifiers.pop().unwrap() {
                            ImportSpecifier::Namespace(ns) => ns,
                            _ => unreachable!(),
                        };

                        // Override if one exists
                        self.scope.imports.insert(
                            import.src.value.clone(),
                            Some((specifier.local.sym.clone(), specifier.local.span)),
                        );
                        self.scope.import_types.insert(import.src.value, true);
                    } else {
                        if !self.scope.imports.contains_key(&import.src.value) {
                            self.scope.imports.insert(
                                import.src.value.clone(),
                                Some((local_name_for_src(&import.src), DUMMY_SP)),
                            );
                        }

                        for s in import.specifiers {
                            match s {
                                ImportSpecifier::Namespace(..) => unreachable!(
                                    "import * as foo cannot be used with other type of import \
                                     specifiers"
                                ),
                                ImportSpecifier::Default(i) => {
                                    //
                                    self.scope.idents.insert(
                                        (i.local.sym.clone(), i.local.span.ctxt()),
                                        (import.src.value.clone(), js_word!("default")),
                                    );
                                    self.scope
                                        .import_types
                                        .entry(import.src.value.clone())
                                        .or_insert(false);
                                }
                                ImportSpecifier::Specific(i) => {
                                    let ImportSpecific {
                                        local, imported, ..
                                    } = i;
                                    let name = imported
                                        .map(|i| i.sym)
                                        .unwrap_or_else(|| local.sym.clone());
                                    let is_default = name == js_word!("default");

                                    self.scope.idents.insert(
                                        (local.sym.clone(), local.span.ctxt()),
                                        (import.src.value.clone(), name),
                                    );

                                    if is_default {
                                        self.scope
                                            .import_types
                                            .entry(import.src.value.clone())
                                            .or_insert(false);
                                    } else {
                                        self.scope
                                            .import_types
                                            .entry(import.src.value.clone())
                                            .and_modify(|v| *v = true);
                                    }
                                }
                            }
                        }
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(..)) => {
                    if !has_export {
                        // First export
                        has_export = true;

                        //  Object.defineProperty(exports, '__esModule', {
                        //       value: true
                        //  });
                        stmts.push(ModuleItem::Stmt(Stmt::Expr(box define_property(vec![
                            quote_ident!("exports").as_arg(),
                            Lit::Str(quote_str!("__esModule")).as_arg(),
                            ObjectLit {
                                span: DUMMY_SP,
                                props: vec![PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("value")),
                                    value: box Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    })
                                    .into(),
                                }))],
                            }
                            .as_arg(),
                        ]))));
                    }

                    macro_rules! init_default_export {
                        () => {{
                            if !has_default_export {
                                has_default_export = true;
                                // exports.default = void 0;
                                stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(member_expr!(
                                            DUMMY_SP,
                                            exports.default
                                        )),
                                        op: op!("="),
                                        right: undefined(DUMMY_SP),
                                    },
                                ))))
                            }
                        }};
                    }
                    match item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl::Fn(..),
                        )) => {
                            has_default_export = true;
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl::TsInterfaceDecl(..),
                        )) => {}

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..)) => {
                            init_default_export!()
                        }
                        _ => {}
                    }

                    /// Import src to export fomr it.
                    macro_rules! import {
                        ($src:expr) => {{
                            let ident = private_ident!(local_name_for_src(&$src));

                            if !self.scope.value.imports.contains_key(&$src.value) {
                                self.scope.value.imports.insert(
                                    $src.value.clone(),
                                    Some((ident.sym.clone(), ident.span)),
                                );
                            }

                            ident
                        }};
                    }

                    match item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export)) => {
                            let imported = import!(export.src);
                            // Object.keys(_foo).forEach(function (key) {
                            //   if (key === "default" || key === "__esModule") return;
                            //   Object.defineProperty(exports, key, {
                            //     enumerable: true,
                            //     get: function () {
                            //       return _foo[key];
                            //     }
                            //   });
                            // })

                            let key_ident = private_ident!("key");

                            let function = Function {
                                span: DUMMY_SP,
                                is_async: false,
                                is_generator: false,
                                decorators: Default::default(),
                                params: vec![Pat::Ident(key_ident.clone())],
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![
                                        Stmt::If(IfStmt {
                                            span: DUMMY_SP,
                                            // key === "default" || key === "__esModule"
                                            test: box key_ident
                                                .clone()
                                                .make_eq(Lit::Str(quote_str!("default")))
                                                .make_bin(
                                                    op!("||"),
                                                    key_ident.clone().make_eq(Lit::Str(
                                                        quote_str!("__esModule"),
                                                    )),
                                                ),
                                            cons: box Stmt::Return(ReturnStmt {
                                                span: DUMMY_SP,
                                                arg: None,
                                            }),
                                            alt: None,
                                        }),
                                        Stmt::Expr(box define_property(vec![
                                            quote_ident!("exports").as_arg(),
                                            key_ident.clone().as_arg(),
                                            make_descriptor(box Expr::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: imported.clone().as_obj(),
                                                prop: box key_ident.into(),
                                                computed: true,
                                            }))
                                            .as_arg(),
                                        ])),
                                    ],
                                }),
                                return_type: Default::default(),
                                type_params: Default::default(),
                            };

                            // We use extra_stmts because it should be placed *after* import
                            // statements.
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Call(
                                CallExpr {
                                    span: DUMMY_SP,
                                    // Object.keys(_foo).forEach
                                    callee: MemberExpr {
                                        span: DUMMY_SP,
                                        obj: CallExpr {
                                            span: DUMMY_SP,
                                            callee: member_expr!(DUMMY_SP, Object.keys).as_callee(),
                                            args: vec![imported.as_arg()],
                                            type_args: Default::default(),
                                        }
                                        .as_obj(),
                                        computed: false,
                                        prop: box Expr::Ident(quote_ident!("forEach")),
                                    }
                                    .as_callee(),
                                    args: vec![FnExpr {
                                        ident: None,
                                        function,
                                    }
                                    .as_arg()],
                                    type_args: Default::default(),
                                },
                            ))));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl @ Decl::Class(..)))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl @ Decl::Fn(..))) => {
                            let ident = match decl {
                                Decl::Class(ref c) => c.ident.clone(),
                                Decl::Fn(ref f) => f.ident.clone(),
                                _ => unreachable!(),
                            };

                            //
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(decl)));

                            extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: quote_ident!("exports").as_obj(),
                                        computed: false,
                                        prop: box Expr::Ident(ident.clone()),
                                    })),
                                    op: op!("="),
                                    right: box ident.into(),
                                },
                            ))));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..)) => {
                            //
                            extra_stmts.push(item.fold_with(self));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl)) => match decl {
                            ExportDefaultDecl::Class(ClassExpr { ident, class }) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(
                                    ClassDecl {
                                        ident: ident.clone(),
                                        class,
                                        declare: false,
                                    },
                                ))));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(member_expr!(
                                            DUMMY_SP,
                                            exports.default
                                        )),
                                        op: op!("="),
                                        right: box ident.into(),
                                    },
                                ))));
                            }
                            ExportDefaultDecl::Fn(FnExpr { ident, function }) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                    ident: ident.clone(),
                                    function,
                                    declare: false,
                                }))));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(member_expr!(
                                            DUMMY_SP,
                                            exports.default
                                        )),
                                        op: op!("="),
                                        right: box ident.into(),
                                    },
                                ))));
                            }
                            _ => extra_stmts.push(
                                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl))
                                    .fold_with(self),
                            ),
                        },

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(expr)) => {
                            let ident = private_ident!("_default");

                            // TODO: Optimization (when expr cannot throw, `exports.default =
                            // void 0` is not required)

                            // We use extra statements because of the initialzation
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident.clone()),
                                    init: Some(expr),
                                    definite: false,
                                }],
                                declare: false,
                            }))));
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(member_expr!(DUMMY_SP, exports.default)),
                                    op: op!("="),
                                    right: box ident.into(),
                                },
                            ))));
                        }

                        // export { foo } from 'foo';
                        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                            let imported = export.src.clone().map(|src| import!(src));

                            stmts.reserve(export.specifiers.len());

                            for ExportSpecifier { orig, exported, .. } in export.specifiers {
                                let is_export_default = match exported {
                                    Some(ref exported) => exported.sym == js_word!("default"),
                                    _ => orig.sym == js_word!("default"),
                                };
                                let is_import_default = orig.sym == js_word!("default");
                                if is_export_default {
                                    has_default_export = true;
                                }

                                if let Some(ref src) = export.src {
                                    if is_import_default {
                                        self.scope
                                            .import_types
                                            .entry(src.value.clone())
                                            .or_insert(false);
                                    }
                                }
                                let value = match imported {
                                    Some(ref imported) => box Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: imported.clone().as_obj(),
                                        computed: false,
                                        prop: box Expr::Ident(orig.clone()),
                                    }),
                                    None => box Expr::Ident(orig.clone()).fold_with(self),
                                };

                                stmts.push(ModuleItem::Stmt(Stmt::Expr(box define_property(
                                    vec![
                                        quote_ident!("exports").as_arg(),
                                        {
                                            // export { foo }
                                            //  -> 'foo'

                                            // export { foo as bar }
                                            //  -> 'bar'
                                            let i = exported.unwrap_or_else(|| orig);
                                            Lit::Str(quote_str!(i.span, i.sym)).as_arg()
                                        },
                                        make_descriptor(value).as_arg(),
                                    ],
                                ))));
                            }
                        }

                        _ => unreachable!(),
                    }
                }
                _ => extra_stmts.push(item.fold_with(self)),
            }
        }

        for (src, import) in self.scope.value.imports.drain() {
            let require = make_require_call(src.clone());

            match import {
                Some(import) => {
                    let ty = self.scope.value.import_types.get(&src);

                    let rhs = match ty {
                        Some(true) => {
                            self.helpers.interop_require_wildcard();
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("_interopRequireWildcard").as_callee(),
                                args: vec![require.as_arg()],
                                type_args: Default::default(),
                            })
                        }
                        Some(false) => {
                            self.helpers.interop_require_default();
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("_interopRequireDefault").as_callee(),
                                args: vec![require.as_arg()],
                                type_args: Default::default(),
                            })
                        }
                        _ => box require,
                    };

                    stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: import.1,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(Ident::new(import.0, import.1)),
                            init: Some(rhs),
                            definite: false,
                        }],
                        declare: false,
                    }))));
                }
                None => {
                    stmts.push(ModuleItem::Stmt(Stmt::Expr(box require)));
                }
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }
}

impl Fold<Expr> for CommonJs {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Ident(i) => {
                let v = self.scope.value.idents.get(&(i.sym.clone(), i.span.ctxt()));
                match v {
                    None => return Expr::Ident(i),
                    Some((src, prop)) => {
                        let (ident, span) = self
                            .scope
                            .value
                            .imports
                            .get(src)
                            .as_ref()
                            .unwrap()
                            .as_ref()
                            .unwrap();
                        Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: Ident::new(ident.clone(), *span).as_obj(),
                            prop: box Expr::Ident(Ident::new(prop.clone(), DUMMY_SP)),
                            computed: false,
                        })
                    }
                }
            }
            Expr::Member(e) => {
                if e.computed {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        prop: e.prop.fold_with(self),
                        ..e
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        ..e
                    })
                }
            }
            _ => expr.fold_children(self),
        }
    }
}

fn make_descriptor(get_expr: Box<Expr>) -> ObjectLit {
    let get_fn_body = Some(BlockStmt {
        span: DUMMY_SP,
        stmts: vec![Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(get_expr),
        })],
    });

    ObjectLit {
        span: DUMMY_SP,
        props: vec![
            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("enumerable")),
                value: box Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .into(),
            })),
            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("get")),
                value: box FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        decorators: Default::default(),
                        params: vec![],
                        body: get_fn_body,
                        return_type: Default::default(),
                        type_params: Default::default(),
                    },
                }
                .into(),
            })),
        ],
    }
}
