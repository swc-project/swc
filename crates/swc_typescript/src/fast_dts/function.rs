use std::mem;

use swc_atoms::Atom;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::{
    Decl, ExportDecl, Function, Module, ModuleDecl, ModuleItem, Param, ParamOrTsParamProp, Pat,
    Script, Stmt, TsKeywordType, TsKeywordTypeKind, TsParamPropParam, TsType,
    TsUnionOrIntersectionType, TsUnionType,
};

use super::{any_type_ann, type_ann, FastDts};

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

    pub(crate) fn transform_fn_params(&mut self, params: &mut [Param]) {
        // If there is required param after current param.
        let mut is_required = false;
        for param in params.iter_mut().rev() {
            self.transform_fn_param(param, is_required);
            is_required |= match &param.pat {
                Pat::Ident(binding_ident) => !binding_ident.optional,
                Pat::Array(array_pat) => !array_pat.optional,
                Pat::Object(object_pat) => !object_pat.optional,
                Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) | Pat::Rest(_) => false,
            }
        }
    }

    pub(crate) fn transform_fn_param(&mut self, param: &mut Param, is_required: bool) {
        if let Pat::Assign(assign_pat) = &mut param.pat {
            if assign_pat
                .left
                .as_array()
                .map(|array_pat| array_pat.type_ann.is_none())
                .unwrap_or(false)
                || assign_pat
                    .left
                    .as_object()
                    .map(|object_pat| object_pat.type_ann.is_none())
                    .unwrap_or(false)
            {
                self.parameter_must_have_explicit_type(param.span);
                return;
            }
        }

        let type_ann = match &mut param.pat {
            Pat::Ident(ident) => {
                if ident.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(param.span);
                }
                &mut ident.type_ann
            }
            Pat::Array(arr_pat) => {
                if arr_pat.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(param.span);
                }
                &mut arr_pat.type_ann
            }
            Pat::Object(obj_pat) => {
                if obj_pat.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(param.span);
                }
                &mut obj_pat.type_ann
            }
            Pat::Assign(assign_pat) => {
                // We can only infer types from the right expr of assign pat
                let left_type_ann = match assign_pat.left.as_mut() {
                    Pat::Ident(ident) => {
                        ident.optional |= !is_required;
                        &mut ident.type_ann
                    }
                    Pat::Array(array_pat) => {
                        array_pat.optional |= !is_required;
                        &mut array_pat.type_ann
                    }
                    Pat::Object(object_pat) => {
                        object_pat.optional |= !is_required;
                        &mut object_pat.type_ann
                    }
                    // These are illegal
                    Pat::Assign(_) | Pat::Rest(_) | Pat::Invalid(_) | Pat::Expr(_) => return,
                };

                if left_type_ann.is_none() {
                    *left_type_ann = self
                        .infer_type_from_expr(&assign_pat.right, false, false)
                        .map(type_ann)
                        .or_else(|| {
                            self.parameter_must_have_explicit_type(param.span);
                            Some(any_type_ann())
                        });
                }
                left_type_ann
            }
            Pat::Rest(_) | Pat::Expr(_) | Pat::Invalid(_) => &mut None,
        };

        if let Some(type_ann) = type_ann {
            if is_required {
                if type_ann.type_ann.is_ts_type_ref() {
                    self.implicitly_adding_undefined_to_type(param.span);
                } else if !is_maybe_undefined(&type_ann.type_ann) {
                    type_ann.type_ann = Box::new(TsType::TsUnionOrIntersectionType(
                        TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                            span: DUMMY_SP,
                            types: vec![
                                type_ann.type_ann.clone(),
                                Box::new(TsType::TsKeywordType(TsKeywordType {
                                    span: DUMMY_SP,
                                    kind: TsKeywordTypeKind::TsUndefinedKeyword,
                                })),
                            ],
                        }),
                    ))
                }
            }
        }

        let pat = mem::take(&mut param.pat);
        param.pat = match pat {
            Pat::Assign(assign_pat) => *assign_pat.left,
            _ => pat,
        };
    }

    pub(crate) fn handle_ts_param_props(&mut self, param_props: &mut Vec<ParamOrTsParamProp>) {
        for param in param_props {
            match param {
                ParamOrTsParamProp::TsParamProp(param) => {
                    match &mut param.param {
                        TsParamPropParam::Ident(ident) => {
                            // self.handle_func_param_ident(ident);
                        }
                        TsParamPropParam::Assign(assign) => {
                            // if let Some(new_pat) =
                            // self.transform_fn_param_pat(assign) {
                            //     match new_pat {
                            //         Pat::Ident(new_ident) => {
                            //             param.param =
                            // TsParamPropParam::Ident(new_ident)
                            //         }
                            //         Pat::Assign(new_assign) => {
                            //             param.param =
                            // TsParamPropParam::Assign(new_assign)
                            //         }
                            //         Pat::Rest(_)
                            //         | Pat::Object(_)
                            //         | Pat::Array(_)
                            //         | Pat::Invalid(_)
                            //         | Pat::Expr(_) => {
                            //             // should never happen for parameter
                            // properties
                            //             unreachable!();
                            //         }
                            //     }
                            // }
                        }
                    }
                }
                ParamOrTsParamProp::Param(_param) => todo!(),
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

pub fn is_maybe_undefined(ts_type: &TsType) -> bool {
    match ts_type {
        TsType::TsKeywordType(keyword_type) => matches!(
            keyword_type.kind,
            TsKeywordTypeKind::TsAnyKeyword
                | TsKeywordTypeKind::TsUndefinedKeyword
                | TsKeywordTypeKind::TsUnknownKeyword
        ),
        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(union_type)) => {
            union_type.types.iter().any(|ty| is_maybe_undefined(&ty))
        }
        _ => false,
    }
}
