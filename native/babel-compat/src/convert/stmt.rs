use super::Context;
use crate::ast::{
    stmt::{
        BlockStatement, Statement, ExpressionStatement, EmptyStatement, DebuggerStatement,
        WithStatement, ReturnStatement, LabeledStatement, BreakStatement, ContinueStatement,
        IfStatement, SwitchStatement, SwitchCase as BabelSwitchCase, ThrowStatement, TryStatement,
        CatchClause as BabelCatchClause, WhileStatement, DoWhileStatement, ForStatement,
        ForStmtInit, ForInStatement, ForStmtLeft, ForOfStatement,
    },
};
use crate::convert::Babelify;
use swc_ecma_ast::{
    BlockStmt, Stmt, ExprStmt, EmptyStmt, DebuggerStmt, WithStmt, ReturnStmt, LabeledStmt,
    BreakStmt, ContinueStmt, IfStmt, SwitchStmt, SwitchCase, ThrowStmt, TryStmt, CatchClause,
    WhileStmt, DoWhileStmt, ForStmt, VarDeclOrExpr, ForInStmt, VarDeclOrPat, ForOfStmt, Decl,
};

impl Babelify for BlockStmt {
    type Output = BlockStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BlockStatement {
            base: ctx.base(self.span),
            body: self.stmts.iter().map(|stmt| stmt.clone().babelify(ctx)).collect(),
            directives: Default::default(),
        }
    }
}

impl Babelify for Stmt {
    type Output = Statement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Stmt::Block(s) => Statement::Block(s.babelify(ctx)),
            Stmt::Empty(s) => Statement::Empty(s.babelify(ctx)),
            Stmt::Debugger(s) => Statement::Debugger(s.babelify(ctx)),
            Stmt::With(s) => Statement::With(s.babelify(ctx)),
            Stmt::Return(s) => Statement::Return(s.babelify(ctx)),
            Stmt::Labeled(s) => Statement::Labeled(s.babelify(ctx)),
            Stmt::Break(s) => Statement::Break(s.babelify(ctx)),
            Stmt::Continue(s) => Statement::Continue(s.babelify(ctx)),
            Stmt::If(s) => Statement::If(s.babelify(ctx)),
            Stmt::Switch(s) => Statement::Switch(s.babelify(ctx)),
            Stmt::Throw(s) => Statement::Throw(s.babelify(ctx)),
            Stmt::Try(s) => Statement::Try(s.babelify(ctx)),
            Stmt::While(s) => Statement::While(s.babelify(ctx)),
            Stmt::DoWhile(s) => Statement::DoWhile(s.babelify(ctx)),
            Stmt::For(s) => Statement::For(s.babelify(ctx)),
            Stmt::ForIn(s) => Statement::ForIn(s.babelify(ctx)),
            Stmt::ForOf(s) => Statement::ForOf(s.babelify(ctx)),
            Stmt::Decl(decl) => {
                match decl {
                    Decl::Class(d) => Statement::ClassDecl(d.babelify(ctx)),
                    Decl::Fn(d) => Statement::FuncDecl(d.babelify(ctx)),
                    Decl::Var(d) => Statement::VarDecl(d.babelify(ctx)),
                    Decl::TsInterface(d) => Statement::TSInterfaceDecl(d.babelify(ctx)),
                    Decl::TsTypeAlias(d) => Statement::TSTypeAliasDecl(d.babelify(ctx)),
                    Decl::TsEnum(d) => Statement::TSEnumDecl(d.babelify(ctx)),
                    Decl::TsModule(d) => Statement::TSModuleDecl(d.babelify(ctx)),
                }
            },
            Stmt::Expr(s) => Statement::Expr(s.babelify(ctx)),
        }
    }
}

impl Babelify for ExprStmt {
    type Output = ExpressionStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ExpressionStatement {
            base: ctx.base(self.span),
            expression: self.expr.babelify(ctx).into(),
        }
    }
}

