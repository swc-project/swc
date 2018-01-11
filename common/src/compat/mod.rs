//! Tracking for used html5 features.

use fnv::FnvHashSet;
use std::ops::{Add, AddAssign};

pub trait CanIUse {
    fn report_used_features(&self, features: &mut UsedFeatures);
}

/// Feature from `caniuse.com`.
/// TODO: Make this enum?
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Feature(&'static str);

impl Feature {
    /// not public api
    #[doc(hidden)]
    pub const fn new(s: &'static str) -> Self {
        Feature(s)
    }

    pub fn as_str(self) -> &'static str {
        self.0
    }
}

/// Creates a `caniuse::compat::Feature` with given string.
#[macro_export]
macro_rules! caniuse_feature {
    ($s:expr) => {{
        $crate::compat::Feature::new($s)
    }}
}

#[derive(Debug, Clone, Default)]
pub struct UsedFeatures {
    feats: FnvHashSet<Feature>,
}

impl UsedFeatures {
    pub fn finalize(self) -> FnvHashSet<Feature> {
        self.feats
    }
}

impl Add<Feature> for UsedFeatures {
    type Output = Self;
    fn add(mut self, rhs: Feature) -> Self {
        self += rhs;
        self
    }
}

impl AddAssign<Feature> for UsedFeatures {
    fn add_assign(&mut self, rhs: Feature) {
        self.feats.insert(rhs);
    }
}
