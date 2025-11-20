//! Utility transform to add new statements before or after the specified
//! statement.
//!
//! `StatementInjectorStore` contains a `FxHashMap<Address,
//! Vec<AdjacentStatement>>`. It is stored on `TransformCtx`.
//!
//! `StatementInjector` transform inserts new statements before or after a
//! statement which is determined by the address of the statement.
//!
//! Other transforms can add statements to the store with following methods:
//!
//! ```rs
//! self.ctx.statement_injector.insert_before(address, statement);
//! self.ctx.statement_injector.insert_after(address, statement);
//! self.ctx.statement_injector.insert_many_after(address, statements);
//! ```

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
pub struct StmtInjector {}

#[derive(Debug)]
enum Direction {
    Before,
    After,
}

#[derive(Debug)]
struct AdjacentStmt {
    stmt: Stmt,
    direction: Direction,
}

/// Store for Stmts to be added to the Stmts.
#[derive(Default)]
pub struct StmtInjectorStore {}

impl VisitMutHook<TraverseCtx> for StmtInjector {}
