use phf::phf_set;
use swc_atoms::{Atom, JsWord};
use swc_common::Span;
use swc_ecma_ast::{
    ArrayLit, Expr, ExprOrSpread, Ident, Lit, MemberExpr, MemberProp, ObjectLit, Prop,
    PropOrSpread, SeqExpr, Str,
};
use swc_ecma_utils::{is_literal, prop_name_eq, undefined, ExprExt, Known};

use super::Pure;

/// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
static FUNCTION_SYMBOLS: phf::Set<&str> = phf_set!(
    // Constructor
    "constructor",
    // Properties
    "arguments",
    "caller",
    "displayName",
    "length",
    "name",
    "prototype",
    // Methods
    "apply",
    "bind",
    "call",
    "toString"
);

/// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
static ARRAY_SYMBOLS: phf::Set<&str> = phf_set!(
    // Constructor
    "constructor",
    // Properties
    "length",
    // Methods
    "at",
    "concat",
    "copyWithin",
    "entries",
    "every",
    "fill",
    "filter",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "flat",
    "flatMap",
    "forEach",
    "includes",
    "indexOf",
    "join",
    "keys",
    "lastIndexOf",
    "map",
    "pop",
    "push",
    "reduce",
    "reduceRight",
    "reverse",
    "shift",
    "slice",
    "some",
    "sort",
    "splice",
    "toLocaleString",
    "toReversed",
    "toSorted",
    "toSpliced",
    "toString",
    "unshift",
    "values",
    "with"
);

/// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
static STRING_SYMBOLS: phf::Set<&str> = phf_set!(
    // Constructor
    "constructor",
    // Properties
    "length",
    // Methods
    "anchor",
    "at",
    "big",
    "blink",
    "bold",
    "charAt",
    "charCodeAt",
    "codePointAt",
    "concat",
    "endsWith",
    "fixed",
    "fontcolor",
    "fontsize",
    "includes",
    "indexOf",
    "isWellFormed",
    "italics",
    "lastIndexOf",
    "link",
    "localeCompare",
    "match",
    "matchAll",
    "normalize",
    "padEnd",
    "padStart",
    "repeat",
    "replace",
    "replaceAll",
    "search",
    "slice",
    "small",
    "split",
    "startsWith",
    "strike",
    "sub",
    "substr",
    "substring",
    "sup",
    "toLocaleLowerCase",
    "toLocaleUpperCase",
    "toLowerCase",
    "toString",
    "toUpperCase",
    "toWellFormed",
    "trim",
    "trimEnd",
    "trimStart",
    "valueOf"
);

/// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
static OBJECT_SYMBOLS: phf::Set<&str> = phf_set!(
    // Constructor
    "constructor",
    // Properties
    "__proto__",
    // Methods
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf",
);

fn is_object_symbol(sym: &str) -> bool {
    OBJECT_SYMBOLS.contains(sym)
}

fn is_function_symbol(sym: &str) -> bool {
    // Inherits: Object
    FUNCTION_SYMBOLS.contains(sym) || is_object_symbol(sym)
}

fn is_array_symbol(sym: &str) -> bool {
    // Inherits: Function, Object
    ARRAY_SYMBOLS.contains(sym) || is_function_symbol(sym)
}

fn is_string_symbol(sym: &str) -> bool {
    // Inherits: Function, Object
    STRING_SYMBOLS.contains(sym) || is_function_symbol(sym)
}

