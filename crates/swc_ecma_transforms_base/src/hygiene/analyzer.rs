use swc_ecma_visit::{noop_visit_type, Visit};

pub(super) struct Analyzer {
    pub scope: Scope,

    pub is_pat_decl: bool,
}

pub(super) struct Scope {
    children: Vec<Scope>,
}

impl Visit for Analyzer {
    noop_visit_type!();
}
