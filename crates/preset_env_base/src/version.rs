//! Module for browser versions

use std::{cmp, cmp::Ordering, fmt, str::FromStr};

use serde::{de, de::Visitor, Deserialize, Deserializer};
use tracing::warn;

use crate::Versions;

/// A version of a browser.
///
/// This is similar to semver, but this assumes a production build. (No tag like
/// `alpha`)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}

impl FromStr for Version {
    type Err = ();

    fn from_str(v: &str) -> Result<Self, Self::Err> {
        if !v.contains('.') {
            return Ok(Version {
                major: v.parse().map_err(|err| {
                    warn!("failed to parse `{}` as a version: {}", v, err);
                })?,
                minor: 0,
                patch: 0,
            });
        }

        if v.split('.').count() == 2 {
            let mut s = v.split('.');
            return Ok(Version {
                major: s.next().unwrap().parse().unwrap(),
                minor: s.next().unwrap().parse().unwrap(),
                patch: 0,
            });
        }

        let v = v.parse::<semver::Version>().map_err(|err| {
            warn!("failed to parse `{}` as a version: {}", v, err);
        })?;

        Ok(Version {
            major: v.major as _,
            minor: v.minor as _,
            patch: v.patch as _,
        })
    }
}

impl cmp::PartialOrd for Version {
    fn partial_cmp(&self, other: &Version) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl cmp::Ord for Version {
    fn cmp(&self, other: &Version) -> Ordering {
        match self.major.cmp(&other.major) {
            Ordering::Equal => {}
            r => return r,
        }

        match self.minor.cmp(&other.minor) {
            Ordering::Equal => {}
            r => return r,
        }

        match self.patch.cmp(&other.patch) {
            Ordering::Equal => {}
            r => return r,
        }

        Ordering::Equal
    }
}

struct SerdeVisitor;

impl<'de> Visitor<'de> for SerdeVisitor {
    type Value = Version;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("a browser version")
    }

    fn visit_i64<E>(self, v: i64) -> Result<Self::Value, E>
    where
        E: de::Error,
    {
        Ok(Version {
            major: v as _,
            minor: 0,
            patch: 0,
        })
    }

    fn visit_u64<E>(self, v: u64) -> Result<Self::Value, E>
    where
        E: de::Error,
    {
        Ok(Version {
            major: v as _,
            minor: 0,
            patch: 0,
        })
    }

    fn visit_f64<E>(self, v: f64) -> Result<Self::Value, E>
    where
        E: de::Error,
    {
        Ok(Version {
            major: v.floor() as _,
            minor: v.fract() as _,
            patch: 0,
        })
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: de::Error,
    {
        v.parse()
            .map_err(|_| de::Error::invalid_type(de::Unexpected::Str(v), &self))
    }

    #[inline]
    fn visit_borrowed_str<E>(self, v: &'de str) -> Result<Self::Value, E>
    where
        E: de::Error,
    {
        self.visit_str(v)
    }

    fn visit_string<E>(self, v: String) -> Result<Self::Value, E>
    where
        E: de::Error,
    {
        self.visit_str(&v)
    }
}

impl<'de> Deserialize<'de> for Version {
    fn deserialize<D>(deserializer: D) -> Result<Version, D::Error>
    where
        D: Deserializer<'de>,
    {
        deserializer.deserialize_any(SerdeVisitor)
    }
}

pub fn should_enable(target: Versions, feature: Versions, default: bool) -> bool {
    if target
        .iter()
        .zip(feature.iter())
        .all(|((_, target_version), (_, f))| target_version.is_none() && f.is_none())
    {
        return default;
    }

    target.iter().zip(feature.iter()).any(
        |((target_name, maybe_target_version), (_, maybe_feature_version))| {
            maybe_target_version.map_or(false, |target_version| {
                let feature_or_fallback_version =
                    maybe_feature_version.or_else(|| match target_name {
                        // Fall back to Chrome versions if Android browser data
                        // is missing from the feature data. It appears the
                        // Android browser has aligned its versioning with Chrome.
                        "android" => feature.chrome,
                        _ => None,
                    });

                feature_or_fallback_version.map_or(true, |v| v > target_version)
            })
        },
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::BrowserData;

    #[test]
    fn should_enable_android_falls_back_to_chrome() {
        assert!(!should_enable(
            BrowserData {
                android: Some("51.0.0".parse().unwrap()),
                ..Default::default()
            },
            BrowserData {
                chrome: Some("51.0.0".parse().unwrap()),
                ..Default::default()
            },
            false
        ));
    }
}
