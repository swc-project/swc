//! Utility for managing variable declarations.
//!
//! This module provides utilities for creating and managing variable
//! declarations to be inserted at the top of statement blocks. It's adapted
//! from oxc_transformer's var_declarations module to work with SWC's AST.
//!
//! ## Usage
//!
//! ```ignore
//! use swc_ecma_transformer::common::VarDeclarations;
//!
//! let mut var_decls = VarDeclarations::new();
//!
//! // Add a var declaration
//! var_decls.insert_var("_temp", None);
//!
//! // Add a var declaration with initialization
//! var_decls.insert_var("_result", Some(some_expression));
//!
//! // Add a let declaration
//! var_decls.insert_let("_value", None);
//!
//! // Get the declarations to insert at the top of a block
//! if let Some(decl_stmt) = var_decls.build_var_stmt() {
//!     statements.insert(0, decl_stmt);
//! }
//! if let Some(decl_stmt) = var_decls.build_let_stmt() {
//!     statements.insert(0, decl_stmt);
//! }
//! ```

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

/// Manager for variable declarations to be inserted at the top of a scope.
///
/// This utility collects variable declarations during transformation passes
/// and allows building declaration statements to be inserted at the top
/// of statement blocks.
///
/// # Example
///
/// ```ignore
/// let mut var_decls = VarDeclarations::new();
///
/// // Collect declarations during transformation
/// var_decls.insert_var("_temp", None);
/// var_decls.insert_var("_result", Some(result_expr));
/// var_decls.insert_let("_value", Some(value_expr));
///
/// // Build and insert at the top of a block
/// let mut new_stmts = Vec::new();
/// if let Some(var_stmt) = var_decls.build_var_stmt() {
///     new_stmts.push(var_stmt);
/// }
/// if let Some(let_stmt) = var_decls.build_let_stmt() {
///     new_stmts.push(let_stmt);
/// }
/// new_stmts.extend(existing_statements);
/// ```
pub struct VarDeclarations {
    /// Declarators for `var` statements.
    var_declarators: Vec<VarDeclarator>,
    /// Declarators for `let` statements.
    let_declarators: Vec<VarDeclarator>,
}

impl VarDeclarations {
    /// Creates a new variable declarations manager.
    pub fn new() -> Self {
        Self {
            var_declarators: Vec::new(),
            let_declarators: Vec::new(),
        }
    }

    /// Adds a `var` declaration.
    ///
    /// # Arguments
    ///
    /// * `name` - The variable name
    /// * `init` - Optional initialization expression
    ///
    /// # Example
    ///
    /// ```ignore
    /// var_decls.insert_var("_temp", None);
    /// var_decls.insert_var("_result", Some(expr));
    /// ```
    pub fn insert_var(&mut self, name: impl Into<String>, init: Option<Box<Expr>>) {
        let pat = Pat::Ident(BindingIdent {
            id: Ident::new(name.into().into(), DUMMY_SP, Default::default()),
            type_ann: None,
        });

        self.var_declarators.push(VarDeclarator {
            span: DUMMY_SP,
            name: pat,
            init,
            definite: false,
        });
    }

    /// Adds a `let` declaration.
    ///
    /// # Arguments
    ///
    /// * `name` - The variable name
    /// * `init` - Optional initialization expression
    ///
    /// # Example
    ///
    /// ```ignore
    /// var_decls.insert_let("_value", None);
    /// var_decls.insert_let("_count", Some(expr));
    /// ```
    pub fn insert_let(&mut self, name: impl Into<String>, init: Option<Box<Expr>>) {
        let pat = Pat::Ident(BindingIdent {
            id: Ident::new(name.into().into(), DUMMY_SP, Default::default()),
            type_ann: None,
        });

        self.let_declarators.push(VarDeclarator {
            span: DUMMY_SP,
            name: pat,
            init,
            definite: false,
        });
    }

    /// Adds a `const` declaration.
    ///
    /// Note: This creates a `let` declaration internally, as const declarations
    /// must have initializers.
    ///
    /// # Arguments
    ///
    /// * `name` - The variable name
    /// * `init` - Initialization expression (required for const)
    pub fn insert_const(&mut self, name: impl Into<String>, init: Box<Expr>) {
        self.insert_let(name, Some(init));
    }

    /// Adds a `var` declarator directly.
    ///
    /// This allows more control over the pattern and initialization.
    pub fn insert_var_declarator(&mut self, declarator: VarDeclarator) {
        self.var_declarators.push(declarator);
    }

    /// Adds a `let` declarator directly.
    ///
    /// This allows more control over the pattern and initialization.
    pub fn insert_let_declarator(&mut self, declarator: VarDeclarator) {
        self.let_declarators.push(declarator);
    }

    /// Returns whether there are any `var` declarations.
    pub fn has_var_declarations(&self) -> bool {
        !self.var_declarators.is_empty()
    }

    /// Returns whether there are any `let` declarations.
    pub fn has_let_declarations(&self) -> bool {
        !self.let_declarators.is_empty()
    }

    /// Returns whether there are any declarations at all.
    pub fn has_declarations(&self) -> bool {
        self.has_var_declarations() || self.has_let_declarations()
    }

    /// Returns the number of `var` declarations.
    pub fn var_count(&self) -> usize {
        self.var_declarators.len()
    }

    /// Returns the number of `let` declarations.
    pub fn let_count(&self) -> usize {
        self.let_declarators.len()
    }

