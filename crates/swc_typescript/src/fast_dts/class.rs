use std::{borrow::Cow, collections::HashMap};

use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{
    Accessibility, BindingIdent, Class, ClassMember, ClassProp, Expr, Key, Lit, MethodKind, Param,
    ParamOrTsParamProp, Pat, PrivateName, PrivateProp, PropName, TsKeywordType, TsKeywordTypeKind,
    TsParamProp, TsParamPropParam, TsType, TsTypeAnn, UnaryOp,
};

use super::{type_ann, FastDts};

impl FastDts {
    pub(crate) fn transform_class(&mut self, class: &mut Class) {
        if let Some(super_class) = &class.super_class {
            let is_not_allowed = match super_class.as_ref() {
                Expr::Ident(_) => false,
                Expr::Member(member_expr) => {
                    let mut object = &member_expr.obj;
                    loop {
                        match object.as_ref() {
                            Expr::Member(member_expr) => {
                                object = &member_expr.obj;
                                continue;
                            }
                            Expr::OptChain(opt_chain) => {
                                if let Some(member_expr) = opt_chain.base.as_member() {
                                    object = &member_expr.obj;
                                    continue;
                                }
                            }
                            _ => {}
                        }
                        break object.is_ident();
                    }
                }
                _ => true,
            };

            if is_not_allowed {
                self.extends_clause_expression(super_class.span());
            }
        }

        let setter_getter_annotations = self.collect_getter_or_setter_annotations(class);
        let mut is_function_overloads = false;
        let mut has_private_key = false;
        let body = class.body.take();

        for mut member in body {
            match &mut member {
                ClassMember::Constructor(constructor) => {
                    if !(constructor.is_optional) && constructor.body.is_none() {
                        is_function_overloads = true;
                    } else if is_function_overloads {
                        is_function_overloads = false;
                        continue;
                    }

                    if self.report_property_key(&constructor.key) {
                        continue;
                    }

                    // Transform parameters
                    class.body.splice(
                        0..0,
                        self.transform_constructor_params(&mut constructor.params),
                    );

                    if constructor
                        .accessibility
                        .is_some_and(|accessibility| accessibility == Accessibility::Private)
                    {
                        constructor.params.clear();
                        constructor.body = None;
                        constructor.accessibility =
                            self.transform_accessibility(constructor.accessibility);
                        continue;
                    }

                    constructor.body = None;
                    constructor.accessibility =
                        self.transform_accessibility(constructor.accessibility);
                    class.body.push(member);
                }
                ClassMember::Method(method) => {
                    if !(method.is_abstract || method.is_optional) && method.function.body.is_none()
                    {
                        is_function_overloads = true;
                    } else if is_function_overloads {
                        is_function_overloads = false;
                        continue;
                    }

                    if self.report_property_key(&method.key) {
                        continue;
                    }

                    // Transform parameters
                    match method.kind {
                        MethodKind::Method | MethodKind::Getter => {
                            if method.accessibility.is_some_and(|accessibility| {
                                accessibility == Accessibility::Private
                            }) {
                                if method.kind == MethodKind::Getter {
                                    method.function.params = Vec::new();
                                    method.function.return_type = Some(type_ann(Box::new(
                                        TsType::TsKeywordType(TsKeywordType {
                                            span: DUMMY_SP,
                                            kind: TsKeywordTypeKind::TsVoidKeyword,
                                        }),
                                    )));
                                }
                                method.function.decorators.clear();
                                method.function.body = None;
                                method.function.is_generator = false;
                                method.function.is_async = false;
                                method.accessibility =
                                    self.transform_accessibility(method.accessibility);
                                class.body.push(member);
                                continue;
                            }
                            self.transform_fn_params(&mut method.function.params);
                        }
                        MethodKind::Setter => {
                            if method.accessibility.is_some_and(|accessibility| {
                                accessibility == Accessibility::Private
                            }) {
                                method.function.params = vec![Param {
                                    span: DUMMY_SP,
                                    decorators: Vec::new(),
                                    pat: Pat::Ident(BindingIdent {
                                        id: "value".into(),
                                        type_ann: None,
                                    }),
                                }];
                                method.function.decorators.clear();
                                method.function.body = None;
                                method.function.is_generator = false;
                                method.function.is_async = false;
                                method.function.return_type = None;
                                method.accessibility =
                                    self.transform_accessibility(method.accessibility);
                                class.body.push(member);
                                continue;
                            }

                            if method.function.params.is_empty() {
                                method.function.params.push(Param {
                                    span: DUMMY_SP,
                                    decorators: Vec::new(),
                                    pat: Pat::Ident(BindingIdent {
                                        id: "value".into(),
                                        type_ann: None,
                                    }),
                                });
                            } else {
                                method.function.params.truncate(1);
                                let param = method.function.params.first_mut().unwrap();
                                let static_name = static_name(&method.key);

                                if let Some(type_ann) = static_name
                                    .and_then(|name| setter_getter_annotations.get(name.as_ref()))
                                {
                                    let pat = match &mut param.pat {
                                        Pat::Assign(assign_pat) => assign_pat.left.as_mut(),
                                        _ => &mut param.pat,
                                    };
                                    match pat {
                                        Pat::Ident(binding_ident) => {
                                            binding_ident.type_ann = Some(type_ann.clone());
                                        }
                                        Pat::Array(array_pat) => {
                                            array_pat.type_ann = Some(type_ann.clone());
                                        }
                                        Pat::Object(object_pat) => {
                                            object_pat.type_ann = Some(type_ann.clone());
                                        }
                                        Pat::Assign(_)
                                        | Pat::Rest(_)
                                        | Pat::Invalid(_)
                                        | Pat::Expr(_) => {}
                                    }
                                }
                            }
                        }
                    }

                    // Transform return
                    match method.kind {
                        MethodKind::Method => {
                            self.transform_fn_return_type(&mut method.function);
                            if method.function.return_type.is_none() {
                                self.method_must_have_explicit_return_type(method.key.span());
                            }
                        }
                        MethodKind::Getter => {}
                        MethodKind::Setter => method.function.return_type = None,
                    }

                    method.function.body = None;
                    method.function.is_async = false;
                    method.function.is_generator = false;
                    method.accessibility = self.transform_accessibility(method.accessibility);
                    class.body.push(member);
                }
                ClassMember::ClassProp(prop) => {
                    if self.report_property_key(&prop.key) {
                        continue;
                    }

                    self.transform_class_property(prop);
                    class.body.push(member);
                }
                ClassMember::PrivateMethod(_) | ClassMember::PrivateProp(_) => {
                    has_private_key = true;
                }
                ClassMember::TsIndexSignature(_) => {
                    class.body.push(member);
                }
                ClassMember::AutoAccessor(auto_accessor) => {
                    let Key::Public(prop_name) = &auto_accessor.key else {
                        has_private_key = true;
                        continue;
                    };

                    if self.report_property_key(prop_name) {
                        continue;
                    }

                    auto_accessor.value = None;
                    class.body.push(member);
                }
                ClassMember::Empty(_) | ClassMember::StaticBlock(_) => {}
            }
        }

        if has_private_key {
            class.body.insert(
                0,
                ClassMember::PrivateProp(PrivateProp {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    key: PrivateName {
                        span: DUMMY_SP,
                        name: "private".into(),
                    },
                    value: None,
                    type_ann: None,
                    is_static: false,
                    decorators: Vec::new(),
                    accessibility: None,
                    is_optional: false,
                    is_override: false,
                    readonly: false,
                    definite: false,
                }),
            );
        }
    }

