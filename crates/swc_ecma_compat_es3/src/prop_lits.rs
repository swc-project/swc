//! babel: `transform-property-literals`
//!
//! # Input
//! ```js
//! var foo = {
//!   // changed
//!   "bar": function () {},
//!   "1": function () {},
//!
//!   // not changed
//!   "default": 1,
//!   [a]: 2,
//!   foo: 1
//! };
//! ```
//!
//! # Output
//! ```js
//! var foo = {
//!   bar: function () {},
//!   1: function () {},
//!
//!   "default": 1,
//!   [a]: 2,
//!   foo: 1
//! };
//! ```

use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_utils::{is_valid_ident, swc_atoms::Atom};
use swc_ecma_visit::visit_mut_pass;

/// Creates a property literals transformation hook.
pub(crate) fn hook<C>() -> impl VisitMutHook<C> {
    PropertyLiteralHook
}

/// babel: `transform-property-literals`
pub fn property_literals() -> impl Pass {
    visit_mut_pass(VisitMutWithHook {
        hook: hook(),
        context: (),
    })
}

struct PropertyLiteralHook;

impl<C> VisitMutHook<C> for PropertyLiteralHook {
    fn exit_prop_name(&mut self, n: &mut PropName, _ctx: &mut C) {
        match n {
            PropName::Str(Str {
                raw: _,
                value,
                span,
                ..
            }) if value.as_str().is_some() => {
                let v = value.as_str().unwrap();
                if v.is_reserved() || !is_valid_ident(v) {
                    // Keep as is
                } else {
                    *n = PropName::Ident(IdentName::new(
                        // SAFETY: checked above
                        unsafe { Atom::from_wtf8_unchecked(value.clone()) },
                        *span,
                    ));
                }
            }
            PropName::Ident(i) => {
                let IdentName { sym, span, .. } = i;
                if sym.is_reserved() || sym.contains('-') || sym.contains('.') {
                    *n = PropName::Str(Str {
                        span: *span,
                        raw: None,
                        value: sym.clone().into(),
                    });
                }
            }
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| property_literals(),
        babel_basic,
        r#"var foo = {
  // changed
  "bar": function () {},
  "1": function () {},

  // not changed
  "default": 1,
  [a]: 2,
  foo: 1
};"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| property_literals(),
        str_lit,
        r#"'use strict';
var x = {
    'foo.bar': true
};"#,
        ok_if_code_eq
    );
}
