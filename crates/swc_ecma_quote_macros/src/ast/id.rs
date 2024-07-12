use swc_ecma_ast::*;
use syn::parse_quote;

use super::ToCode;
use crate::ctxt::Ctx;

impl ToCode for swc_ecma_ast::Ident {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        if let Some(var_name) = self.sym.strip_prefix('$') {
            if let Some(var) = cx.var(crate::ctxt::VarPos::Ident, var_name) {
                return var.get_expr();
            }
        }

        let sym_value = self.sym.to_code(cx);
        parse_quote!(swc_core::ecma::ast::Ident::new_no_ctxt(
            #sym_value,
            swc_core::common::DUMMY_SP,
        ))
    }
}

impl_struct!(IdentName, [span, sym]);
impl_struct!(PrivateName, [span, name]);
