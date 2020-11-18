use super::plan::CircularPlan;
use crate::{
    bundler::{
        chunk::{merge::Ctx, sort::sort},
        load::TransformedModule,
    },
    debug::print_hygiene,
    id::Id,
    Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;

#[cfg(test)]
mod tests;

/// Circular imports are hard to handle.
///
/// We use some dedicated method to handle circular dependencies.
impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn merge_circular(
        &self,
        ctx: &Ctx,
        plan: &CircularPlan,
        entry_id: ModuleId,
    ) -> Result<Module, Error> {
        assert!(
            plan.chunks.len() >= 1,
            "# of circular modules should be 2 or greater than 2 including entry. Got {:?}",
            plan
        );
        let entry_module = self.scope.get_module(entry_id).unwrap();

        let direct_deps = entry_module
            .imports
            .specifiers
            .iter()
            .map(|v| v.0.module_id)
            .chain(entry_module.exports.reexports.iter().map(|v| v.0.module_id))
            .collect::<Vec<_>>();

        let modules = plan
            .chunks
            .iter()
            .map(|&id| self.scope.get_module(id).unwrap())
            .collect::<Vec<_>>();
        let mut entry = self
            .merge_modules(ctx, entry_id, false, false)
            .context("failed to merge dependency of a cyclic module")?;

        if !ctx.merged.insert(entry_id) {
            log::debug!("[circular] skip: {:?}", entry_id);
            return Ok(Module {
                span: DUMMY_SP,
                body: Default::default(),
                shebang: Default::default(),
            });
        }

        let mut exports = vec![];
        for item in entry.body.iter_mut() {
            match item {
                ModuleItem::ModuleDecl(decl) => match decl {
                    ModuleDecl::ExportDecl(export) => match &export.decl {
                        Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                            let mut exported = ident.clone();
                            exported.span.ctxt = entry_module.export_ctxt();

                            exports.push(ExportSpecifier::Named(ExportNamedSpecifier {
                                span: export.span,
                                orig: exported,
                                exported: None,
                            }));
                        }
                        Decl::Var(var) => {
                            let ids: Vec<Id> = find_ids(var);

                            for ident in ids {
                                let mut exported = ident.into_ident();
                                exported.span.ctxt = entry_module.export_ctxt();

                                exports.push(ExportSpecifier::Named(ExportNamedSpecifier {
                                    span: export.span,
                                    orig: exported,
                                    exported: None,
                                }));
                            }
                        }
                        _ => {}
                    },
                    ModuleDecl::ExportNamed(export) => {
                        for specifier in &mut export.specifiers {
                            match specifier {
                                ExportSpecifier::Namespace(_) => {}
                                ExportSpecifier::Default(_) => {}
                                ExportSpecifier::Named(named) => {
                                    let mut orig = named.orig.clone();
                                    orig.span.ctxt = entry_module.export_ctxt();

                                    exports.push(ExportSpecifier::Named(ExportNamedSpecifier {
                                        span: export.span,
                                        orig,
                                        exported: named.exported.clone(),
                                    }));
                                }
                            }
                        }
                    }
                    ModuleDecl::ExportDefaultDecl(_) => {}
                    ModuleDecl::ExportDefaultExpr(_) => {}
                    ModuleDecl::ExportAll(_) => {}
                    _ => {}
                },
                ModuleItem::Stmt(_) => {}
            }
        }

        print_hygiene("[circular] entry:init", &self.cm, &entry);

        self.handle_import_deps(&entry_module, &mut entry, true);

        print_hygiene("[circular] entry:reexport", &self.cm, &entry);

        // self.handle_import_deps(&entry_module, &mut entry, true);

        // entry.visit_mut_with(&mut ImportDropper {
        //     imports: &entry_module.imports,
        // });
        // print_hygiene("entry:drop_imports", &self.cm, &entry);
        let mut deps = plan.chunks.clone();
        deps.retain(|&dep| {
            if dep == entry_id {
                return false;
            }

            if !ctx.merged.insert(dep) {
                log::debug!("[circular] skip: {:?}", dep);
                return false;
            }

            log::debug!("Circular merge: {:?}", dep);

            true
        });
        deps.sort();

        let new_module = self.merge_circular_modules(ctx, &modules, entry, deps)?;

        entry = new_module;

        if !exports.is_empty() {
            entry
                .body
                .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    NamedExport {
                        span: DUMMY_SP,
                        specifiers: exports,
                        src: None,
                        type_only: false,
                    },
                )));
        }

        print_hygiene("[circular] done", &self.cm, &entry);

        Ok(entry)
    }

    /// Merges `a` and `b` into one module.
    fn merge_circular_modules(
        &self,
        ctx: &Ctx,
        _circular_modules: &[TransformedModule],
        mut entry: Module,
        deps: Vec<ModuleId>,
    ) -> Result<Module, Error> {
        self.run(|| {
            let mut dep_body = vec![];

            for dep in deps {
                let dep_info = self.scope.get_module(dep).unwrap();
                let mut dep = self
                    .merge_modules(ctx, dep, false, false)
                    .context("failed to merge dependency of a cyclic module")?;

                // print_hygiene("[circular] dep:init 1", &self.cm, &dep);

                self.handle_import_deps(&dep_info, &mut dep, true);

                // print_hygiene("[circular] dep:init 2", &self.cm, &dep);

                dep_body.extend(dep.body);
            }

            // dep = dep.fold_with(&mut Unexporter);

            // Merge code
            entry.body = merge_respecting_order(dep_body, entry.body);

            Ok(entry)
        })
    }
}

fn merge_respecting_order(dep: Vec<ModuleItem>, entry: Vec<ModuleItem>) -> Vec<ModuleItem> {
    let mut new = Vec::with_capacity(dep.len() + entry.len());

    new.extend(entry);
    new.extend(dep);

    sort(&mut new);

    new
}
