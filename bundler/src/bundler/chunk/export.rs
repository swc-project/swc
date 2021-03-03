use crate::modules::Modules;
use crate::util::MapWithMut;
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
use swc_atoms::js_word;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
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
                            dep.append(
                                dep_info.id,
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

            // `export *`
            if specifiers.is_empty() {
                // We should exclude `default`
                dep.retain_mut(|_, item| match item {
                    ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                        export.specifiers.retain(|s| match s {
                            ExportSpecifier::Named(ExportNamedSpecifier {
                                exported:
                                    Some(Ident {
                                        sym: js_word!("default"),
                                        ..
                                    }),
                                ..
                            }) => false,
                            _ => true,
                        });
                        if export.specifiers.is_empty() {
                            return false;
                        }

                        true
                    }
                    _ => true,
                });
            } else {
                dep = dep.fold_with(&mut DepUnexporter {});
            }

            // print_hygiene(&format!("done: reexport"), &self.cm, &dep.clone().into());

            Ok(dep)
        })
    }
}

pub(super) fn inject_export(
    entry: &mut Modules,
    ctx: &Ctx,
    entry_export_ctxt: SyntaxContext,
    dep: Modules,
    source: Source,
) {
    entry.map_items_mut(|_, item| {
        //
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export))
                if export.src.value == source.src.value =>
            {
                let export_ctxt = export.span.ctxt;
                ctx.transitive_remap.insert(export_ctxt, entry_export_ctxt);

                *item = Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into()
            }
            ModuleItem::ModuleDecl(ModuleDecl::Import(ref import))
                if import.src.value == source.src.value =>
            {
                *item = Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into()
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                export @ NamedExport { src: Some(..), .. },
            )) if export.src.as_ref().unwrap().value == source.src.value => {
                let namespace_name = export
                    .specifiers
                    .iter()
                    .filter_map(|specifier| match specifier {
                        ExportSpecifier::Namespace(ns) => Some(ns.name.clone()),
                        ExportSpecifier::Default(_) => None,
                        ExportSpecifier::Named(_) => None,
                    })
                    .next();

                if let Some(ns_name) = namespace_name {
                    *item = ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                        span: export.span,
                        src: None,
                        specifiers: vec![ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: ns_name,
                            exported: None,
                        })],
                        type_only: false,
                        asserts: None,
                    }));
                } else {
                    *item = ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                        span: export.span,
                        specifiers: export.specifiers.take(),
                        src: None,
                        type_only: false,
                        asserts: None,
                    }))
                }
            }

            _ => {}
        }
    });

    entry.add_dep(dep);
}

struct DepUnexporter;

impl Fold for DepUnexporter {
    noop_fold_type!();

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        match item {
            ModuleItem::ModuleDecl(decl) => {
                match decl {
                    // Empty statement
                    ModuleDecl::ExportDecl(..)
                    | ModuleDecl::ExportDefaultDecl(..)
                    | ModuleDecl::ExportAll(..)
                    | ModuleDecl::ExportDefaultExpr(..)
                    | ModuleDecl::ExportNamed(..) => {
                        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                    }
                    ModuleDecl::Import(..) => ModuleItem::ModuleDecl(decl),

                    _ => unimplemented!("Unexported: {:?}", decl),
                }
            }

            _ => item,
        }
    }
}
