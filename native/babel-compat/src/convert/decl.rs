use super::Context;
use crate::ast::{
    class::ClassDeclaration,
    decl::{
        Declaration, VariableDeclaration, VariableDeclarationKind, VariableDeclarator,
        FunctionDeclaration,
    },
};
use crate::convert::Babelify;
use swc_ecma_ast::{Decl, VarDecl, VarDeclKind, VarDeclarator, FnDecl, ClassDecl};

impl Babelify for Decl {
    type Output = Declaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Decl::Class(d) => Declaration::ClassDecl(d.babelify(ctx)),
            Decl::Fn(d) => Declaration::FuncDecl(d.babelify(ctx)),
            Decl::Var(d) => Declaration::VarDecl(d.babelify(ctx)),
            Decl::TsInterface(d) => Declaration::TSInterfaceDecl(d.babelify(ctx)),
            Decl::TsTypeAlias(d) => Declaration::TSTypeAliasDecl(d.babelify(ctx)),
            Decl::TsEnum(d) => Declaration::TSEnumDecl(d.babelify(ctx)),
            Decl::TsModule(d) => Declaration::TSModuleDecl(d.babelify(ctx)),
        }
    }
}

impl Babelify for FnDecl {
    type Output = FunctionDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let func = self.function.babelify(ctx);
        FunctionDeclaration {
            base: func.base,
            id: Some(self.ident.babelify(ctx)),
            params: func.params,
            body: func.body,
            generator: func.generator,
            is_async: func.is_async,
            return_type: func.return_type,
            type_parameters: func.type_parameters,
        }
    }
}

impl Babelify for ClassDecl {
    type Output = ClassDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let is_abstract = self.class.is_abstract;
        let class = self.class.babelify(ctx);
        ClassDeclaration {
            base: class.base,
            id: self.ident.babelify(ctx),
            super_class: class.super_class.map(|s| *s),
            body: class.body,
            decorators: class.decorators,
            is_abstract: Some(is_abstract),
            declare: Some(self.declare),
            // implements: class.implements.and_then(|imps| imps.first().map(|i| i.clone())),
            implements: class.implements,
            mixins: class.mixins,
            super_type_parameters: class.super_type_parameters,
            type_parameters: class.type_parameters,
        }
    }
}

impl Babelify for VarDecl {
    type Output = VariableDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        VariableDeclaration {
            base: ctx.base(self.span),
            kind: self.kind.babelify(ctx),
            declare: Some(self.declare),
            declarations: self.decls.iter().map(|decl| decl.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for VarDeclKind {
    type Output = VariableDeclarationKind;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            VarDeclKind::Var => VariableDeclarationKind::Var,
            VarDeclKind::Let => VariableDeclarationKind::Let,
            VarDeclKind::Const => VariableDeclarationKind::Const,
        }
    }
}

impl Babelify for VarDeclarator {
    type Output = VariableDeclarator;

    fn babelify(self, ctx: &Context) -> Self::Output {
        VariableDeclarator {
            base: ctx.base(self.span),
            id: self.name.babelify(ctx).into(),
            init: self.init.map(|i| i.babelify(ctx).into()),
            definite: Some(self.definite),
        }
    }
}

