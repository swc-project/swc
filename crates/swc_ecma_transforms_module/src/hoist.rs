use std::borrow::Cow;

use indexmap::IndexMap;
use swc_atoms::JsWord;
use swc_common::{pass::CompilerPass, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, IsDirective};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn module_hoister() -> impl Fold + VisitMut + CompilerPass {
    as_folder(ModuleHoister)
}

struct ModuleHoister;

impl CompilerPass for ModuleHoister {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("module-hoister")
    }
}

impl VisitMut for ModuleHoister {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let mut found_other = false;
        let mut need_hoist_up = false;
        let mut need_hoist_down = false;

        for stmt in &module.body {
            match stmt {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) if found_other => {
                    need_hoist_up = true;
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Class(ClassExpr {
                            ident: Some(..), ..
                        })
                        | DefaultDecl::Fn(FnExpr {
                            ident: Some(..), ..
                        }),
                    ..
                })) if found_other => {
                    need_hoist_up = true;
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    specifiers,
                    src: None,
                    type_only: false,
                    asserts: None,
                    ..
                })) if !specifiers.is_empty() => {
                    need_hoist_down = true;
                }

                ModuleItem::Stmt(stmt) if stmt.is_use_strict() => {
                    // ignore
                }
                _ => {
                    found_other = true;
                }
            }

            if need_hoist_up && need_hoist_down {
                break;
            }
        }

        if !need_hoist_up && !need_hoist_down {
            return;
        }

        let stmts = if !need_hoist_up {
            module.body.take()
        } else {
            let body = module.body.take();
            let mut stmts = Vec::with_capacity(body.len());
            let mut extra = vec![];

            for item in body.into_iter() {
                match item {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => {
                        stmts.push(item);
                    }
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                        decl:
                            DefaultDecl::Class(ClassExpr {
                                ident: Some(..), ..
                            })
                            | DefaultDecl::Fn(FnExpr {
                                ident: Some(..), ..
                            }),
                        ..
                    })) => {
                        stmts.push(item);
                    }
                    ModuleItem::Stmt(ref stmt) if stmt.is_use_strict() => {
                        stmts.push(item);
                    }
                    _ => {
                        extra.push(item);
                    }
                }
            }

            stmts.extend(extra);
            stmts
        };

        // for something like
        // ```javascript
        // export { foo, bar as baz };
        // const foo = 1;
        // let bar = 2;
        // ```
        //
        // convert it into
        // ```javascript
        // const foo = 1;
        // export { foo };
        // let bar = 2;
        // export { bar as baz };
        // ```
        let stmts = if !need_hoist_down {
            stmts
        } else {
            let body = stmts;

            let mut stmts = Vec::with_capacity(body.len());
            let mut named_exports = IndexMap::<JsWord, Vec<ExportSpecifier>>::default();

            // collect all named export stmts which bind local idents
            for item in body.into_iter() {
                match item {
                    ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                        span,
                        specifiers,
                        // ignore reexport `export { x } from "x";`
                        src: None,
                        type_only: false,
                        // asserts can only appear with reexport
                        asserts: None,
                    })) if !specifiers.is_empty() => {
                        let mut retain_exports = vec![];

                        for export in specifiers.into_iter() {
                            match export {
                                ExportSpecifier::Default(ExportDefaultSpecifier {
                                    ref exported,
                                }) => {
                                    let key = exported.sym.clone();

                                    named_exports.entry(key).or_default().push(export);
                                }
                                ExportSpecifier::Named(ExportNamedSpecifier {
                                    orig: ModuleExportName::Ident(ref ident),
                                    is_type_only: false,
                                    ..
                                }) => {
                                    let key = ident.sym.clone();
                                    named_exports.entry(key).or_default().push(export);
                                }
                                _ => {
                                    retain_exports.push(export);
                                }
                            }
                        }

                        if !retain_exports.is_empty() {
                            stmts.push(ModuleItem::ModuleDecl(
                                NamedExport {
                                    span,
                                    specifiers: retain_exports,
                                    src: None,
                                    type_only: false,
                                    asserts: None,
                                }
                                .into(),
                            ))
                        }
                    }

                    _ => {
                        stmts.push(item);
                    }
                };
            }

            let body = stmts;
            let mut stmts = Vec::with_capacity(body.len() + named_exports.len() + 1);

            // append export stmts where it is declared
            for item in body.into_iter() {
                let key_list = match item {
                    ModuleItem::Stmt(Stmt::Decl(ref decl)) => {
                        match decl {
                            Decl::Class(class_decl) => vec![class_decl.ident.sym.clone()],
                            Decl::Fn(fn_decl) => vec![fn_decl.ident.sym.clone()],
                            Decl::Var(var_decl) => find_pat_ids(var_decl)
                                .into_iter()
                                .map(|x: Ident| x.sym)
                                .collect(),
                            // Decl::TsInterface(_) => {}
                            // Decl::TsTypeAlias(_) => {}
                            // Decl::TsEnum(_) => {}
                            // Decl::TsModule(_) => {}
                            _ => {
                                vec![]
                            }
                        }
                    }
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        ref specifiers,
                        ..
                    })) => specifiers
                        .iter()
                        .filter_map(|i| match i {
                            ImportSpecifier::Named(ImportNamedSpecifier {
                                local,
                                is_type_only: false,
                                ..
                            }) => Some(local.sym.clone()),
                            ImportSpecifier::Default(default) => Some(default.local.sym.clone()),
                            ImportSpecifier::Namespace(namespace) => {
                                Some(namespace.local.sym.clone())
                            }
                            _ => None,
                        })
                        .collect(),

                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                        decl:
                            DefaultDecl::Class(ClassExpr {
                                ident: Some(ref ident),
                                ..
                            })
                            | DefaultDecl::Fn(FnExpr {
                                ident: Some(ref ident),
                                ..
                            }),
                        ..
                    })) => {
                        vec![ident.sym.clone()]
                    }

                    _ => {
                        vec![]
                    }
                };

                stmts.push(item);

                if key_list.is_empty() {
                    continue;
                }

                let export_list: Vec<ExportSpecifier> = key_list
                    .iter()
                    .flat_map(|key| named_exports.remove(key))
                    .flatten()
                    .collect();

                if !export_list.is_empty() {
                    stmts.push(ModuleItem::ModuleDecl(
                        NamedExport {
                            span: DUMMY_SP,
                            specifiers: export_list,
                            src: None,
                            type_only: false,
                            asserts: None,
                        }
                        .into(),
                    ));
                }
            }

            // debug_assert!(named_exports.is_empty());
            if !named_exports.is_empty() {
                let specifiers = named_exports.into_values().flatten().collect();
                stmts.push(ModuleItem::ModuleDecl(
                    NamedExport {
                        span: DUMMY_SP,
                        specifiers,
                        src: None,
                        type_only: false,
                        asserts: None,
                    }
                    .into(),
                ));
            }

            stmts
        };

        module.body = stmts;
    }
}
