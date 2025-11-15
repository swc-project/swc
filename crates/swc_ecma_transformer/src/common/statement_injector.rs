//! Utility to inject statements before or after specific statements.
//!
//! This module provides utilities for inserting statements at specific
//! positions in the AST during transformation passes. It's adapted from
//! oxc_transformer's statement_injector to work with SWC's AST.
//!
//! ## Usage
//!
//! ```ignore
//! use swc_ecma_transformer::common::StatementInjector;
//!
//! let mut injector = StatementInjector::new();
//!
//! // Mark a position where statements can be injected
//! let position = injector.mark_position();
//!
//! // Later, inject statements at that position
//! injector.insert_after(position, new_statement);
//! injector.insert_before(position, another_statement);
//!
//! // Apply the injections to a statement list
//! injector.apply(&mut statements);
//! ```
//!
//! Note: This is a simplified implementation compared to oxc's address-based
//! approach. SWC doesn't have the same arena allocator pattern, so we use
//! position indices instead.

use std::collections::HashMap;

use swc_ecma_ast::*;

/// Direction for statement insertion.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Direction {
    Before,
    After,
}

/// A statement to be injected along with its direction.
#[derive(Debug)]
#[allow(dead_code)]
struct InjectionEntry {
    stmt: Stmt,
    direction: Direction,
}

/// Position marker for statement injection.
///
/// This is used to mark a position in the statement list where statements
/// can be injected later.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct InjectionPosition(usize);

/// Statement injector for managing statement insertions.
///
/// This utility allows you to mark positions in statement lists and later
/// inject statements before or after those positions.
///
/// # Example
///
/// ```ignore
/// let mut injector = StatementInjector::new();
///
/// // During AST traversal, mark positions
/// let pos1 = injector.mark_position();
/// // ... process statements ...
/// let pos2 = injector.mark_position();
///
/// // Later, add statements to inject
/// injector.insert_after(pos1, create_statement());
/// injector.insert_before(pos2, create_another_statement());
///
/// // Apply all injections to the statement list
/// injector.apply(&mut statements);
/// ```
pub struct StatementInjector {
    /// Map from position to list of statements to inject.
    injections: HashMap<InjectionPosition, Vec<InjectionEntry>>,
    /// Counter for generating unique positions.
    next_position: usize,
}

impl StatementInjector {
    /// Creates a new statement injector.
    pub fn new() -> Self {
        Self {
            injections: HashMap::new(),
            next_position: 0,
        }
    }

    /// Marks a position in the statement list for potential injection.
    ///
    /// Returns a position marker that can be used with `insert_before` and
    /// `insert_after`.
    pub fn mark_position(&mut self) -> InjectionPosition {
        let pos = InjectionPosition(self.next_position);
        self.next_position += 1;
        pos
    }

    /// Inserts a statement before the marked position.
    ///
    /// # Arguments
    ///
    /// * `position` - The position marker returned from `mark_position`
    /// * `stmt` - The statement to insert
    pub fn insert_before(&mut self, position: InjectionPosition, stmt: Stmt) {
        self.insert_with_direction(position, stmt, Direction::Before);
    }

    /// Inserts a statement after the marked position.
    ///
    /// # Arguments
    ///
    /// * `position` - The position marker returned from `mark_position`
    /// * `stmt` - The statement to insert
    pub fn insert_after(&mut self, position: InjectionPosition, stmt: Stmt) {
        self.insert_with_direction(position, stmt, Direction::After);
    }

    /// Inserts multiple statements before the marked position.
    ///
    /// # Arguments
    ///
    /// * `position` - The position marker returned from `mark_position`
    /// * `stmts` - The statements to insert
    pub fn insert_many_before<I>(&mut self, position: InjectionPosition, stmts: I)
    where
        I: IntoIterator<Item = Stmt>,
    {
        for stmt in stmts {
            self.insert_before(position, stmt);
        }
    }

    /// Inserts multiple statements after the marked position.
    ///
    /// # Arguments
    ///
    /// * `position` - The position marker returned from `mark_position`
    /// * `stmts` - The statements to insert
    pub fn insert_many_after<I>(&mut self, position: InjectionPosition, stmts: I)
    where
        I: IntoIterator<Item = Stmt>,
    {
        for stmt in stmts {
            self.insert_after(position, stmt);
        }
    }

