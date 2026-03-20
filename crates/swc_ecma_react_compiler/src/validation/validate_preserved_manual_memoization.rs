use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_preserved_manual_memoization(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
