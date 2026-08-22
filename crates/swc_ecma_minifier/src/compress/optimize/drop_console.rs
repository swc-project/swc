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
    /// replaced: `console.error.bind(console)` -> `(()=>{}).bind()`.
    ///
    /// `guard` preserves the short-circuiting of a `?.` in the callee, per
    /// hop; see [NoopGuard].
    ReplaceCalleeObjWithNoopFn { guard: Option<NoopGuard> },
}

/// How the noop substitution keeps the short-circuiting of a `?.` in the
/// callee. Which hop is optional matters: the replacement must yield
/// `undefined` exactly when the original chain short-circuited, and still
/// throw when it did not.
#[derive(Clone, Copy)]
enum NoopGuard {
    /// The final member access is optional (`console.debug?.bind(x)`, and
    /// also `console?.debug?.bind(x)`): a nullish method short-circuits, so
    /// the method is kept as a guard and the access stays optional:
    /// `(console.debug && noop)?.bind()`.
    Member,

    /// Only the `console` hop is optional (`console?.error.bind(x)`): a
    /// nullish `console` short-circuits, but a nullish `console.error` still
    /// throws at the `.bind` access. The `console` check is hoisted and the
    /// `?.` dropped: `console == null ? void 0 : (console.error &&
    /// noop).bind()`.
    Console,
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
            DropAction::ReplaceCalleeObjWithNoopFn { guard } => {
                // The `console` ident of a hoisted check; set for
                // [NoopGuard::Console] once the inner borrows of `e` end.
                let hoisted_console = {
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

                    let hoisted_console = match guard {
                        Some(NoopGuard::Console) => match &*member.obj {
                            Expr::OptChain(first_hop) => first_hop
                                .base
                                .as_member()
                                .and_then(|member| member.obj.as_ident())
                                .cloned(),
                            _ => None,
                        },
                        _ => None,
                    };
                    if matches!(guard, Some(NoopGuard::Console)) && hoisted_console.is_none() {
                        return false;
                    }

                    report_change!("drop_console: Replacing console method with an empty function");
                    self.changed = true;

                    args.clear();

                    if let Expr::OptChain(first_hop) = &mut *member.obj {
                        if matches!(guard, Some(NoopGuard::Console)) {
                            // The check is hoisted into `hoisted_console`.
                            first_hop.optional = false;
                        }
                    }

                    let noop = noop_fn_expr(self.options.ecma);
                    *member.obj = if guard.is_some() {
                        Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            op: op!("&&"),
                            left: member.obj.take(),
                            right: Box::new(noop),
                        })
                    } else {
                        noop
                    };

                    hoisted_console
                };

                if let Some(console) = hoisted_console {
                    *e = Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        test: Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            op: op!("=="),
                            left: Box::new(console.into()),
                            right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                        })),
                        cons: Expr::undefined(DUMMY_SP),
                        alt: Box::new(e.take()),
                    });
                }
                true
            }
        }
    }
}

/// Builds the noop function substituted for a console method: an arrow for
/// ES2015+, which - like the native console methods - is not a constructor,
/// and `function () {}` for ES5.
///
/// Local invariant beyond the documented assumptions: under an ES5 target,
/// where a non-constructible function cannot be expressed, constructing the
/// result of a dropped `console.method.bind(...)` succeeds instead of
/// throwing. Referencing a built-in like `Function.prototype` instead would
/// rely on the mutable global `Function`.
fn noop_fn_expr(ecma: EsVersion) -> Expr {
    if ecma >= EsVersion::Es2015 {
        Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            params: Vec::new(),
            body: Box::new(ArrowFunctionBody::FunctionBody(FunctionBody::default())),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
        })
    } else {
        Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(Function {
                span: DUMMY_SP,
                body: Some(FunctionBody::default()),
                ..Default::default()
            }),
        })
    }
}

/// The name of a member access if it is statically known, whether written as
/// `a.b` or `a["b"]`.
fn static_prop_name(prop: &MemberProp) -> Option<&str> {
    match prop {
        MemberProp::Ident(prop) => Some(&*prop.sym),
        MemberProp::Computed(prop) => match &*prop.expr {
            Expr::Lit(Lit::Str(prop)) => prop.value.as_str(),
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
    }
}

fn is_console_method(name: &str) -> bool {
    matches!(
        name,
        "assert"
            | "clear"
            | "count"
            | "countReset"
            | "debug"
            | "dir"
            | "dirxml"
            | "error"
            | "group"
            | "groupCollapsed"
            | "groupEnd"
            | "info"
            | "log"
            | "table"
            | "time"
            | "timeEnd"
            | "timeLog"
            | "trace"
            | "warn"
            // Non-standard, but widely implemented.
            | "profile"
            | "profileEnd"
            | "timeStamp"
    )
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

    // Whether the final member access itself is optional
    // (`console.error?.bind`).
    let mut member_optional = false;

    let member = match &**callee {
        Expr::Member(member) => member,
        Expr::OptChain(opt_chain) => match &*opt_chain.base {
            OptChainBase::Member(member) => {
                member_optional = opt_chain.optional;
                member
            }
            _ => return None,
        },
        _ => return None,
    };

    // Hops below the invoked property: 0 for `console.log(...)`, 1 for
    // `console.log.bind(...)`, ... `first_hop` is the property accessed
    // directly on `console`, `first_hop_optional` whether that access is
    // optional (`console?.error`).
    let mut depth = 0usize;
    let mut first_hop = None;
    let mut first_hop_optional = false;
    let mut cur = &member.obj;
    loop {
        match &**cur {
            Expr::Ident(obj) => {
                if obj.sym != *"console" || obj.ctxt != unresolved_ctxt {
                    return None;
                }
                break;
            }
            Expr::Member(member) if member.prop.is_ident() => {
                depth += 1;
                first_hop = Some(&member.prop);
                first_hop_optional = false;
                cur = &member.obj;
            }
            Expr::OptChain(opt_chain) => match opt_chain.base.as_member() {
                Some(member) => {
                    depth += 1;
                    first_hop = Some(&member.prop);
                    first_hop_optional = opt_chain.optional;
                    cur = &member.obj;
                }
                None => return None,
            },
            _ => return None,
        }
    }

    // Only `Function.prototype`/`Object.prototype` methods whose results are
    // type-preserved by an empty function are substituted, and only when they
    // are reached through a known console method: a custom property on
    // `console` may hold any value, so the previous behavior (`undefined`) is
    // kept for those, as it is for custom properties attached to a console
    // method. Per the documented assumptions, code must not depend on the
    // exact contents of `Function.prototype.toString()`.
    let is_preservable_fn_call = matches!(
        static_prop_name(&member.prop),
        Some("bind" | "toString" | "valueOf")
    ) && first_hop
        .and_then(static_prop_name)
        .is_some_and(is_console_method);

    if depth == 1 && is_preservable_fn_call {
        // e.g. `console.error.bind(console)`: the result (a function) can
        // outlive the call, unlike `.call`/`.apply`, which invoke the console
        // method itself and return `undefined`.
        let guard = if member_optional {
            Some(NoopGuard::Member)
        } else if first_hop_optional {
            Some(NoopGuard::Console)
        } else {
            None
        };
        return Some(DropAction::ReplaceCalleeObjWithNoopFn { guard });
    }

    // Direct calls, `.call`/`.apply`, custom properties, and deeper chains
    // (`console.a.b.c(...)`) collapse to `undefined`, matching terser and the
    // previous behavior.
    Some(DropAction::ReplaceWithUndefined)
}
