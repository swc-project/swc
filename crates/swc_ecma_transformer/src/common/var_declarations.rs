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

use std::{mem, ptr};

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

/// Transform that maintains the stack of `Vec<VarDeclarator>`s, and adds a
/// `var` statement to top of a statement block if another transform has
/// requested that.
///
/// Must run after all other transforms.
#[derive(Debug, Default)]
pub struct VarDeclarations {
    arrow_exprs: Vec<Option<ArrowExprScope>>,
}

#[derive(Debug)]
struct ArrowExprScope {
    /// The `BlockStmtOrExpr` for an expression-bodied arrow. Starting the scope
    /// here keeps generated temps out of params while still catching body
    /// transforms that queue declarations in `enter_expr`.
    body: *const BlockStmtOrExpr,
    started: bool,
    declarations: Option<(Option<Stmt>, Option<Stmt>)>,
}

impl VisitMutHook<TraverseCtx> for VarDeclarations {
    fn enter_arrow_expr(&mut self, node: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        self.arrow_exprs.push(match &mut *node.body {
            BlockStmtOrExpr::Expr(_) => Some(ArrowExprScope {
                body: &*node.body,
                started: false,
                declarations: None,
            }),
            BlockStmtOrExpr::BlockStmt(_) => None,
            #[cfg(swc_ast_unknown)]
            _ => None,
        });
    }

    fn exit_arrow_expr(&mut self, node: &mut ArrowExpr, ctx: &mut TraverseCtx) {
        let Some(mut scope) = self.arrow_exprs.pop().flatten() else {
            return;
        };

        if scope.started {
            scope.declarations = ctx.var_declarations.get_var_statement();
        }

        let Some(mut stmts) = Self::declaration_stmts(scope.declarations) else {
            return;
        };

        match &mut *node.body {
            BlockStmtOrExpr::Expr(expr) => {
                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(expr.take()),
                }));

                *node.body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                    ..Default::default()
                });
            }
            BlockStmtOrExpr::BlockStmt(block) => Self::insert_arrow_declarations(block, stmts),
            #[cfg(swc_ast_unknown)]
            _ => {}
        }
    }

    fn enter_block_stmt_or_expr(&mut self, node: &mut BlockStmtOrExpr, ctx: &mut TraverseCtx) {
        let Some(Some(scope)) = self.arrow_exprs.last_mut() else {
            return;
        };

        if !scope.started && ptr::eq(scope.body, node) {
            ctx.var_declarations.record_entering_stmts();
            scope.started = true;
        }
    }

    fn exit_block_stmt_or_expr(&mut self, node: &mut BlockStmtOrExpr, ctx: &mut TraverseCtx) {
        let Some(Some(scope)) = self.arrow_exprs.last_mut() else {
            return;
        };

        if scope.started && ptr::eq(scope.body, node) {
            scope.declarations = ctx.var_declarations.get_var_statement();
            scope.started = false;
        }
    }

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

impl VarDeclarations {
    fn declaration_stmts(declarations: Option<(Option<Stmt>, Option<Stmt>)>) -> Option<Vec<Stmt>> {
        let (var_statement, let_statement) = declarations?;
        let mut stmts = Vec::with_capacity(2);

        match (var_statement, let_statement) {
            (Some(var_statement), Some(let_statement)) => {
                stmts.push(var_statement);
                stmts.push(let_statement);
            }
            (Some(statement), None) | (None, Some(statement)) => {
                stmts.push(statement);
            }
            (None, None) => return None,
        }

        Some(stmts)
    }

    fn insert_arrow_declarations(block: &mut BlockStmt, declarations: Vec<Stmt>) {
        if declarations.is_empty() {
            return;
        }

        if matches!(
            block.stmts.last(),
            Some(Stmt::Return(ReturnStmt { span: DUMMY_SP, .. }))
        ) {
            let return_stmt = block.stmts.pop().unwrap();
            block.stmts.extend(declarations);
            block.stmts.push(return_stmt);
            return;
        }

        let original = mem::take(&mut block.stmts);
        let mut stmts = Vec::with_capacity(declarations.len() + original.len());
        stmts.extend(declarations);
        stmts.extend(original);
        block.stmts = stmts;
    }
}

/// Store for `VarDeclarator`s to be added to enclosing statement block.
#[derive(Default, Debug)]
pub struct VarDeclarationsStore {
    stack: Vec<Option<Declarators>>,
}

/// Declarators to be inserted in a statement block.
#[derive(Debug, Default)]
struct Declarators {
    var_declarators: Vec<VarDeclarator>,
    let_declarators: Vec<VarDeclarator>,
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
