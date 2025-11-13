//! Utility to add statements to top of program.
//!
//! `TopLevelStatementsStore` contains a `Vec<Stmt>`. It is stored on
//! `TransformCtx`.
//!
//! The store inserts statements at the top of the program, after any existing
//! `import` statements.
//!
//! Other transforms can add statements to the store with
//! `TopLevelStatementsStore::insert_statement`:
//!
//! ```rs
//! self.ctx.top_level_statements.insert_statement(stmt);
//! ```

use std::cell::RefCell;

use swc_ecma_ast::*;

/// Store for statements to be added at top of program
pub struct TopLevelStatementsStore {
    stmts: RefCell<Vec<Stmt>>,
}

// Public methods
impl TopLevelStatementsStore {
    /// Create new `TopLevelStatementsStore`.
    pub fn new() -> Self {
        Self {
            stmts: RefCell::new(vec![]),
        }
    }

    /// Add a statement to be inserted at top of program.
    pub fn insert_statement(&self, stmt: Stmt) {
        self.stmts.borrow_mut().push(stmt);
    }

    /// Add statements to be inserted at top of program.
    pub fn insert_statements<I: IntoIterator<Item = Stmt>>(&self, stmts: I) {
        self.stmts.borrow_mut().extend(stmts);
    }
}

// Internal methods
impl TopLevelStatementsStore {
    /// Insert statements at top of program.
    pub(crate) fn insert_into_program(&self, program: &mut Program) {
        let mut stmts = self.stmts.borrow_mut();
        if stmts.is_empty() {
            return;
        }

        let body = match program {
            Program::Module(module) => &mut module.body,
            Program::Script(script) => &mut script.body,
        };

        // Insert statements before the first non-import statement.
        let index = body
            .iter()
            .position(|stmt| !matches!(stmt, ModuleItem::ModuleDecl(ModuleDecl::Import(_))))
            .unwrap_or(body.len());

        // Convert Stmt to ModuleItem for insertion
        let new_items: Vec<ModuleItem> =
            stmts.drain(..).map(|stmt| ModuleItem::Stmt(stmt)).collect();

        body.splice(index..index, new_items);
    }

    /// Insert statements at top of script.
    pub(crate) fn insert_into_script(&self, script: &mut Script) {
        let mut stmts = self.stmts.borrow_mut();
        if stmts.is_empty() {
            return;
        }

        // For scripts, just prepend the statements
        let new_stmts: Vec<Stmt> = stmts.drain(..).collect();
        script.body.splice(0..0, new_stmts);
    }
}
