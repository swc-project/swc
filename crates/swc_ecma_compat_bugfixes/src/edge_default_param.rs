use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// A bugfix pass for Edge.
///
/// Converts destructured parameters with default values to non-shorthand
/// syntax. This fixes the only arguments-related bug in ES Modules-supporting
/// browsers (Edge 16 & 17). Use this plugin instead of
/// @babel/plugin-transform-parameters when targeting ES Modules.
pub fn edge_default_param() -> impl Pass {
    visit_mut_pass(EdgeDefaultParam::default())
}
#[derive(Default, Clone, Copy)]
struct EdgeDefaultParam {
    in_arrow: bool,
}

#[swc_trace]
impl VisitMut for EdgeDefaultParam {
    noop_visit_mut_type!(fail);

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        self.in_arrow = true;
        n.params.visit_mut_children_with(self);
        self.in_arrow = false;

        n.body.visit_mut_children_with(self);
    }

    fn visit_mut_object_pat(&mut self, n: &mut ObjectPat) {
        n.visit_mut_children_with(self);
        if !self.in_arrow {
            return;
        }

        for idx in 0..n.props.len() {
            let prop = &(n.props[idx]);

            if let ObjectPatProp::Assign(AssignPatProp {
                value: Some(value),
                key,
                span,
                ..
            }) = prop
            {
                let prop = ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident(key.clone().into()),
                    value: AssignPat {
                        span: *span,
                        left: key.clone().into(),
                        right: value.clone(),
                    }
                    .into(),
                });

                n.props[idx] = prop;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::Mark;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::test;

    use super::*;

    fn tr() -> impl Pass {
        (
            resolver(Mark::new(), Mark::new(), false),
            edge_default_param(),
        )
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        destructured_default_value,
        "const f = ({ a = 1 }) => a;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        destructured_no_default_value,
        "const f = ({ a }) => a;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        nested_default_value,
        "const f = ({ a: { b = 1 } }) => [a, b];"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        non_arguments,
        "const f = () => { const { a = 1 } = {}; };"
    );
}
