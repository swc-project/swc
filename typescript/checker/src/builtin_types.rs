use crate::{
    analyzer::{Analyzer, ScopeKind},
    errors::{Error, Errors},
    id::Id,
    loader::Load,
    ty::{self, Class, Module, Static, Type},
    validator::{Validate, ValidateWith},
    ImportInfo, ModuleTypeInfo,
};
use dashmap::DashMap;
use fxhash::FxHashMap;
use once_cell::sync::{Lazy, OnceCell};
use std::{collections::hash_map::Entry, path::PathBuf, sync::Arc};
use swc_common::{Span, VisitMutWith, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ts_builtin_types::load;
pub use swc_ts_builtin_types::Lib;

#[derive(Debug, Default)]
struct Merged {
    vars: FxHashMap<Id, Type>,
    types: FxHashMap<Id, Type>,
}

fn merge(ls: &[Lib]) -> &'static Merged {
    static CACHE: Lazy<DashMap<Vec<Lib>, OnceCell<&'static Merged>>> =
        Lazy::new(|| DashMap::with_hasher(Default::default()));

    assert_ne!(ls, &[], "libs cannot be empty");

    let mut libs = ls.to_vec();
    if libs.is_empty() {
        libs.push(Lib::Es5);
    }
    let libs = libs;

    let cache = CACHE.entry(libs).or_default();
    let key = cache.key();
    return &*cache.get_or_init(|| {
        log::info!("Loading builtins: {:?}", key);

        let mut merged = box Merged::default();
        let mut analyzer = Analyzer::for_builtin();
        let modules = load(ls);

        for (i, mut module) in modules.into_iter().enumerate() {
            match *module.body {
                TsNamespaceBody::TsModuleBlock(TsModuleBlock { ref body, .. }) => {
                    for item in body.iter() {
                        match *item {
                            ModuleItem::ModuleDecl(ref md) => unreachable!("ModuleDecl: {:#?}", md),
                            ModuleItem::Stmt(ref stmt) => match *stmt {
                                Stmt::Decl(Decl::Var(VarDecl { ref decls, .. })) => {
                                    assert_eq!(decls.len(), 1);
                                    let decl = decls.iter().next().unwrap();
                                    let mut name = match decl.name {
                                        Pat::Ident(ref i) => i,
                                        _ => unreachable!(),
                                    };
                                    merged.vars.insert(
                                        name.into(),
                                        name.type_ann
                                            .clone()
                                            .validate_with(&mut analyzer)
                                            .map(|res| {
                                                res.expect(
                                                    "builtin: failed to parse type of a variable",
                                                )
                                            })
                                            .expect("builtin: all variables should have a type"),
                                    );
                                }

                                Stmt::Decl(Decl::Fn(FnDecl {
                                    ref ident,
                                    ref function,
                                    ..
                                })) => {
                                    merged.types.insert(
                                        ident.into(),
                                        function
                                            .clone()
                                            .validate_with(&mut analyzer)
                                            .expect("builtin: failed to parse function")
                                            .into(),
                                    );
                                }

                                Stmt::Decl(Decl::Class(ref c)) => {
                                    debug_assert_eq!(
                                        merged.types.get(&c.ident.clone().into()),
                                        None
                                    );

                                    // builtin libraries does not contain a class which extends
                                    // other class.
                                    debug_assert_eq!(c.class.super_class, None);
                                    debug_assert_eq!(c.class.implements, vec![]);
                                    let ty = analyzer.with_child(
                                        ScopeKind::Flow,
                                        Default::default(),
                                        |analyzer| {
                                            Type::Class(Class {
                                                span: c.class.span,
                                                name: Some(c.ident.clone().into()),
                                                is_abstract: c.class.is_abstract,
                                                body: analyzer
                                                    .validate(&mut c.class.body.clone())
                                                    .expect(
                                                        "builtin: failed to validate class body",
                                                    )
                                                    .into_iter()
                                                    .filter_map(|v| v)
                                                    .collect(),
                                                super_class: None,
                                                // implements: vec![],
                                                type_params: c
                                                    .class
                                                    .type_params
                                                    .clone()
                                                    .validate_with(analyzer)
                                                    .map(|opt| {
                                                        opt.expect(
                                                            "builtin: failed to parse type parmas \
                                                             of a class",
                                                        )
                                                    }),
                                            })
                                        },
                                    );

                                    merged.types.insert(c.ident.clone().into(), ty);
                                }

                                Stmt::Decl(Decl::TsModule(ref m)) => {
                                    let id = match m.id {
                                        TsModuleName::Ident(ref i) => i.into(),
                                        _ => unreachable!(),
                                    };

                                    let mut analyzer = Analyzer::for_builtin();

                                    m.body.clone().visit_mut_with(&mut analyzer);

                                    match merged.types.entry(id) {
                                        Entry::Occupied(mut e) => match e.get_mut() {
                                            ty::Type::Module(module) => {
                                                //
                                                module.exports.extend(analyzer.info.exports)
                                            }

                                            ref e => unimplemented!("Merging module with {:?}", e),
                                        },
                                        Entry::Vacant(e) => {
                                            e.insert(
                                                Module {
                                                    span: DUMMY_SP,
                                                    exports: analyzer.info.exports,
                                                }
                                                .into(),
                                            );
                                        }
                                    }
                                }

                                Stmt::Decl(Decl::TsTypeAlias(ref a)) => {
                                    debug_assert_eq!(merged.types.get(&a.id.clone().into()), None);

                                    let ty = a
                                        .clone()
                                        .validate_with(&mut analyzer)
                                        .map(Type::from)
                                        .expect("builtin: failed to process type alias");

                                    merged.types.insert(a.id.clone().into(), ty);
                                }

                                // Merge interface
                                Stmt::Decl(Decl::TsInterface(ref i)) => {
                                    match merged.types.entry(i.id.clone().into()) {
                                        Entry::Occupied(mut e) => match *e.get_mut() {
                                            ty::Type::Interface(ref mut v) => {
                                                v.body.extend(
                                                    analyzer
                                                        .validate(&mut i.body.body.clone())
                                                        .expect(
                                                            "builtin: failed to parse interface \
                                                             body",
                                                        ),
                                                );
                                            }
                                            _ => unreachable!(
                                                "cannot merge interface with other type"
                                            ),
                                        },
                                        Entry::Vacant(e) => {
                                            e.insert(
                                                i.clone()
                                                    .validate_with(&mut analyzer)
                                                    .expect("builtin: failed to parse interface")
                                                    .into(),
                                            );
                                        }
                                    }
                                }

                                _ => panic!("{:#?}", item),
                            },
                        }
                    }
                }
                _ => unreachable!(),
            }
        }

        assert_eq!(analyzer.info.errors, Errors::default());

        log::info!("Loaded builtins");

        Box::leak(merged)
    });
}

pub fn get_var(libs: &[Lib], span: Span, name: &Id) -> Result<Type, Error> {
    let lib = merge(libs);

    if let Some(v) = lib.vars.get(&name) {
        return Ok(ty::Type::Static(Static { span, ty: v }));
    }

    Err(Error::NoSuchVar {
        span,
        name: name.clone(),
    })
}

pub fn get_type(libs: &[Lib], span: Span, name: &Id) -> Result<Type, Error> {
    let lib = merge(libs);

    if let Some(ty) = lib.types.get(name) {
        return Ok(ty::Type::Static(Static { span, ty }));
    }

    Err(Error::NoSuchType {
        span,
        name: name.clone(),
    })
}

struct Noop;

impl Load for Noop {
    fn load(&self, _: Arc<PathBuf>, _: &ImportInfo) -> Result<ModuleTypeInfo, Error> {
        unimplemented!()
    }
}
