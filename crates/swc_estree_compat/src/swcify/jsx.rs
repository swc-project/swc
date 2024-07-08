use swc_ecma_ast::Ident;

use crate::swcify::{Context, Swcify};

impl Swcify for swc_estree_ast::JSXNamespacedName {
    type Output = swc_ecma_ast::JSXNamespacedName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXNamespacedName {
            ns: self.namespace.swcify(ctx),
            name: self.name.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXIdentifier {
    type Output = Ident;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Ident {
            span: ctx.span(&self.base),
            sym: self.name,
            ..Default::default()
        }
    }
}
