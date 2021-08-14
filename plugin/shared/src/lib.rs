use abi_stable::library::RootModule;
use abi_stable::package_version_strings;
use abi_stable::sabi_trait;
use abi_stable::sabi_types::VersionStrings;
use abi_stable::std_types::{RBox, RResult, RStr, RString};
use abi_stable::StableAbi;

#[repr(C)]
#[derive(StableAbi)]
#[sabi(kind(Prefix(prefix_ref = "SwcPluginRef")))]
#[sabi(missing_field(panic))]
pub struct SwcPlugin {
    pub get_js_ast_version: extern "C" fn() -> RString,

    #[sabi(last_prefix_field)]
    pub process_js:
        Option<extern "C" fn(config_str: RStr, ast_json: RStr) -> RResult<RString, RString>>,
}

impl RootModule for SwcPluginRef {
    abi_stable::declare_root_module_statics! {SwcPluginRef}

    const BASE_NAME: &'static str = "swc_plugin";
    const NAME: &'static str = "swc_plugin";
    const VERSION_STRINGS: VersionStrings = package_version_strings!();
}
