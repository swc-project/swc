//! Utility to add new statements before or after the specified statement.
//!
//! `StatementInjectorStore` contains a `FxHashMap<usize,
//! Vec<AdjacentStatement>>`. It is stored on `TransformCtx`.
//!
//! The store inserts new statements before or after a statement which is
//! determined by the index of the statement.
//!
//! Other transforms can add statements to the store with following methods:
//!
//! ```rs
//! self.ctx.statement_injector.insert_before(index, statement);
//! self.ctx.statement_injector.insert_after(index, statement);
//! self.ctx.statement_injector.insert_many_after(index, statements);
//! ```

use std::{cell::RefCell, collections::hash_map::Entry};

use rustc_hash::FxHashMap;
use swc_ecma_ast::*;

use crate::context::TraverseCtx;

#[derive(Debug)]
enum Direction {
    Before,
    After,
}

#[derive(Debug)]
struct AdjacentStatement {
    stmt: Stmt,
    direction: Direction,
}

/// Store for statements to be added to the statements.
pub struct StatementInjectorStore {
    insertions: RefCell<FxHashMap<usize, Vec<AdjacentStatement>>>,
}

// Public methods
impl StatementInjectorStore {
    /// Create new `StatementInjectorStore`.
    pub fn new() -> Self {
        Self {
            insertions: RefCell::new(FxHashMap::default()),
        }
    }
}

// Insertion methods.
impl StatementInjectorStore {
    /// Add a statement to be inserted immediately before the target statement.
    #[inline]
    pub fn insert_before(&self, target: usize, stmt: Stmt) {
        let mut insertions = self.insertions.borrow_mut();
        let adjacent_stmts = insertions.entry(target).or_default();
        let index = adjacent_stmts
            .iter()
            .position(|s| matches!(s.direction, Direction::After))
            .unwrap_or(adjacent_stmts.len());
        adjacent_stmts.insert(
            index,
            AdjacentStatement {
                stmt,
                direction: Direction::Before,
            },
        );
    }

    /// Add a statement to be inserted immediately after the target statement.
    #[inline]
    pub fn insert_after(&self, target: usize, stmt: Stmt) {
        let mut insertions = self.insertions.borrow_mut();
        let adjacent_stmts = insertions.entry(target).or_default();
        adjacent_stmts.push(AdjacentStatement {
            stmt,
            direction: Direction::After,
        });
    }

    /// Add multiple statements to be inserted immediately before the target
    /// statement.
    #[inline]
    pub fn insert_many_before<S>(&self, target: usize, stmts: S)
    where
        S: IntoIterator<Item = Stmt>,
    {
        let mut insertions = self.insertions.borrow_mut();
        let adjacent_stmts = insertions.entry(target).or_default();
        adjacent_stmts.splice(
            0..0,
            stmts.into_iter().map(|stmt| AdjacentStatement {
                stmt,
                direction: Direction::Before,
            }),
        );
    }

    /// Add multiple statements to be inserted immediately after the target
    /// statement.
    #[inline]
    pub fn insert_many_after<S>(&self, target: usize, stmts: S)
    where
        S: IntoIterator<Item = Stmt>,
    {
        let mut insertions = self.insertions.borrow_mut();
        let adjacent_stmts = insertions.entry(target).or_default();
        adjacent_stmts.extend(stmts.into_iter().map(|stmt| AdjacentStatement {
            stmt,
            direction: Direction::After,
        }));
    }

    /// Move insertions from one index to another.
    ///
    /// Use this if you convert one statement to another, and other code may
    /// have attached insertions to the original statement.
    #[inline]
    pub fn move_insertions(&self, old_target: usize, new_target: usize) {
        let mut insertions = self.insertions.borrow_mut();
        let Some(mut adjacent_stmts) = insertions.remove(&old_target) else {
            return;
        };

        match insertions.entry(new_target) {
            Entry::Occupied(entry) => {
                entry.into_mut().append(&mut adjacent_stmts);
            }
            Entry::Vacant(entry) => {
                entry.insert(adjacent_stmts);
            }
        }
    }
}

// Internal methods
impl StatementInjectorStore {
    /// Insert statements immediately before / after the target statement.
    pub(crate) fn insert_into_statements(&self, statements: &mut Vec<Stmt>, _ctx: &TraverseCtx) {
        let mut insertions = self.insertions.borrow_mut();
        if insertions.is_empty() {
            return;
        }

        // Calculate indices for all statements
        let indices: Vec<usize> = (0..statements.len()).collect();

        let new_statement_count = indices
            .iter()
            .filter_map(|&idx| insertions.get(&idx).map(Vec::len))
            .sum::<usize>();
        if new_statement_count == 0 {
            return;
        }

        let mut new_statements = Vec::with_capacity(statements.len() + new_statement_count);

        for (idx, stmt) in statements.drain(..).enumerate() {
            match insertions.remove(&idx) {
                Some(mut adjacent_stmts) => {
                    let first_after_stmt_index = adjacent_stmts
                        .iter()
                        .position(|s| matches!(s.direction, Direction::After))
                        .unwrap_or(adjacent_stmts.len());
                    if first_after_stmt_index != 0 {
                        let right = adjacent_stmts.split_off(first_after_stmt_index);
                        new_statements.extend(adjacent_stmts.into_iter().map(|s| s.stmt));
                        new_statements.push(stmt);
                        new_statements.extend(right.into_iter().map(|s| s.stmt));
                    } else {
                        new_statements.push(stmt);
                        new_statements.extend(adjacent_stmts.into_iter().map(|s| s.stmt));
                    }
                }
                _ => {
                    new_statements.push(stmt);
                }
            }
        }

        *statements = new_statements;
    }

    // Assertion for checking if no remaining insertions are left.
    // `#[inline(always)]` because this is a no-op in release mode
    #[expect(clippy::inline_always)]
    #[inline(always)]
    pub(crate) fn assert_no_insertions_remaining(&self) {
        debug_assert!(self.insertions.borrow().is_empty());
    }
}
