//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.
#![allow(unused)]

use crate::{syntax_pos::Mark, SyntaxContext};
use anyhow::Error;
use std::any::type_name;

/// Wraps internal representation of serialized data. Consumers should not
/// rely on specific details of byte format struct contains: it is
/// strictly implementation detail which can change anytime.
pub struct Serialized {
    field: rkyv::AlignedVec,
}

#[cfg(feature = "plugin-base")]
impl Serialized {
    pub fn new_for_plugin(bytes: &[u8], len: i32) -> Serialized {
        let mut vec = rkyv::AlignedVec::with_capacity(
            len.try_into()
                .expect("Cannot determine size of the serialized bytes"),
        );
        vec.extend_from_slice(bytes);
        Serialized { field: vec }
    }

    pub fn from(vec: rkyv::AlignedVec) -> Serialized {
        Serialized { field: vec }
    }

    #[allow(clippy::should_implement_trait)]
    pub fn as_ref(&self) -> &rkyv::AlignedVec {
        &self.field
    }

    pub fn serialize<W>(t: &W) -> Result<Serialized, Error>
    where
        W: rkyv::Serialize<rkyv::ser::serializers::AllocSerializer<512>>,
    {
        rkyv::to_bytes::<_, 512>(t)
            .map(Serialized::from)
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

    pub fn deserialize<W>(bytes: &Serialized) -> Result<W, Error>
    where
        W: rkyv::Archive,
        W::Archived: rkyv::Deserialize<W, rkyv::Infallible>,
    {
        use anyhow::Context;
        use rkyv::Deserialize;

        let bytes = &bytes.field;
        let archived = unsafe { rkyv::archived_root::<W>(&bytes[..]) };

        archived
            .deserialize(&mut rkyv::Infallible)
            .with_context(|| format!("failed to deserialize `{}`", type_name::<W>()))
    }
}
