use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    sync::Lrc,
    EqIgnoreSpan,
};
use swc_ecma_ast::*;
use swc_ecma_utils::collect_decls;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

/// The key will be compared using [EqIgnoreSpan::eq_ignore_span], and matched
/// expressions will be replaced with the value.
pub type GlobalExprMap = Lrc<Vec<(Expr, Expr)>>;

/// Create a global inlining pass, which replaces expressions with the specified
/// value.
pub fn inline_globals(
    envs: Lrc<AHashMap<JsWord, Expr>>,
    globals: Lrc<AHashMap<JsWord, Expr>>,
    typeofs: Lrc<AHashMap<JsWord, JsWord>>,
) -> impl Fold + VisitMut {
    inline_globals2(envs, globals, Default::default(), typeofs)
}

/// Create a global inlining pass, which replaces expressions with the specified
/// value.
///
/// See [GlobalExprMap] for description.
///
/// Note: Values specified in `global_exprs` have higher precedence than
pub fn inline_globals2(
    envs: Lrc<AHashMap<JsWord, Expr>>,
    globals: Lrc<AHashMap<JsWord, Expr>>,
    global_exprs: GlobalExprMap,
    typeofs: Lrc<AHashMap<JsWord, JsWord>>,
) -> impl Fold + VisitMut {
    as_folder(InlineGlobals {
        envs,
        globals,
        global_exprs,
        typeofs,
        bindings: Default::default(),
    })
}

#[derive(Clone)]
struct InlineGlobals {
    envs: Lrc<AHashMap<JsWord, Expr>>,
    globals: Lrc<AHashMap<JsWord, Expr>>,
    global_exprs: GlobalExprMap,

    typeofs: Lrc<AHashMap<JsWord, JsWord>>,

    bindings: Lrc<AHashSet<Id>>,
}

impl VisitMut for InlineGlobals {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        n.right.visit_mut_with(self);

        match &mut n.left {
            PatOrExpr::Expr(l) => {
                (&mut **l).visit_mut_children_with(self);
            }
            PatOrExpr::Pat(l) => match &mut **l {
                Pat::Expr(l) => {
                    (&mut **l).visit_mut_children_with(self);
                }
                _ => {
                    l.visit_mut_with(self);
                }
            },
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Ident(Ident { ref sym, span, .. }) = expr {
            if self.bindings.contains(&(sym.clone(), span.ctxt)) {
                return;
            }
        }

        for (key, value) in self.global_exprs.iter() {
            if Ident::within_ignored_ctxt(|| key.eq_ignore_span(&*expr)) {
                *expr = value.clone();
                expr.visit_mut_with(self);
                return;
            }
        }

        expr.visit_mut_children_with(self);

        match expr {
            Expr::Ident(Ident { ref sym, .. }) => {
                // It's ok because we don't recurse into member expressions.
                if let Some(value) = self.globals.get(sym) {
                    let mut value = value.clone();
                    value.visit_mut_with(self);
                    *expr = value;
                }
            }

            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
                ..
            }) => {
                if let Expr::Ident(Ident {
                    ref sym,
                    span: arg_span,
                    ..
                }) = &**arg
                {
                    if self.bindings.contains(&(sym.clone(), arg_span.ctxt)) {
                        return;
                    }

                    // It's ok because we don't recurse into member expressions.
                    if let Some(value) = self.typeofs.get(sym).cloned() {
                        *expr = Expr::Lit(Lit::Str(Str {
                            span: *span,
                            raw: None,
                            value,
                        }));
                    }
                }
            }

            Expr::Member(MemberExpr { obj, prop, .. }) => {
                if let Expr::Member(MemberExpr {
                    obj: first_obj,
                    prop:
                        MemberProp::Ident(Ident {
                            sym: js_word!("env"),
                            ..
                        }),
                    ..
                }) = &**obj
                {
                    if let Expr::Ident(Ident {
                        sym: js_word!("process"),
                        ..
                    }) = &**first_obj
                    {
                        match prop {
                            MemberProp::Computed(ComputedPropName { expr: c, .. }) => {
                                if let Expr::Lit(Lit::Str(Str { value: sym, .. })) = &**c {
                                    if let Some(env) = self.envs.get(sym) {
                                        *expr = env.clone();
                                    }
                                }
                            }

                            MemberProp::Ident(Ident { sym, .. }) => {
                                if let Some(env) = self.envs.get(sym) {
                                    *expr = env.clone();
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
            _ => {}
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.bindings = Lrc::new(collect_decls(&*module));

        module.visit_mut_children_with(self);
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = p {
            if self.bindings.contains(&i.to_id()) {
                return;
            }

            // It's ok because we don't recurse into member expressions.
            if let Some(mut value) = self.globals.get(&i.sym).cloned().map(Box::new) {
                value.visit_mut_with(self);
                *p = Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(i.clone()),
                    value,
                });
            }
        }
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        self.bindings = Lrc::new(collect_decls(&*script));

        script.visit_mut_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::{test, Tester};
    use swc_ecma_utils::DropSpan;
    use swc_ecma_visit::as_folder;

    use super::*;

    fn mk_map(
        tester: &mut Tester<'_>,
        values: &[(&str, &str)],
        is_env: bool,
    ) -> AHashMap<JsWord, Expr> {
        let mut m = AHashMap::default();

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

    fn envs(tester: &mut Tester<'_>, values: &[(&str, &str)]) -> Lrc<AHashMap<JsWord, Expr>> {
        Lrc::new(mk_map(tester, values, true))
    }

    fn globals(tester: &mut Tester<'_>, values: &[(&str, &str)]) -> Lrc<AHashMap<JsWord, Expr>> {
        Lrc::new(mk_map(tester, values, false))
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| inline_globals(envs(tester, &[]), globals(tester, &[]), Default::default(),),
        issue_215,
        r#"if (process.env.x === 'development') {}"#,
        r#"if (process.env.x === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| inline_globals(
            envs(tester, &[("NODE_ENV", "development")]),
            globals(tester, &[]),
            Default::default(),
        ),
        node_env,
        r#"if (process.env.NODE_ENV === 'development') {}"#,
        r#"if ('development' === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| inline_globals(
            envs(tester, &[]),
            globals(tester, &[("__DEBUG__", "true")]),
            Default::default(),
        ),
        globals_simple,
        r#"if (__DEBUG__) {}"#,
        r#"if (true) {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| inline_globals(
            envs(tester, &[]),
            globals(tester, &[("debug", "true")]),
            Default::default(),
        ),
        non_global,
        r#"if (foo.debug) {}"#,
        r#"if (foo.debug) {}"#
    );

    test!(
        Default::default(),
        |tester| inline_globals(envs(tester, &[]), globals(tester, &[]), Default::default(),),
        issue_417_1,
        "const test = process.env['x']",
        "const test = process.env['x']"
    );

    test!(
        Default::default(),
        |tester| inline_globals(
            envs(tester, &[("x", "FOO")]),
            globals(tester, &[]),
            Default::default(),
        ),
        issue_417_2,
        "const test = process.env['x']",
        "const test = 'FOO'"
    );

    test!(
        Default::default(),
        |tester| inline_globals(
            envs(tester, &[("x", "BAR")]),
            globals(tester, &[]),
            Default::default(),
        ),
        issue_2499_1,
        "process.env.x = 'foo'",
        "process.env.x = 'foo'"
    );
}
