use pmutil::q;
use swc_ecma_ast::*;

use super::ToCode;
use crate::ctxt::Ctx;

impl ToCode for swc_ecma_ast::Ident {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        if let Some(var_name) = self.sym.strip_prefix('$') {
            if let Some(var) = cx.var(crate::ctxt::VarPos::Ident, var_name) {
                return var.get_expr();
            }
        }

        q!(
            Vars {
                sym_value: self.sym.to_code(cx),
            },
            { swc_core::ecma::ast::Ident::new(sym_value, swc_core::common::DUMMY_SP,) }
        )
        .parse()
    }
}

impl_struct!(PrivateName, [span, id]);
