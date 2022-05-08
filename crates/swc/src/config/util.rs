use serde::{Deserialize, Serialize};

/// Note: `{}` (empty object) is treated as `true`.
#[derive(Clone, Serialize, Debug)]
#[serde(untagged)]
pub enum BoolOrObject<T> {
    Bool(bool),
    Obj(T),
}

impl<T> From<bool> for BoolOrObject<T> {
    fn from(v: bool) -> Self {
        BoolOrObject::Bool(v)
    }
}

impl<T> Default for BoolOrObject<T> {
    fn default() -> Self {
        Self::Bool(false)
    }
}

impl<T> BoolOrObject<T> {
    pub fn into_obj(self) -> Option<T>
    where
        T: Default,
    {
        match self {
            BoolOrObject::Bool(true) => Some(Default::default()),
            BoolOrObject::Bool(false) => None,
            BoolOrObject::Obj(o) => Some(o),
        }
    }
}

impl<'de, T> Deserialize<'de> for BoolOrObject<T>
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

        let content = swc_common::private::serde::de::Content::deserialize(deserializer)?;

        let deserializer =
            swc_common::private::serde::de::ContentRefDeserializer::<D::Error>::new(&content);

        let res = Deser::deserialize(deserializer);

        match res {
            Ok(v) => Ok(match v {
                Deser::Bool(v) => BoolOrObject::Bool(v),
                Deser::Obj(v) => BoolOrObject::Obj(v),
                Deser::EmptyObject(_) => BoolOrObject::Bool(true),
            }),
            Err(..) => {
                let d =
                    swc_common::private::serde::de::ContentDeserializer::<D::Error>::new(content);
                Ok(BoolOrObject::Obj(T::deserialize(d)?))
            }
        }
    }
}
