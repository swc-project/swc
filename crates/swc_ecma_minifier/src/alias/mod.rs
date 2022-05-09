use rustc_hash::FxHashSet;
use swc_common::SyntaxContext;
use swc_ecma_ast::Id;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

pub(crate) struct AliasConfig {
    pub unresolved_ctxt: SyntaxContext,
}

pub(crate) fn collect_aliases<N>(node: &N, config: AliasConfig) -> FxHashSet<Id>
where
    N: VisitWith<AliasCollector>,
{
    let mut visitor = AliasCollector {
        config,
        aliases: FxHashSet::default(),
    };

    node.visit_with(&mut visitor);

    visitor.aliases
}

pub(crate) struct AliasCollector {
    config: AliasConfig,

    aliases: FxHashSet<Id>,
}

impl AliasCollector {}

impl Visit for AliasCollector {
    noop_visit_type!();
}
