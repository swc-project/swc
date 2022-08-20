//! Module for implicitly copyable types.

use swc_atoms::JsWord;
use swc_ecma_ast::*;

use self::private::Sealed;

/// Noop
pub trait ImplicitClone: Clone {
    fn clone_quote_var(&self) -> Self {
        self.clone()
    }
}

impl<T: Clone> ImplicitClone for T {}
