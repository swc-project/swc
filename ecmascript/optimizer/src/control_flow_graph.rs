use crate::basic_block::Block;
use crate::block_id::BlockId;
use crate::block_id::BlockIdGenerator;
use fxhash::FxHashMap;
use std::cell::RefCell;
use std::rc::Rc;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_utils::ModuleItemLike;

/// This struct is required for optimizaiotn.
#[derive(Debug)]
pub struct ControlFlowGraph {
    top_blocks: FxHashMap<BlockId, Block<ModuleItem>>,
    blocks: FxHashMap<BlockId, Block<Stmt>>,

    next: FxHashMap<BlockId, Vec<BlockId>>,
    start: BlockId,
}

/// Public apis.
impl ControlFlowGraph {
    pub fn anaylze(stmts: Vec<ModuleItem>) -> Self {}

    pub fn take(self) -> Vec<ModuleItem> {}
}
#[derive(Debug)]
struct Anaylzer<'a> {
    scope: Scope<'a>,
}

impl<'a> Anaylzer<'a> {
    fn with_child<F, Ret>(&mut self, op: F) -> Ret
    where
        F: FnOnce(&mut Anaylzer) -> Ret,
    {
        let child_scope = self.scope.child();

        let mut child = Anaylzer { scope: child_scope };
        let ret = op(&mut child);

        ret
    }
}

/// Used while creating control flow graph from ast.
#[derive(Debug)]
struct Scope<'a> {
    id_gen: Rc<RefCell<BlockIdGenerator>>,

    ids_by_label: FxHashMap<Id, BlockId>,

    parent: Option<&'a Scope<'a>>,
}

impl<'a> Scope<'a> {
    pub fn child(&'a self) -> Scope<'a> {
        Self {
            id_gen: self.id_gen.clone(),
            ids_by_label: Default::default(),
            parent: Some(self),
        }
    }
}

impl Anaylzer<'_> {
    /// Add statement to control flow graph and return the id of the basic block
    /// it belongs to.
    fn emit_stmt(&mut self, s: Stmt) -> BlockId {
        match s {
            Stmt::Block(b) => {}
            Stmt::Empty(_) => {}
            Stmt::Debugger(_) => {}
            Stmt::With(_) => {}
            Stmt::Return(_) => {}
            Stmt::Labeled(_) => {}
            Stmt::Break(_) => {}
            Stmt::Continue(_) => {}
            Stmt::If(_) => {}
            Stmt::Switch(_) => {}
            Stmt::Throw(_) => {}
            Stmt::Try(_) => {}
            Stmt::While(_) => {}
            Stmt::DoWhile(_) => {}
            Stmt::For(_) => {}
            Stmt::ForIn(_) => {}
            Stmt::ForOf(_) => {}
            Stmt::Decl(_) => {}
            Stmt::Expr(_) => {}
        }
    }

    fn emit_block_stmt(&mut self, s: BlockStmt) -> BlockId {}
}
