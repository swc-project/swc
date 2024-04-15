use std::any::type_name;

use anyhow::Error;

#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
#[cfg_attr(
    feature = "__plugin",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "__plugin", archive(check_bytes))]
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
    pub(crate) field: rkyv::util::AlignedVec,
}

#[cfg(feature = "__plugin")]
impl PluginSerializedBytes {
    /**
     * Constructs an instance from already serialized byte
     * slices.
     */
    #[tracing::instrument(level = "info", skip_all)]
    pub fn from_slice(bytes: &[u8]) -> PluginSerializedBytes {
        let mut field = rkyv::util::AlignedVec::new();
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
        W: rkyv::Serialize<
            rkyv::rancor::Strategy<rkyv::ser::AllocSerializer<512>, rkyv::rancor::Infallible>,
        >,
    {
        Ok(rkyv::to_bytes::<_, 512, rkyv::rancor::Infallible>(t)
            .map(|field| PluginSerializedBytes { field })?)
    }

    /*
     * Internal fn to constructs an instance from raw bytes ptr.
     */
    #[tracing::instrument(level = "info", skip_all)]
    #[allow(clippy::not_unsafe_ptr_arg_deref)]
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
    pub fn deserialize<W>(&self) -> Result<VersionedSerializable<W>, Error>
    where
        W: rkyv::Archive + rkyv::Portable,
        W::Archived: rkyv::Deserialize<W, rkyv::rancor::Strategy<rkyv::de::Unify, rkyv::rancor::Failure>>
            + bytecheck::CheckBytes<
                rkyv::rancor::Strategy<
                    rkyv::validation::validators::DefaultValidator,
                    rkyv::rancor::Failure,
                >,
            >,
    {
        use anyhow::Context;

        let archived = rkyv::access::<
            rkyv::Archived<VersionedSerializable<W>>,
            rkyv::rancor::Failure,
        >(&self.field[..])?;

        let result = rkyv::Deserialize::<VersionedSerializable<W>, _>::deserialize(
            archived,
            rkyv::rancor::Strategy::wrap(&mut rkyv::de::Unify::new()),
        );

        result.with_context(|| format!("failed to deserialize `{}`", type_name::<W>()))
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
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize, rkyv::Portable)
)]
#[cfg_attr(feature = "__plugin", archive(check_bytes))]
#[repr(transparent)]
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
