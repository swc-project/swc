//! ES2015: Shorthand Properties
//!
//! This plugin transforms shorthand properties and methods to ES5.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! var o = { a, b, c };
//! var cat = {
//!   getName() {
//!     return name;
//!   }
//! };
//! ```
//!
//! Output:
//! ```js
//! var o = { a: a, b: b, c: c };
//! var cat = {
//!   getName: function () {
//!     return name;
//!   }
//! };
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-shorthand-properties](https://babel.dev/docs/babel-plugin-transform-shorthand-properties).

use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ShorthandPass
}

struct ShorthandPass;

impl VisitMutHook<TraverseCtx> for ShorthandPass {
    fn exit_prop(&mut self, prop: &mut Prop, _ctx: &mut TraverseCtx) {
        match prop {
            Prop::Shorthand(ident) => {
                let value = ident.clone().into();

                *prop = Prop::KeyValue(KeyValueProp {
                    key: if ident.sym == "__proto__" {
                        PropName::Computed(ComputedPropName {
                            span: ident.span,
                            expr: ident.sym.clone().into(),
                        })
                    } else {
                        ident.take().into()
                    },
                    value,
                });
            }
            Prop::Method(MethodProp { key, function }) => {
                let key = match key.take() {
                    PropName::Ident(IdentName { span, sym, .. }) if sym == "__proto__" => {
                        ComputedPropName {
                            span,
                            expr: sym.into(),
                        }
                        .into()
                    }
                    PropName::Str(s @ Str { span, .. })
                        if s.value.as_str() == Some("__proto__") =>
                    {
                        ComputedPropName {
                            span,
                            expr: s.into(),
                        }
                        .into()
                    }
                    key => key,
                };
                *prop = Prop::KeyValue(KeyValueProp {
                    key,
                    value: FnExpr {
                        ident: None,
                        function: function.take(),
                    }
                    .into(),
                })
            }
            _ => {}
        }
    }
}
