use super::Dce;
use swc_common::{fold::FoldWith, Fold, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

impl Fold<ExprStmt> for Dce<'_> {
    fn fold(&mut self, node: ExprStmt) -> ExprStmt {
        if self.is_marked(node.span) {
            return node;
        }

        if node.expr.may_have_side_effects() {
            let stmt = ExprStmt {
                span: node.span.apply_mark(self.config.used_mark),
                expr: self.fold_in_marking_phase(node.expr),
            };
            return stmt;
        }

        node.fold_children(self)
    }
}

impl Fold<BlockStmt> for Dce<'_> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let stmts = node.stmts.fold_with(self);

        let mut span = node.span;
        if stmts.iter().any(|stmt| self.is_marked(stmt.span())) {
            span = span.apply_mark(self.config.used_mark);
        }

        BlockStmt { span, stmts }
    }
}

impl Fold<IfStmt> for Dce<'_> {
    fn fold(&mut self, node: IfStmt) -> IfStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let mut node: IfStmt = node.fold_children(self);

        if self.is_marked(node.test.span())
            || self.is_marked(node.cons.span())
            || self.is_marked(node.alt.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.cons = self.fold_in_marking_phase(node.cons);
            node.alt = self.fold_in_marking_phase(node.alt);
        }

        node
    }
}
