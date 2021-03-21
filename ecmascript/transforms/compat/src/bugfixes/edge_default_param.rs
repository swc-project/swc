use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

/// Converts destructured parameters with default values to non-shorthand
/// syntax. This fixes the only arguments-related bug in ES Modules-supporting
/// browsers (Edge 16 & 17). Use this plugin instead of
/// @babel/plugin-transform-parameters when targeting ES Modules.
pub fn edge_default_param() -> impl Fold {
    EdgeDefaultParam::default()
}
#[derive(Default, Clone, Copy)]
struct EdgeDefaultParam {
    in_arrow: bool,
}

impl Fold for EdgeDefaultParam {
    noop_fold_type!();

    fn fold_arrow_expr(&mut self, n: ArrowExpr) -> ArrowExpr {
        self.in_arrow = true;
        let params = n.params.fold_with(self);
        self.in_arrow = false;

        let body = n.body.fold_with(self);
        ArrowExpr { params, body, ..n }
    }

    fn fold_object_pat(&mut self, n: ObjectPat) -> ObjectPat {
        let n = n.fold_children_with(self);
        if !self.in_arrow {
            return n;
        }

        let props = n
            .props
            .into_iter()
            .map(|prop| match prop {
                ObjectPatProp::Assign(assign_pat) => {
                    if let Some(value) = assign_pat.value {
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(assign_pat.key.clone()),
                            value: Box::new(Pat::Assign(AssignPat {
                                span: assign_pat.span,
                                left: Box::new(Pat::Ident(BindingIdent::from(
                                    assign_pat.key.clone(),
                                ))),
                                right: value.clone(),
                                type_ann: None,
                            })),
                        })
                    } else {
                        ObjectPatProp::Assign(assign_pat)
                    }
                }
                _ => prop,
            })
            .collect();
        ObjectPat { props, ..n }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| edge_default_param(),
        destructured_default_value,
        "const f = ({ a = 1 }) => a;",
        "const f = ({ a: a = 1 }) => a;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| edge_default_param(),
        destructured_no_default_value,
        "const f = ({ a }) => a;",
        "const f = ({ a }) => a;"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| edge_default_param(),
        nested_default_value,
        "const f = ({ a: { b = 1 } }) => [a, b];",
        "const f = ({ a: { b: b = 1 } }) => [a, b];"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| edge_default_param(),
        non_arguments,
        "const f = () => { const { a = 1 } = {}; };",
        "const f = () => { const { a = 1 } = {}; };"
    );
}
