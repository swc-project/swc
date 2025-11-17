//! Class static block transformation.
//!
//! This transformation converts ES2022 class static blocks into equivalent
//! private static field initializers.
//!
//! Based on [@babel/plugin-transform-class-static-block](https://babel.dev/docs/babel-plugin-transform-class-static-block)
//!
//! # Transformation
//!
//! ## Single expression blocks
//!
//! ```js
//! class C {
//!     static { foo; }
//! }
//! ```
//!
//! Becomes:
//!
//! ```js
//! class C {
//!     static #_ = foo;
//! }
//! ```
//!
//! ## Multi-statement blocks
//!
//! ```js
//! class C {
//!     static { foo; bar; }
//! }
//! ```
//!
//! Becomes:
//!
//! ```js
//! class C {
//!     static #_ = (() => { foo; bar; })();
//! }
//! ```

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// Manages unique private key generation for static blocks.
///
/// Generates keys like `#_`, `#_2`, `#_3`, etc., avoiding collisions with
/// existing private properties.
#[derive(Debug, Default)]
struct KeysManager {
    /// Set to true when the first static block is found.
    has_static_block: bool,
    /// Counter for generating unique keys when collisions occur.
    next_key_index: u32,
    /// Reserved keys that are already in use.
    reserved_keys: Vec<String>,
}

impl KeysManager {
    /// Creates a new keys manager.
    fn new() -> Self {
        Self::default()
    }

    /// Marks that a static block was found.
    fn mark_has_static_block(&mut self) {
        self.has_static_block = true;
    }

    /// Reserves a private key name.
    fn reserve_key(&mut self, name: &str) {
        // Only track keys that match our pattern: `_` or `_` followed by digits
        if name == "_" || (name.starts_with('_') && name[1..].chars().all(|c| c.is_ascii_digit())) {
            self.reserved_keys.push(name.to_string());
        }
    }

    /// Generates a unique private key name.
    fn generate_unique_key(&mut self) -> String {
        if !self.has_static_block {
            return "_".to_string();
        }

        loop {
            let key = if self.next_key_index == 0 {
                "_".to_string()
            } else {
                format!("_{}", self.next_key_index + 1)
            };

            self.next_key_index += 1;

            if !self.reserved_keys.contains(&key) {
                return key;
            }
        }
    }
}

/// Transforms class static blocks into private static field initializers.
///
/// This transformation is part of ES2022 support and converts static
/// initialization blocks into equivalent private static fields with computed
/// values.
#[derive(Debug)]
pub struct ClassStaticBlock {
    keys_manager: KeysManager,
}

impl ClassStaticBlock {
    /// Creates a new class static block transformer.
    pub fn new() -> Self {
        Self {
            keys_manager: KeysManager::new(),
        }
    }

    /// Processes a class body, transforming static blocks.
    fn transform_class_body(&mut self, body: &mut Vec<ClassMember>) {
        // First pass: scan for existing private properties and static blocks
        for member in body.iter() {
            match member {
                ClassMember::PrivateProp(prop) => {
                    self.keys_manager.reserve_key(&prop.key.name);
                }
                ClassMember::StaticBlock(_) => {
                    self.keys_manager.mark_has_static_block();
                }
                _ => {}
            }
        }

        // Second pass: transform static blocks
        let mut i = 0;
        while i < body.len() {
            if let ClassMember::StaticBlock(static_block) = &body[i] {
                let unique_key = self.keys_manager.generate_unique_key();
                let transformed = self.transform_static_block(static_block, unique_key);
                body[i] = ClassMember::PrivateProp(transformed);
            }
            i += 1;
        }
    }

