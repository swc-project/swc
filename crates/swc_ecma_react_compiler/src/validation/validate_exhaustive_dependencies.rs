use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_exhaustive_dependencies(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
