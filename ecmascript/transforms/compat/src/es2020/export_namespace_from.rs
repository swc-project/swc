use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::IdentExt;
use swc_ecma_utils::IsDirective;
use swc_ecma_visit::{noop_fold_type, Fold};

pub fn export_namespace_from() -> impl Fold {
    ExportNamespaceFrom
}

struct ExportNamespaceFrom;

impl Fold for ExportNamespaceFrom {
    noop_fold_type!();

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        // Imports
        let mut stmts = Vec::with_capacity(items.len() + 4);
        // Statements except import
        let mut extra_stmts = Vec::with_capacity(items.len() + 4);

        for item in items {
            match item {
                ModuleItem::Stmt(ref s) if s.is_use_strict() => stmts.push(item),
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // Skip if it does not have namespace export
                    if export.specifiers.iter().all(|s| match *s {
                        ExportSpecifier::Named(..) | ExportSpecifier::Default(..) => true,
                        _ => false,
                    }) {
                        extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)));
                        continue;
                    }

                    match export.specifiers.remove(0) {
                        ExportSpecifier::Namespace(ns) => {
                            let local = ns.name.prefix("_").private();

                            stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
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
                            })));
                            extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                                NamedExport {
                                    span: DUMMY_SP,
                                    specifiers: vec![ExportSpecifier::Named(
                                        ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: local,
                                            exported: Some(ns.name),
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
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => stmts.push(item),
                _ => extra_stmts.push(item),
            }
        }

        stmts.append(&mut extra_stmts);

        stmts.shrink_to_fit();

        stmts
    }
}
