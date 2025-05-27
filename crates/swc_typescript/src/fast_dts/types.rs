use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{BytePos, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{
    ArrayLit, ArrowExpr, Expr, Function, GetterProp, Lit, MemberExpr, ObjectLit, Param, Pat, Prop,
    PropName, PropOrSpread, Str, Tpl, TsFnOrConstructorType, TsFnParam, TsFnType,
    TsKeywordTypeKind, TsLit, TsMethodSignature, TsPropertySignature, TsTupleElement, TsTupleType,
    TsType, TsTypeAnn, TsTypeElement, TsTypeLit, TsTypeOperator, TsTypeOperatorOp, UnaryOp,
};
use swc_ecma_utils::{is_valid_prop_ident, quote_ident};

use super::{
    inferrer::ReturnTypeInferrer,
    type_ann,
    util::{
        ast_ext::{ExprExit, MemberPropExt, PatExt, StaticProp},
        types::{ts_keyword_type, ts_lit_type},
    },
    FastDts,
};
use crate::fast_dts::util::ast_ext::PropNameExit;

impl FastDts {
    pub(crate) fn transform_expr_to_ts_type(&mut self, expr: &Expr) -> Option<Box<TsType>> {
        match expr {
            Expr::Ident(ident) if ident.sym == "undefined" => {
                Some(ts_keyword_type(TsKeywordTypeKind::TsUndefinedKeyword))
            }
            Expr::Lit(lit) => match lit {
                Lit::Str(string) => Some(ts_lit_type(TsLit::Str(string.clone()))),
                Lit::Bool(b) => Some(ts_lit_type(TsLit::Bool(*b))),
                Lit::Null(_) => Some(ts_keyword_type(TsKeywordTypeKind::TsNullKeyword)),
                Lit::Num(number) => Some(ts_lit_type(TsLit::Number(number.clone()))),
                Lit::BigInt(big_int) => Some(ts_lit_type(TsLit::BigInt(big_int.clone()))),
                Lit::Regex(_) | Lit::JSXText(_) => None,
            },
            Expr::Tpl(tpl) => self
                .tpl_to_string(tpl)
                .map(|string| ts_lit_type(TsLit::Str(string))),
            Expr::Unary(unary) if Self::can_infer_unary_expr(unary) => {
                let mut expr = self.transform_expr_to_ts_type(&unary.arg)?;
                if unary.op == UnaryOp::Minus {
                    match &mut expr.as_mut_ts_lit_type()?.lit {
                        TsLit::Number(number) => {
                            number.value = -number.value;
                            number.raw = None;
                        }
                        TsLit::BigInt(big_int) => {
                            *big_int.value = -*big_int.value.clone();
                            big_int.raw = None;
                        }
                        _ => {}
                    }
                };
                Some(expr)
            }
            Expr::Array(array) => self.transform_array_to_ts_type(array),
            Expr::Object(obj) => self.transform_object_to_ts_type(obj, true),
            Expr::Fn(fn_expr) => self.transform_fn_to_ts_type(
                &fn_expr.function,
                fn_expr.ident.as_ref().map(|ident| ident.span),
            ),
            Expr::Arrow(arrow) => self.transform_arrow_expr_to_ts_type(arrow),
            Expr::TsConstAssertion(assertion) => self.transform_expr_to_ts_type(&assertion.expr),
            Expr::TsAs(ts_as) => Some(ts_as.type_ann.clone()),
            _ => None,
        }
    }

    pub(crate) fn transform_fn_to_ts_type(
        &mut self,
        function: &Function,
        ident_span: Option<Span>,
    ) -> Option<Box<TsType>> {
        let return_type = self.infer_function_return_type(function);
        if return_type.is_none() {
            self.function_must_have_explicit_return_type(
                ident_span
                    .unwrap_or_else(|| Span::new(function.span_lo(), function.body.span_lo())),
            );
        }

        return_type.map(|return_type| {
            Box::new(TsType::TsFnOrConstructorType(
                TsFnOrConstructorType::TsFnType(TsFnType {
                    span: DUMMY_SP,
                    params: self.transform_fn_params_to_ts_type(&function.params),
                    type_params: function.type_params.clone(),
                    type_ann: return_type,
                }),
            ))
        })
    }

    pub(crate) fn transform_arrow_expr_to_ts_type(
        &mut self,
        arrow: &ArrowExpr,
    ) -> Option<Box<TsType>> {
        let return_type = self.infer_arrow_return_type(arrow);
        if return_type.is_none() {
            self.function_must_have_explicit_return_type(Span::new(
                arrow.span_lo(),
                arrow.body.span_lo() + BytePos(1),
            ));
        }

        return_type.map(|return_type| {
            Box::new(TsType::TsFnOrConstructorType(
                TsFnOrConstructorType::TsFnType(TsFnType {
                    span: DUMMY_SP,
                    params: self.transform_fn_params_to_ts_type(
                        &arrow
                            .params
                            .iter()
                            .map(|pat| Param {
                                span: pat.span(),
                                decorators: Vec::new(),
                                pat: pat.clone(),
                            })
                            .collect::<Vec<_>>(),
                    ),
                    type_params: arrow.type_params.clone(),
                    type_ann: return_type,
                }),
            ))
        })
    }

    pub(crate) fn transform_fn_params_to_ts_type(&mut self, params: &[Param]) -> Vec<TsFnParam> {
        let mut params = params.to_owned().clone();
        self.transform_fn_params(&mut params);
        params
            .into_iter()
            .filter_map(|param| match param.pat {
                Pat::Ident(binding_ident) => Some(TsFnParam::Ident(binding_ident)),
                Pat::Array(array_pat) => Some(TsFnParam::Array(array_pat)),
                Pat::Rest(rest_pat) => Some(TsFnParam::Rest(rest_pat)),
                Pat::Object(object_pat) => Some(TsFnParam::Object(object_pat)),
                Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => None,
            })
            .collect()
    }

    pub(crate) fn transform_object_to_ts_type(
        &mut self,
        object: &ObjectLit,
        is_const: bool,
    ) -> Option<Box<TsType>> {
        let mut members = Vec::new();
        let (setter_getter_annotations, seen_setter) =
            self.collect_object_getter_or_setter_annotations(object);
        let mut has_seen = FxHashSet::default();

        for prop in &object.props {
            match prop {
                PropOrSpread::Prop(prop) => match prop.as_ref() {
                    Prop::Shorthand(_) => {
                        self.shorthand_property(object.span);
                        continue;
                    }
                    Prop::KeyValue(kv) => {
                        if self.report_property_key(&kv.key) {
                            continue;
                        }

                        let type_ann = if is_const {
                            self.transform_expr_to_ts_type(&kv.value)
                        } else {
                            self.infer_type_from_expr(&kv.value)
                        }
                        .map(type_ann);

                        if type_ann.is_none() {
                            self.inferred_type_of_expression(kv.value.span());
                        }

                        let (key, computed) = self.transform_property_name_to_expr(&kv.key);
                        members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                            span: DUMMY_SP,
                            readonly: is_const,
                            key: Box::new(key),
                            computed,
                            optional: false,
                            type_ann,
                        }));
                    }
                    Prop::Getter(getter) => {
                        if self.report_property_key(&getter.key) {
                            continue;
                        }

                        let mut getter_type_ann = None;

                        let mut has_setter = false;

                        if let Some(static_prop) = getter.key.static_prop(self.unresolved_mark) {
                            if has_seen.contains(&static_prop) {
                                continue;
                            }
                            has_setter = seen_setter.contains(&static_prop);
                            if let Some(type_ann) = setter_getter_annotations.get(&static_prop) {
                                getter_type_ann = Some(type_ann.clone());
                            }

                            has_seen.insert(static_prop);
                        }

                        if getter_type_ann.is_none() {
                            self.accessor_must_have_explicit_return_type(getter.span);
                        }

                        let (key, computed) = self.transform_property_name_to_expr(&getter.key);
                        members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                            span: DUMMY_SP,
                            readonly: !has_setter,
                            key: Box::new(key),
                            computed,
                            optional: false,
                            type_ann: getter_type_ann,
                        }));
                    }
                    Prop::Setter(setter) => {
                        if self.report_property_key(&setter.key) {
                            continue;
                        }

                        let mut setter_type_ann = None;

                        if let Some(static_prop) = setter.key.static_prop(self.unresolved_mark) {
                            if has_seen.contains(&static_prop) {
                                continue;
                            }
                            if let Some(type_ann) = setter_getter_annotations.get(&static_prop) {
                                setter_type_ann = Some(type_ann.clone());
                            }

                            has_seen.insert(static_prop);
                        }

                        if setter_type_ann.is_none() {
                            setter_type_ann = setter.param.get_type_ann().clone();
                        }

                        if setter_type_ann.is_none() {
                            self.accessor_must_have_explicit_return_type(setter.span);
                        }

                        let (key, computed) = self.transform_property_name_to_expr(&setter.key);
                        members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                            span: DUMMY_SP,
                            readonly: false,
                            key: Box::new(key),
                            computed,
                            optional: false,
                            type_ann: setter_type_ann,
                        }));
                    }
                    Prop::Method(method) => {
                        if self.report_property_key(&method.key) {
                            continue;
                        }

                        if is_const {
                            let (key, computed) = self.transform_property_name_to_expr(&method.key);
                            members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                                span: DUMMY_SP,
                                readonly: is_const,
                                key: Box::new(key),
                                computed,
                                optional: false,
                                type_ann: self
                                    .transform_fn_to_ts_type(
                                        &method.function,
                                        Some(method.key.span()),
                                    )
                                    .map(type_ann),
                            }));
                        } else {
                            let return_type = self.infer_function_return_type(&method.function);
                            let (key, computed) = self.transform_property_name_to_expr(&method.key);
                            members.push(TsTypeElement::TsMethodSignature(TsMethodSignature {
                                span: DUMMY_SP,
                                key: Box::new(key),
                                computed,
                                optional: false,
                                params: self
                                    .transform_fn_params_to_ts_type(&method.function.params),
                                type_ann: return_type,
                                type_params: method.function.type_params.clone(),
                            }));
                        }
                    }
                    Prop::Assign(_) => {}
                },
                PropOrSpread::Spread(spread_element) => {
                    self.object_with_spread_assignments(spread_element.span());
                }
            }
        }

        Some(Box::new(TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        })))
    }

    pub(crate) fn transform_array_to_ts_type(&mut self, array: &ArrayLit) -> Option<Box<TsType>> {
        let mut elements = Vec::new();
        for elem in &array.elems {
            let Some(elem) = elem else {
                elements.push(TsTupleElement {
                    span: DUMMY_SP,
                    label: None,
                    ty: ts_keyword_type(TsKeywordTypeKind::TsUndefinedKeyword),
                });
                continue;
            };

            if let Some(spread_span) = elem.spread {
                self.arrays_with_spread_elements(spread_span);
                continue;
            }

            if let Some(type_ann) = self.transform_expr_to_ts_type(&elem.expr) {
                elements.push(TsTupleElement {
                    span: DUMMY_SP,
                    label: None,
                    ty: type_ann,
                });
            } else {
                self.inferred_type_of_expression(elem.span());
            }
        }

        Some(Box::new(TsType::TsTypeOperator(TsTypeOperator {
            span: DUMMY_SP,
            op: TsTypeOperatorOp::ReadOnly,
            type_ann: Box::new(TsType::TsTupleType(TsTupleType {
                span: DUMMY_SP,
                elem_types: elements,
            })),
        })))
    }

    pub(crate) fn transform_property_name_to_expr(&mut self, name: &PropName) -> (Expr, bool) {
        match name {
            PropName::Ident(ident) => (ident.clone().into(), false),
            PropName::Num(num) => (num.clone().into(), false),
            // [TODO]: TypeScript omits the `BigInt` in the generated .d.ts file.
            PropName::BigInt(big_int) => (big_int.clone().into(), false),
            PropName::Str(str_prop) => {
                if is_valid_prop_ident(&str_prop.value) {
                    let mut ident = quote_ident!(str_prop.value.clone());
                    ident.span = str_prop.span;
                    (ident.into(), false)
                } else {
                    (str_prop.clone().into(), false)
                }
            }
            PropName::Computed(computed) => match &*computed.expr {
                Expr::Lit(Lit::Str(str_prop)) if is_valid_prop_ident(&str_prop.value) => {
                    let mut ident = quote_ident!(str_prop.value.clone());
                    ident.span = str_prop.span;
                    (ident.into(), false)
                }
                expr @ Expr::Lit(Lit::Str(..) | Lit::Num(..) | Lit::BigInt(..)) => {
                    (expr.clone(), false)
                }
                Expr::Tpl(Tpl {
                    span,
                    exprs,
                    quasis,
                }) if exprs.is_empty() => {
                    let str_prop = quasis
                        .first()
                        .and_then(|el| el.cooked.as_ref())
                        .unwrap()
                        .clone();
                    if is_valid_prop_ident(&str_prop) {
                        let mut ident = quote_ident!(str_prop);
                        ident.span = *span;
                        (ident.into(), false)
                    } else {
                        (str_prop.into(), false)
                    }
                }
                expr @ Expr::Member(..) | expr @ Expr::OptChain(..) => expr
                    .get_global_symbol_prop(self.unresolved_mark)
                    .and_then(|prop| {
                        let mut prop = prop.clone();
                        let static_name = prop.static_name()?;
                        if prop.is_computed() && is_valid_prop_ident(static_name) {
                            prop = quote_ident!(static_name.clone()).into();
                        }

                        let ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);
                        let symbol = quote_ident!(ctxt, "Symbol");

                        let expr = MemberExpr {
                            obj: symbol.into(),
                            span: name.span(),
                            prop,
                        };

                        Some((expr.into(), true))
                    })
                    .unwrap_or_else(|| (expr.clone(), true)),
                expr => (expr.clone(), true),
            },
        }
    }

    pub(crate) fn check_ts_signature(&mut self, signature: &TsTypeElement) {
        match signature {
            TsTypeElement::TsPropertySignature(ts_property_signature) => {
                self.report_signature_property_key(
                    &ts_property_signature.key,
                    ts_property_signature.computed,
                );
            }
            TsTypeElement::TsGetterSignature(ts_getter_signature) => {
                self.report_signature_property_key(
                    &ts_getter_signature.key,
                    ts_getter_signature.computed,
                );
            }
            TsTypeElement::TsSetterSignature(ts_setter_signature) => {
                self.report_signature_property_key(
                    &ts_setter_signature.key,
                    ts_setter_signature.computed,
                );
            }
            TsTypeElement::TsMethodSignature(ts_method_signature) => {
                self.report_signature_property_key(
                    &ts_method_signature.key,
                    ts_method_signature.computed,
                );
            }
            _ => {}
        }
    }

    pub(crate) fn report_signature_property_key(&mut self, key: &Expr, computed: bool) {
        if !computed {
            return;
        }

        let is_not_allowed = match key {
            Expr::Ident(_) | Expr::Member(_) | Expr::OptChain(_) => key.get_root_ident().is_none(),
            _ => !Self::is_literal(key),
        };

        if is_not_allowed {
            self.signature_computed_property_name(key.span());
        }
    }

    pub(crate) fn tpl_to_string(&mut self, tpl: &Tpl) -> Option<Str> {
        if !tpl.exprs.is_empty() {
            return None;
        }

        tpl.quasis.first().map(|element| Str {
            span: DUMMY_SP,
            value: element.cooked.as_ref().unwrap_or(&element.raw).clone(),
            raw: None,
        })
    }

    pub(crate) fn is_literal(expr: &Expr) -> bool {
        match expr {
            Expr::Lit(_) => true,
            Expr::Tpl(tpl) => tpl.exprs.is_empty(),
            Expr::Unary(unary) => Self::can_infer_unary_expr(unary),
            _ => false,
        }
    }

    pub(crate) fn collect_object_getter_or_setter_annotations(
        &mut self,
        object: &ObjectLit,
    ) -> (FxHashMap<StaticProp, Box<TsTypeAnn>>, FxHashSet<StaticProp>) {
        let mut annotations = FxHashMap::default();
        let mut seen_setter = FxHashSet::default();

        for prop in &object.props {
            let Some(prop) = prop.as_prop() else {
                continue;
            };

            let Some(static_prop) = prop.static_prop(self.unresolved_mark) else {
                continue;
            };

            match &**prop {
                Prop::Getter(GetterProp {
                    type_ann: ty,
                    body: Some(body),
                    ..
                }) => {
                    if let Some(type_ann) = ty
                        .clone()
                        .or_else(|| ReturnTypeInferrer::infer(self, &body.stmts).map(type_ann))
                    {
                        annotations.insert(static_prop, type_ann);
                    }
                }
                Prop::Setter(setter) => {
                    if let Some(type_ann) = setter.param.get_type_ann().clone() {
                        annotations.insert(static_prop.clone(), type_ann);
                    }
                    seen_setter.insert(static_prop);
                }
                _ => {}
            }
        }

        (annotations, seen_setter)
    }
}
