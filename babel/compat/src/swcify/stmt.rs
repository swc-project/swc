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
use swc_babel_ast::DeclareTypeAlias;
use swc_babel_ast::DeclareVariable;
use swc_babel_ast::DoWhileStatement;
use swc_babel_ast::EmptyStatement;
use swc_babel_ast::ExportAllDeclaration;
use swc_babel_ast::ExportDefaultDeclType;
use swc_babel_ast::ExportDefaultDeclaration;
use swc_babel_ast::ExportNamedDeclaration;
use swc_babel_ast::ExpressionStatement;
use swc_babel_ast::ForInStatement;
use swc_babel_ast::ForOfStatement;
use swc_babel_ast::ForStatement;
use swc_babel_ast::ForStmtInit;
use swc_babel_ast::ForStmtLeft;
use swc_babel_ast::FunctionDeclaration;
use swc_babel_ast::IdOrString;
use swc_babel_ast::IfStatement;
use swc_babel_ast::ImportAttribute;
use swc_babel_ast::ImportDeclaration;
use swc_babel_ast::ImportNamespaceSpecifier;
use swc_babel_ast::ImportSpecifierType;
use swc_babel_ast::LabeledStatement;
use swc_babel_ast::ReturnStatement;
use swc_babel_ast::Statement;
use swc_babel_ast::SwitchStatement;
use swc_babel_ast::ThrowStatement;
use swc_babel_ast::TryStatement;
use swc_babel_ast::VariableDeclaration;
use swc_babel_ast::VariableDeclarationKind;
use swc_babel_ast::VariableDeclarator;
use swc_babel_ast::WhileStatement;
use swc_babel_ast::WithStatement;
use swc_common::DUMMY_SP;
use swc_ecma_ast::BlockStmt;
use swc_ecma_ast::BreakStmt;
use swc_ecma_ast::ClassDecl;
use swc_ecma_ast::ClassExpr;
use swc_ecma_ast::ContinueStmt;
use swc_ecma_ast::DebuggerStmt;
use swc_ecma_ast::Decl;
use swc_ecma_ast::DefaultDecl;
use swc_ecma_ast::DoWhileStmt;
use swc_ecma_ast::EmptyStmt;
use swc_ecma_ast::ExportAll;
use swc_ecma_ast::ExportDecl;
use swc_ecma_ast::ExportDefaultDecl;
use swc_ecma_ast::ExportDefaultExpr;
use swc_ecma_ast::ExportNamedSpecifier;
use swc_ecma_ast::Expr;
use swc_ecma_ast::ExprStmt;
use swc_ecma_ast::FnDecl;
use swc_ecma_ast::FnExpr;
use swc_ecma_ast::ForInStmt;
use swc_ecma_ast::ForOfStmt;
use swc_ecma_ast::ForStmt;
use swc_ecma_ast::IfStmt;
use swc_ecma_ast::ImportDecl;
use swc_ecma_ast::ImportNamedSpecifier;
use swc_ecma_ast::ImportSpecifier;
use swc_ecma_ast::ImportStarAsSpecifier;
use swc_ecma_ast::KeyValueProp;
use swc_ecma_ast::LabeledStmt;
use swc_ecma_ast::Lit;
use swc_ecma_ast::ModuleDecl;
use swc_ecma_ast::ModuleItem;
use swc_ecma_ast::NamedExport;
use swc_ecma_ast::ObjectLit;
use swc_ecma_ast::Pat;
use swc_ecma_ast::Prop;
use swc_ecma_ast::PropName;
use swc_ecma_ast::PropOrSpread;
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
use swc_ecma_ast::VarDeclKind;
use swc_ecma_ast::VarDeclOrExpr;
use swc_ecma_ast::VarDeclOrPat;
use swc_ecma_ast::VarDeclarator;
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

    fn swcify(self, ctx: &Context) -> Self::Output {
        BreakStmt {
            span: ctx.span(&self.base),
            label: self.label.swcify(ctx).map(|v| v.id),
        }
    }
}

impl Swcify for ContinueStatement {
    type Output = ContinueStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ContinueStmt {
            span: ctx.span(&self.base),
            label: self.label.swcify(ctx).map(|v| v.id),
        }
    }
}

