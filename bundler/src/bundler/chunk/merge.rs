use super::plan::{DepType, Plan};
use crate::{
    bundler::{
        chunk::{export::ExportInjector, plan::NormalPlan, sort::sort},
        load::{Imports, Source, Specifier, TransformedModule},
    },
    debug::print_hygiene,
    id::{Id, ModuleId},
    load::Load,
    resolve::Resolve,
    util::{self, CloneMap, ExprExt, IntoParallelIterator, MapWithMut, VarDeclaratorExt},
    Bundler, Hook, ModuleRecord,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use retain_mut::RetainMut;
use std::{borrow::Cow, collections::HashMap, mem::take};
use swc_atoms::js_word;
use swc_common::{sync::Lock, FileName, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, prepend, private_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};
use util::CHashSet;

pub(super) struct Ctx {
    pub plan: Plan,
    pub merged: CHashSet<ModuleId>,
    pub transitive_remap: CloneMap<SyntaxContext, SyntaxContext>,
    pub export_stars_in_wrapped: Lock<HashMap<ModuleId, Vec<SyntaxContext>>>,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Merge
    pub(super) fn merge_modules(
        &self,
        ctx: &Ctx,
        module_id: ModuleId,
        is_entry: bool,
        allow_circular: bool,
    ) -> Result<Module, Error> {
        self.run(|| {
            let info = self.scope.get_module(module_id).unwrap();

            if allow_circular {
                if let Some(plan) = ctx.plan.circular.get(&module_id) {
                    let mut module =
                        self.merge_circular(ctx, plan, module_id).with_context(|| {
                            format!("failed to merge {:?} (circular import)", module_id)
                        })?;
                    if is_entry {
                        self.replace_import_specifiers(&info, &mut module);
                        self.finalize_merging_of_entry(ctx, &mut module);
                    }
                    return Ok(module);
                }
            }

            let mut module = self
                .get_module_for_merging(ctx, module_id, is_entry)
                .with_context(|| format!("Failed to clone {:?} for merging", module_id))?;

            {
                let plan = ctx.plan.normal.get(&module_id);
                let default_plan;
                let plan = match plan {
                    Some(plan) => plan,
                    None => {
                        default_plan = Default::default();
                        &default_plan
                    }
                };

                // print_hygiene(
                //     &format!("before merging deps: {}", info.fm.name),
                //     &self.cm,
                //     &module,
                // );

                module = self.merge_deps(ctx, is_entry, module, plan, &info, !allow_circular)?;

                // print_hygiene(
                //     &format!("after merging deps: {}", info.fm.name),
                //     &self.cm,
                //     &module,
                // );
            }

            if is_entry {
                self.replace_import_specifiers(&info, &mut module);
                self.finalize_merging_of_entry(ctx, &mut module);
            }

            Ok(module)
        })
    }

    fn merge_direct_import(
        &self,
        ctx: &Ctx,
        dep_id: ModuleId,
        specifiers: &[Specifier],
    ) -> Result<Module, Error> {
        log::debug!("Merging {:?} directly", dep_id);

        let dep_info = self.scope.get_module(dep_id).unwrap();
        let wrapped = self.scope.should_be_wrapped_with_a_fn(dep_id);

        // Now we handle imports
        let mut module = if wrapped {
            let mut module = self.get_module_for_merging(ctx, dep_id, false)?;
            module = self.wrap_esm(ctx, dep_id, module)?;

            // Inject local_name = wrapped_esm_module_name
            let module_ident = specifiers
                .iter()
                .find_map(|specifier| match specifier {
                    Specifier::Namespace {
                        local, all: true, ..
                    } => Some(local.clone()),
                    _ => None,
                })
                .unwrap();

            let esm_id = self.scope.wrapped_esm_id(dep_id).unwrap();

            module.body.push(
                esm_id
                    .clone()
                    .assign_to(module_ident.clone())
                    .into_module_item("merge_direct_import"),
            );

            let plan = ctx.plan.normal.get(&dep_id);
            let default_plan;
            let plan = match plan {
                Some(plan) => plan,
                None => {
                    default_plan = Default::default();
                    &default_plan
                }
            };

            // print_hygiene("wrapped: before deps", &self.cm, &module);

            if let Some(plan) = ctx.plan.circular.get(&dep_id) {
                module = self
                    .merge_circular_modules(ctx, module, dep_id, plan.chunks.clone())
                    .with_context(|| format!("failed to merge {:?} (circular import)", dep_id))?;
            }

            module = self
                .merge_deps(ctx, false, module, plan, &dep_info, false)
                .context("failed to merge dependencies")?;

            // Required to handle edge cases liek https://github.com/denoland/deno/issues/8530
            for specifier in specifiers {
                match specifier {
                    Specifier::Specific { local, alias } => {
                        let from = esm_id
                            .clone()
                            .into_ident()
                            .make_member(alias.clone().unwrap());

                        module.body.push(
                            from.assign_to(local.clone())
                                .into_module_item("namespace_with_normal"),
                        );
                    }
                    Specifier::Namespace { .. } => continue,
                }
            }
            self.handle_import_deps(ctx, &dep_info, &mut module, false);

            module
        } else {
            let mut module = self.merge_modules(ctx, dep_id, false, true)?;

            // print_hygiene("import: After meging deps of a dep", &self.cm, &module);
            self.handle_import_deps(ctx, &dep_info, &mut module, false);
            // print_hygiene("import: After handle_import_deps", &self.cm, &module);
            module
        };

        let mut var_decls = vars_from_exports(&dep_info, &module);

        module = module.fold_with(&mut Unexporter);

        // Handle aliased imports
        var_decls.extend(specifiers.iter().filter_map(|specifier| match specifier {
            Specifier::Specific {
                local,
                alias: Some(alias),
            } => {
                let local = local.clone().into_ident();
                let alias = alias.clone().with_ctxt(dep_info.export_ctxt()).into_ident();

                Some(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(local),
                    init: Some(Box::new(Expr::Ident(alias))),
                    definite: false,
                })
            }
            // TODO
            Specifier::Namespace { .. } => None,
            _ => None,
        }));

        for var in var_decls {
            module
                .body
                .push(var.into_module_item("from_merge_direct_import"));
        }

        Ok(module)
    }

    fn merge_transitive_import(&self, ctx: &Ctx, dep_id: ModuleId) -> Result<Module, Error> {
        log::debug!("Merging {:?} transitively", dep_id);

        let dep_info = self.scope.get_module(dep_id).unwrap();
        let mut module = self.merge_modules(ctx, dep_id, false, true)?;
        self.handle_import_deps(ctx, &dep_info, &mut module, false);

        let var_decls = vars_from_exports(&dep_info, &module);

        module = module.fold_with(&mut Unexporter);

        for var in var_decls {
            module
                .body
                .push(var.into_module_item("from_merge_transitive_import"));
        }

        Ok(module)
    }

    /// Even after one instance of module is merged into main enrry, code like
    ///
    /// ```ts
    /// export { foo#12, baz#12 } from './common';
    /// ```
    ///
    /// can remain. (`./common` is already merged, but ast nodes were not
    /// modified because it's not a direct dependancy.)
    ///
    /// This method
    fn transform_indirect_reexports(
        &self,
        _ctx: &Ctx,
        module: &mut Module,
        deps: Vec<Source>,
    ) -> Result<(), Error> {
        self.run(|| {
            //
            for stmt in &mut module.body {
                let decl = match stmt {
                    ModuleItem::ModuleDecl(decl) => decl,
                    ModuleItem::Stmt(_) => continue,
                };

                for source in &deps {
                    match decl {
                        ModuleDecl::ExportNamed(export @ NamedExport { src: Some(..), .. }) => {
                            if export.src.as_ref().unwrap().value == source.src.value {
                                export.src = None;
                                break;
                            }
                        }
                        ModuleDecl::ExportAll(export) => {
                            // TODO
                            if export.src.value == source.src.value {}
                        }
                        _ => continue,
                    }
                }
            }

            Ok(())
        })
    }

    fn merge_deps(
        &self,
        ctx: &Ctx,
        is_entry: bool,
        mut module: Module,
        plan: &NormalPlan,
        info: &TransformedModule,
        from_circular: bool,
    ) -> Result<Module, Error> {
        self.run(|| -> Result<_, Error> {
            log::debug!(
                "Normal merging: ({:?}) {} <= {:?}",
                info.id,
                info.fm.name,
                plan
            );

            if !from_circular {
                let deps = info
                    .exports
                    .reexports
                    .iter()
                    .map(|v| &v.0)
                    .cloned()
                    .filter(|source| plan.chunks.iter().all(|chunk| chunk.id != source.module_id))
                    .collect();
                self.transform_indirect_reexports(ctx, &mut module, deps)?;
            }

            if plan.chunks.is_empty() {
                return Ok(module);
            }

            let deps: Vec<_> = (&plan.chunks)
                .into_par_iter()
                .map(|dep| -> Result<_, Error> {
                    self.run(|| {
                        let dep_info = self.scope.get_module(dep.id).unwrap();

                        info.helpers.extend(&dep_info.helpers);
                        info.swc_helpers.extend_from(&dep_info.swc_helpers);

                        log::debug!("Merging: {} <= {}", info.fm.name, dep_info.fm.name);

                        let reexport = info
                            .exports
                            .reexports
                            .iter()
                            .find(|(src, _)| src.module_id == dep.id);
                        let wrapped = self.scope.should_be_wrapped_with_a_fn(dep.id);

                        match reexport {
                            Some((src, specifiers)) => {
                                let dep_module = self.merge_export(ctx, dep.id, &specifiers)?;
                                return Ok((true, Some(src), dep, dep_module));
                            }
                            None => {}
                        }

                        let dep_module = match dep.ty {
                            DepType::Direct => {
                                let res = info
                                    .imports
                                    .specifiers
                                    .iter()
                                    .find(|(src, _)| src.module_id == dep.id);

                                if let Some((_, specifiers)) = res {
                                    self.merge_direct_import(ctx, dep.id, &specifiers)?
                                } else {
                                    // Common js requires different planning strategy.
                                    self.merge_transitive_import(ctx, dep.id)?
                                }
                            }
                            DepType::Transitive => {
                                debug_assert!(!wrapped, "Transitive dependency cannot be wrapped");
                                self.merge_transitive_import(ctx, dep.id)?
                            }
                        };

                        Ok((false, None, dep, dep_module))
                    })
                })
                .collect();

            let mut targets = plan.chunks.clone();

            for dep in deps {
                let (is_export, source, dep, mut dep_module) = dep?;
                let dep_info = self.scope.get_module(dep.id).unwrap();

                if let Some(idx) = targets.iter().position(|v| v.id == dep.id) {
                    targets.remove(idx);
                    if let Some(v) = ctx.plan.normal.get(&dep.id) {
                        targets.retain(|&dep| !v.chunks.contains(&dep));
                    }
                    if let Some(v) = ctx.plan.circular.get(&dep.id) {
                        targets.retain(|&dep| !v.chunks.contains(&dep.id));
                    }
                }

                if is_export {
                    assert!(dep_info.is_es6, "export statements are es6-only");
                    let mut injector = ExportInjector {
                        imported: take(&mut dep_module.body),
                        source: source.unwrap().clone(),
                        ctx,
                        export_ctxt: info.export_ctxt(),
                        // We use id of the entry
                        wrapped: self.scope.should_be_wrapped_with_a_fn(info.id),
                    };
                    module.body.visit_mut_with(&mut injector);

                    log::debug!(
                        "Merged {} into {} as a reexport",
                        dep_info.fm.name,
                        info.fm.name,
                    );

                    continue;
                }

                if dep_info.is_es6 {
                    // print_hygiene("entry: before injection", &self.cm, &module);

                    match dep.ty {
                        DepType::Transitive => {
                            module.body.extend(dep_module.body);

                            log::debug!(
                                "Merged {} into {} as a transitive es module",
                                dep_info.fm.name,
                                info.fm.name,
                            );

                            // print_hygiene("ES6", &self.cm, &entry);
                            continue;
                        }
                        _ => {}
                    }

                    // print_hygiene(
                    //     &format!("entry: before injection of `{}`", dep_info.fm.name),
                    //     &self.cm,
                    //     &module,
                    // );

                    // Replace import statement / require with module body
                    let mut injector = Es6ModuleInjector {
                        imported: take(&mut dep_module.body),
                        dep_export_ctxt: dep_info.export_ctxt(),
                        is_direct: match dep.ty {
                            DepType::Direct => true,
                            _ => false,
                        },
                    };
                    module.body.visit_mut_with(&mut injector);

                    if injector.imported.is_empty() {
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

                    if info.is_es6 && dep_info.is_es6 {
                        module.body.extend(injector.imported);
                        continue;
                    }

                    dep_module.body = take(&mut injector.imported);

                    // print_hygiene(
                    //     &format!("entry: failed to inject: {}; {:?}",
                    // dep_info.fm.name, dep),     &self.cm,
                    //     &dep_module,
                    // );
                }

                if self.config.require {
                    self.merge_cjs(
                        ctx,
                        is_entry,
                        &mut module,
                        &info,
                        Cow::Owned(dep_module),
                        &dep_info,
                        &mut targets,
                    )?;
                }
                // if self.config.require {
                //     self.merge_cjs(
                //         plan,
                //         is_entry,
                //         &mut entry,
                //         &info,
                //         Cow::Owned(dep),
                //         &dep_info,
                //         &mut targets,
                //     )?;
                // }
            }

            Ok(module)
        })
    }

    pub(super) fn get_module_for_merging(
        &self,
        _ctx: &Ctx,
        module_id: ModuleId,
        is_entry: bool,
    ) -> Result<Module, Error> {
        self.run(|| {
            let info = self.scope.get_module(module_id).unwrap();

            let mut entry: Module = (*info.module).clone();
            entry.visit_mut_with(&mut ImportMetaHandler {
                file: &info.fm.name,
                hook: &self.hook,
                is_entry,
                inline_ident: private_ident!("importMeta"),
                occurred: false,
                err: None,
            });

            Ok(entry)
        })
    }

    /// This should only be called after everything is merged.
    ///
    /// This method does not care about orders of statement, and it's expected
    /// to be called before `sort`.
    fn handle_export_stars(&self, ctx: &Ctx, entry: &mut Module) {
        {
            // Handle `export *` for non-wrapped modules.

            let mut extra_stmts = vec![];

            for stmt in entry.body.iter() {
                match stmt {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                        let ids: Vec<Id> = find_ids(decl);

                        for id in ids {
                            if let Some(remapped) = ctx.transitive_remap.get(&id.ctxt()) {
                                let reexported = id.clone().with_ctxt(remapped);
                                extra_stmts.push(
                                    id.assign_to(reexported)
                                        .into_module_item("export_star_replacer"),
                                );
                            }
                        }
                    }

                    _ => {}
                }
            }

            entry.body.extend(extra_stmts);
        }

        {
            let mut map = ctx.export_stars_in_wrapped.lock();
            let mut additional_props = HashMap::<_, Vec<_>>::new();
            // Handle `export *` for wrapped modules.
            for (module_id, ctxts) in map.drain() {
                for stmt in entry.body.iter() {
                    match stmt {
                        ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                            let ids: Vec<Id> = find_ids(decl);

                            for id in ids {
                                if ctxts.contains(&id.ctxt()) {
                                    additional_props.entry(module_id).or_default().push(
                                        PropOrSpread::Prop(Box::new(Prop::Shorthand(
                                            id.into_ident(),
                                        ))),
                                    );
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }

            for (module_id, props) in additional_props {
                let id = match self.scope.wrapped_esm_id(module_id) {
                    Some(v) => v,
                    None => continue,
                };

                for stmt in &mut entry.body {
                    let var = match stmt {
                        ModuleItem::Stmt(Stmt::Decl(Decl::Var(
                            var
                            @
                            VarDecl {
                                kind: VarDeclKind::Const,
                                ..
                            },
                        ))) => var,
                        _ => continue,
                    };

                    if var.decls.len() != 1 {
                        continue;
                    }

                    let var_decl = &mut var.decls[0];
                    match &var_decl.name {
                        Pat::Ident(i) if id == *i => {}
                        _ => continue,
                    }

                    let callee = match &mut var_decl.init {
                        Some(init) => match &mut **init {
                            Expr::Call(CallExpr { callee, .. }) => match callee {
                                ExprOrSuper::Super(_) => continue,
                                ExprOrSuper::Expr(v) => v,
                            },
                            _ => continue,
                        },
                        None => continue,
                    };

                    let f = match &mut **callee {
                        Expr::Fn(f) => f,
                        _ => continue,
                    };

                    let body = match &mut f.function.body {
                        Some(body) => body,
                        None => continue,
                    };

                    let last_stmt = body.stmts.last_mut();

                    let return_stmt = match last_stmt {
                        Some(Stmt::Return(s)) => s,
                        _ => continue,
                    };

                    let ret_val = match &mut return_stmt.arg {
                        Some(arg) => arg,
                        None => continue,
                    };

                    let obj = match &mut **ret_val {
                        Expr::Object(obj) => obj,
                        _ => continue,
                    };

                    obj.props.extend(props);
                    break;
                }
            }
        }
    }

    fn finalize_merging_of_entry(&self, ctx: &Ctx, entry: &mut Module) {
        self.handle_export_stars(ctx, entry);

        sort(&mut entry.body);

        print_hygiene("done", &self.cm, &entry);

        entry.body.retain_mut(|item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..)) => return false,

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                    export.src = None;
                }

                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    for (id, p) in &ctx.plan.normal {
                        if import.span.ctxt == self.scope.get_module(*id).unwrap().export_ctxt() {
                            log::debug!("Dropping import");
                            return false;
                        }

                        for &dep in &p.chunks {
                            if import.span.ctxt
                                == self.scope.get_module(dep.id).unwrap().export_ctxt()
                            {
                                log::debug!("Dropping direct import");
                                return false;
                            }
                        }
                    }

                    for (id, p) in &ctx.plan.circular {
                        // Drop if it's one of circular import
                        if import.span.ctxt == self.scope.get_module(*id).unwrap().export_ctxt() {
                            log::debug!("Dropping circular import");
                            return false;
                        }

                        for &mid in &p.chunks {
                            if import.span.ctxt == self.scope.get_module(mid).unwrap().export_ctxt()
                            {
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

    pub(super) fn replace_import_specifiers(&self, info: &TransformedModule, module: &mut Module) {
        let mut new = Vec::with_capacity(module.body.len() + 32);

        for stmt in take(&mut module.body) {
            match &stmt {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    for specifier in &import.specifiers {
                        match specifier {
                            ImportSpecifier::Named(named) => match &named.imported {
                                Some(imported) => {
                                    new.push(
                                        imported
                                            .clone()
                                            .assign_to(named.local.clone())
                                            .into_module_item("from_replace_import_specifiers"),
                                    );
                                    continue;
                                }
                                None => {}
                            },
                            ImportSpecifier::Default(default) => {
                                if let Some((src, _)) = info
                                    .imports
                                    .specifiers
                                    .iter()
                                    .find(|s| s.0.src.value == import.src.value)
                                {
                                    let imported = Ident::new(
                                        js_word!("default"),
                                        DUMMY_SP.with_ctxt(src.export_ctxt),
                                    );
                                    new.push(
                                        imported
                                            .assign_to(default.local.clone())
                                            .into_module_item("from_replace_import_specifiers"),
                                    );
                                    continue;
                                }
                            }
                            ImportSpecifier::Namespace(_) => {}
                        }
                    }

                    // We should remove imports
                    continue;
                }
                _ => {}
            }

            new.push(stmt);
        }

        module.body = new;
    }

    /// If a dependency aliased exports, we handle them at here.
    pub(super) fn handle_import_deps(
        &self,
        ctx: &Ctx,
        info: &TransformedModule,
        module: &mut Module,
        _for_circular: bool,
    ) {
        self.replace_import_specifiers(info, module);

        let mut vars = vec![];

        for orig_stmt in module.body.iter_mut() {
            let mut stmt = orig_stmt.take();

            match stmt {
                ModuleItem::ModuleDecl(mut decl) => {
                    stmt = match decl {
                        ModuleDecl::ExportNamed(export) => {
                            for specifier in &export.specifiers {
                                match specifier {
                                    ExportSpecifier::Namespace(ns) => {
                                        let mut lhs = ns.name.clone();
                                        lhs.span = lhs.span.with_ctxt(info.export_ctxt());
                                        vars.push(
                                            ns.name
                                                .clone()
                                                .assign_to(lhs)
                                                .into_module_item("import_deps_namespace"),
                                        );
                                    }
                                    ExportSpecifier::Default(default) => {
                                        let mut lhs = default.exported.clone();
                                        lhs.span = lhs.span.with_ctxt(info.export_ctxt());
                                        vars.push(
                                            default
                                                .exported
                                                .clone()
                                                .assign_to(lhs)
                                                .into_module_item("import_deps_default"),
                                        );
                                    }
                                    ExportSpecifier::Named(named) => match &named.exported {
                                        Some(exported) => {
                                            if named.orig.span.ctxt != info.export_ctxt() {
                                                let mut lhs = exported.clone();
                                                lhs.span = lhs.span.with_ctxt(info.export_ctxt());
                                                vars.push(
                                                    named
                                                        .orig
                                                        .clone()
                                                        .assign_to(lhs)
                                                        .into_module_item(
                                                            "import_deps_named_alias",
                                                        ),
                                                );
                                            }
                                        }
                                        None => {
                                            if info.export_ctxt() != named.orig.span.ctxt {
                                                let mut lhs: Ident = named.orig.clone();
                                                lhs.span.ctxt = info.export_ctxt();
                                                vars.push(
                                                    named
                                                        .orig
                                                        .clone()
                                                        .assign_to(lhs)
                                                        .into_module_item("import_deps_named"),
                                                );
                                            }
                                        }
                                    },
                                }
                            }

                            ModuleItem::dummy()
                        }
                        ModuleDecl::ExportDefaultDecl(ref mut export) => match &mut export.decl {
                            DefaultDecl::Class(expr) => {
                                let expr = expr.take();
                                let export_name = Pat::Ident(Ident::new(
                                    js_word!("default"),
                                    export.span.with_ctxt(info.export_ctxt()),
                                ));

                                let (init, s) = match expr.ident {
                                    Some(name) => {
                                        (
                                            Expr::Ident(name.clone()),
                                            ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                                                // Context of the span is local.
                                                ident: name,
                                                declare: false,
                                                class: expr.class,
                                            }))),
                                        )
                                    }
                                    None => (
                                        Expr::Class(expr),
                                        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })),
                                    ),
                                };

                                vars.push(
                                    VarDeclarator {
                                        span: DUMMY_SP,
                                        name: export_name,
                                        init: Some(Box::new(init)),
                                        definite: false,
                                    }
                                    .into_module_item("import_deps_export_default_decl"),
                                );

                                s
                            }
                            DefaultDecl::Fn(expr) => {
                                let expr = expr.take();
                                let export_name = Ident::new(
                                    js_word!("default"),
                                    export.span.with_ctxt(info.export_ctxt()),
                                );

                                let (init, s) = match expr.ident {
                                    Some(name) => (
                                        Expr::Ident(name.clone()),
                                        ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                            ident: name,
                                            declare: false,
                                            function: expr.function,
                                        }))),
                                    ),
                                    None => (
                                        Expr::Fn(expr),
                                        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })),
                                    ),
                                };

                                vars.push(
                                    init.assign_to(export_name)
                                        .into_module_item("import_deps_export_default_decl_fn"),
                                );
                                s
                            }
                            DefaultDecl::TsInterfaceDecl(_) => {
                                ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                            }
                        },
                        ModuleDecl::ExportDecl(export) => {
                            match &export.decl {
                                Decl::Class(ClassDecl { ident, .. })
                                | Decl::Fn(FnDecl { ident, .. }) => {
                                    let mut exported = ident.clone();
                                    exported.span.ctxt = info.export_ctxt();
                                    vars.push(
                                        ident
                                            .clone()
                                            .assign_to(exported)
                                            .into_module_item("import_deps_export_decl"),
                                    );
                                }
                                Decl::Var(var) => {
                                    let ids: Vec<Ident> = find_ids(var);

                                    for id in ids {
                                        let mut exported = id.clone();
                                        exported.span.ctxt = info.export_ctxt();
                                        vars.push(
                                            id.assign_to(exported)
                                                .into_module_item("import_deps_export_var_decl"),
                                        );
                                    }
                                }
                                _ => {}
                            }

                            ModuleItem::Stmt(Stmt::Decl(export.decl))
                        }
                        ModuleDecl::ExportDefaultExpr(mut export) => {
                            vars.push(
                                VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(Ident::new(
                                        js_word!("default"),
                                        DUMMY_SP.with_ctxt(info.export_ctxt()),
                                    )),
                                    init: Some(export.expr.take()),
                                    definite: false,
                                }
                                .into_module_item("import_deps_export_default_expr"),
                            );
                            ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                        }

                        ModuleDecl::ExportAll(ref export) => {
                            let export_ctxt = export.span.ctxt;
                            ctx.transitive_remap.insert(export_ctxt, info.export_ctxt());

                            ModuleItem::ModuleDecl(decl)
                        }

                        _ => ModuleItem::ModuleDecl(decl),
                    }
                }
                ModuleItem::Stmt(_) => {}
            }

            *orig_stmt = stmt;
        }

        for var in vars {
            module.body.push(var)
        }
    }
}

