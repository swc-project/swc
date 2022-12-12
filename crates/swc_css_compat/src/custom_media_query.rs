use swc_css_visit::VisitMut;

pub fn custom_media_query() -> impl VisitMut {
    CustomMediaQuery {}
}

struct CustomMediaQuery {}

impl VisitMut for CustomMediaQuery {}
