use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use super::Optimizer;

impl Optimizer<'_> {
    /// Returns `true` for a Function-method call generated while preserving a
    /// consumed console result. This lets later unused-expression handling
    /// discard the generated call if its result becomes unused.
    pub(super) fn is_dropped_console_result(&self, e: &Expr) -> bool {
        let Some(callee) = (match e {
            Expr::Call(call) => call.callee.as_expr(),
            Expr::OptChain(opt_chain) => opt_chain.base.as_call().map(|call| &call.callee),
            _ => None,
        }) else {
            return false;
        };

        let Some(member) = (match callee.as_ref() {
            Expr::Member(member) => Some(member),
            Expr::OptChain(opt_chain) => opt_chain.base.as_member(),
            _ => None,
        }) else {
            return false;
        };

        matches!(
            &*member.obj,
            Expr::Fn(FnExpr { function, .. }) if function.ctxt.has_mark(self.marks.pure)
        )
    }

    /// Drops a console call while preserving the result shape when it is used.
    ///
    /// Calls such as `console.error.bind(console)` invoke a `Function` method
    /// on the console method. Replacing the whole expression with `undefined`
    /// would make the resulting value non-callable. For used results, replace
    /// the console method with an empty function instead. Unused results keep
    /// the traditional `drop_console` behavior and are removed entirely.
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

        let Some(member) = (match callee.as_ref() {
            Expr::Member(member) => Some(member),
            Expr::OptChain(opt_chain) => opt_chain.base.as_member(),
            _ => None,
        }) else {
            return false;
        };

        let mut member_count = 1;
        let mut loop_co = &member.obj;

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
                    member_count += 1;
                    loop_co = loop_co_obj;
                }
                Expr::OptChain(opt_chain) => match opt_chain.base.as_member() {
                    Some(member) => {
                        member_count += 1;
                        loop_co = &member.obj;
                    }
                    None => return false,
                },
                _ => return false,
            }
        }

        let is_call_or_apply =
            member.prop.is_ident_with("call") || member.prop.is_ident_with("apply");

        if member_count == 1 || is_call_or_apply {
            report_change!("drop_console: Removing console call");
            self.changed = true;
            *e = *Expr::undefined(DUMMY_SP);
            return true;
        }

        let Some(member) = (match e {
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) => match &mut **callee {
                Expr::Member(member) => Some(member),
                Expr::OptChain(opt_chain) => match &mut *opt_chain.base {
                    OptChainBase::Member(member) => Some(member),
                    _ => None,
                },
                _ => None,
            },
            Expr::OptChain(opt_chain) => match &mut *opt_chain.base {
                OptChainBase::Call(call) => match &mut *call.callee {
                    Expr::Member(member) => Some(member),
                    Expr::OptChain(opt_chain) => match &mut *opt_chain.base {
                        OptChainBase::Member(member) => Some(member),
                        _ => None,
                    },
                    _ => None,
                },
                _ => None,
            },
            _ => None,
        }) else {
            return false;
        };

        report_change!("drop_console: Replacing a console method with an empty function");
        self.changed = true;
        *member.obj = FnExpr {
            ident: None,
            function: Box::new(Function {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty().apply_mark(self.marks.pure),
                body: Some(FunctionBody {
                    span: DUMMY_SP,
                    stmts: Vec::new(),
                }),
                ..Default::default()
            }),
        }
        .into();

        match e {
            Expr::Call(call) => call.args.clear(),
            Expr::OptChain(opt_chain) => {
                if let OptChainBase::Call(call) = &mut *opt_chain.base {
                    call.args.clear();
                }
            }
            _ => unreachable!("console call was matched above"),
        }

        true
    }
}
