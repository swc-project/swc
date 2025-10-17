use swc_ecma_ast::{Param, ParamOrTsParamProp, Pat};

pub trait IsSimpleParameterList {
    fn is_simple_parameter_list(&self) -> bool;
}

impl IsSimpleParameterList for Vec<Param> {
    fn is_simple_parameter_list(&self) -> bool {
        self.iter().all(|param| matches!(param.pat, Pat::Ident(_)))
    }
}

impl IsSimpleParameterList for Vec<Pat> {
    fn is_simple_parameter_list(&self) -> bool {
        self.iter().all(|pat| matches!(pat, Pat::Ident(_)))
    }
}

impl IsSimpleParameterList for Vec<ParamOrTsParamProp> {
    fn is_simple_parameter_list(&self) -> bool {
        self.iter().all(|param| {
            matches!(
                param,
                ParamOrTsParamProp::TsParamProp(..)
                    | ParamOrTsParamProp::Param(Param {
                        pat: Pat::Ident(_),
                        ..
                    })
            )
        })
    }
}
