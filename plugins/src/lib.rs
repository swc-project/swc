extern crate anymap;
extern crate libloading;
extern crate swc_common;

/// Declare a SWC plugin.
/// 
/// # Note
/// 
/// This macro can only be invoked once per crate.
#[macro_export]
macro_rules! register_plugin {
    ($register:expr) => {
        #[doc(hidden)]
        #[no_mangle]
        pub extern "C" fn swc_register_plugin(registrar: &mut $crate::Registrar) {
            let register: fn(&mut $crate::Registrar) = $register;

            register(registrar);
        }

        #[doc(hidden)]
        #[no_mangle]
        pub extern "C" fn swg_plugin_library_version() -> String {
            $crate::SWC_PLUGIN_VERSION.to_string()
        }
    };
}

mod registrar;
mod loader;

pub use registrar::Registrar;
pub use loader::Loader;

use std::io;

/// This crate's version, mainly for use in verifying plugin compatibility.
pub const SWC_PLUGIN_VERSION: &str = env!("CARGO_PKG_VERSION");


#[derive(Debug)]
pub enum PluginError {
    /// The operating system was unable to load the library.
    LibraryLoadingFailed(io::Error),
    /// Unable to find a required symbol.
    MissingSymbol(&'static str),
    MismatchedLibraryVersion,
}

impl From<io::Error> for PluginError {
    fn from(other: io::Error) -> PluginError {
        PluginError::LibraryLoadingFailed(other)
    }
}