use rustc_hash::FxHashSet;
use swc_atoms::atom;
use swc_common::{comments::Comments, sync::Lrc, Mark, SourceMap, Spanned};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_react::{parse_expr_for_jsx, JsxDirectives};
use swc_ecma_visit::visit_mut_pass;

pub use crate::config::*;
use crate::hooks::{typescript_hook, TypeScriptCtx, TypeScriptVisitMutWithHook};

macro_rules! static_str {
    ($s:expr) => {
        $s.into()
    };
}

pub fn typescript(config: Config, unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    debug_assert_ne!(unresolved_mark, top_level_mark);

    let ctx = TypeScriptCtx::new(config.clone(), unresolved_mark, top_level_mark);
    let hook = typescript_hook(config);

    visit_mut_pass(TypeScriptVisitMutWithHook::new(hook, ctx))
}

pub fn strip(unresolved_mark: Mark, top_level_mark: Mark) -> impl Pass {
    typescript(Config::default(), unresolved_mark, top_level_mark)
}

// Old TypeScript struct removed - now using hooks

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
    let mut ctx = TypeScriptCtx::new(config.clone(), unresolved_mark, top_level_mark);

    // Create a wrapper that collects JSX pragma usage before running main hooks
    let hook = TypeScriptReactHook {
        config: config.clone(),
        tsx_config,
        comments,
        cm,
        top_level_mark,
        inner_hook: typescript_hook(config),
    };

    visit_mut_pass(TypeScriptVisitMutWithHook::new(hook, ctx))
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

// Old TypeScriptReact struct removed - now using TypeScriptReactHook

/// TypeScript + React (TSX) hook wrapper
struct TypeScriptReactHook<C, H>
where
    C: Comments,
    H: VisitMutHook<TypeScriptCtx>,
{
    config: Config,
    tsx_config: TsxConfig,
    comments: C,
    cm: Lrc<SourceMap>,
    top_level_mark: Mark,
    inner_hook: H,
}

