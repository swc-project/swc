use swc_ecma_visit::VisitMut;

/// Add `:any` to all variables. This is required to make tsc happy.
pub fn ignore_typescript() -> impl VisitMut {
    AddTypes
}

struct AddTypes;

impl VisitMut for AddTypes {}
