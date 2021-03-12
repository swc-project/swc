use crate::es2015::arrow;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

/// Safari 10.3 had an issue where async arrow function expressions within any
/// class method would throw. After an initial fix, any references to the
/// instance via `this` within those methods would also throw. This is fixed by
/// converting arrow functions in class methods into equivalent function
/// expressions. See https://bugs.webkit.org/show_bug.cgi?id=166879
pub fn async_arrows_in_class() -> impl Fold {
    AsyncArrowsInClass::default()
}
#[derive(Default, Clone, Copy)]
struct AsyncArrowsInClass {
    in_class_method: bool,
}

impl Fold for AsyncArrowsInClass {
    noop_fold_type!();

    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        self.in_class_method = true;
        let res = n.fold_children_with(self);
        self.in_class_method = false;
        res
    }

    fn fold_class_method(&mut self, n: ClassMethod) -> ClassMethod {
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
                    n.fold_with(&mut arrow())
                } else {
                    n
                }
            }
            _ => n,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| async_arrows_in_class(),
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
        |_| async_arrows_in_class(),
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
        |_| async_arrows_in_class(),
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
              this.x = () => (async function () {
                  return await this;
              }).bind(this);
            }
        }"#
    );

    // TODO: handle arguments and super. This isn't handled in general for arrow
    // functions atm...

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| async_arrows_in_class(),
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
        |_| async_arrows_in_class(),
        non_class_async_arrow,
        "let x = async () => await 1;",
        "let x = async () => await 1;"
    );
}
