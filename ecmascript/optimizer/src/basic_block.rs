use swc_ecma_utils::ModuleItemLike;

/// Basic block.
#[derive(Debug)]
pub struct Block<T>
where
    T: ModuleItemLike,
{
    stmts: Vec<T>,
}

impl<T> Default for Block<T>
where
    T: ModuleItemLike,
{
    fn default() -> Self {
        Block { stmts: vec![] }
    }
}

impl<T> Block<T>
where
    T: ModuleItemLike,
{
    pub fn into_inner(self) -> Vec<T> {
        self.stmts
    }
}
