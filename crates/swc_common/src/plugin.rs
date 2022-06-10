//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.
#![allow(unused)]

use std::any::type_name;

use anyhow::Error;

use crate::{syntax_pos::Mark, SyntaxContext};

#[derive(Debug, Clone, PartialEq, Eq)]
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
    /// plugin_macro, normally plugin author should not raise this manually.
    SizeInteropFailure(String),
    /// Occurs when failed to reconstruct a struct from `Serialized`.
    Deserialize(String),
    /// Occurs when failed to serialize a struct into `Serialized`.
    /// Unlike deserialize error, this error cannot forward any context for the
    /// raw bytes: when serialize failed, there's nothing we can pass between
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

    /// Not an actual trait Into impl: simple wrapper to deserialize<T>:expect()
    pub fn into<T>(self) -> T
    where
        T: rkyv::Archive,
        T::Archived: rkyv::Deserialize<T, rkyv::Infallible>,
    {
        Serialized::deserialize(&self).expect("Should able to deserialize")
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

    /// Convenient wrapper to Serialized::* to construct actual struct from raw
    /// ptr. This is common workflow on both of runtime (host / plugin) to
    /// deserialize struct from allocated / copied ptr.
    ///
    /// # Safety
    /// This is naturally unsafe by constructing bytes slice from raw ptr.
    pub unsafe fn deserialize_from_ptr<W>(
        raw_allocated_ptr: *const u8,
        raw_allocated_ptr_len: i32,
    ) -> Result<W, Error>
    where
        W: rkyv::Archive,
        W::Archived: rkyv::Deserialize<W, rkyv::Infallible>,
    {
        // Create serialized bytes slice from ptr
        let raw_ptr_bytes = unsafe {
            std::slice::from_raw_parts(raw_allocated_ptr, raw_allocated_ptr_len.try_into()?)
        };

        let serialized = Serialized::new_for_plugin(raw_ptr_bytes, raw_allocated_ptr_len);
        Serialized::deserialize(&serialized)
    }

    /// Deserialize `Fallible` struct from raw ptr. This is similar to
    /// `deserialize_from_ptr` but for the struct requires bounds to the
    /// SharedSerializeRegistry which cannot be Infallible. Internally this does
    /// not call deserialize with Infallible deserializer, use
    /// SharedDeserializeMap instead.
    ///
    /// # Safety
    /// This is unsafe by construting bytes slice from raw ptr also deserialize
    /// it without slice bound check.
    pub unsafe fn deserialize_from_ptr_fallible<W>(
        raw_allocated_ptr: *const u8,
        raw_allocated_ptr_len: i32,
    ) -> Result<W, Error>
    where
        W: rkyv::Archive,
        W::Archived: rkyv::Deserialize<W, rkyv::de::deserializers::SharedDeserializeMap>,
    {
        // Create serialized bytes slice from ptr
        let raw_ptr_bytes = unsafe {
            std::slice::from_raw_parts(raw_allocated_ptr, raw_allocated_ptr_len.try_into()?)
        };

        let serialized = Serialized::new_for_plugin(raw_ptr_bytes, raw_allocated_ptr_len);

        unsafe {
            rkyv::from_bytes_unchecked(serialized.as_ref())
                .map_err(|err| Error::msg("Failed to deserialize given ptr"))
        }
    }
}
