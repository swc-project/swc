use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;

/// babel: `transform-member-expression-literals`
///
/// # Input
/// ```js
/// obj["foo"] = "isValid";
///
/// obj.const = "isKeyword";
/// obj["var"] = "isKeyword";
/// ```
///
/// # Output
/// ```js
/// obj.foo = "isValid";
///
/// obj["const"] = "isKeyword";
/// obj["var"] = "isKeyword";
/// ```
#[derive(Debug, Clone, Copy, Default)]
pub(super) struct MemberExprLit;

impl Fold<MemberExpr> for MemberExprLit {
    fn fold(&mut self, e: MemberExpr) -> MemberExpr {
        let e = e.fold_children(self);

        e
    }
}
