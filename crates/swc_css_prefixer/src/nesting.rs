use swc_css_visit::{VisitMut, VisitMutWith};

pub fn nesting() -> impl VisitMut {}

struct NestingHandler {}

impl VisitMut for NestingHandler {}
