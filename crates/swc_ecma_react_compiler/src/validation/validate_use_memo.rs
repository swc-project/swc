use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_use_memo(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
