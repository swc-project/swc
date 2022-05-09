use serde::{Deserialize, Serialize};

use crate::merge::Merge;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct BoolOrDataConfig<T>(#[serde(default)] Option<BoolOr<T>>);

impl<T> BoolOrDataConfig<T> {
    pub fn from_bool(v: bool) -> Self {
        Self(Some(BoolOr::Bool(v)))
    }

    pub fn from_obj(v: T) -> Self {
        v.into()
    }

    pub fn as_ref(&self) -> BoolOrDataConfig<&T> {
        match &self.0 {
            Some(BoolOr::Actual(v)) => BoolOrDataConfig::from_obj(v),
            Some(BoolOr::Bool(b)) => BoolOrDataConfig::from_bool(*b),
            None => BoolOrDataConfig::default(),
        }
    }

    pub fn or<F>(self, default: F) -> Self
    where
        F: FnOnce() -> Self,
    {
        match self.0 {
            Some(..) => self,
            None => default(),
        }
    }

    pub fn unwrap_as_option<F>(self, default: F) -> Option<T>
    where
        F: FnOnce(Option<bool>) -> Option<T>,
    {
        match self.0 {
            Some(BoolOr::Actual(v)) => Some(v),
            Some(BoolOr::Bool(b)) => default(Some(b)),
            None => default(None),
        }
    }

    pub fn map<F, N>(self, op: F) -> BoolOrDataConfig<N>
    where
        F: FnOnce(T) -> N,
    {
        match self.0 {
            Some(BoolOr::Actual(v)) => BoolOrDataConfig::from_obj(op(v)),
            Some(BoolOr::Bool(b)) => BoolOrDataConfig::from_bool(b),
            None => BoolOrDataConfig::default(),
        }
    }

    pub fn is_true(&self) -> bool {
        matches!(self.0, Some(BoolOr::Bool(true)))
    }

    pub fn is_false(&self) -> bool {
        matches!(self.0, Some(BoolOr::Bool(false)))
    }

    pub fn is_obj(&self) -> bool {
        matches!(self.0, Some(BoolOr::Actual(_)))
    }

    pub fn into_inner(self) -> Option<BoolOr<T>> {
        self.0
    }
}

impl<T> From<T> for BoolOrDataConfig<T> {
    fn from(v: T) -> Self {
        Self(Some(BoolOr::Actual(v)))
    }
}

impl<T> Default for BoolOrDataConfig<T> {
    fn default() -> Self {
        Self(Default::default())
    }
}

impl<T> Merge for BoolOrDataConfig<T> {
    #[inline]
    fn merge(&mut self, other: Self) {
        self.0.merge(other.0)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
#[serde(untagged)]
pub enum BoolOr<T> {
    Bool(bool),
    Actual(T),
}

impl<'de, T> Deserialize<'de> for BoolOr<T>
where
    T: Deserialize<'de>,
{
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        #[derive(Deserialize)]
        #[serde(untagged)]
        enum Deser<T> {
            Bool(bool),
            Obj(T),
            EmptyObject(EmptyStruct),
        }

        #[derive(Deserialize)]
        #[serde(deny_unknown_fields)]
        struct EmptyStruct {}

        use serde::__private::de;

        let content = de::Content::deserialize(deserializer)?;

        let deserializer = de::ContentRefDeserializer::<D::Error>::new(&content);

        let res = Deser::deserialize(deserializer);

        match res {
            Ok(v) => Ok(match v {
                Deser::Bool(v) => BoolOr::Bool(v),
                Deser::Obj(v) => BoolOr::Actual(v),
                Deser::EmptyObject(_) => BoolOr::Bool(true),
            }),
            Err(..) => {
                let d = de::ContentDeserializer::<D::Error>::new(content);
                Ok(BoolOr::Actual(T::deserialize(d)?))
            }
        }
    }
}
