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

            dep.visit_mut_with(&mut ExportRenamer {
                from: SyntaxContext::empty().apply_mark(self.top_level_mark),
                to: SyntaxContext::empty().apply_mark(imported.mark()),
            });

            print_hygiene(&format!("dep:export-renamer"), &self.cm, &dep);

            entry.visit_mut_with(&mut ExportMarkApplier);

            print_hygiene("entry:ExportMarkApplier", &self.cm, &entry);

            dep = dep.fold_with(&mut Unexporter);

            print_hygiene("dep:before-injection", &self.cm, &dep);

            // Replace import statement / require with module body
            let mut injector = ExportInjector {
                imported: dep.body.clone(),
                src: src.src.clone(),
            };
            entry.body.visit_mut_with(&mut injector);

            print_hygiene(
                &format!(
                    "entry:injection {:?} <- {:?}",
                    SyntaxContext::empty().apply_mark(info.mark()),
                    SyntaxContext::empty().apply_mark(imported.mark()),
                ),
                &self.cm,
                &entry,
            );
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
                ModuleItem::Stmt(Stmt::Empty(..)) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export))
                    if export.src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                    buf.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    export @ NamedExport { src: Some(..), .. },
                )) if export.src.as_ref().unwrap().value == self.src.value => {
                    buf.extend(take(&mut self.imported));
                    buf.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            src: None,
                            ..export
                        },
                    )));
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

/// This visitor mondifies hygiene info of identifiers, based on to mark
/// configured while analyzing reexports.
struct ExportMarkApplier;

impl VisitMut for ExportMarkApplier {
    fn visit_mut_named_export(&mut self, node: &mut NamedExport) {
        // Useless
        if node.span.ctxt == SyntaxContext::empty() || node.src.is_none() {
            return;
        }
        let ctxt = node.span.ctxt;

        // Remove mark
        node.span = node.span.with_ctxt(SyntaxContext::empty());

        for specifier in &mut node.specifiers {
            match specifier {
                ExportSpecifier::Namespace(_) => {}
                ExportSpecifier::Default(_) => {}
                ExportSpecifier::Named(n) => {
                    //
                    n.orig.span = n.orig.span.with_ctxt(ctxt);
                }
            }
        }
    }
}
