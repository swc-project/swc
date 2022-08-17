use std::any::type_name;

use anyhow::Error;
use rkyv::Deserialize;

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

/// Wraps internal representation of serialized data for exchanging data between
/// plugin to the host. Consumers should not rely on specific details of byte
/// format struct contains: it is strict implementation detail which can
/// change anytime.
pub struct PluginSerializedBytes {
    pub(crate) field: rkyv::AlignedVec,
}

#[cfg(feature = "plugin-base")]
impl PluginSerializedBytes {
    /**
     * Constructs an instance from already serialized byte
     * slices.
     */
    #[tracing::instrument(level = "info", skip_all)]
    pub fn from_slice(bytes: &[u8]) -> PluginSerializedBytes {
        let mut field = rkyv::AlignedVec::new();
        field.extend_from_slice(bytes);
        PluginSerializedBytes { field }
    }

    /**
     * Constructs an instance from versioned struct by serializing it.
     *
     * This is sort of mimic TryFrom behavior, since we can't use generic
     * to implement TryFrom trait
     */
    #[tracing::instrument(level = "info", skip_all)]
    pub fn try_serialize<W>(t: &W) -> Result<Self, Error>
    where
        W: rkyv::Serialize<rkyv::ser::serializers::AllocSerializer<512>>,
    {
        rkyv::to_bytes::<_, 512>(t)
            .map(|field| PluginSerializedBytes { field })
            .map_err(|err| match err {
                rkyv::ser::serializers::CompositeSerializerError::SerializerError(e) => e.into(),
                rkyv::ser::serializers::CompositeSerializerError::ScratchSpaceError(_e) => {
                    Error::msg("AllocScratchError")
                }
                rkyv::ser::serializers::CompositeSerializerError::SharedError(_e) => {
                    Error::msg("SharedSerializeMapError")
                }
            })
    }

    /*
     * Internal fn to constructs an instance from raw bytes ptr.
     */
    #[tracing::instrument(level = "info", skip_all)]
    fn from_raw_ptr(
        raw_allocated_ptr: *const u8,
        raw_allocated_ptr_len: usize,
    ) -> PluginSerializedBytes {
        let raw_ptr_bytes =
            unsafe { std::slice::from_raw_parts(raw_allocated_ptr, raw_allocated_ptr_len) };

        PluginSerializedBytes::from_slice(raw_ptr_bytes)
    }

    pub fn as_slice(&self) -> &[u8] {
        self.field.as_slice()
    }

    pub fn as_ptr(&self) -> (*const u8, usize) {
        (self.field.as_ptr(), self.field.len())
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn deserialize<W>(&self) -> Result<W, Error>
    where
        W: rkyv::Archive,
        W::Archived: rkyv::Deserialize<W, rkyv::de::deserializers::SharedDeserializeMap>,
    {
        use anyhow::Context;

        let archived = unsafe { rkyv::archived_root::<W>(&self.field[..]) };

        archived
            .deserialize(&mut rkyv::de::deserializers::SharedDeserializeMap::new())
            .with_context(|| format!("failed to deserialize `{}`", type_name::<W>()))
    }
}

/// Simple wrapper around constructing PluginSerializedBytes from raw
/// ptr to call deserialize to support common workflow on both of runtime
/// (host / plugin) to instantiate a struct from allocated / copied ptr.
///
/// # Safety
/// This is naturally unsafe by constructing bytes slice from raw ptr.
#[tracing::instrument(level = "info", skip_all)]
pub unsafe fn deserialize_from_ptr<W>(
    raw_allocated_ptr: *const u8,
    raw_allocated_ptr_len: i32,
) -> Result<W, Error>
where
    W: rkyv::Archive,
    W::Archived: rkyv::Deserialize<W, rkyv::de::deserializers::SharedDeserializeMap>,
{
    let serialized =
        PluginSerializedBytes::from_raw_ptr(raw_allocated_ptr, raw_allocated_ptr_len as usize);

    serialized.deserialize()
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
#[tracing::instrument(level = "info", skip_all)]
pub unsafe fn deserialize_from_ptr_into_fallible<W>(
    raw_allocated_ptr: *const u8,
    raw_allocated_ptr_len: i32,
) -> Result<W, Error>
where
    W: rkyv::Archive,
    W::Archived: rkyv::Deserialize<W, rkyv::de::deserializers::SharedDeserializeMap>,
{
    let serialized =
        PluginSerializedBytes::from_raw_ptr(raw_allocated_ptr, raw_allocated_ptr_len as usize);

    rkyv::from_bytes_unchecked(&serialized.field)
        .map_err(|_err| Error::msg("Failed to deserialize given ptr"))
}

/*
/// A wrapper type for the structures to be passed into plugins
/// serializes the contained value out-of-line so that newer
/// versions can be viewed as the older version.
///
#[derive(Archive, Deserialize, Serialize)]
pub struct VersionedSerializable<T>(#[with(AsBox)] T);

impl<T> VersionedSerializable<T> {
    pub fn new(value: T) -> Self {
        VersionedSerializable(value)
    }

    pub fn inner(&self) -> &T {
        &self.0
    }

    pub fn into_inner(self) -> T {
        self.0
    }
}
 */
