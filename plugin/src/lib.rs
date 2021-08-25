/// Reexported for convinience.
use abi_stable::{
    library::RootModule,
    package_version_strings,
    sabi_types::VersionStrings,
    std_types::{RResult, RStr, RString},
    StableAbi,
};

pub mod ecmascript {
    pub extern crate swc_ecma_ast as ast;
    pub extern crate swc_ecma_utils as utils;
    pub extern crate swc_ecma_visit as visit;
}

#[repr(C)]
#[derive(StableAbi)]
#[sabi(kind(Prefix(prefix_ref = "SwcPluginRef")))]
#[sabi(missing_field(panic))]
pub struct SwcPlugin {
    #[sabi(last_prefix_field)]
    pub process_js:
        Option<extern "C" fn(config_str: RStr, ast_json: RString) -> RResult<RString, RString>>,
}

impl RootModule for SwcPluginRef {
    abi_stable::declare_root_module_statics! {SwcPluginRef}

    const BASE_NAME: &'static str = "swc_plugin";
    const NAME: &'static str = "swc_plugin";
    const VERSION_STRINGS: VersionStrings = package_version_strings!();
}
