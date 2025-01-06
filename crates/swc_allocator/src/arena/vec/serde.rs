use serde::{Serialize, Serializer};

use super::Vec;

impl<T> Serialize for Vec<'_, T>
where
    T: Serialize,
{
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        self.as_slice().serialize(serializer)
    }
}

// impl<'de, T> Deserialize<'de> for Vec<T>
// where
//     T: Deserialize<'de>,
// {
//     fn deserialize<D>(deserializer: D) -> Result<Vec<T>, D::Error>
//     where
//         D: Deserializer<'de>,
//     {
//         let visitor = VecVisitor {
//             marker: PhantomData,
//         };
//         deserializer.deserialize_seq(visitor)
//     }
// }
