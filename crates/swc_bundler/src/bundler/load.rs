#![allow(dead_code)]

use anyhow::{Context, Error};
use is_macro::Is;
#[cfg(feature = "rayon")]
use rayon::iter::ParallelIterator;
use swc_common::{
    sync::{Lock, Lrc},
    FileName, SourceFile, SyntaxContext,
};
use swc_ecma_ast::{
    CallExpr, Callee, Expr, Ident, ImportDecl, ImportSpecifier, MemberExpr, MemberProp, Module,
    ModuleDecl, ModuleExportName, Str, SuperProp, SuperPropExpr,
};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::{export::Exports, helpers::Helpers, Bundler};
use crate::{
    bundler::{export::RawExports, import::RawImports},
    id::{Id, ModuleId},
    load::ModuleData,
    util,
    util::IntoParallelIterator,
    Load, Resolve,
};
/// Module after applying transformations.
#[derive(Debug, Clone)]
pub(crate) struct TransformedModule {
    pub id: ModuleId,
    pub fm: Lrc<SourceFile>,
    pub module: Lrc<Module>,
    pub imports: Lrc<Imports>,
    pub exports: Lrc<Exports>,

    /// If false, the module will be wrapped with a small helper function.
    pub is_es6: bool,

    /// Used helpers
    pub helpers: Lrc<Helpers>,

    pub swc_helpers: Lrc<Lock<swc_ecma_transforms_base::helpers::HelperData>>,

    local_ctxt: SyntaxContext,
    export_ctxt: SyntaxContext,
}

impl TransformedModule {
    /// [SyntaxContext] for exported items.
    pub fn export_ctxt(&self) -> SyntaxContext {
        self.export_ctxt
    }

