use std::mem;

use rustc_hash::FxHashSet;
use swc_atoms::atom;
use swc_common::{comments::Comments, sync::Lrc, util::take::Take, Mark, SourceMap, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_transforms_react::{parse_expr_for_jsx, JsxDirectives};

pub use crate::config::*;
use crate::{semantic::analyze_program, transform::transform};

macro_rules! static_str {
    ($s:expr) => {
        $s.into()
    };
}

pub fn typescript(config: Config, unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    debug_assert_ne!(unresolved_mark, top_level_mark);

    TypeScript {
        config,
        unresolved_mark,
        top_level_mark,
        id_usage: Default::default(),
    }
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

impl Pass for TypeScript {
    fn process(&mut self, n: &mut Program) {
        let was_module = n.as_module().and_then(|m| self.get_last_module_span(m));
        let semantic = analyze_program(n, self.unresolved_mark, mem::take(&mut self.id_usage));

        n.mutate(transform(
            self.unresolved_mark,
            self.top_level_mark,
            semantic,
            self.config.import_not_used_as_values,
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
    TypeScriptReact {
        config,
        tsx_config,
        id_usage: Default::default(),
        comments,
        cm,
        top_level_mark,
        unresolved_mark,
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

struct TypeScriptReact<C>
where
    C: Comments,
{
    config: Config,
    tsx_config: TsxConfig,
    id_usage: FxHashSet<Id>,
    comments: C,
    cm: Lrc<SourceMap>,
    top_level_mark: Mark,
    unresolved_mark: Mark,
}

fn module_leading_comment_span(module: &Module) -> Span {
    if module.shebang.is_some() {
        module.span.with_lo(
            module
                .body
                .first()
                .map(|item| item.span_lo())
                .unwrap_or(module.span.lo),
        )
    } else {
        module.span
    }
}

impl<C> TypeScriptReact<C>
where
    C: Comments,
{
    fn insert_jsx_id_usage(&mut self, expr: &Expr) {
        if let Some(id) = id_for_jsx(expr) {
            self.id_usage.insert(id);
        }
    }

    fn collect_pragma_id_usage(&mut self, module: &Module) {
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
                    .unwrap_or_else(|| static_str!("React.createElement")),
                self.top_level_mark,
            );

            let pragma_frag = parse_expr_for_jsx(
                &self.cm,
                "pragma",
                self.tsx_config
                    .pragma_frag
                    .clone()
                    .unwrap_or_else(|| static_str!("React.Fragment")),
                self.top_level_mark,
            );

            self.insert_jsx_id_usage(&pragma);
            self.insert_jsx_id_usage(&pragma_frag);

            let span = module_leading_comment_span(module);

            let JsxDirectives {
                pragma,
                pragma_frag,
                ..
            } = self.comments.with_leading(span.lo, |comments| {
                JsxDirectives::from_comments(&self.cm, span, comments, self.top_level_mark)
            });

            if let Some(pragma) = pragma {
                self.insert_jsx_id_usage(&pragma);
            }

            if let Some(pragma_frag) = pragma_frag {
                self.insert_jsx_id_usage(&pragma_frag);
            }
        }
    }
}

impl<C> Pass for TypeScriptReact<C>
where
    C: Comments,
{
    fn process(&mut self, n: &mut Program) {
        if let Program::Module(module) = n {
            self.collect_pragma_id_usage(module);
        }

        let mut pass = TypeScript {
            config: mem::take(&mut self.config),
            unresolved_mark: self.unresolved_mark,
            top_level_mark: self.top_level_mark,
            id_usage: mem::take(&mut self.id_usage),
        };

        pass.process(n);
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{BytePos, Span, DUMMY_SP};

    use super::*;

    fn span(lo: u32, hi: u32) -> Span {
        Span::new(BytePos(lo), BytePos(hi))
    }

    #[test]
    fn id_for_jsx_resolves_root_ident() {
        let react = Ident::new_no_ctxt("React".into(), DUMMY_SP);
        let expr = Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(react.clone())),
            prop: MemberProp::Ident(IdentName::new("createElement".into(), DUMMY_SP)),
        });

        assert_eq!(id_for_jsx(&expr), Some(react.to_id()));
    }

    #[test]
    fn module_leading_comment_span_uses_first_item_when_shebang_exists() {
        let module = Module {
            span: span(1, 10),
            body: vec![ModuleItem::Stmt(Stmt::Empty(EmptyStmt {
                span: span(4, 5),
            }))],
            shebang: Some("usr/bin/env node".into()),
        };

        assert_eq!(module_leading_comment_span(&module), span(4, 10));
    }
}