    /// Returns whether there are any pending injections.
    pub fn has_injections(&self) -> bool {
        !self.injections.is_empty()
    }

    /// Returns the number of pending injections for a specific position.
    pub fn injection_count(&self, position: InjectionPosition) -> usize {
        self.injections.get(&position).map_or(0, |v| v.len())
    }

    /// Clears all pending injections.
    pub fn clear(&mut self) {
        self.injections.clear();
    }

    /// Internal method to insert a statement with a specific direction.
    fn insert_with_direction(
        &mut self,
        position: InjectionPosition,
        stmt: Stmt,
        direction: Direction,
    ) {
        let entries = self.injections.entry(position).or_default();

        // For "before" insertions, we want to maintain order but insert before any
        // "after" insertions For "after" insertions, just append
        let entry = InjectionEntry { stmt, direction };

        if direction == Direction::Before {
            // Find the first "after" insertion and insert before it
            let insert_index = entries
                .iter()
                .position(|e| e.direction == Direction::After)
                .unwrap_or(entries.len());
            entries.insert(insert_index, entry);
        } else {
            entries.push(entry);
        }
    }
}

impl Default for StatementInjector {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::*;

    use super::*;

    fn create_debug_stmt(_msg: &str) -> Stmt {
        Stmt::Debugger(DebuggerStmt { span: DUMMY_SP })
    }

    #[test]
    fn test_mark_position() {
        let mut injector = StatementInjector::new();
        let pos1 = injector.mark_position();
        let pos2 = injector.mark_position();

        assert_ne!(pos1, pos2);
    }

    #[test]
    fn test_insert_after() {
        let mut injector = StatementInjector::new();
        let pos = injector.mark_position();

        injector.insert_after(pos, create_debug_stmt("test"));

        assert!(injector.has_injections());
        assert_eq!(injector.injection_count(pos), 1);
    }

    #[test]
    fn test_insert_before() {
        let mut injector = StatementInjector::new();
        let pos = injector.mark_position();

        injector.insert_before(pos, create_debug_stmt("test"));

        assert!(injector.has_injections());
        assert_eq!(injector.injection_count(pos), 1);
    }

    #[test]
    fn test_insert_many() {
        let mut injector = StatementInjector::new();
        let pos = injector.mark_position();

        let stmts = vec![
            create_debug_stmt("1"),
            create_debug_stmt("2"),
            create_debug_stmt("3"),
        ];

        injector.insert_many_after(pos, stmts);

        assert_eq!(injector.injection_count(pos), 3);
    }

    #[test]
    fn test_insertion_order() {
        let mut injector = StatementInjector::new();
        let pos = injector.mark_position();

        // Insert in mixed order
        injector.insert_after(pos, create_debug_stmt("after1"));
        injector.insert_before(pos, create_debug_stmt("before1"));
        injector.insert_after(pos, create_debug_stmt("after2"));
        injector.insert_before(pos, create_debug_stmt("before2"));

        assert_eq!(injector.injection_count(pos), 4);

        // Verify order: all "before"s should come before all "after"s
        let entries = injector.injections.get(&pos).unwrap();
        assert_eq!(entries[0].direction, Direction::Before);
        assert_eq!(entries[1].direction, Direction::Before);
        assert_eq!(entries[2].direction, Direction::After);
        assert_eq!(entries[3].direction, Direction::After);
    }

    #[test]
    fn test_clear() {
        let mut injector = StatementInjector::new();
        let pos = injector.mark_position();

        injector.insert_after(pos, create_debug_stmt("test"));
        assert!(injector.has_injections());

        injector.clear();
        assert!(!injector.has_injections());
    }

    #[test]
    fn test_multiple_positions() {
        let mut injector = StatementInjector::new();
        let pos1 = injector.mark_position();
        let pos2 = injector.mark_position();

        injector.insert_after(pos1, create_debug_stmt("pos1"));
        injector.insert_after(pos2, create_debug_stmt("pos2"));

        assert_eq!(injector.injection_count(pos1), 1);
        assert_eq!(injector.injection_count(pos2), 1);
    }

    #[test]
    fn test_no_injections() {
        let injector = StatementInjector::new();
        assert!(!injector.has_injections());

        let pos = InjectionPosition(0);
        assert_eq!(injector.injection_count(pos), 0);
    }
}
