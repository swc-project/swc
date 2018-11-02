use swc_common::Fold;
use super::{Registrar, PluginError};
use libloading::Library;
use std::ffi::OsStr;

/// A plugin loader.
/// 
/// # Safety
/// 
/// Any dynamic libraries which are loaded will be kept in memory for as long as
/// the `Loader` is alive. Using a plugin after the `Loader` has been destroyed
/// (only possible with `unsafe` code) will almost certainly result in a crash
/// because you are trying to call code that's been unloaded from memory.
#[derive(Debug, Default)]
pub struct Loader {
    libraries: Vec<Library>,
    registrar: Registrar,
}

impl Loader {
    pub fn new() -> Loader {
        Loader::default()
    }

    /// Load a dynamic library as a plugin.
    /// 
    /// # A Note on Compatibility
    /// 
    /// Different versions of `rustc` aren't guaranteed to lay out 
    /// non-`#[repr(C)]` types the same way. This means a plugin can only be 
    /// loaded by `swc` if both the plugin and `swc` were compiled with the same
    /// compiler version.
    /// 
    /// The plugin also needs to be compiled against the same version of 
    /// `swc_plugin`.
    /// 
    /// Plugin loading will fail if there is a mismatch with either the `rustc`
    /// or `swc_plugin` versions.
    pub fn load_plugin<P: AsRef<OsStr>>(&mut self, path: P) -> Result<(), PluginError> {
        let path = path.as_ref();
        let lib = Library::new(path)?;

        let symbol_name = "swg_plugin_library_version\0";

        let compiled_swc_plugin_version = unsafe { 
            match lib.get(symbol_name.as_bytes()) {
                // extract the raw function pointer. This is safe because we're
                // only ever going to use it while "lib" is alive.
                Ok(symbol) => *symbol,
                Err(_) => return Err(PluginError::MissingSymbol(&symbol_name[..symbol_name.len()-2])),
            }
        };

        validate_library_version(compiled_swc_plugin_version)?;

        unimplemented!()
    }

    pub fn registrar(&mut self) -> &mut Registrar {
        &mut self.registrar
    }

    /// A convenience function for retrieving all registered implementations of 
    /// `Fold<A>`.
    pub fn get_mut<A: 'static>(&mut self) -> &mut [Box<dyn Fold<A>>] {
        self.registrar.get_mut()
    }
}

fn validate_library_version(func: extern "C" fn() -> &'static str) -> Result<(), PluginError> {
    if func() == super::SWC_PLUGIN_VERSION {
        Ok(())
    } else {
        Err(PluginError::MismatchedLibraryVersion)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // pretend this crate is a plugin for testing purposes. This gives us 
    // access to the generated code so we can manually verify the happy path.
    register_plugin!(|_| {});

    #[test]
    fn generated_version_is_always_compatible() {
        let generated = __swc_plugins::swg_plugin_library_version;

        // the generated function should always return the correct library 
        // version because we *are* the swc_plugins crate
        assert!(validate_library_version(generated).is_ok());
    }
}