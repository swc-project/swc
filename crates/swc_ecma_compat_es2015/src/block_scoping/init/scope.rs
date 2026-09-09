use rustc_hash::FxHashMap;
use swc_common::{Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Evaluate all initializers in fresh catch bindings, then copy their values
/// into the unchanged iteration bindings. Catch handlers add neither a function
/// frame nor a runtime builtin dependency, and exceptions in them propagate.
pub(super) fn separate(
    mut decl: Box<VarDecl>,
    bindings: Vec<Id>,
    scratch: &Ident,
) -> (Box<VarDecl>, Stmt) {
    let initial: Vec<_> = bindings
        .iter()
        .map(|id| {
            Ident::new(
                id.0.clone(),
                DUMMY_SP,
                SyntaxContext::empty().apply_mark(Mark::new()),
            )
        })
        .collect();
    let contexts = bindings
        .iter()
        .cloned()
        .zip(initial.iter().map(|ident| ident.ctxt))
        .collect();
    // rename() deliberately ignores equal spellings, including their contexts.
    // Only initializer IDs change here; iteration references must never enter
    // these catch subtrees or hygiene would need to rename the catch bindings.
    decl.visit_mut_with(&mut InitializerContexts(contexts));

    let mut stmts = Vec::with_capacity(decl.decls.len() + 1);
    for declarator in decl.decls {
        if let Some(value) = declarator.init {
            // Assignment and destructuring defaults retain NamedEvaluation
            // because their binding identifiers keep their source spellings.
            stmts.push(
                AssignExpr {
                    span: declarator.span,
                    op: op!("="),
                    left: declarator
                        .name
                        .try_into()
                        .expect("valid declaration pattern"),
                    right: value,
                }
                .into_stmt(),
            );
        }
    }
    stmts.push(
        assign(
            scratch,
            ArrayLit {
                span: DUMMY_SP,
                // A literal defines own properties without invoking inherited setters.
                elems: initial
                    .iter()
                    .map(|ident| Some(ident.clone().as_arg()))
                    .collect(),
            }
            .into(),
        )
        .into_stmt(),
    );

    // Establish every binding before evaluating any initializer. This also lets
    // closures in an earlier initializer capture a later header binding.
    for ident in initial.into_iter().rev() {
        stmts = vec![catch(ident, stmts)];
    }
    let initialization = stmts.pop().expect("captured header has a binding");

    let last = bindings.len() - 1;
    decl.decls = bindings
        .into_iter()
        .enumerate()
        .map(|(index, id)| {
            let ident = Ident::new(id.0, DUMMY_SP, id.1);
            let mut value: Box<Expr> = MemberExpr {
                span: DUMMY_SP,
                obj: scratch.clone().into(),
                prop: MemberProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: (index as f64).into(),
                }),
            }
            .into();
            if index == last {
                // Release the snapshot before the first test without losing its
                // last value or keeping all initializer values alive via scratch.
                value = SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![
                        assign(&ident, value),
                        assign(scratch, Expr::undefined(DUMMY_SP)),
                        ident.clone().into(),
                    ],
                }
                .into();
            }
            VarDeclarator {
                span: DUMMY_SP,
                name: ident.into(),
                init: Some(value),
                definite: false,
            }
        })
        .collect();
    (decl, initialization)
}

fn assign(ident: &Ident, value: Box<Expr>) -> Box<Expr> {
    AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left: ident.clone().into(),
        right: value,
    }
    .into()
}

pub(super) fn catch(ident: Ident, stmts: Vec<Stmt>) -> Stmt {
    TryStmt {
        span: DUMMY_SP,
        block: BlockStmt {
            stmts: vec![ThrowStmt {
                span: DUMMY_SP,
                arg: Expr::undefined(DUMMY_SP),
            }
            .into()],
            ..Default::default()
        },
        handler: Some(CatchClause {
            span: DUMMY_SP,
            param: Some(ident.into()),
            body: BlockStmt {
                stmts,
                ..Default::default()
            },
        }),
        finalizer: None,
    }
    .into()
}

pub(super) struct InitializerContexts(pub(super) FxHashMap<Id, SyntaxContext>);

impl VisitMut for InitializerContexts {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        if let Some(&ctxt) = self.0.get(&ident.to_id()) {
            ident.ctxt = ctxt;
        }
    }
}
