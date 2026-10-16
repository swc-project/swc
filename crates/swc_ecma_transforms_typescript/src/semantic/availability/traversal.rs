//! Definition collection and substitution use identical execution boundaries.

use swc_ecma_ast::Function;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// Decorators execute when the enclosing class is evaluated, including those
/// stored on parameters rather than on the function itself.
pub(in crate::semantic) fn visit_function_decorators(
    node: &mut Function,
    visitor: &mut impl VisitMut,
) {
    node.decorators.visit_mut_with(visitor);
    for parameter in &mut node.params {
        parameter.decorators.visit_mut_with(visitor);
    }
}

/// Visit only runtime children evaluated on invocation. Type syntax is erased
/// and decorators have already been visited in the enclosing execution region.
pub(in crate::semantic) fn visit_function_execution(
    node: &mut Function,
    visitor: &mut impl VisitMut,
) {
    for parameter in &mut node.params {
        parameter.pat.visit_mut_with(visitor);
    }
    node.body.visit_mut_with(visitor);
}

macro_rules! visit_execution_regions {
    () => {
        fn visit_mut_function(&mut self, node: &mut Function) {
            $crate::semantic::availability::visit_function_decorators(node, self);
            self.deferred(|collector| {
                $crate::semantic::availability::visit_function_execution(node, collector);
            });
        }

        fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
            self.deferred(|collector| node.visit_mut_children_with(collector));
        }

        fn visit_mut_constructor(&mut self, node: &mut Constructor) {
            for parameter in &mut node.params {
                match parameter {
                    ParamOrTsParamProp::Param(parameter) => {
                        parameter.decorators.visit_mut_with(self);
                    }
                    ParamOrTsParamProp::TsParamProp(parameter) => {
                        parameter.decorators.visit_mut_with(self);
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                }
            }
            self.deferred(|collector| {
                node.key.visit_mut_with(collector);
                for parameter in &mut node.params {
                    match parameter {
                        ParamOrTsParamProp::Param(parameter) => {
                            parameter.pat.visit_mut_with(collector);
                        }
                        ParamOrTsParamProp::TsParamProp(parameter) => {
                            parameter.param.visit_mut_with(collector);
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }
                node.body.visit_mut_with(collector);
            });
        }

        fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
            $crate::semantic::availability::visit_function_decorators(&mut node.function, self);
            // Method names participate in the method's semantic deferred region,
            // as do parameter initializers and the body. Ordinary computed
            // properties do not.
            self.deferred(|collector| {
                node.key.visit_mut_with(collector);
                $crate::semantic::availability::visit_function_execution(
                    &mut node.function,
                    collector,
                );
            });
        }

        fn visit_mut_private_method(&mut self, node: &mut PrivateMethod) {
            node.function.visit_mut_with(self);
        }

        fn visit_mut_method_prop(&mut self, node: &mut MethodProp) {
            $crate::semantic::availability::visit_function_decorators(&mut node.function, self);
            self.deferred(|collector| {
                node.key.visit_mut_with(collector);
                $crate::semantic::availability::visit_function_execution(
                    &mut node.function,
                    collector,
                );
            });
        }

        fn visit_mut_getter_prop(&mut self, node: &mut GetterProp) {
            self.deferred(|collector| {
                node.key.visit_mut_with(collector);
                node.function.visit_mut_children_with(collector);
            });
        }

        fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
            self.deferred(|collector| {
                node.key.visit_mut_with(collector);
                node.function.visit_mut_children_with(collector);
            });
        }

        fn visit_mut_auto_accessor(&mut self, node: &mut AutoAccessor) {
            node.key.visit_mut_with(self);
            node.decorators.visit_mut_with(self);
            if node.is_static {
                node.value.visit_mut_with(self);
            } else if let Some(value) = &mut node.value {
                self.deferred(|collector| value.visit_mut_with(collector));
            }
        }

        fn visit_mut_class_prop(&mut self, node: &mut ClassProp) {
            node.key.visit_mut_with(self);
            node.decorators.visit_mut_with(self);
            if node.is_static {
                node.value.visit_mut_with(self);
            } else if let Some(value) = &mut node.value {
                self.deferred(|collector| value.visit_mut_with(collector));
            }
        }

        fn visit_mut_private_prop(&mut self, node: &mut PrivateProp) {
            node.decorators.visit_mut_with(self);
            if node.is_static {
                node.value.visit_mut_with(self);
            } else if let Some(value) = &mut node.value {
                self.deferred(|collector| value.visit_mut_with(collector));
            }
        }

        fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
            // Direct function IIFEs execute in the current region. Functions
            // nested in their bodies still introduce their own regions.
            if let Callee::Expr(callee) = &mut node.callee {
                let mut callee = &mut **callee;
                // TypeScript recognizes IIFEs only through grouping. Type
                // wrappers retain the function's deferred analysis boundary,
                // even though those wrappers are erased before execution.
                while let Expr::Paren(ParenExpr { expr, .. }) = callee {
                    callee = expr;
                }
                match callee {
                    Expr::Fn(function) => function.function.visit_mut_children_with(self),
                    Expr::Arrow(arrow) => arrow.visit_mut_children_with(self),
                    _ => callee.visit_mut_with(self),
                }
            } else {
                node.callee.visit_mut_with(self);
            }
            node.args.visit_mut_with(self);
        }
    };
}

pub(crate) use visit_execution_regions;
