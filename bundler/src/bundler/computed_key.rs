use super::load::TransformedModule;
use crate::{Bundler, Load, Resolve};
use anyhow::Error;
use swc_ecma_ast::Module;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    //  Converts
    ///
    /// ```ts
    /// export const arr = [1, 2, 3];
    /// ```
    ///
    /// to
    ///
    /// ```ts
    /// const _mod = (function(){
    ///     const arr = [1, 2, 3];
    ///     return {
    ///         arr,
    ///     };
    /// })();
    /// ```
    #[allow(dead_code)]
    pub(super) fn wrap_esm_as_a_var(
        &self,
        info: &TransformedModule,
        module: Module,
    ) -> Result<Module, Error> {
        unimplemented!("wrap_esm_as_a_var")
    }
}
