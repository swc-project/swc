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
    /// `guard_obj` is set when the callee contains `?.`, which means the
    /// original expression can short-circuit to `undefined`. The console
    /// method is then kept as a guard, and the member access is made
    /// optional, so that stays possible:
    /// `console?.error.bind(x)` -> `(console?.error && (()=>{}))?.bind()`.
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

                let (member, optional) = match callee {
                    Expr::Member(member) => (member, None),
                    Expr::OptChain(OptChainExpr { optional, base, .. }) => match &mut **base {
                        OptChainBase::Member(member) => (member, Some(optional)),
                        _ => return false,
                    },
                    _ => return false,
                };

                report_change!("drop_console: Replacing console method with an empty function");
                self.changed = true;

                args.clear();

                let noop = noop_fn_expr(self.options.ecma, self.ctx.expr_ctx.unresolved_ctxt);
                *member.obj = if guard_obj {
                    // The guard is falsy whenever the original chain
                    // short-circuited, so the member access must be optional
                    // for the whole expression to still yield `undefined`
                    // then. A `?.` earlier in the chain (`console?.error`)
                    // would otherwise not protect the rewritten access:
                    // `(console?.error && noop).bind` throws for a nullish
                    // `console`.
                    if let Some(optional) = optional {
                        *optional = true;
                    }
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

/// Builds the noop function substituted for a console method. Like the native
/// console methods, both variants are callable, return `undefined` and are
/// not constructors: an arrow when the target supports it, and the built-in
/// `Function.prototype` for ES5, where no function literal is
/// non-constructible.
fn noop_fn_expr(ecma: EsVersion, unresolved_ctxt: SyntaxContext) -> Expr {
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
        Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Ident::new("Function".into(), DUMMY_SP, unresolved_ctxt).into()),
            prop: MemberProp::Ident(IdentName::new("prototype".into(), DUMMY_SP)),
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
    // `console.log.bind(...)`, ... `first_hop` is the property accessed
    // directly on `console`.
    let mut depth = 0usize;
    let mut first_hop = None;
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
                cur = &member.obj;
            }
            Expr::OptChain(opt_chain) => match opt_chain.base.as_member() {
                Some(member) => {
                    has_optional |= opt_chain.optional;
                    depth += 1;
                    first_hop = Some(&member.prop);
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
        return Some(DropAction::ReplaceCalleeObjWithNoopFn {
            guard_obj: has_optional,
        });
    }

    // Direct calls, `.call`/`.apply`, custom properties, and deeper chains
    // (`console.a.b.c(...)`) collapse to `undefined`, matching terser and the
    // previous behavior.
    Some(DropAction::ReplaceWithUndefined)
}
