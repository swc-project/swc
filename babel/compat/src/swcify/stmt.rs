use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::BlockStatement;
use swc_babel_ast::BreakStatement;
use swc_babel_ast::ClassDeclaration;
use swc_babel_ast::ContinueStatement;
use swc_babel_ast::DebuggerStatement;
use swc_babel_ast::DeclareClass;
use swc_babel_ast::DeclareExportAllDeclaration;
use swc_babel_ast::DeclareExportDeclaration;
use swc_babel_ast::DeclareFunction;
use swc_babel_ast::DeclareInterface;
use swc_babel_ast::DeclareModule;
use swc_babel_ast::DeclareModuleExports;
use swc_babel_ast::DeclareOpaqueType;
use swc_babel_ast::DeclareTypeAlias;
use swc_babel_ast::DeclareVariable;
use swc_babel_ast::DoWhileStatement;
use swc_babel_ast::EmptyStatement;
use swc_babel_ast::ExportAllDeclaration;
use swc_babel_ast::ExportDefaultDeclaration;
use swc_babel_ast::ExportNamedDeclaration;
use swc_babel_ast::ExpressionStatement;
use swc_babel_ast::ForInStatement;
use swc_babel_ast::ForOfStatement;
use swc_babel_ast::ForStatement;
use swc_babel_ast::FunctionDeclaration;
use swc_babel_ast::IfStatement;
use swc_babel_ast::ImportDeclaration;
use swc_babel_ast::LabeledStatement;
use swc_babel_ast::ReturnStatement;
use swc_babel_ast::Statement;
use swc_babel_ast::SwitchStatement;
use swc_babel_ast::ThrowStatement;
use swc_babel_ast::TryStatement;
use swc_babel_ast::VariableDeclaration;
use swc_babel_ast::WhileStatement;
use swc_babel_ast::WithStatement;
use swc_ecma_ast::BlockStmt;
use swc_ecma_ast::BreakStmt;
use swc_ecma_ast::ClassDecl;
use swc_ecma_ast::ContinueStmt;
use swc_ecma_ast::DebuggerStmt;
use swc_ecma_ast::Decl;
use swc_ecma_ast::DoWhileStmt;
use swc_ecma_ast::EmptyStmt;
use swc_ecma_ast::ExportAll;
use swc_ecma_ast::ExportDecl;
use swc_ecma_ast::ExportDefaultDecl;
use swc_ecma_ast::ExprStmt;
use swc_ecma_ast::FnDecl;
use swc_ecma_ast::ForInStmt;
use swc_ecma_ast::ForOfStmt;
use swc_ecma_ast::ForStmt;
use swc_ecma_ast::IfStmt;
use swc_ecma_ast::ImportDecl;
use swc_ecma_ast::LabeledStmt;
use swc_ecma_ast::ModuleDecl;
use swc_ecma_ast::ModuleItem;
use swc_ecma_ast::NamedExport;
use swc_ecma_ast::ReturnStmt;
use swc_ecma_ast::Stmt;
use swc_ecma_ast::SwitchStmt;
use swc_ecma_ast::ThrowStmt;
use swc_ecma_ast::TryStmt;
use swc_ecma_ast::TsExportAssignment;
use swc_ecma_ast::TsInterfaceDecl;
use swc_ecma_ast::TsModuleDecl;
use swc_ecma_ast::TsTypeAliasDecl;
use swc_ecma_ast::VarDecl;
use swc_ecma_ast::WhileStmt;
use swc_ecma_ast::WithStmt;

impl Swcify for BlockStatement {
    type Output = BlockStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BlockStmt {
            span: ctx.span(&self.base),
            stmts: self
                .body
                .swcify(ctx)
                .into_iter()
                .map(|v| v.expect_stmt())
                .collect(),
        }
    }
}

