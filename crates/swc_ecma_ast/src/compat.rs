pub const KIND_CLASS: usize = 1;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct UnknownBytes<const KIND: usize, const LEN: usize> {
    bytes: [u8; LEN],
}

impl<const KIND: usize, const LEN: usize> UnknownBytes<KIND, LEN> {
    pub fn new(bytes: [u8; LEN]) -> Self {
        Self { bytes }
    }
}

impl<const KIND: usize, const LEN: usize> Default for UnknownBytes<KIND, LEN> {
    fn default() -> Self {
        Self { bytes: [0; LEN] }
    }
}
