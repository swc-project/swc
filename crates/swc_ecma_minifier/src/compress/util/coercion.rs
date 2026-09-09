use swc_ecma_ast::*;
use swc_ecma_utils::{ExprCtx, ExprExt, Type, Value};

/// Returns whether `sym` names a standard intrinsic or recognized host global
/// whose value is an object or function. These values can have observable
/// `toString` mutations between array-element evaluation and coercion by
/// `join` or addition.
pub(crate) fn is_intrinsic_object_or_function(sym: &str) -> bool {
    matches!(
        sym,
        "AggregateError"
            | "AbortController"
            | "AbortSignal"
            | "Array"
            | "ArrayBuffer"
            | "AsyncDisposableStack"
            | "AsyncIterator"
            | "Atomics"
            | "alert"
            | "atob"
            | "BigInt"
            | "BigInt64Array"
            | "BigUint64Array"
            | "Blob"
            | "Boolean"
            | "btoa"
            | "clearImmediate"
            | "clearInterval"
            | "clearTimeout"
            | "confirm"
            | "console"
            | "crypto"
            | "DataView"
            | "Date"
            | "DOMException"
            | "decodeURI"
            | "decodeURIComponent"
            | "document"
            | "DisposableStack"
            | "encodeURI"
            | "encodeURIComponent"
            | "Error"
            | "escape"
            | "eval"
            | "EvalError"
            | "FinalizationRegistry"
            | "fetch"
            | "Float16Array"
            | "Float32Array"
            | "Float64Array"
            | "Function"
            | "globalThis"
            | "global"
            | "Headers"
            | "Intl"
            | "Int8Array"
            | "Int16Array"
            | "Int32Array"
            | "Iterator"
            | "isFinite"
            | "isNaN"
            | "JSON"
            | "Map"
            | "Math"
            | "Number"
            | "Object"
            | "navigator"
            | "parseFloat"
            | "parseInt"
            | "performance"
            | "process"
            | "Promise"
            | "prompt"
            | "Proxy"
            | "queueMicrotask"
            | "RangeError"
            | "ReferenceError"
            | "Reflect"
            | "RegExp"
            | "Request"
            | "Response"
            | "Set"
            | "setImmediate"
            | "setInterval"
            | "setTimeout"
            | "self"
            | "SharedArrayBuffer"
            | "String"
            | "structuredClone"
            | "SuppressedError"
            | "Symbol"
            | "SyntaxError"
            | "TypeError"
            | "Uint8Array"
            | "Uint8ClampedArray"
            | "Uint16Array"
            | "Uint32Array"
            | "URIError"
            | "unescape"
            | "URL"
            | "URLSearchParams"
            | "TextDecoder"
            | "TextEncoder"
            | "WeakMap"
            | "WeakRef"
            | "WeakSet"
            | "WebAssembly"
            | "window"
    )
}

