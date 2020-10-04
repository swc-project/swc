use super::plan::{NormalPlan, Plan};
use crate::{
    bundler::load::{Specifier, TransformedModule},
    util::{CHashSet, IntoParallelIterator},
    Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use std::mem::{replace, take};
use swc_common::{Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// This methods injects varaibles to connect two modules.
    ///
    /// (_n) denotes hygiene. Actual name is `bar`, not `bar_1`.
    ///
    /// # Entry
    ///
    /// ```js
    /// import { bar_1, baz_1 } from './a';
    /// console.log(bar_1, baz_1);
    /// ```
    ///
    /// # Dep
    ///
    /// ```js
    /// const foo_2 = 1;
    /// const bar_2 = 2;
    /// export { foo_2 as bar_2 };
    /// export { bar_2 as baz_2 };     
    /// ```
    ///
    /// # Output
    ///
    /// ```js
    /// const foo_2 = 1;
    /// const bar_2 = 2;
    ///
    /// const bar_1 = foo_2;
    /// const baz_1 = bar_2;
    ///
    /// console.log(bar, baz);
    /// ```
    pub(super) fn merge_reexports(
        &self,
        plan: &Plan,
        nomral_plan: &NormalPlan,
        entry: &mut Module,
        info: &TransformedModule,
        merged: &CHashSet<ModuleId>,
    ) -> Result<(), Error> {
        log::trace!("merge_reexports: {}", info.fm.name);

        // Transitive dependencies
        let mut additional_modules = vec![];
        let mut reexports = vec![];

        // Remove transitive dependencies which is merged by parent moudle.
        for v in info.exports.reexports.clone() {
            if nomral_plan.chunks.contains(&v.0.module_id) {
                if v.1.is_empty() {
                    additional_modules.push(v.clone());
                }

                reexports.push(v);
            } else {
                additional_modules.push(v);
            }
        }

        let deps = reexports
            .into_par_iter()
            .map(|(src, specifiers)| -> Result<_, Error> {
                if !merged.insert(src.module_id) {
                    return Ok(None);
                }

                log::debug!("Merging exports: {}  <- {}", info.fm.name, src.src.value);

                let imported = self.scope.get_module(src.module_id).unwrap();
                assert!(imported.is_es6, "Reexports are es6 only");

                info.helpers.extend(&imported.helpers);

                let mut dep = self
                    .merge_modules(plan, src.module_id, false, false, merged)
                    .with_context(|| {
                        format!(
                            "failed to merge for reexport: ({}):{} <= ({}):{}",
                            info.id, info.fm.name, src.module_id, src.src.value
                        )
                    })?;

                // print_hygiene(&format!("dep: start"), &self.cm, &dep);

                dep = self.remark_exports(dep, src.ctxt, None, false);

                // print_hygiene(&format!("dep: remark exports"), &self.cm, &dep);

                if !specifiers.is_empty() {
                    dep.visit_mut_with(&mut UnexportAsVar {
                        dep_ctxt: src.ctxt,
                        _entry_ctxt: info.ctxt(),
                        _exports: &specifiers,
                    });

                    // print_hygiene(&format!("dep: unexport as var"), &self.cm, &dep);

                    dep = dep.fold_with(&mut DepUnexporter {
                        exports: &specifiers,
                    });

                    // print_hygiene(&format!("dep: unexport"), &self.cm, &dep);
                }

                Ok(Some((src, dep)))
            })
            .collect::<Vec<_>>();

        {
            let mut normal_reexports = vec![];
            let mut star_reexports = vec![];
            for (src, specifiers) in additional_modules {
                if specifiers.is_empty() {
                    continue;
                }

                // If a dependency is indirect, we need to export items from it manually.
                let is_indirect = !nomral_plan.chunks.contains(&src.module_id);

                let add_to = if specifiers.is_empty() && is_indirect {
                    // User provided code like `export * from './foo';`, but planner decide to merge
                    // it within dependency module. So we reexport them using a named export.
                    &mut star_reexports
                } else {
                    &mut normal_reexports
                };

                for specifier in specifiers {
                    let (imported, exported) = match specifier {
                        Specifier::Specific { local, alias } => {
                            let alias = alias.unwrap_or_else(|| local.clone());
                            let local = local.replace_mark(info.mark());
                            (local.into_ident(), alias.into_ident())
                        }
                        Specifier::Namespace { local, all } => {
                            unimplemented!("namespaced re-export: local={:?}, all={}", local, all)
                        }
                    };

                    add_to.push((imported, exported));
                }
            }

            if !normal_reexports.is_empty() {
                entry
                    .body
                    .push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: normal_reexports
                            .into_iter()
                            .map(|(imported, exported)| {
                                let var = VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(imported),
                                    init: Some(Box::new(Expr::Ident(exported))),
                                    definite: false,
                                };

                                var
                            })
                            .collect(),
                    }))));
            }

            if !star_reexports.is_empty() {
                entry
                    .body
                    .push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span: DUMMY_SP,
                            specifiers: star_reexports
                                .into_iter()
                                .map(|(imported, exported)| {
                                    ExportNamedSpecifier {
                                        span: DUMMY_SP,
                                        orig: exported.clone(),
                                        exported: Some(imported.clone()),
                                    }
                                    .into()
                                })
                                .collect(),
                            src: None,
                            type_only: false,
                        },
                    )));
            }
        }

        for dep in deps {
            let dep = dep?;
            let dep = match dep {
                Some(v) => v,
                None => continue,
            };
            let (src, dep) = dep;

            // print_hygiene(
            //     &format!(
            //         "entry: before reexport injection {:?} <- {:?}",
            //         info.ctxt(),
            //         src.ctxt,
            //     ),
            //     &self.cm,
            //     &entry,
            // );

            // Replace import statement / require with module body
            let mut injector = ExportInjector {
                imported: dep.body,
                src: src.src.clone(),
            };
            entry.body.visit_mut_with(&mut injector);

            // print_hygiene(
            //     &format!(
            //         "entry:reexport injection {:?} <- {:?}",
            //         info.ctxt(),
            //         src.ctxt,
            //     ),
            //     &self.cm,
            //     &entry,
            // );
            assert_eq!(injector.imported, vec![]);
        }

        Ok(())
    }
}

