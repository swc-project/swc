use super::Context;
use crate::ast::common::{Identifier, PrivateName as BabelPrivateName};
use crate::convert::Babelify;
use swc_ecma_ast::{BindingIdent, Ident, PrivateName};

impl Babelify for BindingIdent {
    type Output = Identifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        Identifier {
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx).into())),
            ..self.id.babelify(ctx)
        }
    }
}

impl Babelify for Ident {
    type Output = Identifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        Identifier {
            base: ctx.base(self.span),
            name: self.sym.to_string(),
            optional: Some(self.optional),
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
            id: self.id.babelify(ctx),
        }
    }
}

