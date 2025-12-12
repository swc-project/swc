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
use swc_common::{util::take::Take, DUMMY_SP};
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
    stmts: FxHashMap<*const Stmt, Vec<AdjacentStmt>>,
}

impl StmtInjectorStore {
    /// Insert a statement before the statement at the given address
    pub fn insert_before(&mut self, address: *const Stmt, stmt: Stmt) {
        self.stmts.entry(address).or_default().push(AdjacentStmt {
            stmt,
            direction: Direction::Before,
        });
    }

    /// Insert a statement after the statement at the given address
    pub fn insert_after(&mut self, address: *const Stmt, stmt: Stmt) {
        self.stmts.entry(address).or_default().push(AdjacentStmt {
            stmt,
            direction: Direction::After,
        });
    }

    /// Insert multiple statements after the statement at the given address
    pub fn insert_many_after(&mut self, address: *const Stmt, stmts: Vec<Stmt>) {
        let entry = self.stmts.entry(address).or_default();
        for stmt in stmts {
            entry.push(AdjacentStmt {
                stmt,
                direction: Direction::After,
            });
        }
    }

    /// Get all statements to be inserted at the given address
    fn take_stmts(&mut self, address: *const Stmt) -> Option<Vec<AdjacentStmt>> {
        self.stmts.remove(&address)
    }
}

impl VisitMutHook<TraverseCtx> for StmtInjector {
    fn enter_arrow_expr(&mut self, node: &mut ArrowExpr, _: &mut TraverseCtx) {
        // We convert the arrow body to a block statement with a return statement
        // because we cannot inject statements after the arrow body.
        if let BlockStmtOrExpr::Expr(expr) = &mut *node.body {
            *node.body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(expr.take()),
                })],
                ..Default::default()
            });
        }
    }

    fn exit_arrow_expr(&mut self, node: &mut ArrowExpr, _: &mut TraverseCtx) {
        if let BlockStmtOrExpr::BlockStmt(block_stmt) = &mut *node.body {
            // If the block statement is something we inserted, we need to
            // convert it back to an expression.
            if block_stmt.span == DUMMY_SP && block_stmt.stmts.len() == 1 {
                if let Stmt::Return(return_stmt) = &mut block_stmt.stmts[0] {
                    if return_stmt.span == DUMMY_SP {
                        *node.body = BlockStmtOrExpr::Expr(return_stmt.arg.take().unwrap());
                    }
                }
            }
        }
    }

    fn exit_module_items(&mut self, node: &mut Vec<ModuleItem>, ctx: &mut TraverseCtx) {
        // First pass: collect all (index, adjacent_stmts) pairs while addresses are
        // valid
        let mut insertions = Vec::new();
        for (i, item) in node.iter().enumerate() {
            // Only process ModuleItem::Stmt variants
            if let ModuleItem::Stmt(stmt) = item {
                let address = stmt as *const Stmt;
                if let Some(adjacent_stmts) = ctx.statement_injector.take_stmts(address) {
                    insertions.push((i, adjacent_stmts));
                }
            }
        }

        // Second pass: process in reverse order to avoid index invalidation
        for (i, adjacent_stmts) in insertions.into_iter().rev() {
            let mut before_stmts = Vec::new();
            let mut after_stmts = Vec::new();

            // Separate statements by direction
            for adjacent in adjacent_stmts {
                match adjacent.direction {
                    Direction::Before => before_stmts.push(adjacent.stmt),
                    Direction::After => after_stmts.push(adjacent.stmt),
                }
            }

            // Insert statements after (insert first since we're going backwards)
            if !after_stmts.is_empty() {
                // Insert all after statements at position i + 1
                for (offset, stmt) in after_stmts.into_iter().enumerate() {
                    node.insert(i + 1 + offset, ModuleItem::Stmt(stmt));
                }
            }

            // Insert statements before
            if !before_stmts.is_empty() {
                // Insert all before statements at position i
                for (offset, stmt) in before_stmts.into_iter().enumerate() {
                    node.insert(i + offset, ModuleItem::Stmt(stmt));
                }
            }
        }
    }

    fn exit_stmts(&mut self, stmts: &mut Vec<Stmt>, ctx: &mut TraverseCtx) {
        // First pass: collect all (index, adjacent_stmts) pairs while addresses are
        // valid
        let mut insertions = Vec::new();
        for (i, stmt) in stmts.iter().enumerate() {
            let address = stmt as *const Stmt;
            if let Some(adjacent_stmts) = ctx.statement_injector.take_stmts(address) {
                insertions.push((i, adjacent_stmts));
            }
        }

        // Second pass: process in reverse order to avoid index invalidation
        for (i, adjacent_stmts) in insertions.into_iter().rev() {
            let mut before_stmts = Vec::new();
            let mut after_stmts = Vec::new();

            // Separate statements by direction
            for adjacent in adjacent_stmts {
                match adjacent.direction {
                    Direction::Before => before_stmts.push(adjacent.stmt),
                    Direction::After => after_stmts.push(adjacent.stmt),
                }
            }

            // Insert statements after (insert first since we're going backwards)
            if !after_stmts.is_empty() {
                // Insert all after statements at position i + 1
                for (offset, stmt) in after_stmts.into_iter().enumerate() {
                    stmts.insert(i + 1 + offset, stmt);
                }
            }

            // Insert statements before
            if !before_stmts.is_empty() {
                // Insert all before statements at position i
                for (offset, stmt) in before_stmts.into_iter().enumerate() {
                    stmts.insert(i + offset, stmt);
                }
            }
        }
    }
}
