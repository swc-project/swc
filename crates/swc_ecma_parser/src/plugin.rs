/// Clone must be cheap.
pub trait Plugin: Sized + Clone {
    type TypeScript: TypeScriptPlugin;

    fn typescript(&mut self) -> &mut Self::TypeScript;
}

pub trait TypeScriptPlugin: Sized {}

/// Implements all `*Plugin` traits.
#[derive(Debug, Default, Clone, Copy)]
pub struct NoopPlugin;

impl Plugin for NoopPlugin {
    type TypeScript = Self;

    fn typescript(&mut self) -> &mut Self::TypeScript {
        self
    }
}

impl TypeScriptPlugin for NoopPlugin {}
