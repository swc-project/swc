use super::plan::Plan;
use crate::{
    bundler::load::{Imports, Specifier},
    debug::print_hygiene,
    id::ModuleId,
    load::Load,
    resolve::Resolve,
    util::{self, IntoParallelIterator},
    Bundler,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use retain_mut::RetainMut;
use std::{borrow::Cow, mem::take};
use swc_atoms::js_word;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};
use util::CHashSet;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Merge `targets` into `entry`.
    pub(super) fn merge_modules(
        &self,
        plan: &Plan,
        entry: ModuleId,
        is_entry: bool,
        force_not_cyclic: bool,
        merged: &CHashSet<ModuleId>,
    ) -> Result<Module, Error> {
        self.run(|| {
            merged.insert(entry);

            let info = self.scope.get_module(entry).unwrap();

            if !force_not_cyclic {
                // Handle circular imports
                if let Some(circular_plan) = plan.entry_as_circular(info.id) {
                    log::debug!("Circular dependency detected: ({})", info.fm.name);
                    let mut module =
                        self.merge_circular_modules(plan, circular_plan, entry, merged)?;
                    if is_entry {
                        self.finalize_merging_of_entry(plan, &mut module);
                    }
                    return Ok(module);
                }
            }

            let normal_plan;
            let module_plan = match plan.normal.get(&entry) {
                Some(v) => v,
                None => {
                    normal_plan = Default::default();
                    &normal_plan
                }
            };

            let mut entry: Module = (*info.module).clone();

            // print_hygiene(&format!("{}", info.fm.name), &self.cm, &entry);

            if module_plan.chunks.is_empty() && module_plan.transitive_chunks.is_empty() {
                return Ok(entry);
            }

            log::debug!(
                "Merge: ({}) {} <= {:?}",
                info.id,
                info.fm.name,
                plan.normal.get(&info.id)
            );

            self.merge_reexports(plan, module_plan, &mut entry, &info, merged)
                .context("failed to merge reepxorts")?;

            // print_hygiene("after: merge_reexports", &self.cm, &entry);

            let to_merge: Vec<_> = info
                .imports
                .specifiers
                .iter()
                .filter(|(src, _)| {
                    log::trace!("Checking: {} <= {}", info.fm.name, src.src.value);

                    // Import and export from same file. We use export to merge it.
                    if info
                        .exports
                        .reexports
                        .iter()
                        .any(|(es, _)| es.module_id == src.module_id)
                    {
                        return false;
                    }

                    // Skip if a dependency is going to be merged by other dependency
                    module_plan.chunks.contains(&src.module_id)
                })
                .collect();

            let (deps, transitive_deps) = util::join(
                || {
                    to_merge
                        .into_par_iter()
                        .map(|(src, specifiers)| -> Result<Option<_>, Error> {
                            self.run(|| {
                                if !merged.insert(src.module_id) {
                                    log::debug!("Skipping: {} <= {}", info.fm.name, src.src.value);
                                    return Ok(None);
                                }

                                log::debug!("Merging: {} <= {}", info.fm.name, src.src.value);

                                let dep_info = self.scope.get_module(src.module_id).unwrap();
                                info.helpers.extend(&dep_info.helpers);
                                // In the case of
                                //
                                //  a <- b
                                //  b <- c
                                //
                                // we change it to
                                //
                                // a <- b + chunk(c)
                                //
                                let mut dep = self
                                    .merge_modules(plan, src.module_id, false, false, merged)
                                    .with_context(|| {
                                        format!(
                                            "failed to merge: ({}):{} <= ({}):{}",
                                            info.id, info.fm.name, src.module_id, src.src.value
                                        )
                                    })?;

                                if dep_info.is_es6 {
                                    // print_hygiene("dep:before:tree-shaking", &self.cm, &dep);

                                    let is_acccessed_with_computed_key =
                                        specifiers.iter().any(|s| match s {
                                            Specifier::Namespace { all: true, .. } => true,
                                            _ => false,
                                        });

                                    // If an import with a computed key exists, we can't shake tree
                                    if is_acccessed_with_computed_key {
                                        let id = specifiers
                                            .iter()
                                            .find_map(|s| match s {
                                                Specifier::Namespace { local, all: true } => {
                                                    Some(local)
                                                }
                                                _ => None,
                                            })
                                            .unwrap();

                                        dep = self.wrap_esm_as_a_var(
                                            &dep_info,
                                            dep,
                                            id.clone().replace_mark(dep_info.mark()).into_ident(),
                                        )?;
                                    } else {
                                        if let Some(imports) = info
                                            .imports
                                            .specifiers
                                            .iter()
                                            .find(|(s, _)| s.module_id == dep_info.id)
                                            .map(|v| &v.1)
                                        {
                                            dep = self.remark_exports(
                                                dep,
                                                dep_info.ctxt(),
                                                Some(&imports),
                                                true,
                                            );
                                        }

                                        print_hygiene("dep: remarking exports", &self.cm, &dep);
                                    }
                                    // print_hygiene("dep:after:tree-shaking", &self.cm, &dep);

                                    // if let Some(imports) = info
                                    //     .imports
                                    //     .specifiers
                                    //     .iter()
                                    //     .find(|(s, _)| s.module_id == dep_info.id)
                                    //     .map(|v| &v.1)
                                    // {
                                    //     dep = dep.fold_with(&mut ExportRenamer {
                                    //         mark: dep_info.mark(),
                                    //         _exports: &dep_info.exports,
                                    //         imports: &imports,
                                    //         extras: vec![],
                                    //     });
                                    // }
                                    print_hygiene("dep:after:export-renamer", &self.cm, &dep);

                                    dep = dep.fold_with(&mut Unexporter);
                                }
                                // print_hygiene("dep:before-injection", &self.cm, &dep);

                                Ok(Some((dep, dep_info)))
                            })
                        })
                        .collect::<Vec<_>>()
                },
                || {
                    let deps = module_plan
                        .transitive_chunks
                        .clone()
                        .into_par_iter()
                        .map(|id| -> Result<_, Error> {
                            if !merged.insert(id) {
                                return Ok(None);
                            }

                            let dep_info = self.scope.get_module(id).unwrap();
                            let mut dep = self.merge_modules(plan, id, false, true, merged)?;

                            dep = self.remark_exports(dep, dep_info.ctxt(), None, true);
                            dep = dep.fold_with(&mut Unexporter);

                            // As transitive deps can have no direct relation with entry,
                            // remark_exports is not enough.
                            Ok(Some((dep, dep_info)))
                        })
                        .collect::<Vec<_>>();

                    deps
                },
            );

            let mut targets = module_plan.chunks.clone();

            for (dep, is_direct) in deps
                .into_iter()
                .map(|v| (v, true))
                .chain(transitive_deps.into_iter().map(|v| (v, false)))
            {
                let dep = dep?;
                let dep = match dep {
                    Some(v) => v,
                    None => continue,
                };

                let (mut dep, dep_info) = dep;

                if let Some(idx) = targets.iter().position(|v| *v == dep_info.id) {
                    targets.remove(idx);
                    if let Some(v) = plan.normal.get(&dep_info.id) {
                        targets.retain(|&id| !v.chunks.contains(&id));
                    }
                    if let Some(v) = plan.circular.get(&dep_info.id) {
                        targets.retain(|&id| !v.chunks.contains(&id));
                    }
                }

                print_hygiene("dep: before injection", &self.cm, &dep);

                if dep_info.is_es6 {
                    print_hygiene("entry: before injection", &self.cm, &entry);

                    // Replace import statement / require with module body
                    let mut injector = Es6ModuleInjector {
                        imported: take(&mut dep.body),
                        ctxt: dep_info.ctxt(),
                    };
                    entry.body.visit_mut_with(&mut injector);

                    if injector.imported.is_empty() {
                        // print_hygiene("entry:after:injection", &self.cm, &entry);

                        log::debug!("Merged {} as an es module", info.fm.name);
                        print_hygiene(
                            &format!("ES6: {:?} <- {:?}", info.ctxt(), dep_info.ctxt()),
                            &self.cm,
                            &entry,
                        );
                        continue;
                    }

                    if !is_direct {
                        prepend_stmts(&mut entry.body, injector.imported.into_iter());

                        print_hygiene("ES6", &self.cm, &entry);
                        continue;
                    }

                    // print_hygiene("entry: failed to inject", &self.cm, &entry);

                    dep.body = take(&mut injector.imported);
                }

                if self.config.require {
                    self.merge_cjs(
                        plan,
                        is_entry,
                        &mut entry,
                        &info,
                        Cow::Owned(dep),
                        &dep_info,
                        &mut targets,
                    )?;
                }
            }

            // if is_entry && self.config.require && !targets.is_empty() {
            //     log::info!("Injectng remaining: {:?}", targets);

            //     // Handle transitive dependencies
            //     for target in targets.drain(..) {
            //         log::trace!(
            //             "Remaining: {}",
            //             self.scope.get_module(target).unwrap().fm.name
            //         );

            //         let dep_info = self.scope.get_module(target).unwrap();
            //         self.merge_cjs(
            //             plan,
            //             &mut entry,
            //             &info,
            //             Cow::Borrowed(&dep_info.module),
            //             &dep_info,
            //             &mut targets,
            //         )?;
            //     }
            // }

            if is_entry {
                // print_hygiene("done", &self.cm, &entry);
                self.finalize_merging_of_entry(plan, &mut entry);
            }

            Ok(entry)
        })
    }

    fn finalize_merging_of_entry(&self, plan: &Plan, entry: &mut Module) {
        entry.body.retain_mut(|item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..)) => return false,

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                    export.src = None;
                }

                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    for (id, p) in &plan.normal {
                        if import.span.ctxt == self.scope.get_module(*id).unwrap().ctxt() {
                            log::debug!("Dropping import");
                            return false;
                        }

                        for &mid in &p.chunks {
                            if import.span.ctxt == self.scope.get_module(mid).unwrap().ctxt() {
                                log::debug!("Dropping direct import");
                                return false;
                            }
                        }

                        for &mid in &p.transitive_chunks {
                            if import.span.ctxt == self.scope.get_module(mid).unwrap().ctxt() {
                                log::debug!("Dropping transitive import");
                                return false;
                            }
                        }
                    }

                    for (id, p) in &plan.circular {
                        // Drop if it's one of circular import
                        if import.span.ctxt == self.scope.get_module(*id).unwrap().ctxt() {
                            log::debug!("Dropping circular import");
                            return false;
                        }

                        for &mid in &p.chunks {
                            if import.span.ctxt == self.scope.get_module(mid).unwrap().ctxt() {
                                log::debug!("Dropping circular import");
                                return false;
                            }
                        }
                    }
                }

                _ => {}
            }

            true
        });

        entry.visit_mut_with(&mut DefaultRenamer);
    }
}

