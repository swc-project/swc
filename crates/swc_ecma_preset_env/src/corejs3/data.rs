use preset_env_base::version::Version;

use crate::util::SwcFold;

pub static POSSIBLE_GLOBAL_OBJECTS: &[&str] = &["global", "globalThis", "self", "window"];

include!(concat!(env!("OUT_DIR"), "/corejs3_data/lib.rs"));

pub fn modules_by_version(query: &str) -> Option<Version> {
    let idx = DATA_INDEX.get(query)?;
    Some(VERSIONS[idx as usize])
}

pub fn esnext_fallback(module: &str) -> Option<&'static str> {
    let base_name = module.strip_prefix("es.")?;
    let esnext_name = format!("esnext.{base_name}");

    let esnext_id = ESNEXT_FALLBACK_SET.get(esnext_name.as_str())?;
    let esnext_module = crate::util::PooledStr(esnext_id).as_str();

    if esnext_module == esnext_name {
        Some(esnext_module)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_esnext_fallback() {
        let result = esnext_fallback("es.object.group-by");
        assert_eq!(result, Some("esnext.object.group-by"));

        let result = esnext_fallback("es.nonexistent.module");
        assert_eq!(result, None);

        let result = esnext_fallback("esnext.object.group-by");
        assert_eq!(result, None);
    }
}
