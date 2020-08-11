use crate::{
    bundler::load::TransformedModule, debug::print_hygiene, Bundler, Load, ModuleId, Resolve,
};
use swc_common::util::move_map::MoveMap;
use swc_ecma_ast::{Module, ModuleDecl, ModuleItem};
use swc_ecma_visit::Fold;

/// Circular imports are hard to handle.
///
/// We use some dedicated method to handle circular dependencies.
impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_circular_modules(&self, circular_modules: &[ModuleId]) -> Module {
        assert_ne!(circular_modules.len(), 0);
        assert_ne!(circular_modules.len(), 1);
        dbg!(&circular_modules);

        let mut entry_module = self.scope.get_module(circular_modules[0]).unwrap();

        let modules = circular_modules
            .iter()
            .map(|&id| self.scope.get_module(id).unwrap())
            .collect::<Vec<_>>();

        let mut entry = self.drop_circular_imports(&modules, entry_module);

        // TODO: Remove circular imports from entry

        for &dep in &circular_modules[1..] {
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
            let dep = self.drop_circular_imports(circular_modules, b);

            print_hygiene("before:merge-circular", &self.cm, &entry);

            // Merge code
            entry.body.extend(dep.body);

            print_hygiene("after:merge-circular", &self.cm, &entry);
            entry
        })
    }

    /// Remove cicular imnports
    fn drop_circular_imports(
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

        module
    }
}
