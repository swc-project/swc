use std::{cmp, cmp::Ordering, hash, str::FromStr};

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
                major: v.parse().unwrap(),
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
