/// Basic block.
#[derive(Debug)]
pub struct Block<T> {
    stmts: Vec<T>,
}

impl<T> Block<T> {
    pub fn into_inner(self) -> Vec<T> {
        self.stmts
    }
}
