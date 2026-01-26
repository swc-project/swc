//! ES2022: Class Static Block
//!
//! This module transforms ES2022 class static blocks into private properties
//! with initializers.
//!
//! ## Example
//!
//! Input:
//! ```js
//! class C {
//!   static { foo(); }
//! }
//! ```
//!
//! Output:
//! ```js
//! class C {
//!   static #_ = foo();
//! }
//! ```
//!
//! For multiple statements:
//! ```js
//! class C {
//!   static { foo(); bar(); }
//! }
//! ```
//!
//! Output:
//! ```js
//! class C {
//!   static #_ = (() => { foo(); bar(); })();
//! }
//! ```
//!
//! ## References
//! * TC39 proposal: <https://github.com/tc39/proposal-class-static-block>

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{source_map::PLACEHOLDER_SP, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::ExprFactory;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ClassStaticBlock::default()
}

#[derive(Default)]
struct ClassStaticBlock {
    /// Stack of sets of existing private names for nested classes
    existing_names_stack: Vec<FxHashSet<Atom>>,
}

impl ClassStaticBlock {
    /// Generate a unique private property name that doesn't conflict with
    /// existing names
    fn generate_unique_name(&self, existing_names: &FxHashSet<Atom>) -> Atom {
        // Start with "_"
        let base: Atom = "_".into();
        if !existing_names.contains(&base) {
            return base;
        }

        // Try "_2", "_3", etc.
        let mut counter = 2;
        loop {
            let name: Atom = format!("_{counter}").into();
            if !existing_names.contains(&name) {
                return name;
            }
            counter += 1;
        }
    }

    /// Collect all existing private names in the class
    fn collect_existing_private_names(&self, class: &Class) -> FxHashSet<Atom> {
        let mut names = FxHashSet::default();
        for member in &class.body {
            if let ClassMember::PrivateProp(prop) = member {
                names.insert(prop.key.name.clone());
            } else if let ClassMember::PrivateMethod(method) = member {
                names.insert(method.key.name.clone());
            }
        }
        names
    }

    /// Transform a static block into a private property
    fn transform_static_block(
        &self,
        block: StaticBlock,
        existing_names: &mut FxHashSet<Atom>,
    ) -> ClassMember {
        let span = block.span;
        let mut stmts = block.body.stmts;

        // Generate a unique private name
        let private_name = self.generate_unique_name(existing_names);
        existing_names.insert(private_name.clone());

        let value = if stmts.len() == 1 {
            // For single statement, try to extract the expression directly
            let stmt = stmts.pop().unwrap();
            match stmt {
                Stmt::Expr(ExprStmt { expr, .. }) => {
                    // Single expression statement - use the expression directly (no clone)
                    Some(expr)
                }
                other => {
                    // Other single statement - wrap in IIFE
                    Some(Box::new(self.wrap_in_iife(vec![other])))
                }
            }
        } else if stmts.is_empty() {
            // Empty block - no initializer needed
            None
        } else {
            // Multiple statements - wrap in IIFE
            Some(Box::new(self.wrap_in_iife(stmts)))
        };

        ClassMember::PrivateProp(PrivateProp {
            span,
            ctxt: Default::default(),
            key: PrivateName {
                // Use PLACEHOLDER_SP to signal to class_properties
                // that this came from a static block
                span: PLACEHOLDER_SP,
                name: private_name,
            },
            value,
            type_ann: None,
            is_static: true,
            decorators: vec![],
            accessibility: None,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        })
    }

    /// Wrap statements in an immediately-invoked arrow function expression
    fn wrap_in_iife(&self, stmts: Vec<Stmt>) -> Expr {
        let arrow = ArrowExpr {
            span: DUMMY_SP,
            params: vec![],
            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                stmts,
                ctxt: Default::default(),
            })),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
            ctxt: Default::default(),
        };

        CallExpr {
            span: DUMMY_SP,
            callee: arrow.as_callee(),
            args: vec![],
            type_args: None,
            ctxt: Default::default(),
        }
        .into()
    }
}

impl VisitMutHook<TraverseCtx> for ClassStaticBlock {
    fn enter_class(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        // Push an empty set for this class level
        // We'll collect names in exit_class after nested classes are transformed
        self.existing_names_stack.push(FxHashSet::default());
    }

    fn exit_class(&mut self, class: &mut Class, _ctx: &mut TraverseCtx) {
        // Pop the parent set (not used currently but maintained for stack integrity)
        let _parent_names = self.existing_names_stack.pop().expect(
            "existing_names_stack underflow: exit_class called without matching enter_class",
        );

        // Collect existing private names after nested classes have been transformed
        // This ensures we see all private names including those generated from
        // static blocks in nested classes
        let mut existing_names = self.collect_existing_private_names(class);

        // Transform all static blocks in the class body
        let mut new_body = Vec::with_capacity(class.body.len());
        for member in class.body.drain(..) {
            match member {
                ClassMember::StaticBlock(block) => {
                    // Skip empty static blocks entirely
                    if !block.body.stmts.is_empty() {
                        let transformed = self.transform_static_block(block, &mut existing_names);
                        new_body.push(transformed);
                    }
                }
                other => {
                    new_body.push(other);
                }
            }
        }
        class.body = new_body;
    }
}
