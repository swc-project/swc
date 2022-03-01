use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{IdentExt, IsDirective};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "trace", skip_all)]
pub fn export_namespace_from() -> impl Fold + VisitMut {
    as_folder(ExportNamespaceFrom)
}

struct ExportNamespaceFrom;

#[swc_trace]
impl VisitMut for ExportNamespaceFrom {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut items_updated = Vec::with_capacity(items.len() + 4);
        // Statements except imports
        let mut extra_stmts = Vec::with_capacity(items.len() + 4);
        for item in items.drain(..) {
            match item {
                ModuleItem::Stmt(ref s) if s.is_use_strict() => items_updated.push(item),
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // Skip if it does not have namespace export
                    if export.specifiers.iter().all(|s| {
                        matches!(
                            *s,
                            ExportSpecifier::Named(..) | ExportSpecifier::Default(..)
                        )
                    }) {
                        extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)));
                        continue;
                    }

                    match export.specifiers.remove(0) {
                        ExportSpecifier::Namespace(ns) => {
                            let name = match ns.name {
                                ModuleExportName::Ident(name) => name,
                                ModuleExportName::Str(..) => {
                                    unimplemented!("module string names unimplemented")
                                }
                            };
                            let local = name.prefix("_").private();

                            items_updated.push(ModuleItem::ModuleDecl(ModuleDecl::Import(
                                ImportDecl {
                                    span: DUMMY_SP,
                                    specifiers: vec![ImportSpecifier::Namespace(
                                        ImportStarAsSpecifier {
                                            span: DUMMY_SP,
                                            local: local.clone(),
                                        },
                                    )],
                                    src: export
                                        .src
                                        .clone()
                                        .expect("`export default from` requires source"),
                                    type_only: false,
                                    asserts: None,
                                },
                            )));
                            extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                                NamedExport {
                                    span: DUMMY_SP,
                                    specifiers: vec![ExportSpecifier::Named(
                                        ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: ModuleExportName::Ident(local),
                                            exported: Some(ModuleExportName::Ident(name)),
                                            is_type_only: false,
                                        },
                                    )],
                                    src: None,
                                    type_only: false,
                                    asserts: None,
                                },
                            )));
                        }
                        _ => unreachable!(),
                    };
                    if !export.specifiers.is_empty() {
                        extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)));
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => items_updated.push(item),
                _ => extra_stmts.push(item),
            }
        }

        items_updated.append(&mut extra_stmts);
        items_updated.shrink_to_fit();

        *items = items_updated;
    }
}
