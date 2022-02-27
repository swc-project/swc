use pmutil::q;
use swc_ecma_ast::*;

use super::ToCode;
use crate::ctxt::Ctx;

fail_todo!(ThisExpr);
fail_todo!(ArrayLit);
fail_todo!(ObjectLit);
fail_todo!(FnExpr);
fail_todo!(ArrowExpr);
fail_todo!(ClassExpr);
fail_todo!(Tpl);
fail_todo!(UnaryExpr);
fail_todo!(UpdateExpr);
fail_todo!(BinExpr);
fail_todo!(AssignExpr);
fail_todo!(MemberExpr);
fail_todo!(SuperPropExpr);
fail_todo!(CondExpr);

impl ToCode for CallExpr {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                callee_val: self.callee.to_code(cx),
                args_val: self.args.to_code(cx),
                type_args_val: self.type_args.to_code(cx),
            },
            {
                swc_ecma_ast::CallExpr {
                    span: swc_common::DUMMY_SP,
                    callee: callee_val,
                    args: args_val,
                    type_args: type_args_val,
                }
            }
        )
        .parse()
    }
}

impl ToCode for ExprOrSpread {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                spread_val: self.spread.to_code(cx),
                expr_val: self.expr.to_code(cx),
            },
            {
                swc_ecma_ast::ExprOrSpread {
                    spread: spread_val,
                    expr: expr_val,
                }
            }
        )
        .parse()
    }
}

fail_todo!(NewExpr);
fail_todo!(SeqExpr);
fail_todo!(TaggedTpl);
fail_todo!(YieldExpr);
fail_todo!(MetaPropExpr);
fail_todo!(AwaitExpr);
fail_todo!(JSXMemberExpr);
fail_todo!(JSXNamespacedName);
fail_todo!(JSXEmptyExpr);
fail_todo!(JSXElement);
fail_todo!(JSXFragment);
fail_todo!(OptChainExpr);

impl ToCode for ParenExpr {
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                expr_value: self.expr.to_code(cx),
            },
            (swc_ecma_ast::ParenExpr {
                span: swc_common::DUMMY_SP,
                expr: expr_value,
            })
        )
        .parse()
    }
}
