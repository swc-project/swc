use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_context_variable_lvalues(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_use_memo(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_hooks_usage(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_no_capitalized_calls(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_locals_not_reassigned_after_render(
    _hir: &HirFunction,
) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_no_ref_access_in_render(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_no_set_state_in_render(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_no_derived_computations_in_effects(
    _hir: &HirFunction,
) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_no_set_state_in_effects(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_no_jsx_in_try_statement(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_exhaustive_dependencies(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_preserved_manual_memoization(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_static_components(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}

pub fn validate_source_locations(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
