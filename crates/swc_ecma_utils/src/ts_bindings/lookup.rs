//! Namespace candidates share the lexical boundary policy. Alias completion
//! checks their meanings with its in-progress dependency resolution states.

use super::{scopes::ScopeOwner, *};

pub(super) struct NamespaceCandidates<'a, I> {
    bindings: &'a TsBindings,
    name: &'a Wtf8Atom,
    lexical_owner: Option<ScopeOwner>,
    bodies: Option<I>,
    pending: Option<TsDeclarationId>,
    space: TsReferenceSpace,
}

impl<'a, I: Iterator<Item = TsNamespaceBodyId>> NamespaceCandidates<'a, I> {
    pub(super) fn new(
        bindings: &'a TsBindings,
        name: &'a Atom,
        ctxt: SyntaxContext,
        bodies: I,
        space: TsReferenceSpace,
    ) -> Self {
        let lexical_owner = bindings.erased_scopes.get(ctxt).or_else(|| {
            bindings
                .lookup_declaration(name, ctxt)
                .and_then(|declaration| {
                    bindings.declarations[declaration.index()]
                        .owner
                        .map(ScopeOwner::Body)
                })
        });
        Self {
            bindings,
            name: name.borrow(),
            lexical_owner,
            bodies: Some(bodies),
            pending: None,
            space,
        }
    }
}

impl<I: Iterator<Item = TsNamespaceBodyId>> Iterator for NamespaceCandidates<'_, I> {
    type Item = TsDeclarationId;

    fn next(&mut self) -> Option<Self::Item> {
        loop {
            if let Some(declaration) = self.pending.take() {
                return Some(declaration);
            }
            let body = self.bodies.as_mut()?.next()?;
            let container = self.bindings.bodies[body.index()].container;
            if self
                .lexical_owner
                .is_some_and(|owner| owner.matches(body, container))
            {
                self.bodies = None;
                return None;
            }
            let Some(member) = self.bindings.named_member(container, self.name) else {
                continue;
            };
            let member = self.bindings.member(member);
            if self.space == TsReferenceSpace::Value {
                if member.value.is_some() {
                    return member.value;
                }
            } else {
                self.pending = member.value;
                if member.erased.is_some() {
                    return member.erased;
                }
            }
        }
    }
}

pub(super) struct NamespaceAncestors<'a> {
    pub(super) bindings: &'a TsBindings,
    pub(super) next: Option<TsNamespaceBodyId>,
}

impl Iterator for NamespaceAncestors<'_> {
    type Item = TsNamespaceBodyId;

    fn next(&mut self) -> Option<Self::Item> {
        let body = self.next?;
        self.next = self.bindings.bodies[body.index()].parent;
        Some(body)
    }
}
