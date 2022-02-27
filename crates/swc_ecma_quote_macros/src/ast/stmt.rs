use pmutil::q;
use swc_ecma_ast::*;

use super::ToCode;
use crate::ctxt::Ctx;

impl_struct!(BlockStmt);
impl_struct!(DebuggerStmt);
impl_struct!(WithStmt);
impl_struct!(LabeledStmt);
impl_struct!(BreakStmt);
impl_struct!(ContinueStmt);
impl_struct!(IfStmt);
impl_struct!(SwitchStmt);
impl_struct!(ThrowStmt);
impl_struct!(TryStmt);
impl_struct!(WhileStmt);
impl_struct!(DoWhileStmt);
impl_struct!(ForStmt);
impl_struct!(ForInStmt);
impl_struct!(ForOfStmt);

impl ToCode for EmptyStmt {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
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

impl ToCode for ReturnStmt {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                arg_value: self.arg.to_code(cx),
            },
            ({
                swc_ecma_ast::ReturnStmt {
                    span: swc_common::DUMMY_SP,
                    arg: arg_value,
                }
            })
        )
        .parse()
    }
}

impl ToCode for ExprStmt {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                expr_value: self.expr.to_code(cx),
            },
            ({
                swc_ecma_ast::ExprStmt {
                    span: swc_common::DUMMY_SP,
                    expr: expr_value,
                }
            })
        )
        .parse()
    }
}
