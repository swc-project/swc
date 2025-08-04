#[derive(
    Eq, Hash, Default, Debug, PartialEq, Clone, Copy, serde::Serialize, serde::Deserialize,
)]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
pub struct NodeId(#[cfg_attr(feature = "__rkyv", rkyv(omit_bounds))] u32);

impl NodeId {
    pub const DUMMY: NodeId = NodeId(u32::MAX);
}
