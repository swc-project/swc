use swc_common::Span;

#[derive(Debug, Clone)]
pub enum Error {
    ShouldIncludeUndefinedType { var: Span },

    MayBeUndefined { span_of_var: Span },
}