/// Returns the runtime-value expression after removing syntax-only wrappers.
fn unwrap_value_preserving_expr(mut expr: &Expr) -> &Expr {
    loop {
        expr = match expr {
            Expr::Paren(ParenExpr { expr: inner, .. })
            | Expr::TsAs(TsAsExpr { expr: inner, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { expr: inner, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr: inner, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr: inner, .. })
            | Expr::TsInstantiation(TsInstantiation { expr: inner, .. })
            | Expr::TsSatisfies(TsSatisfiesExpr { expr: inner, .. }) => inner,
            _ => return expr,
        };
    }
}

/// Whether addition could coerce this expression with a different primitive
/// hint than `join`.
pub(crate) fn may_evaluate_to_object(expr_ctx: ExprCtx, expr: &Expr) -> bool {
    let expr = unwrap_value_preserving_expr(expr);

    match expr {
        Expr::Seq(SeqExpr { exprs, .. }) => exprs
            .last()
            .is_some_and(|last| may_evaluate_to_object(expr_ctx, last)),
        Expr::Assign(AssignExpr {
            op: op!("="),
            right,
            ..
        }) => may_evaluate_to_object(expr_ctx, right),
        Expr::Assign(AssignExpr { op, .. }) if op.may_short_circuit() => true,
        Expr::Await(AwaitExpr { arg, .. })
            if matches!(
                &**arg,
                Expr::Call(CallExpr {
                    callee: Callee::Import(..),
                    ..
                })
            ) =>
        {
            true
        }
        Expr::Await(AwaitExpr { arg, .. }) => may_evaluate_to_object(expr_ctx, arg),
        Expr::Cond(CondExpr { cons, alt, .. }) => {
            may_evaluate_to_object(expr_ctx, cons) || may_evaluate_to_object(expr_ctx, alt)
        }
        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||") | op!("??"),
            left,
            right,
            ..
        }) => may_evaluate_to_object(expr_ctx, left) || may_evaluate_to_object(expr_ctx, right),
        Expr::Call(CallExpr {
            callee: Callee::Super(..) | Callee::Import(..),
            ..
        }) => true,
        Expr::MetaProp(MetaPropExpr {
            kind: MetaPropKind::ImportMeta | MetaPropKind::NewTarget,
            ..
        }) => true,
        Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            ..
        }) => may_call_evaluate_to_object(expr_ctx, callee),
        Expr::OptChain(OptChainExpr { base, .. }) => match &**base {
            OptChainBase::Member(..) => true,
            OptChainBase::Call(OptCall { callee, .. }) => {
                may_call_evaluate_to_object(expr_ctx, callee)
            }
        },
        Expr::TaggedTpl(TaggedTpl { tag, .. }) => may_call_evaluate_to_object(expr_ctx, tag),
        Expr::Yield(..)
        | Expr::Arrow(..)
        | Expr::Class(..)
        | Expr::This(..)
        | Expr::JSXElement(..)
        | Expr::JSXFragment(..)
        | Expr::Member(..)
        | Expr::SuperProp(..) => true,
        Expr::Ident(ident)
            if ident.ctxt == expr_ctx.unresolved_ctxt
                && (is_intrinsic_object_or_function(&ident.sym) || ident.sym == "arguments") =>
        {
            true
        }
        Expr::Ident(ident) if ident.ctxt != expr_ctx.unresolved_ctxt => true,
        _ => expr.get_type(expr_ctx) == Value::Known(Type::Obj),
    }
}

fn may_call_evaluate_to_object(expr_ctx: ExprCtx, callee: &Expr) -> bool {
    let callee = unwrap_value_preserving_expr(callee);

    match callee {
        Expr::Seq(SeqExpr { exprs, .. }) => exprs
            .last()
            .is_some_and(|last| may_call_evaluate_to_object(expr_ctx, last)),
        Expr::Assign(AssignExpr {
            op: op!("="),
            right,
            ..
        }) => may_call_evaluate_to_object(expr_ctx, right),
        Expr::Assign(AssignExpr { op, .. }) if op.may_short_circuit() => true,
        Expr::Await(AwaitExpr { arg, .. }) => may_call_evaluate_to_object(expr_ctx, arg),
        Expr::Cond(CondExpr { cons, alt, .. }) => {
            may_call_evaluate_to_object(expr_ctx, cons)
                || may_call_evaluate_to_object(expr_ctx, alt)
        }
        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||") | op!("??"),
            left,
            right,
            ..
        }) => {
            may_call_evaluate_to_object(expr_ctx, left)
                || may_call_evaluate_to_object(expr_ctx, right)
        }
        Expr::Ident(ident) => {
            ident.ctxt != expr_ctx.unresolved_ctxt
                || matches!(
                    &*ident.sym,
                    "Object"
                        | "Array"
                        | "RegExp"
                        | "Function"
                        | "Error"
                        | "AggregateError"
                        | "SuppressedError"
                        | "EvalError"
                        | "RangeError"
                        | "ReferenceError"
                        | "SyntaxError"
                        | "TypeError"
                        | "URIError"
                        // Direct eval can dynamically produce an object.
                        | "eval"
                        // These globals can return objects whose string
                        // coercion is observable after later expressions run.
                        | "fetch"
                        | "setImmediate"
                        | "setInterval"
                        | "setTimeout"
                        | "structuredClone"
                )
        }
        _ => true,
    }
}

