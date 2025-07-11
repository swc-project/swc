use preset_env_base::version::Version;

use crate::util::SwcFold;

pub static POSSIBLE_GLOBAL_OBJECTS: &[&str] = &["global", "globalThis", "self", "window"];

include!(concat!(env!("OUT_DIR"), "/corejs3_data/lib.rs"));

pub fn modules_by_version(query: &str) -> Option<Version> {
    let idx = DATA_INDEX.get(query)?;
    Some(VERSIONS[idx as usize])
}
