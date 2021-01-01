use std::cell::RefCell;
use std::rc::Rc;
use swc_ecma_ast::*;

#[derive(Debug, Clone)]
pub(crate) enum JumpCond<'a> {
    Cond { test: ExprData<'a>, if_true: bool },
}

#[derive(Debug, Clone)]
pub(crate) struct ExprData<'a> {
    pub index: usize,
    pub ast: &'a Expr,
    pub value: Rc<RefCell<Option<Lit>>>,
}

#[derive(Debug, Clone)]
pub(crate) enum Item<'a> {
    ModuleItem(&'a ModuleItem),
    Stmt(&'a Stmt),
    Expr(ExprData<'a>),
}

/// Basic block.
#[derive(Debug)]
pub(crate) struct Block<'a> {
    data: Vec<Item<'a>>,
}

impl<'a> Block<'a> {
    pub fn push(&mut self, item: Item<'a>) {
        self.data.push(item)
    }
}

impl Default for Block<'_> {
    fn default() -> Self {
        Block {
            data: Default::default(),
        }
    }
}
