use ast::*;
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith};

#[derive(Clone)]
pub struct InlineGlobals {
    pub envs: FxHashMap<JsWord, Expr>,
    pub globals: FxHashMap<JsWord, Expr>,
}

impl Fold<Expr> for InlineGlobals {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            Expr::Member(expr) => {
                if expr.computed {
                    Expr::Member(MemberExpr {
                        obj: expr.obj.fold_with(self),
                        prop: expr.prop.fold_with(self),
                        ..expr
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: expr.obj.fold_with(self),
                        ..expr
                    })
                }
            }
            _ => expr.fold_children(self),
        };

        match expr {
            Expr::Ident(Ident { ref sym, .. }) => {
                // It's ok because we don't recurse into member expressions.
                if let Some(value) = self.globals.get(sym) {
                    return value.clone().fold_with(self);
                } else {
                    expr
                }
            }
            Expr::Member(MemberExpr {
                span,
                obj:
                    ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                        obj:
                            ExprOrSuper::Expr(box Expr::Ident(Ident {
                                sym: js_word!("process"),
                                span: process_span,
                                ..
                            })),
                        prop:
                            box Expr::Ident(Ident {
                                sym: js_word!("env"),
                                span: env_span,
                                ..
                            }),
                        span: obj_span,
                        computed: obj_computed,
                    })),
                prop,
                computed,
            }) => match *prop {
                Expr::Ident(Ident { ref sym, .. }) => {
                    if let Some(env) = self.envs.get(sym) {
                        return env.clone();
                    }
                    return Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(box Expr::Ident(Ident::new(
                                js_word!("process"),
                                process_span,
                            ))),
                            prop: box Expr::Ident(Ident::new(js_word!("env"), env_span)),
                            span: obj_span,
                            computed: obj_computed,
                        })),
                        prop,
                        computed,
                    });
                }
                _ => unimplemented!("node.env.NONE-IDENT"),
            },
            _ => expr,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn mk_map(
        tester: &mut crate::tests::Tester,
        values: &[(&str, &str)],
        is_env: bool,
    ) -> FxHashMap<JsWord, Expr> {
        let mut m = FxHashMap::default();

        for (k, v) in values {
            let v = if is_env {
                format!("'{}'", v)
            } else {
                (*v).into()
            };

            let mut v = tester
                .apply_transform(
                    ::testing::DropSpan,
                    "global.js",
                    ::swc_ecma_parser::Syntax::default(),
                    &v,
                )
                .unwrap();
            assert_eq!(v.body.len(), 1);
            let v = match v.body.pop().unwrap() {
                ModuleItem::Stmt(Stmt::Expr(box expr)) => expr,
                _ => unreachable!(),
            };

            m.insert((*k).into(), v);
        }

        m
    }

    fn envs(tester: &mut crate::tests::Tester, values: &[(&str, &str)]) -> FxHashMap<JsWord, Expr> {
        mk_map(tester, values, true)
    }

    fn globals(
        tester: &mut crate::tests::Tester,
        values: &[(&str, &str)],
    ) -> FxHashMap<JsWord, Expr> {
        mk_map(tester, values, false)
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[]),
        },
        issue_215,
        r#"if (process.env.x === 'development') {}"#,
        r#"if (process.env.x === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| InlineGlobals {
            envs: envs(tester, &[("NODE_ENV", "development")]),
            globals: globals(tester, &[]),
        },
        node_env,
        r#"if (process.env.NODE_ENV === 'development') {}"#,
        r#"if ('development' === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[("__DEBUG__", "true")]),
        },
        inline_globals,
        r#"if (__DEBUG__) {}"#,
        r#"if (true) {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[("debug", "true")]),
        },
        non_global,
        r#"if (foo.debug) {}"#,
        r#"if (foo.debug) {}"#
    );
}
