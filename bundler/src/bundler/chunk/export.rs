use crate::bundler::modules::Modules;
use crate::{
    bundler::{
        chunk::merge::Ctx,
        load::{Source, Specifier},
    },
    util::{ExprExt, VarDeclaratorExt},
    Bundler, Load, ModuleId, Resolve,
};
use anyhow::{Context, Error};
#[cfg(feature = "concurrent")]
use rayon::iter::ParallelIterator;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_fold_type, Fold};

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
    pub(super) fn merge_export(
        &self,
        ctx: &Ctx,
        dep_id: ModuleId,
        specifiers: &[Specifier],
    ) -> Result<Modules, Error> {
        self.run(|| {
            log::debug!("Reexporting {:?}", dep_id);
            let dep_info = self.scope.get_module(dep_id).unwrap();
            let mut dep = self
                .merge_modules(ctx, dep_id, false, true)
                .context("failed to get module for merging")?;

            if let Some(module_name) = self.scope.wrapped_esm_id(dep_info.id) {
                dep = self.wrap_esm(ctx, dep_info.id, dep.into())?;

                for specifier in specifiers {
                    match specifier {
                        Specifier::Namespace { local, .. } => {
                            dep.inject(
                                module_name
                                    .assign_to(local.clone())
                                    .into_module_item(self.injected_ctxt, "merge_export"),
                            );
                            break;
                        }
                        _ => {}
                    }
                }
            }

            // print_hygiene(
            //     &format!("dep: before unexport"),
            //     &self.cm,
            //     &dep.clone().into(),
            // );

            if !specifiers.is_empty() {
                unexprt_as_var(&mut dep, dep_info.export_ctxt());

                dep = dep.fold_with(&mut DepUnexporter {
                    exports: &specifiers,
                });

                // print_hygiene(&format!("dep: unexport"), &self.cm,
                // &dep.clone().into());
            }

            // TODO: Add varaible based on specifers

            Ok(dep)
        })
    }
}

pub(super) fn inject_export(
    entry: &mut Modules,
    ctx: &Ctx,
    entry_export_ctxt: SyntaxContext,
    wrapped: bool,
    dep: Modules,
    source: Source,
) {
    entry.map_items_mut(|item| {
        //
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export))
                if export.src.value == source.src.value =>
            {
                if !wrapped {
                    let export_ctxt = export.span.ctxt;
                    ctx.transitive_remap.insert(export_ctxt, entry_export_ctxt);
                }
                *item = Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into()
            }

            _ => {}
        }
    });

    entry.push_all(dep);
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
fn unexprt_as_var(modules: &mut Modules, dep_export_ctxt: SyntaxContext) {
    modules.map_items_mut(|n| {
        match n {
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                ref export @ NamedExport { src: None, .. },
            )) => {
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
                                if n.orig.span.ctxt != dep_export_ctxt {
                                    log::trace!("Alias: {:?} -> {:?}", n.orig, dep_export_ctxt);

                                    decls.push(VarDeclarator {
                                        span: n.span,
                                        name: Pat::Ident(Ident::new(
                                            n.orig.sym.clone(),
                                            n.orig.span.with_ctxt(dep_export_ctxt),
                                        )),
                                        init: Some(Box::new(Expr::Ident(n.orig.clone()))),
                                        definite: false,
                                    })
                                }
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
    })
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
