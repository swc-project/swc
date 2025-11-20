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

use rustc_hash::FxHashMap;
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
///
/// The key is the address of the statement in the AST, represented as a
/// pointer.
#[derive(Default)]
pub struct StmtInjectorStore {
    /// Map from statement address to adjacent statements to insert
    stmts: FxHashMap<usize, Vec<AdjacentStmt>>,
}

impl StmtInjectorStore {
    /// Insert a statement before the statement at the given address
    pub fn insert_before(&mut self, address: usize, stmt: Stmt) {
        self.stmts.entry(address).or_default().push(AdjacentStmt {
            stmt,
            direction: Direction::Before,
        });
    }

    /// Insert a statement after the statement at the given address
    pub fn insert_after(&mut self, address: usize, stmt: Stmt) {
        self.stmts.entry(address).or_default().push(AdjacentStmt {
            stmt,
            direction: Direction::After,
        });
    }

    /// Insert multiple statements after the statement at the given address
    pub fn insert_many_after(&mut self, address: usize, stmts: Vec<Stmt>) {
        let entry = self.stmts.entry(address).or_default();
        for stmt in stmts {
            entry.push(AdjacentStmt {
                stmt,
                direction: Direction::After,
            });
        }
    }

    /// Get all statements to be inserted at the given address
    fn take_stmts(&mut self, address: usize) -> Option<Vec<AdjacentStmt>> {
        self.stmts.remove(&address)
    }
}

impl VisitMutHook<TraverseCtx> for StmtInjector {
    fn enter_stmts(&mut self, stmts: &mut Vec<Stmt>, ctx: &mut TraverseCtx) {
        let mut i = 0;
        while i < stmts.len() {
            let stmt = &stmts[i];
            let address = stmt as *const Stmt as usize;

            // Check if there are any statements to insert at this address
            if let Some(adjacent_stmts) = ctx.statement_injector.take_stmts(address) {
                let mut before_stmts = Vec::new();
                let mut after_stmts = Vec::new();

                // Separate statements by direction
                for adjacent in adjacent_stmts {
                    match adjacent.direction {
                        Direction::Before => before_stmts.push(adjacent.stmt),
                        Direction::After => after_stmts.push(adjacent.stmt),
                    }
                }

                // Insert statements before
                let before_count = before_stmts.len();
                if before_count > 0 {
                    // Insert all before statements at position i
                    for (offset, stmt) in before_stmts.into_iter().enumerate() {
                        stmts.insert(i + offset, stmt);
                    }
                    // Move index forward by the number of inserted statements
                    i += before_count;
                }

                // Insert statements after
                if !after_stmts.is_empty() {
                    // Insert all after statements at position i + 1
                    for (offset, stmt) in after_stmts.into_iter().enumerate() {
                        stmts.insert(i + 1 + offset, stmt);
                    }
                }
            }

            i += 1;
        }
    }
}
