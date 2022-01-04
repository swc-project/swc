use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};
use swc_node_comments::SwcComments;

/// Add `@ts-ignore` to all statements.
pub fn ignore_typescript(comments: SwcComments) -> impl VisitMut {
    AddTypes { comments }
}

struct AddTypes {
    comments: SwcComments,
}

impl VisitMut for AddTypes {
    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        self.comments.add_leading(
            s.span().lo,
            Comment {
                kind: CommentKind::Line,
                span: DUMMY_SP,
                text: "// @ts-ignore".into(),
            },
        );
    }
}
