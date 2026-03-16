use swc_ecma_ast::{Function, Ident};

use crate::{error::CompilerError, transform::ReactFunctionType};

/// Lowered function IR placeholder.
#[derive(Debug, Clone)]
pub struct HirFunction {
    pub fn_type: ReactFunctionType,
    pub id: Option<Ident>,
    pub function: Function,
}

/// Lowers an AST function into HIR.
pub fn lower(
    function: &Function,
    id: Option<&Ident>,
    fn_type: ReactFunctionType,
) -> Result<HirFunction, CompilerError> {
    Ok(HirFunction {
        fn_type,
        id: id.cloned(),
        function: function.clone(),
    })
}
