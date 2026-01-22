//! Hook-based info marker for comment-based annotations.
//!
//! This module provides a hook-based implementation of the info marker pass,
//! which can be combined with other hooks for a single AST traversal.

use rustc_hash::FxHashSet;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Span, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::NodeIgnoringSpan;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::option::CompressOptions;

/// Context for the info marker hook.
pub(crate) struct InfoMarkerCtx;

/// Hook for marking pure functions and constants based on comments.
pub(crate) struct InfoMarkerHook<'a> {
    #[allow(dead_code)]
    options: Option<&'a CompressOptions>,
    pure_funcs: Option<FxHashSet<NodeIgnoringSpan<'a, Expr>>>,
    pure_callee: FxHashSet<Id>,

    comments: Option<&'a dyn Comments>,
    marks: Marks,
}

impl<'a> InfoMarkerHook<'a> {
    pub(crate) fn new(
        options: Option<&'a CompressOptions>,
        comments: Option<&'a dyn Comments>,
        marks: Marks,
    ) -> Self {
        let pure_funcs = options.map(|options| {
            options
                .pure_funcs
                .iter()
                .map(|f| NodeIgnoringSpan::borrowed(f.as_ref()))
                .collect()
        });
        Self {
            options,
            comments,
            marks,
            pure_funcs,
            pure_callee: Default::default(),
        }
    }

    fn is_pure_callee(&self, callee: &Expr) -> bool {
        match callee {
            Expr::Ident(callee) => {
                if self.pure_callee.contains(&callee.to_id()) {
                    return true;
                }
            }

            Expr::Seq(callee) => {
                if has_pure(self.comments, callee.span) {
                    return true;
                }
            }
            _ => (),
        }

        if let Some(pure_fns) = &self.pure_funcs {
            if let Expr::Ident(..) = callee {
                // Check for pure_funcs
                if Ident::within_ignored_ctxt(|| {
                    pure_fns.contains(&NodeIgnoringSpan::borrowed(callee))
                }) {
                    return true;
                }
            }
        }

        has_pure(self.comments, callee.span())
    }
}

impl VisitMutHook<InfoMarkerCtx> for InfoMarkerHook<'_> {
    fn enter_module(&mut self, n: &mut Module, _ctx: &mut InfoMarkerCtx) {
        // Run the info collector first to collect pure callees
        let mut collector = InfoCollector {
            comments: self.comments,
            pure_callees: &mut self.pure_callee,
        };
        n.visit_with(&mut collector);
    }

    fn enter_script(&mut self, n: &mut Script, _ctx: &mut InfoMarkerCtx) {
        // Run the info collector first to collect pure callees
        let mut collector = InfoCollector {
            comments: self.comments,
            pure_callees: &mut self.pure_callee,
        };
        n.visit_with(&mut collector);
    }

    fn exit_call_expr(&mut self, n: &mut CallExpr, _ctx: &mut InfoMarkerCtx) {
        // TODO: remove after we figure out how to move comments properly
        if has_noinline(self.comments, n.span)
            || match &n.callee {
                Callee::Expr(e) => has_noinline(self.comments, e.span()),
                _ => false,
            }
        {
            n.ctxt = n.ctxt.apply_mark(self.marks.noinline);
        }

        // We check callee in some cases because we move comments
        // See https://github.com/swc-project/swc/issues/7241
        if match &n.callee {
            Callee::Expr(e) => self.is_pure_callee(e),
            _ => false,
        } || has_pure(self.comments, n.span)
        {
            if !n.span.is_dummy_ignoring_cmt() {
                n.ctxt = n.ctxt.apply_mark(self.marks.pure);
            }
        } else if let Some(pure_fns) = &self.pure_funcs {
            if let Callee::Expr(e) = &n.callee {
                // Check for pure_funcs
                Ident::within_ignored_ctxt(|| {
                    if pure_fns.contains(&NodeIgnoringSpan::borrowed(e)) {
                        n.ctxt = n.ctxt.apply_mark(self.marks.pure);
                    };
                })
            }
        }
    }

    fn exit_new_expr(&mut self, n: &mut NewExpr, _ctx: &mut InfoMarkerCtx) {
        // Only check for @__PURE__ comment on the new expression itself.
        // We don't check the callee's @__PURE__ comment because that applies to
        // function calls, not construction.
        // The purity check for class/function expressions is done via
        // is_pure_callee in may_have_side_effects.
        if has_pure(self.comments, n.span) {
            n.ctxt = n.ctxt.apply_mark(self.marks.pure);
        }
    }

    fn exit_tagged_tpl(&mut self, n: &mut TaggedTpl, _ctx: &mut InfoMarkerCtx) {
        if has_pure(self.comments, n.span) || self.is_pure_callee(&n.tag) {
            if !n.span.is_dummy_ignoring_cmt() {
                n.ctxt = n.ctxt.apply_mark(self.marks.pure);
            }
        }
    }

    fn exit_var_decl(&mut self, n: &mut VarDecl, _ctx: &mut InfoMarkerCtx) {
        if has_const_ann(self.comments, n.span) {
            n.ctxt = n.ctxt.apply_mark(self.marks.const_ann);
        }
    }
}

