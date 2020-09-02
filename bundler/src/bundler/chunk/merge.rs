use super::plan::Plan;
use crate::{
    bundler::{
        export::Exports,
        load::{Imports, Source, Specifier},
    },
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
use std::{borrow::Cow, mem::take};
use swc_common::{Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};

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
    ) -> Result<Module, Error> {
        self.run(|| {
            let info = self.scope.get_module(entry).unwrap();

            if !force_not_cyclic {
                // Handle circular imports
                if let Some(circular_plan) = plan.entry_as_circular(info.id) {
                    log::info!("Circular dependency detected: ({})", info.fm.name);
                    return Ok(self.merge_circular_modules(plan, circular_plan, entry)?);
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

            log::trace!("merge_modules({}) <- {:?}", info.fm.name, plan.normal);

            // // Respan using imported module's syntax context.
            // entry.visit_mut_with(&mut LocalMarker {
            //     top_level_ctxt: SyntaxContext::empty().apply_mark(self.top_level_mark),
            //     specifiers: &info.imports.specifiers,
            // });

            log::info!(
                "Merge: ({}){} <= {:?}",
                info.id,
                info.fm.name,
                plan.normal.get(&info.id)
            );

            if module_plan.chunks.is_empty() {
                return Ok(entry);
            }

            self.merge_reexports(plan, &mut entry, &info)
                .context("failed to merge reepxorts")?;

            let to_merge: Vec<_> = info
                .imports
                .specifiers
                .iter()
                .filter(|(src, _)| {
                    log::trace!("Checking: {} <= {}", info.fm.name, src.src.value);

                    // Skip if a dependency is going to be merged by other dependency
                    module_plan.chunks.contains(&src.module_id)
                })
                .collect();

            let (deps, transitive_deps) = util::join(
                || {
                    to_merge
                        .into_par_iter()
                        .map(|(src, specifiers)| -> Result<_, Error> {
                            self.run(|| {
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
                                    .merge_modules(plan, src.module_id, false, false)
                                    .with_context(|| {
                                        format!(
                                            "failed to merge: ({}):{} <= ({}):{}",
                                            info.id, info.fm.name, src.module_id, src.src.value
                                        )
                                    })?;

                                if dep_info.is_es6 {
                                    print_hygiene("dep:before:tree-shaking", &self.cm, &dep);

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

                                    // print_hygiene("dep:after wrapping esm",
                                    // &self.cm,
                                    // &dep);
                                    } else {
                                        // print_hygiene("dep: before tree shaking", &self.cm,
                                        // &dep);

                                        print_hygiene("dep: after tree shaking", &self.cm, &dep);

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
                                    // print_hygiene("dep:after:export-renamer", &self.cm, &dep);

                                    dep = dep.fold_with(&mut Unexporter);
                                }
                                print_hygiene("dep:before-injection", &self.cm, &dep);

                                Ok((dep, dep_info))
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
                            let dep_info = self.scope.get_module(id).unwrap();
                            let mut dep = self.merge_modules(plan, id, false, true)?;

                            dep = self.remark_exports(dep, dep_info.ctxt(), None);
                            // dep = dep.fold_with(&mut Unexporter);

                            Ok((dep, dep_info))
                        })
                        .collect::<Vec<_>>();

                    deps
                },
            );

            let mut targets = module_plan.chunks.clone();

            for dep in transitive_deps.into_iter().chain(deps) {
                let (mut dep, dep_info) = dep?;
                if let Some(idx) = targets.iter().position(|v| *v == dep_info.id) {
                    targets.remove(idx);
                    if let Some(v) = plan.normal.get(&dep_info.id) {
                        targets.retain(|&id| !v.chunks.contains(&id));
                    }
                    if let Some(v) = plan.circular.get(&dep_info.id) {
                        targets.retain(|&id| !v.chunks.contains(&id));
                    }
                }

                if dep_info.is_es6 {
                    print_hygiene("entry: before injection", &self.cm, &entry);

                    // Replace import statement / require with module body
                    let mut injector = Es6ModuleInjector {
                        imported: take(&mut dep.body),
                        ctxt: dep_info.ctxt(),
                    };
                    entry.body.visit_mut_with(&mut injector);

                    print_hygiene("entry:after:injection", &self.cm, &entry);

                    if injector.imported.is_empty() {
                        log::debug!("Merged {} as an es module", info.fm.name);
                        print_hygiene("ES6", &self.cm, &entry);
                        continue;
                    }
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
                entry.visit_mut_with(&mut ImportDropper {
                    imports: &info.imports,
                })
            }

            Ok(entry)
        })
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

/// Applied to the importer module, and marks (connects) imported idents.
pub(super) struct LocalMarker<'a> {
    /// Syntax context of the top level items.
    pub top_level_ctxt: SyntaxContext,
    pub specifiers: &'a [(Source, Vec<Specifier>)],
}

impl VisitMut for LocalMarker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, mut node: &mut Ident) {
        if node.span.ctxt != self.top_level_ctxt {
            return;
        }

        for (s, specifiers) in self.specifiers {
            if specifiers.iter().any(|id| *id.local() == *node) {
                node.span = node.span.with_ctxt(s.ctxt);
            }
        }
    }

    fn visit_mut_labeled_stmt(&mut self, node: &mut LabeledStmt) {
        node.body.visit_mut_with(self);
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
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
