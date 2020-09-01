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
    util::IntoParallelIterator,
    Bundler,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use remark::RemarkIdents;
use std::{borrow::Cow, collections::HashMap, mem::take};
use swc_atoms::{js_word, JsWord};
use swc_common::{Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};

mod remark;

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

            print_hygiene("entry:clone", &self.cm, &entry);

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

            let deps = to_merge
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
                                        Specifier::Namespace { local, all: true } => Some(local),
                                        _ => None,
                                    })
                                    .unwrap();

                                dep = self.wrap_esm_as_a_var(
                                    &dep_info,
                                    dep,
                                    id.clone().replace_mark(dep_info.mark()).into_ident(),
                                )?;

                            // print_hygiene("dep:after wrapping esm", &self.cm,
                            // &dep);
                            } else {
                                let is_namespace = specifiers.iter().any(|s| match s {
                                    Specifier::Namespace { .. } => true,
                                    _ => false,
                                });
                                dbg!(is_namespace);

                                if !is_namespace {
                                    // Tree-shaking
                                    dep = self.drop_unused(dep, Some(&specifiers));
                                }

                                print_hygiene("dep: after tree shaking", &self.cm, &dep);

                                if let Some(imports) = info
                                    .imports
                                    .specifiers
                                    .iter()
                                    .find(|(s, _)| s.module_id == dep_info.id)
                                    .map(|v| &v.1)
                                {
                                    let mut v = ExportRenamer {
                                        dep_mark: dep_info.mark(),
                                        imports: &imports,
                                        extras: vec![],
                                        remark_map: Default::default(),
                                    };
                                    dep = dep.fold_with(&mut v);
                                    print_hygiene("dep: after renaming exports", &self.cm, &dep);

                                    dbg!(&v.remark_map);

                                    // Swap syntax context. Although name is remark, it's actually
                                    // swapping because ExportRenamer inserts two-side conversion
                                    // rule.
                                    if !v.remark_map.is_empty() {
                                        dep.visit_mut_with(&mut RemarkIdents { map: v.remark_map });

                                        print_hygiene("dep: after remarking", &self.cm, &dep);
                                    }
                                }

                                dep = dep.fold_with(&mut Unexporter);
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

                            print_hygiene("dep:before-injection", &self.cm, &dep);
                        }
                        print_hygiene("dep:before-injection", &self.cm, &dep);

                        Ok((src, dep, dep_info))
                    })
                })
                .collect::<Vec<_>>();

            let mut targets = module_plan.chunks.clone();

            for dep in deps {
                let (src, mut dep, dep_info) = dep?;
                if let Some(idx) = targets.iter().position(|v| *v == src.module_id) {
                    targets.remove(idx);
                    if let Some(v) = plan.normal.get(&src.module_id) {
                        targets.retain(|&id| !v.chunks.contains(&id));
                    }
                    if let Some(v) = plan.circular.get(&src.module_id) {
                        targets.retain(|&id| !v.chunks.contains(&id));
                    }
                }

                if dep_info.is_es6 {
                    // Replace import statement / require with module body
                    let mut injector = Es6ModuleInjector {
                        imported: take(&mut dep.body),
                        src: src.src.clone(),
                    };
                    entry.body.visit_mut_with(&mut injector);

                    print_hygiene("entry:after:injection", &self.cm, &entry);

                    if injector.imported.is_empty() {
                        log::debug!("Merged {} as an es module", info.fm.name);
                        // print_hygiene("ES6", &self.cm, &entry);
                        log::debug!("Merged {} as an es6 module", info.fm.name);
                        print_hygiene("ES6", &self.cm, &entry);
                        continue;
                    }
                    dep.body = take(&mut injector.imported);
                }

                if self.config.require {
                    self.merge_cjs(
                        plan,
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

/// Applied to dependency modules.
struct ExportRenamer<'a> {
    /// The mark applied to identifiers exported to dependant modules.
    dep_mark: Mark,
    remark_map: HashMap<Id, SyntaxContext>,

    /// Dependant module's import
    imports: &'a [Specifier],
    extras: Vec<Stmt>,
}

impl ExportRenamer<'_> {
    fn mark_as_remarking_required(&mut self, id: Id) -> SyntaxContext {
        let ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
        self.remark_map.insert((id.0.clone(), ctxt), id.1);
        ctxt
    }

    fn aliased_import(&self, sym: &JsWord) -> Option<Id> {
        self.imports
            .iter()
            .find_map(|s| match s {
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
            .map(|v| v.to_id())
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
        dbg!(self.imports);
        let mut actual = ActualMarker {
            mark: self.dep_mark,
            imports: self.imports,
        };

        let span = item.span();
        let item: ModuleItem = item.fold_children_with(self);

        match item {
            ModuleItem::Stmt(..) => return item,

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                let ident = self.aliased_import(&js_word!("default"));

                let ident = if let Some(id) = ident {
                    id
                } else {
                    log::info!("Dropping export default declaration because it's not used");

                    return Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into();
                };

                match export.decl {
                    // TODO: Optimize if c.ident is `Some`
                    DefaultDecl::Class(c) => {
                        return ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: export.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(Ident::new(
                                    ident.0,
                                    DUMMY_SP.with_ctxt(
                                        SyntaxContext::empty().apply_mark(self.dep_mark),
                                    ),
                                )),
                                init: Some(Box::new(Expr::Class(c))),
                                definite: false,
                            }],
                        })))
                    }
                    // TODO: Optimize if f.ident is `Some`
                    DefaultDecl::Fn(f) => {
                        return ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: export.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(Ident::new(
                                    ident.0,
                                    DUMMY_SP.with_ctxt(
                                        SyntaxContext::empty().apply_mark(self.dep_mark),
                                    ),
                                )),
                                init: Some(Box::new(Expr::Fn(f))),
                                definite: false,
                            }],
                        })))
                    }
                    DefaultDecl::TsInterfaceDecl(_) => {
                        log::info!(
                            "Dropping export default declaration because ts interface declaration \
                             is not supported yet"
                        );

                        return Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into();
                    }
                }
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(e)) => {
                let ident = self.aliased_import(&js_word!("default"));

                return if let Some(ident) = ident {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: e.span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(Ident::new(
                                ident.0,
                                DUMMY_SP
                                    .with_ctxt(SyntaxContext::empty().apply_mark(self.dep_mark)),
                            )),
                            init: Some(e.expr),
                            definite: false,
                        }],
                    })))
                } else {
                    log::debug!("Removing default export expression as it's not imported");

                    // Expression statement cannot start with function
                    ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: e.span,
                        expr: Box::new(Expr::Paren(ParenExpr {
                            span: DUMMY_SP,
                            expr: e.expr,
                        })),
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
                                // We need remarking

                                match self.aliased_import(&exported.sym) {
                                    Some(v) => {
                                        let ctxt =
                                            self.mark_as_remarking_required(exported.to_id());

                                        self.remark_map
                                            .insert((s.orig.sym.clone(), s.orig.span.ctxt), ctxt);
                                        Some((v.0, ctxt))
                                    }
                                    None => None,
                                }
                            } else {
                                return;
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
                            name: Pat::Ident(Ident::new(i.0, DUMMY_SP.with_ctxt(i.1))),
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

                dbg!(&var_decls);
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
