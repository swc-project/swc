use rustc_hash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::contains_eval;
use swc_ecma_utils::{find_pat_ids, private_ident, IdentRenamer, IdentUsageFinder};
use swc_ecma_visit::VisitMutWith;

/// The uninitialized lexical bindings visible only to the iterable expression.
/// Per-iteration bindings keep their original identities in the loop body.
pub(super) struct LoopHeadScope {
    bindings: Vec<Ident>,
}

impl LoopHeadScope {
    pub(super) fn new(stmt: &mut ForOfStmt) -> Option<Self> {
        let ForHead::VarDecl(head) = &stmt.left else {
            return None;
        };
        if head.kind == VarDeclKind::Var {
            return None;
        }

        let mut bindings = Vec::new();
        let mut aliases = FxHashMap::default();
        let has_eval = contains_eval(&stmt.right, false);
        for binding in find_pat_ids::<_, Ident>(&head.decls[0].name) {
            // Most iterables do not reference the loop head. Avoid adding a
            // scope or declarations to their output.
            if !has_eval && !IdentUsageFinder::find(&binding, &stmt.right) {
                continue;
            }
            let alias = private_ident!(binding.sym.clone());
            aliases.insert(binding.to_id(), alias.to_id());
            bindings.push(alias);
        }
        if bindings.is_empty() {
            return None;
        }

        stmt.right.visit_mut_with(&mut IdentRenamer::new(&aliases));
        Some(Self { bindings })
    }

    pub(super) fn init_iterator(self, mut iterator: VarDeclarator, stmts: &mut Vec<Stmt>) {
        let init = iterator.init.take().unwrap();
        let iterator_ident = iterator.name.as_ident().unwrap().id.clone();
        stmts.push(
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: vec![iterator],
                ..Default::default()
            }
            .into(),
        );

        // A lexical for-in head creates an uninitialized environment for its
        // RHS. The comma expression acquires the iterator, then evaluates to
        // null, so the loop never initializes its bindings or enters its body.
        // Captured bindings therefore remain in the TDZ after the loop ends.
        // This also preserves awaits and lexical super without a wrapper call,
        // and avoids unreachable declarations that compression can discard.
        let bindings = ArrayPat {
            span: DUMMY_SP,
            elems: self
                .bindings
                .into_iter()
                .map(|id| Some(id.into()))
                .collect(),
            optional: false,
            type_ann: None,
        };
        stmts.push(
            ForInStmt {
                span: DUMMY_SP,
                left: ForHead::VarDecl(Box::new(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: bindings.into(),
                        init: None,
                        definite: false,
                    }],
                    ..Default::default()
                })),
                right: SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: iterator_ident.into(),
                            right: init,
                        }
                        .into(),
                        Null { span: DUMMY_SP }.into(),
                    ],
                }
                .into(),
                body: Box::new(Stmt::Block(BlockStmt::default())),
            }
            .into(),
        );
    }
}
