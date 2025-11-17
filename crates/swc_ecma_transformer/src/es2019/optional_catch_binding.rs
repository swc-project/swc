//! Optional catch binding transformation.
//!
//! This transformation adds a dummy parameter to catch clauses that don't have
//! one. This is needed for environments that don't support ES2019's optional
//! catch binding.
//!
//! ## Example
//!
//! Input:
//! ```js
//! try {
//!   throw 0;
//! } catch {
//!   doSomething();
//! }
//! ```
//!
//! Output:
//! ```js
//! try {
//!   throw 0;
//! } catch (_unused) {
//!   doSomething();
//! }
//! ```

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::TransformCtx;

/// Optional catch binding transformation hook.
///
/// This hook implements the transformation for ES2019 optional catch binding.
/// It adds a dummy parameter to catch clauses that don't have one.
pub struct OptionalCatchBinding;

impl OptionalCatchBinding {
    /// Creates a new `OptionalCatchBinding` transformer.
    pub fn new() -> Self {
        Self
    }
}

impl Default for OptionalCatchBinding {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for OptionalCatchBinding {
    // Hook methods if needed (currently none for this simple transform)
}

impl VisitMut for OptionalCatchBinding {
    fn visit_mut_catch_clause(&mut self, clause: &mut CatchClause) {
        // Visit children first
        clause.visit_mut_children_with(self);

        // If the catch clause doesn't have a parameter, add a dummy one
        if clause.param.is_none() {
            // Create a dummy parameter named "_unused"
            let ident = Ident {
                span: clause.span,
                ctxt: Default::default(),
                sym: "_unused".into(),
                optional: false,
            };

            let pat = Pat::Ident(BindingIdent {
                id: ident,
                type_ann: None,
            });

            clause.param = Some(pat);
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_ast::*;
    use swc_ecma_visit::VisitMutWith;

    use super::*;

    #[test]
    fn test_optional_catch_binding_with_no_param() {
        let mut clause = CatchClause {
            span: Default::default(),
            param: None,
            body: BlockStmt {
                span: Default::default(),
                ctxt: Default::default(),
                stmts: vec![],
            },
        };

        let mut transform = OptionalCatchBinding::new();
        clause.visit_mut_with(&mut transform);

        assert!(clause.param.is_some());
        if let Some(Pat::Ident(binding)) = &clause.param {
            assert_eq!(binding.id.sym.as_ref(), "_unused");
        } else {
            panic!("Expected BindingIdent pattern");
        }
    }

    #[test]
    fn test_optional_catch_binding_with_existing_param() {
        let mut clause = CatchClause {
            span: Default::default(),
            param: Some(Pat::Ident(BindingIdent {
                id: Ident {
                    span: Default::default(),
                    ctxt: Default::default(),
                    sym: "error".into(),
                    optional: false,
                },
                type_ann: None,
            })),
            body: BlockStmt {
                span: Default::default(),
                ctxt: Default::default(),
                stmts: vec![],
            },
        };

        let mut transform = OptionalCatchBinding::new();
        clause.visit_mut_with(&mut transform);

        // Should keep the existing parameter
        assert!(clause.param.is_some());
        if let Some(Pat::Ident(binding)) = &clause.param {
            assert_eq!(binding.id.sym.as_ref(), "error");
        } else {
            panic!("Expected BindingIdent pattern");
        }
    }
}
