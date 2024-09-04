use phf::phf_set;
use swc_atoms::{Atom, JsWord};
use swc_common::Spanned;
use swc_ecma_ast::{
    ArrayLit, Expr, ExprOrSpread, IdentName, Lit, MemberExpr, MemberProp, ObjectLit, Prop,
    PropOrSpread, SeqExpr, Str,
};
use swc_ecma_utils::{prop_name_eq, ExprExt, Known};

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
    // removed, but kept in as these are often checked and polyfilled
    "watch",
    "unwatch"
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

/// Checks if the given key exists in the given properties, taking the
/// `__proto__` property and order of keys into account (the order of keys
/// matters for nested `__proto__` properties).
///
/// Returns `None` if the key's existence is uncertain, or `Some` if it is
/// certain.
///
/// A key's existence is uncertain if a `__proto__` property exists and the
/// value is non-literal.
fn does_key_exist(key: &str, props: &Vec<PropOrSpread>) -> Option<bool> {
    for prop in props {
        match prop {
            PropOrSpread::Prop(prop) => match &**prop {
                Prop::Shorthand(ident) => {
                    if ident.sym == key {
                        return Some(true);
                    }
                }

                Prop::KeyValue(prop) => {
                    if key != "__proto__" && prop_name_eq(&prop.key, "__proto__") {
                        // If __proto__ is defined, we need to check the contents of it,
                        // as well as any nested __proto__ objects
                        if let Some(object) = prop.value.as_object() {
                            // __proto__ is an ObjectLiteral, check if key exists in it
                            let exists = does_key_exist(key, &object.props);
                            if exists.is_none() {
                                return None;
                            } else if exists.is_some_and(|exists| exists) {
                                return Some(true);
                            }
                        } else {
                            // __proto__ is not a literal, it is impossible to know if the
                            // key exists or not
                            return None;
                        }
                    } else {
                        // Normal key
                        if prop_name_eq(&prop.key, key) {
                            return Some(true);
                        }
                    }
                }

                // invalid
                Prop::Assign(_) => {
                    return None;
                }

                Prop::Getter(getter) => {
                    if prop_name_eq(&getter.key, key) {
                        return Some(true);
                    }
                }

                Prop::Setter(setter) => {
                    if prop_name_eq(&setter.key, key) {
                        return Some(true);
                    }
                }

                Prop::Method(method) => {
                    if prop_name_eq(&method.key, key) {
                        return Some(true);
                    }
                }
            },

            _ => {
                return None;
            }
        }
    }

    // No key was found and there's no uncertainty, meaning the key certainly
    // doesn't exist
    Some(false)
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
        if !self.options.pristine_globals || self.ctx.is_lhs_of_assign || self.ctx.is_callee {
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
            MemberProp::Ident(IdentName { sym, .. }) => {
                if self.ctx.is_callee {
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
            Expr::Seq(SeqExpr { exprs, span }) => {
                // Optimize when last value in a SeqExpr is being indexed
                // while preserving side effects.
                //
                // (0, {a: 5}).a
                //
                // (0, f(), {a: 5}).a
                //
                // (0, f(), [1, 2])[0]
                //
                // etc.

                // Try to optimize with obj being the last expr
                let replacement = self.optimize_member_expr(exprs.last_mut()?, prop)?;

                // Replace last element with replacement
                let mut exprs: Vec<Box<Expr>> = exprs.drain(..(exprs.len() - 1)).collect();
                exprs.push(Box::new(replacement));

                Some(SeqExpr { span: *span, exprs }.into())
            }

            Expr::Lit(Lit::Str(Str { value, span, .. })) => {
                match op {
                    KnownOp::Index(idx) => {
                        if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= value.len() {
                            Some(*Expr::undefined(*span))
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
                            Some(*Expr::undefined(*span))
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

                match op {
                    KnownOp::Index(idx) => {
                        if idx >= 0.0 && (idx as usize) < elems.len() && idx.fract() == 0.0 {
                            // idx is in bounds, handled in simplify
                            return None;
                        }

                        // Replacement is certain at this point, and is always undefined

                        // Extract side effects
                        let mut exprs = Vec::new();
                        elems.drain(..).flatten().for_each(|elem| {
                            self.expr_ctx.extract_side_effects_to(&mut exprs, *elem.expr);
                        });

                        Some(if exprs.is_empty() {
                            // No side effects, replacement is:
                            // (0, void 0)
                            SeqExpr {
                                span: *span,
                                exprs: vec![0.into(), Expr::undefined(*span)]
                            }.into()
                        } else {
                            // Side effects exist, replacement is:
                            // (x(), y(), void 0)
                            // Where `x()` and `y()` are side effects.
                            exprs.push(Expr::undefined(*span));

                            SeqExpr {
                                span: *span,
                                exprs
                            }.into()
                        })
                    }

                    KnownOp::IndexStr(key) if key != "length" /* handled in simplify */ => {
                        // If the property is a known symbol, e.g. [].push
                        let is_known_symbol = is_array_symbol(&key);

                        if is_known_symbol {
                            // We need to check if this is already optimized as if we don't,
                            // it'll lead to infinite optimization when the visitor visits
                            // again.
                            //
                            // A known symbol expression is already optimized if all
                            // non-side effects have been removed.
                            let optimized_len = elems
                                .iter()
                                .flatten()
                                .filter(|elem| elem.expr.may_have_side_effects(&self.expr_ctx))
                                .count();

                            if optimized_len == elems.len() {
                                // Already optimized
                                return None;
                            }
                        }

                        // Extract side effects
                        let mut exprs = Vec::new();
                        elems.drain(..).flatten().for_each(|elem| {
                            self.expr_ctx.extract_side_effects_to(&mut exprs, *elem.expr);
                        });

                        Some(if is_known_symbol {
                            // [x(), y()].push
                            MemberExpr {
                                span: *span,
                                obj: ArrayLit {
                                    span: *span,
                                    elems: exprs
                                        .into_iter()
                                        .map(|elem| Some(ExprOrSpread {
                                            spread: None,
                                            expr: elem,
                                        }))
                                        .collect()
                                }.into(),
                                prop: prop.clone(),
                            }.into()
                        } else {
                            let val = Expr::undefined(
                                *span);

                            if exprs.is_empty() {
                                // No side effects, replacement is:
                                // (0, void 0)
                                SeqExpr {
                                    span: val.span(),
                                    exprs: vec![0.into(), val]
                                }.into()
                            } else {
                                // Side effects exist, replacement is:
                                // (x(), y(), void 0)
                                // Where `x()` and `y()` are side effects.
                                exprs.push(val);

                                SeqExpr {
                                    span: *span,
                                    exprs
                                }.into()
                            }
                        })
                    }

                    _ => None
                }
            }

            Expr::Object(ObjectLit { props, span }) => {
                // Do nothing if there are invalid keys.
                //
                // Objects with one or more keys that are not literals or identifiers
                // are impossible to optimize as we don't know for certain if a given
                // key is actually invalid, e.g. `{[bar()]: 5}`, since we don't know
                // what `bar()` returns.
                let contains_invalid_key = props
                    .iter()
                    .any(|prop| !matches!(prop, PropOrSpread::Prop(prop) if matches!(&**prop, Prop::KeyValue(kv) if kv.key.is_ident() || kv.key.is_str() || kv.key.is_num())));

                if contains_invalid_key {
                    return None;
                }

                // Get key as Atom
                let key = match op {
                    KnownOp::Index(i) => Atom::from(i.to_string()),
                    KnownOp::IndexStr(key) if key != *"yield" => key,
                    _ => {
                        return None;
                    }
                };

                // Check if key exists
                let exists = does_key_exist(&key, props);
                if exists.is_none() || exists.is_some_and(|exists| exists) {
                    // Valid properties are handled in simplify
                    return None;
                }

                let is_known_symbol = is_object_symbol(&key);
                if is_known_symbol {
                    // Like with arrays, we need to check if this is already optimized
                    // before returning Some so we don't end up in an infinite loop.
                    //
                    // The same logic with arrays applies; read above.
                    let optimized_len = props
                        .iter()
                        .filter(|prop| {
                            matches!(prop, PropOrSpread::Prop(prop) if matches!(&**prop, Prop::KeyValue(prop) if prop.value.may_have_side_effects(&self.expr_ctx)))
                        })
                        .count();

                    if optimized_len == props.len() {
                        // Already optimized
                        return None;
                    }
                }

                // Can be optimized fully or partially
                Some(*self.expr_ctx.preserve_effects(
                    *span,
                    if is_known_symbol {
                        // Valid key, e.g. "hasOwnProperty". Replacement:
                        // (foo(), bar(), {}.hasOwnProperty)
                        MemberExpr {
                            span: *span,
                            obj: ObjectLit {
                                span: *span,
                                props: Vec::new(),
                            }
                            .into(),
                            prop: MemberProp::Ident(IdentName::new(key, *span)),
                        }
                        .into()
                    } else {
                        // Invalid key. Replace with side effects plus `undefined`.
                        Expr::undefined(*span)
                    },
                    props.drain(..).map(|x| match x {
                        PropOrSpread::Prop(prop) => match *prop {
                            Prop::KeyValue(kv) => kv.value,
                            _ => unreachable!(),
                        },
                        _ => unreachable!(),
                    }),
                ))
            }

            _ => None,
        }
    }
}
