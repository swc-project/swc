use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::IdentExt;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

/// `@babel/plugin-proposal-export-default-from`
pub fn export_default_from() -> impl Fold + VisitMut {
    as_folder(ExportDefaultFrom)
}

struct ExportDefaultFrom;

impl VisitMut for ExportDefaultFrom {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        // Imports
        let mut stmts = Vec::with_capacity(items.len() + 4);
        // Statements except import
        let mut extra_stmts = Vec::with_capacity(items.len() + 4);

        for item in items.take() {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                    // Skip if it does not have default export
                    if export.specifiers.iter().all(|s| match *s {
                        ExportSpecifier::Named(..) | ExportSpecifier::Namespace(..) => true,
                        _ => false,
                    }) {
                        extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)));
                        continue;
                    }

                    match export.specifiers.remove(0) {
                        ExportSpecifier::Default(ExportDefaultSpecifier { exported: default }) => {
                            let local = default.prefix("_").private();

                            stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                                span: DUMMY_SP,
                                specifiers: vec![ImportSpecifier::Default(
                                    ImportDefaultSpecifier {
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
                                            exported: Some(default),
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
                ModuleItem::ModuleDecl(ModuleDecl::Import(..)) => stmts.push(item),
                _ => extra_stmts.push(item),
            }
        }

        stmts.append(&mut extra_stmts);

        *items = stmts;
    }
}
