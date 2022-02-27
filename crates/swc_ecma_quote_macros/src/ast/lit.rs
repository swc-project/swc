use pmutil::q;
use proc_macro2::Span;
use swc_atoms::JsWord;
use swc_ecma_ast::*;
use syn::{ExprLit, LitBool, LitFloat};

use super::ToCode;
use crate::ctxt::Ctx;

fail_todo!(BigInt);
fail_todo!(JSXText);

impl_struct!(Str, [span, value, has_escape, kind]);

impl ToCode for StrKind {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(Vars {}, { Default::default() }).parse()
    }
}

impl_struct!(Bool, [span, value]);
impl_struct!(Null, [span]);
impl_struct!(Number, [span, value]);
impl_struct!(Regex, [span, exp, flags]);

impl ToCode for JsWord {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(Vars { val: &**self }, { val.into() }).parse()
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
            lit: syn::Lit::Float(LitFloat::new(&self.to_string(), Span::call_site())),
        })
    }
}
