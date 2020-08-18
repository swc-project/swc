use crate::{
    bundler::{export::Exports, load::Specifier},
    id::{Id, ModuleId},
    load::Load,
    resolve::Resolve,
    Bundler,
};
use anyhow::{Context, Error};
use std::{
    borrow::Cow,
    collections::HashSet,
    mem::take,
    ops::{Deref, DerefMut},
};
use swc_atoms::{js_word, JsWord};
use swc_common::{Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, DestructuringFinder, StmtLike};
use swc_ecma_visit::{
    noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith, VisitWith,
};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Merge `targets` into `entry`.
    pub(super) fn merge_modules(
        &self,
        entry: ModuleId,
        is_entry: bool,
        targets: &mut Vec<ModuleId>,
    ) -> Result<Module, Error> {
        self.run(|| {
            let is_circular = self.scope.is_circular(entry);

            log::trace!(
                "merge_modules({}) <- {:?}; circular = {}",
                entry,
                targets,
                is_circular
            );

            let info = self.scope.get_module(entry).unwrap();
            if targets.is_empty() {
                return Ok((*info.module).clone());
            }

            if is_circular {
                log::info!("Circular dependency detected: ({})", info.fm.name);
                // TODO: provide only circular imports.
                return Ok(self.merge_circular_modules(entry, targets));
            }

            let mut entry: Module = (*info.module).clone();

            log::info!("Merge: ({}){} <= {:?}", info.id, info.fm.name, targets);

            self.merge_reexports(&mut entry, &info, targets)
                .context("failed to merge reepxorts")?;

            for (src, specifiers) in &info.imports.specifiers {
                if !targets.contains(&src.module_id) {
                    // Already merged by recursive call to merge_modules.
                    log::debug!(
                        "Not merging: already merged: ({}):{} <= ({}):{}",
                        info.id,
                        info.fm.name,
                        src.module_id,
                        src.src.value,
                    );

                    if let Some(imported) = self.scope.get_module(src.module_id) {
                        // Respan using imported module's syntax context.
                        entry.visit_mut_with(&mut LocalMarker {
                            mark: imported.mark(),
                            top_level_ctxt: SyntaxContext::empty().apply_mark(self.top_level_mark),
                            specifiers: &specifiers,
                            excluded: Default::default(),
                        });
                    }

                    // Drop imports, as they are already merged.
                    entry.body.retain(|item| {
                        match item {
                            ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                                // Drop if it's one of circular import
                                if info.imports.specifiers.iter().any(|v| {
                                    v.0.module_id == src.module_id && v.0.src == import.src
                                }) {
                                    log::debug!("Dropping es6 import as it's already merged");
                                    return false;
                                }
                            }
                            _ => {}
                        }

                        true
                    });

                    if self.config.require {
                        // Change require() call to load()
                        let dep = self.scope.get_module(src.module_id).unwrap();

                        self.merge_cjs(&mut entry, &info, Cow::Borrowed(&dep.module), dep.mark())?;
                    }

                    continue;
                }

                log::debug!("Merging: {} <= {}", info.fm.name, src.src.value);

                if specifiers.iter().any(|v| v.is_namespace()) {
                    unimplemented!(
                        "accessing namespace dependency with computed key: {} -> {}",
                        info.id,
                        src.module_id
                    )
                }
                if let Some(imported) = self.scope.get_module(src.module_id) {
                    info.helpers.extend(&imported.helpers);

                    if let Some(pos) = targets.iter().position(|x| *x == src.module_id) {
                        log::debug!("targets.remove({})", imported.fm.name);
                        targets.remove(pos);
                    }

                    // In the case of
                    //
                    //  a <- b
                    //  b <- c
                    //
                    // we change it to
                    //
                    // a <- b + chunk(c)
                    //
                    log::trace!(
                        "merging deps: {:?} <- {:?}; es6 = {}",
                        src,
                        targets,
                        info.is_es6
                    );
                    let mut dep = if imported.is_es6 {
                        self.merge_modules(src.module_id, false, targets)
                            .with_context(|| {
                                format!(
                                    "failed to merge: ({}):{} <= ({}):{}",
                                    info.id, info.fm.name, src.module_id, src.src.value
                                )
                            })?
                    } else {
                        (*self.scope.get_module(src.module_id).unwrap().module).clone()
                    };

                    if imported.is_es6 {
                        // print_hygiene("dep:before:tree-shaking", &self.cm, &dep);

                        // Tree-shaking
                        dep = self.drop_unused(dep, Some(&specifiers));

                        // print_hygiene("dep:after:tree-shaking", &self.cm, &dep);

                        if let Some(imports) = info
                            .imports
                            .specifiers
                            .iter()
                            .find(|(s, _)| s.module_id == imported.id)
                            .map(|v| &v.1)
                        {
                            dep = dep.fold_with(&mut ExportRenamer {
                                mark: imported.mark(),
                                _exports: &imported.exports,
                                imports: &imports,
                                extras: vec![],
                            });
                        }

                        dep = dep.fold_with(&mut Unexporter);

                        if !specifiers.is_empty() {
                            entry.visit_mut_with(&mut LocalMarker {
                                mark: imported.mark(),
                                top_level_ctxt: SyntaxContext::empty()
                                    .apply_mark(self.top_level_mark),
                                specifiers: &specifiers,
                                excluded: Default::default(),
                            });

                            // // Note: this does not handle `export default
                            // foo`
                            // dep = dep.fold_with(&mut LocalMarker {
                            //     mark: imported.mark(),
                            //     specifiers: &imported.exports.items,
                            // });
                        }

                        // print_hygiene("dep:before:global-mark", &self.cm, &dep);

                        // Replace import statement / require with module body
                        let mut injector = Es6ModuleInjector {
                            imported: take(&mut dep.body),
                            src: src.src.clone(),
                        };
                        entry.body.visit_mut_with(&mut injector);

                        // print_hygiene("entry:after:injection", &self.cm, &entry);

                        if injector.imported.is_empty() {
                            continue;
                        }
                        dep.body = take(&mut injector.imported);
                    }

                    if self.config.require {
                        self.merge_cjs(&mut entry, &info, Cow::Owned(dep), imported.mark())?;
                    }

                    // print_hygiene(
                    //     &format!("inject load: {}", imported.fm.name),
                    //     &self.cm,
                    //     &entry,
                    // );
                }
            }

            if is_entry && self.config.require && !targets.is_empty() {
                log::info!("Injectng remaining: {:?}", targets);

                // Handle transitive dependencies
                for target in targets.drain(..) {
                    log::trace!(
                        "Remaining: {}",
                        self.scope.get_module(target).unwrap().fm.name
                    );

                    let dep = self.scope.get_module(target).unwrap();
                    self.merge_cjs(&mut entry, &info, Cow::Borrowed(&dep.module), dep.mark())?;
                }
            }

            Ok(entry)
        })
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

