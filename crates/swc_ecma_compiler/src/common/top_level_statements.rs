//! Utility to add statements to top of program.
//!
//! `TopLevelStatementsStore` contains a `Vec<ModuleItem>`. It is stored on
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
    items: RefCell<Vec<ModuleItem>>,
}

// Public methods
impl TopLevelStatementsStore {
    /// Create new `TopLevelStatementsStore`.
    pub fn new() -> Self {
        Self {
            items: RefCell::new(vec![]),
        }
    }

    /// Add a statement to be inserted at top of program.
    pub fn insert_statement(&self, stmt: Stmt) {
        self.items.borrow_mut().push(ModuleItem::Stmt(stmt));
    }

    /// Add statements to be inserted at top of program.
    pub fn insert_statements<I: IntoIterator<Item = Stmt>>(&self, stmts: I) {
        self.items
            .borrow_mut()
            .extend(stmts.into_iter().map(ModuleItem::Stmt));
    }

    /// Add a module item to be inserted at top of program.
    pub fn insert_module_item(&self, item: ModuleItem) {
        self.items.borrow_mut().push(item);
    }

    /// Add module items to be inserted at top of program.
    pub fn insert_module_items<I: IntoIterator<Item = ModuleItem>>(&self, items: I) {
        self.items.borrow_mut().extend(items);
    }
}

// Internal methods
impl TopLevelStatementsStore {
    /// Insert statements at top of program.
    pub(crate) fn insert_into_program(&self, program: &mut Program) {
        let mut items = self.items.borrow_mut();
        if items.is_empty() {
            return;
        }

        match program {
            Program::Module(module) => {
                // Insert statements before the first non-import statement.
                let index = module
                    .body
                    .iter()
                    .position(|stmt| !matches!(stmt, ModuleItem::ModuleDecl(ModuleDecl::Import(_))))
                    .unwrap_or(module.body.len());

                let new_items: Vec<ModuleItem> = items.drain(..).collect();
                module.body.splice(index..index, new_items);
            }
            Program::Script(script) => {
                // For scripts, convert ModuleItem to Stmt and prepend
                let new_stmts: Vec<Stmt> = items
                    .drain(..)
                    .filter_map(|item| match item {
                        ModuleItem::Stmt(stmt) => Some(stmt),
                        ModuleItem::ModuleDecl(_) => None, // Skip module declarations in scripts
                    })
                    .collect();
                script.body.splice(0..0, new_stmts);
            }
        }
    }

    /// Insert statements at top of script.
    pub(crate) fn insert_into_script(&self, script: &mut Script) {
        let mut items = self.items.borrow_mut();
        if items.is_empty() {
            return;
        }

        // For scripts, convert ModuleItem to Stmt and prepend
        let new_stmts: Vec<Stmt> = items
            .drain(..)
            .filter_map(|item| match item {
                ModuleItem::Stmt(stmt) => Some(stmt),
                ModuleItem::ModuleDecl(_) => None, // Skip module declarations in scripts
            })
            .collect();
        script.body.splice(0..0, new_stmts);
    }
}
