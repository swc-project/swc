use serde::{Deserialize, Deserializer, Serialize, Serializer};

use super::Box;

impl<T> Serialize for Box<T>
where
    T: Serialize,
{
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        self.0.serialize(serializer)
    }
}

impl<'de, T> Deserialize<'de> for Box<T>
where
    T: Deserialize<'de>,
{
    fn deserialize<D>(deserializer: D) -> Result<Box<T>, D::Error>
    where
        D: Deserializer<'de>,
    {
        Ok(Box::new(T::deserialize(deserializer)?))
    }
}
