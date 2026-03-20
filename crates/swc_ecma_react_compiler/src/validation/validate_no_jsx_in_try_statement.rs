use crate::{error::CompilerError, hir::HirFunction};

pub fn validate_no_jsx_in_try_statement(_hir: &HirFunction) -> Result<(), CompilerError> {
    Ok(())
}
