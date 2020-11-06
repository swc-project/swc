use super::plan::{NormalPlan, Plan};
use crate::{
    bundler::load::{Imports, Specifier, TransformedModule},
    debug::print_hygiene,
    id::ModuleId,
    load::Load,
    resolve::Resolve,
    util::{self, IntoParallelIterator},
    Bundler, Hook, ModuleRecord,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use retain_mut::RetainMut;
use std::{borrow::Cow, mem::take};
use swc_atoms::js_word;
use swc_common::{FileName, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend, prepend_stmts, private_ident};
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
            entry.visit_mut_with(&mut ImportMetaHandler {
                file: &info.fm.name,
                hook: &self.hook,
                is_entry,
                inline_ident: private_ident!("importMeta"),
                occurred: false,
                err: None,
            });

            // print_hygiene(&format!("{}", info.fm.name), &self.cm, &entry);

            self.merge_reexports(plan, module_plan, &mut entry, &info, merged)
                .context("failed to merge reepxorts")?;

            if module_plan.chunks.is_empty() && module_plan.transitive_chunks.is_empty() {
                return Ok(entry);
            }

            log::debug!(
                "Merge: ({}) {} <= {:?}",
                info.id,
                info.fm.name,
                plan.normal.get(&info.id)
            );

            // We handle this kind of modules specially.
            if self.scope.should_be_wrapped_with_a_fn(info.id) {
                return Ok(entry);
            }

            // print_hygiene("after: merge_reexports", &self.cm, &entry);

            entry = self
                .merge_imports(plan, module_plan, entry, &info, merged, is_entry)
                .context("failed to merge imports")?;

            Ok(entry)
        })
    }

    pub(super) fn merge_imports(
        &self,
        plan: &Plan,
        module_plan: &NormalPlan,
        mut entry: Module,
        info: &TransformedModule,
        merged: &CHashSet<ModuleId>,
        is_entry: bool,
    ) -> Result<Module, Error> {
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
                    return true;
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
                            let dep_info = self.scope.get_module(src.module_id).unwrap();
                            info.helpers.extend(&dep_info.helpers);
                            info.swc_helpers.extend_from(&dep_info.swc_helpers);

                            if !merged.insert(src.module_id) {
                                log::debug!("Skipping: {} <= {}", info.fm.name, src.src.value);
                                return Ok(None);
                            }

                            log::debug!("Merging: {} <= {}", info.fm.name, src.src.value);

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
                                    self.scope.should_be_wrapped_with_a_fn(dep_info.id);

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
                                        plan,
                                        dep,
                                        &dep_info,
                                        merged,
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
                                        // print_hygiene(
                                        //     "dep: before remarking exports",
                                        //     &self.cm,
                                        //     &dep,
                                        // );

                                        dep = self.remark_exports(
                                            dep,
                                            dep_info.ctxt(),
                                            Some(&imports),
                                            true,
                                        );
                                    }
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

                        // print_hygiene("transitive dep", &self.cm, &dep);

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

            // print_hygiene("dep: before injection", &self.cm, &dep);

            if dep_info.is_es6 {
                // print_hygiene("entry: before injection", &self.cm, &entry);

                if !is_direct {
                    prepend_stmts(&mut entry.body, take(&mut dep.body).into_iter());

                    log::debug!(
                        "Merged {} into {} as a transitive es module",
                        dep_info.fm.name,
                        info.fm.name,
                    );

                    // print_hygiene("ES6", &self.cm, &entry);
                    continue;
                }

                // Replace import statement / require with module body
                let mut injector = Es6ModuleInjector {
                    imported: take(&mut dep.body),
                    ctxt: dep_info.ctxt(),
                    is_direct,
                };
                entry.body.visit_mut_with(&mut injector);

                if injector.imported.is_empty() {
                    // print_hygiene("entry:after:injection", &self.cm, &entry);

                    log::debug!(
                        "Merged {} into {} as an es module",
                        dep_info.fm.name,
                        info.fm.name,
                    );
                    // print_hygiene(
                    //     &format!("ES6: {:?} <- {:?}", info.ctxt(), dep_info.ctxt()),
                    //     &self.cm,
                    //     &entry,
                    // );
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
            self.finalize_merging_of_entry(plan, &mut entry);
        }

        Ok(entry)
    }

    fn finalize_merging_of_entry(&self, plan: &Plan, entry: &mut Module) {
        print_hygiene("done", &self.cm, &entry);

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

        // print_hygiene(
        //     "done-clean",
        //     &self.cm,
        //     &entry
        //         .clone()
        //         .fold_with(&mut hygiene())
        //         .fold_with(&mut fixer(None)),
        // );
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
    is_direct: bool,
}

impl VisitMut for Es6ModuleInjector {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span, specifiers, ..
                })) if span.ctxt == self.ctxt => {
                    buf.extend(take(&mut self.imported));

                    if !self.is_direct {
                        let decls = specifiers
                            .iter()
                            .filter_map(|specifier| match specifier {
                                ImportSpecifier::Named(ImportNamedSpecifier {
                                    local,
                                    imported: Some(imported),
                                    ..
                                }) => {
                                    let mut imported = imported.clone();
                                    imported.span = imported.span.with_ctxt(self.ctxt);

                                    Some(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(local.clone()),
                                        init: Some(Box::new(Expr::Ident(imported))),
                                        definite: false,
                                    })
                                }
                                _ => None,
                            })
                            .collect::<Vec<_>>();

                        if !decls.is_empty() {
                            buf.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Const,
                                declare: false,
                                decls,
                            }))));
                        }
                    }
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

struct ImportMetaHandler<'a, 'b> {
    file: &'a FileName,
    hook: &'a Box<dyn 'b + Hook>,
    is_entry: bool,
    inline_ident: Ident,
    occurred: bool,
    err: Option<Error>,
}

impl VisitMut for ImportMetaHandler<'_, '_> {
    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);

        if self.occurred {
            match self.hook.get_import_meta_props(
                n.span,
                &ModuleRecord {
                    file_name: self.file.to_owned(),
                    is_entry: self.is_entry,
                },
            ) {
                Ok(key_value_props) => {
                    prepend(
                        &mut n.body,
                        ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: n.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: n.span,
                                name: Pat::Ident(self.inline_ident.clone()),
                                init: Some(Box::new(Expr::Object(ObjectLit {
                                    span: n.span,
                                    props: key_value_props
                                        .iter()
                                        .cloned()
                                        .map(|kv| PropOrSpread::Prop(Box::new(Prop::KeyValue(kv))))
                                        .collect(),
                                }))),
                                definite: false,
                            }],
                        }))),
                    );
                }
                Err(err) => self.err = Some(err),
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::MetaProp(MetaPropExpr {
                meta:
                    Ident {
                        sym: js_word!("import"),
                        ..
                    },
                prop:
                    Ident {
                        sym: js_word!("meta"),
                        ..
                    },
                ..
            }) => {
                *e = Expr::Ident(self.inline_ident.clone());
                self.occurred = true;
            }
            _ => {}
        }
    }
}
