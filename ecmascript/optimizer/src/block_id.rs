#[derive(Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct BlockId(u32);

#[derive(Debug, Default)]
pub struct BlockIdGenerator {
    count: u32,
}

impl BlockIdGenerator {
    pub fn generate(&mut self) -> BlockId {
        self.count += 1;
        BlockId(self.count)
    }
}