/// Whether coercing this expression to a string can throw because it is a
/// Symbol.
pub(crate) fn may_evaluate_to_symbol(expr_ctx: ExprCtx, expr: &Expr) -> bool {
    let expr = unwrap_value_preserving_expr(expr);

    match expr {
        Expr::Seq(SeqExpr { exprs, .. }) => exprs
            .last()
            .is_some_and(|last| may_evaluate_to_symbol(expr_ctx, last)),
        Expr::Assign(AssignExpr {
            op: op!("="),
            right,
            ..
        }) => may_evaluate_to_symbol(expr_ctx, right),
        Expr::Assign(AssignExpr { op, .. }) if op.may_short_circuit() => true,
        Expr::Await(AwaitExpr { arg, .. }) => may_evaluate_to_symbol(expr_ctx, arg),
        Expr::Cond(CondExpr { cons, alt, .. }) => {
            may_evaluate_to_symbol(expr_ctx, cons) || may_evaluate_to_symbol(expr_ctx, alt)
        }
        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||") | op!("??"),
            left,
            right,
            ..
        }) => may_evaluate_to_symbol(expr_ctx, left) || may_evaluate_to_symbol(expr_ctx, right),
        Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            ..
        }) => may_call_evaluate_to_symbol(expr_ctx, callee),
        Expr::OptChain(OptChainExpr { base, .. }) => match &**base {
            OptChainBase::Member(..) => true,
            OptChainBase::Call(OptCall { callee, .. }) => {
                may_call_evaluate_to_symbol(expr_ctx, callee)
            }
        },
        Expr::TaggedTpl(TaggedTpl { tag, .. }) => may_call_evaluate_to_symbol(expr_ctx, tag),
        Expr::Yield(..) | Expr::Member(..) => true,
        Expr::Ident(ident) if ident.ctxt != expr_ctx.unresolved_ctxt => true,
        _ => matches!(expr.get_type(expr_ctx), Value::Known(Type::Symbol)),
    }
}

fn may_call_evaluate_to_symbol(expr_ctx: ExprCtx, callee: &Expr) -> bool {
    let callee = unwrap_value_preserving_expr(callee);

    match callee {
        Expr::Seq(SeqExpr { exprs, .. }) => exprs
            .last()
            .is_some_and(|last| may_call_evaluate_to_symbol(expr_ctx, last)),
        Expr::Assign(AssignExpr {
            op: op!("="),
            right,
            ..
        }) => may_call_evaluate_to_symbol(expr_ctx, right),
        Expr::Assign(AssignExpr { op, .. }) if op.may_short_circuit() => true,
        Expr::Await(AwaitExpr { arg, .. }) => may_call_evaluate_to_symbol(expr_ctx, arg),
        Expr::Cond(CondExpr { cons, alt, .. }) => {
            may_call_evaluate_to_symbol(expr_ctx, cons)
                || may_call_evaluate_to_symbol(expr_ctx, alt)
        }
        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||") | op!("??"),
            left,
            right,
            ..
        }) => {
            may_call_evaluate_to_symbol(expr_ctx, left)
                || may_call_evaluate_to_symbol(expr_ctx, right)
        }
        _ => {
            callee.is_global_ref_to(expr_ctx, "Symbol")
                || matches!(callee, Expr::Ident(ident) if ident.ctxt != expr_ctx.unresolved_ctxt)
                || matches!(
                    callee,
                    Expr::Member(..) | Expr::OptChain(..) | Expr::Arrow(..) | Expr::Fn(..)
                )
        }
    }
}
