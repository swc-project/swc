use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_no_capitalized_calls(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
