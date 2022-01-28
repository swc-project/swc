use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

/// Currently noop.
///
/// See: https://github.com/terser/terser/blob/0c5fde1f6951c70b2dfc91f6960dfedbf0e84fef/lib/minify.js#L177-L182
pub fn name_expander() -> impl VisitMut {
    Expander {}
}

#[derive(Debug)]
struct Expander {}

impl VisitMut for Expander {
    noop_visit_mut_type!();
}
