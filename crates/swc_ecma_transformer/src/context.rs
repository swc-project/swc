//! Transformation context for AST visitors.
//!
//! This module provides the `TraverseCtx` struct that holds shared state
//! and context information during AST transformations. It is designed to be
//! passed through all transformation hooks via the `VisitMutHook` trait.

use std::ops::Not;

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

/// Context passed through all transformation hooks.
///
/// This struct holds shared state and provides helper methods for common
/// operations during AST transformations. It is inspired by oxc's TraverseCtx
/// but adapted to SWC's architecture.
///
/// # Example
///
/// ```ignore
/// use swc_ecma_transformer::TraverseCtx;
///
/// let mut ctx = TraverseCtx::new();
/// // Use context in transformations
/// ```
#[derive(Default)]
pub struct TraverseCtx {
    /// Stack of ancestor nodes, useful for checking parent context
    ancestor_stack: Vec<AncestorNode>,

    /// Track current scope depth (functions, blocks, etc.)
    scope_depth: usize,

    /// Unique identifier counter for generating fresh identifiers
    uid_counter: usize,

    /// Map to store metadata about identifiers (e.g., usage counts, bindings)
    identifier_metadata: FxHashMap<Id, IdentifierMetadata>,

    /// Whether we're currently inside a loop
    in_loop: bool,

    /// Whether we're currently inside a function
    in_function: bool,

    /// Whether we're currently in strict mode
    in_strict_mode: bool,
}

/// Metadata about an identifier
#[derive(Debug, Clone, Default)]
pub struct IdentifierMetadata {
    /// Number of references to this identifier
    pub reference_count: usize,

    /// Whether this identifier is bound in current scope
    pub is_bound: bool,
}

/// Represents different types of ancestor nodes in the AST.
///
/// This enum captures important parent node types that transformations
/// commonly need to query during traversal.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AncestorNode {
    /// Regular function declaration or expression
    Function,
    /// Arrow function expression
    ArrowFunction,
    /// Block statement
    Block,
    /// Any loop construct (for, while, do-while, for-in, for-of)
    Loop,
    /// Class declaration or expression
    Class,
    /// Class method
    Method,
    /// Try statement
    Try,
    /// Catch clause
    Catch,
    /// Switch statement
    Switch,
    /// If statement
    If,
    /// Conditional expression (ternary)
    Conditional,
    /// Call expression
    Call,
    /// With statement
    With,
}

impl TraverseCtx {
    /// Creates a new transformation context.
    pub fn new() -> Self {
        Self::default()
    }

    /// Generates a unique identifier name.
    ///
    /// This is useful for creating temporary variables during transformations.
    pub fn generate_uid(&mut self, prefix: &str) -> String {
        self.uid_counter += 1;
        format!("_{}_{}", prefix, self.uid_counter)
    }

    /// Generates a unique identifier with a given base name.
    pub fn generate_uid_ident(&mut self, prefix: &str) -> Ident {
        let name = self.generate_uid(prefix);
        Ident::new(Atom::from(name), Default::default(), SyntaxContext::empty())
    }

    /// Enters a new scope level.
    pub fn enter_scope(&mut self) {
        self.scope_depth += 1;
    }

    /// Exits the current scope level.
    pub fn exit_scope(&mut self) {
        if self.scope_depth > 0 {
            self.scope_depth -= 1;
        }
    }

    /// Gets the current scope depth.
    pub fn scope_depth(&self) -> usize {
        self.scope_depth
    }

    /// Pushes an ancestor node onto the stack.
    pub fn push_ancestor(&mut self, ancestor: AncestorNode) {
        if matches!(ancestor, AncestorNode::Loop) {
            self.in_loop = true;
        }
        if matches!(
            ancestor,
            AncestorNode::Function | AncestorNode::ArrowFunction
        ) {
            self.in_function = true;
        }
        self.ancestor_stack.push(ancestor);
    }

