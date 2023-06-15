use rustc_hash::FxHashSet;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Span,
};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::NodeIgnoringSpan;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::option::CompressOptions;

#[cfg(test)]
mod tests;

/// This pass analyzes the comment and convert it to a mark.
pub(crate) fn info_marker<'a>(
    options: Option<&'a CompressOptions>,
    comments: Option<&'a dyn Comments>,
    marks: Marks,
    // unresolved_mark: Mark,
) -> impl 'a + VisitMut {
    let pure_funcs = options.map(|options| {
        options
            .pure_funcs
            .iter()
            .map(|f| NodeIgnoringSpan::borrowed(f.as_ref()))
            .collect()
    });
    InfoMarker {
        options,
        comments,
        marks,
        pure_funcs,
        // unresolved_mark,
        state: Default::default(),
        pure_callee: Default::default(),
    }
}

#[derive(Default)]
struct State {
    is_bundle: bool,
    is_in_export: bool,
}

struct InfoMarker<'a> {
    #[allow(dead_code)]
    options: Option<&'a CompressOptions>,
    pure_funcs: Option<FxHashSet<NodeIgnoringSpan<'a, Expr>>>,
    pure_callee: FxHashSet<Id>,

    comments: Option<&'a dyn Comments>,
    marks: Marks,
    // unresolved_mark: Mark,
    state: State,
}

impl VisitMut for InfoMarker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.visit_mut_children_with(self);

        if has_noinline(self.comments, n.span) {
            n.span = n.span.apply_mark(self.marks.noinline);
        }

        // We check callee in some cases because we move comments
        // See https://github.com/swc-project/swc/issues/7241
        if match &n.callee {
            Callee::Expr(e) => match &**e {
                Expr::Ident(callee) => self.pure_callee.contains(&callee.to_id()),
                _ => false,
            },
            _ => false,
        } || has_pure(self.comments, n.span)
            || match &n.callee {
                Callee::Expr(e) => match &**e {
                    Expr::Seq(callee) => has_pure(self.comments, callee.span),
                    _ => false,
                },
                _ => false,
            }
        {
            n.span = n.span.apply_mark(self.marks.pure);
        } else if let Some(pure_fns) = &self.pure_funcs {
            if let Callee::Expr(e) = &n.callee {
                // Check for pure_funcs
                Ident::within_ignored_ctxt(|| {
                    if pure_fns.contains(&NodeIgnoringSpan::borrowed(e)) {
                        n.span = n.span.apply_mark(self.marks.pure);
                    };
                })
            }
        }
    }

    fn visit_mut_export_default_decl(&mut self, e: &mut ExportDefaultDecl) {
        self.state.is_in_export = true;
        e.visit_mut_children_with(self);
        self.state.is_in_export = false;
    }

    fn visit_mut_export_default_expr(&mut self, e: &mut ExportDefaultExpr) {
        self.state.is_in_export = true;
        e.visit_mut_children_with(self);
        self.state.is_in_export = false;
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        n.visit_mut_children_with(self);

        if !self.state.is_in_export
            && n.function
                .params
                .iter()
                .any(|p| is_param_one_of(p, &["module", "__unused_webpack_module"]))
            && n.function.params.iter().any(|p| {
                is_param_one_of(
                    p,
                    &[
                        "exports",
                        "__webpack_require__",
                        "__webpack_exports__",
                        "__unused_webpack_exports",
                    ],
                )
            })
        {
            // if is_standalone(&mut n.function, self.unresolved_mark) {
            //     // self.state.is_bundle = true;

            //     // n.function.span =
            //     // n.function.span.apply_mark(self.marks.standalone);
            // }
        }
    }

    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    fn visit_mut_lit(&mut self, _: &mut Lit) {}

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_with(&mut InfoCollector {
            comments: self.comments,
            pure_callees: &mut self.pure_callee,
        });

        n.visit_mut_children_with(self);

        if self.state.is_bundle {
            tracing::info!("Running minifier in the bundle mode");
            n.span = n.span.apply_mark(self.marks.bundle_of_standalone);
        } else {
            tracing::info!("Running minifier in the normal mode");
        }
    }

    fn visit_mut_new_expr(&mut self, n: &mut NewExpr) {
        n.visit_mut_children_with(self);

        if has_pure(self.comments, n.span) {
            n.span = n.span.apply_mark(self.marks.pure);
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_with(&mut InfoCollector {
            comments: self.comments,
            pure_callees: &mut self.pure_callee,
        });

        n.visit_mut_children_with(self);

        if self.state.is_bundle {
            tracing::info!("Running minifier in the bundle mode");
            n.span = n.span.apply_mark(self.marks.bundle_of_standalone);
        } else {
            tracing::info!("Running minifier in the normal mode");
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        n.visit_mut_children_with(self);

        if has_const_ann(self.comments, n.span) {
            n.span = n.span.apply_mark(self.marks.const_ann);
        }
    }
}

fn is_param_one_of(p: &Param, allowed: &[&str]) -> bool {
    match &p.pat {
        Pat::Ident(i) => allowed.contains(&&*i.id.sym),
        _ => false,
    }
}

struct InfoCollector<'a> {
    comments: Option<&'a dyn Comments>,

    pure_callees: &'a mut FxHashSet<Id>,
}

impl InfoCollector<'_> {}

impl Visit for InfoCollector<'_> {
    noop_visit_type!();

    fn visit_export_decl(&mut self, f: &ExportDecl) {
        f.visit_children_with(self);

        if let Decl::Fn(f) = &f.decl {
            if has_flag(self.comments, f.function.span, "NO_SIDE_EFFECTS") {
                self.pure_callees.insert(f.ident.to_id());
            }
        }
    }

    fn visit_fn_decl(&mut self, f: &FnDecl) {
        f.visit_children_with(self);

        if has_flag(self.comments, f.function.span, "NO_SIDE_EFFECTS") {
            self.pure_callees.insert(f.ident.to_id());
        }
    }

    fn visit_fn_expr(&mut self, f: &FnExpr) {
        f.visit_children_with(self);

        if let Some(ident) = &f.ident {
            if has_flag(self.comments, f.function.span, "NO_SIDE_EFFECTS") {
                self.pure_callees.insert(ident.to_id());
            }
        }
    }
}

/// Check for `/** @const */`.
pub(super) fn has_const_ann(comments: Option<&dyn Comments>, span: Span) -> bool {
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
pub(super) fn has_noinline(comments: Option<&dyn Comments>, span: Span) -> bool {
    has_flag(comments, span, "NOINLINE")
}

/// Check for `/*#__PURE__*/`
pub(super) fn has_pure(comments: Option<&dyn Comments>, span: Span) -> bool {
    has_flag(comments, span, "PURE")
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
    find_comment(comments, span, |c| {
        if c.kind == CommentKind::Block {
            //
            if c.text.len() == (text.len() + 5)
                && (c.text.starts_with("#__") || c.text.starts_with("@__"))
                && c.text.ends_with("__")
                && text == &c.text[3..c.text.len() - 2]
            {
                return true;
            }
        }

        false
    })
}
