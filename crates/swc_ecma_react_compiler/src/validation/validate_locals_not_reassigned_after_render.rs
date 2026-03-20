use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_locals_not_reassigned_after_render(
    _hir: &HirFunction,
) -> Result<(), CompilerError> {
    Ok(())
}
