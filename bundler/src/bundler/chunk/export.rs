use super::merge::Unexporter;
use crate::{bundler::load::TransformedModule, Bundler, Load, ModuleId, Resolve};
use anyhow::{Context, Error};
use std::mem::take;
use swc_ecma_ast::*;
use swc_ecma_visit::{FoldWith, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_reexports(
        &self,
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

            // if let Some(imports) = info
            //     .exports
            //     .reexports
            //     .specifiers
            //     .iter()
            //     .find(|(s, _)| s.module_id == imported.id)
            //     .map(|v| &v.1)
            // {
            //     dep = dep.fold_with(&mut ExportRenamer {
            //         mark: imported.mark(),
            //         _exports: &imported.exports,
            //         imports: &imports,
            //         extras: vec![],
            //     });
            // }

            dep = dep.fold_with(&mut Unexporter);

            //     entry = entry.fold_with(&mut LocalMarker {
            //         mark: imported.mark(),
            //         specifiers: &specifiers,
            //         excluded: vec![],
            //     });

            //     // // Note: this does not handle `export default
            //     // foo`
            //     // dep = dep.fold_with(&mut LocalMarker {
            //     //     mark: imported.mark(),
            //     //     specifiers: &imported.exports.items,
            //     // });
            // }

            // dep = dep.fold_with(&mut GlobalMarker {
            //     used_mark: self.used_mark,
            //     module_mark: imported.mark(),
            // });

            // Replace import statement / require with module body
            let mut injector = ExportInjector {
                imported: dep.body.clone(),
                src: src.src.clone(),
            };
            entry.body.visit_mut_with(&mut injector);

            // print_hygiene("entry:after:injection", &self.cm, &entry);
            if injector.imported.is_empty() {}
        }

        Ok(())
    }
}

struct ExportInjector {
    imported: Vec<ModuleItem>,
    src: Str,
}

impl VisitMut for ExportInjector {
    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export))
                    if export.src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    src: Some(ref src),
                    ..
                })) if src.value == self.src.value => {
                    buf.extend(take(&mut self.imported));
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}