    /// Top level contexts.
    pub fn local_ctxt(&self) -> SyntaxContext {
        self.local_ctxt
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
            tracing::trace!("load_transformed: ({})", file_name);

            // In case of common module
            if let Some(cached) = self.scope.get_module_by_path(file_name) {
                tracing::debug!("Cached: {}", file_name);
                return Ok(Some(cached));
            }

            let (_, data) = self.load(file_name).context("Bundler.load() failed")?;
            let (v, mut files) = self
                .analyze(file_name, data)
                .context("failed to analyze module")?;
            files.dedup_by_key(|v| v.1.clone());

            tracing::debug!(
                "({:?}, {:?}, {:?}) Storing module: {}",
                v.id,
                v.local_ctxt(),
                v.export_ctxt(),
                file_name
            );
            self.scope.store_module(v.clone());

            // Load dependencies and store them in the `Scope`
            let results = files
                .into_par_iter()
                .map(|(_src, path)| {
                    tracing::trace!("loading dependency: {}", path);
                    self.load_transformed(&path)
                })
                .collect::<Vec<_>>();

            // Do tasks in parallel, and then wait for result
            for result in results {
                result?;
            }

            Ok(Some(v))
        })
    }

    fn load(&self, file_name: &FileName) -> Result<(ModuleId, ModuleData), Error> {
        self.run(|| {
            let (module_id, _, _) = self.scope.module_id_gen.gen(file_name);

            let data = self
                .loader
                .load(file_name)
                .with_context(|| format!("Bundler.loader.load({}) failed", file_name))?;
            self.scope.mark_as_loaded(module_id);
            Ok((module_id, data))
        })
    }

    /// This methods returns [Source]s which should be loaded.
    fn analyze(
        &self,
        file_name: &FileName,
        mut data: ModuleData,
    ) -> Result<(TransformedModule, Vec<(Source, Lrc<FileName>)>), Error> {
        self.run(|| {
            tracing::trace!("transform_module({})", data.fm.name);
            let (id, local_mark, export_mark) = self.scope.module_id_gen.gen(file_name);

            data.module.visit_mut_with(&mut ClearMark);

            data.module
                .visit_mut_with(&mut resolver(self.unresolved_mark, local_mark, false));

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

            let imports = self.extract_import_info(file_name, &mut data.module, local_mark);

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

            let exports = self.extract_export_info(
                file_name,
                &mut data.module,
                SyntaxContext::empty().apply_mark(export_mark),
            );

            let is_es6 = if !self.config.require {
                true
            } else {
                let mut v = Es6ModuleDetector {
                    forced_es6: false,
                    found_other: false,
                };
                data.module.visit_with(&mut v);
                v.forced_es6 || !v.found_other
            };

            let (imports, exports) = util::join(
                || self.resolve_imports(file_name, imports),
                || self.resolve_exports(file_name, exports),
            );
            let (imports, mut import_files) = imports?;
            let (exports, reexport_files) = exports?;
            import_files.extend(reexport_files);

            Ok((
                TransformedModule {
                    id,
                    fm: data.fm,
                    module: Lrc::new(data.module),
                    imports: Lrc::new(imports),
                    exports: Lrc::new(exports),
                    is_es6,
                    helpers: Default::default(),
                    swc_helpers: Lrc::new(Lock::new(data.helpers.data())),
                    local_ctxt: SyntaxContext::empty().apply_mark(local_mark),
                    export_ctxt: SyntaxContext::empty().apply_mark(export_mark),
                },
                import_files,
            ))
        })
    }

    /// Resolve re-exports.
    fn resolve_exports(
        &self,
        base: &FileName,
        raw: RawExports,
    ) -> Result<(Exports, Vec<(Source, Lrc<FileName>)>), Error> {
        self.run(|| {
            tracing::trace!("resolve_exports({})", base);
            let mut files = Vec::new();

            let mut exports = Exports::default();

            let items = raw
                .items
                .into_par_iter()
                .map(|(src, ss)| -> Result<_, Error> {
                    self.run(|| {
                        let info = match src {
                            Some(src) => {
                                let name = self.resolve(base, &src.value)?;
                                let (id, local_mark, export_mark) =
                                    self.scope.module_id_gen.gen(&name);
                                Some((id, local_mark, export_mark, name, src))
                            }
                            None => None,
                        };

                        Ok((info, ss))
                    })
                })
                .collect::<Vec<_>>();

            for res in items {
                let (info, specifiers) = res?;

                match info {
                    None => exports.items.extend(specifiers),
                    Some((id, local_mark, export_mark, name, src)) => {
                        //
                        let src = Source {
                            is_loaded_synchronously: true,
                            is_unconditional: false,
                            module_id: id,
                            local_ctxt: SyntaxContext::empty().apply_mark(local_mark),
                            export_ctxt: SyntaxContext::empty().apply_mark(export_mark),
                            src,
                        };
                        exports.reexports.push((src.clone(), specifiers));
                        files.push((src, name));
                    }
                }
            }

            Ok((exports, files))
        })
    }

    /// Resolve dependencies
    fn resolve_imports(
        &self,
        base: &FileName,
        info: RawImports,
    ) -> Result<(Imports, Vec<(Source, Lrc<FileName>)>), Error> {
        self.run(|| {
            tracing::trace!("resolve_imports({})", base);
            let mut files = Vec::new();

            let mut merged = Imports::default();
            let RawImports {
                imports,
                lazy_imports,
                dynamic_imports,
                forced_ns,
            } = info;

            let loaded = imports
                .into_par_iter()
                .map(|v| (v, false, true))
                .chain(lazy_imports.into_par_iter().map(|v| (v, false, false)))
                .chain(dynamic_imports.into_par_iter().map(|src| {
                    (
                        ImportDecl {
                            span: src.span,
                            specifiers: Vec::new(),
                            src: Box::new(src),
                            type_only: false,
                            with: None,
                            phase: Default::default(),
                        },
                        true,
                        false,
                    )
                }))
                .map(|(decl, dynamic, unconditional)| -> Result<_, Error> {
                    self.run(|| {
                        //
                        let file_name = self.resolve(base, &decl.src.value)?;
                        let (id, local_mark, export_mark) =
                            self.scope.module_id_gen.gen(&file_name);

                        Ok((
                            id,
                            local_mark,
                            export_mark,
                            file_name,
                            decl,
                            dynamic,
                            unconditional,
                        ))
                    })
                })
                .collect::<Vec<_>>();

            for res in loaded {
                // TODO: Report error and proceed instead of returning an error
                let (id, local_mark, export_mark, file_name, decl, is_dynamic, is_unconditional) =
                    res?;

                let src = Source {
                    is_loaded_synchronously: !is_dynamic,
                    is_unconditional,
                    module_id: id,
                    local_ctxt: SyntaxContext::empty().apply_mark(local_mark),
                    export_ctxt: SyntaxContext::empty().apply_mark(export_mark),
                    src: *decl.src,
                };
                files.push((src.clone(), file_name));

                // TODO: Handle rename
                let mut specifiers = Vec::new();
                for s in decl.specifiers {
                    match s {
                        ImportSpecifier::Named(s) => {
                            let imported = match s.imported {
                                Some(ModuleExportName::Ident(ident)) => Some(ident),
                                Some(ModuleExportName::Str(..)) => {
                                    unimplemented!("module string names unimplemented")
                                }
                                _ => None,
                            };
                            specifiers.push(Specifier::Specific {
                                local: s.local.into(),
                                alias: imported.map(From::from),
                            })
                        }
                        ImportSpecifier::Default(s) => specifiers.push(Specifier::Specific {
                            local: s.local.into(),
                            alias: Some(Id::new("default".into(), SyntaxContext::empty())),
                        }),
                        ImportSpecifier::Namespace(s) => {
                            specifiers.push(Specifier::Namespace {
                                local: s.local.into(),
                                all: forced_ns.contains(&src.src.value),
                            });
                        }
                    }
                }

                merged.specifiers.push((src, specifiers));
            }

            Ok((merged, files))
        })
    }
}

