use pmutil::q;
use swc_ecma_ast::*;

use super::ToCode;
use crate::ctxt::Ctx;

fail_todo!(BlockStmt);
fail_todo!(DebuggerStmt);
fail_todo!(WithStmt);
fail_todo!(LabeledStmt);
fail_todo!(BreakStmt);
fail_todo!(ContinueStmt);
fail_todo!(IfStmt);
fail_todo!(SwitchStmt);
fail_todo!(ThrowStmt);
fail_todo!(TryStmt);
fail_todo!(WhileStmt);
fail_todo!(DoWhileStmt);
fail_todo!(ForStmt);
fail_todo!(ForInStmt);
fail_todo!(ForOfStmt);

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
