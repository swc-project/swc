use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

use super::Optimizer;

impl Optimizer<'_> {
    pub(super) fn drop_console(&mut self, e: &mut Expr) -> bool {
        if !self.options.drop_console {
            return false;
        }

        let Some(callee) = (match e {
            Expr::Call(call) => call.callee.as_expr(),
            Expr::OptChain(opt_chain) => opt_chain.base.as_call().map(|call| &call.callee),
            _ => None,
        }) else {
            return false;
        };

        let Some(mut loop_co) = (match callee.as_ref() {
            Expr::Member(member) => Some(&member.obj),
            Expr::OptChain(opt_chain) => opt_chain.base.as_member().map(|member| &member.obj),
            _ => None,
        }) else {
            return false;
        };

        loop {
            match loop_co.as_ref() {
                Expr::Ident(obj) => {
                    if obj.sym != *"console" {
                        return false;
                    }
                    break;
                }
                Expr::Member(MemberExpr {
                    obj: loop_co_obj,
                    prop: MemberProp::Ident(_),
                    ..
                }) => {
                    loop_co = loop_co_obj;
                }
                Expr::OptChain(opt_chain) => match opt_chain.base.as_member() {
                    Some(member) => loop_co = &member.obj,
                    None => return false,
                },
                _ => return false,
            }
        }

        report_change!("drop_console: Removing console call");
        self.changed = true;
        *e = *Expr::undefined(DUMMY_SP);
        true
    }
}
