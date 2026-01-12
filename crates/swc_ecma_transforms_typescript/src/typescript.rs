use swc_atoms::atom;
use swc_common::{comments::Comments, sync::Lrc, util::take::Take, Mark, SourceMap, Span, Spanned};
use swc_ecma_ast::*;

pub use crate::config::*;

pub fn typescript(config: Config, unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    debug_assert_ne!(unresolved_mark, top_level_mark);

    TypeScript {
        config,
        unresolved_mark,
        top_level_mark,
        tsx_config: None,
    }
}

pub fn strip(unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    typescript(Config::default(), unresolved_mark, top_level_mark)
}

pub(crate) struct TypeScript {
    pub config: Config,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,

    pub tsx_config: Option<TsxConfig>,
}

impl Pass for TypeScript {
    fn process(&mut self, n: &mut Program) {}
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
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl EsModuleDecl for ModuleItem {
    fn is_es_module_decl(&self) -> bool {
        self.as_module_decl()
            .is_some_and(ModuleDecl::is_es_module_decl)
    }
}

pub fn tsx<C>(
    cm: Lrc<SourceMap>,
    config: Config,
    tsx_config: TsxConfig,
    comments: C,
    unresolved_mark: Mark,
    top_level_mark: Mark,
) -> impl Pass
where
    C: Comments,
{
    TypeScript {
        config,
        unresolved_mark,
        top_level_mark,
        tsx_config: Some(tsx_config),
    }
}

/// Get an [Id] which will used by expression.
///
/// For `React#1.createElement`, this returns `React#1`.
fn id_for_jsx(e: &Expr) -> Option<Id> {
    match e {
        Expr::Ident(i) => Some(i.to_id()),
        Expr::Member(MemberExpr { obj, .. }) => Some(id_for_jsx(obj)).flatten(),
        Expr::Lit(Lit::Null(..)) => Some((atom!("null"), Default::default())),
        _ => None,
    }
}
