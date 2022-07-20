use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

/// `@babel/plugin-proposal-export-default-from`
pub fn export_default_from() -> impl Fold + VisitMut {
    as_folder(ExportDefaultFrom)
}

struct ExportDefaultFrom;

impl VisitMut for ExportDefaultFrom {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let count = items
            .iter()
            .filter(|m| {
                matches!(m, ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    specifiers,
                    src: Some(..),
                    type_only: false,
                    ..
                })) if specifiers.iter().any(|s| s.is_default()))
            })
            .count();

        if count == 0 {
            return;
        }

        let mut stmts = Vec::<ModuleItem>::with_capacity(items.len() + count);

        for item in items.drain(..) {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    span,
                    specifiers,
                    src: Some(src),
                    type_only: false,
                    asserts,
                })) if specifiers.iter().any(|s| s.is_default()) => {
                    let mut origin_specifiers = vec![];

                    let mut export_specifiers = vec![];

                    let mut has_namespace = false;

                    for s in specifiers.into_iter() {
                        match s {
                            ExportSpecifier::Default(ExportDefaultSpecifier { exported }) => {
                                export_specifiers.push(ExportSpecifier::Named(
                                    ExportNamedSpecifier {
                                        span: DUMMY_SP,
                                        orig: quote_ident!(exported.span, "default").into(),
                                        exported: Some(exported.into()),
                                        is_type_only: false,
                                    },
                                ));
                            }
                            ExportSpecifier::Namespace(..) => {
                                has_namespace = true;
                                origin_specifiers.push(s);
                            }
                            ExportSpecifier::Named(..) => {
                                if has_namespace {
                                    origin_specifiers.push(s);
                                } else {
                                    export_specifiers.push(s);
                                }
                            }
                        }
                    }

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span,
                            specifiers: export_specifiers,
                            src: Some(src.clone()),
                            type_only: false,
                            asserts: None,
                        },
                    )));

                    if !origin_specifiers.is_empty() {
                        stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                            NamedExport {
                                span,
                                specifiers: origin_specifiers,
                                src: Some(src),
                                type_only: false,
                                asserts,
                            },
                        )));
                    }
                }
                _ => {
                    stmts.push(item);
                }
            }
        }

        *items = stmts;
    }
}
