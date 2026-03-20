use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_no_derived_computations_in_effects(
    _hir: &HirFunction,
) -> Result<(), CompilerError> {
    Ok(())
}
