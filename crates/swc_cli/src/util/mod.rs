pub(crate) mod trace;

pub(crate) static SWC_CORE_VERSION: &str =
    include_str!(concat!(env!("OUT_DIR"), "/core_semver_version.txt"));
