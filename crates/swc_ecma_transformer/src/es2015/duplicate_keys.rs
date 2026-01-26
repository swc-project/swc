//! ES2015: Duplicate Keys
//!
//! This plugin transforms duplicate keys in object literals to computed
//! properties.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! var x = { a: 5, a: 6 };
//! var y = {
//!   get a() {},
//!   set a(x) {},
//!   a: 3
//! };
//! ```
//!
//! Output:
//! ```js
//! var x = { a: 5, ["a"]: 6 };
//! var y = {
//!   get a() {},
//!   set a(x) {},
//!   ["a"]: 3
//! };
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-duplicate-keys](https://babel.dev/docs/babel-plugin-transform-duplicate-keys).

use rustc_hash::FxHashSet;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::quote_str;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    DuplicateKeysPass
}

struct DuplicateKeysPass;

impl VisitMutHook<TraverseCtx> for DuplicateKeysPass {
    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        if let Expr::Object(ObjectLit { props, .. }) = expr {
            let mut folder = PropFolder::default();
            folder.visit_props(props);
        }
    }
}

#[derive(Default)]
struct PropFolder {
    getter_props: FxHashSet<Atom>,
    setter_props: FxHashSet<Atom>,
}

#[inline]
fn atom_from_wtf8(value: &Wtf8Atom) -> Atom {
    value
        .as_str()
        .map(Atom::from)
        .unwrap_or_else(|| Atom::from(value.to_string_lossy()))
}

impl PropFolder {
    fn visit_props(&mut self, props: &mut [PropOrSpread]) {
        for prop_or_spread in props.iter_mut() {
            if let PropOrSpread::Prop(prop) = prop_or_spread {
                self.visit_prop(prop);
            }
        }
    }

    fn visit_prop(&mut self, prop: &mut Prop) {
        match prop {
            Prop::Shorthand(ident) => {
                if !self.getter_props.insert(ident.sym.clone())
                    || !self.setter_props.insert(ident.sym.clone())
                {
                    *prop = Prop::KeyValue(KeyValueProp {
                        key: PropName::Computed(ComputedPropName {
                            span: ident.span,
                            expr: quote_str!(ident.sym.clone()).into(),
                        }),
                        value: ident.clone().into(),
                    })
                }
            }

            Prop::Assign(..) => {}

            Prop::Getter(GetterProp { key, .. }) => {
                self.visit_prop_name(key, PropKind::Getter);
            }
            Prop::Setter(SetterProp { key, .. }) => {
                self.visit_prop_name(key, PropKind::Setter);
            }
            _ => {
                self.visit_prop_name_for_key_value_or_method(prop);
            }
        }
    }

    fn visit_prop_name_for_key_value_or_method(&mut self, prop: &mut Prop) {
        match prop {
            Prop::KeyValue(KeyValueProp { key, .. }) | Prop::Method(MethodProp { key, .. }) => {
                // Check in both getter and setter props
                let mut should_transform = false;
                let span = key.span();

                match key {
                    PropName::Ident(ident) => {
                        if !self.getter_props.insert(ident.sym.clone()) {
                            should_transform = true;
                        }
                        if !self.setter_props.insert(ident.sym.clone()) {
                            should_transform = true;
                        }
                        if should_transform {
                            *key = PropName::Computed(ComputedPropName {
                                span,
                                expr: Lit::Str(Str {
                                    span,
                                    raw: None,
                                    value: ident.sym.clone().into(),
                                })
                                .into(),
                            });
                        }
                    }
                    PropName::Str(s) => {
                        let atom = atom_from_wtf8(&s.value);
                        if !self.getter_props.insert(atom.clone()) {
                            should_transform = true;
                        }
                        if !self.setter_props.insert(atom) {
                            should_transform = true;
                        }
                        if should_transform {
                            *key = PropName::Computed(ComputedPropName {
                                span: s.span,
                                expr: s.clone().into(),
                            });
                        }
                    }
                    PropName::Computed(ComputedPropName { expr, .. }) => {
                        // Computed property might collide
                        if let Expr::Lit(Lit::Str(Str { ref value, .. })) = &**expr {
                            let atom = atom_from_wtf8(value);
                            self.getter_props.insert(atom.clone());
                            self.setter_props.insert(atom);
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn visit_prop_name(&mut self, name: &mut PropName, kind: PropKind) {
        let props = match kind {
            PropKind::Getter => &mut self.getter_props,
            PropKind::Setter => &mut self.setter_props,
        };

        let span = name.span();

        match name {
            PropName::Ident(ident) => {
                if !props.insert(ident.sym.clone()) {
                    *name = PropName::Computed(ComputedPropName {
                        span,
                        expr: Lit::Str(Str {
                            span,
                            raw: None,
                            value: ident.sym.clone().into(),
                        })
                        .into(),
                    })
                }
            }
            PropName::Str(s) => {
                if !props.insert(atom_from_wtf8(&s.value)) {
                    *name = PropName::Computed(ComputedPropName {
                        span: s.span,
                        expr: s.clone().into(),
                    })
                }
            }
            PropName::Computed(ComputedPropName { expr, .. }) => {
                // Computed property might collide
                if let Expr::Lit(Lit::Str(Str { ref value, .. })) = &**expr {
                    props.insert(atom_from_wtf8(value));
                }
            }
            _ => {}
        }
    }
}

enum PropKind {
    Getter,
    Setter,
}
