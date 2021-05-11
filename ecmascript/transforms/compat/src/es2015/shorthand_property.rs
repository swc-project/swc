use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
pub fn shorthand() -> impl 'static + Fold {
    Shorthand
}

#[derive(Clone, Copy)]
struct Shorthand;

#[fast_path(ShorthandFinder)]
impl Fold for Shorthand {
    noop_fold_type!();

    fn fold_prop(&mut self, prop: Prop) -> Prop {
        let prop = prop.fold_children_with(self);

        match prop {
            Prop::Shorthand(Ident { sym, span, .. }) => Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!(span, sym.clone())),
                value: Box::new(quote_ident!(span, sym).into()),
            }),
            Prop::Method(MethodProp { key, function }) => Prop::KeyValue(KeyValueProp {
                key,
                value: Box::new(Expr::Fn(FnExpr {
                    ident: None,
                    function,
                })),
            }),
            _ => prop,
        }
    }
}

#[derive(Default)]
struct ShorthandFinder {
    found: bool,
}

impl Visit for ShorthandFinder {
    noop_visit_type!();

    fn visit_prop(&mut self, n: &Prop, _: &dyn Node) {
        n.visit_children_with(self);

        self.found |= n.is_shorthand() || n.is_method();
    }
}

impl Check for ShorthandFinder {
    fn should_handle(&self) -> bool {
        self.found
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Shorthand,
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
        |_| Shorthand,
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
        |_| Shorthand,
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
        |_| Shorthand,
        babel_multiple,
        "var coords = { x, y };",
        "var coords = {
  x: x,
  y: y
};"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Shorthand,
        babel_single,
        "var coords = { x };",
        "var coords = {
  x: x
};"
    );
}
