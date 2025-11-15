//! Utility transform to add `var` or `let` declarations to top of statement blocks.
//!
//! `VarDeclarationsStore` contains a stack of `Declarators`s, each comprising
//! 2 x `Vec<Declarator<'a>>` (1 for `var`s, 1 for `let`s).
//! `VarDeclarationsStore` is stored on `TransformCtx`.
//!
//! `VarDeclarations` transform pushes an empty entry onto this stack when entering a statement block,
//! and when exiting the block, writes `var` / `let` statements to top of block.
//!
//! Other transforms can add declarators to the store by calling methods of `VarDeclarationsStore`:
//!
//! ```rs
//! self.ctx.var_declarations.insert_var(name, binding, None, ctx);
//! self.ctx.var_declarations.insert_let(name2, binding2, None, ctx);
//! ```

use std::cell::RefCell;

use oxc_allocator::Vec as ArenaVec;
use oxc_ast::ast::*;
use oxc_data_structures::stack::SparseStack;
use oxc_span::SPAN;
use oxc_traverse::{Ancestor, BoundIdentifier, Traverse, ast_operations::GatherNodeParts};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

/// Transform that maintains the stack of `Vec<VariableDeclarator>`s, and adds a `var` statement
/// to top of a statement block if another transform has requested that.
///
/// Must run after all other transforms except `TopLevelStatements`.
pub struct VarDeclarations<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> VarDeclarations<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for VarDeclarations<'a, '_> {
    fn enter_statements(
        &mut self,
        _stmts: &mut ArenaVec<'a, Statement<'a>>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        self.ctx.var_declarations.record_entering_statements();
    }

    fn exit_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.ctx.var_declarations.insert_into_statements(stmts, ctx);
    }

    fn exit_program(&mut self, _program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        self.ctx.var_declarations.insert_into_program(self.ctx, ctx);
    }
}

/// Store for `VariableDeclarator`s to be added to enclosing statement block.
pub struct VarDeclarationsStore<'a> {
    stack: RefCell<SparseStack<Declarators<'a>>>,
}

/// Declarators to be inserted in a statement block.
struct Declarators<'a> {
    var_declarators: ArenaVec<'a, VariableDeclarator<'a>>,
    let_declarators: ArenaVec<'a, VariableDeclarator<'a>>,
}

impl<'a> Declarators<'a> {
    fn new(ctx: &TraverseCtx<'a>) -> Self {
        Self { var_declarators: ctx.ast.vec(), let_declarators: ctx.ast.vec() }
    }
}

// Public methods
impl<'a> VarDeclarationsStore<'a> {
    /// Create new `VarDeclarationsStore`.
    pub fn new() -> Self {
        Self { stack: RefCell::new(SparseStack::new()) }
    }

    /// Add a `var` declaration to be inserted at top of current enclosing statement block,
    /// given a `BoundIdentifier`.
    #[inline]
    pub fn insert_var(&self, binding: &BoundIdentifier<'a>, ctx: &TraverseCtx<'a>) {
        let pattern = binding.create_binding_pattern(ctx);
        self.insert_var_binding_pattern(pattern, None, ctx);
    }

    /// Add a `var` declaration with the given init expression to be inserted at top of
    /// current enclosing statement block, given a `BoundIdentifier`.
    #[inline]
    pub fn insert_var_with_init(
        &self,
        binding: &BoundIdentifier<'a>,
        init: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) {
        let pattern = binding.create_binding_pattern(ctx);
        self.insert_var_binding_pattern(pattern, Some(init), ctx);
    }

    /// Create a new UID based on `name`, add a `var` declaration to be inserted at the top of
    /// the current enclosing statement block, and return the [`BoundIdentifier`].
    #[inline]
    pub fn create_uid_var(&self, name: &str, ctx: &mut TraverseCtx<'a>) -> BoundIdentifier<'a> {
        let binding = ctx.generate_uid_in_current_hoist_scope(name);
        self.insert_var(&binding, ctx);
        binding
    }

    /// Create a new UID based on `name`, add a `var` declaration with the given init expression
    /// to be inserted at the top of the current enclosing statement block, and return the
    /// [`BoundIdentifier`].
    #[inline]
    pub fn create_uid_var_with_init(
        &self,
        name: &str,
        expression: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        let binding = ctx.generate_uid_in_current_hoist_scope(name);
        self.insert_var_with_init(&binding, expression, ctx);
        binding
    }

    /// Create a new UID with name based on `node`, add a `var` declaration to be inserted
    /// at the top of the current enclosing statement block, and return the [`BoundIdentifier`].
    #[inline]
    pub fn create_uid_var_based_on_node<N: GatherNodeParts<'a>>(
        &self,
        node: &N,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        let binding = ctx.generate_uid_in_current_hoist_scope_based_on_node(node);
        self.insert_var(&binding, ctx);
        binding
    }

