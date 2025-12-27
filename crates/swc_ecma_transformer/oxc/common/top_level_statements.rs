//! Utility transform to add statements to top of program.
//!
//! `TopLevelStatementsStore` contains a `Vec<Statement>`. It is stored on `TransformCtx`.
//!
//! `TopLevelStatements` transform inserts those statements at top of program.
//!
//! Other transforms can add statements to the store with `TopLevelStatementsStore::insert_statement`:
//!
//! ```rs
//! self.ctx.top_level_statements.insert_statement(stmt);
//! ```

use std::cell::RefCell;

use oxc_ast::ast::*;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

/// Transform that inserts any statements which have been requested insertion via `TopLevelStatementsStore`
/// to top of the program.
///
/// Insertions are made after any existing `import` statements.
///
/// Must run after all other transforms.
pub struct TopLevelStatements<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> TopLevelStatements<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for TopLevelStatements<'a, '_> {
    fn exit_program(&mut self, program: &mut Program<'a>, _ctx: &mut TraverseCtx<'a>) {
        self.ctx.top_level_statements.insert_into_program(program);
    }
}

/// Store for statements to be added at top of program
pub struct TopLevelStatementsStore<'a> {
    stmts: RefCell<Vec<Statement<'a>>>,
}

// Public methods
impl<'a> TopLevelStatementsStore<'a> {
    /// Create new `TopLevelStatementsStore`.
    pub fn new() -> Self {
        Self { stmts: RefCell::new(vec![]) }
    }

    /// Add a statement to be inserted at top of program.
    pub fn insert_statement(&self, stmt: Statement<'a>) {
        self.stmts.borrow_mut().push(stmt);
    }

    /// Add statements to be inserted at top of program.
    pub fn insert_statements<I: IntoIterator<Item = Statement<'a>>>(&self, stmts: I) {
        self.stmts.borrow_mut().extend(stmts);
    }
}

// Internal methods
impl<'a> TopLevelStatementsStore<'a> {
    /// Insert statements at top of program.
    fn insert_into_program(&self, program: &mut Program<'a>) {
        let mut stmts = self.stmts.borrow_mut();
        if stmts.is_empty() {
            return;
        }

        // Insert statements before the first non-import statement.
        let index = program
            .body
            .iter()
            .position(|stmt| !matches!(stmt, Statement::ImportDeclaration(_)))
            .unwrap_or(program.body.len());

        program.body.splice(index..index, stmts.drain(..));
    }
}
