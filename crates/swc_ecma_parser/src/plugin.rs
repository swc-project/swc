pub trait Plugin {
    type TypeScript: TypeScriptPlugin;
}

pub trait TypeScriptPlugin {}

/// Implements all `*Plugin` traits.
#[derive(Debug, Clone, Copy)]
pub struct NoopPlugin;

impl Plugin for NoopPlugin {
    type TypeScript = Self;
}

impl TypeScriptPlugin for NoopPlugin {}
