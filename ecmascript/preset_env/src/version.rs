use crate::Versions;
use serde::{de, de::Visitor, Deserialize, Deserializer};
use std::{cmp, cmp::Ordering, fmt, hash, str::FromStr};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Version {
    pub major: u16,
    pub minor: u16,
    pub patch: u16,
}

impl FromStr for Version {
    type Err = ();

    fn from_str(v: &str) -> Result<Self, Self::Err> {
        if !v.contains(".") {
            return Ok(Version {
                major: v
                    .parse()
                    .unwrap_or_else(|err| panic!("failed to parse `{}` as a version: {}", v, err)),
                minor: 0,
                patch: 0,
            });
        }

        if v.split(".").count() == 2 {
            let mut s = v.split(".");
            return Ok(Version {
                major: s.next().unwrap().parse().unwrap(),
                minor: s.next().unwrap().parse().unwrap(),
                patch: 0,
            });
        }

        let v = v
            .parse::<semver::Version>()
            .unwrap_or_else(|err| panic!("failed to parse {} as semver: {}", v, err));

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

impl hash::Hash for Version {
    fn hash<H: hash::Hasher>(&self, into: &mut H) {
        self.major.hash(into);
        self.minor.hash(into);
        self.patch.hash(into);
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

    target
        .iter()
        .zip(feature.iter())
        .any(|((_, target_version), (_, f))| {
            if target_version.is_none() {
                return false;
            }

            if f.is_none() {
                return true;
            }

            let f = f.as_ref().unwrap();
            let target = target_version.unwrap();

            *f > target
        })
}
