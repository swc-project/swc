use pmutil::q;
use proc_macro2::Span;
use swc_ecma_ast::*;
use syn::{ExprLit, LitBool, LitFloat};

use super::ToCode;
use crate::ctxt::Ctx;

fail_todo!(BigInt);
fail_todo!(JSXText);

impl ToCode for Str {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(
            Vars {
                str_val: &*self.value,
            },
            {
                swc_ecma_ast::Str {
                    span: swc_common::DUMMY_SP,
                    value: str_val.into(),
                    has_escape: false,
                    kind: Default::default(),
                }
            }
        )
        .parse()
    }
}

impl_struct!(Bool, [span, value]);
impl_struct!(Null, [span]);
impl_struct!(Number, [span, value]);

impl ToCode for Regex {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(
            Vars {
                exp_val: &*self.exp,
                flag_val: &*self.flags,
            },
            {
                swc_ecma_ast::Regex {
                    span: swc_common::DUMMY_SP,
                    exp: exp_val.into(),
                    flag: flag_val.into(),
                }
            }
        )
        .parse()
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
