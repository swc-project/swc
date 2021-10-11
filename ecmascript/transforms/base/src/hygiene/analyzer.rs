use std::cell::RefCell;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_visit::{noop_visit_type, Visit};

pub struct Data {
    pub scopes: AHashMap<SyntaxContext, ScopeData>,
}

pub struct ScopeData {}

pub struct CurScope<'a> {
    pub parent: Option<&'a CurScope<'a>>,
    pub data: ScopeData,
}

pub struct Analyzer<'a> {
    pub data: &'a mut Data,
    pub cur: CurScope<'a>,
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();
}
