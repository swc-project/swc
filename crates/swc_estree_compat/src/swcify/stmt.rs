use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BlockStmt, BreakStmt, ClassDecl, ClassExpr, ContinueStmt, DebuggerStmt, DefaultDecl,
    DoWhileStmt, EmptyStmt, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
    ExportNamedSpecifier, ExprStmt, FnDecl, FnExpr, ForHead, ForInStmt, ForOfStmt, ForStmt, IfStmt,
    ImportDecl, ImportNamedSpecifier, ImportSpecifier, ImportStarAsSpecifier, KeyValueProp,
    LabeledStmt, Lit, ModuleDecl, ModuleItem, NamedExport, ObjectLit, Pat, Prop, PropName,
    PropOrSpread, ReturnStmt, SwitchStmt, ThrowStmt, TryStmt, TsExportAssignment, TsInterfaceDecl,
    TsModuleDecl, TsTypeAliasDecl, VarDecl, VarDeclKind, VarDeclOrExpr, VarDeclarator, WhileStmt,
    WithStmt,
};
use swc_estree_ast::{
    BlockStatement, BreakStatement, ClassDeclaration, ContinueStatement, DebuggerStatement,
    DeclareClass, DeclareExportAllDeclaration, DeclareExportDeclaration, DeclareFunction,
    DeclareInterface, DeclareModule, DeclareModuleExports, DeclareTypeAlias, DeclareVariable,
    DoWhileStatement, EmptyStatement, ExportAllDeclaration, ExportDefaultDeclType,
    ExportDefaultDeclaration, ExportKind, ExportNamedDeclaration, ExpressionStatement,
    ForInStatement, ForOfStatement, ForStatement, ForStmtInit, ForStmtLeft, FunctionDeclaration,
    IdOrString, IfStatement, ImportAttribute, ImportDeclaration, ImportKind,
    ImportNamespaceSpecifier, ImportSpecifierType, LabeledStatement, ReturnStatement, Statement,
    SwitchStatement, ThrowStatement, TryStatement, VariableDeclaration, VariableDeclarationKind,
    VariableDeclarator, WhileStatement, WithStatement,
};

use super::Context;
use crate::swcify::Swcify;

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
            ..Default::default()
        }
    }
}

impl Swcify for Statement {
    type Output = ModuleItem;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            Statement::Block(v) => v.swcify(ctx).into(),
            Statement::Break(v) => v.swcify(ctx).into(),
            Statement::Continue(v) => v.swcify(ctx).into(),
            Statement::Debugger(v) => v.swcify(ctx).into(),
            Statement::DoWhile(v) => v.swcify(ctx).into(),
            Statement::Empty(v) => v.swcify(ctx).into(),
            Statement::Expr(v) => v.swcify(ctx).into(),
            Statement::ForIn(v) => v.swcify(ctx).into(),
            Statement::For(v) => v.swcify(ctx).into(),
            Statement::FuncDecl(v) => v.swcify(ctx).into(),
            Statement::If(v) => v.swcify(ctx).into(),
            Statement::Labeled(v) => v.swcify(ctx).into(),
            Statement::Return(v) => v.swcify(ctx).into(),
            Statement::Switch(v) => v.swcify(ctx).into(),
            Statement::Throw(v) => v.swcify(ctx).into(),
            Statement::Try(v) => v.swcify(ctx).into(),
            Statement::VarDecl(v) => v.swcify(ctx).into(),
            Statement::While(v) => v.swcify(ctx).into(),
            Statement::With(v) => v.swcify(ctx).into(),
            Statement::ClassDecl(v) => v.swcify(ctx).into(),
            Statement::ExportAllDecl(v) => ModuleItem::ModuleDecl(v.swcify(ctx).into()),
            Statement::ExportDefaultDecl(v) => ModuleItem::ModuleDecl(v.swcify(ctx)),
            Statement::ExportNamedDecl(v) => ModuleItem::ModuleDecl(v.swcify(ctx).into()),
            Statement::ForOf(v) => v.swcify(ctx).into(),
            Statement::ImportDecl(v) => ModuleItem::ModuleDecl(v.swcify(ctx).into()),
            Statement::DeclClass(v) => v.swcify(ctx).into(),
            Statement::DeclFunc(v) => v.swcify(ctx).into(),
            Statement::DeclInterface(v) => v.swcify(ctx).into(),
            Statement::DeclModule(v) => v.swcify(ctx).into(),
            Statement::DeclareModuleExports(v) => ModuleItem::ModuleDecl(v.swcify(ctx).into()),
            Statement::DeclTypeAlias(v) => v.swcify(ctx).into(),
            Statement::DeclVar(v) => v.swcify(ctx).into(),
            Statement::DeclExportDeclaration(v) => ModuleItem::ModuleDecl(v.swcify(ctx).into()),
            Statement::DeclExportAllDeclaration(v) => ModuleItem::ModuleDecl(v.swcify(ctx).into()),
            _ => {
                todo!("swcify: {:?}", self)
            }
        }
    }
}

