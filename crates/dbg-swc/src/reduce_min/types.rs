use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};
use swc_node_comments::SwcComments;

/// Add `@ts-ignore` to all statements.
pub fn ignore_typescript(comments: SwcComments) -> impl VisitMut {
    AddTypes {
        comments,
        should_not_annotate_type: Default::default(),
    }
}

struct AddTypes {
    comments: SwcComments,

    should_not_annotate_type: bool,
}

impl VisitMut for AddTypes {
    ///
    /// - `(this.foo)` => `(this as any).foo`
    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.visit_mut_children_with(self);

        match &*e.obj {
            Expr::This(..) => {
                e.obj = Expr::Paren(ParenExpr {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::TsAs(TsAsExpr {
                        span: DUMMY_SP,
                        expr: e.obj.clone(),
                        type_ann: any_type(),
                    })),
                })
                .into();
            }
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        self.comments.add_leading(
            s.span().lo,
            Comment {
                kind: CommentKind::Line,
                span: DUMMY_SP,
                text: "@ts-ignore".into(),
            },
        );
    }

    fn visit_mut_var_decl_or_expr(&mut self, n: &mut VarDeclOrExpr) {
        let old = self.should_not_annotate_type;
        self.should_not_annotate_type = true;
        n.visit_mut_children_with(self);
        self.should_not_annotate_type = old;
    }

    fn visit_mut_var_decl_or_pat(&mut self, n: &mut VarDeclOrPat) {
        let old = self.should_not_annotate_type;
        self.should_not_annotate_type = true;
        n.visit_mut_children_with(self);
        self.should_not_annotate_type = old;
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        v.visit_mut_children_with(self);

        if !self.should_not_annotate_type {
            match &mut v.name {
                Pat::Ident(id) => {
                    id.type_ann = Some(TsTypeAnn {
                        span: DUMMY_SP,
                        type_ann: any_type(),
                    });
                }

                _ => {}
            }
        }
    }
}

fn any_type() -> Box<TsType> {
    Box::new(TsType::TsKeywordType(TsKeywordType {
        span: DUMMY_SP,
        kind: TsKeywordTypeKind::TsAnyKeyword,
    }))
}