    pub(crate) fn transform_constructor_params(
        &mut self,
        params: &mut [ParamOrTsParamProp],
    ) -> Vec<ClassMember> {
        let mut is_required = false;
        let mut private_properties = Vec::new();
        for param in params {
            match param {
                ParamOrTsParamProp::TsParamProp(ts_param_prop) => {
                    if let Some(private_prop) =
                        self.transform_constructor_ts_param(ts_param_prop, is_required)
                    {
                        private_properties.push(private_prop);
                    }
                    is_required |= match &ts_param_prop.param {
                        TsParamPropParam::Ident(binding_ident) => !binding_ident.optional,
                        TsParamPropParam::Assign(_) => false,
                    }
                }
                ParamOrTsParamProp::Param(param) => {
                    self.transform_fn_param(param, is_required);
                    is_required |= match &param.pat {
                        Pat::Ident(binding_ident) => !binding_ident.optional,
                        Pat::Array(array_pat) => !array_pat.optional,
                        Pat::Object(object_pat) => !object_pat.optional,
                        Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) | Pat::Rest(_) => false,
                    }
                }
            }
        }
        private_properties
    }

    pub(crate) fn transform_constructor_ts_param(
        &mut self,
        ts_param_prop: &mut TsParamProp,
        is_required: bool,
    ) -> Option<ClassMember> {
        // We do almost same thing as self::transform_fn_param
        // 1. Check assign pat type
        if let TsParamPropParam::Assign(assign_pat) = &mut ts_param_prop.param {
            if self.check_assign_pat_param(assign_pat) {
                self.parameter_must_have_explicit_type(ts_param_prop.span);
                return None;
            }
        }

        // 2. Infer type annotation
        let type_ann = match &mut ts_param_prop.param {
            TsParamPropParam::Ident(binding_ident) => {
                if binding_ident.type_ann.is_none() {
                    self.parameter_must_have_explicit_type(ts_param_prop.span);
                }
                &mut binding_ident.type_ann
            }
            TsParamPropParam::Assign(assign_pat) => {
                if !self.transform_assign_pat(assign_pat, is_required) {
                    self.parameter_must_have_explicit_type(ts_param_prop.span);
                }

                match assign_pat.left.as_mut() {
                    Pat::Ident(ident) => &mut ident.type_ann,
                    Pat::Array(array_pat) => &mut array_pat.type_ann,
                    Pat::Object(object_pat) => &mut object_pat.type_ann,
                    Pat::Assign(_) | Pat::Rest(_) | Pat::Invalid(_) | Pat::Expr(_) => return None,
                }
            }
        };

        // 3. Add undefined type if needed
        if let Some(type_ann) = type_ann {
            if is_required && self.add_undefined_type_for_param(type_ann) {
                self.implicitly_adding_undefined_to_type(ts_param_prop.span);
            }
        }

        // 4. Flat param pat
        if let Some(assign_pat) = ts_param_prop.param.as_assign() {
            // A parameter property may not be declared using a binding pattern.
            if let Some(ident) = assign_pat.left.as_ident() {
                ts_param_prop.param = TsParamPropParam::Ident(ident.clone());
            }
        }

        // Create private property
        let ident = (match &ts_param_prop.param {
            TsParamPropParam::Ident(binding_ident) => Some(binding_ident.id.clone()),
            TsParamPropParam::Assign(assign_pat) => assign_pat
                .left
                .as_ident()
                .map(|binding_ident| binding_ident.id.clone()),
        })?;

        let type_ann = if ts_param_prop
            .accessibility
            .is_some_and(|accessibility| accessibility == Accessibility::Private)
        {
            None
        } else {
            match &ts_param_prop.param {
                TsParamPropParam::Ident(binding_ident) => binding_ident.type_ann.clone(),
                TsParamPropParam::Assign(assign_pat) => match assign_pat.left.as_ref() {
                    Pat::Ident(binding_ident) => binding_ident.type_ann.clone(),
                    Pat::Array(array_pat) => array_pat.type_ann.clone(),
                    Pat::Object(object_pat) => object_pat.type_ann.clone(),
                    Pat::Assign(_) | Pat::Rest(_) | Pat::Invalid(_) | Pat::Expr(_) => None,
                },
            }
        };

        Some(ClassMember::ClassProp(ClassProp {
            span: DUMMY_SP,
            key: PropName::Ident(ident.into()),
            value: None,
            type_ann,
            is_static: false,
            decorators: Vec::new(),
            accessibility: self.transform_accessibility(ts_param_prop.accessibility),
            is_abstract: false,
            is_optional: false,
            is_override: ts_param_prop.is_override,
            readonly: ts_param_prop.readonly,
            declare: false,
            definite: false,
        }))
    }

    pub(crate) fn transform_class_property(&mut self, prop: &mut ClassProp) {
        if prop.accessibility.map_or(true, |accessibility| {
            accessibility != Accessibility::Private
        }) {
            if prop.type_ann.is_none() {
                if let Some(value) = prop.value.as_ref() {
                    if prop.readonly {
                        todo!()
                    } else {
                        prop.type_ann =
                            self.infer_type_from_expr(value, false, false).map(type_ann);
                    }
                }
            }

            if prop.type_ann.is_none() && prop.value.is_none() {
                self.property_must_have_explicit_type(prop.key.span());
            }
        }

        prop.declare = false;
        prop.decorators.clear();
        prop.accessibility = self.transform_accessibility(prop.accessibility);
    }

    pub(crate) fn transform_accessibility(
        &mut self,
        accessibility: Option<Accessibility>,
    ) -> Option<Accessibility> {
        if accessibility.is_none()
            || accessibility.is_some_and(|accessibility| accessibility == Accessibility::Public)
        {
            None
        } else {
            accessibility
        }
    }

    pub(crate) fn collect_getter_or_setter_annotations(
        &self,
        class: &Class,
    ) -> HashMap<String, Box<TsTypeAnn>> {
        let mut annotations = HashMap::new();
        for member in &class.body {
            let ClassMember::Method(method) = member else {
                continue;
            };

            if method
                .accessibility
                .is_some_and(|accessibility| accessibility == Accessibility::Private)
                || (method
                    .key
                    .as_computed()
                    .map_or(false, |computed| is_literal(&computed.expr)))
            {
                continue;
            }

            let Some(static_name) = static_name(&method.key).map(|name| name.to_string()) else {
                continue;
            };

            match method.kind {
                MethodKind::Getter => {
                    if let Some(type_ann) = method
                        .function
                        .return_type
                        .clone()
                        .or_else(|| self.infer_function_return_type(&method.function))
                    {
                        annotations.insert(static_name, type_ann);
                    }
                }
                MethodKind::Setter => {
                    let Some(first_param) = method.function.params.first() else {
                        continue;
                    };

                    let pat = match &first_param.pat {
                        Pat::Assign(assign_pat) => &assign_pat.left,
                        _ => &first_param.pat,
                    };

                    if let Some(type_ann) = match pat {
                        Pat::Ident(binding_ident) => binding_ident.type_ann.clone(),
                        Pat::Array(array_pat) => array_pat.type_ann.clone(),
                        Pat::Rest(rest_pat) => rest_pat.type_ann.clone(),
                        Pat::Object(object_pat) => object_pat.type_ann.clone(),
                        Pat::Assign(_) | Pat::Invalid(_) | Pat::Expr(_) => None,
                    } {
                        annotations.insert(static_name, type_ann);
                    }
                }
                _ => continue,
            }
        }

        annotations
    }

    pub(crate) fn report_property_key(&mut self, key: &PropName) -> bool {
        if let Some(computed) = key.as_computed() {
            let is_literal = is_literal(&computed.expr);
            if !is_literal {
                self.computed_property_name(key.span());
            }
            return !is_literal;
        }
        false
    }
}