/// Applied to dependency modules.
struct ExportRenamer<'a> {
    /// The mark applied to identifiers exported to dependant modules.
    mark: Mark,
    _exports: &'a Exports,
    /// Dependant module's import
    imports: &'a [Specifier],
    extras: Vec<Stmt>,
}

impl ExportRenamer<'_> {
    pub fn aliased_import(&self, sym: &JsWord) -> Option<Id> {
        log::debug!("aliased_import({})\n{:?}\n\n\n", sym, self.imports);

        self.imports.iter().find_map(|s| match s {
            Specifier::Specific {
                ref local,
                alias: Some(ref alias),
                ..
            } if *alias == *sym => Some(local.clone()),
            Specifier::Specific {
                ref local,
                alias: None,
                ..
            } if *local == *sym => Some(local.clone()),
            _ => None,
        })
    }
}

impl ExportRenamer<'_> {
    fn fold_stmt_like<T>(&mut self, items: Vec<T>) -> Vec<T>
    where
        T: FoldWith<Self> + StmtLike,
    {
        let mut buf = Vec::with_capacity(items.len() + 4);

        for item in items {
            let item = item.fold_with(self);
            buf.push(item);

            buf.extend(self.extras.drain(..).map(|v| T::from_stmt(v)))
        }

        buf
    }
}

impl Fold for ExportRenamer<'_> {
    noop_fold_type!();

    fn fold_class(&mut self, node: Class) -> Class {
        node
    }

    fn fold_function(&mut self, node: Function) -> Function {
        node
    }

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        let mut actual = ActualMarker {
            mark: self.mark,
            imports: self.imports,
        };

        let span = item.span();
        let item: ModuleItem = item.fold_children_with(self);

        match item {
            ModuleItem::Stmt(..) => return item,

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(e)) => {
                let ident = self.aliased_import(&js_word!("default"));

                return if let Some(ident) = ident {
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: e.span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(ident.replace_mark(self.mark).into_ident()),
                            init: Some(e.expr),
                            definite: false,
                        }],
                    }))
                    .into()
                } else {
                    log::debug!("Removing default export expression as it's not imported");

                    ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: e.span,
                        expr: e.expr,
                    }))
                };
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(e)) if e.src.is_none() => {
                let mut var_decls = Vec::with_capacity(e.specifiers.len());

                e.specifiers.into_iter().for_each(|specifier| {
                    let span = specifier.span();
                    let ident = match &specifier {
                        // TODO
                        ExportSpecifier::Namespace(s) => self.aliased_import(&s.name.sym),
                        ExportSpecifier::Default(..) => self.aliased_import(&js_word!("default")),
                        ExportSpecifier::Named(s) => {
                            if let Some(exported) = &s.exported {
                                self.aliased_import(&exported.sym)
                            } else {
                                self.aliased_import(&s.orig.sym)
                            }
                        }
                    };

                    if let Some(i) = ident {
                        let orig = match specifier {
                            // TODO
                            ExportSpecifier::Namespace(s) => s.name,
                            ExportSpecifier::Default(..) => Ident::new(js_word!("default"), span),
                            ExportSpecifier::Named(s) => s.orig,
                        };

                        var_decls.push(VarDeclarator {
                            span,
                            name: Pat::Ident(i.replace_mark(self.mark).into_ident()),
                            init: Some(Box::new(Expr::Ident(orig))),
                            definite: false,
                        })
                    } else {
                        log::debug!(
                            "Removing export specifier {:?} as it's not imported",
                            specifier
                        );
                    }
                });

                if !var_decls.is_empty() {
                    self.extras.push(Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: var_decls,
                    })))
                }

                return Stmt::Empty(EmptyStmt { span }).into();
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) => {
                //
                return match decl.decl {
                    Decl::TsInterface(_)
                    | Decl::TsTypeAlias(_)
                    | Decl::TsEnum(_)
                    | Decl::TsModule(_) => ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)),

                    Decl::Class(mut c) => {
                        c.ident = c.ident.fold_with(&mut actual);
                        Stmt::Decl(Decl::Class(c)).into()
                    }
                    Decl::Fn(mut f) => {
                        f.ident = f.ident.fold_with(&mut actual);
                        Stmt::Decl(Decl::Fn(f)).into()
                    }
                    Decl::Var(..) => {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl.fold_with(&mut actual)))
                    }
                };
            }

            _ => {}
        }

        item
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(items)
    }

    fn fold_stmts(&mut self, items: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(items)
    }
}

