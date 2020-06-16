use super::Bundler;
use crate::{
    bundler::{
        export::{Exports, RawExports},
        import::RawImports,
    },
    debug::assert_clean,
    Id, ModuleId,
};
use anyhow::{Context, Error};
use is_macro::Is;
use rayon::prelude::*;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_atoms::js_word;
use swc_common::{fold::FoldWith, FileName, Mark, SourceFile, Visit, VisitWith};
use swc_ecma_ast::{ImportDecl, ImportSpecifier, Module, ModuleDecl, Program, Str};
use swc_ecma_transforms::resolver::resolver_with_mark;

#[cfg(test)]
mod tests;

/// Module after applying transformations.
#[derive(Debug, Clone)]
pub(super) struct TransformedModule {
    pub id: ModuleId,
    pub fm: Arc<SourceFile>,
    pub module: Arc<Module>,
    pub imports: Arc<Imports>,
    pub exports: Arc<Exports>,

    /// If false, the module will be wrapped with helper function just like
    /// wwbpack.
    pub is_es6: bool,

    mark: Mark,
}

impl TransformedModule {
    /// Marks applied to bindings
    pub fn mark(&self) -> Mark {
        self.mark
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

impl Bundler<'_> {
    /// Phase 1 (discovery)
    ///
    /// We apply transforms at this phase to make cache efficient.
    /// As we cache in this phase, changing dependency does not affect cache.
    pub(super) fn load_transformed(&self, path: Arc<PathBuf>) -> Result<TransformedModule, Error> {
        Ok(self.load_transformed_inner(path)?.1)
    }

    fn load_transformed_inner(
        &self,
        path: Arc<PathBuf>,
    ) -> Result<(Arc<PathBuf>, TransformedModule), Error> {
        self.swc.run(|| {
            if let Some(cached) = self.scope.get_module_by_path(&path) {
                return Ok((path, cached.clone()));
            }

            let (_, fm, module) = self.load(&path).context("Bundler.load failed")?;
            let v = self
                .transform_module(&path, fm.clone(), module)
                .context("failed to transform module")?;

            self.scope.store_module(path.clone(), v.clone());

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

            Ok((path, v))
        })
    }

    fn load(&self, path: &Arc<PathBuf>) -> Result<(ModuleId, Arc<SourceFile>, Module), Error> {
        self.swc.run(|| {
            let (module_id, _) = self.scope.module_id_gen.gen(path);

            let path = Arc::new(path);

            let (fm, module) = self
                .loader
                .load(&path)
                .with_context(|| format!("Loader.load({}) failed", path.display()))?;
            assert_clean(&module);

            Ok((module_id, fm, module))
        })
    }

    fn transform_module(
        &self,
        path: &Arc<PathBuf>,
        fm: Arc<SourceFile>,
        mut module: Module,
    ) -> Result<TransformedModule, Error> {
        self.swc.run(|| {
            log::trace!("transform_module({})", fm.name);
            module = module.fold_with(&mut resolver_with_mark(self.top_level_mark));

            let (id, mark) = self.scope.module_id_gen.gen(path);

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

            let imports = self.extract_import_info(path, &mut module, mark);

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
            let (module, (imports, exports)) = rayon::join(
                || -> Result<_, Error> {
                    self.swc.run(|| {
                        // Process module
                        let config = self
                            .swc
                            .config_for_file(&self.swc_options, &fm.name)
                            .context("failed to parse .swcrc")?;

                        let program = self.swc.transform(
                            Program::Module(module),
                            config.external_helpers,
                            config.pass,
                        );

                        // {
                        //     let code = self
                        //         .swc
                        //         .print(
                        //             &program.clone().fold_with(&mut HygieneVisualizer),
                        //             SourceMapsConfig::Bool(false),
                        //             None,
                        //             false,
                        //         )
                        //         .unwrap()
                        //         .code;
                        //
                        //     println!("loaded using swc:\n{}\n\n", code);
                        // }

                        match program {
                            Program::Module(module) => Ok(module),
                            _ => unreachable!(),
                        }
                    })
                },
                || {
                    let p = match fm.name {
                        FileName::Real(ref p) => p,
                        _ => unreachable!("{} module in spack", fm.name),
                    };

                    rayon::join(
                        || self.swc.run(|| self.load_imports(&p, imports)),
                        || self.swc.run(|| self.load_exports(&p, exports)),
                    )
                },
            );

            let imports = imports?;
            let exports = exports?;
            let module = module?;
            let is_es6 = {
                let mut v = Es6ModuleDetector { is_es6: false };
                module.visit_with(&mut v);
                v.is_es6
            };
            let module = self.drop_unused(fm.clone(), module, None);

            let module = Arc::new(module);

            Ok(TransformedModule {
                id,
                fm,
                module,
                imports: Arc::new(imports),
                exports: Arc::new(exports),
                is_es6,
                mark,
            })
        })
    }

    fn load_exports(&self, base: &Path, raw: RawExports) -> Result<Exports, Error> {
        self.swc.run(|| {
            log::trace!("load_exports({})", base.display());

            let mut exports = Exports::default();
            exports.pure_constants = raw.pure_constants;

            let items = raw
                .items
                .into_par_iter()
                .map(|(src, ss)| -> Result<_, Error> {
                    let info = match src {
                        Some(src) => {
                            let path = self.resolve(base, &src.value)?;
                            Some((self.load_transformed_inner(path)?, src))
                        }
                        None => None,
                    };

                    Ok((info, ss))
                })
                .collect::<Vec<_>>();

            for res in items {
                let (info, specifiers): (Option<((Arc<PathBuf>, TransformedModule), Str)>, _) =
                    res?;

                match info {
                    None => exports.items.extend(specifiers),
                    Some(info) => exports
                        .reexports
                        .entry(Source {
                            is_loaded_synchronously: true,
                            is_unconditional: false,
                            module_id: (info.0).1.id,
                            src: info.1,
                        })
                        .or_default()
                        .extend(specifiers),
                }
            }

            Ok(exports)
        })
    }

    /// Load dependencies
    fn load_imports(&self, base: &Path, info: RawImports) -> Result<Imports, Error> {
        self.swc.run(|| {
            log::trace!("load_imports({})", base.display());

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
                    let path = self.resolve(base, &decl.src.value)?;
                    let res = self.load_transformed_inner(path)?;

                    Ok((res, decl, dynamic, unconditional))
                })
                .collect::<Vec<_>>();

            for res in loaded {
                // TODO: Report error and proceed instead of returning an error
                let ((path, _res), decl, is_dynamic, is_unconditional) = res?;

                if let Some(src) = self.scope.get_module_by_path(&path) {
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

struct Es6ModuleDetector {
    is_es6: bool,
}

impl Visit<ModuleDecl> for Es6ModuleDetector {
    fn visit(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::Import(_)
            | ModuleDecl::ExportDecl(_)
            | ModuleDecl::ExportNamed(_)
            | ModuleDecl::ExportDefaultDecl(_)
            | ModuleDecl::ExportDefaultExpr(_)
            | ModuleDecl::ExportAll(_) => {
                self.is_es6 = true;
            }

            ModuleDecl::TsImportEquals(_) => {}
            ModuleDecl::TsExportAssignment(_) => {}
            ModuleDecl::TsNamespaceExport(_) => {}
        }
    }
}
