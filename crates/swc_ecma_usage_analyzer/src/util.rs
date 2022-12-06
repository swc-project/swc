use swc_atoms::{js_word, JsWord};
use swc_ecma_ast::Stmt;

pub fn is_global_var_with_pure_property_access(s: &JsWord) -> bool {
    match *s {
        js_word!("JSON")
        | js_word!("Array")
        | js_word!("String")
        | js_word!("Object")
        | js_word!("Number")
        | js_word!("Date")
        | js_word!("BigInt")
        | js_word!("Boolean")
        | js_word!("Math")
        | js_word!("Error") => return true,
        _ => {}
    }

    matches!(
        &**s,
        "console"
            | "clearInterval"
            | "clearTimeout"
            | "setInterval"
            | "setTimeout"
            | "btoa"
            | "decodeURI"
            | "decodeURIComponent"
            | "encodeURI"
            | "encodeURIComponent"
            | "escape"
            | "eval"
            | "EvalError"
            | "Function"
            | "isFinite"
            | "isNaN"
            | "JSON"
            | "parseFloat"
            | "parseInt"
            | "RegExp"
            | "RangeError"
            | "ReferenceError"
            | "SyntaxError"
            | "TypeError"
            | "unescape"
            | "URIError"
            | "atob"
            | "globalThis"
            | "NaN"
            | "Symbol"
            | "Promise"
    )
}

pub fn can_end_conditionally(s: &Stmt) -> bool {
    ///
    ///`ignore_always`: If true, [Stmt::Return] will be ignored.
    fn can_end(s: &Stmt, ignore_always: bool) -> bool {
        match s {
            Stmt::If(s) => {
                can_end(&s.cons, false)
                    || s.alt
                        .as_deref()
                        .map(|s| can_end(s, false))
                        .unwrap_or_default()
            }

            Stmt::Switch(s) => s
                .cases
                .iter()
                .any(|case| case.cons.iter().any(|s| can_end(s, false))),

            Stmt::DoWhile(s) => can_end(&s.body, false),

            Stmt::While(s) => can_end(&s.body, false),

            Stmt::For(s) => can_end(&s.body, false),

            Stmt::ForOf(s) => can_end(&s.body, false),

            Stmt::ForIn(s) => can_end(&s.body, false),

            Stmt::Return(..) | Stmt::Break(..) | Stmt::Continue(..) => !ignore_always,

            _ => false,
        }
    }

    can_end(s, true)
}
