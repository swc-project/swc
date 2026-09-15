use rustc_hash::FxHashMap;
use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::VisitMutWith;

use super::{mutation, scope};

/// Move unwrapped nested loops' bindings to their enclosing preservation scope
/// without repeatedly copying every descendant ID at each nesting level.
#[derive(Debug, Default, PartialEq, Eq)]
pub(in super::super) struct Bindings {
    ids: Vec<Id>,
    nested: Vec<Self>,
}

impl Bindings {
    pub(in super::super) fn extend(&mut self, ids: impl IntoIterator<Item = Id>) {
        self.ids.extend(ids);
    }

    pub(in super::super) fn nest(&mut self, child: Self) {
        if !child.is_empty() {
            self.nested.push(child);
        }
    }

    pub(in super::super) fn is_empty(&self) -> bool {
        self.ids.is_empty() && self.nested.is_empty()
    }

    pub(in super::super) fn into_ids(self) -> Vec<Id> {
        let mut ids = Vec::new();
        self.collect(&mut ids);
        ids
    }

    fn collect(self, ids: &mut Vec<Id>) {
        ids.extend(self.ids);
        for child in self.nested {
            child.collect(ids);
        }
    }
}

/// Give eval fresh header bindings without changing its variable environment.
/// A function helper would trap sloppy eval's `var` declarations. This path is
/// only used when static captures do not already require a helper and the body
/// does not yield, since generator lowering hoists yielding catch bindings.
pub(in super::super) fn preserve(
    body: &mut Box<Stmt>,
    bindings: &[Id],
    locals: &[Id],
    scratch: Ident,
) {
    let contexts: FxHashMap<_, _> = bindings
        .iter()
        .chain(locals)
        .cloned()
        .map(|id| (id, SyntaxContext::empty().apply_mark(Mark::new())))
        .collect();
    body.visit_mut_with(&mut scope::InitializerContexts(contexts.clone()));

    let mut inner = FunctionBody {
        span: DUMMY_SP,
        stmts: vec![*body.take()],
    };
    let header_contexts = bindings
        .iter()
        .map(|id| (id.clone(), contexts[id]))
        .collect();
    let copies = mutation::finish_body(&mut inner, &scratch, &header_contexts);

    // Body lexical declarations also need fresh storage for eval-only captures.
    // They start undefined, matching the existing lowering's TDZ limitation.
    for id in locals.iter().rev() {
        inner.stmts = vec![scope::catch(
            Ident::new(id.0.clone(), DUMMY_SP, contexts[id]),
            inner.stmts,
        )];
    }

    // Snapshot outside the header catches so outer and inner same-spelled IDs
    // never meet inside their name scopes during hygiene.
    let snapshot = AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left: scratch.clone().into(),
        right: ArrayLit {
            span: DUMMY_SP,
            elems: bindings
                .iter()
                .map(|id| Some(Ident::new(id.0.clone(), DUMMY_SP, id.1).as_arg()))
                .collect(),
        }
        .into(),
    }
    .into_stmt();

    for (index, id) in bindings.iter().enumerate().rev() {
        let ident = Ident::new(id.0.clone(), DUMMY_SP, contexts[id]);
        let mut stmts = vec![AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: ident.clone().into(),
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
        .into_stmt()];
        stmts.extend(inner.stmts);
        inner.stmts = vec![scope::catch(ident, stmts)];
    }

    // The inner finally exports values after source finally blocks run. This
    // outer finally copies them back even on continue, return, or throw. Keep
    // scratch lexical so an enclosing `with` cannot intercept its accesses.
    *body = scope::catch(
        scratch,
        vec![
            snapshot,
            TryStmt {
                span: DUMMY_SP,
                block: BlockStmt {
                    stmts: inner.stmts,
                    ..Default::default()
                },
                handler: None,
                finalizer: Some(BlockStmt {
                    stmts: copies,
                    ..Default::default()
                }),
            }
            .into(),
        ],
    )
    .into();
}
