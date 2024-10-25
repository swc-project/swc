use std::path::{Path, PathBuf};

use anyhow::Error;
use relative_path::RelativePath;
use swc_common::{collections::AHashMap, util::move_map::MoveMap, FileName, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{
    fixer::fixer,
    helpers::{inject_helpers, Helpers, HELPERS},
    hygiene::hygiene,
};
use swc_ecma_utils::{contains_top_level_await, find_pat_ids, private_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, VisitMutWith};

use crate::{hash::calc_hash, Bundle, BundleKind, Bundler, Load, ModuleType, Resolve};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// This method do
    ///
    /// - inject helpers
    /// - rename chunks
    /// - invoke fixer
    pub(super) fn finalize(
        &self,
        bundles: Vec<Bundle>,
        unresolved_mark: Mark,
    ) -> Result<Vec<Bundle>, Error> {
        self.run(|| {
            let mut new = Vec::with_capacity(bundles.len());
            let mut renamed = AHashMap::default();

            for mut bundle in bundles {
                bundle.module = self.optimize(bundle.module);

                if !self.config.disable_hygiene {
                    bundle.module.visit_mut_with(&mut hygiene());
                }

                bundle.module = self.may_wrap_with_iife(bundle.module);

                if !self.config.disable_fixer {
                    bundle.module.visit_mut_with(&mut fixer(None));
                }

                {
                    // Inject swc helpers
                    let swc_helpers = *self
                        .scope
                        .get_module(bundle.id)
                        .expect("module should exist at this point")
                        .swc_helpers
                        .lock();

                    HELPERS.set(&Helpers::from_data(swc_helpers), || {
                        bundle
                            .module
                            .visit_mut_with(&mut inject_helpers(unresolved_mark));
                    });
                }

                match bundle.kind {
                    BundleKind::Named { .. } => {
                        // Inject helpers
                        let helpers = self
                            .scope
                            .get_module(bundle.id)
                            .expect("module should exist at this point")
                            .helpers;

                        helpers.add_to(&mut bundle.module.body);

                        new.push(bundle);
                    }
                    BundleKind::Lib { name } => {
                        let hash = calc_hash(self.cm.clone(), &bundle.module)?;
                        let mut new_name = PathBuf::from(name);
                        let key = new_name.clone();
                        let file_name = new_name
                            .file_name()
                            .map(|path| -> PathBuf {
                                let path = Path::new(path);
                                let ext = path.extension();
                                if let Some(ext) = ext {
                                    return format!(
                                        "{}-{}.{}",
                                        path.file_stem().unwrap().to_string_lossy(),
                                        hash,
                                        ext.to_string_lossy()
                                    )
                                    .into();
                                }
                                format!("{}-{}", path.file_stem().unwrap().to_string_lossy(), hash,)
                                    .into()
                            })
                            .expect("javascript file should have name");
                        new_name.pop();
                        new_name = new_name.join(file_name.clone());

                        renamed.insert(key, new_name.to_string_lossy().to_string());

                        new.push(Bundle {
                            kind: BundleKind::Named {
                                name: file_name.display().to_string(),
                            },
                            ..bundle
                        })
                    }
                    _ => new.push(bundle),
                }
            }

            if new.len() == 1 {
                return Ok(new);
            }

            new = new.move_map(|bundle| {
                let path = match &*self.scope.get_module(bundle.id).unwrap().fm.name {
                    FileName::Real(ref v) => v.clone(),
                    _ => {
                        tracing::error!("Cannot rename: not a real file");
                        return bundle;
                    }
                };

                let module = {
                    // Change imports
                    let mut v = Renamer {
                        resolver: &self.resolver,
                        base: &path,
                        renamed: &renamed,
                    };
                    bundle.module.fold_with(&mut v)
                };

                Bundle { module, ..bundle }
            });

            Ok(new)
        })
    }

    fn may_wrap_with_iife(&self, module: Module) -> Module {
        if self.config.module != ModuleType::Iife {
            return module;
        }

        let is_async = contains_top_level_await(&module);

        // Properties of returned object
        let mut props = Vec::new();

        let mut body = BlockStmt {
            span: module.span,
            stmts: module
                .body
                .into_iter()
                .filter_map(|item| {
                    let decl = match item {
                        ModuleItem::ModuleDecl(v) => v,
                        ModuleItem::Stmt(stmt) => return Some(stmt),
                    };

                    match decl {
                        ModuleDecl::ExportNamed(NamedExport { src: Some(..), .. })
                        | ModuleDecl::TsImportEquals(_)
                        | ModuleDecl::TsExportAssignment(_)
                        | ModuleDecl::TsNamespaceExport(_)
                        | ModuleDecl::Import(_) => None,

                        ModuleDecl::ExportDecl(export) => {
                            match &export.decl {
                                Decl::Class(ClassDecl { ident, .. })
                                | Decl::Fn(FnDecl { ident, .. }) => {
                                    props.push(PropOrSpread::Prop(Box::new(Prop::Shorthand(
                                        ident.clone(),
                                    ))));
                                }
                                Decl::Var(decl) => {
                                    let ids: Vec<Ident> = find_pat_ids(decl);
                                    props.extend(
                                        ids.into_iter()
                                            .map(Prop::Shorthand)
                                            .map(Box::new)
                                            .map(PropOrSpread::Prop),
                                    );
                                }
                                _ => unreachable!(),
                            }

                            Some(export.decl.into())
                        }

                        ModuleDecl::ExportNamed(NamedExport {
                            specifiers,
                            src: None,
                            ..
                        }) => {
                            for s in specifiers {
                                match s {
                                    ExportSpecifier::Namespace(..) => {
                                        // unreachable
                                    }
                                    ExportSpecifier::Default(s) => {
                                        props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(IdentName::new(
                                                    "default".into(),
                                                    DUMMY_SP,
                                                )),
                                                value: s.exported.into(),
                                            },
                                        ))));
                                    }
                                    ExportSpecifier::Named(s) => match s.exported {
                                        Some(ModuleExportName::Ident(exported)) => {
                                            let orig = match s.orig {
                                                ModuleExportName::Ident(ident) => ident,
                                                ModuleExportName::Str(..) => unimplemented!(
                                                    "module string names unimplemented"
                                                ),
                                            };
                                            props.push(PropOrSpread::Prop(Box::new(
                                                Prop::KeyValue(KeyValueProp {
                                                    key: PropName::Ident(exported.into()),
                                                    value: orig.into(),
                                                }),
                                            )));
                                        }
                                        Some(ModuleExportName::Str(..)) => {
                                            unimplemented!("module string names unimplemented")
                                        }
                                        None => {
                                            let orig = match s.orig {
                                                ModuleExportName::Ident(ident) => ident,
                                                ModuleExportName::Str(..) => unimplemented!(
                                                    "module string names unimplemented"
                                                ),
                                            };
                                            props.push(PropOrSpread::Prop(Box::new(
                                                Prop::Shorthand(orig),
                                            )));
                                        }
                                    },
                                }
                            }

                            None
                        }

                        ModuleDecl::ExportDefaultDecl(export) => match export.decl {
                            DefaultDecl::Class(expr) => {
                                let ident = expr.ident;
                                let ident =
                                    ident.unwrap_or_else(|| private_ident!("_default_decl"));

                                props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(IdentName::new(
                                            "default".into(),
                                            export.span,
                                        )),
                                        value: ident.clone().into(),
                                    },
                                ))));

                                Some(
                                    ClassDecl {
                                        ident,
                                        class: expr.class,
                                        declare: false,
                                    }
                                    .into(),
                                )
                            }
                            DefaultDecl::Fn(expr) => {
                                let ident = expr.ident;
                                let ident =
                                    ident.unwrap_or_else(|| private_ident!("_default_decl"));

                                props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(IdentName::new(
                                            "default".into(),
                                            export.span,
                                        )),
                                        value: ident.clone().into(),
                                    },
                                ))));

                                Some(
                                    FnDecl {
                                        ident,
                                        function: expr.function,
                                        declare: false,
                                    }
                                    .into(),
                                )
                            }
                            DefaultDecl::TsInterfaceDecl(_) => None,
                        },
                        ModuleDecl::ExportDefaultExpr(export) => {
                            let default_var = private_ident!("default");
                            props.push(PropOrSpread::Prop(Box::new(Prop::Shorthand(
                                default_var.clone(),
                            ))));
                            let var = VarDeclarator {
                                span: DUMMY_SP,
                                name: default_var.into(),
                                init: Some(export.expr),
                                definite: false,
                            };
                            Some(
                                VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Const,
                                    declare: false,
                                    decls: vec![var],
                                    ..Default::default()
                                }
                                .into(),
                            )
                        }

                        ModuleDecl::ExportAll(_) => None,
                    }
                })
                .collect(),
            ..Default::default()
        };
        body.stmts.push(
            ReturnStmt {
                span: DUMMY_SP,
                arg: Some(
                    ObjectLit {
                        span: DUMMY_SP,
                        props,
                    }
                    .into(),
                ),
            }
            .into(),
        );

        let f = Function {
            is_generator: false,
            is_async,
            span: DUMMY_SP,
            body: Some(body),
            ..Default::default()
        };

        let invoked_fn_expr = FnExpr {
            ident: None,
            function: Box::new(f),
        };

        let iife = CallExpr {
            span: DUMMY_SP,
            callee: invoked_fn_expr.as_callee(),
            args: Default::default(),
            ..Default::default()
        }
        .into();

        Module {
            span: DUMMY_SP,
            shebang: None,
            body: vec![ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: iife,
            }))],
        }
    }
}