impl Swcify for DebuggerStatement {
    type Output = DebuggerStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        DebuggerStmt {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for DoWhileStatement {
    type Output = DoWhileStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        DoWhileStmt {
            span: ctx.span(&self.base),
            test: self.test.swcify(ctx),
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
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

    fn swcify(self, ctx: &Context) -> Self::Output {
        ForInStmt {
            span: ctx.span(&self.base),
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx),
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
}

impl Swcify for ForStmtLeft {
    type Output = VarDeclOrPat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ForStmtLeft::VarDecl(v) => VarDeclOrPat::VarDecl(v.swcify(ctx)),
            ForStmtLeft::LVal(v) => VarDeclOrPat::Pat(v.swcify(ctx)),
        }
    }
}

impl Swcify for ForStatement {
    type Output = ForStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ForStmt {
            span: ctx.span(&self.base),
            init: self.init.swcify(ctx),
            test: self.test.swcify(ctx),
            update: self.update.swcify(ctx),
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
}

impl Swcify for ForStmtInit {
    type Output = VarDeclOrExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ForStmtInit::VarDecl(v) => VarDeclOrExpr::VarDecl(v.swcify(ctx)),
            ForStmtInit::Expr(v) => VarDeclOrExpr::Expr(v.swcify(ctx)),
        }
    }
}

impl Swcify for FunctionDeclaration {
    type Output = FnDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        FnDecl {
            ident: self.id.swcify(ctx).map(|v| v.id).unwrap(),
            declare: false,
            function: swc_ecma_ast::Function {
                params: self.params.swcify(ctx),
                decorators: Default::default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: false,
                is_async: self.is_async.unwrap_or_default(),
                type_params: Default::default(),
                return_type: Default::default(),
            },
        }
    }
}

impl Swcify for IfStatement {
    type Output = IfStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        IfStmt {
            span: ctx.span(&self.base),
            test: self.test.swcify(ctx),
            cons: Box::new(self.consequent.swcify(ctx).expect_stmt()),
            alt: self
                .alternate
                .swcify(ctx)
                .map(|v| v.expect_stmt())
                .map(Box::new),
        }
    }
}

impl Swcify for LabeledStatement {
    type Output = LabeledStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        LabeledStmt {
            span: ctx.span(&self.base),
            label: self.label.swcify(ctx).id,
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
}

impl Swcify for ReturnStatement {
    type Output = ReturnStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ReturnStmt {
            span: ctx.span(&self.base),
            arg: self.argument.swcify(ctx),
        }
    }
}

impl Swcify for SwitchStatement {
    type Output = SwitchStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        SwitchStmt {
            span: ctx.span(&self.base),
            discriminant: self.discriminant.swcify(ctx),
            cases: self.cases.swcify(ctx),
        }
    }
}

impl Swcify for swc_babel_ast::SwitchCase {
    type Output = swc_ecma_ast::SwitchCase;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::SwitchCase {
            span: ctx.span(&self.base),
            test: self.test.swcify(ctx),
            cons: self
                .consequent
                .swcify(ctx)
                .into_iter()
                .map(|v| v.expect_stmt())
                .collect(),
        }
    }
}

impl Swcify for ThrowStatement {
    type Output = ThrowStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ThrowStmt {
            span: ctx.span(&self.base),
            arg: self.argument.swcify(ctx),
        }
    }
}

impl Swcify for TryStatement {
    type Output = TryStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TryStmt {
            span: ctx.span(&self.base),
            block: self.block.swcify(ctx),
            handler: self.handler.swcify(ctx),
            finalizer: self.finalizer.swcify(ctx),
        }
    }
}

impl Swcify for swc_babel_ast::CatchClause {
    type Output = swc_ecma_ast::CatchClause;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::CatchClause {
            span: ctx.span(&self.base),
            param: self.param.swcify(ctx),
            body: self.body.swcify(ctx),
        }
    }
}

impl Swcify for swc_babel_ast::CatchClauseParam {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_babel_ast::CatchClauseParam::Id(v) => Pat::from(v.swcify(ctx)),
            swc_babel_ast::CatchClauseParam::Array(v) => Pat::from(v.swcify(ctx)),
            swc_babel_ast::CatchClauseParam::Object(v) => Pat::from(v.swcify(ctx)),
        }
    }
}

