use swc_common::EqIgnoreSpan;

/// Identifier of an AST node.
///
/// `0` is reserved for the dummy value. Parsers or dedicated passes should
/// assign concrete ids before node identity is used for analysis.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(transparent))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(feature = "serde-impl", serde(transparent))]
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub struct NodeId(pub u32);

impl NodeId {
    pub const DUMMY: Self = Self(0);

    #[inline(always)]
    pub const fn from_u32(value: u32) -> Self {
        Self(value)
    }

    #[inline(always)]
    pub const fn as_u32(self) -> u32 {
        self.0
    }

    #[inline(always)]
    pub const fn is_dummy(self) -> bool {
        self.0 == 0
    }
}
