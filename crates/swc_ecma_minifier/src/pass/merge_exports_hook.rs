//! Hook-based export merger.
//!
//! This module provides a hook-based implementation of the export merger pass,
//! which can be combined with other hooks for a single AST traversal.

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{maybe_par, metadata::hook::InfoMarkerCtx};

/// Hook for merging export statements.
#[derive(Default)]
pub(crate) struct MergeExportsHook {
    specifiers: Vec<ExportSpecifier>,
}

impl MergeExportsHook {
    pub(crate) fn new() -> Self {
        Self::default()
    }
}

impl VisitMutHook<InfoMarkerCtx> for MergeExportsHook {
    fn exit_module_items(&mut self, stmts: &mut Vec<ModuleItem>, _ctx: &mut InfoMarkerCtx) {
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
        if stmts.iter().all(|s| matches!(s, ModuleItem::Stmt(..))) {
            debug_assert!(was_module);
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

    fn enter_named_export(&mut self, e: &mut NamedExport, _ctx: &mut InfoMarkerCtx) {
        if e.src.is_some() {
            return;
        }

        self.specifiers.append(&mut e.specifiers);
    }
}