const NO_SIDE_EFFECTS_FLAG: &str = "NO_SIDE_EFFECTS";

struct InfoCollector<'a> {
    comments: Option<&'a dyn Comments>,
    pure_callees: &'a mut FxHashSet<Id>,
}

impl Visit for InfoCollector<'_> {
    noop_visit_type!(fail);

    fn visit_export_decl(&mut self, f: &ExportDecl) {
        f.visit_children_with(self);

        if let Decl::Fn(f) = &f.decl {
            if has_flag(self.comments, f.function.span, NO_SIDE_EFFECTS_FLAG) {
                self.pure_callees.insert(f.ident.to_id());
            }
        }
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        f.visit_children_with(self);

        if has_flag(self.comments, f.function.span, NO_SIDE_EFFECTS_FLAG) {
            self.pure_callees.insert(f.ident.to_id());
        }
    }

    fn visit_fn_expr(&mut self, f: &FnExpr) {
        f.visit_children_with(self);

        if let Some(ident) = &f.ident {
            if has_flag(self.comments, f.function.span, NO_SIDE_EFFECTS_FLAG) {
                self.pure_callees.insert(ident.to_id());
            }
        }
    }

    fn visit_var_decl(&mut self, decl: &VarDecl) {
        decl.visit_children_with(self);

        for v in &decl.decls {
            if let Pat::Ident(ident) = &v.name {
                if let Some(init) = &v.init {
                    if has_flag(self.comments, decl.span, NO_SIDE_EFFECTS_FLAG)
                        || has_flag(self.comments, v.span, NO_SIDE_EFFECTS_FLAG)
                        || has_flag(self.comments, init.span(), NO_SIDE_EFFECTS_FLAG)
                    {
                        self.pure_callees.insert(ident.to_id());
                    }
                }
            }
        }
    }
}

/// Check for `/** @const */`.
fn has_const_ann(comments: Option<&dyn Comments>, span: Span) -> bool {
    find_comment(comments, span, |c| {
        if c.kind == CommentKind::Block {
            if !c.text.starts_with('*') {
                return false;
            }
            let t = c.text[1..].trim();
            //
            if t.starts_with("@const") {
                return true;
            }
        }

        false
    })
}

/// Check for `/*#__NOINLINE__*/`
fn has_noinline(comments: Option<&dyn Comments>, span: Span) -> bool {
    has_flag(comments, span, "NOINLINE")
}

/// Check for `/*#__PURE__*/`
fn has_pure(comments: Option<&dyn Comments>, span: Span) -> bool {
    span.is_pure() || has_flag(comments, span, "PURE")
}

fn find_comment<F>(comments: Option<&dyn Comments>, span: Span, mut op: F) -> bool
where
    F: FnMut(&Comment) -> bool,
{
    let mut found = false;
    if let Some(comments) = comments {
        let cs = comments.get_leading(span.lo);
        if let Some(cs) = cs {
            for c in &cs {
                found |= op(c);
                if found {
                    break;
                }
            }
        }
    }

    found
}

fn has_flag(comments: Option<&dyn Comments>, span: Span, text: &'static str) -> bool {
    if span.is_dummy_ignoring_cmt() {
        return false;
    }

    comments.has_flag(span.lo, text)
}
