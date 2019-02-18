use crate::{pass::Pass, util::IdentExt};
use ast::*;
use swc_common::{Fold, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn export_namespace_from() -> impl Pass + Clone {
    ExportNamespaceFrom
}

#[derive(Clone, Copy)]
struct ExportNamespaceFrom;

impl Fold<Vec<ModuleItem>> for ExportNamespaceFrom {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        // Imports
        let mut stmts = Vec::with_capacity(items.len() + 4);
        // Statements except import
        let mut extra_stmts = Vec::with_capacity(items.len() + 4);

        for item in items {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportAllAs(export)) => {
                    let local = export.name.prefix("_").private();

                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span: DUMMY_SP,
                        specifiers: vec![ImportSpecifier::Namespace(ImportStarAs {
                            span: DUMMY_SP,
                            local: local.clone(),
                        })],
                        src: export.src,
                    })));
                    extra_stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span: DUMMY_SP,
                            specifiers: vec![ExportSpecifier::Named(NamedExportSpecifier {
                                span: DUMMY_SP,
                                orig: local,
                                exported: Some(export.name),
                            })],
                            src: None,
                        },
                    )));
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
