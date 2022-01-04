use swc_ecma_visit::VisitMut;
use swc_node_comments::SwcComments;

/// Add `:any` to all variables. This is required to make tsc happy.
pub fn ignore_typescript(comments: SwcComments) -> impl VisitMut {
    AddTypes
}

struct AddTypes;

impl VisitMut for AddTypes {}
