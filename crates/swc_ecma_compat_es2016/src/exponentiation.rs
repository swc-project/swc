use swc_ecma_ast::*;

/// `@babel/plugin-transform-exponentiation-operator`
///
/// # Example
///
/// ## In
///
/// ```js
/// let x = 10 ** 2;
///
/// x **= 3;
/// ```
///
/// ## Out
///
/// ```js
/// let x = Math.pow(10, 2);
///
/// x = Math.pow(x, 3);
/// ```
pub fn exponentiation() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2016.exponentiation_operator = true;
    options.into_pass()
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::{test, test_exec};

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        babel_binary,
        "2 ** 2"
    );

    test_exec!(
        ignore,
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        babel_comprehensive,
        r#"expect(2 ** 3).toBe(8);
expect(3 * 2 ** 3).toBe(24);
var x = 2;
expect(2 ** ++x).toBe(8);
expect(2 ** -1 * 2).toBe(1);

var calls = 0;
var q = {q: 3};
var o = {
  get p() {
    calls++;
    return q;
  }
};

o.p.q **= 2;
expect(calls).toBe(1);
expect(o.p.q).toBe(9);

expect(2 ** (3 ** 2)).toBe(512);
expect(2 ** 3 ** 2).toBe(512);"#
    );

    test_exec!(
        // FIXME
        ignore,
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        babel_memoize_object,
        r#"var counters = 0;
Object.defineProperty(global, "reader", {
  get: function () {
    counters += 1;
    return { x: 2 };
  },
  configurable: true
});
reader.x **= 2;
expect(counters).toBe(1);"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        assign,
        r#"x **= 3"#,
        ok_if_code_eq
    );

    //     test!(::swc_ecma_parser::Syntax::default(),
    //         |_| exponentiation(),
    //         babel_4403,
    //         "var a, b;
    // a[`${b++}`] **= 1;",
    //         "var _ref;

    // var a, b;
    // _ref = `${b++}`, a[_ref] = Math.pow(a[_ref], 1);"
    //     );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        issue_740,
        "self.a = 10 ** 2",
        ok_if_code_eq
    );

    // https://github.com/swc-project/swc/pull/741/files
    // bu JakeChampion
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        babel_binary_member_assignment_expression,
        "var x = {}; x.a = 2 ** 2"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        assign_to_object_property,
        r#"var self = {}; self.x **= 3"#,
        ok_if_code_eq
    );
}
