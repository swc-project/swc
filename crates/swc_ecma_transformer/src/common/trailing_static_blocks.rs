//! Utility transform to handle trailing static blocks that need to run after
//! class definition.
//!
//! When static blocks are transformed to private properties, the last static
//! blocks (those with no static fields/private properties after them) must be
//! deferred to run after the class definition to avoid issues with frozen
//! classes.
//!
//! See: https://github.com/tc39/proposal-nonextensible-applies-to-private/issues/1
//!
//! `TrailingStaticBlocksStore` stores expressions to be called after class
//! declarations. `TrailingStaticBlocks` transform injects call statements after
//! class declarations.

use rustc_hash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

/// Transform that injects trailing static block calls after class declarations.
#[derive(Debug, Default)]
pub struct TrailingStaticBlocks;

/// Info about trailing static blocks for a class.
#[derive(Debug)]
struct TrailingBlockInfo {
    /// Variable identifiers holding the trailing block functions
    var_idents: Vec<Ident>,
    /// The class identifier to use as `this` in the calls
    class_ident: Ident,
}

/// Store for trailing static block expressions keyed by class address.
#[derive(Default, Debug)]
pub struct TrailingStaticBlocksStore {
    /// Map from class address to trailing block info.
    blocks: FxHashMap<*const Class, TrailingBlockInfo>,
}

impl TrailingStaticBlocksStore {
    /// Register a trailing static block for a class.
    pub fn register(&mut self, class_addr: *const Class, var_ident: Ident, class_ident: Ident) {
        let entry = self
            .blocks
            .entry(class_addr)
            .or_insert_with(|| TrailingBlockInfo {
                var_idents: Vec::new(),
                class_ident: class_ident.clone(),
            });
        entry.var_idents.push(var_ident);
    }

    /// Take the trailing block info for a class, if any.
    fn take(&mut self, class_addr: *const Class) -> Option<TrailingBlockInfo> {
        self.blocks.remove(&class_addr)
    }
}

impl VisitMutHook<TraverseCtx> for TrailingStaticBlocks {
    fn exit_stmts(&mut self, stmts: &mut Vec<Stmt>, ctx: &mut TraverseCtx) {
        let mut insertions = Vec::new();

        for (i, stmt) in stmts.iter().enumerate() {
            if let Stmt::Decl(Decl::Class(class_decl)) = stmt {
                let class_addr = class_decl.class.as_ref() as *const Class;
                if let Some(info) = ctx.trailing_static_blocks.take(class_addr) {
                    // Create call statements for each trailing block
                    let call_stmts: Vec<Stmt> = info
                        .var_idents
                        .into_iter()
                        .map(|var_ident| create_call_stmt(var_ident, info.class_ident.clone()))
                        .collect();
                    insertions.push((i + 1, call_stmts));
                }
            }
        }

        // Insert in reverse order to avoid index invalidation
        for (i, call_stmts) in insertions.into_iter().rev() {
            for (offset, stmt) in call_stmts.into_iter().enumerate() {
                stmts.insert(i + offset, stmt);
            }
        }
    }

    fn exit_module_items(&mut self, items: &mut Vec<ModuleItem>, ctx: &mut TraverseCtx) {
        let mut insertions = Vec::new();

        for (i, item) in items.iter().enumerate() {
            let class_decl = match item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Class(class_decl))) => Some(class_decl),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(class_decl),
                    ..
                })) => Some(class_decl),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl: DefaultDecl::Class(class_expr),
                    ..
                })) => {
                    // For default export class expressions, we need to handle them
                    // differently - the class_expr doesn't have an ident we can use
                    // Skip for now
                    let _ = class_expr;
                    None
                }
                _ => None,
            };

            if let Some(class_decl) = class_decl {
                let class_addr = class_decl.class.as_ref() as *const Class;
                if let Some(info) = ctx.trailing_static_blocks.take(class_addr) {
                    let call_items: Vec<ModuleItem> = info
                        .var_idents
                        .into_iter()
                        .map(|var_ident| {
                            ModuleItem::Stmt(create_call_stmt(var_ident, info.class_ident.clone()))
                        })
                        .collect();
                    insertions.push((i + 1, call_items));
                }
            }
        }

        // Insert in reverse order to avoid index invalidation
        for (i, call_items) in insertions.into_iter().rev() {
            for (offset, item) in call_items.into_iter().enumerate() {
                items.insert(i + offset, item);
            }
        }
    }
}

fn create_call_stmt(var_ident: Ident, class_ident: Ident) -> Stmt {
    // Create: _initStaticBlock.call(ClassName);
    ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(var_ident)),
                prop: MemberProp::Ident(IdentName::new("call".into(), DUMMY_SP)),
            }))),
            args: vec![ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Ident(class_ident)),
            }],
            type_args: None,
            ctxt: Default::default(),
        })),
    }
    .into()
}
