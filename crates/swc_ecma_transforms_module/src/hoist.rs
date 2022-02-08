use std::{borrow::Cow, mem::take};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, pass::CompilerPass, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn import_hoister() -> impl Fold + VisitMut + CompilerPass {
    as_folder(ImportHoister)
}

struct ImportHoister;

impl CompilerPass for ImportHoister {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("import-hoister")
    }
}

impl VisitMut for ImportHoister {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let mut found_other = false;
        let mut need_work = false;

        for stmt in &module.body {
            match stmt {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => {
                    if found_other {
                        need_work = true;
                        break;
                    }
                }
                _ => {
                    found_other = true;
                }
            }
        }

        if !need_work {
            return;
        }

        let mut imports = Vec::with_capacity(module.body.len());
        let mut extra = vec![];

        for body in take(&mut module.body) {
            match body {
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => {
                    imports.push(body);
                }
                _ => {
                    extra.push(body);
                }
            }
        }

        imports.extend(extra);
        module.body = imports;
    }
}

pub fn export_hoister() -> impl Fold + VisitMut + CompilerPass {
    as_folder(ExportHoister)
}

/// for something like
/// ```javascript
/// export { foo, bar as baz };
/// const foo = 1;
/// let bar = 2;
/// ```
///
/// convert it into
/// ```javascript
/// const foo = 1;
/// export { foo };
/// let bar = 2;
/// export { bar as baz };
/// ```
struct ExportHoister;

impl CompilerPass for ExportHoister {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("export-hoister")
    }
}

impl VisitMut for ExportHoister {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let mut named_exports = AHashMap::<JsWord, Vec<ExportSpecifier>>::default();
        let mut default_export = None;

        let mut stmts = Vec::with_capacity(module.body.len());

        // collect all export stmts which bind local idents
        for item in take(&mut module.body) {
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
                            ExportSpecifier::Default(ExportDefaultSpecifier { ref exported }) => {
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
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    ref expr,
                    ..
                })) if expr.is_ident() => {
                    let key = expr.as_ident().unwrap().sym.clone();

                    default_export = Some((key, item));
                }
                _ => {
                    stmts.push(item);
                }
            };
        }

        let mut stmts_sorted = Vec::with_capacity(stmts.len() + named_exports.len() + 1);

        // append export stmts where it is declared
        for item in stmts.into_iter() {
            let key_list = match item {
                ModuleItem::Stmt(Stmt::Decl(ref decl)) => {
                    match decl {
                        Decl::Class(class_decl) => vec![class_decl.ident.sym.clone()],
                        Decl::Fn(fn_decl) => vec![fn_decl.ident.sym.clone()],
                        Decl::Var(var_decl) => find_ids(var_decl)
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
                    ref specifiers, ..
                })) => specifiers
                    .iter()
                    .filter_map(|i| match i {
                        ImportSpecifier::Named(ImportNamedSpecifier {
                            local,
                            is_type_only: false,
                            ..
                        }) => Some(local.sym.clone()),
                        ImportSpecifier::Default(default) => Some(default.local.sym.clone()),
                        ImportSpecifier::Namespace(namespace) => Some(namespace.local.sym.clone()),
                        _ => None,
                    })
                    .collect(),

                _ => {
                    vec![]
                }
            };

            stmts_sorted.push(item);

            if key_list.is_empty() {
                continue;
            }

            let export_list: Vec<ExportSpecifier> = key_list
                .iter()
                .flat_map(|key| named_exports.remove(key))
                .flatten()
                .collect();

            if !export_list.is_empty() {
                stmts_sorted.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    NamedExport {
                        span: DUMMY_SP,
                        specifiers: export_list,
                        src: None,
                        type_only: false,
                        asserts: None,
                    },
                )));
            }

            if let Some((export_key, item)) = default_export.take() {
                if key_list.contains(&export_key) {
                    stmts_sorted.push(item)
                } else {
                    default_export = Some((export_key, item));
                }
            }
        }

        debug_assert!(named_exports.is_empty());

        module.body = stmts_sorted;
    }
}
