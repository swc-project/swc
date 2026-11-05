//! Each enum body has an identity independent of its merged binding and span.
//! Consumers walk the same per-binding declaration order after type erasure.

use std::num::NonZeroUsize;

use rustc_hash::FxHashMap;
use swc_ecma_ast::TsEnumDecl;
use swc_ecma_utils::ts_bindings::{TsBindings, TsDeclarationId};

use super::EnumDeclaration;

#[derive(Debug, Clone, Copy)]
struct EnumBodyId(NonZeroUsize);

impl EnumBodyId {
    fn from_index(index: usize) -> Self {
        let index = NonZeroUsize::new(index.wrapping_add(1))
            .expect("enum body arena indices must be smaller than usize::MAX");
        Self(index)
    }

    fn index(self) -> usize {
        self.0.get() - 1
    }
}

#[derive(Debug)]
struct EnumBody {
    facts: EnumDeclaration,
    next: Option<EnumBodyId>,
}

#[derive(Debug)]
struct EnumBodyGroup {
    first: EnumBodyId,
    last: EnumBodyId,
}

#[derive(Debug, Default)]
pub(super) struct EnumBodies {
    bodies: Vec<EnumBody>,
    groups: Vec<EnumBodyGroup>,
    groups_by_binding: FxHashMap<TsDeclarationId, usize>,
}

impl EnumBodies {
    pub(super) fn insert(&mut self, binding: TsDeclarationId, facts: EnumDeclaration) {
        use std::collections::hash_map::Entry;

        let body = EnumBodyId::from_index(self.bodies.len());
        self.bodies.push(EnumBody { facts, next: None });
        match self.groups_by_binding.entry(binding) {
            Entry::Occupied(entry) => {
                let group = &mut self.groups[*entry.get()];
                self.bodies[group.last.index()].next = Some(body);
                group.last = body;
            }
            Entry::Vacant(entry) => {
                entry.insert(self.groups.len());
                self.groups.push(EnumBodyGroup {
                    first: body,
                    last: body,
                });
            }
        }
    }

    pub(super) fn cursor(&self) -> EnumBodyCursor<'_> {
        EnumBodyCursor {
            bodies: self,
            next: self.groups.iter().map(|group| Some(group.first)).collect(),
        }
    }
}

/// A separate cursor for each phase; facts stay in stable, borrowed storage.
/// Grouping by binding keeps skipped declarations from shifting other bodies.
pub(crate) struct EnumBodyCursor<'a> {
    bodies: &'a EnumBodies,
    next: Vec<Option<EnumBodyId>>,
}

impl<'a> EnumBodyCursor<'a> {
    pub(crate) fn declaration(
        &mut self,
        bindings: &TsBindings,
        node: &TsEnumDecl,
    ) -> Option<&'a EnumDeclaration> {
        let binding = bindings.ident_declaration(&node.id)?;
        let group = *self.bodies.groups_by_binding.get(&binding)?;
        let body = self.next[group]?;
        let body = &self.bodies.bodies[body.index()];
        self.next[group] = body.next;
        Some(&body.facts)
    }
}