pub fn static_name(prop_name: &PropName) -> Option<Cow<str>> {
    match prop_name {
        PropName::Ident(ident_name) => Some(Cow::Borrowed(ident_name.sym.as_str())),
        PropName::Str(string) => Some(Cow::Borrowed(string.value.as_str())),
        PropName::Num(number) => Some(Cow::Owned(number.value.to_string())),
        PropName::BigInt(big_int) => Some(Cow::Owned(big_int.value.to_string())),
        PropName::Computed(computed_prop_name) => match computed_prop_name.expr.as_ref() {
            Expr::Lit(lit) => match lit {
                Lit::Str(string) => Some(Cow::Borrowed(string.value.as_str())),
                Lit::Bool(b) => Some(Cow::Owned(b.value.to_string())),
                Lit::Null(_) => Some(Cow::Borrowed("null")),
                Lit::Num(number) => Some(Cow::Owned(number.value.to_string())),
                Lit::BigInt(big_int) => Some(Cow::Owned(big_int.value.to_string())),
                Lit::Regex(regex) => Some(Cow::Owned(regex.exp.to_string())),
                Lit::JSXText(_) => None,
            },
            Expr::Tpl(tpl) if tpl.exprs.is_empty() => tpl
                .quasis
                .first()
                .and_then(|e| e.cooked.as_ref())
                .map(|atom| Cow::Borrowed(atom.as_str())),
            _ => None,
        },
    }
}

pub fn is_literal(expr: &Expr) -> bool {
    match expr {
        Expr::Lit(_) => true,
        Expr::Unary(unary) => {
            let is_arithmetic = matches!(unary.op, UnaryOp::Plus | UnaryOp::Minus);
            let is_number_lit = match unary.arg.as_ref() {
                Expr::Lit(lit) => lit.is_num() || lit.is_big_int(),
                _ => false,
            };
            is_arithmetic && is_number_lit
        }
        _ => false,
    }
}
