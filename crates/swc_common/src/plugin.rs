//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.
#![allow(unused)]

use crate::{syntax_pos::Mark, SyntaxContext};
use anyhow::Error;
use std::any::type_name;

/// Serialize ast to pass into plugins. This is being called from host side.
/// TODO: https://github.com/swc-project/swc/issues/3167
#[cfg(feature = "plugin-base")]
pub fn serialize_for_plugin<T>(t: &T) -> Result<rkyv::AlignedVec, Error>
where
    T: rkyv::Serialize<rkyv::ser::serializers::AllocSerializer<512>>,
{
    rkyv::to_bytes::<_, 512>(t).map_err(|err| match err {
        rkyv::ser::serializers::CompositeSerializerError::SerializerError(e) => e.into(),
        rkyv::ser::serializers::CompositeSerializerError::ScratchSpaceError(e) => {
            Error::msg("AllocScratchError")
        }
        rkyv::ser::serializers::CompositeSerializerError::SharedError(e) => {
            Error::msg("SharedSerializeMapError")
        }
    })
}

/// TODO: https://github.com/swc-project/swc/issues/3167
#[cfg(feature = "plugin-mode")]
pub fn deserialize_for_plugin<T>(bytes: &[u8]) -> Result<T, Error>
where
    T: rkyv::Archive
        + rkyv::with::DeserializeWith<<T as rkyv::Archive>::Archived, T, rkyv::Infallible>,
{
    use anyhow::Context;
    use rkyv::Deserialize;

    let archived = unsafe { rkyv::archived_root::<T>(&bytes[..]) };

    archived
        .deserialize(&mut rkyv::Infallible)
        .map(|r: rkyv::with::With<T, T>| r.into_inner())
        .with_context(|| format!("failed to deserialize `{}`", type_name::<T>()))
}
