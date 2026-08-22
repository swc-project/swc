use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use super::Optimizer;

enum DropAction {
    /// The call's result is `undefined` in the original program (a direct
    /// `console.method(...)` call, or `console.method.call/apply(...)`).
    ReplaceWithUndefined,

    /// The result of e.g. `console.error.bind(console)` is not `undefined`
    /// and may be held and used, so, like terser, only the console method is
    /// replaced: `console.error.bind(console)` -> `function(){}.bind()`.
    ReplaceCalleeObjWithNoopFn,
}

impl Optimizer<'_> {
    pub(super) fn drop_console(&mut self, e: &mut Expr) -> bool {
        if !self.options.drop_console {
            return false;
        }

        let Some(action) = classify_console_call(e, self.ctx.expr_ctx.unresolved_ctxt) else {
            return false;
        };

        match action {
            DropAction::ReplaceWithUndefined => {
                report_change!("drop_console: Removing console call");
                self.changed = true;
                *e = *Expr::undefined(DUMMY_SP);
                true
            }
            DropAction::ReplaceCalleeObjWithNoopFn => {
                // `classify_console_call` proved the shape of `e`, so
                // extraction cannot fail here.
                let (callee, args) = match e {
                    Expr::Call(CallExpr {
                        callee: Callee::Expr(callee),
                        args,
                        ..
                    }) => (&mut **callee, args),
                    Expr::OptChain(opt_chain) => match &mut *opt_chain.base {
                        OptChainBase::Call(call) => (&mut *call.callee, &mut call.args),
                        _ => return false,
                    },
                    _ => return false,
                };

                let member = match callee {
                    Expr::Member(member) => member,
                    Expr::OptChain(opt_chain) => match &mut *opt_chain.base {
                        OptChainBase::Member(member) => member,
                        _ => return false,
                    },
                    _ => return false,
                };

                report_change!("drop_console: Replacing console method with an empty function");
                self.changed = true;

                args.clear();
                *member.obj = Expr::Fn(FnExpr {
                    ident: None,
                    function: Box::new(Function {
                        span: DUMMY_SP,
                        body: Some(FunctionBody::default()),
                        ..Default::default()
                    }),
                });
                true
            }
        }
    }
}

/// Checks if `e` is a call rooted at the global `console` and decides how to
/// drop it.
fn classify_console_call(e: &Expr, unresolved_ctxt: SyntaxContext) -> Option<DropAction> {
    let callee = match e {
        Expr::Call(call) => call.callee.as_expr()?,
        Expr::OptChain(opt_chain) => match &*opt_chain.base {
            OptChainBase::Call(call) => &call.callee,
            _ => return None,
        },
        _ => return None,
    };

    let member = match &**callee {
        Expr::Member(member) => member,
        Expr::OptChain(opt_chain) => match &*opt_chain.base {
            OptChainBase::Member(member) => member,
            _ => return None,
        },
        _ => return None,
    };

    // Hops below the invoked property: 0 for `console.log(...)`, 1 for
    // `console.log.bind(...)`, ...
    let mut depth = 0usize;
    let mut cur = &member.obj;
    loop {
        match &**cur {
            Expr::Ident(obj) => {
                if obj.sym != *"console" || obj.ctxt != unresolved_ctxt {
                    return None;
                }
                break;
            }
            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(_),
                ..
            }) => {
                depth += 1;
                cur = obj;
            }
            Expr::OptChain(opt_chain) => match opt_chain.base.as_member() {
                Some(member) => {
                    depth += 1;
                    cur = &member.obj;
                }
                None => return None,
            },
            _ => return None,
        }
    }

    if depth == 1 && !member.prop.is_ident_with("call") && !member.prop.is_ident_with("apply") {
        // A `Function.prototype` method on a console method can return a
        // non-`undefined` value that outlives the call (e.g. `.bind`), unlike
        // `.call`/`.apply`, which invoke the console method itself.
        return Some(DropAction::ReplaceCalleeObjWithNoopFn);
    }

    // Deeper chains (`console.a.b.c(...)`) cannot be preserved meaningfully
    // and collapse to `undefined`, matching terser.
    Some(DropAction::ReplaceWithUndefined)
}
