//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.
#![allow(unused)]

use crate::{syntax_pos::Mark, SyntaxContext};
use anyhow::Error;
use std::any::type_name;

#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
#[cfg_attr(
    feature = "plugin-base",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
/// Enum for possible errors while running transform via plugin.
/// This error indicates internal operation failure either in plugin_runner
/// or plugin_macro. Plugin's transform fn itself does not allow to return
/// error - instead it should use provided `handler` to emit corresponding error
/// to the host.
pub enum PluginError {
    /// Occurs when failed to convert size passed from host / guest into usize
    /// or similar for the conversion. This is an internal error rasied via
    /// plugin_macro, noramlly plugin author should not raise this manually.
    SizeInteropFailure(String),
    /// Occurs when failed to reconstruct a struct from `Serialized`.
    Deserialize((String, Vec<u8>)),
    /// Occurs when failed to serialize a struct into `Serialized`.
    /// Unlike deserialize error, this error cannot forward any context for the
    /// raw bytes: when serialze failed, there's nothing we can pass between
    /// runtime.
    Serialize(String),
}

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
