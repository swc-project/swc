use super::{export::Exports, helpers::Helpers};
use crate::{
    id::{Id, ModuleId},
    Bundler, Load, Resolve,
};
use anyhow::{Context, Error};
use is_macro::Is;
use std::path::PathBuf;
use swc_common::{sync::Lrc, FileName, Mark, SourceFile};
use swc_ecma_ast::{Module, Str};

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
    ) -> Result<TransformedModule, Error> {
        log::trace!("load_transformed: ({})", file_name);

        if let Some(cached) = self.scope.get_module_by_path(&file_name) {
            return Ok(cached.clone());
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

        Ok(v)
    }

    fn load(&self, file_name: &FileName) -> Result<(ModuleId, Lrc<SourceFile>, Module), Error> {
        let (module_id, _) = self.scope.module_id_gen.gen(file_name);

        let (fm, module) = self
            .loader
            .load(&file_name)
            .with_context(|| format!("Bundler.loader.load({}) failed", file_name))?;

        Ok((module_id, fm, module))
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
            module = module.fold_with(&mut InlineGlobals {
                envs: self.envs()?,
                globals: Default::default(),
            });
            module = module.fold_with(&mut dead_branch_remover());

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
            let mut module = module?;
            let is_es6 = {
                let mut v = Es6ModuleDetector {
                    forced_es6: false,
                    found_other: false,
                };
                module.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                v.forced_es6 || !v.found_other
            };
            if is_es6 {
                module = self.drop_unused(fm.clone(), module, None);
            }

            let module = Arc::new(module);

            Ok(TransformedModule {
                id,
                fm,
                module,
                imports: Arc::new(imports),
                exports: Arc::new(exports),
                is_es6,
                helpers: Default::default(),
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
