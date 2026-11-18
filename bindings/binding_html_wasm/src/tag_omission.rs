use serde::{
    de::{Unexpected, Visitor},
    Deserialize,
};

#[derive(Debug)]
pub enum TagOmission {
    Bool(bool),
    KeepHeadAndBody,
}

struct TagOmissionVisitor;

impl Visitor<'_> for TagOmissionVisitor {
    type Value = TagOmission;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("a boolean or 'keep-head-and-body'")
    }

    fn visit_bool<E>(self, v: bool) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(TagOmission::Bool(v))
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        match v {
            "keep-head-and-body" => Ok(TagOmission::KeepHeadAndBody),
            _ => Err(serde::de::Error::invalid_value(Unexpected::Str(v), &self)),
        }
    }
}

impl<'de> Deserialize<'de> for TagOmission {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_any(TagOmissionVisitor)
    }
}
