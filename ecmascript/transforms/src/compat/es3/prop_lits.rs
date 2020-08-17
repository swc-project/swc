use crate::util::is_valid_ident;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

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
#[derive(Default, Clone, Copy)]
pub struct PropertyLiteral;

impl Fold for PropertyLiteral {
    noop_fold_type!();

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        let n = validate!(n.fold_children_with(self));

        match n {
            PropName::Str(Str {
                value: sym, span, ..
            }) => {
                if sym.is_reserved_for_es3() || !is_valid_ident(&sym) {
                    PropName::Str(Str {
                        span,
                        value: sym,
                        has_escape: false,
                    })
                } else {
                    PropName::Ident(Ident::new(sym, span))
                }
            }
            PropName::Ident(i) => {
                let Ident { sym, span, .. } = i;
                if sym.is_reserved_for_es3() || sym.contains('-') || sym.contains('.') {
                    PropName::Str(Str {
                        span,
                        value: sym,
                        has_escape: false,
                    })
                } else {
                    PropName::Ident(Ident { span, sym, ..i })
                }
            }
            _ => n,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| PropertyLiteral,
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
        r#"var foo = {
  bar: function () {},
  '1': function () {},

  "default": 1,
  [a]: 2,
  foo: 1
};"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| PropertyLiteral,
        str_lit,
        r#"'use strict';
var x = {
    'foo.bar': true
};"#,
        r#"'use strict';
var x = {
    'foo.bar': true
};"#,
        ok_if_code_eq
    );
}
