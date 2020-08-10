use super::{export::Exports, helpers::Helpers, Bundler};
use crate::{
    bundler::{export::RawExports, import::RawImports},
    id::{Id, ModuleId},
    util,
    util::IntoParallelIterator,
    Load, Resolve,
};
use anyhow::{Context, Error};
use is_macro::Is;
#[cfg(feature = "rayon")]
use rayon::iter::ParallelIterator;
use swc_atoms::js_word;
use swc_common::{sync::Lrc, FileName, Mark, SourceFile, DUMMY_SP};
use swc_ecma_ast::{
    Expr, ExprOrSuper, ImportDecl, ImportSpecifier, Invalid, MemberExpr, Module, ModuleDecl, Str,
};
use swc_ecma_transforms::resolver_with_mark;
use swc_ecma_visit::{FoldWith, Node, Visit, VisitWith};
/// Module after applying transformations.
#[derive(Debug, Clone)]
pub(super) struct TransformedModule {
    pub id: ModuleId,
    pub fm: Lrc<SourceFile>,
    pub module: Lrc<Module>,
    pub imports: Lrc<Imports>,
    pub exports: Lrc<Exports>,

    /// If false, the module will be wrapped with a small helper function.
    pub is_es6: bool,

    /// Used helpers
    pub helpers: Lrc<Helpers>,

    mark: Mark,
}

impl TransformedModule {
    /// Marks applied to bindings
    pub fn mark(&self) -> Mark {
        self.mark
    }
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Phase 1 (discovery)
    ///
    /// We apply transforms at this phase to make cache efficient.
    /// As we cache in this phase, changing dependency does not affect cache.
    pub(super) fn load_transformed(
        &self,
        file_name: &FileName,
    ) -> Result<Option<TransformedModule>, Error> {
        self.run(|| {
            log::trace!("load_transformed: ({})", file_name);

            // Handle circular dependency
            if self.scope.module_id_gen.has(file_name) {
                return Ok(None);
            }

            // In case of common module
            if let Some(cached) = self.scope.get_module_by_path(&file_name) {
                return Ok(Some(cached));
            }

            let (_, fm, module) = self.load(&file_name).context("Bundler.load() failed")?;
            let v = self
                .transform_module(&file_name, fm.clone(), module)
                .context("failed to transform module")?;

            self.scope.store_module(v.clone());

            //{
            //    let code = self
            //        .swc
            //        .print(
            //            &(*v.module).clone().fold_with(&mut HygieneVisualizer),
            //            fm,
            //            false,
            //            false,
            //        )
            //        .unwrap()
            //        .code;
            //
            //    println!(
            //        "Fully loaded:\n{}\nImports: {:?}\nExports: {:?}\n",
            //        code, v.imports, v.exports
            //    );
            //}

            Ok(Some(v))
        })
    }

    fn load(&self, file_name: &FileName) -> Result<(ModuleId, Lrc<SourceFile>, Module), Error> {
        self.run(|| {
            let (module_id, _) = self.scope.module_id_gen.gen(file_name);

            let (fm, module) = self
                .loader
                .load(&file_name)
                .with_context(|| format!("Bundler.loader.load({}) failed", file_name))?;

            Ok((module_id, fm, module))
        })
    }

    fn transform_module(
        &self,
        file_name: &FileName,
        fm: Lrc<SourceFile>,
        mut module: Module,
    ) -> Result<TransformedModule, Error> {
        self.run(|| {
            log::trace!("transform_module({})", fm.name);
            module = module.fold_with(&mut resolver_with_mark(self.top_level_mark));

            let (id, mark) = self.scope.module_id_gen.gen(file_name);

            // {
            //     let code = self
            //         .swc
            //         .print(
            //             &module.clone().fold_with(&mut HygieneVisualizer),
            //             SourceMapsConfig::Bool(false),
            //             None,
            //             false,
            //         )
            //         .unwrap()
            //         .code;
            //
            //     println!("Resolved:\n{}\n\n", code);
            // }

            let imports = self.extract_import_info(file_name, &mut module, mark);

            // {
            //     let code = self
            //         .swc
            //         .print(
            //             &module.clone().fold_with(&mut HygieneVisualizer),
            //             SourceMapsConfig::Bool(false),
            //             None,
            //             false,
            //         )
            //         .unwrap()
            //         .code;
            //
            //     println!("After imports:\n{}\n", code,);
            // }

            let exports = self.extract_export_info(&module);

            // TODO: Exclude resolver (for performance)
            let (imports, exports) = {
                util::join(
                    || self.load_imports(&file_name, imports),
                    || self.load_exports(&file_name, exports),
                )
            };

            let imports = imports?;
            let exports = exports?;
            let is_es6 = {
                let mut v = Es6ModuleDetector {
                    forced_es6: false,
                    found_other: false,
                };
                module.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                v.forced_es6 || !v.found_other
            };
            if is_es6 {
                module = self.drop_unused(module, None);
            }

            let module = Lrc::new(module);

            Ok(TransformedModule {
                id,
                fm,
                module,
                imports: Lrc::new(imports),
                exports: Lrc::new(exports),
                is_es6,
                helpers: Default::default(),
                mark,
            })
        })
    }

