use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn export_namespace_from() -> impl Fold + VisitMut {
    as_folder(ExportNamespaceFrom)
}

struct ExportNamespaceFrom;

#[swc_trace]
impl VisitMut for ExportNamespaceFrom {
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
                    })) if specifiers.iter().any(|s| s.is_namespace()))
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
                })) if specifiers.iter().any(|s| s.is_namespace()) => {
                    let mut origin_specifiers = vec![];

                    let mut import_specifiers = vec![];
                    let mut export_specifiers = vec![];

                    for s in specifiers.into_iter() {
                        match s {
                            ExportSpecifier::Namespace(ExportNamespaceSpecifier { span, name }) => {
                                let local_bridge =
                                    private_ident!(format!("_{}", normalize_name(&name)));

                                import_specifiers.push(ImportSpecifier::Namespace(
                                    ImportStarAsSpecifier {
                                        span,
                                        local: local_bridge.clone(),
                                    },
                                ));
                                export_specifiers.push(ExportSpecifier::Named(
                                    ExportNamedSpecifier {
                                        span,
                                        orig: local_bridge.into(),
                                        exported: Some(name),
                                        is_type_only: false,
                                    },
                                ))
                            }
                            ExportSpecifier::Default(..) | ExportSpecifier::Named(..) => {
                                origin_specifiers.push(s);
                            }
                        }
                    }

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span,
                        specifiers: import_specifiers,
                        src: src.clone(),
                        type_only: false,
                        asserts: asserts.clone(),
                    })));

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span,
                            specifiers: export_specifiers,
                            src: None,
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

fn normalize_name(module_export_name: &ModuleExportName) -> &JsWord {
    match module_export_name {
        ModuleExportName::Ident(Ident { sym: name, .. })
        | ModuleExportName::Str(Str { value: name, .. }) => name,
    }
}
