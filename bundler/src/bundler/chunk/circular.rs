use super::merge::LocalMarker;
use crate::{
    bundler::load::TransformedModule, debug::print_hygiene, Bundler, Load, ModuleId, Resolve,
};
use std::iter::once;
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
            let b = self.scope.get_module(dep).unwrap();
            let dep = self.process_circular_module(circular_modules, b);

            print_hygiene("before:merge-circular", &self.cm, &entry);

            // TODO: Reorder items
            // Merge code
            entry.body.extend(dep.body);

            print_hygiene("after:merge-circular", &self.cm, &entry);
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

        module.body.retain(|item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    // Drop if it's one of circular import
                    for circular_module in circular_modules {
                        if entry
                            .imports
                            .specifiers
                            .iter()
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

        module
    }
}
