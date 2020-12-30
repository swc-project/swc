use swc_ecma_visit::VisitMut;

pub fn name_expander() -> impl VisitMut {
    Expander {}
}

#[derive(Debug)]
struct Expander {}

impl VisitMut for Expander {}
