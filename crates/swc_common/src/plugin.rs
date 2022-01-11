//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.
#![allow(unused)]

use crate::{syntax_pos::Mark, SyntaxContext};
use anyhow::Error;
use std::any::type_name;

/// A struct wraps internal representation of serialized Program to be passed
/// across plugin's host to guest. Plugin author should not rely on specific
/// details serialized byte format struct contains: it is strictly
/// implementation detail which can change anytime.
#[cfg(any(feature = "plugin-mode", feature = "plugin-rt"))]
pub struct SerializedProgram(pub rkyv::AlignedVec);

impl SerializedProgram {
    #[cfg(any(feature = "plugin-mode", feature = "plugin-rt"))]
    pub fn new(bytes: Vec<u8>, len: i32) -> SerializedProgram {
        let mut vec = rkyv::AlignedVec::with_capacity(
            len.try_into()
                .expect("Cannot determine size of the serialized bytes"),
        );
        vec.extend_from_slice(&bytes);
        SerializedProgram(vec)
    }
}

/// Serialize given Program into raw bytes, can be copied into plugin's memory
/// spaces.
#[cfg(any(feature = "plugin-rt", feature = "plugin-mode"))]
pub fn serialize_for_plugin<T>(t: &T) -> Result<SerializedProgram, Error>
where
    T: rkyv::Serialize<rkyv::ser::serializers::AllocSerializer<512>>,
{
    rkyv::to_bytes::<_, 512>(t)
        .map(|v| SerializedProgram(v))
        .map_err(|err| match err {
            rkyv::ser::serializers::CompositeSerializerError::SerializerError(e) => e.into(),
            rkyv::ser::serializers::CompositeSerializerError::ScratchSpaceError(e) => {
                Error::msg("AllocScratchError")
            }
            rkyv::ser::serializers::CompositeSerializerError::SharedError(e) => {
                Error::msg("SharedSerializeMapError")
            }
        })
}

/// Deserialize given raw bytes into Program.
#[cfg(any(feature = "plugin-rt", feature = "plugin-mode"))]
pub fn deserialize_for_plugin<T>(bytes: &SerializedProgram) -> Result<T, Error>
where
    T: rkyv::Archive,
    T::Archived: rkyv::Deserialize<T, rkyv::Infallible>,
{
    use anyhow::Context;
    use rkyv::Deserialize;

    let archived = unsafe { rkyv::archived_root::<T>(&bytes.0[..]) };

    archived
        .deserialize(&mut rkyv::Infallible)
        .with_context(|| format!("failed to deserialize `{}`", type_name::<T>()))
}