struct ExportInjector {
    imported: Vec<ModuleItem>,
    src: Str,
}

impl VisitMut for ExportInjector {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::Stmt(Stmt::Empty(..)) => continue,

                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export))
                    if export.src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    export @ NamedExport { src: Some(..), .. },
                )) if export.src.as_ref().unwrap().value == self.src.value => {
                    buf.extend(take(&mut self.imported));

                    buf.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            src: None,
                            ..export
                        },
                    )));
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}

/// Converts
///
/// ```js
/// export { l1 as e2 };
/// ```
///
/// to
///
/// ```js
/// const e3 = l1;
/// ```
///
/// export { foo#7 } from './b' where #7 is mark of './b'
/// =>
/// export { foo#7 as foo#5 } where #5 is mark of current entry.
struct UnexportAsVar<'a> {
    /// Syntax context for the generated variables.
    dep_ctxt: SyntaxContext,

    _entry_ctxt: SyntaxContext,

    /// Exports to preserve
    _exports: &'a [Specifier],
}

impl VisitMut for UnexportAsVar<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        n.visit_mut_children_with(self);

        match n {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                let expr = replace(
                    &mut export.expr,
                    Box::new(Expr::Invalid(Invalid { span: DUMMY_SP })),
                );

                *n = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: export.span,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(Ident::new(
                            "__default".into(),
                            expr.span().with_ctxt(self.dep_ctxt),
                        )),
                        init: Some(expr),
                        definite: false,
                    }],
                })));
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(ref export)) => {
                let mut decls = vec![];
                for s in &export.specifiers {
                    match s {
                        ExportSpecifier::Namespace(_) => {}
                        ExportSpecifier::Default(_) => {}
                        ExportSpecifier::Named(n) => match &n.exported {
                            Some(exported) => {
                                // TODO: (maybe) Check previous context
                                let exported = exported.clone();
                                // exported.span = exported.span.with_ctxt(self.dep_ctxt);

                                if exported.sym != n.orig.sym
                                    || exported.span.ctxt != n.orig.span.ctxt
                                {
                                    decls.push(VarDeclarator {
                                        span: n.span,
                                        name: Pat::Ident(exported),
                                        init: Some(Box::new(Expr::Ident(n.orig.clone()))),
                                        definite: true,
                                    })
                                }
                            }
                            None => {
                                log::trace!("Alias: {:?} -> {:?}", n.orig, self.dep_ctxt);

                                decls.push(VarDeclarator {
                                    span: n.span,
                                    name: Pat::Ident(Ident::new(
                                        n.orig.sym.clone(),
                                        n.orig.span.with_ctxt(self.dep_ctxt),
                                    )),
                                    init: Some(Box::new(Expr::Ident(n.orig.clone()))),
                                    definite: false,
                                })
                            }
                        },
                    }
                }

                if decls.is_empty() {
                    *n = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                } else {
                    *n = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: export.span,
                        decls,
                        declare: false,
                        kind: VarDeclKind::Const,
                    })))
                }
            }
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}

