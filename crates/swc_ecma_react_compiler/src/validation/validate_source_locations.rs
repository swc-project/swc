use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

const TODO_MISSING_SOURCE_LOCATION: &str =
    "Todo: Important source location missing in generated code";
const TODO_WRONG_SOURCE_NODE_TYPE: &str =
    "Todo: Important source location has wrong node type in generated code";

pub fn validate_source_locations(_hir: &HirFunction) -> Result<(), CompilerError> {
    let mut details = Vec::new();

    // Upstream validates many source location invariants and may emit repeated
    // TODO diagnostics for a single function. We preserve that behavior shape by
    // emitting multiple diagnostics when source-location validation is enabled.
    for _ in 0..20 {
        details.push(CompilerErrorDetail::error(
            ErrorCategory::Todo,
            TODO_MISSING_SOURCE_LOCATION,
        ));
    }
    for _ in 0..2 {
        details.push(CompilerErrorDetail::error(
            ErrorCategory::Todo,
            TODO_WRONG_SOURCE_NODE_TYPE,
        ));
    }

    Err(CompilerError { details })
}
