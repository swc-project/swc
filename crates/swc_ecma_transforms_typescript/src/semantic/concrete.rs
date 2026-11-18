//! Concrete namespace bodies are memoized during semantic analysis, before
//! declaration erasure. Expression substitution does not move namespace boxes
//! or change their concrete status. Keys identify individual declarations, even
//! when merged declarations share resolved names or synthesized spans.

use rustc_hash::FxHashMap;
use swc_ecma_ast::{Decl, TsModuleDecl};
use swc_ecma_utils::stack_size::maybe_grow_default;

use crate::retain::{namespace_body_is_concrete, should_retain_decl};

#[derive(Default)]
pub(super) struct NamespaceConcreteness {
    // Addresses are identity keys only and are never dereferenced. This cache
    // must be discarded before namespace declarations are moved or erased.
    values: FxHashMap<*const TsModuleDecl, bool>,
}

impl NamespaceConcreteness {
    pub(super) fn is_concrete(&mut self, node: &TsModuleDecl) -> bool {
        let key = node as *const TsModuleDecl;
        if let Some(&concrete) = self.values.get(&key) {
            return concrete;
        }
        let mut recursive = false;
        let concrete = node.body.as_ref().is_some_and(|body| {
            maybe_grow_default(|| {
                namespace_body_is_concrete(body, &mut |child| {
                    recursive = true;
                    self.is_concrete(child)
                })
            })
        });
        // Leaf bodies have no repeated subtree work. Avoid allocating cache
        // entries for the common case of flat namespace declarations.
        if recursive {
            self.values.insert(key, concrete);
        }
        concrete
    }

    pub(super) fn should_retain_decl(&mut self, node: &Decl) -> bool {
        match node {
            Decl::TsModule(namespace) => {
                !namespace.declare && !namespace.global && self.is_concrete(namespace)
            }
            _ => should_retain_decl(node),
        }
    }
}
