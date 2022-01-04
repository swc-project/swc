/// **Don't use this**
#[doc(hidden)]
pub extern crate abi_stable;
/// **Don't use this**
#[doc(hidden)]
pub extern crate swc_common;
/// Fix malloc.
extern crate swc_node_base;

use abi_stable::std_types::{RResult, RStr, RString};
use anyhow::Context;
use serde::de::DeserializeOwned;
/// Reexported for convenience.
pub use swc_plugin_js_api::*;

#[macro_export]
macro_rules! define_js_plugin {
    ($fn_name:ident) => {
        #[abi_stable::export_root_module]
        pub fn swc_library() -> $crate::SwcJsPluginRef {
            extern "C" fn swc_js_plugin(
                rt: $crate::swc_common::plugin::Runtime,
                config_json: $crate::abi_stable::std_types::RStr,
                ast: $crate::swc_ecma_plugin_ast::Program,
            ) -> $crate::abi_stable::std_types::RResult<
                $crate::swc_ecma_plugin_ast::Program,
                $crate::abi_stable::std_types::RString,
            > {
                $crate::invoke_js_plugin(rt, $fn_name, config_json, ast)
            }
            use $crate::abi_stable::prefix_type::PrefixTypeTrait;

            $crate::SwcJsPlugin {
                process_js: Some(swc_js_plugin),
            }
            .leak_into_prefix()
        }
    };
}
