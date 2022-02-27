use pmutil::q;
use swc_ecma_ast::BindingIdent;

use super::ToCode;
use crate::ctxt::Ctx;

impl ToCode for BindingIdent {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                id_val: self.id.to_code(cx),
                type_ann_val: self.type_ann.to_code(cx),
            },
            {
                swc_ecma_ast::BindingIdent {
                    ident: id_val,
                    type_ann: type_ann_val,
                }
            }
        )
        .parse()
    }
}
