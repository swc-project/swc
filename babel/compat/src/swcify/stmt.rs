use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::BlockStatement;
use swc_babel_ast::Statement;
use swc_ecma_ast::BlockStmt;
use swc_ecma_ast::Stmt;

impl Swcify for BlockStatement {
    type Output = BlockStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BlockStmt {
            span: ctx.span(&self.base),
            stmts: self.body.swcify(ctx),
        }
    }
}

impl Swcify for Statement {
    type Output = Stmt;
}
