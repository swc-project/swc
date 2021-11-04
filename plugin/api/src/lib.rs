use abi_stable::{
    library::RootModule,
    package_version_strings,
    sabi_types::VersionStrings,
    std_types::{RResult, RStr, RString, RVec},
    StableAbi,
};
use anyhow::{Context, Error};
use serde::{de::DeserializeOwned, Serialize};
use std::any::type_name;

pub fn serialize_ast<T>(t: &T) -> Result<Vec<u8>, Error>
where
    T: Serialize,
{
    serde_json::to_vec(t).with_context(|| {
        format!(
            "failed to serialize `{}` using serde_json",
            type_name::<T>()
        )
    })
}

pub fn deserialize_ast<T>(bytes: &[u8]) -> Result<T, Error>
where
    T: DeserializeOwned,
{
    serde_json::from_slice(bytes).with_context(|| {
        format!(
            "failed to deserialize `{}` using serde_json",
            type_name::<T>()
        )
    })
}

/// Don't use this directly.
#[repr(C)]
#[derive(StableAbi)]
#[sabi(kind(Prefix(prefix_ref = "SwcPluginRef")))]
#[sabi(missing_field(panic))]
pub struct SwcPlugin {
    #[sabi(last_prefix_field)]
    pub process_js: Option<
        extern "C" fn(
            rt: swc_common::plugin::Runtime,
            config_json: RStr,
            ast: RVec<u8>,
        ) -> RResult<RVec<u8>, RString>,
    >,
}

impl RootModule for SwcPluginRef {
    abi_stable::declare_root_module_statics! {SwcPluginRef}

    const BASE_NAME: &'static str = "swc_plugin";
    const NAME: &'static str = "swc_plugin";
    const VERSION_STRINGS: VersionStrings = package_version_strings!();
}
