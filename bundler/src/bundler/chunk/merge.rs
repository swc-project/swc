use super::plan::Plan;
use crate::{
    bundler::{
        export::Exports,
        load::{Source, Specifier},
    },
    debug::print_hygiene,
    id::{Id, ModuleId},
    load::Load,
    resolve::Resolve,
    util::IntoParallelIterator,
    Bundler,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use std::{borrow::Cow, mem::take};
use swc_atoms::{js_word, JsWord};
use swc_common::{Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
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
    ) -> Result<Module, Error> {
        self.run(|| {
            let info = self.scope.get_module(entry).unwrap();

            // Handle circular imports
            if let Some(circular) = plan.entry_as_circular(info.id) {
                log::info!("Circular dependency detected: ({})", info.fm.name);
                return Ok(self.merge_circular_modules(circular, entry));
            }

            let module_plan = match plan.normal.get(&entry) {
                Some(v) => v,
                None => return Ok((*info.module).clone()),
            };

            let mut entry: Module = (*info.module).clone();

            log::trace!("merge_modules({}) <- {:?}", info.fm.name, plan.normal);

            // Respan using imported module's syntax context.
            entry.visit_mut_with(&mut LocalMarker {
                top_level_ctxt: SyntaxContext::empty().apply_mark(self.top_level_mark),
                specifiers: &info.imports.specifiers,
            });

            log::info!(
                "Merge: ({}){} <= {:?}",
                info.id,
                info.fm.name,
                plan.normal.get(&info.id)
            );

            self.merge_reexports(plan, &mut entry, &info)
                .context("failed to merge reepxorts")?;

            let deps = (&*info.imports.specifiers)
                .into_par_iter()
                .filter(|(src, _)| {
                    // Skip if a dependency is going to be merged by other dependency
                    module_plan.chunks.contains(&src.module_id)
                })
                .map(|(src, specifiers)| -> Result<_, Error> {
                    log::debug!("Merging: {} <= {}", info.fm.name, src.src.value);

                    if specifiers.iter().any(|v| v.is_namespace()) {
                        unimplemented!(
                            "accessing namespace dependency with computed key: {} -> {}",
                            info.id,
                            src.module_id
                        )
                    }
                    let imported = self.scope.get_module(src.module_id).unwrap();
                    info.helpers.extend(&imported.helpers);

                    // In the case of
                    //
                    //  a <- b
                    //  b <- c
                    //
                    // we change it to
                    //
                    // a <- b + chunk(c)
                    //
                    let mut dep = if imported.is_es6 {
                        self.merge_modules(plan, src.module_id, false)
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
                        print_hygiene("dep:before:tree-shaking", &self.cm, &dep);

                        // Tree-shaking
                        dep = self.drop_unused(dep, Some(&specifiers));

                        print_hygiene("dep:after:tree-shaking", &self.cm, &dep);

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

                        print_hygiene("dep:before-injection", &self.cm, &dep);
                    }

                    Ok((src, dep))
                })
                .collect::<Vec<_>>();

            let mut targets = module_plan.chunks.clone();

            for dep in deps {
                let (src, mut dep) = dep?;
                if let Some(idx) = targets.iter().position(|v| *v == src.module_id) {
                    targets.remove(idx);
                }

                // Replace import statement / require with module body
                let mut injector = Es6ModuleInjector {
                    imported: take(&mut dep.body),
                    src: src.src.clone(),
                };
                entry.body.visit_mut_with(&mut injector);

                print_hygiene("entry:after:injection", &self.cm, &entry);

                if injector.imported.is_empty() {
                    continue;
                }
                dep.body = take(&mut injector.imported);
                if self.config.require {
                    self.merge_cjs(&mut entry, &info, Cow::Owned(dep), src.ctxt)?;
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
                    self.merge_cjs(&mut entry, &info, Cow::Borrowed(&dep.module), dep.ctxt())?;
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
