pub const KIND_EXPR: usize = 1;

pub const KIND_STMT: usize = 2;

pub const KIND_PAT: usize = 3;

pub const KIND_PROP: usize = 4;

pub const KIND_DECL: usize = 5;

pub const KIND_TYPE: usize = 6;

pub const KIND_MODULE: usize = 7;

pub const KIND_MODULE_DECL: usize = 8;

pub const KIND_MODULE_ITEM: usize = 9;

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
