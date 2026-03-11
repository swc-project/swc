use swc_es_ast::{AstStore, ProgramId};

use crate::{analysis, rewrite, PassStats, TransformOptions, TransformResult};

pub(crate) fn run_transform(
    store: &mut AstStore,
    program: ProgramId,
    options: &TransformOptions,
) -> TransformResult {
    let (facts, analysis_nodes) = analysis::analyze_once(store, program);
    let rewrite = rewrite::rewrite_once(store, program, options, &facts);

    TransformResult {
        program: rewrite.program,
        changed: rewrite.changed,
        stats: PassStats {
            analysis_nodes,
            rewrite_nodes: rewrite.nodes,
        },
    }
}
