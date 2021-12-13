pub trait Plugin {
    type TypeScript: TypeScriptPlugin;

    fn typescript(&mut self) -> &mut Self::TypeScript;
}

pub trait TypeScriptPlugin {}

/// Implements all `*Plugin` traits.
#[derive(Debug, Clone, Copy)]
pub struct NoopPlugin;

impl Plugin for NoopPlugin {
    type TypeScript = Self;

    fn typescript(&mut self) -> &mut Self::TypeScript {
        self
    }
}

impl TypeScriptPlugin for NoopPlugin {}
