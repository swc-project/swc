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
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{is_valid_ident, swc_atoms::Atom};

use crate::TraverseCtx;

/// Creates a property literals transformation hook.
pub(crate) fn hook() -> impl VisitMutHook<TraverseCtx> {
    PropertyLiteralHook
}

struct PropertyLiteralHook;

impl VisitMutHook<TraverseCtx> for PropertyLiteralHook {
    fn exit_prop_name(&mut self, n: &mut PropName, _ctx: &mut TraverseCtx) {
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