    fn load_exports(&self, base: &FileName, raw: RawExports) -> Result<Exports, Error> {
        self.run(|| {
            log::trace!("load_exports({})", base);

            let mut exports = Exports::default();

            let items = raw
                .items
                .into_par_iter()
                .map(|(src, ss)| -> Result<_, Error> {
                    let info = match src {
                        Some(src) => {
                            let path = self.resolve(base, &src.value)?;
                            let module = self.load_transformed(&path)?;
                            Some((module, src))
                        }
                        None => None,
                    };

                    Ok((info, ss))
                })
                .collect::<Vec<_>>();

            for res in items {
                let (info, specifiers): (Option<(Option<TransformedModule>, Str)>, _) = res?;

                match info {
                    None => exports.items.extend(specifiers),
                    Some((Some(info), src)) => exports
                        .reexports
                        .entry(Source {
                            is_loaded_synchronously: true,
                            is_unconditional: false,
                            module_id: info.id,
                            src,
                        })
                        .or_default()
                        .extend(specifiers),
                    _ => {}
                }
            }

            Ok(exports)
        })
    }

    /// Load dependencies
    fn load_imports(&self, base: &FileName, info: RawImports) -> Result<Imports, Error> {
        self.run(|| {
            log::trace!("load_imports({})", base);

            let mut merged = Imports::default();
            let RawImports {
                imports,
                lazy_imports,
                dynamic_imports,
            } = info;

            let loaded = imports
                .into_par_iter()
                .map(|v| (v, false, true))
                .chain(lazy_imports.into_par_iter().map(|v| (v, false, false)))
                .chain(dynamic_imports.into_par_iter().map(|src| {
                    (
                        ImportDecl {
                            span: src.span,
                            specifiers: vec![],
                            src,
                            type_only: false,
                        },
                        true,
                        false,
                    )
                }))
                .map(|(decl, dynamic, unconditional)| -> Result<_, Error> {
                    //
                    let file_name = self.resolve(base, &decl.src.value)?;
                    let res = self.load_transformed(&file_name)?;

                    Ok((res, decl, dynamic, unconditional))
                })
                .collect::<Vec<_>>();

            for res in loaded {
                // TODO: Report error and proceed instead of returning an error
                let (src, decl, is_dynamic, is_unconditional) = res?;

                if let Some(src) = src {
                    let src = Source {
                        is_loaded_synchronously: !is_dynamic,
                        is_unconditional,
                        module_id: src.id,
                        src: decl.src,
                    };

                    // TODO: Handle rename
                    let mut specifiers = vec![];
                    for s in decl.specifiers {
                        match s {
                            ImportSpecifier::Named(s) => specifiers.push(Specifier::Specific {
                                local: s.local.into(),
                                alias: s.imported.map(From::from),
                            }),
                            ImportSpecifier::Default(s) => specifiers.push(Specifier::Specific {
                                local: s.local.into(),
                                alias: Some(Id::new(js_word!("default"), s.span.ctxt())),
                            }),
                            ImportSpecifier::Namespace(s) => {
                                specifiers.push(Specifier::Namespace {
                                    local: s.local.into(),
                                });
                            }
                        }
                    }

                    merged.specifiers.push((src, specifiers));
                }
            }

            Ok(merged)
        })
    }
}

#[derive(Debug, Default)]
pub(super) struct Imports {
    /// If imported ids are empty, it is a side-effect import.
    pub specifiers: Vec<(Source, Vec<Specifier>)>,
}

/// Clone is relatively cheap
#[derive(Debug, Clone, Is)]
pub(super) enum Specifier {
    Specific { local: Id, alias: Option<Id> },
    Namespace { local: Id },
}

impl Specifier {
    pub fn local(&self) -> &Id {
        match self {
            Specifier::Specific { local, .. } => local,
            Specifier::Namespace { local, .. } => local,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(super) struct Source {
    pub is_loaded_synchronously: bool,
    pub is_unconditional: bool,

    pub module_id: ModuleId,
    // Clone is relatively cheap, thanks to string_cache.
    pub src: Str,
}

struct Es6ModuleDetector {
    /// If import statement or export is detected, it's an es6 module regardless
    /// of other codes.
    forced_es6: bool,
    /// True if other module system is detected.
    found_other: bool,
}

impl Visit for Es6ModuleDetector {
    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }

        match &e.obj {
            ExprOrSuper::Expr(e) => {
                match &**e {
                    Expr::Ident(i) => {
                        // TODO: Check syntax context (Check if marker is the global mark)
                        if i.sym == *"module" {
                            self.found_other = true;
                        }

                        if i.sym == *"exports" {
                            self.found_other = true;
                        }
                    }

                    _ => {}
                }
            }
            _ => {}
        }

        //
    }

    fn visit_module_decl(&mut self, decl: &ModuleDecl, _: &dyn Node) {
        match decl {
            ModuleDecl::Import(_)
            | ModuleDecl::ExportDecl(_)
            | ModuleDecl::ExportNamed(_)
            | ModuleDecl::ExportDefaultDecl(_)
            | ModuleDecl::ExportDefaultExpr(_)
            | ModuleDecl::ExportAll(_) => {
                self.forced_es6 = true;
            }

            ModuleDecl::TsImportEquals(_) => {}
            ModuleDecl::TsExportAssignment(_) => {}
            ModuleDecl::TsNamespaceExport(_) => {}
        }
    }
}
