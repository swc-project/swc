use pmutil::q;
use swc_ecma_ast::*;

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

impl ToCode for Bool {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(
            Vars {
                bool_val: self.value,
            },
            {
                swc_ecma_ast::Bool {
                    span: swc_common::DUMMY_SP,
                    value: bool_val,
                }
            }
        )
        .parse()
    }
}

impl ToCode for Null {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(Vars {}, {
            swc_ecma_ast::Null {
                span: swc_common::DUMMY_SP,
            }
        })
        .parse()
    }
}

impl ToCode for Number {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!(
            Vars {
                num_val: self.value,
            },
            {
                swc_ecma_ast::Number {
                    span: swc_common::DUMMY_SP,
                    value: num_val,
                }
            }
        )
        .parse()
    }
}

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
