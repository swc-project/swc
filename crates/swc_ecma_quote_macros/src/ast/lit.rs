use proc_macro2::Span;
use swc_atoms::Atom;
use swc_ecma_ast::*;
use syn::{parse_quote, ExprLit, LitBool, LitFloat};

use super::ToCode;
use crate::{builder::Builder, ctxt::Ctx};

fail_todo!(BigInt);
fail_todo!(JSXText);

impl ToCode for Str {
    fn to_code(&self, cx: &crate::ctxt::Ctx) -> syn::Expr {
        if let Some(var_name) = self.value.strip_prefix('$') {
            if let Some(var) = cx.var(crate::ctxt::VarPos::Str, var_name) {
                return var.get_expr();
            }
        }

        let mut builder = Builder::new("Str");
        builder.add("span", ToCode::to_code(&self.span, cx));
        builder.add("value", ToCode::to_code(&self.value, cx));
        builder.add("raw", ToCode::to_code(&self.raw, cx));
        syn::Expr::Struct(builder.build())
    }
}
impl_struct!(Bool, [span, value]);
impl_struct!(Null, [span]);
impl_struct!(Number, [span, value, raw]);
impl_struct!(Regex, [span, exp, flags]);

impl ToCode for Atom {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        let val = &**self;
        parse_quote!(swc_core::atoms::atom!(#val))
    }
}

impl ToCode for bool {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        syn::Expr::Lit(ExprLit {
            attrs: Default::default(),
            lit: syn::Lit::Bool(LitBool::new(*self, Span::call_site())),
        })
    }
}

impl ToCode for f64 {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        syn::Expr::Lit(ExprLit {
            attrs: Default::default(),
            lit: syn::Lit::Float(LitFloat::new(&format!("{}f64", self), Span::call_site())),
        })
    }
}
