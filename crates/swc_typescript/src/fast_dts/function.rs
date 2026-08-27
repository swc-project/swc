use std::mem;

use swc_atoms::Atom;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::{
    AssignPat, Decl, ExportDecl, Function, ModuleDecl, ModuleItem, ObjectPatProp, Param, Pat,
    Script, Stmt, TsFunction, TsKeywordTypeKind, TsParenthesizedType, TsThisParam, TsType,
    TsTypeAnn, TsUnionOrIntersectionType, TsUnionType,
};

use super::{
    type_ann,
    util::types::{any_type_ann, ts_keyword_type},
    FastDts,
};

impl FastDts {
    pub(crate) fn transform_fn(&mut self, func: &mut Function, ident_span: Option<Span>) {
        self.transform_fn_return_type(func);
        if func.return_type.is_none() {
            self.function_must_have_explicit_return_type(
                ident_span.unwrap_or_else(|| Span::new(func.span_lo(), func.body.span_lo())),
            );
        }
        self.transform_function_params(func);
        func.is_async = false;
        func.is_generator = false;
    }

    pub(crate) fn transform_fn_return_type(&mut self, func: &mut Function) {
        if func.return_type.is_none() && !func.is_async && !func.is_generator {
            func.return_type = self.infer_function_return_type(func);
        }
    }

    pub(crate) fn transform_fn_params(&mut self, params: &mut [Param]) {
        // If there is required param after current param.
        let mut is_required = false;
        for param in params.iter_mut().rev() {
            is_required |= match &param.pat {
                Pat::Ident(binding_ident) => !binding_ident.optional,
                Pat::Array(array_pat) => !array_pat.optional,
                Pat::Object(object_pat) => !object_pat.optional,
                Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) | Pat::Rest(_) => false,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };
            self.transform_fn_param(param, is_required);
        }
    }

    pub(crate) fn transform_function_params(&mut self, function: &mut Function) {
        self.check_this_param(function.this_param.as_deref());
        self.transform_fn_params(&mut function.params);
    }

    pub(crate) fn transform_ts_function_params(&mut self, function: &mut TsFunction) {
        self.check_this_param(function.this_param.as_deref());
        self.transform_fn_params(&mut function.params);
    }

    pub(crate) fn check_this_param(&mut self, this_param: Option<&TsThisParam>) {
        let Some(this_param) = this_param else {
            return;
        };
        if this_param.type_ann.is_none() {
            self.parameter_must_have_explicit_type(this_param.span);
        }
    }

    pub(crate) fn transform_fn_param(&mut self, param: &mut Param, is_required: bool) {
        // 1. Check assign pat type
        if let Pat::Assign(assign_pat) = &mut param.pat {
            if self.check_assign_pat_param(assign_pat) {
                self.parameter_must_have_explicit_type(param.span);
                return;
            }
        }

        // 2. Infer type annotation
        let (should_add_undefined, type_ann) = match &mut param.pat {
            Pat::Ident(ident) => {
                if ident.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(param.span);
                }
                (ident.type_ann.is_none(), ident.type_ann.as_mut())
            }
            Pat::Array(arr_pat) => {
                if arr_pat.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(param.span);
                }
                (arr_pat.type_ann.is_none(), arr_pat.type_ann.as_mut())
            }
            Pat::Object(obj_pat) => {
                if obj_pat.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(param.span);
                }
                (obj_pat.type_ann.is_none(), obj_pat.type_ann.as_mut())
            }
            Pat::Assign(assign_pat) => {
                if !self.transform_assign_pat(assign_pat, is_required) {
                    self.parameter_must_have_explicit_type(param.span);
                }

                (
                    true,
                    match assign_pat.left.as_mut() {
                        Pat::Ident(ident) => ident.type_ann.as_mut(),
                        Pat::Array(array_pat) => array_pat.type_ann.as_mut(),
                        Pat::Object(object_pat) => object_pat.type_ann.as_mut(),
                        Pat::Assign(_) | Pat::Rest(_) | Pat::Invalid(_) | Pat::Expr(_) => return,
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    },
                )
            }
            Pat::Rest(_) | Pat::Expr(_) | Pat::Invalid(_) => (false, None),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        // 3. Add undefined type if needed
        if let Some(type_ann) = type_ann {
            if is_required && should_add_undefined && self.add_undefined_type_for_param(type_ann) {
                self.implicitly_adding_undefined_to_type(param.span);
            }
        }

        // 4. Flat param pat
        let pat = mem::take(&mut param.pat);
        param.pat = match pat {
            Pat::Assign(assign_pat) => *assign_pat.left,
            _ => pat,
        };
        remove_assignments_from_pat(&mut param.pat);
    }

    pub(crate) fn transform_assign_pat(
        &mut self,
        assign_pat: &mut AssignPat,
        is_required: bool,
    ) -> bool {
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
            Pat::Assign(_) | Pat::Rest(_) | Pat::Invalid(_) | Pat::Expr(_) => return true,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        let mut has_expclicit_type = true;
        if left_type_ann.is_none() {
            *left_type_ann = self
                .infer_type_from_expr(&assign_pat.right)
                .map(type_ann)
                .or_else(|| {
                    has_expclicit_type = false;
                    Some(any_type_ann())
                });
        }
        has_expclicit_type
    }

    pub(crate) fn check_assign_pat_param(&mut self, assign_pat: &AssignPat) -> bool {
        assign_pat
            .left
            .as_array()
            .map(|array_pat| array_pat.type_ann.is_none())
            .unwrap_or(false)
            || assign_pat
                .left
                .as_object()
                .map(|object_pat| object_pat.type_ann.is_none())
                .unwrap_or(false)
    }

    pub(crate) fn add_undefined_type_for_param(&mut self, type_ann: &mut TsTypeAnn) -> bool {
        if type_ann.type_ann.is_ts_type_ref() {
            return true;
        }

        if !is_maybe_undefined(&type_ann.type_ann) {
            let mut ty = type_ann.type_ann.clone();
            if ty.is_ts_fn_or_constructor_type() {
                ty = Box::new(
                    TsParenthesizedType {
                        span: DUMMY_SP,
                        type_ann: Box::new(*ty),
                    }
                    .into(),
                );
            }
            *type_ann.type_ann = TsType::TsUnionOrIntersectionType(
                TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span: DUMMY_SP,
                    types: vec![ty, ts_keyword_type(TsKeywordTypeKind::TsUndefinedKeyword)],
                }),
            )
        }

        false
    }

    pub(crate) fn remove_function_overloads_in_module(items: &mut Vec<ModuleItem>) {
        let mut last_function_name: Option<Atom> = None;
        let mut is_export_default_function_overloads = false;

        items.retain(|item| match item {
            ModuleItem::Stmt(Stmt::Decl(Decl::TsFn(fn_decl)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsFn(fn_decl),
                ..
            })) => {
                if let Some(ident) = &fn_decl.ident {
                    last_function_name = Some(ident.sym.clone());
                }
                true
            }
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Fn(fn_decl),
                ..
            })) => !last_function_name
                .as_ref()
                .is_some_and(|last_name| last_name == &fn_decl.ident.sym),
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => match &export.decl {
                swc_ecma_ast::DefaultDecl::TsFn(_) => {
                    is_export_default_function_overloads = true;
                    true
                }
                swc_ecma_ast::DefaultDecl::Fn(_) if is_export_default_function_overloads => {
                    is_export_default_function_overloads = false;
                    false
                }
                swc_ecma_ast::DefaultDecl::Fn(_) => true,
                _ => {
                    is_export_default_function_overloads = false;
                    true
                }
            },
            _ => true,
        });
    }

    pub(crate) fn remove_function_overloads_in_script(script: &mut Script) {
        let mut last_function_name: Option<Atom> = None;
        script.body.retain(|stmt| match stmt.as_decl() {
            Some(Decl::TsFn(fn_decl)) => {
                if let Some(ident) = &fn_decl.ident {
                    last_function_name = Some(ident.sym.clone());
                }
                true
            }
            Some(Decl::Fn(fn_decl)) => !last_function_name
                .as_ref()
                .is_some_and(|last_name| last_name == &fn_decl.ident.sym),
            _ => true,
        });
    }
}

