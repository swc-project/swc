use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::maybe_par;

///
/// - merge exports
pub(crate) fn merge_exports() -> impl VisitMut {
    Merger::default()
}

#[derive(Default)]
struct Merger {
    specifiers: Vec<ExportSpecifier>,
}

impl VisitMut for Merger {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        let was_module = maybe_par!(
            stmts
                .iter()
                .any(|s| matches!(s, ModuleItem::ModuleDecl(..))),
            *crate::LIGHT_TASK_PARALLELS
        );

        // Fast-path
        if !was_module {
            return;
        }

        stmts.visit_mut_children_with(self);

        // Merge exports
        stmts.retain(|s| {
            !matches!(
                s,
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport { src: None, .. }))
            )
        });

        if !self.specifiers.is_empty() {
            stmts.push(
                NamedExport {
                    src: None,
                    specifiers: self.specifiers.take(),
                    span: DUMMY_SP,
                    type_only: Default::default(),
                    with: Default::default(),
                }
                .into(),
            );
        }

        // export {}, to preserve module semantics
        if was_module && stmts.iter().all(|s| matches!(s, ModuleItem::Stmt(..))) {
            stmts.push(
                NamedExport {
                    src: None,
                    specifiers: Default::default(),
                    span: DUMMY_SP,
                    type_only: Default::default(),
                    with: Default::default(),
                }
                .into(),
            );
        }
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if e.src.is_some() {
            return;
        }

        self.specifiers.append(&mut e.specifiers);
    }
}
