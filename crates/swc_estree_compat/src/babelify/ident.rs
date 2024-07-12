use copyless::BoxHelper;
use swc_ecma_ast::{BindingIdent, Ident, IdentName, PrivateName};
use swc_estree_ast::{Identifier, PrivateName as BabelPrivateName};

use crate::babelify::{Babelify, Context};

impl Babelify for BindingIdent {
    type Output = Identifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        Identifier {
            type_annotation: self
                .type_ann
                .map(|ann| Box::alloc().init(ann.babelify(ctx).into())),
            ..self.id.babelify(ctx)
        }
    }
}

impl Babelify for Ident {
    type Output = Identifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        Identifier {
            base: ctx.base(self.span),
            name: self.sym,
            optional: Some(self.optional),
            decorators: Default::default(),
            type_annotation: Default::default(),
        }
    }
}

impl Babelify for IdentName {
    type Output = Identifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        Identifier {
            base: ctx.base(self.span),
            name: self.sym,
            optional: Default::default(),
            decorators: Default::default(),
            type_annotation: Default::default(),
        }
    }
}

impl Babelify for PrivateName {
    type Output = BabelPrivateName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelPrivateName {
            base: ctx.base(self.span),
            id: Identifier {
                base: ctx.base(self.span),
                name: self.name,
                decorators: Default::default(),
                optional: Default::default(),
                type_annotation: None,
            },
        }
    }
}
