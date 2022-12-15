use swc_ecma_ast::*;

/// The id of a basic block
pub(crate) type BlockId = u32;

pub(crate) enum NodeRef<'a> {
    Expr(&'a Expr),
    Stmt(&'a Stmt),
}

pub(crate) struct BasicBlock<'a> {
    pub(crate) id: BlockId,
    pub(crate) node: NodeRef<'a>,
}
