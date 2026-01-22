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
//! ## Trailing Static Blocks (Future-proofing for frozen classes)
//!
//! Trailing static blocks (those after all static fields/private props) are
//! handled specially to avoid issues with the TC39 proposal for nonextensible
//! classes. Instead of creating private properties, they are wrapped in
//! functions that execute after the class definition.
//!
//! Input:
//! ```js
//! class C {
//!   static #foo = 1;
//!   static { Object.freeze(this); }
//! }
//! ```
//!
//! Output:
//! ```js
//! var _initStaticBlock;
//! class C {
//!   static #foo = 1;
//!   static #_ = (_initStaticBlock = () => { Object.freeze(this); });
//! }
//! _initStaticBlock.call(C);
//! ```
//!
//! ## References
//! * TC39 proposal: <https://github.com/tc39/proposal-class-static-block>
//! * Frozen class issue: <https://github.com/tc39/proposal-nonextensible-applies-to-private/issues/1>

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{source_map::PLACEHOLDER_SP, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{private_ident, ExprFactory};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ClassStaticBlock::default()
}

#[derive(Default)]
struct ClassStaticBlock {
    /// Stack of sets of existing private names for nested classes
    existing_names_stack: Vec<FxHashSet<Atom>>,
    /// Counter for generating unique variable names for trailing static blocks
    trailing_block_counter: u32,
    /// Stack of class identifiers for class declarations/expressions
    /// When we enter a ClassDecl/ClassExpr, we push the identifier.
    /// When we exit the Class, we pop it and use it.
    class_ident_stack: Vec<Option<Ident>>,
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

    /// Check if a class member is a static private property
    fn is_static_private_prop(member: &ClassMember) -> bool {
        match member {
            ClassMember::PrivateProp(prop) => prop.is_static,
            _ => false,
        }
    }

    /// Check if a class member is any static field (public or private)
    fn is_static_field(member: &ClassMember) -> bool {
        match member {
            ClassMember::ClassProp(prop) => prop.is_static,
            ClassMember::PrivateProp(prop) => prop.is_static,
            _ => false,
        }
    }

    /// Find the index of the last static field (public or private) in the class
    /// body
    fn find_last_static_field_index(body: &[ClassMember]) -> Option<usize> {
        body.iter()
            .enumerate()
            .rev()
            .find(|(_, member)| Self::is_static_field(member))
            .map(|(i, _)| i)
    }

    /// Check if the class has any static private properties
    fn has_static_private_props(body: &[ClassMember]) -> bool {
        body.iter().any(Self::is_static_private_prop)
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

    /// Transform a trailing static block into a private property that assigns
    /// to a variable, for later execution after class definition.
    fn transform_trailing_static_block(
        &mut self,
        block: StaticBlock,
        existing_names: &mut FxHashSet<Atom>,
        ctx: &mut TraverseCtx,
    ) -> (ClassMember, Ident) {
        let span = block.span;
        let stmts = block.body.stmts;

        // Generate a unique private name
        let private_name = self.generate_unique_name(existing_names);
        existing_names.insert(private_name.clone());

        // Generate a unique variable name for the trailing block
        let var_name = format!("_initStaticBlock{}", self.trailing_block_counter);
        self.trailing_block_counter += 1;
        let var_ident = private_ident!(var_name);

        // Declare the variable in the enclosing scope
        ctx.var_declarations
            .insert_var(var_ident.clone().into(), None);

        // Create the arrow function
        let arrow = self.create_arrow_fn(stmts);

        // Create the assignment: _initStaticBlock = () => { ... }
        let assign_expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: var_ident.clone().into(),
            right: Box::new(arrow),
        });

        let member = ClassMember::PrivateProp(PrivateProp {
            span,
            ctxt: Default::default(),
            key: PrivateName {
                // Use PLACEHOLDER_SP to signal to class_properties
                // that this came from a static block
                span: PLACEHOLDER_SP,
                name: private_name,
            },
            value: Some(Box::new(assign_expr)),
            type_ann: None,
            is_static: true,
            decorators: vec![],
            accessibility: None,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        });

