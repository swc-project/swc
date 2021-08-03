use crate::marks::Marks;
use swc_common::comments::Comment;
use swc_common::comments::CommentKind;
use swc_common::comments::Comments;
use swc_common::Mark;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// This pass analyzes the comment
///
/// - Makes all nodes except identifiers unique in aspect of span hygiene.
/// - Convert annottatinos into [Mark].
pub(crate) fn info_marker<'a>(
    comments: Option<&'a dyn Comments>,
    marks: Marks,
) -> impl 'a + VisitMut {
    InfoMarker { comments, marks }
}

struct InfoMarker<'a> {
    comments: Option<&'a dyn Comments>,
    marks: Marks,
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

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    fn visit_mut_lit(&mut self, _: &mut Lit) {}

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        n.visit_mut_children_with(self);

        if self.has_const_ann(n.span) {
            n.span = n.span.apply_mark(self.marks.const_ann);
        }
    }
}
