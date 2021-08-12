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
    pub new_js_transform: extern "C" fn() -> JsTransformBox,
}

impl RootModule for SwcPluginRef {
    abi_stable::declare_root_module_statics! {SwcPluginRef}

    const BASE_NAME: &'static str = "swc_plugin";
    const NAME: &'static str = "swc_plugin";
    const VERSION_STRINGS: VersionStrings = package_version_strings!();
}

#[sabi_trait]
pub trait JsTransform {
    /// Should return ast as json string,
    fn process(&mut self, config_str: RStr, ast_json: RStr) -> RResult<RString, RString>;
}

pub type JsTransformBox = JsTransform_TO<'static, RBox<()>>;
