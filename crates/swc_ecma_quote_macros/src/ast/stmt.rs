use pmutil::q;
use swc_ecma_ast::*;

use super::ToCode;
use crate::ctxt::Ctx;

fail_todo!(BlockStmt);

impl ToCode for EmptyStmt {
    fn to_code(&self, cx: &mut Ctx) -> syn::Expr {
        q!(
            Vars {},
            ({
                swc_ecma_ast::EmptyStmt {
                    span: swc_common::DUMMY_SP,
                }
            })
        )
        .parse()
    }
}
