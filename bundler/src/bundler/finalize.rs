use crate::{hash::calc_hash, Bundle, BundleKind, Bundler, Load, ModuleType, Resolve};
use ahash::AHashMap;
use anyhow::Error;
use relative_path::RelativePath;
use std::path::{Path, PathBuf};
use swc_atoms::js_word;
use swc_common::{util::move_map::MoveMap, FileName, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::{
    fixer,
    helpers::{inject_helpers, HELPERS},
    hygiene,
};
use swc_ecma_utils::{find_ids, private_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, noop_visit_type, Fold, FoldWith, Node, Visit, VisitWith};

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
    pub(super) fn finalize(&self, bundles: Vec<Bundle>) -> Result<Vec<Bundle>, Error> {
        self.run(|| {
            let mut new = Vec::with_capacity(bundles.len());
            let mut renamed = AHashMap::default();

            for mut bundle in bundles {
                bundle.module = self.optimize(bundle.module);

                bundle.module = bundle.module.fold_with(&mut hygiene());

                bundle.module = self.may_wrap_with_iife(bundle.module);

                bundle.module = bundle.module.fold_with(&mut fixer(None));

                {
                    // Inject swc helpers
                    let swc_helpers = self
                        .scope
                        .get_module(bundle.id)
                        .expect("module should exist at this point")
                        .swc_helpers;

                    let module = bundle.module;

                    bundle.module =
                        HELPERS.set(&swc_helpers, || module.fold_with(&mut inject_helpers()));
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

                        new.push(Bundle { ..bundle });
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
                                return format!(
                                    "{}-{}",
                                    path.file_stem().unwrap().to_string_lossy(),
                                    hash,
                                )
                                .into();
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
                let path = match self.scope.get_module(bundle.id).unwrap().fm.name {
                    FileName::Real(ref v) => v.clone(),
                    _ => {
                        log::error!("Cannot rename: not a real file");
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

        let mut top_level_await_finder = TopLevelAwaitFinder::default();
        module.visit_with(&Invalid { span: DUMMY_SP }, &mut top_level_await_finder);

        let is_async = top_level_await_finder.found;

        // Properties of returned object
        let mut props = vec![];

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
                                    let ids: Vec<Ident> = find_ids(decl);
                                    props.extend(
                                        ids.into_iter()
                                            .map(Prop::Shorthand)
                                            .map(Box::new)
                                            .map(PropOrSpread::Prop),
                                    );
                                }
                                _ => unreachable!(),
                            }

                            Some(Stmt::Decl(export.decl))
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
                                                key: PropName::Ident(Ident::new(
                                                    js_word!("default"),
                                                    DUMMY_SP,
                                                )),
                                                value: Box::new(Expr::Ident(s.exported)),
                                            },
                                        ))));
                                    }
                                    ExportSpecifier::Named(s) => match s.exported {
                                        Some(exported) => {
                                            props.push(PropOrSpread::Prop(Box::new(
                                                Prop::KeyValue(KeyValueProp {
                                                    key: PropName::Ident(exported),
                                                    value: Box::new(Expr::Ident(s.orig)),
                                                }),
                                            )));
                                        }
                                        None => {
                                            props.push(PropOrSpread::Prop(Box::new(
                                                Prop::Shorthand(s.orig),
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
                                        key: PropName::Ident(Ident::new(
                                            js_word!("default"),
                                            export.span,
                                        )),
                                        value: Box::new(Expr::Ident(ident.clone())),
                                    },
                                ))));

                                Some(Stmt::Decl(Decl::Class(ClassDecl {
                                    ident,
                                    class: expr.class,
                                    declare: false,
                                })))
                            }
                            DefaultDecl::Fn(expr) => {
                                let ident = expr.ident;
                                let ident =
                                    ident.unwrap_or_else(|| private_ident!("_default_decl"));

                                props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(Ident::new(
                                            js_word!("default"),
                                            export.span,
                                        )),
                                        value: Box::new(Expr::Ident(ident.clone())),
                                    },
                                ))));

                                Some(Stmt::Decl(Decl::Fn(FnDecl {
                                    ident,
                                    function: expr.function,
                                    declare: false,
                                })))
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
                                name: Pat::Ident(default_var.into()),
                                init: Some(export.expr),
                                definite: false,
                            };
                            Some(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Const,
                                declare: false,
                                decls: vec![var],
                            })))
                        }

                        ModuleDecl::ExportAll(_) => None,
                    }
                })
                .collect(),
        };
        body.stmts.push(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props,
            }))),
        }));

        let f = Function {
            is_generator: false,
            is_async,
            params: Default::default(),
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(body),
            type_params: Default::default(),
            return_type: Default::default(),
        };

        let invoked_fn_expr = FnExpr {
            ident: None,
            function: f,
        };

        let iife = Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: invoked_fn_expr.as_callee(),
            args: Default::default(),
            type_args: Default::default(),
        }));

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

#[derive(Default)]
struct TopLevelAwaitFinder {
    found: bool,
}

impl Visit for TopLevelAwaitFinder {
    noop_visit_type!();

    fn visit_stmts(&mut self, _: &[Stmt], _: &dyn Node) {}

    fn visit_await_expr(&mut self, _: &AwaitExpr, _: &dyn Node) {
        self.found = true;
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
            Ok(v) => match v {
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
            let v = base.relative(&*v);
            let value = v.as_str();
            return ImportDecl {
                src: Str {
                    value: if value.starts_with(".") {
                        value.into()
                    } else {
                        format!("./{}", value).into()
                    },
                    ..import.src
                },
                ..import
            };
        }

        import
    }
}
