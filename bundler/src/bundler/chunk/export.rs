use crate::{bundler::load::TransformedModule, Bundler, Load, ModuleId, Resolve};
use anyhow::{Context, Error};
use swc_ecma_ast::Module;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_reexports(
        &mut self,
        entry: &mut Module,
        info: &TransformedModule,
        targets: &mut Vec<ModuleId>,
    ) -> Result<(), Error> {
        for (src, specifiers) in &info.exports.reexports {
            let imported = self.scope.get_module(src.module_id).unwrap();
            assert!(imported.is_es6, "Reexports are es6 only");

            info.helpers.extend(&imported.helpers);

            if let Some(pos) = targets.iter().position(|x| *x == src.module_id) {
                log::debug!("Reexport: targets.remove({})", imported.fm.name);
                targets.remove(pos);
            }

            let mut dep = self
                .merge_modules(src.module_id, false, targets)
                .with_context(|| {
                    format!(
                        "failed to merge for reexport: ({}):{} <= ({}):{}",
                        info.id, info.fm.name, src.module_id, src.src.value
                    )
                })?;

            // Tree-shaking
            dep = self.drop_unused(dep, Some(&specifiers));

            if let Some(imports) = info
                .exports
                .reexports
                .specifiers
                .iter()
                .find(|(s, _)| s.module_id == imported.id)
                .map(|v| &v.1)
            {
                dep = dep.fold_with(&mut ExportRenamer {
                    mark: imported.mark(),
                    _exports: &imported.exports,
                    imports: &imports,
                    extras: vec![],
                });
            }

            dep = dep.fold_with(&mut Unexporter);

            if !specifiers.is_empty() {
                entry = entry.fold_with(&mut LocalMarker {
                    mark: imported.mark(),
                    specifiers: &specifiers,
                    excluded: vec![],
                });

                // // Note: this does not handle `export default
                // foo`
                // dep = dep.fold_with(&mut LocalMarker {
                //     mark: imported.mark(),
                //     specifiers: &imported.exports.items,
                // });
            }

            dep = dep.fold_with(&mut GlobalMarker {
                used_mark: self.used_mark,
                module_mark: imported.mark(),
            });

            // Replace import statement / require with module body
            let mut injector = Es6ModuleInjector {
                imported: dep.body.clone(),
                src: src.src.clone(),
            };
            entry.body.visit_mut_with(&mut injector);

            // print_hygiene("entry:after:injection", &self.cm, &entry);
            if injector.imported.is_empty() {
                continue;
            }
        }

        Ok(())
    }
}
