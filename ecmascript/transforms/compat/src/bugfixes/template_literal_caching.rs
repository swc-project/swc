use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend, private_ident};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

// Converts destructured parameters with default values to non-shorthand syntax.
// This fixes the only Tagged Templates-related bug in ES Modules-supporting
// browsers (Safari 10 & 11).
//
// Bug 1: Safari 10/11 doesn't reliably return the same Strings value.
// The value changes depending on invocation and function optimization state.
//   function f() { return Object`` }
//   f() === new f()  // false, should be true.
//
// Bug 2: Safari 10/11 use the same cached strings value when the string parts
// are the same. This behavior comes from an earlier version of the spec, and
// can cause tricky bugs.
//   Object``===Object``  // true, should be false.
//
// Benchmarks: https://jsperf.com/compiled-tagged-template-performance
pub fn template_literal_caching() -> impl Fold {
    TemplateLiteralCaching::default()
}
#[derive(Default, Clone)]
struct TemplateLiteralCaching {
    decls: Vec<VarDeclarator>,
    helper_ident: Option<Ident>,
}

impl TemplateLiteralCaching {
    fn create_binding(&mut self, name: Ident, init: Option<Expr>) {
        let init = if let Some(init) = init {
            Some(Box::new(init))
        } else {
            None
        };
        self.decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent::from(name.clone())),
            init,
            definite: false,
        })
    }

    fn create_var_decl(&mut self) -> Option<Stmt> {
        if self.decls.len() > 0 {
            return Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                declare: false,
                decls: self.decls.clone(),
            })));
        }
        None
    }
}

impl Fold for TemplateLiteralCaching {
    noop_fold_type!();

    fn fold_expr(&mut self, n: Expr) -> Expr {
        let n = n.fold_children_with(self);
        match n {
            Expr::TaggedTpl(n) => {
                if self.helper_ident.is_none() {
                    // Create an identity function helper:
                    //   identity = t => t
                    let helper_ident = private_ident!("_");
                    let t = private_ident!("t");
                    self.helper_ident = Some(helper_ident.clone());
                    self.create_binding(
                        helper_ident.clone(),
                        Some(Expr::Arrow(ArrowExpr {
                            span: DUMMY_SP,
                            params: vec![Pat::Ident(BindingIdent::from(t.clone()))],
                            body: BlockStmtOrExpr::Expr(Box::new(Expr::Ident(t.clone()))),
                            is_async: false,
                            is_generator: false,
                            type_params: None,
                            return_type: None,
                        })),
                    )
                }

                let helper_ident = self.helper_ident.as_ref().unwrap();

                // Use the identity function helper to get a reference to the template's
                // Strings. We replace all expressions with `0` ensure Strings has
                // the same shape.   identity`a${0}`
                let template = TaggedTpl {
                    span: DUMMY_SP,
                    tag: Box::new(Expr::Ident(helper_ident.clone())),
                    tpl: Tpl {
                        span: DUMMY_SP,
                        quasis: n.tpl.quasis,
                        exprs: (&n.tpl.exprs)
                            .into_iter()
                            .map(|_| {
                                Box::new(Expr::Lit(Lit::Num(Number {
                                    span: DUMMY_SP,
                                    value: 0.0,
                                })))
                            })
                            .collect(),
                    },
                    type_params: None,
                };

                // Install an inline cache at the callsite using the global variable:
                //   _t || (_t = identity`a${0}`)
                let t = private_ident!("t");
                self.create_binding(t.clone(), None);
                let inline_cache = Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: BinaryOp::LogicalOr,
                    left: Box::new(Expr::Ident(t.clone())),
                    right: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(BindingIdent::from(t.clone())))),
                        right: Box::new(Expr::TaggedTpl(template)),
                    })),
                });

                // The original tag function becomes a plain function call.
                // The expressions omitted from the cached Strings tag are
                // directly applied as arguments.
                //   tag(_t || (_t = Object`a${0}`), 'hello')
                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: ExprOrSuper::Expr(n.tag),
                    args: vec![ExprOrSpread {
                        expr: Box::new(inline_cache),
                        spread: None,
                    }]
                    .into_iter()
                    .chain(
                        n.tpl
                            .exprs
                            .into_iter()
                            .map(|expr| ExprOrSpread { expr, spread: None }),
                    )
                    .collect(),
                    type_args: None,
                })
            }
            _ => n,
        }
    }

    fn fold_module(&mut self, n: Module) -> Module {
        let mut body = n.body.fold_children_with(self);
        if let Some(var) = self.create_var_decl() {
            prepend(&mut body, ModuleItem::Stmt(var))
        }

        Module { body, ..n }
    }

    fn fold_script(&mut self, n: Script) -> Script {
        let mut body = n.body.fold_children_with(self);
        if let Some(var) = self.create_var_decl() {
            prepend(&mut body, var)
        }

        Script { body, ..n }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        single_tag,
        "t`a`;",
        r#"
        let _ = t => t, t1;
        t(t1 || (t1 = _`a`));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        single_tag_empty,
        "x``;",
        r#"
        let _ = t => t, t;
        x(t || (t = _``));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        multiple_tags,
        r#"
        t`a`;
        x``;
        "#,
        r#"
        let _ = t => t, t2, t1;
        t(t2 || (t2 = _`a`));
        x(t1 || (t1 = _``));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        function_scoped_tag,
        "const f = t => t`a`;",
        r#"
        let _ = t => t, t;
        const f = t1 => t1(t || (t = _`a`));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        dynamic_tag,
        "fn()``;",
        r#"
        let _ = t => t, t;
        fn()(t || (t = _``));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        dynamic_expressions,
        "const f = t => t`a${1}b${t}${[\"hello\"]}`;",
        r#"
        let _ = t => t, t;
        const f = t1 => t1(t || (t = _`a${0}b${0}${0}`), 1, t1, ["hello"]);
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        same_tag_safari_11,
        "x`a` === x`a`;",
        r#"
        let _ = t => t, t, t1;
        x(t || (t = _`a`)) === x(t1 || (t1 = _`a`));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        shared_strings_safari_11,
        "x`a` === y`a`;",
        r#"
        let _ = t => t, t, t1;
        x(t || (t = _`a`)) === y(t1 || (t1 = _`a`));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        template_literals,
        r#"
        `a`;
        t(`a`);
        t;
        `a`;
        "#,
        r#"
        `a`;
        t(`a`);
        t;
        `a`;
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        prevent_tag_collision,
        r#"
        const _ = 1;
        t``;
        "#,
        r#"
        let _ = t => t, t1;

        const _1 = 1;
        t(t1 || (t1 = _``));
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| template_literal_caching(),
        block_scoped_tag,
        "for (let t of []) t`a`;",
        r#"
        let _ = t => t, t;
        for (let t1 of []) t1(t || (t = _`a`));
        "#
    );
}
