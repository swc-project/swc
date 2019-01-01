use ast::*;
use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith};

pub struct InlineGlobals {
    pub envs: HashMap<JsWord, Expr>,
    pub globals: HashMap<JsWord, Expr>,
}

impl Fold<Expr> for InlineGlobals {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            // Don't recurese into member expression.
            Expr::Member(..) => expr,
            _ => expr.fold_children(self),
        };

        match expr {
            Expr::Ident(Ident { ref sym, .. }) => {
                // It's ok because we don't recurse into member expressions.
                if let Some(value) = self.globals.get(sym) {
                    return value.clone();
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
                                ..
                            })),
                        prop:
                            box Expr::Ident(Ident {
                                sym: js_word!("env"),
                                ..
                            }),
                        span: _,
                        computed: _,
                    })),
                prop,
                computed: _,
            }) => match *prop {
                Expr::Ident(Ident { ref sym, .. }) => {
                    if let Some(env) = self.envs.get(sym) {
                        return env.clone();
                    }
                    return Expr::Lit(Lit::Str(Str {
                        value: js_word!(""),
                        span,
                        has_escape: false,
                    }));
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

    fn mk_map(values: &[(&str, &str)], is_env: bool) -> HashMap<JsWord, Expr> {
        let mut m = HashMap::new();

        crate::tests::Tester::run(|tester| {
            for (k, v) in values {
                let v = if is_env {
                    format!("'{}'", v)
                } else {
                    (*v).into()
                };

                let mut v = tester.apply_transform(
                    ::testing::DropSpan,
                    "global.js",
                    ::swc_ecma_parser::Syntax::Es,
                    &v,
                )?;
                assert_eq!(v.body.len(), 1);
                let v = match v.body.pop().unwrap() {
                    ModuleItem::Stmt(Stmt::Expr(box expr)) => expr,
                    _ => unreachable!(),
                };

                m.insert((*k).into(), v);
            }

            Ok(())
        });

        m
    }

    fn envs(values: &[(&str, &str)]) -> HashMap<JsWord, Expr> {
        mk_map(values, true)
    }

    fn globals(values: &[(&str, &str)]) -> HashMap<JsWord, Expr> {
        mk_map(values, false)
    }

    test!(
        ::swc_ecma_parser::Syntax::Es,
        InlineGlobals {
            envs: envs(&[("NODE_ENV", "development")]),
            globals: globals(&[]),
        },
        node_env,
        r#"if (process.env.NODE_ENV === 'development') {}"#,
        r#"if ('development' === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::Es,
        InlineGlobals {
            envs: envs(&[]),
            globals: globals(&[("__DEBUG__", "true")]),
        },
        inline_globals,
        r#"if (__DEBUG__) {}"#,
        r#"if (true) {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::Es,
        InlineGlobals {
            envs: envs(&[]),
            globals: globals(&[("debug", "true")]),
        },
        non_global,
        r#"if (foo.debug) {}"#,
        r#"if (foo.debug) {}"#
    );
}
