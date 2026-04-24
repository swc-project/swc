use swc_common::EqIgnoreSpan;

/// Opaque identifier for an AST node occurrence.
///
/// `NodeId(0)` is reserved as an invalid value. Parsers and synthesized AST
/// constructors intentionally create invalid ids; semantic analysis should
/// assign fresh ids before using node ids for binding or reference tracking.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(feature = "serde-impl", serde(transparent))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
pub struct NodeId(pub u32);

impl NodeId {
    /// The reserved invalid node id.
    pub const INVALID: Self = Self(0);

    /// Returns the reserved invalid node id.
    #[inline]
    pub const fn invalid() -> Self {
        Self::INVALID
    }

    /// Creates a node id from a raw non-zero id.
    ///
    /// # Panics
    ///
    /// Panics if `raw == 0`.
    #[inline]
    pub const fn new(raw: u32) -> Self {
        assert!(raw != 0, "NodeId(0) is reserved as invalid");
        Self(raw)
    }

    /// Returns the underlying raw id.
    #[inline]
    pub const fn as_u32(self) -> u32 {
        self.0
    }

    /// Returns true if this id is the reserved invalid value.
    #[inline]
    pub const fn is_invalid(self) -> bool {
        self.0 == 0
    }
}

impl EqIgnoreSpan for NodeId {
    #[inline]
    fn eq_ignore_span(&self, _: &Self) -> bool {
        true
    }
}
