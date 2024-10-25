use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut};

/// `@babel/plugin-proposal-export-default-from`
pub fn export_default_from() -> impl Pass {
    visit_mut_pass(ExportDefaultFrom)
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
                    with,
                })) if specifiers.iter().any(|s| s.is_default()) => {
                    let mut origin_specifiers = Vec::new();

                    let mut export_specifiers = Vec::new();

                    let mut has_namespace = false;

                    for s in specifiers.into_iter() {
                        match s {
                            ExportSpecifier::Default(ExportDefaultSpecifier { exported }) => {
                                export_specifiers.push(ExportSpecifier::Named(
                                    ExportNamedSpecifier {
                                        span: DUMMY_SP,
                                        orig: quote_ident!(exported.ctxt, exported.span, "default")
                                            .into(),
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

                    stmts.push(
                        NamedExport {
                            span,
                            specifiers: export_specifiers,
                            src: Some(src.clone()),
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
