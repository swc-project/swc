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

impl Fold<PropName> for PropertyLiteral {
    fn fold(&mut self, n: PropName) -> PropName {
        let n = n.fold_children(self);

        match n {
            PropName::Ident(ident) => {
                if ident.is_reserved_only_for_es3() {
                    return PropName::Str(Str {
                        value: ident.sym,
                        span: ident.span,
                        has_escape: false,
                    });
                } else {
                    PropName::Ident(ident)
                }
            }
            _ => n,
        }
    }
}
