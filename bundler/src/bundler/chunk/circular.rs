use crate::{Bundler, Load, ModuleId, Resolve};
use swc_common::DUMMY_SP;
use swc_ecma_ast::Module;

/// Circular imports are hard to handle.
///
/// We use some dedicated method to handle circular dependencies.
impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_circular_modules(&self, modules: &[ModuleId]) -> Module {
        assert_ne!(modules.len(), 0);
        assert_ne!(modules.len(), 1);

        let mut entry = (*self.scope.get_module(modules[0]).unwrap().module).clone();

        for &dep in &modules[1..] {
            let new_module = self.merge_two_circular_modules(modules, entry, dep);

            entry = new_module;
        }

        entry
    }

    /// Merges `a` and `b` into one module.
    fn merge_two_circular_modules(
        &self,
        circular_modules: &[ModuleId],
        mut entry: Module,
        dep: ModuleId,
    ) -> Module {
        self.run(|| {
            let b = self.scope.get_module(dep).unwrap();

            // Remove cicular dependency between modules.
            for &id in circular_modules {}

            // Merge code
            entry.body.extend(b.module.body.iter().cloned());

            entry
        })
    }
}
