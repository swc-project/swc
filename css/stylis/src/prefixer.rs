use swc_css_visit::VisitMut;

pub fn prefixer() -> impl VisitMut {
    Prefixer
}

struct Prefixer;

impl VisitMut for Prefixer {}