        (member, var_ident)
    }

    /// Create an arrow function from statements
    fn create_arrow_fn(&self, stmts: Vec<Stmt>) -> Expr {
        ArrowExpr {
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
        }
        .into()
    }

    /// Wrap statements in an immediately-invoked arrow function expression
    fn wrap_in_iife(&self, stmts: Vec<Stmt>) -> Expr {
        let arrow = self.create_arrow_fn(stmts);

        CallExpr {
            span: DUMMY_SP,
            callee: arrow.as_callee(),
            args: vec![],
            type_args: None,
            ctxt: Default::default(),
        }
        .into()
    }

    /// Process the class body and transform static blocks
    fn process_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) -> Vec<Ident> {
        // Collect existing private names after nested classes have been transformed
        // This ensures we see all private names including those generated from
        // static blocks in nested classes
        let mut existing_names = self.collect_existing_private_names(class);

        // Only apply trailing block optimization if class has static private props.
        // This is needed to future-proof against the TC39 proposal that would make
        // frozen classes throw when adding private fields. If a class has no static
        // private props, freezing it won't affect adding #_ private properties.
        let has_static_private = Self::has_static_private_props(&class.body);

        // Find the last static field (public or private) index to determine trailing
        // blocks We use the last static field because blocks after ALL static
        // fields are truly trailing
        let last_static_field_idx = Self::find_last_static_field_index(&class.body);

        // Collect all trailing static block indices (those after ALL static fields)
        // Only if the class actually has static private properties
        let mut trailing_block_indices = Vec::new();

        if has_static_private {
            for (i, member) in class.body.iter().enumerate() {
                if let ClassMember::StaticBlock(block) = member {
                    if !block.body.stmts.is_empty() {
                        match last_static_field_idx {
                            Some(last_idx) if i > last_idx => {
                                trailing_block_indices.push(i);
                            }
                            None => {
                                // No static fields at all - all blocks are
                                // trailing
                                // (This case shouldn't happen since
                                // has_static_private is true)
                            }
                            _ => {}
                        }
                    }
                }
            }
        }

        // Transform all static blocks in the class body
        let mut trailing_var_idents = Vec::new();
        let mut new_body = Vec::with_capacity(class.body.len());
        for (i, member) in class.body.drain(..).enumerate() {
            match member {
                ClassMember::StaticBlock(block) => {
                    // Skip empty static blocks entirely
                    if !block.body.stmts.is_empty() {
                        if trailing_block_indices.contains(&i) {
                            // Trailing block - transform specially for deferred execution
                            let (transformed, var_ident) = self.transform_trailing_static_block(
                                block,
                                &mut existing_names,
                                ctx,
                            );
                            new_body.push(transformed);
                            trailing_var_idents.push(var_ident);
                        } else {
                            // Non-trailing block - transform as usual
                            let transformed =
                                self.transform_static_block(block, &mut existing_names);
                            new_body.push(transformed);
                        }
                    }
                }
                other => {
                    new_body.push(other);
                }
            }
        }
        class.body = new_body;

        trailing_var_idents
    }
}

impl VisitMutHook<TraverseCtx> for ClassStaticBlock {
    fn enter_class_decl(&mut self, n: &mut ClassDecl, _ctx: &mut TraverseCtx) {
        // Push the class identifier onto the stack
        self.class_ident_stack.push(Some(n.ident.clone()));
        // Push an empty set for this class level
        self.existing_names_stack.push(FxHashSet::default());
    }

    fn exit_class_decl(&mut self, n: &mut ClassDecl, ctx: &mut TraverseCtx) {
        // Pop the existing names set
        let _parent_names = self.existing_names_stack.pop().expect(
            "existing_names_stack underflow: exit_class_decl called without matching enter",
        );

        // Pop the class identifier
        let class_ident = self.class_ident_stack.pop().flatten();

        // Process the class body
        let trailing_var_idents = self.process_class(&mut n.class, ctx);

        // If there are trailing blocks, register them for execution after class
        // definition
        if !trailing_var_idents.is_empty() {
            if let Some(class_ident) = class_ident {
                let class_addr = n.class.as_ref() as *const Class;

                // For multiple trailing blocks, we need to call each one
                // Register all of them
                for var_ident in trailing_var_idents {
                    ctx.trailing_static_blocks
                        .register(class_addr, var_ident, class_ident.clone());
                }
            }
        }
    }

    fn enter_class_expr(&mut self, n: &mut ClassExpr, _ctx: &mut TraverseCtx) {
        // Push the class identifier (may be None for anonymous classes)
        self.class_ident_stack.push(n.ident.clone());
        // Push an empty set for this class level
        self.existing_names_stack.push(FxHashSet::default());
    }

    fn exit_class_expr(&mut self, n: &mut ClassExpr, ctx: &mut TraverseCtx) {
        // Pop the existing names set
        let _parent_names = self.existing_names_stack.pop().expect(
            "existing_names_stack underflow: exit_class_expr called without matching enter",
        );

        // Pop the class identifier
        let class_ident = self.class_ident_stack.pop().flatten();

        // Process the class body
        let trailing_var_idents = self.process_class(&mut n.class, ctx);

        // For class expressions with an identifier, we can register trailing blocks
        // For anonymous class expressions, we can't easily inject the call after
        // because there's no stable identifier to use. In that case, we just
        // leave the assignment in place (it won't be called, but at least
        // it won't cause issues with freezing since the function isn't executed).
        if !trailing_var_idents.is_empty() {
            if let Some(class_ident) = class_ident {
                let class_addr = n.class.as_ref() as *const Class;

                for var_ident in trailing_var_idents {
                    ctx.trailing_static_blocks
                        .register(class_addr, var_ident, class_ident.clone());
                }
            }
        }
    }
}
