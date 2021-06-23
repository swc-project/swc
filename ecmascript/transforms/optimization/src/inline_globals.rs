use std::collections::HashMap;
use swc_atoms::{js_word, JsWord};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub fn inline_globals(envs: HashMap<JsWord, Expr>, globals: HashMap<JsWord, Expr>) -> impl Fold {
    InlineGlobals { envs, globals }
}

struct InlineGlobals {
    envs: HashMap<JsWord, Expr>,
    globals: HashMap<JsWord, Expr>,
}

impl Fold for InlineGlobals {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
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
            _ => expr.fold_children_with(self),
        };

        match expr {
            Expr::Ident(Ident { ref sym, .. }) => {
                // It's ok because we don't recurse into member expressions.
                return if let Some(value) = self.globals.get(sym) {
                    value.clone().fold_with(self)
                } else {
                    expr
                };
            }
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(ref obj),
                ref prop,
                ..
            }) => match &**obj {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(first_obj),
                    prop: second_obj,
                    ..
                }) => match &**first_obj {
                    Expr::Ident(Ident {
                        sym: js_word!("process"),
                        ..
                    }) => match &**second_obj {
                        Expr::Ident(Ident {
                            sym: js_word!("env"),
                            ..
                        }) => match &**prop {
                            Expr::Lit(Lit::Str(Str { value: ref sym, .. }))
                            | Expr::Ident(Ident { ref sym, .. }) => {
                                if let Some(env) = self.envs.get(sym) {
                                    return env.clone();
                                }
                            }
                            _ => {}
                        },
                        _ => {}
                    },
                    _ => {}
                },
                _ => {}
            },
            _ => {}
        }

        expr
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;
    use swc_ecma_transforms_testing::Tester;
    use swc_ecma_utils::DropSpan;
    use swc_ecma_visit::as_folder;

    fn mk_map(
        tester: &mut Tester<'_>,
        values: &[(&str, &str)],
        is_env: bool,
    ) -> HashMap<JsWord, Expr> {
        let mut m = HashMap::default();

        for (k, v) in values {
            let v = if is_env {
                format!("'{}'", v)
            } else {
                (*v).into()
            };

            let mut v = tester
                .apply_transform(
                    as_folder(DropSpan {
                        preserve_ctxt: false,
                    }),
                    "global.js",
                    ::swc_ecma_parser::Syntax::default(),
                    &v,
                )
                .unwrap();
            assert_eq!(v.body.len(), 1);
            let v = match v.body.pop().unwrap() {
                ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) => *expr,
                _ => unreachable!(),
            };

            m.insert((*k).into(), v);
        }

        m
    }

    fn envs(tester: &mut Tester<'_>, values: &[(&str, &str)]) -> HashMap<JsWord, Expr> {
        mk_map(tester, values, true)
    }

    fn globals(tester: &mut Tester<'_>, values: &[(&str, &str)]) -> HashMap<JsWord, Expr> {
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

    test!(
        Default::default(),
        |tester| InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[]),
        },
        issue_417_1,
        "const test = process.env['x']",
        "const test = process.env['x']"
    );

    test!(
        Default::default(),
        |tester| InlineGlobals {
            envs: envs(tester, &[("x", "FOO")]),
            globals: globals(tester, &[]),
        },
        issue_417_2,
        "const test = process.env['x']",
        "const test = 'FOO'"
    );
}