/// Import renamer. This pass changes import path.
struct Renamer<'a, R>
where
    R: Resolve,
{
    resolver: R,
    base: &'a PathBuf,
    renamed: &'a AHashMap<PathBuf, String>,
}

impl<R> Fold for Renamer<'_, R>
where
    R: Resolve,
{
    noop_fold_type!();

    fn fold_import_decl(&mut self, import: ImportDecl) -> ImportDecl {
        let resolved = match self
            .resolver
            .resolve(&FileName::Real(self.base.clone()), &import.src.value)
        {
            Ok(v) => match v.filename {
                FileName::Real(v) => v,
                _ => panic!("rename_bundles called with non-path module"),
            },
            Err(_) => return import,
        };

        if let Some(v) = self.renamed.get(&resolved) {
            // We use parent because RelativePath uses ../common-[hash].js
            // if we use `entry-a.js` as a base.
            //
            // entry-a.js
            // common.js
            let base = self
                .base
                .parent()
                .unwrap_or(self.base)
                .as_os_str()
                .to_string_lossy();
            let base = RelativePath::new(&*base);
            let v = base.relative(v);
            let value = v.as_str();
            return ImportDecl {
                src: Box::new(Str {
                    value: if value.starts_with('.') {
                        value.into()
                    } else {
                        format!("./{}", value).into()
                    },
                    ..*import.src
                }),
                ..import
            };
        }

        import
    }
}
