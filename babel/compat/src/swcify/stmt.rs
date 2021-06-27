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

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            Statement::Block(v) => v.swcify(ctx),
            Statement::Break(v) => v.swcify(ctx),
            Statement::Continue(v) => v.swcify(ctx),
            Statement::Debugger(v) => v.swcify(ctx),
            Statement::DoWhile(v) => v.swcify(ctx),
            Statement::Empty(v) => v.swcify(ctx),
            Statement::Expr(v) => v.swcify(ctx),
            Statement::ForIn(v) => v.swcify(ctx),
            Statement::For(v) => v.swcify(ctx),
            Statement::FuncDecl(v) => v.swcify(ctx),
            Statement::If(v) => v.swcify(ctx),
            Statement::Labeled(v) => v.swcify(ctx),
            Statement::Return(v) => v.swcify(ctx),
            Statement::Switch(v) => v.swcify(ctx),
            Statement::Throw(v) => v.swcify(ctx),
            Statement::Try(v) => v.swcify(ctx),
            Statement::VarDecl(v) => v.swcify(ctx),
            Statement::While(v) => v.swcify(ctx),
            Statement::With(v) => v.swcify(ctx),
            Statement::ClassDecl(v) => v.swcify(ctx),
            Statement::ExportAllDecl(v) => v.swcify(ctx),
            Statement::ExportDefaultDecl(v) => v.swcify(ctx),
            Statement::ExportNamedDecl(v) => v.swcify(ctx),
            Statement::ForOf(v) => v.swcify(ctx),
            Statement::ImportDecl(v) => v.swcify(ctx),
            Statement::DeclClass(v) => v.swcify(ctx),
            Statement::DeclFunc(v) => v.swcify(ctx),
            Statement::DeclInterface(v) => v.swcify(ctx),
            Statement::DeclModule(v) => v.swcify(ctx),
            Statement::DeclareModuleExports(v) => v.swcify(ctx),
            Statement::DeclTypeAlias(v) => v.swcify(ctx),
            Statement::DeclOpaqueType(v) => v.swcify(ctx),
            Statement::DeclVar(v) => v.swcify(ctx),
            Statement::DeclExportDeclaration(v) => v.swcify(ctx),
            Statement::DeclExportAllDeclaration(v) => v.swcify(ctx),
            Statement::InterfaceDecl(v) => v.swcify(ctx),
            Statement::OpaqueType(v) => v.swcify(ctx),
            Statement::TypeAlias(v) => v.swcify(ctx),
            Statement::EnumDecl(v) => v.swcify(ctx),
            Statement::TSDeclFunc(v) => v.swcify(ctx),
            Statement::TSInterfaceDecl(v) => v.swcify(ctx),
            Statement::TSTypeAliasDecl(v) => v.swcify(ctx),
            Statement::TSEnumDecl(v) => v.swcify(ctx),
            Statement::TSModuleDecl(v) => v.swcify(ctx),
            Statement::TSImportEqualsDecl(v) => v.swcify(ctx),
            Statement::TSExportAssignment(v) => v.swcify(ctx),
            Statement::TSNamespaceExportDecl(v) => v.swcify(ctx),
        }
    }
}
