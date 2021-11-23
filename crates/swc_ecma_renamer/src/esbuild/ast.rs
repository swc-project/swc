/// This stores a 32-bit index where the zero value is an invalid index. This is
/// a better alternative to storing the index as a pointer since that has the
/// same properties but takes up more space and costs an extra pointer
/// traversal.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) struct Index32(u32);

impl Index32 {
    pub fn is_valid(self) -> bool {
        self.0 != 0
    }

    pub fn get_index(self) -> usize {
        (!self.0) as usize
    }
}

impl From<u32> for Index32 {
    fn from(i: u32) -> Self {
        Index32(!i)
    }
}

impl From<Index32> for u32 {
    fn from(i: Index32) -> Self {
        !i.0
    }
}
