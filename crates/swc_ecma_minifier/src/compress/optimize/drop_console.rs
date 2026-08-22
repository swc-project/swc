use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use super::Optimizer;

enum DropAction {
    /// The call's result is `undefined` in the original program (a direct
    /// `console.method(...)` call, or `console.method.call/apply(...)`), or
    /// nothing better can be substituted (custom properties, deep chains).
    ReplaceWithUndefined,

    /// The result of e.g. `console.error.bind(console)` is not `undefined`
    /// and may be held and used, so, like terser, only the console method is
    /// replaced: `console.error.bind(console)` -> `function(){}.bind()`.
    ///
    /// `guard_obj` is set when the callee contains `?.`, which means the
    /// original expression can short-circuit to `undefined`. The console
    /// method is then kept as a guard so that stays possible:
    /// `console.debug?.bind(x)` -> `(console.debug && function(){})?.bind()`.
    ReplaceCalleeObjWithNoopFn { guard_obj: bool },
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
            DropAction::ReplaceCalleeObjWithNoopFn { guard_obj } => {
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

                let noop = noop_fn_expr();
                *member.obj = if guard_obj {
                    Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        op: op!("&&"),
                        left: member.obj.take(),
                        right: Box::new(noop),
                    })
                } else {
                    noop
                };
                true
            }
        }
    }
}

fn noop_fn_expr() -> Expr {
    Expr::Fn(FnExpr {
        ident: None,
        function: Box::new(Function {
            span: DUMMY_SP,
            body: Some(FunctionBody::default()),
            ..Default::default()
        }),
    })
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

    let mut has_optional = false;

    let member = match &**callee {
        Expr::Member(member) => member,
        Expr::OptChain(opt_chain) => match &*opt_chain.base {
            OptChainBase::Member(member) => {
                has_optional |= opt_chain.optional;
                member
            }
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
                    has_optional |= opt_chain.optional;
                    depth += 1;
                    cur = &member.obj;
                }
                None => return None,
            },
            _ => return None,
        }
    }

    // Only `Function.prototype`/`Object.prototype` methods whose results are
    // type-preserved by an empty function are substituted; per the documented
    // assumptions, code must not depend on the exact contents of
    // `Function.prototype.toString()`. Custom properties attached to a
    // console method keep the previous behavior and collapse to `undefined`.
    let is_known_fn_method = matches!(
        &member.prop,
        MemberProp::Ident(prop) if matches!(&*prop.sym, "bind" | "toString" | "valueOf")
    );

    if depth == 1 && is_known_fn_method {
        // e.g. `console.error.bind(console)`: the result (a function) can
        // outlive the call, unlike `.call`/`.apply`, which invoke the console
        // method itself and return `undefined`.
        return Some(DropAction::ReplaceCalleeObjWithNoopFn {
            guard_obj: has_optional,
        });
    }

    // Direct calls, `.call`/`.apply`, custom properties, and deeper chains
    // (`console.a.b.c(...)`) collapse to `undefined`, matching terser and the
    // previous behavior.
    Some(DropAction::ReplaceWithUndefined)
}
