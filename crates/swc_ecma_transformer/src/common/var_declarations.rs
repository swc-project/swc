//! Utility transform to add `var` or `let` declarations to top of statement
//! blocks.
//!
//! `VarDeclarationsStore` contains a stack of `Declarators`, each comprising
//! 2 x `Vec<VarDeclarator>` (1 for `var`s, 1 for `let`s).
//! `VarDeclarationsStore` is stored on `TraverseCtx`.
//!
//! `VarDeclarations` transform pushes an empty entry onto this stack when
//! entering a statement block, and when exiting the block, writes `var` / `let`
//! statements to top of block.
//!
//! Other transforms can add declarators to the store by calling methods of
//! `VarDeclarationsStore`:
//!
//! ```rs
//! ctx.var_declarations.insert_var(ident, None, ctx);
//! ctx.var_declarations.insert_let(ident, Some(init), ctx);
//! ```

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

/// Transform that maintains the stack of `Vec<VarDeclarator>`s, and adds a
/// `var` statement to top of a statement block if another transform has
/// requested that.
///
/// Must run after all other transforms.
#[derive(Debug, Default)]
pub struct VarDeclarations;

impl VisitMutHook<TraverseCtx> for VarDeclarations {
    fn enter_stmts(&mut self, _stmts: &mut Vec<Stmt>, ctx: &mut TraverseCtx) {
        ctx.var_declarations.record_entering_stmts();
    }

    fn exit_stmts(&mut self, stmts: &mut Vec<Stmt>, ctx: &mut TraverseCtx) {
        ctx.var_declarations.insert_into_stmts(stmts);
    }

    fn enter_module_items(&mut self, _items: &mut Vec<ModuleItem>, ctx: &mut TraverseCtx) {
        ctx.var_declarations.record_entering_stmts();
    }

    fn exit_module_items(&mut self, items: &mut Vec<ModuleItem>, ctx: &mut TraverseCtx) {
        ctx.var_declarations.insert_into_module_items(items);
    }
}

/// Store for `VarDeclarator`s to be added to enclosing statement block.
#[derive(Default, Debug)]
pub struct VarDeclarationsStore {
    stack: Vec<Option<Declarators>>,
}

/// Declarators to be inserted in a statement block.
#[derive(Debug)]
struct Declarators {
    var_declarators: Vec<VarDeclarator>,
    let_declarators: Vec<VarDeclarator>,
}

impl Default for Declarators {
    fn default() -> Self {
        Self {
            var_declarators: Vec::new(),
            let_declarators: Vec::new(),
        }
    }
}

// Public methods
impl VarDeclarationsStore {
    /// Create new `VarDeclarationsStore`.
    pub fn new() -> Self {
        Self { stack: Vec::new() }
    }

    /// Add a `var` declaration to be inserted at top of current enclosing
    /// statement block, given a `BindingIdent`.
    #[inline]
    pub fn insert_var(&mut self, ident: BindingIdent, init: Option<Box<Expr>>) {
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(ident),
            init,
            definite: false,
        };
        self.insert_var_declarator(declarator);
    }

    /// Add a `let` declaration to be inserted at top of current enclosing
    /// statement block, given a `BindingIdent`.
    #[inline]
    pub fn insert_let(&mut self, ident: BindingIdent, init: Option<Box<Expr>>) {
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(ident),
            init,
            definite: false,
        };
        self.insert_let_declarator(declarator);
    }

    /// Add a `var` declaration to be inserted at top of current enclosing
    /// statement block, given a `Pat`.
    #[inline]
    pub fn insert_var_pattern(&mut self, pattern: Pat, init: Option<Box<Expr>>) {
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: pattern,
            init,
            definite: false,
        };
        self.insert_var_declarator(declarator);
    }

    /// Add a `let` declaration to be inserted at top of current enclosing
    /// statement block, given a `Pat`.
    #[inline]
    pub fn insert_let_pattern(&mut self, pattern: Pat, init: Option<Box<Expr>>) {
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: pattern,
            init,
            definite: false,
        };
        self.insert_let_declarator(declarator);
    }

    /// Add a `var` declaration to be inserted at top of current enclosing
    /// statement block.
    pub fn insert_var_declarator(&mut self, declarator: VarDeclarator) {
        if let Some(last) = self.stack.last_mut() {
            let declarators = last.get_or_insert_with(Declarators::default);
            declarators.var_declarators.push(declarator);
        }
    }

    /// Add a `let` declaration to be inserted at top of current enclosing
    /// statement block.
    pub fn insert_let_declarator(&mut self, declarator: VarDeclarator) {
        if let Some(last) = self.stack.last_mut() {
            let declarators = last.get_or_insert_with(Declarators::default);
            declarators.let_declarators.push(declarator);
        }
    }
}

// Internal methods
impl VarDeclarationsStore {
    fn record_entering_stmts(&mut self) {
        self.stack.push(None);
    }

    fn insert_into_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        if let Some((var_statement, let_statement)) = self.get_var_statement() {
            let mut new_stmts = Vec::with_capacity(stmts.len() + 2);

            match (var_statement, let_statement) {
                (Some(var_statement), Some(let_statement)) => {
                    // Insert `var` and `let` statements
                    new_stmts.push(var_statement);
                    new_stmts.push(let_statement);
                }
                (Some(statement), None) | (None, Some(statement)) => {
                    // Insert `var` or `let` statement
                    new_stmts.push(statement);
                }
                (None, None) => return,
            }

            new_stmts.append(stmts);
            *stmts = new_stmts;
        }
    }

    fn insert_into_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        if let Some((var_statement, let_statement)) = self.get_var_statement() {
            let mut new_items = Vec::with_capacity(items.len() + 2);

            match (var_statement, let_statement) {
                (Some(var_statement), Some(let_statement)) => {
                    // Insert `var` and `let` statements
                    new_items.push(ModuleItem::Stmt(var_statement));
                    new_items.push(ModuleItem::Stmt(let_statement));
                }
                (Some(statement), None) | (None, Some(statement)) => {
                    // Insert `var` or `let` statement
                    new_items.push(ModuleItem::Stmt(statement));
                }
                (None, None) => return,
            }

            new_items.append(items);
            *items = new_items;
        }
    }

    #[inline]
    fn get_var_statement(&mut self) -> Option<(Option<Stmt>, Option<Stmt>)> {
        let declarators = self.stack.pop()??;

        let var_statement = (!declarators.var_declarators.is_empty())
            .then(|| Self::create_declaration(VarDeclKind::Var, declarators.var_declarators));
        let let_statement = (!declarators.let_declarators.is_empty())
            .then(|| Self::create_declaration(VarDeclKind::Let, declarators.let_declarators));

        Some((var_statement, let_statement))
    }

    fn create_declaration(kind: VarDeclKind, declarators: Vec<VarDeclarator>) -> Stmt {
        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind,
            decls: declarators,
            ..Default::default()
        })))
    }
}
