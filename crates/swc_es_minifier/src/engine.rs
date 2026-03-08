use swc_es_ast::{AstStore, ProgramId};

use crate::{analysis, rewrite, MinifyOptions, MinifyResult, PassStats};

pub(crate) fn run_minify(
    store: &mut AstStore,
    program: ProgramId,
    options: &MinifyOptions,
) -> MinifyResult {
    let (facts, analysis_nodes) = analysis::analyze_once(store, program);
    let rewrite = rewrite::rewrite_once(store, program, options, &facts);

    MinifyResult {
        program: rewrite.program,
        changed: rewrite.changed,
        stats: PassStats {
            analysis_nodes,
            rewrite_nodes: rewrite.nodes,
        },
    }
}
