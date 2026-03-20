use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_source_locations(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
