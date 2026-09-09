use rustc_hash::FxHashMap;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

/// Export helper parameters without referring to the same-spelled iteration
/// bindings from inside the helper. Those outer references would force hygiene
/// to rename the parameters, changing direct eval and inferred function names.
pub(crate) fn finish_body(
    body: &mut FunctionBody,
    scratch: &Ident,
    bindings: &FxHashMap<Id, SyntaxContext>,
) -> Vec<Stmt> {
    let mut values = Vec::with_capacity(bindings.len());
    let mut copies = Vec::with_capacity(bindings.len() + 1);
    for (index, (id, ctxt)) in bindings.iter().enumerate() {
        values.push(Some(Ident::new(id.0.clone(), DUMMY_SP, *ctxt).as_arg()));
        copies.push(
            AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: Ident::new(id.0.clone(), DUMMY_SP, id.1).into(),
                right: MemberExpr {
                    span: DUMMY_SP,
                    obj: scratch.clone().into(),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: (index as f64).into(),
                    }),
                }
                .into(),
            }
            .into_stmt(),
        );
    }
    copies.push(
        AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: scratch.clone().into(),
            right: Expr::undefined(DUMMY_SP),
        }
        .into_stmt(),
    );

    // The finally block runs after evaluating any return value and outside any
    // `with` in the original body, so that object cannot intercept the scratch.
    body.stmts = vec![TryStmt {
        span: DUMMY_SP,
        block: BlockStmt {
            stmts: std::mem::take(&mut body.stmts),
            ..Default::default()
        },
        handler: None,
        finalizer: Some(BlockStmt {
            stmts: vec![AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: scratch.clone().into(),
                right: ArrayLit {
                    span: DUMMY_SP,
                    elems: values,
                }
                .into(),
            }
            .into_stmt()],
            ..Default::default()
        }),
    }
    .into()];
    copies
}
