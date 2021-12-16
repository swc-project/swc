use crate::plugin::{internal::Sealed, TypeScriptPlugin};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Default)]
pub struct StripPlugin {}

impl TypeScriptPlugin for StripPlugin {
    type Type = ();
}

impl Sealed for StripPlugin {}