#[derive(Debug, Default)]
pub(crate) struct Imports {
    /// If imported ids are empty, it is a side-effect import.
    pub specifiers: Vec<(Source, Vec<Specifier>)>,
}

/// Clone is relatively cheap
#[derive(Debug, Clone, Is)]
pub(crate) enum Specifier {
    Specific {
        local: Id,
        alias: Option<Id>,
    },
    Namespace {
        local: Id,
        /// True for `import * as foo from 'foo'; foo[computedKey()]`
        all: bool,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) struct Source {
    pub is_loaded_synchronously: bool,
    pub is_unconditional: bool,

    pub module_id: ModuleId,
    pub local_ctxt: SyntaxContext,
    pub export_ctxt: SyntaxContext,

    // Clone is relatively cheap, thanks to hstr.
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
    noop_visit_type!();

    fn visit_call_expr(&mut self, e: &CallExpr) {
        e.visit_children_with(self);

        match &e.callee {
            Callee::Expr(e) => {
                if let Expr::Ident(Ident { sym: _require, .. }) = &**e {
                    self.found_other = true;
                }
            }
            Callee::Super(_) | Callee::Import(_) => {}
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.obj.visit_with(self);

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }

        if let Expr::Ident(i) = &*e.obj {
            // TODO: Check syntax context (Check if marker is the global mark)
            if i.sym == *"module" {
                self.found_other = true;
            }

            if i.sym == *"exports" {
                self.found_other = true;
            }
        }
    }

    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }
    }

    fn visit_module_decl(&mut self, decl: &ModuleDecl) {
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

#[derive(Clone, Copy)]
struct ClearMark;
impl VisitMut for ClearMark {
    noop_visit_mut_type!(fail);

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        ident.ctxt = SyntaxContext::empty();
    }
}
