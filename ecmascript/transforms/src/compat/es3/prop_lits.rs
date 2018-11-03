use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;

/// babel: `transform-property-literals`
///
/// # Input
/// ```js
/// var foo = {
///   // changed
///   "bar": function () {},
///   "1": function () {},
///
///   // not changed
///   "default": 1,
///   [a]: 2,
///   foo: 1
/// };
/// ```
///
/// # Output
/// ```js
/// var foo = {
///   bar: function () {},
///   1: function () {},
///
///   "default": 1,
///   [a]: 2,
///   foo: 1
/// };
/// ```
#[derive(Debug, Clone, Copy, Default)]
pub struct PropertyLiteral;

impl Fold<Expr> for PropertyLiteral {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        e
    }
}
