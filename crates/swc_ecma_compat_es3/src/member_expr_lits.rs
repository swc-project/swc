//! babel: `transform-member-expression-literals`
//!
//! # Input
//! ```js
//! obj["foo"] = "isValid";
//!
//! obj.const = "isKeyword";
//! obj["var"] = "isKeyword";
//! ```
//!
//! # Output
//! ```js
//! obj.foo = "isValid";
//!
//! obj["const"] = "isKeyword";
//! obj["var"] = "isKeyword";
//! ```

use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_utils::is_valid_ident;
use swc_ecma_visit::visit_mut_pass;

/// babel: `transform-member-expression-literals`
pub fn member_expression_literals() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es3.member_expression_literals = true;
    options.into_pass()
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| member_expression_literals(),
        basic,
        r#"obj["foo"] = "isValid";

obj.const = "isKeyword";
obj["var"] = "isKeyword";"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| member_expression_literals(),
        issue_206,
        "const number = foo[bar1][baz1]"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| member_expression_literals(),
        issue_211,
        "_query[idx]=$this.attr('data-ref');"
    );
}
