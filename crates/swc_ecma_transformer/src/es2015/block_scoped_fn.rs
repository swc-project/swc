//! ES2015: Block Scoped Functions
//!
//! This plugin transforms block-scoped function declarations to variable
//! declarations with function expressions.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! {
//!   function name(n) {
//!     return n;
//!   }
//! }
//! name("Steve");
//! ```
//!
//! Output:
//! ```js
//! {
//!   let name = function name(n) {
//!     return n;
//!   };
//! }
//! name("Steve");
//! ```
//!
//! Note: Function declarations directly inside function bodies are NOT
//! transformed, only those inside block statements (e.g., if, for, etc.).
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-block-scoped-functions](https://babel.dev/docs/babel-plugin-transform-block-scoped-functions).

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::IdentUsageFinder;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    BlockScopedFnPass {
        is_function_body_stack: Vec::new(),
        entering_function_body: false,
    }
}

struct BlockScopedFnPass {
    /// Stack tracking whether each block statement is a function body.
    /// We push when entering a block, pop when exiting.
    is_function_body_stack: Vec<bool>,
    /// Flag set when entering a function, cleared when entering its body block.
    entering_function_body: bool,
}

impl VisitMutHook<TraverseCtx> for BlockScopedFnPass {
    fn enter_function(&mut self, _f: &mut Function, _ctx: &mut TraverseCtx) {
        // The next block statement we encounter will be the function body
        self.entering_function_body = true;
    }

    fn enter_block_stmt(&mut self, _block: &mut BlockStmt, _ctx: &mut TraverseCtx) {
        // If we just entered a function, this block is its body
        let is_function_body = self.entering_function_body;
        self.is_function_body_stack.push(is_function_body);
        self.entering_function_body = false;
    }

    fn exit_block_stmt(&mut self, block: &mut BlockStmt, _ctx: &mut TraverseCtx) {
        let is_function_body = self.is_function_body_stack.pop().unwrap_or(false);

        // Don't transform function bodies - only transform block statements
        // inside functions (or at the top level)
        if is_function_body {
            return;
        }

        transform_block_scoped_functions(block);
    }
}

fn transform_block_scoped_functions(block: &mut BlockStmt) {
    let mut stmts = Vec::with_capacity(block.stmts.len());
    let mut extra_stmts = Vec::with_capacity(block.stmts.len());

    for stmt in block.stmts.take() {
        // Preserve directive-like string literals at the start
        if let Stmt::Expr(ExprStmt { ref expr, .. }) = stmt {
            if let Expr::Lit(Lit::Str(..)) = &**expr {
                stmts.push(stmt);
                continue;
            }
        }

        if let Stmt::Decl(Decl::Fn(decl)) = stmt {
            // If the function references itself, we need to keep it as a
            // function declaration for proper hoisting
            if IdentUsageFinder::find(&decl.ident, &decl.function) {
                extra_stmts.push(decl.into());
                continue;
            }
            // Transform to: let name = function name(n) { ... };
            stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: decl.ident.clone().into(),
                        init: Some(Box::new(Expr::Fn(FnExpr {
                            ident: Some(decl.ident),
                            function: decl.function,
                        }))),
                        definite: false,
                    }],
                    ..Default::default()
                }
                .into(),
            );
        } else {
            extra_stmts.push(stmt);
        }
    }

    stmts.append(&mut extra_stmts);
    block.stmts = stmts;
}