struct ActualMarker<'a> {
    mark: Mark,

    /// Dependant module's import
    imports: &'a [Specifier],
}

impl Fold for ActualMarker<'_> {
    noop_fold_type!();

    fn fold_expr(&mut self, node: Expr) -> Expr {
        node
    }

    fn fold_ident(&mut self, ident: Ident) -> Ident {
        if let Some(mut ident) = self.imports.iter().find_map(|s| match s {
            Specifier::Specific {
                alias: Some(alias),
                local,
            } if *alias == ident.sym => Some(Ident::new(local.sym().clone(), ident.span)),
            Specifier::Specific { alias: None, local } if *local == ident.sym => {
                Some(local.clone().into_ident())
            }
            _ => None,
        }) {
            ident.span = ident
                .span
                .with_ctxt(SyntaxContext::empty().apply_mark(self.mark));

            return ident;
        }

        ident
    }
}

/// Applied to the importer module, and marks (connects) imported idents.
pub(super) struct LocalMarker<'a> {
    /// Mark applied to imported idents.
    pub mark: Mark,
    /// Syntax context of the top level items.
    pub top_level_ctxt: SyntaxContext,
    pub specifiers: &'a [Specifier],
    pub excluded: HashSet<Id>,
}

impl<'a> LocalMarker<'a> {
    fn exclude<I>(&mut self, excluded_idents: &I) -> Excluder<'a, '_>
    where
        I: for<'any> VisitWith<DestructuringFinder<'any, Id>>,
    {
        let ids = find_ids(excluded_idents);

        self.excluded.extend(ids);
        Excluder { inner: self }
    }
}

struct Excluder<'a, 'b> {
    inner: &'b mut LocalMarker<'a>,
}

impl<'a, 'b> Deref for Excluder<'a, 'b> {
    type Target = LocalMarker<'a>;

    fn deref(&self) -> &Self::Target {
        &*self.inner
    }
}

impl<'a, 'b> DerefMut for Excluder<'a, 'b> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.inner
    }
}

impl VisitMut for LocalMarker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        let mut f = self.exclude(&node.param);
        node.body.visit_mut_with(&mut *f);
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        self.excluded.insert((&node.ident).into());
        node.class.visit_mut_with(self);
    }

    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        let mut f = self.exclude(&node.ident);
        node.class.visit_mut_with(&mut *f);
    }

    fn visit_mut_constructor(&mut self, node: &mut Constructor) {
        let mut f = self.exclude(&node.params);
        node.body.visit_mut_with(&mut *f);
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        self.excluded.insert((&node.ident).into());
        node.function.visit_mut_with(self);
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        let mut f = self.exclude(&node.ident);
        node.function.visit_mut_with(&mut *f);
    }

    fn visit_mut_function(&mut self, node: &mut Function) {
        let mut f = self.exclude(&node.params);
        node.body.visit_mut_with(&mut *f);
    }

    fn visit_mut_ident(&mut self, mut node: &mut Ident) {
        if node.span.ctxt != self.top_level_ctxt {
            return;
        }

        if self.excluded.contains(&(&*node).into()) {
            return;
        }

        // TODO: sym() => correct span
        if self.specifiers.iter().any(|id| *id.local() == *node) {
            node.span = node
                .span
                .with_ctxt(SyntaxContext::empty().apply_mark(self.mark));
            // dbg!(&node);
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

    fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
        let mut f = self.exclude(&node.param);
        node.body.visit_mut_with(&mut *f);
    }
}

struct Es6ModuleInjector {
    imported: Vec<ModuleItem>,
    src: Str,
}

impl VisitMut for Es6ModuleInjector {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { ref src, .. }))
                    if src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}
