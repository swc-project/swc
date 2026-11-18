//! Resolve each object chain once and reuse its root's reference facts.

use swc_ecma_ast::{Expr, Ident};
use swc_ecma_utils::{
    stack_size::maybe_grow_default,
    ts_bindings::{TsBindings, TsMemberResolution, TsValueTarget},
};

use super::candidates::{Candidates, ReferenceFacts};

#[derive(Default)]
enum RootReference {
    #[default]
    Pending,
    Cached(Option<ReferenceFacts>),
}

#[derive(Default)]
pub(super) struct MemberTargets {
    targets: Vec<Option<TsValueTarget>>,
    unknown: usize,
    // The object root is visited before any computed member keys.
    root: RootReference,
}

impl MemberTargets {
    pub(super) fn candidate(
        &mut self,
        ident: &Ident,
        candidates: &Candidates<'_>,
    ) -> Option<ReferenceFacts> {
        match std::mem::take(&mut self.root) {
            RootReference::Pending => candidates.get(ident),
            RootReference::Cached(candidate) => candidate,
        }
    }

    pub(super) fn target(
        &mut self,
        expression: &Expr,
        candidates: &Candidates<'_>,
        bindings: &TsBindings,
    ) -> Option<TsValueTarget> {
        if self.unknown == 0 && self.targets.is_empty() {
            let mut root = expression;
            let mut length = 0;
            loop {
                root = match root {
                    Expr::Member(member) => &member.obj,
                    Expr::Paren(paren) => &paren.expr,
                    _ => break,
                };
                length += 1;
            }
            let target = if let Expr::Ident(ident) = root {
                let candidate = candidates.get(ident);
                self.root = RootReference::Cached(candidate);
                candidate.and_then(|candidate| candidate.target)
            } else {
                None
            };
            if let Some(target) = target {
                self.resolve(expression, target, bindings);
            } else {
                // No prefix can acquire a target after an unrelated root.
                // Count these prefixes without allocating or recursively
                // resolving them; the ordinary walk still visits their keys.
                self.unknown = length;
            }
        }
        if self.unknown != 0 {
            self.unknown -= 1;
            None
        } else {
            self.targets.pop().flatten()
        }
    }

    fn resolve(
        &mut self,
        expression: &Expr,
        root: TsValueTarget,
        bindings: &TsBindings,
    ) -> Option<TsValueTarget> {
        maybe_grow_default(|| {
            let target = match expression {
                Expr::Member(member) => {
                    self.resolve(&member.obj, root, bindings)
                        .and_then(|object| {
                            bindings.member_target(object, &member.prop, TsMemberResolution::Inline)
                        })
                }
                Expr::Paren(paren) => self.resolve(&paren.expr, root, bindings),
                _ => return Some(root),
            };
            self.targets.push(target);
            target
        })
    }

    pub(super) fn clear(&mut self) {
        self.targets.clear();
        self.unknown = 0;
        self.root = RootReference::Pending;
    }
}
