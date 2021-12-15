use crate::plugin::{internal::Sealed, TypeScriptPlugin};

pub struct StripPlugin {}

impl TypeScriptPlugin for StripPlugin {}

impl Sealed for StripPlugin {}
