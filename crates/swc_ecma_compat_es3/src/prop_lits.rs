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

/// babel: `transform-property-literals`
pub fn property_literals() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es3.property_literals = true;
    options.into_pass()
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