impl Swcify for BreakStatement {
    type Output = BreakStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BreakStmt {
            span: ctx.span(&self.base),
            label: self.label.swcify(ctx).map(|v| v.into()),
        }
    }
}

impl Swcify for ContinueStatement {
    type Output = ContinueStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ContinueStmt {
            span: ctx.span(&self.base),
            label: self.label.swcify(ctx).map(|v| v.into()),
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
    type Output = ForHead;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ForStmtLeft::VarDecl(v) => ForHead::VarDecl(v.swcify(ctx).into()),
            ForStmtLeft::LVal(v) => ForHead::Pat(v.swcify(ctx).into()),
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
            ForStmtInit::VarDecl(v) => VarDeclOrExpr::VarDecl(v.swcify(ctx).into()),
            ForStmtInit::Expr(v) => VarDeclOrExpr::Expr(v.swcify(ctx)),
        }
    }
}

impl Swcify for FunctionDeclaration {
    type Output = FnDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        FnDecl {
            ident: self.id.swcify(ctx).map(|v| v.into()).unwrap(),
            declare: false,
            function: swc_ecma_ast::Function {
                params: self.params.swcify(ctx),
                decorators: Default::default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: false,
                is_async: self.is_async.unwrap_or_default(),
                ..Default::default()
            }
            .into(),
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
            label: self.label.swcify(ctx).into(),
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

impl Swcify for swc_estree_ast::SwitchCase {
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

impl Swcify for swc_estree_ast::CatchClause {
    type Output = swc_ecma_ast::CatchClause;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::CatchClause {
            span: ctx.span(&self.base),
            param: self.param.swcify(ctx),
            body: self.body.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::CatchClauseParam {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::CatchClauseParam::Id(v) => v.swcify(ctx).into(),
            swc_estree_ast::CatchClauseParam::Array(v) => v.swcify(ctx).into(),
            swc_estree_ast::CatchClauseParam::Object(v) => v.swcify(ctx).into(),
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
            ..Default::default()
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
            ident: self.id.swcify(ctx).into(),
            declare: self.declare.unwrap_or_default(),
            class: swc_ecma_ast::Class {
                span: ctx.span(&self.base),
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                body: self.body.swcify(ctx),
                super_class: self.super_class.swcify(ctx),
                is_abstract: self.is_abstract.unwrap_or_default(),
                ..Default::default()
            }
            .into(),
        }
    }
}

impl Swcify for ExportAllDeclaration {
    type Output = ExportAll;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ExportAll {
            span: ctx.span(&self.base),
            src: self.source.swcify(ctx).into(),
            type_only: self.export_kind == Some(ExportKind::Type),
            with: self
                .with
                .swcify(ctx)
                .map(|props| {
                    props
                        .into_iter()
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect()
                })
                .map(|props| {
                    ObjectLit {
                        span: DUMMY_SP,
                        props,
                    }
                    .into()
                }),
        }
    }
}

impl Swcify for ImportAttribute {
    type Output = KeyValueProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        KeyValueProp {
            key: self.key.swcify(ctx),
            value: Lit::Str(self.value.swcify(ctx)).into(),
        }
    }
}

impl Swcify for IdOrString {
    type Output = PropName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            IdOrString::Id(v) => PropName::Ident(v.swcify(ctx).into()),
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
            src: self.source.swcify(ctx).map(Box::new),
            type_only: false,
            with: self
                .with
                .swcify(ctx)
                .map(|props| {
                    props
                        .into_iter()
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect()
                })
                .map(|props| {
                    ObjectLit {
                        span: DUMMY_SP,
                        props,
                    }
                    .into()
                }),
        }
    }
}

