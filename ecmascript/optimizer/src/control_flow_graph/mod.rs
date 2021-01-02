use crate::basic_block::Block;
use crate::basic_block::ExprData;
use crate::basic_block::Item;
use crate::basic_block::JumpCond;
use crate::block_id::BlockId;
use crate::block_id::BlockIdGenerator;
use crate::mutations::Mutations;
use fxhash::FxHashMap;
use petgraph::graphmap::DiGraphMap;
use std::cell::RefCell;
use std::mem::take;
use std::rc::Rc;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;

pub(crate) mod traversal;

/// Actual `control flow` part of the control flow graph.
///
/// This type is used instead of hashmap to reduce work related to implementing
/// visitors/
pub(crate) type BlockGraph<'cfg> = FxHashMap<BlockId, Vec<(BlockId, JumpCond<'cfg>)>>;

/// This struct is required for optimizaiotn.
#[derive(Debug)]
pub struct ControlFlowGraph<'cfg> {
    pub(crate) mutations: Box<Mutations>,

    blocks: FxHashMap<BlockId, Block<'cfg>>,

    next: BlockGraph<'cfg>,
    start: BlockId,

    exprs: Vec<ExprData<'cfg>>,

    module_items: &'cfg [ModuleItem],

    blocks_by_index: FxHashMap<usize, BlockId>,
}

/// Public apis.
impl<'cfg> ControlFlowGraph<'cfg> {
    /// The `module` should be `prepared` by calling `ast::prepare`.
    pub(crate) fn anaylze(module: &'cfg Module) -> Self {
        let mut id_gen = BlockIdGenerator::default();
        let cur_id = id_gen.generate();
        let mut analyzer = Analyzer {
            blocks: Default::default(),
            next: Default::default(),
            exprs: Default::default(),
            id_gen: Rc::new(RefCell::new(id_gen)),
            cur_id,
            cur: Default::default(),
            scope: Scope {
                parent: None,
                ids_by_label: Default::default(),
            },
        };

        let mut blocks_by_index = FxHashMap::default();
        for (idx, stmt) in module.body.iter().enumerate() {
            let block_id = analyzer.emit_module_item(stmt);

            blocks_by_index.insert(idx, block_id);
        }
        analyzer.bump();

        Self {
            blocks: analyzer.blocks,
            next: analyzer.next,
            start: cur_id,
            exprs: analyzer.exprs,
            module_items: &module.body,
            blocks_by_index,
            mutations: Default::default(),
        }
    }
}
#[derive(Debug)]
struct Analyzer<'cfg, 'a> {
    blocks: FxHashMap<BlockId, Block<'cfg>>,
    next: BlockGraph<'cfg>,
    exprs: Vec<ExprData<'cfg>>,
    id_gen: Rc<RefCell<BlockIdGenerator>>,
    cur_id: BlockId,
    /// TOOD: Make this field generic.
    cur: Block<'cfg>,
    scope: Scope<'a>,
}

impl<'cfg, 'a> Analyzer<'cfg, 'a> {
    fn with_child<F, Ret>(&mut self, op: F) -> Ret
    where
        F: FnOnce(&mut Analyzer) -> Ret,
    {
        let child_scope = self.scope.child();

        let cur = take(&mut self.cur);
        let next = take(&mut self.next);
        let exprs = take(&mut self.exprs);
        let cur_id = self.cur_id;

        let (ret, blocks, cur_id, cur, next, exprs) = {
            let mut child = Analyzer {
                blocks: Default::default(),
                id_gen: self.id_gen.clone(),
                scope: child_scope,
                cur,
                cur_id,
                next,
                exprs,
            };
            let ret = op(&mut child);

            (
                ret,
                child.blocks,
                child.cur_id,
                child.cur,
                child.next,
                child.exprs,
            )
        };

        self.blocks.extend(blocks);

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

impl<'cfg> Analyzer<'cfg, '_> {
    /// Bumps the current id.
    fn bump(&mut self) {
        let from = self.cur_id;

        let cur = take(&mut self.cur);
        self.blocks.insert(from, cur);

        self.cur_id = self.id_gen.borrow_mut().generate();
    }

    fn jump(&mut self, from: BlockId, cond: JumpCond<'cfg>, to: BlockId) {
        assert_ne!(
            from, to,
            "control flow grapg: anaylzer: should not jump to itself"
        );

        self.next.entry(from).or_default().push((to, cond));
    }

    fn jump_cond(&mut self, from: BlockId, test: ExprData<'cfg>, to: BlockId, if_true: bool) {
        self.jump(from, JumpCond::Cond { test, if_true }, to)
    }

    fn jump_if(&mut self, from: BlockId, test: ExprData<'cfg>, to: BlockId) {
        self.jump_cond(from, test, to, true);
    }

    fn jump_if_not(&mut self, from: BlockId, test: ExprData<'cfg>, to: BlockId) {
        self.jump_cond(from, test, to, false);
    }

    fn emit_module_item(&mut self, item: &'cfg ModuleItem) -> BlockId {
        match item {
            // TODO
            ModuleItem::ModuleDecl(_) => self.cur_id,
            ModuleItem::Stmt(s) => self.emit_stmt(s),
        }
    }

    /// Add statement to control flow graph.
    fn emit_stmt(&mut self, s: &'cfg Stmt) -> BlockId {
        let start = self.cur_id;

        self.cur.push(Item::Stmt(s));

        match s {
            Stmt::Debugger(_) | Stmt::Empty(_) => {}
            Stmt::Block(s) => self.emit_block_stmt(s),
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
            Stmt::Expr(expr_stmt) => {
                self.emit_expr(&expr_stmt.expr);
                self.cur.push(Item::Stmt(s))
            }
        }

        start
    }

    fn emit_if_stmt(&mut self, s: &'cfg IfStmt) {
        let start = self.cur_id;
        let test = self.emit_expr(&s.test);

        self.bump();

        let cons = self.emit_stmt(&s.cons);
        self.jump_if(start, test.clone(), cons);

        self.bump();

        if let Some(alt) = &s.alt {
            let alt = self.emit_stmt(&alt);
            self.jump_if_not(start, test, alt);
        } else {
            let next_line = self.cur_id;
            self.jump_if_not(start, test, next_line);
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
