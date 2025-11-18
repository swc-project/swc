//! Traversal context for the transformer.
//!
//! This module provides a context type that is passed through all
//! transformation hooks, similar to oxc's TraverseCtx. It provides utilities
//! for scope management, symbol resolution, and AST building.

use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

/// Traversal context passed through all transformation hooks.
///
/// This context provides access to:
/// - Symbol and scope management
/// - AST building utilities
/// - Ancestry information
/// - User-defined state
///
/// # Example
///
/// ```ignore
/// impl<'a> VisitMutHook<TraverseCtx<'a>> for MyTransform {
///     fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx<'a>) {
///         // Use context for transformations
///         if let Expr::Ident(ident) = expr {
///             // Access scope information, generate new identifiers, etc.
///         }
///     }
/// }
/// ```
pub struct TraverseCtx<'a> {
    /// The syntax context for generating new nodes
    unresolved_ctxt: SyntaxContext,

    /// The top-level syntax context
    top_level_ctxt: SyntaxContext,

    /// Counter for generating unique identifiers
    uid_counter: usize,

    /// User-defined state
    state: Option<&'a mut dyn std::any::Any>,
}

impl<'a> TraverseCtx<'a> {
    /// Creates a new traversal context.
    ///
    /// # Arguments
    ///
    /// * `unresolved_ctxt` - The syntax context for unresolved references
    /// * `top_level_ctxt` - The syntax context for top-level declarations
    pub fn new(unresolved_ctxt: SyntaxContext, top_level_ctxt: SyntaxContext) -> Self {
        Self {
            unresolved_ctxt,
            top_level_ctxt,
            uid_counter: 0,
            state: None,
        }
    }

    /// Gets the unresolved syntax context.
    ///
    /// This context is used for identifiers that are not resolved to any
    /// specific scope, typically for global references or identifiers that
    /// will be resolved later.
    #[inline]
    pub fn unresolved_ctxt(&self) -> SyntaxContext {
        self.unresolved_ctxt
    }

    /// Gets the top-level syntax context.
    ///
    /// This context is used for top-level declarations.
    #[inline]
    pub fn top_level_ctxt(&self) -> SyntaxContext {
        self.top_level_ctxt
    }

    /// Generates a unique identifier name.
    ///
    /// This is useful for creating temporary variables that don't conflict
    /// with existing identifiers in the scope.
    ///
    /// # Arguments
    ///
    /// * `base` - The base name for the identifier (e.g., "temp")
    ///
    /// # Returns
    ///
    /// A unique identifier name like "temp_1", "temp_2", etc.
    pub fn generate_uid_name(&mut self, base: &str) -> String {
        self.uid_counter += 1;
        format!("{}_{}", base, self.uid_counter)
    }

    /// Creates a new identifier with the unresolved context.
    ///
    /// # Arguments
    ///
    /// * `sym` - The symbol name
    /// * `span` - The source span
    ///
    /// # Returns
    ///
    /// An `Ident` with the unresolved syntax context.
    pub fn create_unresolved_ident(&self, sym: &str, span: Span) -> Ident {
        Ident {
            span,
            ctxt: self.unresolved_ctxt,
            sym: sym.into(),
            optional: false,
        }
    }

    /// Creates a new identifier reference expression.
    ///
    /// # Arguments
    ///
    /// * `sym` - The symbol name
    /// * `span` - The source span
    ///
    /// # Returns
    ///
    /// An `Expr::Ident` with the unresolved syntax context.
    pub fn create_ident_expr(&self, sym: &str, span: Span) -> Expr {
        Expr::Ident(self.create_unresolved_ident(sym, span))
    }

    /// Creates a member expression accessing a property.
    ///
    /// # Arguments
    ///
    /// * `obj` - The object expression
    /// * `prop` - The property name
    ///
    /// # Returns
    ///
    /// A member expression `obj.prop`.
    pub fn create_member_expr(&self, obj: Box<Expr>, prop: &str) -> Expr {
        Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: obj.into(),
            prop: MemberProp::Ident(IdentName {
                span: DUMMY_SP,
                sym: prop.into(),
            }),
        })
    }

    /// Creates a call expression.
    ///
    /// # Arguments
    ///
    /// * `callee` - The callee expression
    /// * `args` - The argument expressions
    ///
    /// # Returns
    ///
    /// A call expression `callee(args...)`.
    pub fn create_call_expr(&self, callee: Expr, args: Vec<ExprOrSpread>) -> Expr {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(callee)),
            args,
            ..Default::default()
        })
    }

    /// Sets user-defined state in the context.
    ///
    /// This allows transforms to store and retrieve custom state during
    /// traversal.
    pub fn set_state(&mut self, state: &'a mut dyn std::any::Any) {
        self.state = Some(state);
    }

    /// Gets a reference to the user-defined state.
    ///
    /// # Returns
    ///
    /// `Some(&dyn Any)` if state was set, `None` otherwise.
    pub fn state(&self) -> Option<&dyn std::any::Any> {
        self.state.as_ref().map(|s| &**s as &dyn std::any::Any)
    }

    /// Gets a mutable reference to the user-defined state.
    ///
    /// # Returns
    ///
    /// `Some(&mut dyn Any)` if state was set, `None` otherwise.
    pub fn state_mut(&mut self) -> Option<&mut dyn std::any::Any> {
        self.state
            .as_mut()
            .map(|s| &mut **s as &mut dyn std::any::Any)
    }
}

impl<'a> Default for TraverseCtx<'a> {
    fn default() -> Self {
        Self::new(SyntaxContext::empty(), SyntaxContext::empty())
    }
}