impl Swcify for VariableDeclaration {
    type Output = VarDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        VarDecl {
            span: ctx.span(&self.base),
            kind: match self.kind {
                VariableDeclarationKind::Var => VarDeclKind::Var,
                VariableDeclarationKind::Let => VarDeclKind::Let,
                VariableDeclarationKind::Const => VarDeclKind::Const,
            },
            declare: self.declare.unwrap_or_default(),
            decls: self.declarations.swcify(ctx),
        }
    }
}

impl Swcify for VariableDeclarator {
    type Output = VarDeclarator;

    fn swcify(self, ctx: &Context) -> Self::Output {
        VarDeclarator {
            span: ctx.span(&self.base),
            name: self.id.swcify(ctx),
            init: self.init.swcify(ctx),
            definite: self.definite.unwrap_or_default(),
        }
    }
}

impl Swcify for WhileStatement {
    type Output = WhileStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        WhileStmt {
            span: ctx.span(&self.base),
            test: self.test.swcify(ctx),
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
}

impl Swcify for WithStatement {
    type Output = WithStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        WithStmt {
            span: ctx.span(&self.base),
            obj: self.object.swcify(ctx),
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
}

impl Swcify for ClassDeclaration {
    type Output = ClassDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ClassDecl {
            ident: self.id.swcify(ctx).id,
            declare: self.declare.unwrap_or_default(),
            class: swc_ecma_ast::Class {
                span: ctx.span(&self.base),
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                body: self.body.swcify(ctx),
                super_class: self.super_class.swcify(ctx),
                is_abstract: self.is_abstract.unwrap_or_default(),
                type_params: None,
                super_type_params: None,
                implements: Default::default(),
            },
        }
    }
}

impl Swcify for ExportAllDeclaration {
    type Output = ExportAll;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ExportAll {
            span: ctx.span(&self.base),
            src: self.source.swcify(ctx),
            asserts: self
                .assertions
                .swcify(ctx)
                .map(|props| {
                    props
                        .into_iter()
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect()
                })
                .map(|props| ObjectLit {
                    span: DUMMY_SP,
                    props,
                }),
        }
    }
}

impl Swcify for ImportAttribute {
    type Output = KeyValueProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        KeyValueProp {
            key: self.key.swcify(ctx),
            value: Box::new(Expr::Lit(Lit::Str(self.value.swcify(ctx)))),
        }
    }
}

impl Swcify for IdOrString {
    type Output = PropName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            IdOrString::Id(v) => PropName::Ident(v.swcify(ctx).id),
            IdOrString::String(v) => PropName::Str(v.swcify(ctx)),
        }
    }
}

impl Swcify for ExportDefaultDeclaration {
    type Output = ModuleDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self.declaration {
            ExportDefaultDeclType::Func(v) => {
                let d = v.swcify(ctx);
                ExportDefaultDecl {
                    span: ctx.span(&self.base),
                    decl: DefaultDecl::Fn(FnExpr {
                        ident: Some(d.ident),
                        function: d.function,
                    }),
                }
                .into()
            }
            ExportDefaultDeclType::Class(v) => {
                let d = v.swcify(ctx);
                ExportDefaultDecl {
                    span: ctx.span(&self.base),
                    decl: DefaultDecl::Class(ClassExpr {
                        ident: Some(d.ident),
                        class: d.class,
                    }),
                }
                .into()
            }
            ExportDefaultDeclType::Expr(v) => ExportDefaultExpr {
                span: ctx.span(&self.base),
                expr: v.swcify(ctx),
            }
            .into(),
            _ => {
                todo!("swcify: {:?}", self)
            }
        }
    }
}

impl Swcify for ExportNamedDeclaration {
    type Output = NamedExport;

    fn swcify(self, ctx: &Context) -> Self::Output {
        NamedExport {
            span: ctx.span(&self.base),
            specifiers: self.specifiers.swcify(ctx),
            src: self.source.swcify(ctx),
            type_only: false,
            asserts: self
                .assertions
                .swcify(ctx)
                .map(|props| {
                    props
                        .into_iter()
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect()
                })
                .map(|props| ObjectLit {
                    span: DUMMY_SP,
                    props,
                }),
        }
    }
}

