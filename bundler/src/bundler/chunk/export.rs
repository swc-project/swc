use super::merge::{LocalMarker, Unexporter};
use crate::{
    bundler::load::TransformedModule, debug::print_hygiene, Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
use std::mem::take;
use swc_common::SyntaxContext;
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

            dep = self.drop_unused(dep, Some(&specifiers));

            print_hygiene("dep:tree-shaking", &self.cm, &dep);

            //     entry = entry.fold_with(&mut LocalMarker {
            //         mark: imported.mark(),
            //         specifiers: &specifiers,
            //         excluded: vec![],
            //     });

            // // Note: this does not handle `export default
            // foo`
            dep = dep.fold_with(&mut LocalMarker {
                mark: imported.mark(),
                specifiers: &imported.exports.items,
                excluded: vec![],
            });
            // }

            entry.visit_mut_with(&mut ExportRenamer {
                from: SyntaxContext::empty().apply_mark(self.top_level_mark),
                to: SyntaxContext::empty().apply_mark(imported.mark()),
            });

            print_hygiene("dep:before-injection", &self.cm, &dep);

            print_hygiene("entry:before-injection", &self.cm, &entry);

            // Replace import statement / require with module body
            let mut injector = ExportInjector {
                imported: dep.body.clone(),
                src: src.src.clone(),
            };
            entry.body.visit_mut_with(&mut injector);

            print_hygiene("entry:injection", &self.cm, &entry);
            assert_eq!(injector.imported, vec![]);
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
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export))
                    if export.src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                    buf.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    src: Some(ref src),
                    ..
                })) if src.value == self.src.value => {
                    buf.extend(take(&mut self.imported));
                    buf.push(item);
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}

struct ExportRenamer {
    /// Syntax context for the top level.
    from: SyntaxContext,
    /// Syntax context for the top level nodes of dependency module.
    to: SyntaxContext,
}

impl VisitMut for ExportRenamer {
    fn visit_mut_named_export(&mut self, export: &mut NamedExport) {
        if export.src.is_none() {
            return;
        }

        export.specifiers.visit_mut_children_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier) {
        if s.orig.span.ctxt == self.from {
            //
            s.orig.span = s.orig.span.with_ctxt(self.to);
        }
    }
}