impl Pure<'_> {
    /// Optimizes the following:
    ///
    /// - `''[0]`, `''[1]`, `''[-1]` -> `void 0`
    /// - `''[[]]` -> `void 0`
    /// - `''["a"]`, `''.a` -> `void 0`
    ///
    /// For String, Array and Object literals.
    /// Special cases like `''.charCodeAt`, `[].push` etc are kept intact.
    /// In-bound indexes (like `[1][0]`) and `length` are handled in the
    /// simplifier.
    ///
    /// Does nothing if `pristine_globals` is `false`.
    pub(super) fn optimize_member_expr(&mut self, obj: &Expr, prop: &MemberProp) -> Option<Expr> {
        if !self.options.pristine_globals {
            return None;
        }

        /// Taken from `simplify::expr`.
        ///
        /// `x.length` is handled as `IndexStr`, since `x.length` calls for
        /// String and Array are handled in `simplify::expr` (the `length`
        /// prototype for both of these types cannot be changed).
        #[derive(Clone, PartialEq)]
        enum KnownOp {
            // [a, b][2]
            //
            // ({})[1]
            Index(f64),

            /// ({}).foo
            ///
            /// ({}).length
            IndexStr(JsWord),
        }

        let op = match prop {
            MemberProp::Ident(Ident { sym, .. }) => {
                if self.in_callee {
                    return None;
                }

                KnownOp::IndexStr(sym.clone())
            }

            MemberProp::Computed(c) => match &*c.expr {
                Expr::Lit(Lit::Num(n)) => KnownOp::Index(n.value),

                Expr::Ident(..) => {
                    return None;
                }

                _ => {
                    let Known(s) = c.expr.as_pure_string(&self.expr_ctx) else {
                        return None;
                    };

                    if let Ok(n) = s.parse::<f64>() {
                        KnownOp::Index(n)
                    } else {
                        KnownOp::IndexStr(JsWord::from(s))
                    }
                }
            },

            _ => {
                return None;
            }
        };

        match obj {
            Expr::Lit(Lit::Str(Str { value, span, .. })) => {
                match op {
                    KnownOp::Index(idx) => {
                        if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= value.len() {
                            Some(*undefined(*span))
                        } else {
                            // idx is in bounds, this is handled in simplify
                            None
                        }
                    }

                    KnownOp::IndexStr(key) => {
                        if key == "length" {
                            // handled in simplify::expr
                            return None;
                        }

                        if is_string_symbol(key.as_str()) {
                            None
                        } else {
                            Some(*undefined(*span))
                        }
                    }
                }
            }

            Expr::Array(ArrayLit { elems, span, .. }) => {
                // do nothing if spread exists
                let has_spread = elems.iter().any(|elem| {
                    elem.as_ref()
                        .map(|elem| elem.spread.is_some())
                        .unwrap_or(false)
                });

                if has_spread {
                    return None;
                }

                // all expressions with side effects
                let mut exprs = vec![];
                for elem in elems.iter().filter_map(|e| e.as_ref()) {
                    self.expr_ctx
                        .extract_side_effects_to(&mut exprs, (*elem.expr).clone());
                    //todo clone
                }
                // if the array can be removed entirely without side effects.
                // if true, side effects exist, and removing the array will
                // potentially change the behaviour of the program.
                // instead, we replace the MemberExpr with a SeqExpr of all
                // elements with side effects, with undefined at the end.
                let can_be_fully_removed = exprs.is_empty();

                // Returns `undefined` if the array can be fully removed,
                // or a SeqExpr with `undefined` at the end if there are side effects.
                macro_rules! undefined {
                    () => {
                        if can_be_fully_removed {
                            *undefined(*span)
                        } else {
                            exprs.push(Box::new(*undefined(*span)));

                            Expr::Seq(SeqExpr { span: *span, exprs })
                        }
                    };
                }

                match op {
                    KnownOp::Index(idx) => {
                        if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= elems.len() {
                            Some(undefined!())
                        } else {
                            // idx is in bounds, this is handled in simplify
                            None
                        }
                    }

                    KnownOp::IndexStr(key) => {
                        if key == "length" {
                            // handled in simplify::expr
                            return None;
                        }

                        if is_array_symbol(key.as_str()) {
                            // replace with an array containing only side effects,
                            // e.g. [].push or [f()].push
                            let elems: Vec<Option<ExprOrSpread>> = exprs
                                .into_iter()
                                .map(|e| {
                                    Some(ExprOrSpread {
                                        spread: None,
                                        expr: e,
                                    })
                                })
                                .collect();

                            Some(Expr::Member(MemberExpr {
                                span: *span,
                                obj: Box::new(Expr::Array(ArrayLit { span: *span, elems })),
                                prop: MemberProp::Ident(Ident::new(key, Span::default())),
                            }))
                        } else {
                            Some(undefined!())
                        }
                    }
                }
            }

            Expr::Object(ObjectLit { props, span }) => {
                // get key
                let key = match op {
                    KnownOp::Index(i) => Atom::from(i.to_string()),
                    KnownOp::IndexStr(key) if key != *"yield" && is_literal(props) => key,
                    _ => {
                        return None;
                    }
                };

                // do nothing if spread exists
                let has_spread = props
                    .iter()
                    .any(|prop| matches!(prop, PropOrSpread::Spread(..)));

                if has_spread {
                    return None;
                }

                let idx = props.iter().rev().position(|p| match p {
                    PropOrSpread::Prop(p) => match &**p {
                        Prop::Shorthand(i) => i.sym == key,
                        Prop::KeyValue(k) => prop_name_eq(&k.key, &key),
                        Prop::Assign(p) => p.key.sym == key,
                        Prop::Getter(..) => false,
                        Prop::Setter(..) => false,
                        // TODO
                        Prop::Method(..) => false,
                    },
                    _ => unreachable!(),
                });

                // valid properties are handled in simplify::expr
                if idx.map(|idx| props.len() - 1 - idx).is_some() {
                    return None;
                }

                if is_object_symbol(key.as_str()) {
                    None
                } else {
                    Some(*undefined(*span))
                }
            }

            _ => None,
        }
    }
}