impl Swcify for swc_babel_ast::ExportSpecifierType {
    type Output = swc_ecma_ast::ExportSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_babel_ast::ExportSpecifierType::Export(v) => {
                swc_ecma_ast::ExportSpecifier::from(v.swcify(ctx))
            }
            swc_babel_ast::ExportSpecifierType::Default(v) => {
                swc_ecma_ast::ExportSpecifier::from(v.swcify(ctx))
            }
            swc_babel_ast::ExportSpecifierType::Namespace(v) => {
                swc_ecma_ast::ExportSpecifier::from(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for swc_babel_ast::ExportSpecifier {
    type Output = ExportNamedSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ExportNamedSpecifier {
            span: ctx.span(&self.base),
            orig: self.local.swcify(ctx).id,
            exported: Some(self.exported.swcify(ctx).expect_ident()),
        }
    }
}

impl Swcify for swc_babel_ast::ExportDefaultSpecifier {
    type Output = swc_ecma_ast::ExportDefaultSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ExportDefaultSpecifier {
            exported: self.exported.swcify(ctx).id,
        }
    }
}

impl Swcify for swc_babel_ast::ExportNamespaceSpecifier {
    type Output = swc_ecma_ast::ExportNamespaceSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ExportNamespaceSpecifier {
            span: ctx.span(&self.base),
            name: self.exported.swcify(ctx).id,
        }
    }
}

impl Swcify for ForOfStatement {
    type Output = ForOfStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ForOfStmt {
            span: ctx.span(&self.base),
            await_token: None,
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx),
            body: Box::new(self.body.swcify(ctx).expect_stmt()),
        }
    }
}

impl Swcify for ImportDeclaration {
    type Output = ImportDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ImportDecl {
            span: ctx.span(&self.base),
            specifiers: self.specifiers.swcify(ctx),
            src: self.source.swcify(ctx),
            type_only: false,
            asserts: self
                .assertions
                .swcify(ctx)
                .map(|props| {
                    props
                        .into_iter()
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect()
                })
                .map(|props| ObjectLit {
                    span: DUMMY_SP,
                    props,
                }),
        }
    }
}

impl Swcify for ImportSpecifierType {
    type Output = ImportSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ImportSpecifierType::Import(v) => v.swcify(ctx).into(),
            ImportSpecifierType::Default(v) => v.swcify(ctx).into(),
            ImportSpecifierType::Namespace(v) => v.swcify(ctx).into(),
        }
    }
}

impl Swcify for swc_babel_ast::ImportSpecifier {
    type Output = ImportNamedSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ImportNamedSpecifier {
            span: ctx.span(&self.base),
            local: self.local.swcify(ctx).id,
            imported: Some(self.imported.swcify(ctx).expect_ident()),
        }
    }
}

impl Swcify for swc_babel_ast::ImportDefaultSpecifier {
    type Output = swc_ecma_ast::ImportDefaultSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ImportDefaultSpecifier {
            span: ctx.span(&self.base),
            local: self.local.swcify(ctx).id,
        }
    }
}

impl Swcify for ImportNamespaceSpecifier {
    type Output = ImportStarAsSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ImportStarAsSpecifier {
            span: ctx.span(&self.base),
            local: self.local.swcify(ctx).id,
        }
    }
}

impl Swcify for DeclareClass {
    type Output = ClassDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareFunction {
    type Output = FnDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareInterface {
    type Output = TsInterfaceDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareModule {
    type Output = TsModuleDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareModuleExports {
    type Output = TsExportAssignment;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareTypeAlias {
    type Output = TsTypeAliasDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareVariable {
    type Output = VarDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareExportDeclaration {
    type Output = ExportDecl;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow")
    }
}

impl Swcify for DeclareExportAllDeclaration {
    type Output = ExportAll;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ExportAll {
            span: ctx.span(&self.base),
            src: self.source.swcify(ctx),
            asserts: Default::default(),
        }
    }
}
