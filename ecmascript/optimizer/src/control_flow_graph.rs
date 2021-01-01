use crate::basic_block::Block;
use crate::basic_block::ExprData;
use crate::basic_block::Item;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
use crate::block_id::BlockIdGenerator;
use fxhash::FxHashMap;
use std::cell::RefCell;
use std::mem::take;
use std::rc::Rc;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_utils::Value;

/// This struct is required for optimizaiotn.
#[derive(Debug)]
pub struct ControlFlowGraph<'cfg> {
    blocks: FxHashMap<BlockId, Block<'cfg>>,

    next: FxHashMap<BlockId, Vec<BlockId>>,
    start: BlockId,

    stmts: &'cfg [ModuleItem],
    exprs: Vec<ExprData<'cfg>>,
}

/// Public apis.
impl<'cfg> ControlFlowGraph<'cfg> {
    pub fn anaylze(stmts: &'cfg [ModuleItem]) -> Self {
        let mut analyzer = Analyzer {};
    }

    pub fn take(self) {}
}
#[derive(Debug)]
struct Anaylzer<'cfg, 'a> {
    next: FxHashMap<BlockId, Vec<(BlockId, Option<JumpCond<'cfg>>)>>,
    exprs: Vec<ExprData<'cfg>>,
    id_gen: Rc<RefCell<BlockIdGenerator>>,
    cur_id: BlockId,
    /// TOOD: Make this field generic.
    cur: Block<'cfg>,
    scope: Scope<'a>,
}

impl<'cfg, 'a> Anaylzer<'cfg, 'a> {
    fn with_child<F, Ret>(&mut self, op: F) -> Ret
    where
        F: FnOnce(&mut Anaylzer) -> Ret,
    {
        let child_scope = self.scope.child();

        let cur = take(&mut self.cur);
        let next = take(&mut self.next);
        let exprs = take(&mut self.exprs);
        let cur_id = self.cur_id;

        let (ret, cur_id, cur, next, exprs) = {
            let mut child = Anaylzer {
                id_gen: self.id_gen.clone(),
                scope: child_scope,
                cur,
                cur_id,
                next,
                exprs,
            };
            let ret = op(&mut child);

            (ret, child.cur_id, child.cur, child.next, child.exprs)
        };

        self.cur_id = cur_id;
        self.cur = cur;
        self.exprs = exprs;

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

impl<'cfg> Anaylzer<'cfg, '_> {
    fn jump_cond(&mut self, test: ExprData<'cfg>, to: BlockId, if_true: bool) {
        let from = self.cur_id;

        self.next
            .entry(from)
            .or_default()
            .push((to, Some(JumpCond::Cond { test, if_true })));
    }

    fn jump_if(&mut self, test: ExprData<'cfg>, to: BlockId) {
        self.jump_cond(test, to, true);
    }

    fn jump_if_not(&mut self, test: ExprData<'cfg>, to: BlockId) {
        self.jump_cond(test, to, false);
    }

    /// Add statement to control flow graph.
    fn emit_stmt(&mut self, s: &'cfg Stmt) -> BlockId {
        let start = self.cur_id;

        match s {
            Stmt::Debugger(_) => {}

            Stmt::Block(s) => self.emit_block_stmt(s),
            Stmt::Empty(_) => self.cur.push(Item::Stmt(s)),
            Stmt::With(_) => {}
            Stmt::Return(_) => {}
            Stmt::Labeled(_) => {}
            Stmt::Break(_) => {}
            Stmt::Continue(_) => {}
            Stmt::If(s) => self.emit_if_stmt(s),
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

        start
    }

    fn emit_if_stmt(&mut self, s: &'cfg IfStmt) {
        let start = self.cur_id;

        let test = self.emit_expr(&s.test);

        let cons = self.emit_stmt(&s.cons);
        self.jump_if(test, cons);

        if let Some(alt) = &s.alt {
            let alt = self.emit_stmt(&alt);
            self.jump_if_not(test, alt);
        }
    }

    fn emit_block_stmt(&mut self, s: &'cfg BlockStmt) {
        for stmt in &s.stmts {
            self.emit_stmt(&stmt);
        }
    }

    fn emit_expr(&mut self, e: &'cfg Expr) -> ExprData<'cfg> {
        match e {
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
            Expr::Tpl(_) => {}
            Expr::TaggedTpl(_) => {}
            Expr::Arrow(_) => {}
            Expr::Class(_) => {}
            Expr::Yield(_) => {}
            Expr::Await(_) => {}
            Expr::Paren(e) => return self.emit_expr(&e.expr),
            Expr::OptChain(_) => {}

            Expr::Lit(lit) => {
                let index = self.exprs.len();
                let data = ExprData {
                    index,
                    ast: e,
                    value: Rc::new(RefCell::new(Some(lit.clone()))),
                };
                self.cur.push(Item::Expr(data.clone()));
                return data;
            }

            _ => {}
        }

        let index = self.exprs.len();
        let data = ExprData {
            index,
            ast: e,
            value: Rc::new(RefCell::new(None)),
        };
        self.cur.push(Item::Expr(data.clone()));
        data
    }
}
