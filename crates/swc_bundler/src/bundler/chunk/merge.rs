use std::sync::atomic::Ordering;

use anyhow::Error;
use indexmap::IndexSet;
use petgraph::EdgeDirection;
use swc_common::{
    collections::{AHashMap, AHashSet, ARandomState},
    sync::Lock,
    FileName, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helpers::Helpers;
use swc_ecma_utils::{find_pat_ids, prepend_stmt, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{VisitMut, VisitMutWith};
use EdgeDirection::Outgoing;

use crate::{
    bundler::{keywords::KeywordRenamer, load::TransformedModule},
    dep_graph::ModuleGraph,
    id::{Id, ModuleId},
    inline::inline,
    load::Load,
    modules::Modules,
    resolve::Resolve,
    util::{CloneMap, ExportMetadata, ExprExt, VarDeclaratorExt},
    Bundler, Hook, ModuleRecord,
};

pub(super) struct Ctx {
    /// Full dependency graph.
    pub graph: ModuleGraph,
    pub cycles: Vec<Vec<ModuleId>>,
    pub transitive_remap: CloneMap<SyntaxContext, SyntaxContext>,
    pub export_stars_in_wrapped: Lock<AHashMap<ModuleId, Vec<SyntaxContext>>>,
}

impl Ctx {
    pub fn is_exported_ctxt(
        &self,
        ctxt_to_check: SyntaxContext,
        entry_export_ctxt: SyntaxContext,
    ) -> bool {
        if ctxt_to_check == entry_export_ctxt {
            return true;
        }

        if let Some(v) = self.transitive_remap.get(&ctxt_to_check) {
            if v == ctxt_to_check {
                return false;
            }

            return self.is_exported_ctxt(v, entry_export_ctxt);
        }

        false
    }
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn get_for_merging(
        &self,
        ctx: &Ctx,
        id: ModuleId,
        is_entry: bool,
    ) -> Result<Modules, Error> {
        self.run(|| {
            let info = self
                .scope
                .get_module(id)
                .unwrap_or_else(|| unreachable!("Module {} is not registered", id));
            let mut module = self.apply_hooks(id, is_entry)?;
            module = self.prepare_for_merging(ctx, &info, module)?;

            if !is_entry {
                module = self.wrap_cjs_module(ctx, &info, module)?;
            }
            self.replace_cjs_require_calls(&info, &mut module, is_entry);

            Ok(module)
        })
    }

    /// This method sort modules.
    pub(super) fn merge_into_entry(
        &self,
        ctx: &Ctx,
        entry_id: ModuleId,
        entry: &mut Modules,
        all: &mut AHashMap<ModuleId, Modules>,
    ) {
        self.run(|| {
            let injected_ctxt = self.injected_ctxt;

            let entry_info = self.scope.get_module(entry_id).unwrap();

            let all_deps_of_entry =
                self.collect_all_deps(&ctx.graph, entry_id, &mut Default::default());

            tracing::debug!("Merging dependencies: {:?}", all_deps_of_entry);

            let deps = all_deps_of_entry.iter().map(|id| {
                let dep_info = self.scope.get_module(*id).unwrap();
                entry_info.helpers.extend(&dep_info.helpers);

                {
                    let helpers = *entry_info.swc_helpers.lock();
                    let dep_helpers = *dep_info.swc_helpers.lock();

                    let helpers = Helpers::from_data(helpers);
                    let dep_helpers = Helpers::from_data(dep_helpers);

                    helpers.extend_from(&dep_helpers);

                    *entry_info.swc_helpers.lock() = helpers.data();
                }

                if *id == entry_id {
                    return Modules::empty(injected_ctxt);
                }

                all.remove(id).unwrap_or_else(|| {
                    unreachable!(
                        "failed to merge into {}: module {} does not exist in the map",
                        entry_id, id
                    )
                })
            });

            for dep in deps {
                entry.add_dep(dep);
            }

            self.replace_import_specifiers(&entry_info, entry);
            self.finalize_merging_of_entry(ctx, entry_id, entry);
            self.remove_wrong_exports(ctx, &entry_info, entry);
        })
    }

    #[allow(clippy::only_used_in_recursion)]
    fn collect_all_deps(
        &self,
        graph: &ModuleGraph,
        start: ModuleId,
        dejavu: &mut AHashSet<ModuleId>,
    ) -> IndexSet<ModuleId, ARandomState> {
        let mut set = IndexSet::default();

        for dep in graph.neighbors_directed(start, Outgoing) {
            if !dejavu.insert(dep) {
                continue;
            }
            set.insert(dep);
            set.extend(self.collect_all_deps(graph, dep, dejavu));
        }

        set
    }

    pub(crate) fn apply_hooks(
        &self,
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

            let module = Modules::from(module_id, entry, self.injected_ctxt);

            Ok(module)
        })
    }

    /// This should only be called after everything is merged.
    ///
    /// This method does not care about orders of statement, and it's expected
    /// to be called before `sort`.
    fn inject_reexports(&self, ctx: &Ctx, _entry_id: ModuleId, entry: &mut Modules) {
        // dbg!(&ctx.transitive_remap);
        let injected_ctxt = self.injected_ctxt;

        {
            // Handle `export *` for non-wrapped modules.

            let mut vars = Vec::new();
            /// We recurse if `export *` is nested.
            fn add_var(
                injected_ctxt: SyntaxContext,
                vars: &mut Vec<(ModuleId, ModuleItem)>,
                declared: &mut AHashSet<Id>,
                map: &CloneMap<SyntaxContext, SyntaxContext>,
                module_id: ModuleId,
                id: Id,
            ) {
                let remapped = match map.get(&id.ctxt()) {
                    Some(v) => v,
                    _ => return,
                };
                if remapped == id.ctxt() {
                    return;
                }
                let reexported = id.clone().with_ctxt(remapped);

                add_var(
                    injected_ctxt,
                    vars,
                    declared,
                    map,
                    module_id,
                    reexported.clone(),
                );

                if !declared.insert(reexported.clone()) {
                    return;
                }

                vars.push((
                    module_id,
                    id.assign_to(reexported)
                        .into_module_item(injected_ctxt, "export_star_replacer"),
                ));
            }

            // We have to exclude some ids because there are already declared.
            // See https://github.com/denoland/deno/issues/8725
            //
            // Let's say D is a dependency which contains export * from './foo';
            // If an user import and export from D, the transitive syntax context map
            // contains a entry from D to foo because it's reexported and
            // the variable (reexported from D) exist because it's imported.
            let mut declared_ids = AHashSet::<_>::default();

            for (_, stmt) in entry.iter() {
                if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) = stmt {
                    if decl.ctxt == injected_ctxt {
                        let ids: Vec<Id> = find_pat_ids(decl);
                        declared_ids.extend(ids);
                    }
                }
            }

            for (module_id, stmt) in entry.iter() {
                match stmt {
                    ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                        for s in &export.specifiers {
                            match s {
                                ExportSpecifier::Namespace(_) => {}
                                ExportSpecifier::Default(_) => {}
                                ExportSpecifier::Named(named) => {
                                    if let Some(exported) = &named.exported {
                                        let exported = match exported {
                                            ModuleExportName::Ident(ident) => ident,
                                            ModuleExportName::Str(..) => {
                                                unimplemented!("module string names unimplemented")
                                            }
                                        };

                                        let id: Id = exported.into();
                                        if declared_ids.contains(&id) {
                                            continue;
                                        }

                                        match &named.orig {
                                            ModuleExportName::Ident(orig) => {
                                                vars.push((
                                                    module_id,
                                                    orig.clone()
                                                        .assign_to(exported.clone())
                                                        .into_module_item(
                                                            injected_ctxt,
                                                            "finalize -> export to var",
                                                        ),
                                                ));
                                            }
                                            ModuleExportName::Str(..) => {
                                                unimplemented!("module string names unimplemented")
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) => {
                        let ids: Vec<Id> = find_pat_ids(decl);

                        for id in ids {
                            if *id.sym() == "default" {
                                continue;
                            }

                            add_var(
                                injected_ctxt,
                                &mut vars,
                                &mut declared_ids,
                                &ctx.transitive_remap,
                                module_id,
                                id,
                            );
                        }
                    }

                    _ => {}
                }
            }

            entry.append_all(vars);
        }

        {
            let mut map = ctx.export_stars_in_wrapped.lock();
            let mut additional_props = AHashMap::<_, Vec<_>>::default();
            // Handle `export *` for wrapped modules.
            for (module_id, ctxts) in map.drain() {
                for (_, stmt) in entry.iter() {
                    if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))) = stmt {
                        let ids: Vec<Id> = find_pat_ids(decl);

                        for id in ids {
                            if *id.sym() == "default" {
                                continue;
                            }

                            if ctxts.contains(&id.ctxt()) {
                                additional_props.entry(module_id).or_default().push(
                                    PropOrSpread::Prop(Box::new(Prop::Shorthand(id.into_ident()))),
                                );
                            }
                        }
                    }
                }
            }

            for (module_id, props) in additional_props {
                let id = match self.scope.wrapped_esm_id(module_id) {
                    Some(v) => v,
                    None => continue,
                };

                for (_, stmt) in entry.iter_mut() {
                    let var = match stmt {
                        ModuleItem::Stmt(Stmt::Decl(Decl::Var(var)))
                            if matches!(
                                &**var,
                                VarDecl {
                                    kind: VarDeclKind::Const,
                                    ..
                                }
                            ) =>
                        {
                            var
                        }
                        _ => continue,
                    };

                    if var.decls.len() != 1 {
                        continue;
                    }

                    let var_decl = &mut var.decls[0];
                    match &var_decl.name {
                        Pat::Ident(i) if id == i.id => {}
                        _ => continue,
                    }

                    let callee = match &mut var_decl.init {
                        Some(init) => match &mut **init {
                            Expr::Call(CallExpr { callee, .. }) => match callee {
                                Callee::Super(_) | Callee::Import(_) => continue,
                                Callee::Expr(v) => v,
                            },
                            Expr::Await(AwaitExpr { arg, .. }) => match &mut **arg {
                                Expr::Call(CallExpr { callee, .. }) => match callee {
                                    Callee::Super(_) | Callee::Import(_) => continue,
                                    Callee::Expr(v) => v,
                                },
                                _ => continue,
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

    fn finalize_merging_of_entry(&self, ctx: &Ctx, id: ModuleId, entry: &mut Modules) {
        tracing::trace!("All modules are merged");

        tracing::debug!("Injecting reexports");
        self.inject_reexports(ctx, id, entry);

        // entry.print(&self.cm, "before inline");

        tracing::debug!("Inlining injected variables");

        inline(self.injected_ctxt, entry);

        entry.sort(id, &ctx.graph, &ctx.cycles, &self.cm);

        // crate::debug::print_hygiene("done", &self.cm, &entry.clone().into());

        entry.retain_mut(|_, item| {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export)) => {
                    if self.config.external_modules.contains(&export.src.value) {
                        return true;
                    }

                    return false;
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                    if let Some(src) = &export.src {
                        if self.config.external_modules.contains(&src.value) {
                            return true;
                        }
                    }

                    export
                        .specifiers
                        .retain(|s| !matches!(s, ExportSpecifier::Namespace(_)));

                    export.src = None;
                }

                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    if self.config.external_modules.contains(&import.src.value) {
                        return true;
                    }

                    // Drop import statements.
                    return false;
                }

                _ => {}
            }

            true
        });

        tracing::debug!("Renaming keywords");

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

    /// Remove exports with wrong syntax context
    fn remove_wrong_exports(&self, ctx: &Ctx, info: &TransformedModule, module: &mut Modules) {
        tracing::debug!("Removing wrong exports");

        let item_count = module.iter().count();
        tracing::trace!("Item count = {}", item_count);

        module.retain_mut(|_, item| {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                specifiers, ..
            })) = item
            {
                specifiers.retain(|s| match s {
                    ExportSpecifier::Named(ExportNamedSpecifier {
                        exported: Some(exported),
                        ..
                    }) => {
                        let exported = match exported {
                            ModuleExportName::Ident(ident) => ident,
                            ModuleExportName::Str(..) => {
                                unimplemented!("module string names unimplemented")
                            }
                        };
                        // Default is not exported via `export *`
                        if &*exported.sym == "default" {
                            exported.ctxt == info.export_ctxt()
                        } else {
                            ctx.is_exported_ctxt(exported.ctxt, info.export_ctxt())
                        }
                    }
                    _ => true,
                });

                if specifiers.is_empty() {
                    return false;
                }
            }

            true
        });

        tracing::debug!("Removed wrong exports");
    }

    /// This method handles imports and exports.
    ///
    ///
    /// Basically one module have two top-level contexts. One is for it's codes
    /// and another is for exporting. This method connects two module by
    /// injecting `const local_A = exported_B_from_foo;`
    ///
    ///
    /// We convert all exports to variable at here.
    pub(super) fn prepare_for_merging(
        &self,
        ctx: &Ctx,
        info: &TransformedModule,
        mut module: Modules,
    ) -> Result<Modules, Error> {
        self.handle_imports_and_exports(ctx, info, &mut module);

        let wrapped = self.scope.should_be_wrapped_with_a_fn(info.id);
        if wrapped {
            module = self.wrap_esm(ctx, info.id, module)?;
        }

        Ok(module)
    }

    fn handle_imports_and_exports(
        &self,
        ctx: &Ctx,
        info: &TransformedModule,
        module: &mut Modules,
    ) {
        let injected_ctxt = self.injected_ctxt;

        if !info.is_es6 {
            return;
        }

        let mut extra = Vec::new();

        module.map_any_items(|_, items| {
            let mut new = Vec::with_capacity(items.len() * 11 / 10);

            for item in items {
                match item {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(mut import)) => {
                        // Preserve imports from node.js builtin modules.
                        if self.config.external_modules.contains(&import.src.value) {
                            new.push(import.into());
                            continue;
                        }

                        if let Some((src, _)) = info
                            .imports
                            .specifiers
                            .iter()
                            .find(|s| s.0.src.value == import.src.value)
                        {
                            if !self.scope.get_module(src.module_id).unwrap().is_es6 {
                                new.push(import.into());
                                continue;
                            }
                        }

                        // Imports are easy to handle.
                        for s in &import.specifiers {
                            match s {
                                ImportSpecifier::Named(s) => {
                                    if let Some(imported) = &s.imported {
                                        let imported = match imported {
                                            ModuleExportName::Ident(ident) => ident,
                                            ModuleExportName::Str(..) => {
                                                unimplemented!("module string names unimplemented")
                                            }
                                        };
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
                                }
                                ImportSpecifier::Default(s) => {
                                    new.push(
                                        Ident::new(
                                            "default".into(),
                                            import.span,
                                            ExportMetadata::decode(import.with.as_deref())
                                                .export_ctxt
                                                .unwrap(),
                                        )
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
                                                "If a namespace import specifier is preserved, it \
                                                 means failure of deblobbing and as a result \
                                                 module should be marked as wrapped esm",
                                            );
                                        new.push(
                                            esm_id
                                                .clone()
                                                .assign_to(s.local.clone())
                                                .into_module_item(
                                                    injected_ctxt,
                                                    "prepare -> import -> namespace",
                                                ),
                                        );
                                    }
                                }
                            }
                        }

                        import.specifiers.clear();
                        new.push(import.into());
                    }
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                        // At here, we create multiple items.
                        //
                        // One item is `const local_default = expr` and another one is
                        // `export { local_default as default }`.
                        //
                        // To allow using identifier of the declaration in the original module, we
                        // create `const local_default = orig_ident` if original identifier exists.

                        let local = Ident::new("default".into(), DUMMY_SP, info.local_ctxt());

                        match export.decl {
                            DefaultDecl::Class(c) => {
                                //
                                match c.ident {
                                    Some(ident) => {
                                        new.push(
                                            ClassDecl {
                                                ident: ident.clone(),
                                                class: c.class,
                                                declare: false,
                                            }
                                            .into(),
                                        );

                                        new.push(ident.assign_to(local.clone()).into_module_item(
                                            injected_ctxt,
                                            "prepare -> export default decl -> class -> with ident",
                                        ))
                                    }
                                    None => {
                                        let init = c;
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
                                        new.push(
                                            FnDecl {
                                                ident: ident.clone(),
                                                function: f.function,
                                                declare: false,
                                            }
                                            .into(),
                                        );

                                        new.push(ident.assign_to(local.clone()).into_module_item(
                                            injected_ctxt,
                                            "prepare -> export default decl -> function -> with \
                                             ident",
                                        ))
                                    }
                                    None => {
                                        // We should inject a function declaration because of
                                        // dependencies.
                                        //
                                        // See: https://github.com/denoland/deno/issues/9346
                                        let ident = private_ident!("default");
                                        new.push(
                                            FnDecl {
                                                ident: ident.clone(),
                                                function: f.function,
                                                declare: false,
                                            }
                                            .into(),
                                        );

                                        new.push(ident.assign_to(local.clone()).into_module_item(
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
                        tracing::trace!(
                            "Exporting `default` with `export default decl` ({})",
                            local.sym
                        );

                        let exported = Ident::new("default".into(), DUMMY_SP, info.export_ctxt());

                        new.push(
                            local
                                .clone()
                                .assign_to(exported.clone())
                                .into_module_item(injected_ctxt, "prepare -> export default decl"),
                        );

                        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: ModuleExportName::Ident(local),
                            exported: Some(ModuleExportName::Ident(exported)),
                            is_type_only: false,
                        });
                        extra.push(
                            NamedExport {
                                span: export.span,
                                specifiers: vec![specifier],
                                src: None,
                                type_only: false,
                                with: Some(
                                    ExportMetadata {
                                        injected: true,
                                        ..Default::default()
                                    }
                                    .into_with(),
                                ),
                            }
                            .into(),
                        );
                    }

                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                        // At here, we create two items.
                        //
                        // One item is `const local_default = expr` and the
                        // other is `export { local_default as default }`.

                        // TODO: Check if we really need this.

                        let local = Ident::new("default".into(), DUMMY_SP, info.local_ctxt());

                        // Create `const local_default = expr`
                        new.push(
                            export
                                .expr
                                .assign_to(local.clone())
                                .into_module_item(injected_ctxt, "prepare -> export default expr"),
                        );

                        let exported = Ident::new("default".into(), DUMMY_SP, info.export_ctxt());

                        new.push(
                            local
                                .clone()
                                .assign_to(exported.clone())
                                .into_module_item(injected_ctxt, "prepare -> export default expr"),
                        );

                        // Create `export { local_default as default }`
                        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: ModuleExportName::Ident(local),
                            exported: Some(ModuleExportName::Ident(exported)),
                            is_type_only: false,
                        });
                        tracing::trace!("Exporting `default` with `export default expr`");
                        extra.push(
                            NamedExport {
                                span: export.span,
                                specifiers: vec![specifier],
                                src: None,
                                type_only: false,
                                with: Some(
                                    ExportMetadata {
                                        injected: true,
                                        ..Default::default()
                                    }
                                    .into_with(),
                                ),
                            }
                            .into(),
                        );
                    }

                    ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) => {
                        // Idea is almost same as above. But we uses symbol of the declaration
                        // instead of using `default`.

                        let local = match export.decl {
                            Decl::Class(c) => {
                                let i = c.ident.clone();
                                new.push(c.into());

                                i
                            }
                            Decl::Fn(f) => {
                                let i = f.ident.clone();
                                new.push(f.into());

                                i
                            }
                            Decl::Var(v) => {
                                let ids: Vec<Ident> = find_pat_ids(&v);
                                //

                                new.push(v.into());

                                let export = NamedExport {
                                    span: export.span,
                                    specifiers: ids
                                        .into_iter()
                                        .map(|id| {
                                            let exported = Ident::new(
                                                id.sym.clone(),
                                                id.span,
                                                info.export_ctxt(),
                                            );

                                            tracing::trace!(
                                                "Exporting `{}{:?}` with `export decl`",
                                                id.sym,
                                                id.ctxt
                                            );

                                            new.push(
                                                id.clone()
                                                    .assign_to(exported.clone())
                                                    .into_module_item(
                                                        injected_ctxt,
                                                        "prepare -> export decl -> var",
                                                    ),
                                            );

                                            ExportNamedSpecifier {
                                                span: DUMMY_SP,
                                                orig: ModuleExportName::Ident(id),
                                                exported: Some(ModuleExportName::Ident(exported)),
                                                is_type_only: false,
                                            }
                                        })
                                        .map(ExportSpecifier::Named)
                                        .collect(),
                                    src: None,
                                    type_only: false,
                                    with: Some(
                                        ExportMetadata {
                                            injected: true,
                                            ..Default::default()
                                        }
                                        .into_with(),
                                    ),
                                }
                                .into();
                                extra.push(export);
                                continue;
                            }

                            Decl::TsInterface(_)
                            | Decl::TsTypeAlias(_)
                            | Decl::TsEnum(_)
                            | Decl::TsModule(_)
                            | Decl::Using(..) => continue,
                        };

                        tracing::trace!(
                            "Exporting `default` with `export default decl` ({})",
                            local.sym
                        );

                        // Create `export { local_ident as exported_ident }`
                        let exported =
                            Ident::new(local.sym.clone(), local.span, info.export_ctxt());

                        new.push(
                            local
                                .clone()
                                .assign_to(exported.clone())
                                .into_module_item(injected_ctxt, "prepare -> export decl -> var"),
                        );

                        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: ModuleExportName::Ident(local),
                            exported: Some(ModuleExportName::Ident(exported)),
                            is_type_only: false,
                        });

                        extra.push(
                            NamedExport {
                                span: export.span,
                                specifiers: vec![specifier],
                                src: None,
                                type_only: false,
                                with: Some(
                                    ExportMetadata {
                                        injected: true,
                                        ..Default::default()
                                    }
                                    .into_with(),
                                ),
                            }
                            .into(),
                        );
                    }

                    ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                        ref specifiers,
                        ref src,
                        ..
                    })) => {
                        if let Some(export_src) = src {
                            if let Some((src, _)) = info
                                .exports
                                .reexports
                                .iter()
                                .find(|s| s.0.src.value == export_src.value)
                            {
                                let dep = self.scope.get_module(src.module_id).unwrap();
                                if !dep.is_es6 {
                                    dep.helpers.require.store(true, Ordering::SeqCst);

                                    let mut vars = Vec::new();
                                    let mod_var = private_ident!("_cjs_module_");

                                    vars.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: mod_var.clone().into(),
                                        init: Some(
                                            CallExpr {
                                                span: DUMMY_SP,
                                                callee: Ident::new(
                                                    "load".into(),
                                                    DUMMY_SP,
                                                    dep.export_ctxt(),
                                                )
                                                .as_callee(),
                                                ..Default::default()
                                            }
                                            .into(),
                                        ),
                                        definite: Default::default(),
                                    });
                                    for s in specifiers {
                                        match s {
                                            ExportSpecifier::Namespace(s) => {
                                                match &s.name {
                                                    ModuleExportName::Ident(name) => {
                                                        vars.push(VarDeclarator {
                                                            span: s.span,
                                                            name: name.clone().into(),
                                                            init: Some(mod_var.clone().into()),
                                                            definite: Default::default(),
                                                        });
                                                    }
                                                    ModuleExportName::Str(..) => {
                                                        unimplemented!(
                                                            "module string names unimplemented"
                                                        )
                                                    }
                                                };
                                            }
                                            ExportSpecifier::Default(s) => {
                                                vars.push(VarDeclarator {
                                                    span: DUMMY_SP,
                                                    name: s.exported.clone().into(),
                                                    init: Some(
                                                        mod_var
                                                            .clone()
                                                            .make_member(quote_ident!("default"))
                                                            .into(),
                                                    ),
                                                    definite: Default::default(),
                                                });
                                            }
                                            ExportSpecifier::Named(s) => {
                                                let exp = s.exported.clone();
                                                let exported = match exp {
                                                    Some(ModuleExportName::Ident(ident)) => {
                                                        Some(ident)
                                                    }
                                                    Some(ModuleExportName::Str(..)) => {
                                                        unimplemented!(
                                                            "module string names unimplemented"
                                                        )
                                                    }
                                                    _ => None,
                                                };
                                                let orig = match &s.orig {
                                                    ModuleExportName::Ident(ident) => ident,
                                                    _ => unimplemented!(
                                                        "module string names unimplemented"
                                                    ),
                                                };
                                                vars.push(VarDeclarator {
                                                    span: s.span,
                                                    name: exported.clone().unwrap().into(),
                                                    init: Some(
                                                        mod_var
                                                            .clone()
                                                            .make_member(orig.clone().into())
                                                            .into(),
                                                    ),
                                                    definite: Default::default(),
                                                });
                                            }
                                        }
                                    }

                                    if !vars.is_empty() {
                                        new.push(
                                            VarDecl {
                                                span: DUMMY_SP,
                                                kind: VarDeclKind::Const,
                                                declare: Default::default(),
                                                decls: vars,
                                                ..Default::default()
                                            }
                                            .into(),
                                        );
                                    }
                                    continue;
                                }
                            }
                        }

                        for s in specifiers {
                            match s {
                                ExportSpecifier::Named(ExportNamedSpecifier {
                                    orig,
                                    exported: Some(exported),
                                    ..
                                }) => {
                                    let exported_ident = match exported {
                                        ModuleExportName::Ident(ident) => ident,
                                        ModuleExportName::Str(..) => {
                                            unimplemented!("module string names unimplemented")
                                        }
                                    };
                                    let orig_ident = match orig {
                                        ModuleExportName::Ident(ident) => ident,
                                        _ => unimplemented!("module string names unimplemented"),
                                    };
                                    new.push(
                                        orig_ident
                                            .clone()
                                            .assign_to(exported_ident.clone())
                                            .into_module_item(
                                                injected_ctxt,
                                                "prepare -> export named -> aliased",
                                            ),
                                    );
                                }

                                ExportSpecifier::Default(ExportDefaultSpecifier {
                                    exported,
                                    ..
                                }) => {
                                    new.push(
                                        Ident::new("default".into(), DUMMY_SP, info.local_ctxt())
                                            .clone()
                                            .assign_to(exported.clone())
                                            .into_module_item(
                                                injected_ctxt,
                                                "prepare -> export named -> aliased",
                                            ),
                                    );
                                }

                                ExportSpecifier::Namespace(ns) => {
                                    if let Some((src, _)) = info
                                        .exports
                                        .reexports
                                        .iter()
                                        .find(|s| s.0.src.value == src.as_ref().unwrap().value)
                                    {
                                        match &ns.name {
                                            ModuleExportName::Ident(name) => {
                                                if !self
                                                    .scope
                                                    .get_module(src.module_id)
                                                    .unwrap()
                                                    .is_es6
                                                {
                                                    continue;
                                                }

                                                let wrapped_esm_id =
                                                    self.scope.wrapped_esm_id(src.module_id);
                                                match wrapped_esm_id {
                                                    Some(module_var) => {
                                                        // Create variable for the namespaced
                                                        // export.
                                                        extra.push(
                                                            module_var
                                                                .clone()
                                                                .assign_to(name.clone())
                                                                .into_module_item(
                                                                    injected_ctxt,
                                                                    "prepare -> namespaced \
                                                                     reexport",
                                                                ),
                                                        );
                                                        let specifier = ExportSpecifier::Named(
                                                            ExportNamedSpecifier {
                                                                span: ns.span,
                                                                orig: ModuleExportName::Ident(
                                                                    module_var.into(),
                                                                ),
                                                                exported: Some(ns.name.clone()),
                                                                is_type_only: false,
                                                            },
                                                        );
                                                        extra.push(
                                                            NamedExport {
                                                                span: ns.span,
                                                                specifiers: vec![specifier],
                                                                src: None,
                                                                with: None,
                                                                type_only: false,
                                                            }
                                                            .into(),
                                                        );
                                                    }
                                                    None => {
                                                        unreachable!(
                                                            "Modules reexported with `export * as \
                                                             foo from './foo'` should be marked \
                                                             as a wrapped esm"
                                                        )
                                                    }
                                                }

                                                // Remove `export * as foo from ''`
                                                continue;
                                            }
                                            ModuleExportName::Str(..) => {
                                                unimplemented!("module string names unimplemented")
                                            }
                                        }
                                    }
                                }
                                _ => {}
                            }
                        }

                        new.push(item);
                    }

                    ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export)) => {
                        let metadata = ExportMetadata::decode(export.with.as_deref());

                        if let Some(export_ctxt) = metadata.export_ctxt {
                            let reexport = self.scope.get_module(info.id).unwrap().export_ctxt();
                            ctx.transitive_remap.insert(export_ctxt, reexport);
                        }

                        new.push(item);
                    }

                    _ => {
                        new.push(item);
                    }
                }
            }

            new
        });

        for item in extra {
            module.append(info.id, item);
        }

        // module.print(&self.cm, "prepare");
    }

    pub(super) fn replace_import_specifiers(&self, info: &TransformedModule, module: &mut Modules) {
        let injected_ctxt = self.injected_ctxt;

        let mut vars = Vec::new();
        module.map_any_items(|module_id, stmts| {
            let mut new = Vec::with_capacity(stmts.len() + 32);

            for stmt in stmts {
                if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = &stmt {
                    if self.config.external_modules.contains(&import.src.value) {
                        new.push(stmt);
                        continue;
                    }

                    for specifier in &import.specifiers {
                        match specifier {
                            ImportSpecifier::Named(named) => {
                                if let Some(imported) = &named.imported {
                                    let imporeted_ident = match imported {
                                        ModuleExportName::Ident(ident) => ident,
                                        ModuleExportName::Str(..) => {
                                            unimplemented!("module string names unimplemented")
                                        }
                                    };
                                    vars.push((
                                        module_id,
                                        imporeted_ident
                                            .clone()
                                            .assign_to(named.local.clone())
                                            .into_module_item(
                                                injected_ctxt,
                                                "from_replace_import_specifiers",
                                            ),
                                    ));
                                    continue;
                                }
                            }
                            ImportSpecifier::Default(default) => {
                                if let Some((src, _)) = info
                                    .imports
                                    .specifiers
                                    .iter()
                                    .find(|s| s.0.src.value == import.src.value)
                                {
                                    let imported =
                                        Ident::new("default".into(), DUMMY_SP, src.export_ctxt);
                                    vars.push((
                                        module_id,
                                        imported.assign_to(default.local.clone()).into_module_item(
                                            injected_ctxt,
                                            "from_replace_import_specifiers",
                                        ),
                                    ));
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
                                    let esm_id = self.scope.wrapped_esm_id(src.module_id).expect(
                                        "If a namespace import specifier is preserved, it means \
                                         failure of deblobbing and as a result module should be \
                                         marked as wrapped esm",
                                    );
                                    vars.push((
                                        module_id,
                                        esm_id.clone().assign_to(s.local.clone()).into_module_item(
                                            injected_ctxt,
                                            "from_replace_import_specifiers: namespaced",
                                        ),
                                    ));
                                    continue;
                                }
                            }
                        }
                    }

                    // We should remove imports
                    continue;
                }

                new.push(stmt);
            }

            new
        });

        module.append_all(vars)
    }
}

struct ImportMetaHandler<'a, 'b> {
    file: &'a FileName,
    #[allow(clippy::borrowed_box)]
    hook: &'a Box<dyn 'b + Hook>,
    is_entry: bool,
    inline_ident: Ident,
    occurred: bool,
    /// TODO: Use this
    #[allow(dead_code)]
    err: Option<Error>,
}

impl VisitMut for ImportMetaHandler<'_, '_> {
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::MetaProp(MetaPropExpr {
            kind: MetaPropKind::ImportMeta,
            ..
        }) = e
        {
            *e = self.inline_ident.clone().into();
            self.occurred = true;
        }
    }

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
                    prepend_stmt(
                        &mut n.body,
                        VarDecl {
                            span: n.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: n.span,
                                name: Pat::Ident(self.inline_ident.clone().into()),
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
                            ..Default::default()
                        }
                        .into(),
                    );
                }
                Err(err) => self.err = Some(err),
            }
        }
    }
}