    /// Builds a `var` declaration statement from collected declarators.
    ///
    /// Returns `None` if there are no `var` declarators.
    pub fn build_var_stmt(&mut self) -> Option<Stmt> {
        if self.var_declarators.is_empty() {
            return None;
        }

        let declarators = std::mem::take(&mut self.var_declarators);
        Some(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: declarators,
            ..Default::default()
        }))))
    }

    /// Builds a `let` declaration statement from collected declarators.
    ///
    /// Returns `None` if there are no `let` declarators.
    pub fn build_let_stmt(&mut self) -> Option<Stmt> {
        if self.let_declarators.is_empty() {
            return None;
        }

        let declarators = std::mem::take(&mut self.let_declarators);
        Some(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Let,
            declare: false,
            decls: declarators,
            ..Default::default()
        }))))
    }

    /// Builds both `var` and `let` declaration statements.
    ///
    /// Returns a vector containing the declaration statements in order
    /// (var first, then let). Empty if there are no declarations.
    pub fn build_stmts(&mut self) -> Vec<Stmt> {
        let mut stmts = Vec::new();

        if let Some(var_stmt) = self.build_var_stmt() {
            stmts.push(var_stmt);
        }

        if let Some(let_stmt) = self.build_let_stmt() {
            stmts.push(let_stmt);
        }

        stmts
    }

    /// Clears all pending declarations without building them.
    pub fn clear(&mut self) {
        self.var_declarators.clear();
        self.let_declarators.clear();
    }
}

impl Default for VarDeclarations {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::*;

    use super::*;

    fn create_ident_expr(name: &str) -> Box<Expr> {
        Box::new(Expr::Ident(Ident::new(
            name.into(),
            DUMMY_SP,
            Default::default(),
        )))
    }

    #[test]
    fn test_insert_var_without_init() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_var("_temp", None);

        assert!(var_decls.has_var_declarations());
        assert_eq!(var_decls.var_count(), 1);
    }

    #[test]
    fn test_insert_var_with_init() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_var("_temp", Some(create_ident_expr("value")));

        assert!(var_decls.has_var_declarations());
        assert_eq!(var_decls.var_count(), 1);
    }

    #[test]
    fn test_insert_let() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_let("_value", None);

        assert!(var_decls.has_let_declarations());
        assert_eq!(var_decls.let_count(), 1);
    }

    #[test]
    fn test_insert_const() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_const("_const", create_ident_expr("value"));

        assert!(var_decls.has_let_declarations());
        assert_eq!(var_decls.let_count(), 1);
    }

    #[test]
    fn test_multiple_declarations() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_var("_temp1", None);
        var_decls.insert_var("_temp2", Some(create_ident_expr("value")));
        var_decls.insert_let("_value1", None);
        var_decls.insert_let("_value2", Some(create_ident_expr("value")));

        assert_eq!(var_decls.var_count(), 2);
        assert_eq!(var_decls.let_count(), 2);
        assert!(var_decls.has_declarations());
    }

    #[test]
    fn test_build_var_stmt() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_var("_temp", None);

        let stmt = var_decls.build_var_stmt();
        assert!(stmt.is_some());

        // After building, the declarators should be cleared
        assert!(!var_decls.has_var_declarations());
    }

    #[test]
    fn test_build_let_stmt() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_let("_value", None);

        let stmt = var_decls.build_let_stmt();
        assert!(stmt.is_some());

        // After building, the declarators should be cleared
        assert!(!var_decls.has_let_declarations());
    }

    #[test]
    fn test_build_stmts() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_var("_temp", None);
        var_decls.insert_let("_value", None);

        let stmts = var_decls.build_stmts();
        assert_eq!(stmts.len(), 2);

        // Verify first is var, second is let
        match &stmts[0] {
            Stmt::Decl(Decl::Var(decl)) => {
                assert!(matches!(decl.kind, VarDeclKind::Var));
            }
            _ => panic!("Expected var declaration"),
        }

        match &stmts[1] {
            Stmt::Decl(Decl::Var(decl)) => {
                assert!(matches!(decl.kind, VarDeclKind::Let));
            }
            _ => panic!("Expected let declaration"),
        }
    }

    #[test]
    fn test_build_empty() {
        let mut var_decls = VarDeclarations::new();

        assert!(var_decls.build_var_stmt().is_none());
        assert!(var_decls.build_let_stmt().is_none());
        assert!(var_decls.build_stmts().is_empty());
    }

    #[test]
    fn test_clear() {
        let mut var_decls = VarDeclarations::new();
        var_decls.insert_var("_temp", None);
        var_decls.insert_let("_value", None);

        assert!(var_decls.has_declarations());

        var_decls.clear();

        assert!(!var_decls.has_declarations());
        assert_eq!(var_decls.var_count(), 0);
        assert_eq!(var_decls.let_count(), 0);
    }

    #[test]
    fn test_var_declarator_pattern() {
        let mut var_decls = VarDeclarations::new();
        let stmt = var_decls.build_var_stmt();
        assert!(stmt.is_none());

        var_decls.insert_var("x", None);
        let stmt = var_decls.build_var_stmt().unwrap();

        match stmt {
            Stmt::Decl(Decl::Var(decl)) => {
                assert_eq!(decl.decls.len(), 1);
                match &decl.decls[0].name {
                    Pat::Ident(binding) => {
                        assert_eq!(&*binding.id.sym, "x");
                    }
                    _ => panic!("Expected identifier pattern"),
                }
            }
            _ => panic!("Expected var declaration"),
        }
    }
}
