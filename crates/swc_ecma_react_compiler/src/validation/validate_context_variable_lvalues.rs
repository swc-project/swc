use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_context_variable_lvalues(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