    /// Add a `let` declaration to be inserted at top of current enclosing statement block,
    /// given a `BoundIdentifier`.
    pub fn insert_let(
        &self,
        binding: &BoundIdentifier<'a>,
        init: Option<Expression<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        let pattern = binding.create_binding_pattern(ctx);
        self.insert_let_binding_pattern(pattern, init, ctx);
    }

    /// Add a `var` declaration to be inserted at top of current enclosing statement block,
    /// given a `BindingPattern`.
    pub fn insert_var_binding_pattern(
        &self,
        ident: BindingPattern<'a>,
        init: Option<Expression<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        let declarator =
            ctx.ast.variable_declarator(SPAN, VariableDeclarationKind::Var, ident, init, false);
        self.insert_var_declarator(declarator, ctx);
    }

    /// Add a `let` declaration to be inserted at top of current enclosing statement block,
    /// given a `BindingPattern`.
    pub fn insert_let_binding_pattern(
        &self,
        ident: BindingPattern<'a>,
        init: Option<Expression<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        let declarator =
            ctx.ast.variable_declarator(SPAN, VariableDeclarationKind::Let, ident, init, false);
        self.insert_let_declarator(declarator, ctx);
    }

    /// Add a `var` declaration to be inserted at top of current enclosing statement block.
    pub fn insert_var_declarator(&self, declarator: VariableDeclarator<'a>, ctx: &TraverseCtx<'a>) {
        let mut stack = self.stack.borrow_mut();
        let declarators = stack.last_mut_or_init(|| Declarators::new(ctx));
        declarators.var_declarators.push(declarator);
    }

    /// Add a `let` declaration to be inserted at top of current enclosing statement block.
    pub fn insert_let_declarator(&self, declarator: VariableDeclarator<'a>, ctx: &TraverseCtx<'a>) {
        let mut stack = self.stack.borrow_mut();
        let declarators = stack.last_mut_or_init(|| Declarators::new(ctx));
        declarators.let_declarators.push(declarator);
    }
}

// Internal methods
impl<'a> VarDeclarationsStore<'a> {
    fn record_entering_statements(&self) {
        let mut stack = self.stack.borrow_mut();
        stack.push(None);
    }

    fn insert_into_statements(
        &self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        if matches!(ctx.parent(), Ancestor::ProgramBody(_)) {
            // Handle in `insert_into_program` instead
            return;
        }

        if let Some((var_statement, let_statement)) = self.get_var_statement(ctx) {
            let mut new_stmts = ctx.ast.vec_with_capacity(stmts.len() + 2);
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

    fn insert_into_program(&self, transform_ctx: &TransformCtx<'a>, ctx: &TraverseCtx<'a>) {
        if let Some((var_statement, let_statement)) = self.get_var_statement(ctx) {
            // Delegate to `TopLevelStatements`
            transform_ctx
                .top_level_statements
                .insert_statements(var_statement.into_iter().chain(let_statement));
        }

        // Check stack is exhausted
        let stack = self.stack.borrow();
        debug_assert!(stack.is_exhausted());
        debug_assert!(stack.last().is_none());
    }

    #[inline]
    fn get_var_statement(
        &self,
        ctx: &TraverseCtx<'a>,
    ) -> Option<(Option<Statement<'a>>, Option<Statement<'a>>)> {
        let mut stack = self.stack.borrow_mut();
        let Declarators { var_declarators, let_declarators } = stack.pop()?;

        let var_statement = (!var_declarators.is_empty())
            .then(|| Self::create_declaration(VariableDeclarationKind::Var, var_declarators, ctx));
        let let_statement = (!let_declarators.is_empty())
            .then(|| Self::create_declaration(VariableDeclarationKind::Let, let_declarators, ctx));

        Some((var_statement, let_statement))
    }

    fn create_declaration(
        kind: VariableDeclarationKind,
        declarators: ArenaVec<'a, VariableDeclarator<'a>>,
        ctx: &TraverseCtx<'a>,
    ) -> Statement<'a> {
        Statement::VariableDeclaration(ctx.ast.alloc_variable_declaration(
            SPAN,
            kind,
            declarators,
            false,
        ))
    }
}