impl Swcify for swc_estree_ast::ExportSpecifierType {
    type Output = swc_ecma_ast::ExportSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::ExportSpecifierType::Export(v) => {
                swc_ecma_ast::ExportSpecifier::from(v.swcify(ctx))
            }
            swc_estree_ast::ExportSpecifierType::Default(v) => {
                swc_ecma_ast::ExportSpecifier::from(v.swcify(ctx))
            }
            swc_estree_ast::ExportSpecifierType::Namespace(v) => {
                swc_ecma_ast::ExportSpecifier::from(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for swc_estree_ast::ExportSpecifier {
    type Output = ExportNamedSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ExportNamedSpecifier {
            span: ctx.span(&self.base),
            orig: self.local.swcify(ctx),
            exported: Some(self.exported.swcify(ctx)),
            is_type_only: matches!(self.export_kind, ExportKind::Type),
        }
    }
}

impl Swcify for swc_estree_ast::ExportDefaultSpecifier {
    type Output = swc_ecma_ast::ExportDefaultSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ExportDefaultSpecifier {
            exported: self.exported.swcify(ctx).into(),
        }
    }
}

impl Swcify for swc_estree_ast::ExportNamespaceSpecifier {
    type Output = swc_ecma_ast::ExportNamespaceSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ExportNamespaceSpecifier {
            span: ctx.span(&self.base),
            name: self.exported.swcify(ctx),
        }
    }
}

impl Swcify for ForOfStatement {
    type Output = ForOfStmt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ForOfStmt {
            span: ctx.span(&self.base),
            is_await: false,
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
            src: self.source.swcify(ctx).into(),
            type_only: false,
            with: self
                .with
                .swcify(ctx)
                .map(|props| {
                    props
                        .into_iter()
                        .map(Prop::KeyValue)
                        .map(Box::new)
                        .map(PropOrSpread::Prop)
                        .collect()
                })
                .map(|props| {
                    ObjectLit {
                        span: DUMMY_SP,
                        props,
                    }
                    .into()
                }),
            phase: self
                .phase
                .map(|phase| Swcify::swcify(phase, ctx))
                .unwrap_or_default(),
        }
    }
}

impl Swcify for swc_estree_ast::ImportPhase {
    type Output = swc_ecma_ast::ImportPhase;

    fn swcify(self, _: &Context) -> Self::Output {
        match self {
            Self::Source => Self::Output::Source,
            Self::Defer => Self::Output::Defer,
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

impl Swcify for swc_estree_ast::ModuleExportNameType {
    type Output = swc_ecma_ast::ModuleExportName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::ModuleExportNameType::Ident(ident) => {
                swc_ecma_ast::ModuleExportName::Ident(ident.swcify(ctx).into())
            }
            swc_estree_ast::ModuleExportNameType::Str(s) => s.swcify(ctx).into(),
        }
    }
}

impl Swcify for swc_estree_ast::ImportSpecifier {
    type Output = ImportNamedSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ImportNamedSpecifier {
            span: ctx.span(&self.base),
            local: self.local.swcify(ctx).into(),
            imported: Some(self.imported.swcify(ctx)),
            is_type_only: matches!(self.import_kind, Some(ImportKind::Type)),
        }
    }
}

impl Swcify for swc_estree_ast::ImportDefaultSpecifier {
    type Output = swc_ecma_ast::ImportDefaultSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ImportDefaultSpecifier {
            span: ctx.span(&self.base),
            local: self.local.swcify(ctx).into(),
        }
    }
}

impl Swcify for ImportNamespaceSpecifier {
    type Output = ImportStarAsSpecifier;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ImportStarAsSpecifier {
            span: ctx.span(&self.base),
            local: self.local.swcify(ctx).into(),
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
            src: self.source.swcify(ctx).into(),
            type_only: self.export_kind == Some(ExportKind::Type),
            with: Default::default(),
        }
    }
}
