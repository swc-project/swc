use serde::{Deserialize, Serialize};

use crate::merge::Merge;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct BoolOrDataConfig<T>(#[serde(default)] Option<BoolOrData<T>>);

impl<T> BoolOrDataConfig<T> {
    pub fn from_bool(v: bool) -> Self {
        Self(Some(BoolOrData::Bool(v)))
    }

    pub fn from_obj(v: T) -> Self {
        v.into()
    }

    pub fn as_ref(&self) -> BoolOrDataConfig<&T> {
        match &self.0 {
            Some(BoolOrData::Actual(v)) => BoolOrDataConfig::from_obj(v),
            Some(BoolOrData::Bool(b)) => BoolOrDataConfig::from_bool(*b),
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
            Some(BoolOrData::Actual(v)) => Some(v),
            Some(BoolOrData::Bool(b)) => default(Some(b)),
            None => default(None),
        }
    }

    pub fn map<F, N>(self, op: F) -> BoolOrDataConfig<N>
    where
        F: FnOnce(T) -> N,
    {
        match self.0 {
            Some(BoolOrData::Actual(v)) => BoolOrDataConfig::from_obj(op(v)),
            Some(BoolOrData::Bool(b)) => BoolOrDataConfig::from_bool(b),
            None => BoolOrDataConfig::default(),
        }
    }

    pub fn is_true(&self) -> bool {
        matches!(self.0, Some(BoolOrData::Bool(true)))
    }

    pub fn is_false(&self) -> bool {
        matches!(self.0, Some(BoolOrData::Bool(false)))
    }

    pub fn is_obj(&self) -> bool {
        matches!(self.0, Some(BoolOrData::Actual(_)))
    }
}

impl<T> From<T> for BoolOrDataConfig<T> {
    fn from(v: T) -> Self {
        Self(Some(BoolOrData::Actual(v)))
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
pub enum BoolOrData<T> {
    Bool(bool),
    Actual(T),
}

impl<'de, T> Deserialize<'de> for BoolOrData<T>
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
                Deser::Bool(v) => BoolOrData::Bool(v),
                Deser::Obj(v) => BoolOrData::Actual(v),
                Deser::EmptyObject(_) => BoolOrData::Bool(true),
            }),
            Err(..) => {
                let d = de::ContentDeserializer::<D::Error>::new(content);
                Ok(BoolOrData::Actual(T::deserialize(d)?))
            }
        }
    }
}
