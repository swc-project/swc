use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
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
pub fn shorthand() -> impl Pass {
    visit_mut_pass(Shorthand)
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
impl VisitMut for Shorthand {
    noop_visit_mut_type!(fail);

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        match prop {
            Prop::Shorthand(ident) => {
                let value = ident.clone().into();

                *prop = Prop::KeyValue(KeyValueProp {
                    key: if ident.sym == "__proto__" {
                        PropName::Computed(ComputedPropName {
                            span: ident.span,
                            expr: ident.sym.clone().into(),
                        })
                    } else {
                        ident.take().into()
                    },
                    value,
                });
            }
            Prop::Method(MethodProp { key, function }) => {
                let key = match key.take() {
                    PropName::Ident(IdentName { span, sym, .. }) if sym == "__proto__" => {
                        ComputedPropName {
                            span,
                            expr: sym.into(),
                        }
                        .into()
                    }
                    PropName::Str(s @ Str { span, .. }) if s.value == "__proto__" => {
                        ComputedPropName {
                            span,
                            expr: s.into(),
                        }
                        .into()
                    }
                    key => key,
                };
                *prop = Prop::KeyValue(KeyValueProp {
                    key,
                    value: FnExpr {
                        ident: None,
                        function: function.take(),
                    }
                    .into(),
                })
            }
            _ => {}
        }
    }
}
