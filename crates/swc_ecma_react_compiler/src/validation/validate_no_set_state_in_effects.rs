use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_no_set_state_in_effects(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