    /// Pops an ancestor node from the stack.
    pub fn pop_ancestor(&mut self) -> Option<AncestorNode> {
        let ancestor = self.ancestor_stack.pop();

        // Update loop/function flags
        if let Some(ref node) = ancestor {
            if matches!(node, AncestorNode::Loop) {
                self.in_loop = self
                    .ancestor_stack
                    .iter()
                    .any(|a| matches!(a, AncestorNode::Loop));
            }
            if matches!(node, AncestorNode::Function | AncestorNode::ArrowFunction) {
                self.in_function = self
                    .ancestor_stack
                    .iter()
                    .any(|a| matches!(a, AncestorNode::Function | AncestorNode::ArrowFunction));
            }
        }

        ancestor
    }

    /// Checks if we're currently inside a loop.
    pub fn in_loop(&self) -> bool {
        self.in_loop
    }

    /// Checks if we're currently inside a function.
    pub fn in_function(&self) -> bool {
        self.in_function
    }

    /// Sets strict mode flag.
    pub fn set_strict_mode(&mut self, strict: bool) {
        self.in_strict_mode = strict;
    }

    /// Checks if we're in strict mode.
    pub fn in_strict_mode(&self) -> bool {
        self.in_strict_mode
    }

    /// Records metadata about an identifier.
    pub fn record_identifier(&mut self, id: Id, metadata: IdentifierMetadata) {
        self.identifier_metadata.insert(id, metadata);
    }

    /// Gets metadata for an identifier.
    pub fn get_identifier_metadata(&self, id: &Id) -> Option<&IdentifierMetadata> {
        self.identifier_metadata.get(id)
    }

    /// Increments the reference count for an identifier.
    pub fn increment_reference(&mut self, id: &Id) {
        self.identifier_metadata
            .entry(id.clone())
            .or_default()
            .reference_count += 1;
    }

    /// Gets the ancestor stack (useful for checking parent context).
    pub fn ancestors(&self) -> &[AncestorNode] {
        &self.ancestor_stack
    }

    /// Gets the immediate parent node.
    ///
    /// Returns `None` if at the root of the AST.
    ///
    /// # Example
    ///
    /// ```ignore
    /// if let Some(parent) = ctx.parent() {
    ///     match parent {
    ///         AncestorNode::Function => { /* ... */ }
    ///         _ => {}
    ///     }
    /// }
    /// ```
    pub fn parent(&self) -> Option<&AncestorNode> {
        self.ancestor_stack.last()
    }

    /// Gets an ancestor at a specific depth.
    ///
    /// `level = 0` returns the parent, `level = 1` returns grandparent, etc.
    /// Returns `None` if the level exceeds the stack depth.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Get grandparent node
    /// if let Some(grandparent) = ctx.ancestor(1) {
    ///     // ...
    /// }
    /// ```
    pub fn ancestor(&self, level: usize) -> Option<&AncestorNode> {
        let len = self.ancestor_stack.len();
        if level >= len {
            return None;
        }
        self.ancestor_stack.get(len - 1 - level)
    }

    /// Finds an ancestor matching a predicate, starting from the parent.
    ///
    /// Returns the first ancestor for which the predicate returns `true`,
    /// searching from closest to farthest.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Check if we're inside any function
    /// let in_function = ctx.find_ancestor(|node| {
    ///     matches!(node, AncestorNode::Function | AncestorNode::ArrowFunction)
    /// }).is_some();
    /// ```
    pub fn find_ancestor<F>(&self, predicate: F) -> Option<&AncestorNode>
    where
        F: Fn(&AncestorNode) -> bool,
    {
        self.ancestor_stack
            .iter()
            .rev()
            .find(|node| predicate(node))
    }

    /// Returns the current depth in the AST tree.
    ///
    /// The depth is the number of ancestors from the root.
    pub fn ancestors_depth(&self) -> usize {
        self.ancestor_stack.len()
    }

    /// Checks if we're currently inside a try statement.
    pub fn in_try(&self) -> bool {
        self.ancestor_stack
            .iter()
            .any(|a| matches!(a, AncestorNode::Try))
    }

