use std::mem;

use swc_atoms::js_word;
use swc_common::{
    collections::AHashSet, comments::Comments, sync::Lrc, util::take::Take, Mark, SourceMap, Span,
    Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_react::{parse_expr_for_jsx, JsxDirectives};
use swc_ecma_visit::{as_folder, Fold, VisitMut, VisitMutWith};

pub use crate::config::*;
use crate::{strip_import_export::StripImportExport, strip_type::StripType, transform::transform};

pub fn typescript(config: Config, unresolved_mark: Mark) -> impl Fold + VisitMut {
    as_folder(TypeScript {
        config,
        unresolved_mark,
        id_usage: Default::default(),
    })
}

pub fn strip(unresolved_mark: Mark) -> impl Fold + VisitMut {
    typescript(Config::default(), unresolved_mark)
}

pub(crate) struct TypeScript {
    pub config: Config,
    pub unresolved_mark: Mark,

    id_usage: AHashSet<Id>,
}

impl VisitMut for TypeScript {
    fn visit_mut_program(&mut self, n: &mut Program) {
        let was_module = n.as_module().and_then(|m| self.get_last_module_span(m));

        if !self.config.verbatim_module_syntax {
            n.visit_mut_with(&mut StripImportExport {
                id_usage: mem::take(&mut self.id_usage),
                import_not_used_as_values: self.config.import_not_used_as_values,
            });
        }

        n.visit_mut_with(&mut StripType::default());

        n.visit_mut_with(&mut transform(
            self.unresolved_mark,
            self.config.import_export_assign_config,
            self.config.verbatim_module_syntax,
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
            .find(|m| m.is_module_decl())
            .map(Spanned::span)
    }

    fn restore_esm_ctx(n: &mut Module, span: Span) {
        if n.body.iter().any(ModuleItem::is_module_decl) {
            return;
        }

        n.body.push(ModuleItem::ModuleDecl(
            NamedExport {
                span,
                ..NamedExport::dummy()
            }
            .into(),
        ));
    }
}

pub fn tsx<C>(
    cm: Lrc<SourceMap>,
    config: Config,
    tsx_config: TsxConfig,
    comments: C,
    unresolved_mark: Mark,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    as_folder(TypeScriptReact {
        config,
        tsx_config,
        id_usage: Default::default(),
        comments,
        cm,
        unresolved_mark,
    })
}

/// Get an [Id] which will used by expression.
///
/// For `React#1.createElement`, this returns `React#1`.
fn id_for_jsx(e: &Expr) -> Id {
    match e {
        Expr::Ident(i) => i.to_id(),
        Expr::Member(MemberExpr { obj, .. }) => id_for_jsx(obj),
        Expr::Lit(Lit::Null(..)) => (js_word!("null"), Default::default()),
        _ => {
            panic!("failed to determine top-level Id for jsx expression")
        }
    }
}

struct TypeScriptReact<C>
where
    C: Comments,
{
    config: Config,
    tsx_config: TsxConfig,
    id_usage: AHashSet<Id>,
    comments: C,
    cm: Lrc<SourceMap>,
    unresolved_mark: Mark,
}

impl<C> VisitMut for TypeScriptReact<C>
where
    C: Comments,
{
    fn visit_mut_module(&mut self, n: &mut Module) {
        // We count `React` or pragma from config as ident usage and do not strip it
        // from import statement.
        // But in `verbatim_module_syntax` mode, we do not remove any unused imports.
        // So we do not need to collect usage info.
        if !self.config.verbatim_module_syntax {
            let pragma = parse_expr_for_jsx(
                &self.cm,
                "pragma",
                self.tsx_config
                    .pragma
                    .clone()
                    .unwrap_or_else(|| "React.createElement".to_string()),
                self.unresolved_mark,
            );

            let pragma_frag = parse_expr_for_jsx(
                &self.cm,
                "pragma",
                self.tsx_config
                    .pragma_frag
                    .clone()
                    .unwrap_or_else(|| "React.Fragment".to_string()),
                self.unresolved_mark,
            );

            let pragma_id = id_for_jsx(&pragma);
            let pragma_frag_id = id_for_jsx(&pragma_frag);

            self.id_usage.insert(pragma_id);
            self.id_usage.insert(pragma_frag_id);
        }

        if !self.config.verbatim_module_syntax {
            let span = n.span;

            let JsxDirectives {
                pragma,
                pragma_frag,
                ..
            } = self.comments.with_leading(span.lo, |comments| {
                JsxDirectives::from_comments(&self.cm, span, comments, self.unresolved_mark)
            });

            if let Some(pragma) = pragma {
                let pragma_id = id_for_jsx(&pragma);
                self.id_usage.insert(pragma_id);
            }

            if let Some(pragma_frag) = pragma_frag {
                let pragma_frag_id = id_for_jsx(&pragma_frag);
                self.id_usage.insert(pragma_frag_id);
            }
        }
    }

    fn visit_mut_script(&mut self, _: &mut Script) {
        // skip script
    }

    fn visit_mut_program(&mut self, n: &mut Program) {
        n.visit_mut_children_with(self);

        n.visit_mut_with(&mut TypeScript {
            config: mem::take(&mut self.config),
            unresolved_mark: self.unresolved_mark,
            id_usage: mem::take(&mut self.id_usage),
        });
    }
}
