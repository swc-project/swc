use swc_common::{collections::AHashMap, SyntaxContext};

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
