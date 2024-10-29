#![allow(clippy::boxed_local)]
#![allow(clippy::vec_box)]

use swc_ecma_ast::Pass;

pub use self::exponentiation::exponentiation;

mod exponentiation;

pub fn es2016() -> impl Pass {
    exponentiation()
}