pub(super) struct ImportDropper<'a> {
    pub imports: &'a Imports,
}

impl VisitMut for ImportDropper<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, i: &mut ModuleItem) {
        match i {
            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { src, .. }))
                if self
                    .imports
                    .specifiers
                    .iter()
                    .any(|(s, _)| s.src.value == *src.value) =>
            {
                *i = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
            }
            _ => {}
        }
    }
}

/// `export var a = 1` => `var a = 1`
pub(super) struct Unexporter;

impl Fold for Unexporter {
    noop_fold_type!();

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        match item {
            ModuleItem::ModuleDecl(decl) => match decl {
                ModuleDecl::ExportDecl(decl) => ModuleItem::Stmt(Stmt::Decl(decl.decl)),

                ModuleDecl::ExportDefaultDecl(export) => match export.decl {
                    DefaultDecl::Class(ClassExpr { ident: None, .. })
                    | DefaultDecl::Fn(FnExpr { ident: None, .. }) => {
                        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                    }
                    DefaultDecl::TsInterfaceDecl(decl) => {
                        ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(decl)))
                    }

                    DefaultDecl::Class(ClassExpr {
                        ident: Some(ident),
                        class,
                    }) => ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                        declare: false,
                        ident,
                        class,
                    }))),

                    DefaultDecl::Fn(FnExpr {
                        ident: Some(ident),
                        function,
                    }) => ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                        declare: false,
                        function,
                        ident,
                    }))),
                },

                // Empty statement
                ModuleDecl::ExportAll(..)
                | ModuleDecl::ExportDefaultExpr(..)
                | ModuleDecl::ExportNamed(..) => {
                    ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                }
                ModuleDecl::Import(..) => ModuleItem::ModuleDecl(decl),

                _ => unimplemented!("Unexported: {:?}", decl),
            },

            _ => item,
        }
    }
}

struct Es6ModuleInjector {
    imported: Vec<ModuleItem>,
    ctxt: SyntaxContext,
}

impl VisitMut for Es6ModuleInjector {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { span, .. }))
                    if span.ctxt == self.ctxt =>
                {
                    buf.extend(take(&mut self.imported));
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}

struct DefaultRenamer;

impl VisitMut for DefaultRenamer {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        match n {
            Pat::Ident(n) => {
                if n.sym == js_word!("default") {
                    n.sym = "__default".into()
                }
                return;
            }
            _ => {}
        }
        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(n) => {
                if n.sym == js_word!("default") {
                    n.sym = "__default".into()
                }
                return;
            }
            _ => {}
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self)
        }
    }
}
