use crate::plugin::{internal::Sealed, TypeScriptPlugin};

#[derive(Debug, Clone, Default)]
pub struct StripPlugin {}

impl TypeScriptPlugin for StripPlugin {
    type Type = ();
}

impl Sealed for StripPlugin {}
