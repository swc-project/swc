use swc_atoms::Atom;
use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::{
    AssignPat, BindingIdent, Decl, ExportDecl, Function, Module, ModuleDecl, ModuleItem, Param,
    ParamOrTsParamProp, Pat, Script, Stmt, TsParamPropParam,
};

use super::FastDts;

impl FastDts {
    pub(crate) fn transform_fn(&mut self, func: &mut Function) {
        self.transform_fn_return_type(func);
        if func.return_type.is_none() {
            self.function_must_have_explicit_return_type(func.span());
        }
        self.transform_fn_params(&mut func.params);
        func.body = None
    }

    pub(crate) fn transform_fn_return_type(&self, func: &mut Function) {
        if func.return_type.is_none() && !func.is_async && !func.is_generator {
            // TODO: infer from function body
        }
    }

    pub(crate) fn transform_fn_params(&mut self, params: &mut Vec<Param>) {
        for param in params {
            self.transform_fn_param(param);
        }
    }

    pub(crate) fn transform_fn_param(&mut self, param: &mut Param) {
        match &mut param.pat {
            Pat::Ident(ident) => {
                self.handle_func_param_ident(ident);
            }
            Pat::Assign(assign_pat) => {
                if let Some(new_pat) = self.handle_func_param_assign(assign_pat) {
                    param.pat = new_pat;
                }
            }
            Pat::Array(_) | Pat::Rest(_) | Pat::Object(_) | Pat::Invalid(_) | Pat::Expr(_) => {}
        }
    }

    pub(crate) fn handle_func_param_ident(&mut self, ident: &mut BindingIdent) {
        if ident.type_ann.is_none() {
            // self.mark_diagnostic_any_fallback(ident.span());
            // ident.type_ann = Some(any_type_ann());
        }
    }

    pub(crate) fn handle_func_param_assign(&mut self, assign_pat: &mut AssignPat) -> Option<Pat> {
        match &mut *assign_pat.left {
            Pat::Ident(ident) => {
                if ident.type_ann.is_none() {
                    ident.type_ann =
                        self.infer_expr_fallback_any(assign_pat.right.take(), false, false);
                }

                ident.optional = true;
                Some(Pat::Ident(ident.clone()))
            }
            Pat::Array(arr_pat) => {
                if arr_pat.type_ann.is_none() {
                    arr_pat.type_ann =
                        self.infer_expr_fallback_any(assign_pat.right.take(), false, false);
                }

                arr_pat.optional = true;
                Some(Pat::Array(arr_pat.clone()))
            }
            Pat::Object(obj_pat) => {
                if obj_pat.type_ann.is_none() {
                    obj_pat.type_ann =
                        self.infer_expr_fallback_any(assign_pat.right.take(), false, false);
                }

                obj_pat.optional = true;
                Some(Pat::Object(obj_pat.clone()))
            }
            Pat::Rest(_) | Pat::Assign(_) | Pat::Expr(_) | Pat::Invalid(_) => None,
        }
    }

    pub(crate) fn handle_ts_param_props(&mut self, param_props: &mut Vec<ParamOrTsParamProp>) {
        for param in param_props {
            match param {
                ParamOrTsParamProp::TsParamProp(param) => {
                    match &mut param.param {
                        TsParamPropParam::Ident(ident) => {
                            self.handle_func_param_ident(ident);
                        }
                        TsParamPropParam::Assign(assign) => {
                            if let Some(new_pat) = self.handle_func_param_assign(assign) {
                                match new_pat {
                                    Pat::Ident(new_ident) => {
                                        param.param = TsParamPropParam::Ident(new_ident)
                                    }
                                    Pat::Assign(new_assign) => {
                                        param.param = TsParamPropParam::Assign(new_assign)
                                    }
                                    Pat::Rest(_)
                                    | Pat::Object(_)
                                    | Pat::Array(_)
                                    | Pat::Invalid(_)
                                    | Pat::Expr(_) => {
                                        // should never happen for parameter properties
                                        unreachable!();
                                    }
                                }
                            }
                        }
                    }
                }
                ParamOrTsParamProp::Param(param) => self.transform_fn_param(param),
            }
        }
    }

    pub(crate) fn remove_module_function_overloads(module: &mut Module) {
        let mut last_function_name: Option<Atom> = None;
        let mut is_export_default_function_overloads = false;

        module.body.retain(|item| match item {
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Fn(fn_decl),
                ..
            })) => {
                if fn_decl.function.body.is_some() {
                    if last_function_name
                        .as_ref()
                        .is_some_and(|last_name| last_name == &fn_decl.ident.sym)
                    {
                        return false;
                    }
                } else {
                    last_function_name = Some(fn_decl.ident.sym.clone());
                }
                true
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                if let Some(fn_expr) = export.decl.as_fn_expr() {
                    if is_export_default_function_overloads && fn_expr.function.body.is_some() {
                        is_export_default_function_overloads = false;
                        false
                    } else {
                        is_export_default_function_overloads = true;
                        true
                    }
                } else {
                    is_export_default_function_overloads = false;
                    true
                }
            }
            _ => true,
        });
    }

    pub(crate) fn remove_script_function_overloads(script: &mut Script) {
        let mut last_function_name: Option<Atom> = None;
        script.body.retain(|stmt| {
            if let Some(fn_decl) = stmt.as_decl().and_then(|decl| decl.as_fn_decl()) {
                if fn_decl.function.body.is_some() {
                    if last_function_name
                        .as_ref()
                        .is_some_and(|last_name| last_name == &fn_decl.ident.sym)
                    {
                        return false;
                    }
                } else {
                    last_function_name = Some(fn_decl.ident.sym.clone());
                }
            }
            true
        });
    }
}