    /// Checks if we're currently inside a catch clause.
    pub fn in_catch(&self) -> bool {
        self.ancestor_stack
            .iter()
            .any(|a| matches!(a, AncestorNode::Catch))
    }

    /// Checks if we're currently inside a switch statement.
    pub fn in_switch(&self) -> bool {
        self.ancestor_stack
            .iter()
            .any(|a| matches!(a, AncestorNode::Switch))
    }

    /// Checks if we're currently inside a class.
    pub fn in_class(&self) -> bool {
        self.ancestor_stack
            .iter()
            .any(|a| matches!(a, AncestorNode::Class))
    }

    /// Checks if we're currently inside a method.
    pub fn in_method(&self) -> bool {
        self.ancestor_stack
            .iter()
            .any(|a| matches!(a, AncestorNode::Method))
    }

    /// Checks if we're currently inside a with statement.
    pub fn in_with(&self) -> bool {
        self.ancestor_stack
            .iter()
            .any(|a| matches!(a, AncestorNode::With))
    }

    /// Creates a new identifier with proper context.
    ///
    /// This is a convenience method for creating identifiers that follows
    /// SWC conventions.
    ///
    /// # Example
    ///
    /// ```ignore
    /// let ident = ctx.create_ident("myVar");
    /// ```
    pub fn create_ident(&self, name: &str) -> Ident {
        Ident::new(Atom::from(name), DUMMY_SP, SyntaxContext::empty())
    }

    /// Creates a new identifier with a custom span.
    pub fn create_ident_with_span(&self, name: &str, span: Span) -> Ident {
        Ident::new(Atom::from(name), span, SyntaxContext::empty())
    }

    /// Creates an identifier reference expression.
    ///
    /// This creates an `Expr::Ident` for referencing a variable.
    ///
    /// # Example
    ///
    /// ```ignore
    /// let expr = ctx.create_ident_ref("myVar");
    /// ```
    pub fn create_ident_ref(&self, name: &str) -> Expr {
        Expr::Ident(self.create_ident(name))
    }

