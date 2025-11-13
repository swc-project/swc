//! Utility to add `var` or `let` declarations to top of statement blocks.
//!
//! `VarDeclarationsStore` contains a stack of `Declarators`, each comprising
//! 2 x `Vec<VarDeclarator>` (1 for `var`s, 1 for `let`s).
//! `VarDeclarationsStore` is stored on `TransformCtx`.
//!
//! The store manages inserting `var` / `let` statements at the top of blocks.
//!
//! Other transforms can add declarators to the store by calling methods of
//! `VarDeclarationsStore`:
//!
//! ```rs
//! self.ctx.var_declarations.insert_var(name, binding, None, ctx);
//! self.ctx.var_declarations.insert_let(name2, binding2, None, ctx);
//! ```

use std::cell::RefCell;

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

use crate::context::{TransformCtx, TraverseCtx};

/// Store for `VarDeclarator`s to be added to enclosing statement block.
pub struct VarDeclarationsStore {
    stack: RefCell<Vec<Option<Declarators>>>,
    next_temp_id: RefCell<usize>,
}

/// Declarators to be inserted in a statement block.
struct Declarators {
    var_declarators: Vec<VarDeclarator>,
    let_declarators: Vec<VarDeclarator>,
}

impl Declarators {
    fn new() -> Self {
        Self {
            var_declarators: vec![],
            let_declarators: vec![],
        }
    }
}

// Public methods
impl VarDeclarationsStore {
    /// Create new `VarDeclarationsStore`.
    pub fn new() -> Self {
        Self {
            stack: RefCell::new(vec![]),
            next_temp_id: RefCell::new(0),
        }
    }

    /// Get next temporary variable ID for unique naming
    pub(crate) fn get_next_temp_id(&self) -> usize {
        let mut id = self.next_temp_id.borrow_mut();
        let current = *id;
        *id += 1;
        current
    }

    /// Add a `var` declaration to be inserted at top of current enclosing
    /// statement block, given a binding name.
    #[inline]
    pub fn insert_var(&self, name: &str, init: Option<Expr>) {
        let pattern = Pat::Ident(BindingIdent::from(Ident::new(name.into(), DUMMY_SP)));
        self.insert_var_binding_pattern(pattern, init);
    }

    /// Add a `var` declaration with the given init expression to be inserted at
    /// top of current enclosing statement block.
    #[inline]
    pub fn insert_var_with_init(&self, name: &str, init: Expr) {
        let pattern = Pat::Ident(BindingIdent::from(Ident::new(name.into(), DUMMY_SP)));
        self.insert_var_binding_pattern(pattern, Some(init));
    }

    /// Create a new UID based on `name`, add a `var` declaration to be inserted
    /// at the top of the current enclosing statement block, and return the
    /// binding name.
    #[inline]
    pub fn create_uid_var(&self, name: &str) -> String {
        let uid = format!("_{}_{}", name, self.get_next_temp_id());
        self.insert_var(&uid, None);
        uid
    }

    /// Create a new UID based on `name`, add a `var` declaration with the given
    /// init expression to be inserted at the top of the current enclosing
    /// statement block, and return the binding name.
    #[inline]
    pub fn create_uid_var_with_init(&self, name: &str, expression: Expr) -> String {
        let uid = format!("_{}_{}", name, self.get_next_temp_id());
        self.insert_var_with_init(&uid, expression);
        uid
    }

    /// Add a `let` declaration to be inserted at top of current enclosing
    /// statement block.
    pub fn insert_let(&self, name: &str, init: Option<Expr>) {
        let pattern = Pat::Ident(BindingIdent::from(Ident::new(name.into(), DUMMY_SP)));
        self.insert_let_binding_pattern(pattern, init);
    }

    /// Add a `var` declaration to be inserted at top of current enclosing
    /// statement block, given a `Pat`.
    pub fn insert_var_binding_pattern(&self, ident: Pat, init: Option<Expr>) {
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: ident,
            init: init.map(Box::new),
            definite: false,
        };
        self.insert_var_declarator(declarator);
    }

    /// Add a `let` declaration to be inserted at top of current enclosing
    /// statement block, given a `Pat`.
    pub fn insert_let_binding_pattern(&self, ident: Pat, init: Option<Expr>) {
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: ident,
            init: init.map(Box::new),
            definite: false,
        };
        self.insert_let_declarator(declarator);
    }

    /// Add a `var` declaration to be inserted at top of current enclosing
    /// statement block.
    pub fn insert_var_declarator(&self, declarator: VarDeclarator) {
        let mut stack = self.stack.borrow_mut();
        if stack.is_empty() {
            stack.push(Some(Declarators::new()));
        }
        let declarators = stack
            .last_mut()
            .and_then(|opt| opt.as_mut())
            .unwrap_or_else(|| {
                *stack.last_mut().unwrap() = Some(Declarators::new());
                stack.last_mut().unwrap().as_mut().unwrap()
            });
        declarators.var_declarators.push(declarator);
    }

    /// Add a `let` declaration to be inserted at top of current enclosing
    /// statement block.
    pub fn insert_let_declarator(&self, declarator: VarDeclarator) {
        let mut stack = self.stack.borrow_mut();
        if stack.is_empty() {
            stack.push(Some(Declarators::new()));
        }
        let declarators = stack
            .last_mut()
            .and_then(|opt| opt.as_mut())
            .unwrap_or_else(|| {
                *stack.last_mut().unwrap() = Some(Declarators::new());
                stack.last_mut().unwrap().as_mut().unwrap()
            });
        declarators.let_declarators.push(declarator);
    }
}

// Internal methods
impl VarDeclarationsStore {
    /// Record entering a new statement block
    pub(crate) fn record_entering_statements(&self) {
        let mut stack = self.stack.borrow_mut();
        stack.push(None);
    }

    /// Insert declarations into statements
    pub(crate) fn insert_into_statements(&self, stmts: &mut Vec<Stmt>, _ctx: &TraverseCtx) {
        if let Some((var_statement, let_statement)) = self.get_var_statement() {
            let mut new_stmts = Vec::with_capacity(stmts.len() + 2);
            match (var_statement, let_statement) {
                (Some(var_statement), Some(let_statement)) => {
                    // Insert `var` and `let` statements
                    new_stmts.extend([var_statement, let_statement]);
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

    /// Insert declarations into program
    pub(crate) fn insert_into_program(&self, transform_ctx: &TransformCtx, _ctx: &TraverseCtx) {
        if let Some((var_statement, let_statement)) = self.get_var_statement() {
            // Delegate to `TopLevelStatements`
            transform_ctx
                .top_level_statements
                .insert_statements(var_statement.into_iter().chain(let_statement));
        }

        // Check stack is exhausted
        let stack = self.stack.borrow();
        debug_assert!(stack.is_empty() || stack.iter().all(|opt| opt.is_none()));
    }

    #[inline]
    fn get_var_statement(&self) -> Option<(Option<Stmt>, Option<Stmt>)> {
        let mut stack = self.stack.borrow_mut();
        let declarators = stack.pop()??;

        let Declarators {
            var_declarators,
            let_declarators,
        } = declarators;

        let var_statement = (!var_declarators.is_empty())
            .then(|| Self::create_declaration(VarDeclKind::Var, var_declarators));
        let let_statement = (!let_declarators.is_empty())
            .then(|| Self::create_declaration(VarDeclKind::Let, let_declarators));

        Some((var_statement, let_statement))
    }

    fn create_declaration(kind: VarDeclKind, declarators: Vec<VarDeclarator>) -> Stmt {
        Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind,
            declare: false,
            decls: declarators,
        })))
    }
}
