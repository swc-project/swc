use super::plan::CircularPlan;
use crate::modules::Modules;
use crate::{bundler::chunk::merge::Ctx, id::Id, Bundler, Load, ModuleId, Resolve};
use anyhow::{Context, Error};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;

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
    ) -> Result<Modules, Error> {
        assert!(
            plan.chunks.len() >= 1,
            "# of circular modules should be 2 or greater than 2 including entry. Got {:?}",
            plan
        );

        if !ctx.merged.insert(entry_id) {
            log::debug!("[circular] skip: {:?}", entry_id);
            return Ok(Modules::empty(self.injected_ctxt));
        }
        // TODO: Handle wrapped esms

        log::debug!("[circular] Starting with: {:?}", entry_id);

        let entry_module = self.scope.get_module(entry_id).unwrap();

        let mut entry = self
            .merge_modules(ctx, entry_id, false, false)
            .context("failed to merge dependency of a cyclic module")?;

        let mut exports = vec![];
        for (_, item) in entry.iter_mut() {
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
                    ModuleDecl::ExportDefaultDecl(_) => {}
                    ModuleDecl::ExportDefaultExpr(_) => {}
                    ModuleDecl::ExportAll(_) => {}
                    _ => {}
                },
                ModuleItem::Stmt(_) => {}
            }
        }

        // print_hygiene("[circular] entry:init", &self.cm, &entry);

        // self.handle_import_deps(ctx, &entry_module, &mut entry, true);

        // print_hygiene("[circular] entry:reexport", &self.cm, &entry);

        // self.handle_import_deps(&entry_module, &mut entry, true);

        // entry.visit_mut_with(&mut ImportDropper {
        //     imports: &entry_module.imports,
        // });
        // print_hygiene("entry:drop_imports", &self.cm, &entry);

        let new_module = self.merge_circular_modules(ctx, entry, entry_id, plan.chunks.clone())?;

        entry = new_module;

        if !exports.is_empty() {
            entry.append(
                entry_id,
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    span: DUMMY_SP.with_ctxt(self.synthesized_ctxt),
                    specifiers: exports,
                    src: None,
                    type_only: false,
                    asserts: None,
                })),
            );
        }

        // print_hygiene("[circular] done", &self.cm, &entry);

        Ok(entry)
    }

    /// Merges `a` and `b` into one module.
    pub(super) fn merge_circular_modules(
        &self,
        ctx: &Ctx,
        mut entry: Modules,
        entry_id: ModuleId,
        mut deps: Vec<ModuleId>,
    ) -> Result<Modules, Error> {
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
        // deps.sort();

        self.run(|| {
            for dep_id in deps {
                let dep_info = self.scope.get_module(dep_id).unwrap();
                let mut dep = if self.scope.should_be_wrapped_with_a_fn(dep_id) {
                    let mut dep: Modules = self.get_module_for_merging(ctx, dep_id, false)?;
                    self.prepare(&dep_info, &mut dep);
                    dep = self.wrap_esm(ctx, dep_id, dep.into())?.into();
                    dep
                } else {
                    self.merge_modules(ctx, dep_id, false, false)
                        .context("failed to merge dependency of a cyclic module")?
                };

                // print_hygiene("[circular] dep:init 1", &self.cm, &dep.clone().into());

                self.handle_import_deps(ctx, &dep_info, &mut dep, true);

                // print_hygiene("[circular] dep:init 2", &self.cm, &dep);

                entry.push_all(dep);
            }

            // print_hygiene("before circular sort", &self.cm, &entry.clone().into());

            // entry.sort();

            Ok(entry)
        })
    }
}