    /// Creates a member expression for accessing a property.
    ///
    /// Creates `obj.prop` where both are identifiers.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Creates: console.log
    /// let expr = ctx.create_member_expr("console", "log");
    /// ```
    pub fn create_member_expr(&self, obj: &str, prop: &str) -> MemberExpr {
        MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(self.create_ident_ref(obj)),
            prop: MemberProp::Ident(IdentName::new(Atom::from(prop), DUMMY_SP)),
        }
    }

    /// Creates a call expression with no arguments.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Creates: foo()
    /// let call = ctx.create_call_expr(ctx.create_ident_ref("foo"), vec![]);
    /// ```
    pub fn create_call_expr(&self, callee: Expr, args: Vec<ExprOrSpread>) -> CallExpr {
        CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(callee)),
            args,
            ..Default::default()
        }
    }

    /// Creates a variable declarator.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Creates: var myVar = init
    /// let declarator = ctx.create_var_declarator("myVar", Some(init_expr));
    /// ```
    pub fn create_var_declarator(&self, name: &str, init: Option<Expr>) -> VarDeclarator {
        VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: self.create_ident(name),
                type_ann: None,
            }),
            init: init.map(Box::new),
            definite: false,
        }
    }

    /// Creates a variable declaration statement.
    ///
    /// # Example
    ///
    /// ```ignore
    /// let decl = ctx.create_var_decl(VarDeclKind::Let, vec![declarator]);
    /// ```
    pub fn create_var_decl(&self, kind: VarDeclKind, decls: Vec<VarDeclarator>) -> VarDecl {
        VarDecl {
            span: DUMMY_SP,
            kind,
            declare: false,
            decls,
            ..Default::default()
        }
    }

    /// Creates an assignment expression.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Creates: a = b
    /// let assign = ctx.create_assignment("a", ctx.create_ident_ref("b"));
    /// ```
    pub fn create_assignment(&self, left: &str, right: Expr) -> Expr {
        Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: self.create_ident(left),
                type_ann: None,
            })),
            right: Box::new(right),
        })
    }

    /// Creates a return statement.
    pub fn create_return_stmt(&self, arg: Option<Expr>) -> Stmt {
        Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: arg.map(Box::new),
        })
    }

    /// Creates an expression statement.
    pub fn create_expr_stmt(&self, expr: Expr) -> Stmt {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(expr),
        })
    }

    /// Creates a block statement from a list of statements.
    pub fn create_block_stmt(&self, stmts: Vec<Stmt>) -> BlockStmt {
        BlockStmt {
            span: DUMMY_SP,
            stmts,
            ..Default::default()
        }
    }

    /// Creates a literal null expression.
    pub fn create_null(&self) -> Expr {
        Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))
    }

    /// Creates a literal undefined expression.
    pub fn create_undefined(&self) -> Expr {
        Expr::Ident(Ident::new(
            "undefined".into(),
            DUMMY_SP,
            SyntaxContext::empty(),
        ))
    }

    /// Creates a boolean literal.
    pub fn create_bool(&self, value: bool) -> Expr {
        Expr::Lit(Lit::Bool(Bool {
            span: DUMMY_SP,
            value,
        }))
    }

    /// Creates a number literal.
    pub fn create_number(&self, value: f64) -> Expr {
        Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value,
            raw: None,
        }))
    }

    /// Creates a string literal.
    pub fn create_string(&self, value: &str) -> Expr {
        Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: value.into(),
            raw: None,
        }))
    }

    /// Creates a this expression.
    pub fn create_this(&self) -> Expr {
        Expr::This(ThisExpr { span: DUMMY_SP })
    }

    /// Generates a unique identifier that avoids conflicts with existing names.
    ///
    /// Unlike `generate_uid()`, this method checks against a set of reserved
    /// names to ensure uniqueness.
    ///
    /// # Example
    ///
    /// ```ignore
    /// let mut reserved = FxHashSet::default();
    /// reserved.insert("temp".to_string());
    /// let unique_name = ctx.generate_unique_name("temp", &reserved);
    /// // Returns something like "_temp_1" if "temp" is reserved
    /// ```
    pub fn generate_unique_name(&mut self, base: &str, reserved: &FxHashSet<String>) -> String {
        let mut candidate = base.to_string();
        while reserved.contains(&candidate) {
            self.uid_counter += 1;
            candidate = format!("_{}_{}", base, self.uid_counter);
        }
        candidate
    }

    /// Checks if an identifier name is valid and not a reserved word.
    ///
    /// This is useful when generating or validating identifier names.
    pub fn is_valid_identifier(&self, name: &str) -> bool {
        if name.is_empty() {
            return false;
        }

        // Check if it's a reserved word
        matches!(
            name,
            "await"
                | "break"
                | "case"
                | "catch"
                | "class"
                | "const"
                | "continue"
                | "debugger"
                | "default"
                | "delete"
                | "do"
                | "else"
                | "export"
                | "extends"
                | "finally"
                | "for"
                | "function"
                | "if"
                | "import"
                | "in"
                | "instanceof"
                | "new"
                | "return"
                | "super"
                | "switch"
                | "this"
                | "throw"
                | "try"
                | "typeof"
                | "var"
                | "void"
                | "while"
                | "with"
                | "yield"
                | "let"
                | "static"
                | "enum"
                | "implements"
                | "interface"
                | "package"
                | "private"
                | "protected"
                | "public"
        )
        .not()
    }

    /// Clears all identifier metadata.
    ///
    /// This can be useful for resetting state between transformation phases.
    pub fn clear_identifier_metadata(&mut self) {
        self.identifier_metadata.clear();
    }

    /// Gets the total number of tracked identifiers.
    pub fn identifier_count(&self) -> usize {
        self.identifier_metadata.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parent_tracking() {
        let mut ctx = TraverseCtx::new();
        assert_eq!(ctx.parent(), None);

        ctx.push_ancestor(AncestorNode::Function);
        assert!(matches!(ctx.parent(), Some(AncestorNode::Function)));

        ctx.push_ancestor(AncestorNode::Block);
        assert!(matches!(ctx.parent(), Some(AncestorNode::Block)));

        ctx.pop_ancestor();
        assert!(matches!(ctx.parent(), Some(AncestorNode::Function)));

        ctx.pop_ancestor();
        assert_eq!(ctx.parent(), None);
    }

    #[test]
    fn test_ancestor_depth() {
        let mut ctx = TraverseCtx::new();
        assert_eq!(ctx.ancestors_depth(), 0);

        ctx.push_ancestor(AncestorNode::Function);
        assert_eq!(ctx.ancestors_depth(), 1);

        ctx.push_ancestor(AncestorNode::Block);
        assert_eq!(ctx.ancestors_depth(), 2);

        // Test ancestor() method
        assert!(matches!(ctx.ancestor(0), Some(AncestorNode::Block)));
        assert!(matches!(ctx.ancestor(1), Some(AncestorNode::Function)));
        assert_eq!(ctx.ancestor(2), None);
    }

    #[test]
    fn test_find_ancestor() {
        let mut ctx = TraverseCtx::new();
        ctx.push_ancestor(AncestorNode::Function);
        ctx.push_ancestor(AncestorNode::Block);
        ctx.push_ancestor(AncestorNode::Loop);

        let found = ctx.find_ancestor(|node| matches!(node, AncestorNode::Function));
        assert!(found.is_some());

        let not_found = ctx.find_ancestor(|node| matches!(node, AncestorNode::Class));
        assert!(not_found.is_none());
    }

    #[test]
    fn test_context_predicates() {
        let mut ctx = TraverseCtx::new();

        assert!(!ctx.in_function());
        assert!(!ctx.in_loop());
        assert!(!ctx.in_class());

        ctx.push_ancestor(AncestorNode::Function);
        assert!(ctx.in_function());

        ctx.push_ancestor(AncestorNode::Loop);
        assert!(ctx.in_loop());
        assert!(ctx.in_function()); // Still in function

        ctx.push_ancestor(AncestorNode::Class);
        assert!(ctx.in_class());
        assert!(ctx.in_loop()); // Still in loop
        assert!(ctx.in_function()); // Still in function

        ctx.pop_ancestor(); // Remove class
        assert!(!ctx.in_class());
        assert!(ctx.in_loop());
    }

    #[test]
    fn test_uid_generation() {
        let mut ctx = TraverseCtx::new();

        let id1 = ctx.generate_uid("temp");
        let id2 = ctx.generate_uid("temp");
        assert_ne!(id1, id2);
        assert!(id1.starts_with("_temp_"));
        assert!(id2.starts_with("_temp_"));
    }

    #[test]
    fn test_unique_name_generation() {
        let mut ctx = TraverseCtx::new();
        let mut reserved = FxHashSet::default();
        reserved.insert("temp".to_string());
        reserved.insert("_temp_1".to_string());

        let name = ctx.generate_unique_name("temp", &reserved);
        assert!(!reserved.contains(&name));
        assert_ne!(name, "temp");
    }

    #[test]
    fn test_create_helpers() {
        let ctx = TraverseCtx::new();

        // Test identifier creation
        let ident = ctx.create_ident("foo");
        assert_eq!(&*ident.sym, "foo");

        // Test identifier reference
        let expr = ctx.create_ident_ref("bar");
        assert!(matches!(expr, Expr::Ident(_)));

        // Test literals
        let null = ctx.create_null();
        assert!(matches!(null, Expr::Lit(Lit::Null(_))));

        let bool_true = ctx.create_bool(true);
        assert!(matches!(
            bool_true,
            Expr::Lit(Lit::Bool(Bool { value: true, .. }))
        ));

        let num = ctx.create_number(42.0);
        assert!(
            matches!(num, Expr::Lit(Lit::Num(Number { value, .. })) if (value - 42.0).abs() < f64::EPSILON)
        );

        let string = ctx.create_string("hello");
        assert!(matches!(string, Expr::Lit(Lit::Str(_))));

        let this = ctx.create_this();
        assert!(matches!(this, Expr::This(_)));
    }

    #[test]
    fn test_member_expr_creation() {
        let ctx = TraverseCtx::new();
        let member = ctx.create_member_expr("console", "log");
        assert!(matches!(member.obj.as_ref(), Expr::Ident(_)));
        assert!(matches!(member.prop, MemberProp::Ident(_)));
    }

    #[test]
    fn test_var_declarator_creation() {
        let ctx = TraverseCtx::new();
        let init = ctx.create_number(42.0);
        let declarator = ctx.create_var_declarator("x", Some(init));
        assert!(matches!(declarator.name, Pat::Ident(_)));
        assert!(declarator.init.is_some());
    }

    #[test]
    fn test_statement_creation() {
        let ctx = TraverseCtx::new();

        // Test return statement
        let ret = ctx.create_return_stmt(Some(ctx.create_null()));
        assert!(matches!(ret, Stmt::Return(_)));

        // Test expression statement
        let expr_stmt = ctx.create_expr_stmt(ctx.create_bool(true));
        assert!(matches!(expr_stmt, Stmt::Expr(_)));

        // Test block statement
        let block = ctx.create_block_stmt(vec![]);
        assert_eq!(block.stmts.len(), 0);
    }

    #[test]
    fn test_identifier_validation() {
        let ctx = TraverseCtx::new();

        assert!(!ctx.is_valid_identifier(""));
        assert!(!ctx.is_valid_identifier("if"));
        assert!(!ctx.is_valid_identifier("return"));
        assert!(!ctx.is_valid_identifier("function"));
        assert!(!ctx.is_valid_identifier("class"));
    }

    #[test]
    fn test_identifier_metadata() {
        let mut ctx = TraverseCtx::new();
        let id = ("foo".into(), Default::default());

        ctx.increment_reference(&id);
        ctx.increment_reference(&id);

        let metadata = ctx.get_identifier_metadata(&id);
        assert!(metadata.is_some());
        assert_eq!(metadata.unwrap().reference_count, 2);

        assert_eq!(ctx.identifier_count(), 1);

        ctx.clear_identifier_metadata();
        assert_eq!(ctx.identifier_count(), 0);
    }

    #[test]
    fn test_scope_tracking() {
        let mut ctx = TraverseCtx::new();
        assert_eq!(ctx.scope_depth(), 0);

        ctx.enter_scope();
        assert_eq!(ctx.scope_depth(), 1);

        ctx.enter_scope();
        assert_eq!(ctx.scope_depth(), 2);

        ctx.exit_scope();
        assert_eq!(ctx.scope_depth(), 1);

        ctx.exit_scope();
        assert_eq!(ctx.scope_depth(), 0);

        // Exiting beyond 0 should not underflow
        ctx.exit_scope();
        assert_eq!(ctx.scope_depth(), 0);
    }

    #[test]
    fn test_strict_mode() {
        let mut ctx = TraverseCtx::new();
        assert!(!ctx.in_strict_mode());

        ctx.set_strict_mode(true);
        assert!(ctx.in_strict_mode());

        ctx.set_strict_mode(false);
        assert!(!ctx.in_strict_mode());
    }

    #[test]
    fn test_additional_context_predicates() {
        let mut ctx = TraverseCtx::new();

        assert!(!ctx.in_try());
        assert!(!ctx.in_catch());
        assert!(!ctx.in_switch());
        assert!(!ctx.in_method());
        assert!(!ctx.in_with());

        ctx.push_ancestor(AncestorNode::Try);
        assert!(ctx.in_try());

        ctx.push_ancestor(AncestorNode::Catch);
        assert!(ctx.in_catch());

        ctx.push_ancestor(AncestorNode::Switch);
        assert!(ctx.in_switch());

        ctx.push_ancestor(AncestorNode::Method);
        assert!(ctx.in_method());

        ctx.push_ancestor(AncestorNode::With);
        assert!(ctx.in_with());
    }
}
