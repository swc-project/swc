use std::mem;

use rustc_hash::FxHashSet;
use swc_common::{util::take::Take, Mark, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

pub use crate::config::*;
use crate::{strip_import_export::StripImportExport, strip_type::StripType, transform::transform};

pub fn typescript(config: Config, unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    debug_assert_ne!(unresolved_mark, top_level_mark);

    visit_mut_pass(TypeScript {
        config,
        unresolved_mark,
        top_level_mark,
        id_usage: Default::default(),
    })
}

pub fn strip(unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    typescript(Config::default(), unresolved_mark, top_level_mark)
}

pub(crate) struct TypeScript {
    pub config: Config,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,

    id_usage: FxHashSet<Id>,
}

impl VisitMut for TypeScript {
    fn visit_mut_program(&mut self, n: &mut Program) {
        let was_module = n.as_module().and_then(|m| self.get_last_module_span(m));

        if !self.config.verbatim_module_syntax {
            n.visit_mut_with(&mut StripImportExport {
                import_not_used_as_values: self.config.import_not_used_as_values,
                usage_info: mem::take(&mut self.id_usage).into(),
                ..Default::default()
            });
        }

        n.visit_mut_with(&mut StripType::default());

        n.mutate(transform(
            self.unresolved_mark,
            self.top_level_mark,
            self.config.import_export_assign_config,
            self.config.ts_enum_is_mutable,
            self.config.verbatim_module_syntax,
            self.config.native_class_properties,
        ));

        if let Some(span) = was_module {
            let module = n.as_mut_module().unwrap();
            Self::restore_esm_ctx(module, span);
        }
    }

    fn visit_mut_script(&mut self, _: &mut Script) {
        #[cfg(debug_assertions)]
        unreachable!("Use Program as entry");
        #[cfg(not(debug_assertions))]
        unreachable!();
    }

    fn visit_mut_module(&mut self, _: &mut Module) {
        #[cfg(debug_assertions)]
        unreachable!("Use Program as entry");
        #[cfg(not(debug_assertions))]
        unreachable!();
    }
}

impl TypeScript {
    fn get_last_module_span(&self, n: &Module) -> Option<Span> {
        if self.config.no_empty_export {
            return None;
        }

        n.body
            .iter()
            .rev()
            .find(|m| m.is_es_module_decl())
            .map(Spanned::span)
    }

    fn restore_esm_ctx(n: &mut Module, span: Span) {
        if n.body.iter().any(ModuleItem::is_es_module_decl) {
            return;
        }

        n.body.push(
            NamedExport {
                span,
                ..NamedExport::dummy()
            }
            .into(),
        );
    }
}

trait EsModuleDecl {
    fn is_es_module_decl(&self) -> bool;
}

impl EsModuleDecl for ModuleDecl {
    fn is_es_module_decl(&self) -> bool {
        // Do not use `matches!`
        // We should cover all cases explicitly.
        match self {
            ModuleDecl::Import(..)
            | ModuleDecl::ExportDecl(..)
            | ModuleDecl::ExportNamed(..)
            | ModuleDecl::ExportDefaultDecl(..)
            | ModuleDecl::ExportDefaultExpr(..)
            | ModuleDecl::ExportAll(..) => true,

            ModuleDecl::TsImportEquals(..)
            | ModuleDecl::TsExportAssignment(..)
            | ModuleDecl::TsNamespaceExport(..) => false,
        }
    }
}

impl EsModuleDecl for ModuleItem {
    fn is_es_module_decl(&self) -> bool {
        self.as_module_decl()
            .is_some_and(ModuleDecl::is_es_module_decl)
    }
}
