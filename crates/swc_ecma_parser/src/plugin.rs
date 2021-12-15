use self::internal::Sealed;

/// This trait is sealed for now because the author (@kdy1) is not sure what is
/// possible with parser plugin api.
pub trait Plugin: Sized + Clone + Sealed {
    type TypeScript: TypeScriptPlugin;

    fn typescript(&mut self) -> &mut Self::TypeScript;
}

pub(crate) mod internal {
    pub trait Sealed {}
}

pub trait TypeScriptPlugin: Sized + Clone + Sealed {}

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

impl Sealed for NoopPlugin {}

#[derive(Debug, Clone, Default)]
pub struct Plugins<T> {
    pub typescript: T,
}

impl<T> Plugin for Plugins<T>
where
    T: TypeScriptPlugin,
{
    type TypeScript = T;

    fn typescript(&mut self) -> &mut Self::TypeScript {
        todo!()
    }
}

impl<T> Sealed for Plugins<T> {}
