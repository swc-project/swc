use crate::basic_block::Block;
use crate::block_id::BlockId;
use crate::block_id::BlockIdGenerator;
use fxhash::FxHashMap;
use std::cell::RefCell;
use std::mem::take;
use std::rc::Rc;
use swc_common::Span;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_utils::ModuleItemLike;

/// This struct is required for optimizaiotn.
///
/// TODO: Restore
#[derive(Debug)]
pub struct ControlFlowGraph {
    blocks: FxHashMap<BlockId, Block>,

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
    id_gen: Rc<RefCell<BlockIdGenerator>>,
    cur_id: BlockId,
    /// TOOD: Make this field generic.
    cur: Block,
    scope: Scope<'a>,
}

impl<'a> Anaylzer<'a> {
    fn with_child<F, Ret>(&mut self, op: F) -> Ret
    where
        F: FnOnce(&mut Anaylzer) -> Ret,
    {
        let child_scope = self.scope.child();

        let cur = take(&mut self.cur);
        let cur_id = self.cur_id;

        let (ret, cur_id, cur) = {
            let mut child = Anaylzer {
                id_gen: self.id_gen.clone(),
                scope: child_scope,
                cur,
                cur_id,
            };
            let ret = op(&mut child);

            (ret, child.cur_id, child.cur)
        };

        self.cur_id = cur_id;
        self.cur = cur;

        ret
    }
}

/// Used while creating control flow graph from ast.
#[derive(Debug)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    ids_by_label: FxHashMap<Id, BlockId>,
}

impl<'a> Scope<'a> {
    pub fn child(&'a self) -> Scope<'a> {
        Self {
            ids_by_label: Default::default(),
            parent: Some(self),
        }
    }
}

impl Anaylzer<'_> {
    /// Add statement to control flow graph and return the id of the starting
    /// basic block.
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

    fn emit_if_stmt(&mut self, s: IfStmt) -> BlockId {
        let start = self.id_gen.borrow_mut().generate();
        let test = self.explode_expr(&s.test);

        let cons = self.emit_stmt(*s.cons);

        let alt = s.alt.map(|alt| self.emit_stmt(*alt));
    }

    fn emit_block_stmt(&mut self, s: BlockStmt) {}

    fn explode_expr(&mut self, e: &Expr) -> BlockId {
        match *e {
            Expr::Array(_) => {}
            Expr::Object(_) => {}
            Expr::Fn(_) => {}
            Expr::Unary(_) => {}
            Expr::Update(_) => {}
            Expr::Bin(_) => {}
            Expr::Assign(_) => {}
            Expr::Member(_) => {}
            Expr::Cond(_) => {}
            Expr::Call(_) => {}
            Expr::New(_) => {}
            Expr::Seq(_) => {}
            Expr::Ident(_) => {}
            Expr::Tpl(_) => {}
            Expr::TaggedTpl(_) => {}
            Expr::Arrow(_) => {}
            Expr::Class(_) => {}
            Expr::Yield(_) => {}
            Expr::MetaProp(_) => {}
            Expr::Await(_) => {}
            Expr::Paren(e) => return self.explode_expr(&e.expr),
            Expr::OptChain(_) => {}
            _ => self.cur.push_expr(e),
        }
    }
}
