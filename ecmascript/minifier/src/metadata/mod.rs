use crate::marks::Marks;
use swc_common::comments::Comment;
use swc_common::comments::CommentKind;
use swc_common::comments::Comments;
use swc_common::Mark;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

#[cfg(test)]
mod tests;

/// This pass analyzes the comment
///
/// - Makes all nodes except identifiers unique in aspect of span hygiene.
/// - Convert annottatinos into [Mark].
pub(crate) fn info_marker<'a>(
    comments: Option<&'a dyn Comments>,
    marks: Marks,
) -> impl 'a + VisitMut {
    InfoMarker {
        comments,
        marks,
        state: Default::default(),
    }
}

#[derive(Default)]
struct State {
    is_bundle: bool,
}

struct InfoMarker<'a> {
    comments: Option<&'a dyn Comments>,
    marks: Marks,
    state: State,
}

impl InfoMarker<'_> {
    fn make_unique(&self, span: &mut Span) {
        debug_assert_eq!(
            span.ctxt,
            SyntaxContext::empty(),
            "Expected empty syntax context"
        );

        span.ctxt = span.ctxt.apply_mark(Mark::fresh(Mark::root()));
    }

    /// Check for `/** @const */`.
    pub(super) fn has_const_ann(&self, span: Span) -> bool {
        self.find_comment(span, |c| {
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
    pub(super) fn has_noinline(&self, span: Span) -> bool {
        self.has_flag(span, "NOINLINE")
    }

    fn find_comment<F>(&self, span: Span, mut op: F) -> bool
    where
        F: FnMut(&Comment) -> bool,
    {
        let mut found = false;
        if let Some(comments) = self.comments {
            let cs = comments.get_leading(span.lo);
            if let Some(cs) = cs {
                for c in &cs {
                    found |= op(&c);
                    if found {
                        break;
                    }
                }
            }
        }

        found
    }

    fn has_flag(&self, span: Span, text: &'static str) -> bool {
        self.find_comment(span, |c| {
            if c.kind == CommentKind::Block {
                //
                if c.text.len() == (text.len() + 5)
                    && c.text.starts_with("#__")
                    && c.text.ends_with("__")
                    && text == &c.text[3..c.text.len() - 2]
                {
                    return true;
                }
            }

            false
        })
    }
}

impl VisitMut for InfoMarker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.visit_mut_children_with(self);

        if self.has_noinline(n.span) {
            n.span = n.span.apply_mark(self.marks.noinline);
        }
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        n.visit_mut_children_with(self);

        {}

        if !n.function.params.is_empty()
            && n.function
                .params
                .iter()
                .any(|p| is_param_one_of(p, &["__webpack_exports__", "__webpack_require__"]))
        {
            self.state.is_bundle = true;

            n.function.span = n.function.span.apply_mark(self.marks.standalone);
        }
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    fn visit_mut_lit(&mut self, _: &mut Lit) {}

    fn visit_mut_module(&mut self, m: &mut Module) {
        m.visit_mut_children_with(self);

        if self.state.is_bundle {
            log::info!("Running minifier in the bundle mode");
            m.span = m.span.apply_mark(self.marks.bundle_of_standalones);
        } else {
            log::info!("Running minifier in the normal mode");
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        n.visit_mut_children_with(self);

        if self.has_const_ann(n.span) {
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

fn is_standalone<N>(n: &mut N, top_level_mark: Mark) -> bool
where
    N: VisitMutWith<IdentCollector>,
{
    let top_level_ctxt = SyntaxContext::empty().apply_mark(top_level_mark);

    let mut bindings = {
        let mut v = IdentCollector {
            top_level_ctxt,
            ids: Default::default(),
            for_binding: true,
        };
        n.visit_mut_with(&mut v);
        v.ids
    };

    let mut used = {
        let mut v = IdentCollector {
            top_level_ctxt,
            ids: Default::default(),
            for_binding: false,
        };
        n.visit_mut_with(&mut v);
        v.ids
    };

    for used_id in &used {
        if used_id.1 == top_level_ctxt {
            continue;
        }

        if bindings.contains(used_id) {
            continue;
        }

        return false;
    }

    true
}

struct IdentCollector {
    top_level_ctxt: SyntaxContext,
    ids: Vec<Id>,
    for_binding: bool,
}

impl VisitMut for IdentCollector {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.span.ctxt == self.top_level_ctxt {
            return;
        }

        self.ids.push(i.to_id());
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        match p {
            Pat::Ident(..) if !self.for_binding => {}

            _ => {
                p.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(..) if self.for_binding => {}
            _ => {
                e.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);
        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, p: &mut PropName) {
        match p {
            PropName::Computed(..) => {
                p.visit_mut_children_with(self);
            }
            _ => {}
        }
    }

    fn visit_mut_labeled_stmt(&mut self, s: &mut LabeledStmt) {
        s.body.visit_mut_with(self);
    }
}
