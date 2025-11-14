//! ES2022: Class Properties
//! Transform of class itself.
//!
//! Stub implementation for SWC - provides minimal structure for compilation.

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

use super::{ClassBindings, ClassDetails, ClassProperties, FxIndexMap, PrivateProp};
use crate::context::TraverseCtx;

impl ClassProperties {
    /// Perform first phase of transformation of class.
    ///
    /// This is the only entry point into the transform upon entering class
    /// body.
    ///
    /// Stub implementation - performs basic checks but doesn't transform.
    pub fn transform_class_body_on_entry(
        &mut self,
        body: &mut [ClassMember],
        _ctx: &mut TraverseCtx<'_>,
    ) {
        // Stub implementation - just check if transform is needed
        let mut has_properties = false;
        let mut private_props = FxIndexMap::default();

        for element in body.iter() {
            match element {
                ClassMember::ClassProp(_) => {
                    has_properties = true;
                }
                ClassMember::PrivateProp(prop) => {
                    has_properties = true;
                    let name = prop.key.name.clone();
                    private_props.insert(
                        name.clone(),
                        PrivateProp::new(name, prop.is_static, None, false),
                    );
                }
                ClassMember::PrivateMethod(method) => {
                    let name = method.key.name.clone();
                    private_props.insert(
                        name.clone(),
                        PrivateProp::new(name, method.is_static, Some(method.kind), false),
                    );
                }
                _ => {}
            }
        }

        self.private_field_count += private_props.len();

        // Add entry to stack
        self.classes_stack.push(ClassDetails {
            is_declaration: true, // Simplified - always treat as declaration
            is_transform_required: has_properties,
            private_props: if private_props.is_empty() {
                None
            } else {
                Some(private_props)
            },
            bindings: ClassBindings::dummy(),
        });

        // Stub - no actual transformation performed
        // TODO: Implement full transformation logic
    }

    /// Transform class declaration on exit.
    ///
    /// Stub implementation.
    pub(super) fn transform_class_declaration_on_exit(
        &mut self,
        _class: &mut Class,
        _ctx: &mut TraverseCtx<'_>,
    ) {
        // Pop from stack
        let class_details = self.classes_stack.pop();
        if let Some(private_props) = &class_details.private_props {
            self.private_field_count -= private_props.len();
        }

        // Stub - no actual transformation performed
        // TODO: Implement exit transformation
    }

    /// Transform class expression on exit.
    ///
    /// Stub implementation.
    pub(super) fn transform_class_expression_on_exit(
        &mut self,
        _expr: &mut Expr,
        _ctx: &mut TraverseCtx<'_>,
    ) {
        // Pop from stack
        let class_details = self.classes_stack.pop();
        if let Some(private_props) = &class_details.private_props {
            self.private_field_count -= private_props.len();
        }

        // Stub - no actual transformation performed
        // TODO: Implement exit transformation
    }

    /// Transform class elements.
    ///
    /// Stub implementation.
    fn transform_class_elements(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx<'_>) {
        // Stub implementation
        // TODO: Implement class element transformation
    }

    /// Flag that static private fields should be transpiled using temp binding.
    ///
    /// Stub implementation.
    pub(super) fn flag_entering_static_property_or_block(&mut self) {
        // Stub implementation
        let class = self.classes_stack.last_mut();
        class.bindings.static_private_fields_use_temp = true;
    }

    /// Flag that static private fields should be transpiled using name binding.
    ///
    /// Stub implementation.
    pub(super) fn flag_exiting_static_property_or_block(&mut self) {
        // Stub implementation
        let class = self.classes_stack.last_mut();
        if class.is_declaration {
            class.bindings.static_private_fields_use_temp = false;
        }
    }

    /// Insert an expression after the class.
    ///
    /// Stub implementation.
    pub(super) fn insert_expr_after_class(&mut self, expr: Box<Expr>, _ctx: &TraverseCtx<'_>) {
        if self.current_class().is_declaration {
            self.insert_after_stmts.push(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr,
            }));
        } else {
            self.insert_after_exprs.push(*expr);
        }
    }
}
