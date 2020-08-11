use super::merge::{GlobalMarker, LocalMarker};
use crate::{
    bundler::load::TransformedModule, debug::print_hygiene, Bundler, Load, ModuleId, Resolve,
};
use std::iter::once;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{Module, ModuleDecl, ModuleItem};
use swc_ecma_visit::FoldWith;

/// Circular imports are hard to handle.
///
/// We use some dedicated method to handle circular dependencies.
impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_circular_modules(
        &self,
        entry: ModuleId,
        circular_modules: &[ModuleId],
    ) -> Module {
        assert!(
            circular_modules.len() >= 1,
            "# of circular modules should be 2 or greater than 2 including entry. Got {:?}",
            circular_modules
        );
        dbg!(&circular_modules);

        let entry_module = self.scope.get_module(entry).unwrap();

        let modules = circular_modules
            .iter()
            .chain(once(&entry))
            .map(|&id| self.scope.get_module(id).unwrap())
            .collect::<Vec<_>>();

        let mut entry = self.process_circular_module(&modules, entry_module);

        for &dep in circular_modules {
            let new_module = self.merge_two_circular_modules(&modules, entry, dep);

            entry = new_module;
        }

        entry
    }

    /// Merges `a` and `b` into one module.
    fn merge_two_circular_modules(
        &self,
        circular_modules: &[TransformedModule],
        mut entry: Module,
        dep: ModuleId,
    ) -> Module {
        self.run(|| {
            print_hygiene("START: merge_two_circular_modules", &self.cm, &entry);

            let dep_info = self.scope.get_module(dep).unwrap();
            let dep_mark = dep_info.mark();
            let mut dep = self.process_circular_module(circular_modules, dep_info);

            // TODO: Reorder items
            // Merge code
            entry.body.extend(dep.body);

            print_hygiene("END :merge_two_circular_modules", &self.cm, &entry);
            entry
        })
    }

    ///
    ///  - Remove cicular imnports
    fn process_circular_module(
        &self,
        circular_modules: &[TransformedModule],
        entry: TransformedModule,
    ) -> Module {
        let mut module = (*entry.module).clone();
        print_hygiene("START: process_circular_module", &self.cm, &module);

        module.body.retain(|item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    // Drop if it's one of circular import
                    for circular_module in circular_modules {
                        let incomplete = self.scope.incomplete.write().remove(&entry.id);

                        if entry
                            .imports
                            .specifiers
                            .iter()
                            .chain(incomplete.iter().flat_map(|v| v))
                            .any(|v| v.0.module_id == circular_module.id && v.0.src == import.src)
                        {
                            log::debug!("Dropping circular import");
                            return false;
                        }
                    }
                }
                _ => {}
            }

            true
        });

        for circular_module in circular_modules {
            for (src, specifiers) in &entry.imports.specifiers {
                if circular_module.id == src.module_id {
                    module = module.fold_with(&mut LocalMarker {
                        mark: circular_module.mark(),
                        specifiers: &specifiers,
                        excluded: vec![],
                    });
                }
            }
        }

        // print_hygiene("END: process_circular_module", &self.cm, &module);

        module
    }
}
