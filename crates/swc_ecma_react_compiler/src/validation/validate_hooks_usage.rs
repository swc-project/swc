use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_hooks_usage(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
