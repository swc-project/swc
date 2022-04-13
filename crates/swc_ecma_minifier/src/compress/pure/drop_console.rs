use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::undefined;

use super::Pure;

impl Pure<'_> {
    pub(super) fn drop_console(&mut self, e: &mut Expr) {
        if !self.options.drop_console {
            return;
        }

        if let Expr::Call(CallExpr { callee, .. }) = e {
            // Find console.log
            let callee = match callee {
                Callee::Expr(callee) => callee,
                _ => return,
            };

            if let Expr::Member(MemberExpr {
                obj: callee_obj,
                prop: MemberProp::Ident(_),
                ..
            }) = &**callee
            {
                let mut loop_co = &**callee_obj;
                loop {
                    match loop_co {
                        Expr::Ident(obj) => {
                            if obj.sym != *"console" {
                                return;
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
                        _ => return,
                    }
                }

                report_change!("drop_console: Removing console call");
                self.changed = true;
                *e = *undefined(DUMMY_SP);
            }
        }
    }
}
