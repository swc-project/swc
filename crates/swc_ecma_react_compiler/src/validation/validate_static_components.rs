use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_static_components(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
