use swc_ecma_ast::*;
use swc_ecma_utils::is_valid_ident;
use swc_ecma_visit::{fold_pass, standard_only_fold, Fold, FoldWith};
use swc_trace_macro::swc_trace;

/// babel: `transform-property-literals`
///
/// # Input
/// ```js
/// var foo = {
///   // changed
///   "bar": function () {},
///   "1": function () {},
///
///   // not changed
///   "default": 1,
///   [a]: 2,
///   foo: 1
/// };
/// ```
///
/// # Output
/// ```js
/// var foo = {
///   bar: function () {},
///   1: function () {},
///
///   "default": 1,
///   [a]: 2,
///   foo: 1
/// };
/// ```
pub fn property_literals() -> impl Pass {
    fold_pass(PropertyLiteral)
}

struct PropertyLiteral;

#[swc_trace]
impl Fold for PropertyLiteral {
    standard_only_fold!();

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        let n = n.fold_children_with(self);

        match n {
            PropName::Str(Str {
                raw, value, span, ..
            }) => {
                if value.is_reserved() || !is_valid_ident(&value) {
                    PropName::Str(Str { span, raw, value })
                } else {
                    PropName::Ident(IdentName::new(value, span))
                }
            }
            PropName::Ident(i) => {
                let IdentName { sym, span, .. } = i;
                if sym.is_reserved() || sym.contains('-') || sym.contains('.') {
                    PropName::Str(Str {
                        span,
                        raw: None,
                        value: sym,
                    })
                } else {
                    PropName::Ident(IdentName { span, sym })
                }
            }
            _ => n,
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| fold_pass(PropertyLiteral),
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
        |_| fold_pass(PropertyLiteral),
        str_lit,
        r#"'use strict';
var x = {
    'foo.bar': true
};"#,
        ok_if_code_eq
    );
}
