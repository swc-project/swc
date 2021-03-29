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
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum Decl {
//     #[tag("ClassDeclaration")]
//     Class(ClassDecl),
//     #[tag("FunctionDeclaration")]
//     #[is(name = "fn_decl")]
//     Fn(FnDecl),
//     #[tag("VariableDeclaration")]
//     Var(VarDecl),
//     #[tag("TsInterfaceDeclaration")]
//     TsInterface(TsInterfaceDecl),
//     #[tag("TsTypeAliasDeclaration")]
//     TsTypeAlias(TsTypeAliasDecl),
//     #[tag("TsEnumDeclaration")]
//     TsEnum(TsEnumDecl),
//     #[tag("TsModuleDeclaration")]
//     TsModule(TsModuleDecl),
// }
//

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
// #[ast_node("FunctionDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct FnDecl {
//     #[serde(rename = "identifier")]
//     pub ident: Ident,
//
//     #[serde(default)]
//     pub declare: bool,
//
//     #[serde(flatten)]
//     #[span]
//     pub function: Function,
// }
//

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
            implements: class.implements.and_then(|imps| imps.first().map(|i| i.clone())),
            mixins: class.mixins,
            super_type_parameters: class.super_type_parameters,
            type_parameters: class.type_parameters,
        }
    }
}

// #[ast_node("ClassDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct ClassDecl {
//     #[serde(rename = "identifier")]
//     pub ident: Ident,
//
//     #[serde(default)]
//     pub declare: bool,
//
//     #[serde(flatten)]
//     #[span]
//     pub class: Class,
// }
//

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
// #[ast_node("VariableDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct VarDecl {
//     pub span: Span,
//
//     pub kind: VarDeclKind,
//
//     #[serde(default)]
//     pub declare: bool,
//
//     #[serde(rename = "declarations")]
//     pub decls: Vec<VarDeclarator>,
// }
//

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
// #[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum VarDeclKind {
//     /// `var`
//     Var,
//     /// `let`
//     Let,
//     /// `const`
//     Const,
// }
//

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
// #[ast_node("VariableDeclarator")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct VarDeclarator {
//     pub span: Span,
//     #[serde(rename = "id")]
//     pub name: Pat,
//
//     /// Initialization expression.
//     #[serde(default)]
//     pub init: Option<Box<Expr>>,
//
//     /// Typescript only
//     #[serde(default)]
//     pub definite: bool,
// }
//
