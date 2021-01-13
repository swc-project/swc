use fxhash::FxHashMap;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Visit;

#[derive(Debug, Default)]
pub(crate) struct VarUsageInfo {
    pub single_use: bool,
    pub has_property_access: bool,
}

#[derive(Debug, Default)]
pub(crate) struct ScopeData {
    pub vars: FxHashMap<Id, VarUsageInfo>,
}

#[derive(Debug, Default)]
pub(crate) struct UsageAnalyzer {
    pub data: ScopeData,
}

impl Visit for UsageAnalyzer {
    noop_visit_type!();
}
