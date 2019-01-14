pub use self::exponentation::exponentation;
use crate::pass::Pass;
use ast::Module;
use swc_common::Fold;

mod exponentation;

pub fn es2016() -> impl Pass {
    exponentation()
}
