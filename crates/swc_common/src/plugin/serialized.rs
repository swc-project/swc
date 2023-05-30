use anyhow::Error;

#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
#[cfg_attr(
    feature = "__plugin",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "__plugin", archive(check_bytes))]
#[cfg_attr(feature = "__plugin", archive_attr(repr(u32)))]
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

#[cfg(feature = "__plugin")]
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
    pub fn try_serialize<W>(t: &VersionedSerializable<W>) -> Result<Self, Error>
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
    pub fn from_raw_ptr(
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
    pub fn deserialize<'a, W>(&'a self) -> Result<VersionedSerializable<W>, Error>
    where
        W: rkyv::Archive + 'a,
        W::Archived: 'a
            + rkyv::CheckBytes<rkyv::validation::validators::DefaultValidator<'a>>
            + rkyv::Deserialize<W, rkyv::de::deserializers::SharedDeserializeMap>,
    {
        use rkyv::validation::{validators::CheckDeserializeError, CheckArchiveError};

        let result = rkyv::from_bytes::<VersionedSerializable<W>>(&self.field[..]);
        result.map_err(move |err| match err {
            CheckDeserializeError::DeserializeError(e) => e.into(),
            CheckDeserializeError::CheckBytesError(e) => match e {
                CheckArchiveError::CheckBytesError(_e) => {
                    // [TODO]: we can't forward CheckBytes::Error itself as it is Archived type of VersionedSerializable struct itself.
                    // Still we need to carry better diagnostics if this occurs.
                    Error::msg("CheckBytesError")
                }
                CheckArchiveError::ContextError(e) => e.into(),
            },
        })
    }
}

/// A wrapper type for the structures to be passed into plugins
/// serializes the contained value out-of-line so that newer
/// versions can be viewed as the older version.
///
/// First field indicate version of struct type (schema). Any consumers like
/// swc_plugin_macro can use this to validate compatiblility before attempt to
/// serialize.
#[cfg_attr(
    feature = "__plugin",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[repr(transparent)]
#[cfg_attr(feature = "__plugin", archive(check_bytes))]
#[cfg_attr(feature = "__plugin", archive_attr(repr(transparent)))]
#[derive(Debug)]
pub struct VersionedSerializable<T>(
    // [NOTE]: https://github.com/rkyv/rkyv/issues/373#issuecomment-1546360897
    //#[cfg_attr(feature = "__plugin", with(rkyv::with::AsBox))]
    pub T,
);

impl<T> VersionedSerializable<T> {
    pub fn new(value: T) -> Self {
        Self(value)
    }

    pub fn inner(&self) -> &T {
        &self.0
    }

    pub fn into_inner(self) -> T {
        self.0
    }
}
