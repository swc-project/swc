/// Reexported for convinience.
pub extern crate swc_ecmascript as ecmascript;

use abi_stable::{
    library::RootModule,
    package_version_strings, sabi_trait,
    sabi_types::VersionStrings,
    std_types::{RBox, RResult, RStr, RString},
    StableAbi,
};

#[repr(C)]
#[derive(StableAbi)]
#[sabi(kind(Prefix(prefix_ref = "SwcPluginRef")))]
#[sabi(missing_field(panic))]
pub struct SwcPlugin {
    pub get_js_ast_version: extern "C" fn() -> RString,

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
