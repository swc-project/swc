use ast::*;
use swc_common::{Fold, FoldWith};

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
#[derive(Debug, Clone, Copy, Default)]
pub struct PropertyLiteral;

impl Fold<PropName> for PropertyLiteral {
    fn fold(&mut self, n: PropName) -> PropName {
        let n = n.fold_children(self);

        match n {
            PropName::Str(Str {
                value: sym, span, ..
            }) => {
                if sym.is_reserved_for_es3() || sym.contains('-') {
                    return PropName::Str(Str {
                        span,
                        value: sym,
                        has_escape: false,
                    });
                } else {
                    PropName::Ident(Ident::new(sym, span))
                }
            }
            PropName::Ident(i) => {
                let Ident { sym, span, .. } = i;
                if sym.is_reserved_for_es3() || sym.contains('-') {
                    return PropName::Str(Str {
                        span,
                        value: sym,
                        has_escape: false,
                    });
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
        ::swc_ecma_parser::Syntax::Es,
        PropertyLiteral,
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
  1: function () {},

  "default": 1,
  [a]: 2,
  foo: 1
};"#,
        ok_if_code_eq
    );

}