fn vars_from_exports(dep_info: &TransformedModule, module: &Module) -> Vec<VarDeclarator> {
    // Convert all exports into variables in form of
    //
    // A__export = A__local

    let mut vars = vec![];

    for item in &module.body {
        let item = match item {
            ModuleItem::ModuleDecl(item) => item,
            ModuleItem::Stmt(_) => continue,
        };

        match item {
            ModuleDecl::ExportDecl(export) => match &export.decl {
                Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                    let exported_name = Ident::new(
                        ident.sym.clone(),
                        ident.span.with_ctxt(dep_info.export_ctxt()),
                    );

                    vars.push(ident.clone().assign_to(exported_name));
                }
                Decl::Var(var) => {
                    let ids: Vec<Id> = find_ids(var);

                    for id in ids {
                        let exported = Ident::new(
                            id.sym().clone(),
                            DUMMY_SP.with_ctxt(dep_info.export_ctxt()),
                        );

                        vars.push(id.assign_to(exported))
                    }
                }
                Decl::TsInterface(_) => {}
                Decl::TsTypeAlias(_) => {}
                Decl::TsEnum(_) => {}
                Decl::TsModule(_) => {}
            },
            ModuleDecl::ExportNamed(_) => {}
            ModuleDecl::ExportDefaultDecl(export) => {
                let export_name = Ident::new(
                    js_word!("default"),
                    export.span.with_ctxt(dep_info.export_ctxt()),
                );

                vars.push(
                    Ident::new(
                        js_word!("default"),
                        export.span.with_ctxt(dep_info.local_ctxt()),
                    )
                    .assign_to(export_name),
                );
            }
            ModuleDecl::ExportDefaultExpr(export) => {
                let export_name = Ident::new(
                    js_word!("default"),
                    export.span.with_ctxt(dep_info.export_ctxt()),
                );

                vars.push(
                    Ident::new(
                        js_word!("default"),
                        export.span.with_ctxt(dep_info.local_ctxt()),
                    )
                    .assign_to(export_name),
                );
            }
            _ => {}
        }
    }

    vars
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
    /// Export context of the dependency module.
    dep_export_ctxt: SyntaxContext,
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
                })) if span.ctxt == self.dep_export_ctxt => {
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
                                    imported.span = imported.span.with_ctxt(self.dep_export_ctxt);

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

                        for var in decls {
                            buf.push(var.into_module_item("Es6ModuleInjector"));
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
