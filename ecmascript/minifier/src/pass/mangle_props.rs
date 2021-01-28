use swc_ecma_visit::VisitMut;

pub fn property_mangler() -> impl VisitMut {
    Mangler {}
}

#[derive(Debug)]
struct Mangler {}

impl VisitMut for Mangler {}
