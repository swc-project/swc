#![allow(clippy::boxed_local)]
#![allow(clippy::vec_box)]

use swc_ecma_visit::Fold;

pub use self::exponentiation::exponentiation;

mod exponentiation;

pub fn es2016() -> impl Fold {
    exponentiation()
}