impl<C, H> VisitMutHook<TypeScriptCtx> for TypeScriptReactHook<C, H>
where
    C: Comments,
    H: VisitMutHook<TypeScriptCtx>,
{
    fn enter_module(&mut self, n: &mut Module, ctx: &mut TypeScriptCtx) {
        // Collect JSX pragma IDs and add them to usage_info
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

            if let Some(pragma_id) = id_for_jsx(&pragma) {
                ctx.strip_import_export
                    .usage_info
                    .id_usage
                    .insert(pragma_id);
            }
            if let Some(pragma_frag_id) = id_for_jsx(&pragma_frag) {
                ctx.strip_import_export
                    .usage_info
                    .id_usage
                    .insert(pragma_frag_id);
            }

            // Parse JSX directives from comments
            let span = if n.shebang.is_some() {
                n.span
                    .with_lo(n.body.first().map(Spanned::span_lo).unwrap_or(n.span.lo))
            } else {
                n.span
            };

            let JsxDirectives {
                pragma,
                pragma_frag,
                ..
            } = self.comments.with_leading(span.lo, |comments| {
                JsxDirectives::from_comments(&self.cm, span, comments, self.top_level_mark)
            });

            if let Some(pragma) = pragma {
                if let Some(pragma_id) = id_for_jsx(&pragma) {
                    ctx.strip_import_export
                        .usage_info
                        .id_usage
                        .insert(pragma_id);
                }
            }

            if let Some(pragma_frag) = pragma_frag {
                if let Some(pragma_frag_id) = id_for_jsx(&pragma_frag) {
                    ctx.strip_import_export
                        .usage_info
                        .id_usage
                        .insert(pragma_frag_id);
                }
            }
        }

        // Delegate to inner hook
        self.inner_hook.enter_module(n, ctx);
    }

    fn exit_module(&mut self, n: &mut Module, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_module(n, ctx);
    }

    fn enter_program(&mut self, n: &mut Program, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_program(n, ctx);
    }

    fn exit_program(&mut self, n: &mut Program, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_program(n, ctx);
    }

    fn enter_stmt(&mut self, n: &mut Stmt, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_stmt(n, ctx);
    }

    fn exit_stmt(&mut self, n: &mut Stmt, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_stmt(n, ctx);
    }

    fn enter_stmts(&mut self, n: &mut Vec<Stmt>, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_stmts(n, ctx);
    }

    fn exit_stmts(&mut self, n: &mut Vec<Stmt>, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_stmts(n, ctx);
    }

    fn enter_module_item(&mut self, n: &mut ModuleItem, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_module_item(n, ctx);
    }

    fn exit_module_item(&mut self, n: &mut ModuleItem, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_module_item(n, ctx);
    }

    fn enter_module_items(&mut self, n: &mut Vec<ModuleItem>, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_module_items(n, ctx);
    }

    fn exit_module_items(&mut self, n: &mut Vec<ModuleItem>, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_module_items(n, ctx);
    }

    fn enter_expr(&mut self, n: &mut Expr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_expr(n, ctx);
    }

    fn exit_expr(&mut self, n: &mut Expr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_expr(n, ctx);
    }

    fn enter_class(&mut self, n: &mut Class, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_class(n, ctx);
    }

    fn exit_class(&mut self, n: &mut Class, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_class(n, ctx);
    }

    fn enter_class_members(&mut self, n: &mut Vec<ClassMember>, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_class_members(n, ctx);
    }

    fn exit_class_members(&mut self, n: &mut Vec<ClassMember>, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_class_members(n, ctx);
    }

    fn enter_constructor(&mut self, n: &mut Constructor, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_constructor(n, ctx);
    }

    fn exit_constructor(&mut self, n: &mut Constructor, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_constructor(n, ctx);
    }

    fn enter_ts_enum_decl(&mut self, n: &mut TsEnumDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_ts_enum_decl(n, ctx);
    }

    fn exit_ts_enum_decl(&mut self, n: &mut TsEnumDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_ts_enum_decl(n, ctx);
    }

    fn enter_ts_module_decl(&mut self, n: &mut TsModuleDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_ts_module_decl(n, ctx);
    }

    fn exit_ts_module_decl(&mut self, n: &mut TsModuleDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_ts_module_decl(n, ctx);
    }

    fn enter_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_ts_namespace_decl(n, ctx);
    }

    fn exit_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_ts_namespace_decl(n, ctx);
    }

    fn enter_export_decl(&mut self, n: &mut ExportDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_export_decl(n, ctx);
    }

    fn exit_export_decl(&mut self, n: &mut ExportDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_export_decl(n, ctx);
    }

    fn enter_export_default_decl(&mut self, n: &mut ExportDefaultDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_export_default_decl(n, ctx);
    }

    fn exit_export_default_decl(&mut self, n: &mut ExportDefaultDecl, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_export_default_decl(n, ctx);
    }

    fn enter_pat(&mut self, n: &mut Pat, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_pat(n, ctx);
    }

    fn exit_pat(&mut self, n: &mut Pat, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_pat(n, ctx);
    }

    fn enter_prop(&mut self, n: &mut Prop, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_prop(n, ctx);
    }

    fn exit_prop(&mut self, n: &mut Prop, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_prop(n, ctx);
    }

    fn enter_var_declarator(&mut self, n: &mut VarDeclarator, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_var_declarator(n, ctx);
    }

    fn exit_var_declarator(&mut self, n: &mut VarDeclarator, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_var_declarator(n, ctx);
    }

    fn enter_assign_expr(&mut self, n: &mut AssignExpr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_assign_expr(n, ctx);
    }

    fn exit_assign_expr(&mut self, n: &mut AssignExpr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_assign_expr(n, ctx);
    }

    fn enter_update_expr(&mut self, n: &mut UpdateExpr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_update_expr(n, ctx);
    }

    fn exit_update_expr(&mut self, n: &mut UpdateExpr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_update_expr(n, ctx);
    }

    fn enter_member_expr(&mut self, n: &mut MemberExpr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_member_expr(n, ctx);
    }

    fn exit_member_expr(&mut self, n: &mut MemberExpr, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_member_expr(n, ctx);
    }

    fn exit_simple_assign_target(&mut self, n: &mut SimpleAssignTarget, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_simple_assign_target(n, ctx);
    }

    fn exit_jsx_element_name(&mut self, n: &mut JSXElementName, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_jsx_element_name(n, ctx);
    }

    fn exit_jsx_object(&mut self, n: &mut JSXObject, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_jsx_object(n, ctx);
    }

    fn exit_object_pat_prop(&mut self, n: &mut ObjectPatProp, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_object_pat_prop(n, ctx);
    }

    fn enter_ts_module_block(&mut self, n: &mut TsModuleBlock, ctx: &mut TypeScriptCtx) {
        self.inner_hook.enter_ts_module_block(n, ctx);
    }

    fn exit_ts_module_block(&mut self, n: &mut TsModuleBlock, ctx: &mut TypeScriptCtx) {
        self.inner_hook.exit_ts_module_block(n, ctx);
    }
}
