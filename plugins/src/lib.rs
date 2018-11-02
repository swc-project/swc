extern crate anymap;
extern crate swc_common;

use anymap::AnyMap;
use swc_common::{Fold};

/// Declare a SWC plugin.
/// 
/// # Note
/// 
/// This macro can only be invoked once per crate.
#[macro_export]
macro_rules! register_plugin {
    ($register:expr) => {
        #[doc(hidden)]
        pub mod __swc_plugins {
            #[no_mangle]
            pub extern "C" fn swc_register_plugin(registrar: &mut $crate::PluginRegistrar) {
                // enforce the desired function signature
                let register: fn(&mut $crate::PluginRegistrar) = $register;

                register(registrar);
            }
        }
    };
}

#[derive(Debug)]
pub struct PluginRegistrar {
    folders: AnyMap,
}

impl PluginRegistrar {
    pub fn new() -> PluginRegistrar {
        PluginRegistrar {
            folders: AnyMap::new(),
        }
    }

    pub fn register<A, F>(&mut self, folder: F) -> &mut Self
    where F: Fold<A> + 'static,
          A: 'static,
    {

        self.folders.entry::<Vec<Box<dyn Fold<A>>>>()
            .or_insert_with(Vec::new)
            .push(Box::new(folder));

        self
    }

    pub fn get<A: 'static>(&self) -> &[Box<dyn Fold<A>>] {
        self.folders.get::<Vec<Box<dyn Fold<A>>>>()
            .map(|folders| folders.as_slice())
            .unwrap_or(&[])
    }

    pub fn len(&self) -> usize {
        self.folders.len()
    }

    pub fn is_empty(&self) -> bool {
        self.folders.is_empty()
    }
}

impl Default for PluginRegistrar {
    fn default() -> PluginRegistrar {
        PluginRegistrar::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Foo;
    
    impl Fold<usize> for Foo {
        fn fold(&mut self, node: usize) -> usize {
            node
        }
    }

    #[test]
    fn insert_a_folder_and_get_it_back() {
        let mut registrar = PluginRegistrar::new();
        assert!(registrar.is_empty());

        registrar.register::<usize, _>(Foo);
        assert_eq!(registrar.len(), 1);

        let got = registrar.get::<usize>();
        assert_eq!(got.len(), 1);
    }
}