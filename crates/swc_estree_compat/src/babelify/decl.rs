use copyless::BoxHelper;
use swc_ecma_ast::{ClassDecl, Decl, FnDecl, UsingDecl, VarDecl, VarDeclKind, VarDeclarator};
use swc_estree_ast::{
    ClassBody, ClassDeclaration, Declaration, FunctionDeclaration, UsingDeclaration,
    VariableDeclaration, VariableDeclarationKind, VariableDeclarator,
};

use crate::babelify::{extract_class_body_span, Babelify, Context};

impl Babelify for Decl {
    type Output = Declaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Decl::Class(d) => Declaration::ClassDecl(d.babelify(ctx)),
            Decl::Fn(d) => Declaration::FuncDecl(d.babelify(ctx)),
            Decl::Var(d) => Declaration::VarDecl(d.babelify(ctx)),
            Decl::Using(d) => Declaration::UsingDecl(d.babelify(ctx)),
            Decl::TsInterface(d) => Declaration::TSInterfaceDecl(d.babelify(ctx)),
            Decl::TsTypeAlias(d) => Declaration::TSTypeAliasDecl(d.babelify(ctx)),
            Decl::TsEnum(d) => Declaration::TSEnumDecl(d.babelify(ctx)),
            Decl::TsModule(d) => Declaration::TSModuleDecl(d.babelify(ctx)),
            Decl::Invalid(d) => unreachable!(),
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
            expression: false,
            return_type: func.return_type,
            type_parameters: func.type_parameters,
        }
    }
}

impl Babelify for ClassDecl {
    type Output = ClassDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let is_abstract = self.class.is_abstract;
        // NOTE: The body field needs a bit of special handling because babel
        // represents the body as a node, whereas swc represents it as a vector of
        // statements. This means that swc does not have a span corresponding the
        // class body base node for babel. To solve this, we generate a new span
        // starting from the end of the identifier to the end of the body.
        // For example,
        //
        // babel ClassBody node starts here
        //                  v
        //     class MyClass {
        //         a = 0;
        //     }
        //     ^
        // and ends here
        //
        // TODO: Verify that this implementation of class body span is correct.
        // It may need to be modified to take into account implements, super classes,
        // etc.
        let body_span = extract_class_body_span(&self.class, ctx);
        let class = self.class.babelify(ctx);
        ClassDeclaration {
            base: class.base,
            id: self.ident.babelify(ctx),
            super_class: class.super_class.map(|s| Box::alloc().init(*s)),
            body: ClassBody {
                base: ctx.base(body_span),
                ..class.body
            },
            decorators: class.decorators,
            is_abstract: Some(is_abstract),
            declare: Some(self.declare),
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
            declarations: self.decls.babelify(ctx),
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
            init: self.init.map(|i| Box::alloc().init(i.babelify(ctx).into())),
            definite: Some(self.definite),
        }
    }
}

impl Babelify for UsingDecl {
    type Output = UsingDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        UsingDeclaration {
            base: ctx.base(self.span),
            declarations: self.decls.babelify(ctx),
        }
    }
}