struct AliasExports {
    /// Syntax context of the importer.
    importer_ctxt: SyntaxContext,
    decls: Vec<VarDeclarator>,
}

impl VisitMut for AliasExports {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        for item in items.iter_mut() {
            item.visit_mut_with(self);
        }

        if !self.decls.is_empty() {
            items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                decls: take(&mut self.decls),
                declare: false,
            }))))
        }
    }

    fn visit_mut_module_decl(&mut self, decl: &mut ModuleDecl) {
        match decl {
            ModuleDecl::ExportDecl(ref export) => match &export.decl {
                Decl::Class(c) => self.decls.push(VarDeclarator {
                    span: c.class.span,
                    name: Pat::Ident(c.ident.clone()),
                    init: Some(Box::new(Expr::Ident(Ident::new(
                        c.ident.sym.clone(),
                        c.ident.span.with_ctxt(self.importer_ctxt),
                    )))),
                    definite: false,
                }),
                Decl::Fn(f) => self.decls.push(VarDeclarator {
                    span: f.function.span,
                    name: Pat::Ident(Ident::new(
                        f.ident.sym.clone(),
                        f.ident.span.with_ctxt(self.importer_ctxt),
                    )),
                    init: Some(Box::new(Expr::Ident(f.ident.clone()))),
                    definite: false,
                }),
                Decl::Var(var) => {
                    let ids = find_ids::<_, Ident>(&var.decls);
                    for ident in ids {
                        self.decls.push(VarDeclarator {
                            span: ident.span,
                            name: Pat::Ident(Ident::new(
                                ident.sym.clone(),
                                ident.span.with_ctxt(self.importer_ctxt),
                            )),
                            init: Some(Box::new(Expr::Ident(ident))),
                            definite: false,
                        })
                    }
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, _: &mut Stmt) {}
}

struct DepUnexporter<'a> {
    exports: &'a [Specifier],
}

impl DepUnexporter<'_> {
    fn is_exported(&self, id: &Id) -> bool {
        if self.exports.is_empty() {
            return true;
        }

        self.exports.iter().any(|s| match s {
            Specifier::Specific { local, .. } => local.to_id() == *id,
            Specifier::Namespace { local, all } => local.to_id() == *id || *all,
        })
    }
}

impl Fold for DepUnexporter<'_> {
    noop_fold_type!();

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        match item {
            ModuleItem::ModuleDecl(decl) => match decl {
                ModuleDecl::ExportDecl(mut export) => {
                    match &mut export.decl {
                        Decl::Class(c) => {
                            if self.is_exported(&c.ident.to_id()) {
                                return ModuleItem::Stmt(Stmt::Decl(export.decl));
                            }
                        }
                        Decl::Fn(f) => {
                            if self.is_exported(&f.ident.to_id()) {
                                return ModuleItem::Stmt(Stmt::Decl(export.decl));
                            }
                        }
                        Decl::Var(..) => {
                            if self.exports.is_empty() {
                                return ModuleItem::Stmt(Stmt::Decl(export.decl));
                            }
                        }
                        _ => {}
                    }
                    ModuleItem::Stmt(Stmt::Decl(export.decl))
                }

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
