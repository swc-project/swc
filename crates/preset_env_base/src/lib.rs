//! Base crate for `preset-env`-like crates.
//!
//! This crate provides an interface to convert `browserslist` query to
//! something usable.

use anyhow::Error;
use serde::{Deserialize, Serialize};
use st_map::StaticMap;

use self::version::Version;

pub mod query;
pub mod version;

/// A map without allocation.
#[derive(Debug, Default, Deserialize, Clone, Copy, Serialize, StaticMap, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
pub struct BrowserData<T: Default> {
    #[serde(default)]
    pub chrome: T,
    #[serde(default, rename = "chrome-android")]
    pub chrome_android: T,
    #[serde(default, rename = "firefox-android")]
    pub firerfox_android: T,
    #[serde(default, rename = "opera-android")]
    pub opera_android: T,

    #[serde(default)]
    pub quest: T,
    #[serde(default, rename = "react-native")]
    pub react_native: T,

    #[serde(default)]
    pub and_chr: T,
    #[serde(default)]
    pub and_ff: T,
    #[serde(default)]
    pub op_mob: T,
    #[serde(default)]
    pub ie: T,
    #[serde(default)]
    pub edge: T,
    #[serde(default)]
    pub firefox: T,
    #[serde(default)]
    pub safari: T,
    #[serde(default)]
    pub node: T,
    #[serde(default)]
    pub ios: T,
    #[serde(default)]
    pub samsung: T,
    #[serde(default)]
    pub opera: T,
    #[serde(default)]
    pub android: T,
    #[serde(default)]
    pub electron: T,
    #[serde(default)]
    pub phantom: T,
    #[serde(default)]
    pub opera_mobile: T,
    #[serde(default)]
    pub rhino: T,
    #[serde(default)]
    pub deno: T,
    #[serde(default)]
    pub hermes: T,
    #[serde(default)]
    pub oculus: T,
    #[serde(default)]
    pub bun: T,
}

/// A map of browser names to data for feature support in browser.
///
/// This type mainly stores `minimum version for each browsers with support for
/// a feature`.
pub type Versions = BrowserData<Option<Version>>;

impl BrowserData<Option<Version>> {
    /// Returns true if all fields are [None].
    pub fn is_any_target(&self) -> bool {
        self.iter().all(|(_, v)| v.is_none())
    }

    /// Parses the value returned from `browserslist` as [Versions].
    pub fn parse_versions(distribs: Vec<browserslist::Distrib>) -> Result<Self, Error> {
        fn remap(key: &str) -> &str {
            match key {
                "and_chr" => "chrome",
                "and_ff" => "firefox",
                "ie_mob" => "ie",
                "ios_saf" => "ios",
                "op_mob" => "opera",
                _ => key,
            }
        }

        let mut data: Versions = BrowserData::default();
        for dist in distribs {
            let browser = dist.name();
            let browser = remap(browser);
            let version = dist.version();
            match browser {
                "and_qq" | "and_uc" | "baidu" | "bb" | "kaios" | "op_mini" => continue,

                _ => {}
            }

            let version = version
                .split_once('-')
                .map(|(version, _)| version)
                .unwrap_or(version)
                .parse()
                .ok();

            let version = match version {
                Some(v) => v,
                None => continue,
            };

            // lowest version
            if data[&browser].map(|v| v > version).unwrap_or(true) {
                for (k, v) in data.iter_mut() {
                    if browser == k {
                        *v = Some(version);
                    }
                }
            }
        }

        Ok(data)
    }
}
