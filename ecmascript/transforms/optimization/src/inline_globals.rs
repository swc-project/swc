use std::collections::HashMap;
use swc_atoms::{js_word, JsWord};
use swc_common::collections::AHashSet;
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls, Id};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn inline_globals(
    envs: HashMap<JsWord, Expr>,
    globals: HashMap<JsWord, Expr>,
) -> impl Fold + VisitMut {
    as_folder(InlineGlobals {
        envs,
        globals,
        bindings: Default::default(),
    })
}

struct InlineGlobals {
    envs: HashMap<JsWord, Expr>,
    globals: HashMap<JsWord, Expr>,

    bindings: AHashSet<Id>,
}

impl VisitMut for InlineGlobals {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Ident(Ident { ref sym, span, .. }) => {
                if self.bindings.contains(&(sym.clone(), span.ctxt)) {
                    return;
                }

                // It's ok because we don't recurse into member expressions.
                if let Some(value) = self.globals.get(sym) {
                    let mut value = value.clone();
                    value.visit_mut_with(self);
                    *expr = value;
                }

                return;
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
                                    *expr = env.clone();
                                    return;
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
    }

    fn visit_mut_member_expr(&mut self, expr: &mut MemberExpr) {
        expr.obj.visit_mut_with(self);

        if expr.computed {
            expr.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.bindings.extend(collect_decls(&*module));

        module.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        self.bindings.extend(collect_decls(&*script));

        script.visit_mut_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::{test, Tester};
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
        |tester| as_folder(InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[]),
            bindings: Default::default()
        }),
        issue_215,
        r#"if (process.env.x === 'development') {}"#,
        r#"if (process.env.x === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| as_folder(InlineGlobals {
            envs: envs(tester, &[("NODE_ENV", "development")]),
            globals: globals(tester, &[]),
            bindings: Default::default()
        }),
        node_env,
        r#"if (process.env.NODE_ENV === 'development') {}"#,
        r#"if ('development' === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| as_folder(InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[("__DEBUG__", "true")]),
            bindings: Default::default()
        }),
        inline_globals,
        r#"if (__DEBUG__) {}"#,
        r#"if (true) {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| as_folder(InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[("debug", "true")]),
            bindings: Default::default()
        }),
        non_global,
        r#"if (foo.debug) {}"#,
        r#"if (foo.debug) {}"#
    );

    test!(
        Default::default(),
        |tester| as_folder(InlineGlobals {
            envs: envs(tester, &[]),
            globals: globals(tester, &[]),
            bindings: Default::default()
        }),
        issue_417_1,
        "const test = process.env['x']",
        "const test = process.env['x']"
    );

    test!(
        Default::default(),
        |tester| as_folder(InlineGlobals {
            envs: envs(tester, &[("x", "FOO")]),
            globals: globals(tester, &[]),
            bindings: Default::default()
        }),
        issue_417_2,
        "const test = process.env['x']",
        "const test = 'FOO'"
    );
}