impl Swcify for Statement {
    type Output = ModuleItem;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ModuleItem::Stmt(match self {
            Statement::Block(v) => v.swcify(ctx).into(),
            Statement::Break(v) => v.swcify(ctx).into(),
            Statement::Continue(v) => v.swcify(ctx).into(),
            Statement::Debugger(v) => v.swcify(ctx).into(),
            Statement::DoWhile(v) => v.swcify(ctx).into(),
            Statement::Empty(v) => v.swcify(ctx).into(),
            Statement::Expr(v) => v.swcify(ctx).into(),
            Statement::ForIn(v) => v.swcify(ctx).into(),
            Statement::For(v) => v.swcify(ctx).into(),
            Statement::FuncDecl(v) => Decl::Fn(v.swcify(ctx)).into(),
            Statement::If(v) => v.swcify(ctx).into(),
            Statement::Labeled(v) => v.swcify(ctx).into(),
            Statement::Return(v) => v.swcify(ctx).into(),
            Statement::Switch(v) => v.swcify(ctx).into(),
            Statement::Throw(v) => v.swcify(ctx).into(),
            Statement::Try(v) => v.swcify(ctx).into(),
            Statement::VarDecl(v) => Decl::Var(v.swcify(ctx)).into(),
            Statement::While(v) => v.swcify(ctx).into(),
            Statement::With(v) => v.swcify(ctx).into(),
            Statement::ClassDecl(v) => Decl::Class(v.swcify(ctx)).into(),
            Statement::ExportAllDecl(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            Statement::ExportDefaultDecl(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            Statement::ExportNamedDecl(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            Statement::ForOf(v) => v.swcify(ctx).into(),
            Statement::ImportDecl(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            Statement::DeclClass(v) => Stmt::Decl(v.swcify(ctx).into()),
            Statement::DeclFunc(v) => Stmt::Decl(v.swcify(ctx).into()),
            Statement::DeclInterface(v) => Stmt::Decl(v.swcify(ctx).into()),
            Statement::DeclModule(v) => Stmt::Decl(v.swcify(ctx).into()),
            Statement::DeclareModuleExports(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            Statement::DeclTypeAlias(v) => Stmt::Decl(Decl::from(v.swcify(ctx))),
            Statement::DeclVar(v) => Stmt::Decl(Decl::from(v.swcify(ctx))),
            Statement::DeclExportDeclaration(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            Statement::DeclExportAllDeclaration(v) => {
                return ModuleItem::ModuleDecl(ModuleDecl::from(v.swcify(ctx)))
            }
            _ => {
                todo!("swcify: {:?}", self)
            }
        })
    }
}

impl Swcify for BreakStatement {
    type Output = BreakStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ContinueStatement {
    type Output = ContinueStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DebuggerStatement {
    type Output = DebuggerStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DoWhileStatement {
    type Output = DoWhileStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for EmptyStatement {
    type Output = EmptyStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        EmptyStmt {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for ExpressionStatement {
    type Output = ExprStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ExprStmt {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for ForInStatement {
    type Output = ForInStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ForStatement {
    type Output = ForStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for FunctionDeclaration {
    type Output = FnDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for IfStatement {
    type Output = IfStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for LabeledStatement {
    type Output = LabeledStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ReturnStatement {
    type Output = ReturnStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for SwitchStatement {
    type Output = SwitchStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ThrowStatement {
    type Output = ThrowStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for TryStatement {
    type Output = TryStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for VariableDeclaration {
    type Output = VarDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for WhileStatement {
    type Output = WhileStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for WithStatement {
    type Output = WithStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ClassDeclaration {
    type Output = ClassDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ExportAllDeclaration {
    type Output = ExportAll;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ExportDefaultDeclaration {
    type Output = ExportDefaultDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ExportNamedDeclaration {
    type Output = NamedExport;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ForOfStatement {
    type Output = ForOfStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ImportDeclaration {
    type Output = ImportDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareClass {
    type Output = ClassDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareFunction {
    type Output = FnDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareInterface {
    type Output = TsInterfaceDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareModule {
    type Output = TsModuleDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareModuleExports {
    type Output = TsExportAssignment;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareTypeAlias {
    type Output = TsTypeAliasDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareVariable {
    type Output = VarDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareExportDeclaration {
    type Output = ExportDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for DeclareExportAllDeclaration {
    type Output = ExportAll;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}
