use super::Dce;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

impl Fold for Dce<'_> {
    fn fold_expr_stmt(&mut self, node: ExprStmt) -> ExprStmt {
        log::debug!("ExprStmt ->");
        if self.is_marked(node.span) {
            return node;
        }

        if self.should_include(&node.expr) {
            log::debug!("\tIncluded");
            let stmt = ExprStmt {
                span: node.span.apply_mark(self.config.used_mark),
                expr: self.fold_in_marking_phase(node.expr),
            };
            return stmt;
        }

        node.fold_children_with(self)
    }

    fn fold_block_stmt(&mut self, node: BlockStmt) -> BlockStmt {
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

    fn fold_if_stmt(&mut self, node: IfStmt) -> IfStmt {
        if self.is_marked(node.span) {
            return node;
        }

        let mut node: IfStmt = node.fold_children_with(self);

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

    fn fold_return_stmt(&mut self, mut node: ReturnStmt) -> ReturnStmt {
        if self.is_marked(node.span) {
            return node;
        }
        node.span = node.span.apply_mark(self.config.used_mark);

        let mut node = node.fold_children_with(self);

        if self.is_marked(node.arg.span()) {
            node.arg = self.fold_in_marking_phase(node.arg)
        }

        node
    }

    fn fold_throw_stmt(&mut self, mut node: ThrowStmt) -> ThrowStmt {
        if self.is_marked(node.span) {
            return node;
        }
        node.span = node.span.apply_mark(self.config.used_mark);

        let mut node = node.fold_children_with(self);

        if self.is_marked(node.arg.span()) {
            node.arg = self.fold_in_marking_phase(node.arg)
        }

        node
    }

    fn fold_labeled_stmt(&mut self, mut node: LabeledStmt) -> LabeledStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node.body = node.body.fold_with(self);

        if self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_switch_stmt(&mut self, mut node: SwitchStmt) -> SwitchStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        // TODO: Handle fallthrough
        //  Drop useless switch case.
        //        node.cases.retain(|case| {
        //            self.is_marked(case.span)
        //        });

        if self.is_marked(node.discriminant.span())
            || node.cases.iter().any(|case| self.is_marked(case.span))
        {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.cases = self.fold_in_marking_phase(node.cases);
        }

        node
    }

    fn fold_switch_case(&mut self, mut node: SwitchCase) -> SwitchCase {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.test.span()) || node.cons.iter().any(|v| self.is_marked(v.span())) {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.cons = self.fold_in_marking_phase(node.cons);
        }

        node
    }

    fn fold_try_smt(&mut self, mut node: TryStmt) -> TryStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.block.span())
            || self.is_marked(node.handler.span())
            || self.is_marked(node.finalizer.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.block = self.fold_in_marking_phase(node.block);
            node.handler = self.fold_in_marking_phase(node.handler);
            node.finalizer = self.fold_in_marking_phase(node.finalizer);
        }

        node
    }

    fn fold_while_stmt(&mut self, mut node: WhileStmt) -> WhileStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.test.span()) || self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_do_while_stmt(&mut self, mut node: DoWhileStmt) -> DoWhileStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if self.is_marked(node.test.span()) || self.is_marked(node.body.span()) {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_for_stmt(&mut self, mut node: ForStmt) -> ForStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = node.fold_children_with(self);

        if node.test.is_none()
            || self.is_marked(node.init.span())
            || self.is_marked(node.test.span())
            || self.is_marked(node.update.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.test = self.fold_in_marking_phase(node.test);
            node.init = self.fold_in_marking_phase(node.init);
            node.update = self.fold_in_marking_phase(node.update);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }

    fn fold_for_in_stmt(&mut self, mut node: ForInStmt) -> ForInStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = ForInStmt {
            span: node.span,
            left: node.left,
            right: node.right.fold_with(self),
            body: node.body.fold_with(self),
        };

        if self.should_include(&node.left)
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.left = self.fold_in_marking_phase(node.left);
            node.right = self.fold_in_marking_phase(node.right);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }
}

impl Fold for Dce<'_> {
    fn fold_for_of_stmt(&mut self, mut node: ForOfStmt) -> ForOfStmt {
        if self.is_marked(node.span) {
            return node;
        }

        node = ForOfStmt {
            span: node.span,
            await_token: node.await_token,
            left: node.left,
            right: node.right.fold_with(self),
            body: node.body.fold_with(self),
        };

        if self.should_include(&node.left)
            || self.is_marked(node.left.span())
            || self.is_marked(node.right.span())
            || self.is_marked(node.body.span())
        {
            node.span = node.span.apply_mark(self.config.used_mark);

            node.left = self.fold_in_marking_phase(node.left);
            node.right = self.fold_in_marking_phase(node.right);
            node.body = self.fold_in_marking_phase(node.body);
        }

        node
    }
}

preserve!(DebuggerStmt);
preserve!(WithStmt);
preserve!(BreakStmt);
preserve!(ContinueStmt);
