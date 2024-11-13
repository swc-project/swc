use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::{
    BindingIdent, Expr, Ident, Lit, Pat, Prop, PropName, PropOrSpread, TsFnOrConstructorType,
    TsFnParam, TsFnType, TsKeywordType, TsKeywordTypeKind, TsPropertySignature, TsTupleElement,
    TsTupleType, TsType, TsTypeElement, TsTypeLit,
};

use super::{
    any_type_ann, maybe_lit_to_ts_type, maybe_lit_to_ts_type_const, ts_readonly, ts_tuple_element,
    type_ann, FastDts,
};

impl FastDts {
    pub(crate) fn infer_type_from_expr(
        &mut self,
        e: &Expr,
        as_const: bool,
        as_readonly: bool,
    ) -> Option<Box<TsType>> {
        match e {
            Expr::Array(arr) => {
                let mut elem_types: Vec<TsTupleElement> = Vec::new();

                for elems in &arr.elems {
                    if let Some(expr_or_spread) = elems {
                        let span = expr_or_spread.span();
                        if let Some(ts_expr) =
                            self.infer_type_from_expr(&expr_or_spread.expr, as_const, as_readonly)
                        {
                            elem_types.push(ts_tuple_element(ts_expr));
                        } else {
                            self.array_inferred(span);
                        }
                    } else {
                        // TypeScript converts holey arrays to any
                        // Example: const a = [,,] -> const a = [any, any, any]
                        elem_types.push(ts_tuple_element(Box::new(TsType::TsKeywordType(
                            TsKeywordType {
                                kind: TsKeywordTypeKind::TsAnyKeyword,
                                span: DUMMY_SP,
                            },
                        ))))
                    }
                }

                let mut result = Box::new(TsType::TsTupleType(TsTupleType {
                    span: arr.span,
                    elem_types,
                }));

                if as_readonly {
                    result = ts_readonly(result);
                }
                Some(result)
            }

            Expr::Object(obj) => {
                let mut members: Vec<TsTypeElement> = Vec::new();

                // TODO: Prescan all object properties to know which ones
                // have a getter or a setter. This allows us to apply
                // TypeScript's `readonly` keyword accordingly.

                for item in &obj.props {
                    match item {
                        PropOrSpread::Prop(prop) => {
                            match prop.as_ref() {
                                Prop::KeyValue(key_value) => {
                                    let (key, computed) = match &key_value.key {
                                        PropName::Ident(ident) => {
                                            (Expr::Ident(ident.clone().into()), false)
                                        }
                                        PropName::Str(str_prop) => {
                                            (Lit::Str(str_prop.clone()).into(), false)
                                        }
                                        PropName::Num(num) => (Lit::Num(num.clone()).into(), true),
                                        PropName::Computed(computed) => {
                                            (*computed.expr.clone(), true)
                                        }
                                        PropName::BigInt(big_int) => {
                                            (Lit::BigInt(big_int.clone()).into(), true)
                                        }
                                    };

                                    let init_type = self
                                        .infer_type_from_expr(
                                            &key_value.value,
                                            as_const,
                                            as_readonly,
                                        )
                                        .map(type_ann);

                                    members.push(TsTypeElement::TsPropertySignature(
                                        TsPropertySignature {
                                            span: DUMMY_SP,
                                            readonly: as_readonly,
                                            key: Box::new(key),
                                            computed,
                                            optional: false,
                                            type_ann: init_type,
                                        },
                                    ));
                                }
                                Prop::Shorthand(_)
                                | Prop::Assign(_)
                                | Prop::Getter(_)
                                | Prop::Setter(_)
                                | Prop::Method(_) => {
                                    // self.mark_diagnostic_unsupported_prop(prop.span());
                                }
                            }
                        }
                        PropOrSpread::Spread(_) => {
                            // self.mark_diagnostic(DtsIssue::UnableToInferTypeFromSpread {
                            //     range:
                            // self.source_range_to_range(item.span()),
                            // })
                        }
                    }
                }

                Some(Box::new(TsType::TsTypeLit(TsTypeLit {
                    span: obj.span,
                    members,
                })))
            }
            Expr::Lit(lit) => {
                if as_const {
                    maybe_lit_to_ts_type_const(lit)
                } else {
                    maybe_lit_to_ts_type(lit)
                }
            }
            Expr::TsConstAssertion(ts_const) => {
                self.infer_type_from_expr(&ts_const.expr, true, true)
            }
            Expr::TsSatisfies(satisifies) => {
                self.infer_type_from_expr(&satisifies.expr, as_const, as_readonly)
            }
            Expr::TsAs(ts_as) => Some(ts_as.type_ann.clone()),
            Expr::Fn(fn_expr) => {
                let return_type = fn_expr
                    .function
                    .return_type
                    .as_ref()
                    .map_or(any_type_ann(), |val| val.clone());

                let params: Vec<TsFnParam> = fn_expr
                    .function
                    .as_ref()
                    .params
                    .iter()
                    .filter_map(|param| self.pat_to_ts_fn_param(param.pat.clone()))
                    .collect();

                Some(Box::new(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: fn_expr.function.span,
                        params,
                        type_ann: return_type,
                        type_params: fn_expr.function.type_params.clone(),
                    }),
                )))
            }
            Expr::Arrow(arrow_expr) => {
                let return_type = arrow_expr
                    .return_type
                    .as_ref()
                    .map_or(any_type_ann(), |val| val.clone());

                let params = arrow_expr
                    .params
                    .iter()
                    .filter_map(|pat| self.pat_to_ts_fn_param(pat.clone()))
                    .collect();

                Some(Box::new(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: arrow_expr.span,
                        params,
                        type_ann: return_type,
                        type_params: arrow_expr.type_params.clone(),
                    }),
                )))
            }
            // Since fast check requires explicit type annotations these
            // can be dropped as they are not part of an export declaration
            Expr::This(_)
            | Expr::Unary(_)
            | Expr::Update(_)
            | Expr::Bin(_)
            | Expr::Assign(_)
            | Expr::Member(_)
            | Expr::SuperProp(_)
            | Expr::Cond(_)
            | Expr::Call(_)
            | Expr::New(_)
            | Expr::Seq(_)
            | Expr::Ident(_)
            | Expr::Tpl(_)
            | Expr::TaggedTpl(_)
            | Expr::Class(_)
            | Expr::Yield(_)
            | Expr::MetaProp(_)
            | Expr::Await(_)
            | Expr::Paren(_)
            | Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::TsTypeAssertion(_)
            | Expr::TsNonNull(_)
            | Expr::TsInstantiation(_)
            | Expr::PrivateName(_)
            | Expr::OptChain(_)
            | Expr::Invalid(_) => None,
        }
    }

    pub(crate) fn pat_to_ts_fn_param(&mut self, pat: Pat) -> Option<TsFnParam> {
        match pat {
            Pat::Ident(binding_id) => Some(TsFnParam::Ident(binding_id)),
            Pat::Array(arr_pat) => Some(TsFnParam::Array(arr_pat)),
            Pat::Rest(rest_pat) => Some(TsFnParam::Rest(rest_pat)),
            Pat::Object(obj) => Some(TsFnParam::Object(obj)),
            Pat::Assign(assign_pat) => self
                .infer_type_from_expr(&assign_pat.right, false, false)
                .map(|param| {
                    let name = if let Pat::Ident(ident) = *assign_pat.left {
                        ident.sym.clone()
                    } else {
                        self.gen_unique_name("p")
                    };

                    TsFnParam::Ident(BindingIdent {
                        id: Ident {
                            span: assign_pat.span,
                            ctxt: Default::default(),
                            sym: name,
                            optional: false,
                        },
                        type_ann: Some(type_ann(param)),
                    })
                }),
            Pat::Expr(_expr) => {
                // self.mark_diagnostic_unable_to_infer(expr.span());
                None
            }
            // Invalid code is invalid, not sure why SWC doesn't throw
            // a parse error here.
            Pat::Invalid(_) => None,
        }
    }
}
