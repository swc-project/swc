use phf::phf_set;
use swc_atoms::{Atom, JsWord};
use swc_ecma_ast::{
    ArrayLit, Expr, ExprOrSpread, Ident, Lit, MemberExpr, MemberProp, ObjectLit, Prop,
    PropOrSpread, SeqExpr, Str,
};
use swc_ecma_utils::{is_literal, prop_name_eq, undefined, ExprExt, Known};

use super::Pure;

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

fn is_array_symbol(sym: &str) -> bool {
    // Inherits: Object
    ARRAY_SYMBOLS.contains(sym) || is_object_symbol(sym)
}

fn is_string_symbol(sym: &str) -> bool {
    // Inherits: Object
    STRING_SYMBOLS.contains(sym) || is_object_symbol(sym)
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
    pub(super) fn optimize_member_expr(
        &mut self,
        obj: &mut Expr,
        prop: &MemberProp,
    ) -> Option<Expr> {
        if !self.options.pristine_globals || self.in_left_side_assign {
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

                // A match expression would be easier to read, but we need to do it this way
                // unless we want to clone elements or use a macro and deal with mutability
                // since we need side effect extraction in multiple places.
                // To be honest, this is probably a lot easier to read and offers minimal
                // code size anyway.

                let (is_idx_out_of_bounds, key, is_array_symbol, is_length) = match op {
                    KnownOp::Index(i) => (
                        i.fract() != 0.0 || i < 0.0 || i as usize >= elems.len(),
                        None,
                        false,
                        false,
                    ),

                    KnownOp::IndexStr(key) => {
                        let is_array_symbol = is_array_symbol(key.as_str());
                        let is_length = key == "length";

                        (false, Some(key), is_array_symbol, is_length)
                    }
                };

                if is_length {
                    // Handled in simplify::expr
                    return None;
                }

                // If the result is undefined.
                // In this case, the optimized expression is:
                // (x, y, undefined)
                // where x and y are side effects.
                // If no side effects exist, the result is simply `undefined` instead of a SeqExpr.
                let is_result_undefined = is_idx_out_of_bounds || (key.is_some() && !is_array_symbol);

                // Elements with side effects.
                // Will be empty if we don't need side effects.
                let mut side_effects = vec![];
                // If we need to compute side effects.
                let need_side_effects = is_result_undefined || is_array_symbol;
                if need_side_effects {
                    // Move all side effects into side_effects.
                    // This completely drains elems.
                    elems
                        .drain(..)
                        .into_iter()
                        .filter_map(|x| x)
                        .for_each(|elem| {
                            self.expr_ctx
                                .extract_side_effects_to(&mut side_effects, *elem.expr);
                        });
                }

                if is_result_undefined {
                    // Optimization is `undefined`.

                    if side_effects.is_empty() {
                        // No side effects, no need for SeqExpr
                        return Some(*undefined(*span));
                    }

                    // Add undefined to end
                    side_effects.push(Box::new(*undefined(*span)));

                    return Some(Expr::Seq(SeqExpr {
                        span: *span,
                        exprs: side_effects,
                    }));
                }

                if is_array_symbol {
                    // Optimization is the same array but with only side effects.
                    // e.g. [1, 2, f()].push becomes [f()].push

                    // property
                    let key = match key {
                        Some(x) => x,
                        None => unreachable!(),
                    };

                    let elems: Vec<Option<ExprOrSpread>> = side_effects
                        .into_iter()
                        .map(|e| {
                            Some(ExprOrSpread {
                                spread: None,
                                expr: e,
                            })
                        })
                        .collect();

                    return Some(Expr::Member(MemberExpr {
                        span: *span,
                        obj: Box::new(Expr::Array(ArrayLit { span: *span, elems })),
                        prop: MemberProp::Ident(Ident::new(key, *span)),
                    }));
                }

                return None;
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