pub(crate) fn ts_function_from_function(function: Function) -> TsFunction {
    TsFunction {
        this_param: function.this_param,
        params: function.params,
        decorators: function.decorators,
        span: function.span,
        ctxt: function.ctxt,
        is_generator: function.is_generator,
        is_async: function.is_async,
        type_params: function.type_params,
        return_type: function.return_type,
    }
}

fn remove_assignments_from_pat(pat: &mut Pat) {
    match pat {
        Pat::Assign(_) => {
            let Pat::Assign(assign_pat) = mem::take(pat) else {
                unreachable!()
            };
            *pat = *assign_pat.left;
            remove_assignments_from_pat(pat);
        }
        Pat::Array(array_pat) => {
            for elem in array_pat.elems.iter_mut().flatten() {
                remove_assignments_from_pat(elem);
            }
        }
        Pat::Object(object_pat) => {
            for prop in &mut object_pat.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => remove_assignments_from_pat(&mut kv.value),
                    ObjectPatProp::Rest(rest) => remove_assignments_from_pat(&mut rest.arg),
                    ObjectPatProp::Assign(assign) => assign.value = None,
                }
            }
        }
        Pat::Rest(rest_pat) => remove_assignments_from_pat(&mut rest_pat.arg),
        _ => {}
    }
}

fn is_maybe_undefined(ts_type: &TsType) -> bool {
    match ts_type {
        TsType::TsKeywordType(keyword_type) => matches!(
            keyword_type.kind,
            TsKeywordTypeKind::TsAnyKeyword
                | TsKeywordTypeKind::TsUndefinedKeyword
                | TsKeywordTypeKind::TsUnknownKeyword
        ),
        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(union_type)) => {
            union_type.types.iter().any(|ty| is_maybe_undefined(ty))
        }
        _ => false,
    }
}