    /// Transforms a single static block into a private property.
    fn transform_static_block(
        &self,
        static_block: &StaticBlock,
        unique_key: String,
    ) -> PrivateProp {
        let value = if static_block.body.stmts.len() == 1 {
            // Single statement: try to extract expression
            self.transform_single_statement(&static_block.body.stmts[0])
        } else {
            // Multiple statements: wrap in IIFE
            self.transform_multi_statement(&static_block.body.stmts)
        };

        PrivateProp {
            span: static_block.span,
            ctxt: Default::default(),
            key: PrivateName {
                span: DUMMY_SP,
                name: unique_key.into(),
            },
            value: Some(Box::new(value)),
            type_ann: None,
            is_static: true,
            decorators: vec![],
            is_override: false,
            accessibility: None,
            is_optional: false,
            readonly: false,
            definite: false,
        }
    }

    /// Transforms a single statement into an expression.
    fn transform_single_statement(&self, stmt: &Stmt) -> Expr {
        match stmt {
            Stmt::Expr(expr_stmt) => *expr_stmt.expr.clone(),
            _ => {
                // Wrap non-expression statement in IIFE
                self.wrap_in_iife(&[stmt.clone()])
            }
        }
    }

    /// Transforms multiple statements into an IIFE.
    fn transform_multi_statement(&self, stmts: &[Stmt]) -> Expr {
        self.wrap_in_iife(stmts)
    }

    /// Wraps statements in an immediately-invoked arrow function expression.
    fn wrap_in_iife(&self, stmts: &[Stmt]) -> Expr {
        // Create arrow function: () => { statements }
        let arrow_fn = ArrowExpr {
            span: DUMMY_SP,
            params: vec![],
            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                stmts: stmts.to_vec(),
                ..Default::default()
            })),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
            ..Default::default()
        };

        // Create call expression: (() => { statements })()
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Arrow(arrow_fn)),
            }))),
            args: vec![],
            ..Default::default()
        })
    }
}

impl Default for ClassStaticBlock {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for ClassStaticBlock {
    /// Called when entering a class node.
    fn enter_class(&mut self, node: &mut Class, _ctx: &mut TransformCtx) {
        self.transform_class_body(&mut node.body);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keys_manager_basic() {
        let mut manager = KeysManager::new();
        assert_eq!(manager.generate_unique_key(), "_");
    }

    #[test]
    fn test_keys_manager_with_collision() {
        let mut manager = KeysManager::new();
        manager.reserve_key("_");
        manager.mark_has_static_block();
        assert_eq!(manager.generate_unique_key(), "_2");
    }

    #[test]
    fn test_keys_manager_multiple_collisions() {
        let mut manager = KeysManager::new();
        manager.reserve_key("_");
        manager.reserve_key("_2");
        manager.mark_has_static_block();
        assert_eq!(manager.generate_unique_key(), "_3");
    }

    #[test]
    fn test_transform_static_block_single_expr() {
        let transformer = ClassStaticBlock::new();

        // Create a static block with a single expression statement
        let static_block = StaticBlock {
            span: DUMMY_SP,
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 1.0,
                        raw: None,
                    }))),
                })],
                ..Default::default()
            },
        };

        let result = transformer.transform_static_block(&static_block, "_".to_string());

        assert!(result.is_static);
        assert_eq!(result.key.name.as_ref(), "_");
        assert!(result.value.is_some());
    }

    #[test]
    fn test_transform_static_block_multi_stmt() {
        let transformer = ClassStaticBlock::new();

        // Create a static block with multiple statements
        let static_block = StaticBlock {
            span: DUMMY_SP,
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![
                    Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 1.0,
                            raw: None,
                        }))),
                    }),
                    Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 2.0,
                            raw: None,
                        }))),
                    }),
                ],
                ..Default::default()
            },
        };

        let result = transformer.transform_static_block(&static_block, "_".to_string());

        assert!(result.is_static);
        assert_eq!(result.key.name.as_ref(), "_");

        // Should be wrapped in IIFE (call expression)
        if let Some(value) = result.value {
            if let Expr::Call(_) = *value {
                // Expected: IIFE call expression
            } else {
                panic!("Expected call expression for multi-statement block");
            }
        } else {
            panic!("Expected value for transformed static block");
        }
    }

    #[test]
    fn test_class_static_block_creation() {
        let transformer = ClassStaticBlock::new();
        assert!(transformer.keys_manager.reserved_keys.is_empty());
    }
}
