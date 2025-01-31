use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    sync::Lrc,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{ParVisitMut, Parallel};
use swc_ecma_utils::{collect_decls, parallel::cpu_count, NodeIgnoringSpan};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

/// The key will be compared using [EqIgnoreSpan::eq_ignore_span], and matched
/// expressions will be replaced with the value.
pub type GlobalExprMap = Lrc<AHashMap<NodeIgnoringSpan<'static, Expr>, Expr>>;

/// Create a global inlining pass, which replaces expressions with the specified
/// value.
pub fn inline_globals(
    envs: Lrc<AHashMap<JsWord, Expr>>,
    globals: Lrc<AHashMap<JsWord, Expr>>,
    typeofs: Lrc<AHashMap<JsWord, JsWord>>,
) -> impl Pass {
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
) -> impl Pass {
    visit_mut_pass(InlineGlobals {
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
    global_exprs: Lrc<AHashMap<NodeIgnoringSpan<'static, Expr>, Expr>>,

    typeofs: Lrc<AHashMap<JsWord, JsWord>>,

    bindings: Lrc<AHashSet<Id>>,
}

impl Parallel for InlineGlobals {
    fn create(&self) -> Self {
        self.clone()
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for InlineGlobals {
    noop_visit_mut_type!(fail);

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.visit_mut_par(cpu_count(), members);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Ident(Ident { ref sym, ctxt, .. }) = expr {
            if self.bindings.contains(&(sym.clone(), *ctxt)) {
                return;
            }
        }

        if let Some(value) =
            Ident::within_ignored_ctxt(|| self.global_exprs.get(&NodeIgnoringSpan::borrowed(expr)))
        {
            *expr = value.clone();
            expr.visit_mut_with(self);
            return;
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
                    ctxt: arg_ctxt,
                    ..
                }) = &**arg
                {
                    if self.bindings.contains(&(sym.clone(), *arg_ctxt)) {
                        return;
                    }

                    // It's ok because we don't recurse into member expressions.
                    if let Some(value) = self.typeofs.get(sym).cloned() {
                        *expr = Lit::Str(Str {
                            span: *span,
                            raw: None,
                            value,
                        })
                        .into();
                    }
                }
            }

            Expr::Member(MemberExpr { obj, prop, .. }) => match &**obj {
                Expr::Member(MemberExpr {
                    obj: first_obj,
                    prop: inner_prop,
                    ..
                }) if inner_prop.is_ident_with("env") => {
                    if first_obj.is_ident_ref_to("process") {
                        match prop {
                            MemberProp::Computed(ComputedPropName { expr: c, .. }) => {
                                if let Expr::Lit(Lit::Str(Str { value: sym, .. })) = &**c {
                                    if let Some(env) = self.envs.get(sym) {
                                        *expr = env.clone();
                                    }
                                }
                            }

                            MemberProp::Ident(IdentName { sym, .. }) => {
                                if let Some(env) = self.envs.get(sym) {
                                    *expr = env.clone();
                                }
                            }
                            _ => {}
                        }
                    }
                }
                _ => (),
            },
            _ => {}
        }
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.visit_mut_par(cpu_count(), n);
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.visit_mut_par(cpu_count(), n);
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.bindings = Lrc::new(collect_decls(&*module));

        module.visit_mut_children_with(self);
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.visit_mut_par(cpu_count(), n);
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
                    key: PropName::Ident(i.clone().into()),
                    value,
                });
            }
        }
    }

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.visit_mut_par(cpu_count(), n);
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        self.bindings = Lrc::new(collect_decls(&*script));

        script.visit_mut_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::{test, Tester};
    use swc_ecma_utils::{DropSpan, StmtOrModuleItem};

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

            let v = tester
                .apply_transform(
                    visit_mut_pass(DropSpan),
                    "global.js",
                    ::swc_ecma_parser::Syntax::default(),
                    None,
                    &v,
                )
                .unwrap();

            let v = match v {
                Program::Module(mut m) => m.body.pop().and_then(|x| x.into_stmt().ok()),
                Program::Script(mut s) => s.body.pop(),
            };
            assert!(v.is_some());
            let v = match v.unwrap() {
                Stmt::Expr(ExprStmt { expr, .. }) => *expr,
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
        r#"if (process.env.NODE_ENV === 'development') {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| inline_globals(
            envs(tester, &[]),
            globals(tester, &[("__DEBUG__", "true")]),
            Default::default(),
        ),
        globals_simple,
        r#"if (__DEBUG__) {}"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| inline_globals(
            envs(tester, &[]),
            globals(tester, &[("debug", "true")]),
            Default::default(),
        ),
        non_global,
        r#"if (foo.debug) {}"#
    );

    test!(
        Default::default(),
        |tester| inline_globals(envs(tester, &[]), globals(tester, &[]), Default::default(),),
        issue_417_1,
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
        "const test = process.env['x']"
    );

    test!(
        Default::default(),
        |tester| inline_globals(
            envs(tester, &[("x", "BAR")]),
            globals(tester, &[]),
            Default::default(),
        ),
        issue_2499_1,
        "process.env.x = 'foo'"
    );
}
