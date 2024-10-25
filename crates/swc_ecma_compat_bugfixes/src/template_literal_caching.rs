use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmt, private_ident, ExprFactory};
use swc_ecma_visit::{fold_pass, standard_only_fold, Fold, FoldWith};
use swc_trace_macro::swc_trace;

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
pub fn template_literal_caching() -> impl Pass {
    fold_pass(TemplateLiteralCaching::default())
}
#[derive(Default, Clone)]
struct TemplateLiteralCaching {
    decls: Vec<VarDeclarator>,
    helper_ident: Option<Ident>,
}

impl TemplateLiteralCaching {
    fn create_binding(&mut self, name: Ident, init: Option<Expr>) {
        let init = init.map(Box::new);
        self.decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: name.into(),
            init,
            definite: false,
        })
    }

    fn create_var_decl(&mut self) -> Option<Stmt> {
        if !self.decls.is_empty() {
            return Some(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: self.decls.clone(),
                    ..Default::default()
                }
                .into(),
            );
        }
        None
    }
}

/// TODO: VisitMut
#[swc_trace]
impl Fold for TemplateLiteralCaching {
    standard_only_fold!();

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
                        helper_ident,
                        Some(
                            ArrowExpr {
                                span: DUMMY_SP,
                                params: vec![t.clone().into()],
                                body: Box::new(BlockStmtOrExpr::Expr(t.into())),
                                is_async: false,
                                is_generator: false,
                                ..Default::default()
                            }
                            .into(),
                        ),
                    )
                }

                let helper_ident = self.helper_ident.as_ref().unwrap();

                // Use the identity function helper to get a reference to the template's
                // Strings. We replace all expressions with `0` ensure Strings has
                // the same shape.   identity`a${0}`
                let template = TaggedTpl {
                    span: DUMMY_SP,
                    tag: helper_ident.clone().into(),
                    tpl: Box::new(Tpl {
                        span: DUMMY_SP,
                        quasis: n.tpl.quasis,
                        exprs: n.tpl.exprs.iter().map(|_| 0.0.into()).collect(),
                    }),
                    ..Default::default()
                };

                // Install an inline cache at the callsite using the global variable:
                //   _t || (_t = identity`a${0}`)
                let t = private_ident!("t");
                self.create_binding(t.clone(), None);
                let inline_cache: Expr = BinExpr {
                    span: DUMMY_SP,
                    op: op!("||"),
                    left: t.clone().into(),
                    right: AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: t.into(),
                        right: Box::new(Expr::TaggedTpl(template)),
                    }
                    .into(),
                }
                .into();

                // The original tag function becomes a plain function call.
                // The expressions omitted from the cached Strings tag are
                // directly applied as arguments.
                //   tag(_t || (_t = Object`a${0}`), 'hello')
                CallExpr {
                    span: DUMMY_SP,
                    callee: n.tag.as_callee(),
                    args: vec![inline_cache.as_arg()]
                        .into_iter()
                        .chain(n.tpl.exprs.into_iter().map(|expr| expr.as_arg()))
                        .collect(),
                    ..Default::default()
                }
                .into()
            }
            _ => n,
        }
    }

    fn fold_module(&mut self, n: Module) -> Module {
        let mut body = n.body.fold_children_with(self);
        if let Some(var) = self.create_var_decl() {
            prepend_stmt(&mut body, var.into())
        }

        Module { body, ..n }
    }

    fn fold_script(&mut self, n: Script) -> Script {
        let mut body = n.body.fold_children_with(self);
        if let Some(var) = self.create_var_decl() {
            prepend_stmt(&mut body, var)
        }

        Script { body, ..n }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::Mark;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::test;

    use super::*;

    fn tr() -> impl Pass {
        (
            resolver(Mark::new(), Mark::new(), false),
            template_literal_caching(),
        )
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        single_tag,
        "t`a`;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        single_tag_empty,
        "x``;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        multiple_tags,
        r#"
        t`a`;
        x``;
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        function_scoped_tag,
        "const f = t => t`a`;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        dynamic_tag,
        "fn()``;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        dynamic_expressions,
        "const f = t => t`a${1}b${t}${[\"hello\"]}`;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        same_tag_safari_11,
        "x`a` === x`a`;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        shared_strings_safari_11,
        "x`a` === y`a`;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        template_literals,
        r#"
        `a`;
        t(`a`);
        t;
        `a`;
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        prevent_tag_collision,
        r#"
        const _ = 1;
        t``;
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        block_scoped_tag,
        "for (let t of []) t`a`;"
    );
}
