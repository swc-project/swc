use swc_ecma_ast::{
    AssignPat, ObjectPatProp, Param, ParamOrTsParamProp, Pat, TsParamPropParam, VarDecl,
};

pub fn for_each_pat_binding<F>(pat: &Pat, op: &mut F)
where
    F: FnMut(&str),
{
    match pat {
        Pat::Ident(ident) => op(ident.id.sym.as_ref()),
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                for_each_pat_binding(elem, op);
            }
        }
        Pat::Rest(rest) => for_each_pat_binding(&rest.arg, op),
        Pat::Object(obj) => {
            for prop in &obj.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => for_each_pat_binding(&kv.value, op),
                    ObjectPatProp::Assign(assign) => op(assign.key.id.sym.as_ref()),
                    ObjectPatProp::Rest(rest) => for_each_pat_binding(&rest.arg, op),
                    #[cfg(swc_ast_unknown)]
                    _ => {}
                }
            }
        }
        Pat::Assign(AssignPat { left, .. }) => for_each_pat_binding(left, op),
        Pat::Expr(..) | Pat::Invalid(..) => {}
        #[cfg(swc_ast_unknown)]
        _ => {}
    }
}

pub fn for_each_param_binding<F>(params: &[Param], op: &mut F)
where
    F: FnMut(&str),
{
    for param in params {
        for_each_pat_binding(&param.pat, op);
    }
}

pub fn for_each_constructor_param_binding<F>(params: &[ParamOrTsParamProp], op: &mut F)
where
    F: FnMut(&str),
{
    for param in params {
        match param {
            ParamOrTsParamProp::Param(param) => for_each_pat_binding(&param.pat, op),
            ParamOrTsParamProp::TsParamProp(param) => match &param.param {
                TsParamPropParam::Ident(ident) => op(ident.id.sym.as_ref()),
                TsParamPropParam::Assign(assign) => for_each_pat_binding(&assign.left, op),
                #[cfg(swc_ast_unknown)]
                _ => {}
            },
            #[cfg(swc_ast_unknown)]
            _ => {}
        }
    }
}

pub fn for_each_var_decl_binding<F>(var_decl: &VarDecl, op: &mut F)
where
    F: FnMut(&str),
{
    for declarator in &var_decl.decls {
        for_each_pat_binding(&declarator.name, op);
    }
}
