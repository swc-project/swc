use super::plan::DepType;
use super::plan::Plan;
use crate::bundler::chunk::export::inject_export;
use crate::bundler::keywords::KeywordRenamer;
use crate::debug::print_hygiene;
use crate::{
    bundler::{
        chunk::plan::NormalPlan,
        load::{Imports, Source, Specifier, TransformedModule},
        modules::Modules,
    },
    id::{Id, ModuleId},
    load::Load,
    resolve::Resolve,
    util::{self, CloneMap, ExprExt, IntoParallelIterator, MapWithMut, VarDeclaratorExt},
    Bundler, Hook, ModuleRecord,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use std::collections::HashMap;
use std::collections::HashSet;
use swc_atoms::js_word;
use swc_common::{sync::Lock, FileName, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, prepend, private_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
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
    ) -> Result<Modules, Error> {
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
                .with_context(|| format!("failed to clone {:?} for merging", module_id))?;

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
        src: &Source,
        specifiers: &[Specifier],
    ) -> Result<Modules, Error> {
        let injected_ctxt = self.injected_ctxt;

        log::debug!("Merging {:?} directly", dep_id);

        let dep_info = self.scope.get_module(dep_id).unwrap();
        let wrapped = self.scope.should_be_wrapped_with_a_fn(dep_id);

        // Now we handle imports
        let mut module = if wrapped {
            let mut module: Modules = self.get_module_for_merging(ctx, dep_id, false)?;
            module = self.wrap_esm(ctx, dep_id, module.into())?.into();

            // Inject local_name = wrapped_esm_module_name
            let module_ident = specifiers.iter().find_map(|specifier| match specifier {
                Specifier::Namespace {
                    local, all: true, ..
                } => Some(local.clone()),
                _ => None,
            });

            let esm_id = self.scope.wrapped_esm_id(dep_id).unwrap();

            if let Some(module_ident) = &module_ident {
                module.inject(
                    esm_id
                        .clone()
                        .assign_to(module_ident.clone())
                        .into_module_item(injected_ctxt, "merge_direct_import"),
                );
            }

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
                        let i = alias.clone().unwrap_or_else(|| local.clone());

                        let from = esm_id.clone().into_ident().make_member(i.clone());

                        module.inject(
                            from.assign_to(i.with_ctxt(src.export_ctxt))
                                .into_module_item(injected_ctxt, "namespace_with_normal"),
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
            module.inject(var.into_module_item(injected_ctxt, "from_merge_direct_import"));
        }

        Ok(module)
    }

    fn merge_transitive_import(&self, ctx: &Ctx, dep_id: ModuleId) -> Result<Modules, Error> {
        let injected_ctxt = self.injected_ctxt;

        log::debug!("Merging {:?} transitively", dep_id);

        let dep_info = self.scope.get_module(dep_id).unwrap();
        let mut module = self.merge_modules(ctx, dep_id, false, true)?;
        self.handle_import_deps(ctx, &dep_info, &mut module, false);

        let var_decls = vars_from_exports(&dep_info, &module);

        module = module.fold_with(&mut Unexporter);

        for var in var_decls {
            module.inject(var.into_module_item(injected_ctxt, "from_merge_transitive_import"));
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
        module: &mut Modules,
        deps: Vec<Source>,
    ) -> Result<(), Error> {
        self.run(|| {
            //
            for stmt in module.iter_mut() {
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
        mut module: Modules,
        plan: &NormalPlan,
        info: &TransformedModule,
        from_circular: bool,
    ) -> Result<Modules, Error> {
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

                                if let Some((src, specifiers)) = res {
                                    self.merge_direct_import(ctx, dep.id, &src, &specifiers)?
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

                    let res = inject_export(
                        &mut module,
                        ctx,
                        info.export_ctxt(),
                        self.scope.should_be_wrapped_with_a_fn(info.id),
                        dep_module,
                        source.unwrap().clone(),
                    );

                    match res {
                        Ok(()) => {}
                        Err(..) => {
                            unreachable!("Merging as export when export statement does not exist?")
                        }
                    }

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
                            module.push_all(dep_module);

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

                    // Replace import statement with module body
                    let res = inject_es_module(
                        &mut module,
                        dep_module,
                        dep_info.export_ctxt(),
                        match dep.ty {
                            DepType::Direct => true,
                            _ => false,
                        },
                    );

                    dep_module = match res {
                        Ok(()) => {
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
                        Err(dep) => dep,
                    };

                    if info.is_es6 && dep_info.is_es6 {
                        module.push_all(dep_module);
                        continue;
                    }

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
                        dep_module,
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
    ) -> Result<Modules, Error> {
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

            let mut module = Modules::from(entry, self.injected_ctxt);

            self.prepare(&info, &mut module);

            Ok(module)
        })
    }

    /// This should only be called after everything is merged.
    ///
    /// This method does not care about orders of statement, and it's expected
    /// to be called before `sort`.
    fn handle_export_stars(&self, ctx: &Ctx, entry: &mut Modules) {
        let injected_ctxt = self.injected_ctxt;

        {
            // Handle `export *` for non-wrapped modules.

            let mut vars = vec![];

            // We have to exlcude some ids because there are already declared.
            // See https://github.com/denoland/deno/issues/8725
            //
            // Let's say D is a dependency which contains export * from './foo';
            // If an user import and export from D, the transitive syntax context map
            // contains a entry from D to foo because it's reexported and
            // the variable (reexported from D) exist because it's imported.
            let mut declared_ids = HashSet::new();

            for stmt in entry.iter() {
                match stmt {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                        if decl.span.ctxt == injected_ctxt {
                            let ids: Vec<Id> = find_ids(decl);
                            declared_ids.extend(ids);
                        }
                    }
                    _ => {}
                }
            }

            for stmt in entry.iter() {
                match stmt {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                        let ids: Vec<Id> = find_ids(decl);

                        for id in ids {
                            if *id.sym() == js_word!("default") {
                                continue;
                            }

                            if let Some(remapped) = ctx.transitive_remap.get(&id.ctxt()) {
                                let reexported = id.clone().with_ctxt(remapped);

                                if declared_ids.contains(&reexported) {
                                    continue;
                                }

                                vars.push(
                                    id.assign_to(reexported)
                                        .into_module_item(injected_ctxt, "export_star_replacer"),
                                );
                            }
                        }
                    }

                    _ => {}
                }
            }

            entry.inject_all(vars);
        }

        {
            let mut map = ctx.export_stars_in_wrapped.lock();
            let mut additional_props = HashMap::<_, Vec<_>>::new();
            // Handle `export *` for wrapped modules.
            for (module_id, ctxts) in map.drain() {
                for stmt in entry.iter() {
                    match stmt {
                        ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                            let ids: Vec<Id> = find_ids(decl);

                            for id in ids {
                                if *id.sym() == js_word!("default") {
                                    continue;
                                }

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

                for stmt in entry.iter_mut() {
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

    fn finalize_merging_of_entry(&self, ctx: &Ctx, entry: &mut Modules) {
        self.handle_export_stars(ctx, entry);

        // print_hygiene("before sort", &self.cm, &entry.clone().into());

        entry.sort();

        print_hygiene("done", &self.cm, &entry.clone().into());

        entry.retain_mut(|item| {
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

        entry.visit_mut_with(&mut KeywordRenamer::default());

        // print_hygiene(
        //     "done-clean",
        //     &self.cm,
        //     &entry
        //         .clone()
        //         .fold_with(&mut hygiene())
        //         .fold_with(&mut fixer(None)),
        // );
    }

    /// This method handles imports and exports.
    ///
    ///
    /// Basically one module have two top-level contexts. One is for it's codes
    /// and another is for exporting. This method connects two module by
    /// injecting `const local_A = exported_B_from_foo;`
    pub(super) fn prepare(&self, info: &TransformedModule, module: &mut Modules) {
        let injected_ctxt = self.injected_ctxt;

        module.map_any_items(|items| {
            let mut new = Vec::with_capacity(items.len() * 11 / 10);

            for item in items {
                match item {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                        // Imports are easy to handle.
                        for s in &import.specifiers {
                            match s {
                                ImportSpecifier::Named(s) => match &s.imported {
                                    Some(imported) => {
                                        new.push(
                                            imported
                                                .clone()
                                                .assign_to(s.local.clone())
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "prepare -> named import -> aliased",
                                                ),
                                        );
                                    }
                                    None => {}
                                },
                                ImportSpecifier::Default(s) => {
                                    new.push(
                                        Ident::new(js_word!("default"), import.span)
                                            .assign_to(s.local.clone())
                                            .into_module_item(
                                                injected_ctxt,
                                                "prepare -> default import",
                                            ),
                                    );
                                }
                                ImportSpecifier::Namespace(s) => {
                                    if let Some((src, _)) = info
                                        .imports
                                        .specifiers
                                        .iter()
                                        .find(|s| s.0.src.value == import.src.value)
                                    {
                                        let esm_id =
                                            self.scope.wrapped_esm_id(src.module_id).expect(
                                                "If a namespace impoet specifier is preserved, it \
                                                 means failutre of deblobbing and as a result \
                                                 module should be marked as wrpaped esm",
                                            );
                                        new.push(
                                            esm_id
                                                .clone()
                                                .assign_to(s.local.clone())
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "from_replace_import_specifiers: namespaced",
                                                ),
                                        );
                                    }
                                }
                            }
                        }
                    }
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                        // At here, we create multiple items.
                        //
                        // One item is `const local_default = expr` and another one is
                        // `export { local_default as default }`.
                        //
                        // To allow using identifier of the declaration in the originsl module, we
                        // create `const local_default = orig_ident` if original identifier exists.

                        let local =
                            Ident::new(js_word!("default"), DUMMY_SP.with_ctxt(info.local_ctxt()));

                        match export.decl {
                            DefaultDecl::Class(c) => {
                                //
                                match c.ident {
                                    Some(ident) => {
                                        new.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(
                                            ClassDecl {
                                                ident: ident.clone(),
                                                class: c.class,
                                                declare: false,
                                            },
                                        ))));

                                        new.push(ident.assign_to(local.clone()).into_module_item(
                                            injected_ctxt,
                                            "prepare -> export default decl -> class -> with ident",
                                        ))
                                    }
                                    None => {
                                        let init = Expr::Class(c);
                                        new.push(init.assign_to(local.clone()).into_module_item(
                                            injected_ctxt,
                                            "prepare -> export default decl -> class -> without \
                                             ident",
                                        ));
                                    }
                                }
                            }
                            DefaultDecl::Fn(f) => {
                                //
                                match f.ident {
                                    Some(ident) => {
                                        new.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                            ident: ident.clone(),
                                            function: f.function,
                                            declare: false,
                                        }))));

                                        new.push(ident.assign_to(local.clone()).into_module_item(
                                            injected_ctxt,
                                            "prepare -> export default decl -> function -> with \
                                             ident",
                                        ))
                                    }
                                    None => {
                                        let init = Expr::Fn(f);

                                        new.push(init.assign_to(local.clone()).into_module_item(
                                            injected_ctxt,
                                            "prepare -> export default decl -> function -> \
                                             without ident",
                                        ));
                                    }
                                }
                            }
                            DefaultDecl::TsInterfaceDecl(_) => continue,
                        }

                        // Create `export { local_default as default }`
                        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: local,
                            exported: Some(Ident::new(
                                js_word!("default"),
                                DUMMY_SP.with_ctxt(info.export_ctxt()),
                            )),
                        });
                        new.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                            NamedExport {
                                span: export.span,
                                specifiers: vec![specifier],
                                src: None,
                                type_only: false,
                            },
                        )));
                    }

                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                        // At here, we create two items.
                        //
                        // One item is `const local_default = expr` and the
                        // other is `export { local_default as default }`.

                        // TODO: Check if we really need this.

                        let local =
                            Ident::new(js_word!("default"), DUMMY_SP.with_ctxt(info.local_ctxt()));

                        // Create `const local_default = expr`
                        new.push(
                            export
                                .expr
                                .assign_to(local.clone())
                                .into_module_item(injected_ctxt, "prepare -> export default expr"),
                        );

                        // Create `export { local_default as default }`
                        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: local,
                            exported: Some(Ident::new(
                                js_word!("default"),
                                DUMMY_SP.with_ctxt(info.export_ctxt()),
                            )),
                        });
                        new.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                            NamedExport {
                                span: export.span,
                                specifiers: vec![specifier],
                                src: None,
                                type_only: false,
                            },
                        )));
                    }

                    ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) => {
                        // Idea is almost same as above. But we uses symbol of the declaration
                        // instead of using `default`.

                        let local = match export.decl {
                            Decl::Class(c) => {
                                let i = c.ident.clone();
                                new.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(c))));

                                i
                            }
                            Decl::Fn(f) => {
                                let i = f.ident.clone();
                                new.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))));

                                i
                            }
                            Decl::Var(v) => {
                                let ids: Vec<Ident> = find_ids(&v);
                                //

                                new.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(v))));

                                new.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                                    NamedExport {
                                        span: export.span,
                                        specifiers: ids
                                            .into_iter()
                                            .map(|id| {
                                                let exported = Ident::new(
                                                    id.sym.clone(),
                                                    id.span.with_ctxt(info.export_ctxt()),
                                                );

                                                ExportNamedSpecifier {
                                                    span: DUMMY_SP,
                                                    orig: id,
                                                    exported: Some(exported),
                                                }
                                            })
                                            .map(ExportSpecifier::Named)
                                            .collect(),
                                        src: None,
                                        type_only: false,
                                    },
                                )));
                                continue;
                            }

                            Decl::TsInterface(_)
                            | Decl::TsTypeAlias(_)
                            | Decl::TsEnum(_)
                            | Decl::TsModule(_) => continue,
                        };

                        // Create `export { local_ident as exported_ident }`
                        let exported =
                            Ident::new(local.sym.clone(), local.span.with_ctxt(info.export_ctxt()));
                        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: local,
                            exported: Some(exported),
                        });
                        new.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                            NamedExport {
                                span: export.span,
                                specifiers: vec![specifier],
                                src: None,
                                type_only: false,
                            },
                        )));
                    }

                    _ => {
                        new.push(item);
                    }
                }
            }

            new
        });
    }

    pub(super) fn replace_import_specifiers(&self, info: &TransformedModule, module: &mut Modules) {
        let injected_ctxt = self.injected_ctxt;

        let mut vars = vec![];
        module.map_any_items(|stmts| {
            let mut new = Vec::with_capacity(stmts.len() + 32);

            for stmt in stmts {
                match &stmt {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                        for specifier in &import.specifiers {
                            match specifier {
                                ImportSpecifier::Named(named) => match &named.imported {
                                    Some(imported) => {
                                        vars.push(
                                            imported
                                                .clone()
                                                .assign_to(named.local.clone())
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "from_replace_import_specifiers",
                                                ),
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
                                        vars.push(
                                            imported
                                                .assign_to(default.local.clone())
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "from_replace_import_specifiers",
                                                ),
                                        );
                                        continue;
                                    }
                                }
                                ImportSpecifier::Namespace(s) => {
                                    if let Some((src, _)) = info
                                        .imports
                                        .specifiers
                                        .iter()
                                        .find(|s| s.0.src.value == import.src.value)
                                    {
                                        let esm_id =
                                            self.scope.wrapped_esm_id(src.module_id).expect(
                                                "If a namespace impoet specifier is preserved, it \
                                                 means failutre of deblobbing and as a result \
                                                 module should be marked as wrpaped esm",
                                            );
                                        vars.push(
                                            esm_id
                                                .clone()
                                                .assign_to(s.local.clone())
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "from_replace_import_specifiers: namespaced",
                                                ),
                                        );
                                        continue;
                                    }
                                }
                            }
                        }

                        // We should remove imports
                        continue;
                    }
                    _ => {}
                }

                new.push(stmt);
            }

            new
        });

        module.inject_all(vars)
    }

    /// If a dependency aliased exports, we handle them at here.
    pub(super) fn handle_import_deps(
        &self,
        ctx: &Ctx,
        info: &TransformedModule,
        module: &mut Modules,
        _for_circular: bool,
    ) {
        let injected_ctxt = self.injected_ctxt;

        self.replace_import_specifiers(info, module);

        let mut vars = vec![];

        for orig_stmt in module.iter_mut() {
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
                                        vars.push(ns.name.clone().assign_to(lhs).into_module_item(
                                            injected_ctxt,
                                            "import_deps_namespace",
                                        ));
                                    }
                                    ExportSpecifier::Default(default) => {
                                        let mut lhs = default.exported.clone();
                                        lhs.span = lhs.span.with_ctxt(info.export_ctxt());
                                        vars.push(
                                            default
                                                .exported
                                                .clone()
                                                .assign_to(lhs)
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "import_deps_default",
                                                ),
                                        );
                                    }
                                    ExportSpecifier::Named(named) => match &named.exported {
                                        Some(exported) => {
                                            if named.orig.span.ctxt != info.export_ctxt()
                                                && exported.sym != js_word!("default")
                                            {
                                                let mut lhs = exported.clone();
                                                lhs.span = lhs.span.with_ctxt(info.export_ctxt());
                                                vars.push(
                                                    named
                                                        .orig
                                                        .clone()
                                                        .assign_to(lhs)
                                                        .into_module_item(
                                                            injected_ctxt,
                                                            &format!(
                                                                "import_deps_named_alias of {}",
                                                                info.fm.name
                                                            ),
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
                                                        .into_module_item(
                                                            injected_ctxt,
                                                            &format!(
                                                                "import_deps: named without \
                                                                 alias: {}",
                                                                info.fm.name
                                                            ),
                                                        ),
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
                                    .into_module_item(
                                        injected_ctxt,
                                        "import_deps_export_default_decl",
                                    ),
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

                                vars.push(init.assign_to(export_name).into_module_item(
                                    injected_ctxt,
                                    "import_deps_export_default_decl_fn",
                                ));
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
                                    vars.push(ident.clone().assign_to(exported).into_module_item(
                                        injected_ctxt,
                                        "import_deps_export_decl",
                                    ));
                                }
                                Decl::Var(var) => {
                                    let ids: Vec<Ident> = find_ids(var);

                                    for id in ids {
                                        let mut exported = id.clone();
                                        exported.span.ctxt = info.export_ctxt();
                                        vars.push(id.assign_to(exported).into_module_item(
                                            injected_ctxt,
                                            "import_deps_export_var_decl",
                                        ));
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
                                .into_module_item(injected_ctxt, "import_deps_export_default_expr"),
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
            module.inject(var);
        }
    }
}

fn vars_from_exports(dep_info: &TransformedModule, module: &Modules) -> Vec<VarDeclarator> {
    // Convert all exports into variables in form of
    //
    // A__export = A__local

    let mut vars = vec![];

    for item in module.iter() {
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

/// Returns `Err(dep)` on error.
fn inject_es_module(
    entry: &mut Modules,
    dep: Modules,
    dep_export_ctxt: SyntaxContext,
    is_direct: bool,
) -> Result<(), Modules> {
    let injected_ctxt = entry.injected_ctxt;

    let mut vars = vec![];
    let mut dep = Some(dep);

    entry.map_any_items(|items| {
        if dep.is_none() {
            return items;
        }

        let mut buf = vec![];

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span, specifiers, ..
                })) if span.ctxt == dep_export_ctxt => {
                    if let Some(dep) = dep.take() {
                        buf.extend(dep.into_items());
                    }

                    if !is_direct {
                        let decls = specifiers
                            .iter()
                            .filter_map(|specifier| match specifier {
                                ImportSpecifier::Named(ImportNamedSpecifier {
                                    local,
                                    imported: Some(imported),
                                    ..
                                }) => {
                                    let mut imported = imported.clone();
                                    imported.span = imported.span.with_ctxt(dep_export_ctxt);

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
                            vars.push(var.into_module_item(injected_ctxt, "Es6ModuleInjector"));
                        }
                    }
                }

                _ => buf.push(item),
            }
        }

        buf
    });

    entry.inject_all(vars);

    match dep {
        Some(dep) => Err(dep),
        None => Ok(()),
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
