use abi_stable::{
    library::RootModule,
    package_version_strings,
    sabi_types::VersionStrings,
    std_types::{RResult, RStr, RString},
    StableAbi,
};

/// Don't use this directly.
#[repr(C)]
#[derive(StableAbi)]
#[sabi(kind(Prefix(prefix_ref = "SwcJsPluginRef")))]
#[sabi(missing_field(panic))]
pub struct SwcJsPlugin {
    #[sabi(last_prefix_field)]
    pub process_js: Option<
        extern "C" fn(
            rt: swc_common::plugin::Runtime,
            config_json: RStr,
            ast: swc_ecma_plugin_ast::Program,
        ) -> RResult<swc_ecma_plugin_ast::Program, RString>,
    >,
}

impl RootModule for SwcJsPluginRef {
    abi_stable::declare_root_module_statics! {SwcJsPluginRef}

    const BASE_NAME: &'static str = "swc_plugin";
    const NAME: &'static str = "swc_plugin";
    const VERSION_STRINGS: VersionStrings = package_version_strings!();
}
