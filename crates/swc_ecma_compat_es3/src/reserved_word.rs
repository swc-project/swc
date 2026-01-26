//! babel: `@babel/plugin-transform-reserved-words`
//!
//! Some words were reserved in ES3 as potential future keywords but were not
//! reserved in ES5 and later. This plugin, to be used when targeting ES3
//! environments, renames variables from that set of words.
//!
//! # Input
//! ```js
//! var abstract = 1;
//! var x = abstract + 1;
//! ```
//!
//! # Output
//! ```js
//! var _abstract = 1;
//! var x = _abstract + 1;
//! ```

use swc_ecma_ast::*;

/// babel: `@babel/plugin-transform-reserved-words`
pub fn reserved_words(preserve_import: bool) -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es3.reserved_words = true;
    options.env.es3.preserve_import = preserve_import;
    options.into_pass()
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test!(
                ::swc_ecma_parser::Syntax::default(),
                |_| reserved_words(false),
                $name,
                $src
            );
        };
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| reserved_words(false),
        babel_issue_6477,
        r#"
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;
  else if (byte >> 5 === 0x06) return 2;
  else if (byte >> 4 === 0x0E) return 3;
  else if (byte >> 3 === 0x1E) return 4;
  return -1;
}
"#
    );

    identical!(export_as_default, "export { Foo as default }");

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| reserved_words(false),
        issue_7164,
        r#"
        import { int } from './a.js'
        console.log(int)
        export { int };
        "#
    );

    test!(
        Default::default(),
        |_| reserved_words(false),
        issue_7237,
        r#"
        export function char() {
            console.log("char====char");
            return "";
        }
        "#
    );

    // Issue #10266: Reserved words inside exported variable initializers should
    // be transformed
    test!(
        Default::default(),
        |_| reserved_words(false),
        issue_10266,
        r#"
        import { boolean } from 'yup';
        export const foo = boolean();
        "#
    );

    // Test that non-reserved exported variables still have their initializers
    // visited
    test!(
        Default::default(),
        |_| reserved_words(false),
        issue_10266_non_reserved_export,
        r#"
        import { boolean } from 'yup';
        export const normalName = someFn(boolean());
        "#
    );
}
