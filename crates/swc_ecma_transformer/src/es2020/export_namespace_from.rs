use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::private_ident;

use crate::{utils::normalize_module_export_name, TraverseCtx};

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ExportNamespaceFromPass
}

struct ExportNamespaceFromPass;

impl ExportNamespaceFromPass {
    fn transform_export_namespace_from(&mut self, items: &mut Vec<ModuleItem>) {
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
                    with,
                })) if specifiers.iter().any(|s| s.is_namespace()) => {
                    let mut origin_specifiers = Vec::new();

                    let mut import_specifiers = Vec::new();
                    let mut export_specifiers = Vec::new();

                    for s in specifiers.into_iter() {
                        match s {
                            ExportSpecifier::Namespace(ExportNamespaceSpecifier { span, name }) => {
                                let local_bridge = private_ident!(format!(
                                    "_{}",
                                    normalize_module_export_name(&name)
                                ));

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
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        }
                    }

                    stmts.push(
                        ImportDecl {
                            span,
                            specifiers: import_specifiers,
                            src: src.clone(),
                            type_only: false,
                            with: with.clone(),
                            phase: Default::default(),
                        }
                        .into(),
                    );

                    stmts.push(
                        NamedExport {
                            span,
                            specifiers: export_specifiers,
                            src: None,
                            type_only: false,
                            with: None,
                        }
                        .into(),
                    );

                    if !origin_specifiers.is_empty() {
                        stmts.push(
                            NamedExport {
                                span,
                                specifiers: origin_specifiers,
                                src: Some(src),
                                type_only: false,
                                with,
                            }
                            .into(),
                        );
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

impl VisitMutHook<TraverseCtx> for ExportNamespaceFromPass {
    fn exit_program(&mut self, node: &mut Program, _: &mut TraverseCtx) {
        let Program::Module(module) = node else {
            return;
        };

        self.transform_export_namespace_from(&mut module.body);
    }
}
