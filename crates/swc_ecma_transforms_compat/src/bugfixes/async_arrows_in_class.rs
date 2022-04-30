use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::prepend;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, InjectVars};
use swc_trace_macro::swc_trace;

use crate::es2015::arrow;

/// Safari 10.3 had an issue where async arrow function expressions within any
/// class method would throw. After an initial fix, any references to the
/// instance via `this` within those methods would also throw. This is fixed by
/// converting arrow functions in class methods into equivalent function
/// expressions. See https://bugs.webkit.org/show_bug.cgi?id=166879
#[tracing::instrument(level = "info", skip_all)]
pub fn async_arrows_in_class() -> impl Fold {
    AsyncArrowsInClass::default()
}
#[derive(Default, Clone)]
struct AsyncArrowsInClass {
    in_class_method: bool,
    vars: Vec<VarDeclarator>,
}

/// TODO: VisitMut
#[swc_trace]
impl Fold for AsyncArrowsInClass {
    noop_fold_type!();

    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
        self.in_class_method = true;
        let res = n.fold_children_with(self);
        self.in_class_method = false;
        res
    }

    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        self.in_class_method = true;
        let res = n.fold_children_with(self);
        self.in_class_method = false;
        res
    }

    fn fold_expr(&mut self, n: Expr) -> Expr {
        let n = n.fold_children_with(self);
        if !self.in_class_method {
            return n;
        }

        match n {
            Expr::Arrow(ref a) => {
                if a.is_async {
                    let mut v = arrow();
                    let n = n.fold_with(&mut v);
                    self.vars.extend(v.take_vars());
                    n
                } else {
                    n
                }
            }
            _ => n,
        }
    }

    fn fold_module_items(&mut self, stmts: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = stmts.fold_children_with(self);
        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                }))),
            );
        }

        stmts
    }

    fn fold_stmts(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        let mut stmts = stmts.fold_children_with(self);
        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                })),
            );
        }

        stmts
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{chain, Mark};
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::test;

    use super::*;

    fn tr() -> impl Fold {
        chain!(
            resolver(Mark::new(), Mark::new(), false),
            async_arrows_in_class()
        )
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        async_arrows,
        r#"
        class Foo {
            constructor() {
                this.x = async () => await 1;
            }
            bar() {
                (async () => { })();
            }
        }"#,
        r#"
        class Foo {
            constructor() {
                this.x = async function () {
                    return await 1;
                };
            }

            bar() {
                (async function () {})();
            }
        }"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        callback,
        r#"
        class Foo {
            foo() {
                bar(async () => await 1);
            }
        }"#,
        r#"
        class Foo {
            foo() {
              bar(async function () {
                  return await 1;
              });
            }
        }"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        this,
        r#"
        class Foo {
            constructor() {
                this.x = () => async () => await this;
            }
        }"#,
        r#"
        class Foo {
            constructor() {
                var _this = this;
                this.x = () => async function () {
                    return await _this;
                };
            }
        }"#
    );

    // TODO: handle arguments and super. This isn't handled in general for arrow
    // functions atm...

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        non_async_arrow,
        r#"
        class Foo {
            constructor() {
                this.x = () => {};
            }
        }"#,
        r#"
        class Foo {
            constructor() {
                this.x = () => {};
            }
        }"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        non_class_async_arrow,
        "let x = async () => await 1;",
        "let x = async () => await 1;"
    );
}
