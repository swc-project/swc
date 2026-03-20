use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_no_ref_access_in_render(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
