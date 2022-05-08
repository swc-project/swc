use serde::{Deserialize, Serialize};

use crate::merge::Merge;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct BoolOr<T>(#[serde(default)] Option<Inner<T>>);

impl<T> BoolOr<T> {
    pub fn from_bool(v: bool) -> Self {
        Self(Some(Inner::Bool(v)))
    }

    pub fn from_obj(v: T) -> Self {
        v.into()
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
            Some(Inner::Actual(v)) => Some(v),
            Some(Inner::Bool(b)) => default(Some(b)),
            None => default(None),
        }
    }

    pub fn is_true(&self) -> bool {
        matches!(self.0, Some(Inner::Bool(true)))
    }

    pub fn is_false(&self) -> bool {
        matches!(self.0, Some(Inner::Bool(false)))
    }

    pub fn is_obj(&self) -> bool {
        matches!(self.0, Some(Inner::Actual(_)))
    }
}

impl<T> From<T> for BoolOr<T> {
    fn from(v: T) -> Self {
        Self(Some(Inner::Actual(v)))
    }
}

impl<T> Default for BoolOr<T> {
    fn default() -> Self {
        Self(Default::default())
    }
}

impl<T> Merge for BoolOr<T> {
    #[inline]
    fn merge(&mut self, other: Self) {
        self.0.merge(other.0)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
#[serde(untagged)]
enum Inner<T> {
    Bool(bool),
    Actual(T),
}

impl<'de, T> Deserialize<'de> for Inner<T>
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
                Deser::Bool(v) => Inner::Bool(v),
                Deser::Obj(v) => Inner::Actual(v),
                Deser::EmptyObject(_) => Inner::Bool(true),
            }),
            Err(..) => {
                let d = de::ContentDeserializer::<D::Error>::new(content);
                Ok(Inner::Actual(T::deserialize(d)?))
            }
        }
    }
}
