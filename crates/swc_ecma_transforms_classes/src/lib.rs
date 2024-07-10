#![deny(clippy::all)]

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;

#[macro_use]
pub mod macros;
pub mod super_field;

/// Creates
///
/// ```js
/// Child.__proto__ || Object.getPrototypeOf(Child)
/// ```
pub fn get_prototype_of(obj: Box<Expr>) -> Box<Expr> {
    CallExpr {
        span: DUMMY_SP,
        callee: helper!(get_prototype_of),
        args: vec![obj.as_arg()],
        ..Default::default()
    }
    .into()
}