impl Babelify for EmptyStmt {
    type Output = EmptyStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        EmptyStatement {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for DebuggerStmt {
    type Output = DebuggerStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        DebuggerStatement {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for WithStmt {
    type Output = WithStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        WithStatement {
            base: ctx.base(self.span),
            object: self.obj.babelify(ctx).into(),
            body: Box::new(self.body.babelify(ctx)),
        }
    }
}

impl Babelify for ReturnStmt {
    type Output = ReturnStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ReturnStatement {
            base: ctx.base(self.span),
            argument: self.arg.map(|expr| expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for LabeledStmt {
    type Output = LabeledStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        LabeledStatement {
            base: ctx.base(self.span),
            label: self.label.babelify(ctx),
            body: Box::new(self.body.babelify(ctx)),
        }
    }
}

impl Babelify for BreakStmt {
    type Output = BreakStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BreakStatement {
            base: ctx.base(self.span),
            label: self.label.map(|id| id.babelify(ctx)),
        }
    }
}

impl Babelify for ContinueStmt {
    type Output = ContinueStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ContinueStatement {
            base: ctx.base(self.span),
            label: self.label.map(|id| id.babelify(ctx)),
        }
    }
}

impl Babelify for IfStmt {
    type Output = IfStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        IfStatement {
            base: ctx.base(self.span),
            test: self.test.babelify(ctx).into(),
            consequent: Box::new(self.cons.babelify(ctx)),
            alternate: self.alt.map(|a| Box::new(a.babelify(ctx))),
        }
    }
}

impl Babelify for SwitchStmt {
    type Output = SwitchStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        SwitchStatement {
            base: ctx.base(self.span),
            discriminant: self.discriminant.babelify(ctx).into(),
            cases: self.cases.iter().map(|case| case.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for ThrowStmt {
    type Output = ThrowStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ThrowStatement {
            base: ctx.base(self.span),
            argument: self.arg.babelify(ctx).into(),
        }
    }
}

impl Babelify for TryStmt {
    type Output = TryStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TryStatement {
            base: ctx.base(self.span),
            block: self.block.babelify(ctx),
            handler: self.handler.map(|clause| clause.babelify(ctx)),
            finalizer: self.finalizer.map(|stmt| stmt.babelify(ctx)),
        }
    }
}

impl Babelify for WhileStmt {
    type Output = WhileStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        WhileStatement {
            base: ctx.base(self.span),
            test: self.test.babelify(ctx).into(),
            body: Box::new(self.body.babelify(ctx)),
        }
    }
}

impl Babelify for DoWhileStmt {
    type Output = DoWhileStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        DoWhileStatement {
            base: ctx.base(self.span),
            test: self.test.babelify(ctx).into(),
            body: Box::new(self.body.babelify(ctx)),
        }
    }
}

impl Babelify for ForStmt {
    type Output = ForStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ForStatement {
            base: ctx.base(self.span),
            init: self.init.map(|i| i.babelify(ctx)),
            test: self.test.map(|expr| expr.babelify(ctx).into()),
            update: self.update.map(|expr| expr.babelify(ctx).into()),
            body: Box::new(self.body.babelify(ctx)),
        }
    }
}

impl Babelify for ForInStmt {
    type Output = ForInStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ForInStatement {
            base: ctx.base(self.span),
            left: self.left.babelify(ctx),
            right: self.right.babelify(ctx).into(),
            body: Box::new(self.body.babelify(ctx)),
        }
    }
}

impl Babelify for ForOfStmt {
    type Output = ForOfStatement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ForOfStatement {
            base: ctx.base(self.span),
            left: self.left.babelify(ctx),
            right: self.right.babelify(ctx).into(),
            body: Box::new(self.body.babelify(ctx)),
            // await_token not yet implemented
        }
    }
}

impl Babelify for SwitchCase {
    type Output = BabelSwitchCase;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelSwitchCase {
            base: ctx.base(self.span),
            test: self.test.map(|expr| expr.babelify(ctx).into()),
            consequent: self.cons.iter().map(|stmt| stmt.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for CatchClause {
    type Output = BabelCatchClause;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelCatchClause {
            base: ctx.base(self.span),
            param: self.param.map(|p| p.babelify(ctx).into()),
            body: self.body.babelify(ctx),
        }
    }
}

impl Babelify for VarDeclOrPat {
    type Output = ForStmtLeft;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            VarDeclOrPat::VarDecl(v) => ForStmtLeft::VarDecl(v.babelify(ctx)),
            VarDeclOrPat::Pat(p) => ForStmtLeft::LVal(p.babelify(ctx).into()),
        }
    }
}

impl Babelify for VarDeclOrExpr {
    type Output = ForStmtInit;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            VarDeclOrExpr::VarDecl(v) => ForStmtInit::VarDecl(v.babelify(ctx)),
            VarDeclOrExpr::Expr(e) => ForStmtInit::Expr(e.babelify(ctx).into()),
        }
    }
}

