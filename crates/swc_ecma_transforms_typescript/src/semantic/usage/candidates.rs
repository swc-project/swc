//! Runtime targets and import retention share one resolved-identity query.
//! Candidate names borrow the declaration graph, which outlives substitutions;
//! only surviving use records acquire IDs that outlive syntax erasure.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ts_bindings::{TsBindings, TsValueTarget};

#[derive(Default, Clone, Copy)]
pub(super) struct ReferenceFacts {
    pub reference: bool,
    pub target: Option<TsValueTarget>,
}

pub(super) struct Candidates<'a> {
    values: FxHashMap<(&'a Atom, SyntaxContext), ReferenceFacts>,
}

impl<'a> Candidates<'a> {
    pub(super) fn new(program: &Program, bindings: &'a TsBindings) -> Self {
        let mut values = FxHashMap::<_, ReferenceFacts>::default();
        if let Program::Module(module) = program {
            for item in &module.body {
                if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                    for specifier in &import.specifiers {
                        let local = specifier.local();
                        let declaration = bindings
                            .ident_declaration(local)
                            .expect("runtime binding collection must register every import");
                        let id = bindings.declaration(declaration);
                        values.entry((&id.0, id.1)).or_default().reference = true;
                    }
                }
            }
        }
        for alias in bindings.aliases() {
            let declaration = bindings.alias(alias).declaration;
            let id = bindings.declaration(declaration);
            values.entry((&id.0, id.1)).or_default().reference = true;
        }
        for (name, ctxt, target) in bindings.runtime_values() {
            values.entry((name, ctxt)).or_default().target = Some(target);
        }
        Self { values }
    }

    pub(super) fn get(&self, ident: &Ident) -> Option<ReferenceFacts> {
        self.values.get(&(&ident.sym, ident.ctxt)).copied()
    }
}
