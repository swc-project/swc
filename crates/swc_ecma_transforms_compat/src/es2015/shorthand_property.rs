use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// Compile ES2015 shorthand properties to ES5
///
///# Example
///
///## In
///
/// ```js
/// var o = { a, b, c };
/// ```
///
///## Out
///
/// ```js
/// var o = { a: a, b: b, c: c };
/// ```
///
///## In
///
/// ```js
/// var cat = {
///   getName() {
///     return name;
///   }
/// };
/// ```
///
///## Out
///```js
/// var cat = {
///   getName: function () {
///     return name;
///   }
/// };
/// ```
#[tracing::instrument(level = "info", skip_all)]
pub fn shorthand() -> impl 'static + Fold + VisitMut {
    as_folder(Shorthand)
}

#[derive(Clone, Copy)]
struct Shorthand;

impl Parallel for Shorthand {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
}

#[swc_trace]
#[parallel]
impl VisitMut for Shorthand {
    noop_visit_mut_type!();

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        match prop {
            Prop::Shorthand(Ident { sym, span, .. }) => {
                *prop = Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(quote_ident!(*span, sym.clone())),
                    value: Box::new(quote_ident!(*span, sym.clone()).into()),
                });
            }
            Prop::Method(MethodProp { key, function }) => {
                *prop = Prop::KeyValue(KeyValueProp {
                    key: key.take(),
                    value: Box::new(Expr::Fn(FnExpr {
                        ident: None,
                        function: function.take(),
                    })),
                })
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
        |_| shorthand(),
        babel_method_plain,
        "var obj = {
  method() {
    return 5 + 5;
  }
};",
        "var obj = {
  method: function () {
    return 5 + 5;
  }
};"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| shorthand(),
        babel_comments,
        "var A = 'a';
var o = {
  A // comment
};",
        "var A = 'a';
var o = {
  A: A // comment

};"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| shorthand(),
        babel_mixed,
        "var coords = { x, y, foo: 'bar' };",
        "var coords = {
  x: x,
  y: y,
  foo: 'bar'
};"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| shorthand(),
        babel_multiple,
        "var coords = { x, y };",
        "var coords = {
  x: x,
  y: y
};"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| shorthand(),
        babel_single,
        "var coords = { x };",
        "var coords = {
  x: x
};"
    );
}
