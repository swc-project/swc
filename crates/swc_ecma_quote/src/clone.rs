//! Module for implicitly copyable types.

use swc_atoms::JsWord;
use swc_ecma_ast::*;

use self::private::Sealed;

/// Not a public API.
///
/// Implemented for types which will be implicitly cloned when used as a
/// variable in [crate::quote] macro calls.
pub trait ImplicitClone: Clone + Sealed {
    fn clone_quote_var(&self) -> Self {
        self.clone()
    }
}

macro_rules! impl_for {
    ($T:ty) => {
        impl ImplicitClone for $T {}
        impl Sealed for $T {}
    };
}

impl_for!(Id);
impl_for!(Ident);
impl_for!(JsWord);

impl_for!(Str);
impl_for!(Number);
impl_for!(Bool);

mod private {
    pub trait Sealed {}
}
