use serde::{Serialize, Serializer};

use super::Box;

impl<T> Serialize for Box<'_, T>
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

// impl<'de, T> Deserialize<'de> for Box<'de, T>
// where
//     T: Deserialize<'de>,
// {
//     fn deserialize<D>(deserializer: D) -> Result<Box<'de, T>, D::Error>
//     where
//         D: Deserializer<'de>,
//     {
//         Ok(Box(T::deserialize(deserializer)?))
//     }
// }
