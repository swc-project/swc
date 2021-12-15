use crate::plugin::{internal::Sealed, TypeScriptPlugin};

#[derive(Debug, Clone, Default)]
pub struct StripPlugin {}

impl TypeScriptPlugin for StripPlugin {}

impl Sealed for StripPlugin {}
