pub use self::exponentation::Exponentation;
use swc_common::Fold;
use swc_ecma_ast::Module;

mod exponentation;

pub fn es2016() -> impl Fold<Module> {
    Exponentation
}
