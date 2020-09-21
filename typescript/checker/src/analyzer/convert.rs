use super::Analyzer;
use crate::{
    analyzer::{props::ComputedPropMode, util::ResultExt, Ctx, ScopeKind},
    ty,
    ty::{
        Alias, Array, CallSignature, Conditional, ConstructorSignature, ImportType, IndexSignature,
        IndexedAccessType, InferType, Interface, Intersection, Mapped, MethodSignature, Operator,
        Predicate, PropertySignature, QueryExpr, QueryType, Ref, TsExpr, Tuple, Type, TypeElement,
        TypeLit, TypeParam, TypeParamDecl, TypeParamInstantiation, Union,
    },
    util::PatExt,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_atoms::js_word;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::prop_name_to_expr;
use swc_ecma_visit::VisitMutWith;
use swc_ts_types::TupleElement;

/// We analyze dependencies between type parameters, and fold parameter in
/// topological order.
#[validator]
impl Validate<TsTypeParamDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeParamDecl>;

    fn validate(&mut self, decl: &mut TsTypeParamDecl) -> Self::Output {
        self.record(decl);

        if self.is_builtin {
            Ok(TypeParamDecl {
                span: decl.span,
                params: decl.params.validate_with(self)?,
            })
        } else {
            let mut params = (0..decl.params.len())
                .into_iter()
                .map(|_| None)
                .collect::<Vec<_>>();

            let order = self.reorder_type_params(&*decl.params)?;
            assert_eq!(order.len(), decl.params.len());

            for idx in order {
                let param = decl.params[idx].validate_with(self)?;
                params[idx] = Some(param);
            }

            Ok(TypeParamDecl {
                span: decl.span,
                params: params.into_iter().map(|v| v.unwrap()).collect(),
            })
        }
    }
}

#[validator]
impl Validate<TsTypeParam> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeParam>;

    fn validate(&mut self, p: &mut TsTypeParam) -> Self::Output {
        self.record(p);

        let param = TypeParam {
            span: p.span,
            name: p.name.clone().into(),
            constraint: try_opt!(self.validate(&mut p.constraint)),
            default: try_opt!(self.validate(&mut p.default)),
        };
        self.register_type(param.name.clone().into(), box param.clone().into())?;

        Ok(param)
    }
}

#[validator]
impl Validate<TsTypeAnn> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    #[inline]
    fn validate(&mut self, ann: &mut TsTypeAnn) -> Self::Output {
        self.record(ann);

        self.validate(&mut ann.type_ann)
    }
}

#[validator]
impl Validate<TsTypeAliasDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<Alias>;

    fn validate(&mut self, d: &mut TsTypeAliasDecl) -> Self::Output {
        self.record(d);

        let alias = {
            self.with_child(
                ScopeKind::Flow,
                Default::default(),
                |child| -> ValidationResult<_> {
                    let type_params = try_opt!(d.type_params.validate_with(child));

                    let ty = d.type_ann.validate_with(child)?;
                    let alias = Alias {
                        span: d.span(),
                        ty,
                        type_params,
                    };
                    Ok(alias)
                },
            )?
        };
        self.register_type(d.id.clone().into(), box Type::Alias(alias.clone()))?;

        Ok(alias)
    }
}

#[validator]
impl Validate<TsInterfaceDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<Interface>;

    fn validate(&mut self, d: &mut TsInterfaceDecl) -> Self::Output {
        let ty: Interface = self.with_child(
            ScopeKind::Flow,
            Default::default(),
            |child| -> ValidationResult<_> {
                let ty = Interface {
                    span: d.span,
                    name: d.id.clone().into(),
                    type_params: try_opt!(child.validate(&mut d.type_params)),
                    extends: child.validate(&mut d.extends)?,
                    body: child.validate(&mut d.body)?,
                };

                child
                    .register_type(d.id.clone().into(), box ty.clone().into())
                    .store(&mut child.info.errors);

                child.resolve_parent_interfaces(&mut d.extends);

                Ok(ty)
            },
        )?;

        // TODO: Recover
        self.register_type(d.id.clone().into(), box ty.clone().into())?;

        Ok(ty)
    }
}

#[validator]
impl Validate<TsInterfaceBody> for Analyzer<'_, '_> {
    type Output = ValidationResult<Vec<TypeElement>>;

    fn validate(&mut self, node: &mut TsInterfaceBody) -> Self::Output {
        let ctx = Ctx {
            computed_prop_mode: ComputedPropMode::Interface,
            ..self.ctx
        };

        Ok(node.body.validate_with(&mut *self.with_ctx(ctx))?)
    }
}

#[validator]
impl Validate<TsTypeLit> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeLit>;

    fn validate(&mut self, lit: &mut TsTypeLit) -> Self::Output {
        Ok(TypeLit {
            span: lit.span,
            members: self.validate(&mut lit.members)?,
        })
    }
}

#[validator]
impl Validate<TsTypeElement> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeElement>;

    fn validate(&mut self, e: &mut TsTypeElement) -> Self::Output {
        Ok(match e {
            TsTypeElement::TsCallSignatureDecl(d) => TypeElement::Call(self.validate(d)?),
            TsTypeElement::TsConstructSignatureDecl(d) => {
                TypeElement::Constructor(self.validate(d)?)
            }
            TsTypeElement::TsIndexSignature(d) => TypeElement::Index(self.validate(d)?),
            TsTypeElement::TsMethodSignature(d) => TypeElement::Method(self.validate(d)?),
            TsTypeElement::TsPropertySignature(d) => TypeElement::Property(self.validate(d)?),
        })
    }
}

#[validator]
impl Validate<TsConstructSignatureDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<ConstructorSignature>;

    fn validate(&mut self, d: &mut TsConstructSignatureDecl) -> Self::Output {
        Ok(ConstructorSignature {
            span: d.span,
            params: self.validate(&mut d.params)?,
            type_params: try_opt!(self.validate(&mut d.type_params)),
            ret_ty: try_opt!(self.validate(&mut d.type_ann)),
        })
    }
}

#[validator]
impl Validate<TsCallSignatureDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<CallSignature>;

    fn validate(&mut self, d: &mut TsCallSignatureDecl) -> Self::Output {
        Ok(CallSignature {
            span: d.span,
            params: self.validate(&mut d.params)?,
            type_params: try_opt!(self.validate(&mut d.type_params)),
            ret_ty: try_opt!(self.validate(&mut d.type_ann)),
        })
    }
}

#[validator]
impl Validate<TsMethodSignature> for Analyzer<'_, '_> {
    type Output = ValidationResult<MethodSignature>;

    fn validate(&mut self, d: &mut TsMethodSignature) -> Self::Output {
        self.with_child(ScopeKind::Fn, Default::default(), |child| {
            if d.computed {
                child.validate_computed_prop_key(d.span(), &mut d.key);
            }

            Ok(MethodSignature {
                span: d.span,
                readonly: d.readonly,
                key: d.key.clone(),
                computed: d.computed,
                optional: d.optional,
                params: child.validate(&mut d.params)?,
                ret_ty: try_opt!(child.validate(&mut d.type_ann)),
                type_params: try_opt!(child.validate(&mut d.type_params)),
            })
        })
    }
}

#[validator]
impl Validate<TsIndexSignature> for Analyzer<'_, '_> {
    type Output = ValidationResult<IndexSignature>;

    fn validate(&mut self, d: &mut TsIndexSignature) -> Self::Output {
        Ok(IndexSignature {
            span: d.span,
            params: self.validate(&mut d.params)?,
            readonly: d.readonly,
            type_ann: try_opt!(self.validate(&mut d.type_ann)),
        })
    }
}

#[validator]
impl Validate<TsPropertySignature> for Analyzer<'_, '_> {
    type Output = ValidationResult<PropertySignature>;

    fn validate(&mut self, d: &mut TsPropertySignature) -> Self::Output {
        if !self.is_builtin && d.computed {
            ComputedPropName {
                span: d.key.span(),
                expr: d.key.clone(),
            }
            .visit_mut_with(self);
        }

        Ok(PropertySignature {
            span: d.span,
            computed: d.computed,
            key: d.key.clone(),
            optional: d.optional,
            params: self.validate(&mut d.params)?,
            readonly: d.readonly,
            type_ann: {
                // TODO: implicit any
                match d.type_ann.validate_with(self) {
                    Some(v) => match v {
                        Ok(v) => Some(v),
                        Err(e) => {
                            d.type_ann = Some(Type::any(d.span).into());

                            self.info.errors.push(e);
                            Some(Type::any(d.span))
                        }
                    },
                    None => {
                        d.type_ann = Some(Type::any(d.span).into());

                        Some(Type::any(d.span))
                    }
                }
            },
            type_params: try_opt!(self.validate(&mut d.type_params)),
        })
    }
}

#[validator]
impl Validate<TsExprWithTypeArgs> for Analyzer<'_, '_> {
    type Output = ValidationResult<TsExpr>;

    fn validate(&mut self, e: &mut TsExprWithTypeArgs) -> Self::Output {
        Ok(TsExpr {
            span: e.span,
            expr: e.expr.clone(),
            type_args: try_opt!(e.type_args.validate_with(self)),
        })
    }
}

#[validator]
impl Validate<TsTypeParamInstantiation> for Analyzer<'_, '_> {
    type Output = ValidationResult<TypeParamInstantiation>;

    fn validate(&mut self, i: &mut TsTypeParamInstantiation) -> Self::Output {
        Ok(TypeParamInstantiation {
            span: i.span,
            params: i.params.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsTupleType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Tuple>;

    fn validate(&mut self, t: &mut TsTupleType) -> Self::Output {
        Ok(Tuple {
            span: t.span,
            elems: t.elem_types.validate_with(self)?,
        })
    }
}

impl Validate<TsTupleElement> for Analyzer<'_, '_> {
    type Output = ValidationResult<TupleElement>;

    fn validate(&mut self, node: &mut TsTupleElement) -> Self::Output {
        Ok(TupleElement {
            span: node.span,
            label: node.label.clone(),
            ty: node.ty.validate_with(self)?,
        })
    }
}

impl Validate<TsConditionalType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Conditional>;

    fn validate(&mut self, t: &mut TsConditionalType) -> Self::Output {
        Ok(Conditional {
            span: t.span,
            check_type: t.check_type.validate_with(self)?,
            extends_type: t.extends_type.validate_with(self)?,
            true_type: t.true_type.validate_with(self)?,
            false_type: t.false_type.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsMappedType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Mapped>;

    fn validate(&mut self, ty: &mut TsMappedType) -> Self::Output {
        Ok(Mapped {
            span: ty.span,
            readonly: ty.readonly,
            optional: ty.optional,
            type_param: ty.type_param.validate_with(self)?,
            ty: try_opt!(ty.type_ann.validate_with(self)),
        })
    }
}

#[validator]
impl Validate<TsTypeOperator> for Analyzer<'_, '_> {
    type Output = ValidationResult<Operator>;

    fn validate(&mut self, ty: &mut TsTypeOperator) -> Self::Output {
        Ok(Operator {
            span: ty.span,
            op: ty.op,
            ty: ty.type_ann.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsArrayType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Array>;

    fn validate(&mut self, node: &mut TsArrayType) -> Self::Output {
        Ok(Array {
            span: node.span,
            elem_type: node.elem_type.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsUnionType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Union>;

    fn validate(&mut self, u: &mut TsUnionType) -> Self::Output {
        Ok(Union {
            span: u.span,
            types: self.validate(&mut u.types)?,
        })
    }
}

#[validator]
impl Validate<TsIntersectionType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Intersection>;

    fn validate(&mut self, u: &mut TsIntersectionType) -> Self::Output {
        Ok(Intersection {
            span: u.span,
            types: self.validate(&mut u.types)?,
        })
    }
}

#[validator]
impl Validate<TsFnType> for Analyzer<'_, '_> {
    type Output = ValidationResult<ty::Function>;

    fn validate(&mut self, t: &mut TsFnType) -> Self::Output {
        let type_params = try_opt!(t.type_params.validate_with(self));

        for param in &mut t.params {
            default_any_param(param);
        }

        let mut params: Vec<_> = t.params.validate_with(self)?;

        let ret_ty = t.type_ann.validate_with(self)?;

        Ok(ty::Function {
            span: t.span,
            type_params,
            params,
            ret_ty,
        })
    }
}

#[validator]
impl Validate<TsConstructorType> for Analyzer<'_, '_> {
    type Output = ValidationResult<ty::Constructor>;

    fn validate(&mut self, t: &mut TsConstructorType) -> Self::Output {
        let type_params = try_opt!(t.type_params.validate_with(self));

        for param in &mut t.params {
            default_any_param(param);
        }

        Ok(ty::Constructor {
            span: t.span,
            type_params,
            params: t.params.validate_with(self)?,
            type_ann: t.type_ann.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsParenthesizedType> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, t: &mut TsParenthesizedType) -> Self::Output {
        t.type_ann.validate_with(self)
    }
}

#[validator]
impl Validate<TsTypeRef> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, t: &mut TsTypeRef) -> Self::Output {
        self.record(t);

        dbg!(&t.type_name);

        let type_args = try_opt!(t.type_params.validate_with(self));

        match t.type_name {
            TsEntityName::Ident(ref i) if i.sym == js_word!("Array") && type_args.is_some() => {
                dbg!(&*i.sym);

                if type_args.as_ref().unwrap().params.len() == 1 {
                    return Ok(box Type::Array(Array {
                        span: t.span,
                        elem_type: type_args.unwrap().params.into_iter().next().unwrap(),
                    }));
                }
            }

            TsEntityName::Ident(ref i) => {
                if let Some(types) = self.find_type(&i.into()) {
                    for ty in types {
                        match ty.normalize() {
                            Type::Param(..) => return Ok(box ty.clone()),
                            _ => {}
                        }
                    }
                }
            }

            _ => {}
        }

        log::warn!("Crating a ref from TsTypeRef: {:?}", t.type_name);

        Ok(box Ref {
            span: t.span,
            type_name: t.type_name.clone(),
            type_args,
        }
        .into())
    }
}

#[validator]
impl Validate<TsInferType> for Analyzer<'_, '_> {
    type Output = ValidationResult<InferType>;

    fn validate(&mut self, t: &mut TsInferType) -> Self::Output {
        self.record(t);

        Ok(InferType {
            span: t.span,
            type_param: t.type_param.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsImportType> for Analyzer<'_, '_> {
    type Output = ValidationResult<ImportType>;

    fn validate(&mut self, t: &mut TsImportType) -> Self::Output {
        self.record(t);

        Ok(ImportType {
            span: t.span,
            arg: t.arg.clone(),
            qualifier: t.qualifier.clone(),
            type_params: try_opt!(t.type_args.validate_with(self)),
        })
    }
}

#[validator]
impl Validate<TsTypeQueryExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult<QueryExpr>;

    fn validate(&mut self, t: &mut TsTypeQueryExpr) -> Self::Output {
        self.record(t);

        let span = t.span();

        Ok(match t {
            TsTypeQueryExpr::TsEntityName(t) => t.clone().into(),
            TsTypeQueryExpr::Import(i) => i.validate_with(self)?.into(),
        })
    }
}

#[validator]
impl Validate<TsTypeQuery> for Analyzer<'_, '_> {
    type Output = ValidationResult<QueryType>;

    fn validate(&mut self, t: &mut TsTypeQuery) -> Self::Output {
        self.record(t);

        Ok(QueryType {
            span: t.span,
            expr: t.expr_name.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsTypePredicate> for Analyzer<'_, '_> {
    type Output = ValidationResult<Predicate>;

    fn validate(&mut self, t: &mut TsTypePredicate) -> Self::Output {
        self.record(t);

        Ok(Predicate {
            span: t.span,
            param_name: t.param_name.clone(),
            asserts: t.asserts,
            ty: try_opt!(t.type_ann.validate_with(self)),
        })
    }
}

#[validator]
impl Validate<TsIndexedAccessType> for Analyzer<'_, '_> {
    type Output = ValidationResult<IndexedAccessType>;

    fn validate(&mut self, t: &mut TsIndexedAccessType) -> Self::Output {
        self.record(t);

        Ok(IndexedAccessType {
            span: t.span,
            readonly: t.readonly,
            obj_type: t.obj_type.validate_with(self)?,
            index_type: t.index_type.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsType> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, ty: &mut TsType) -> Self::Output {
        self.record(ty);

        Ok(box match ty {
            TsType::TsThisType(this) => Type::This(this.clone()),
            TsType::TsLitType(ty) => {
                let mut ty = Type::Lit(ty.clone());
                self.prevent_generalize(&mut ty);
                ty
            }
            TsType::TsKeywordType(ty) => Type::Keyword(ty.clone()),
            TsType::TsTupleType(ty) => Type::Tuple(self.validate(ty)?),
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(u)) => {
                Type::Union(self.validate(u)?)
            }
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(i)) => {
                Type::Intersection(self.validate(i)?)
            }
            TsType::TsArrayType(arr) => Type::Array(self.validate(arr)?),
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(f)) => {
                Type::Function(self.validate(f)?)
            }
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsConstructorType(c)) => {
                Type::Constructor(self.validate(c)?)
            }
            TsType::TsTypeLit(lit) => Type::TypeLit(self.validate(lit)?),
            TsType::TsConditionalType(cond) => Type::Conditional(self.validate(cond)?),
            TsType::TsMappedType(ty) => Type::Mapped(self.validate(ty)?),
            TsType::TsTypeOperator(ty) => Type::Operator(self.validate(ty)?),
            TsType::TsParenthesizedType(ty) => return self.validate(ty),
            TsType::TsTypeRef(ty) => return self.validate(ty),
            TsType::TsTypeQuery(ty) => Type::Query(ty.validate_with(self)?),
            TsType::TsOptionalType(ty) => unimplemented!("{:?}", ty),
            TsType::TsRestType(ty) => unimplemented!("{:?}", ty),
            TsType::TsInferType(ty) => Type::Infer(ty.validate_with(self)?),
            TsType::TsIndexedAccessType(ty) => Type::IndexedAccessType(ty.validate_with(self)?),
            TsType::TsTypePredicate(ty) => Type::Predicate(ty.validate_with(self)?),
            TsType::TsImportType(ty) => Type::Import(ty.validate_with(self)?),
        })
    }
}

pub(crate) fn default_any_pat(p: &mut Pat) {
    match p {
        Pat::Ident(i) => default_any_ident(i),
        Pat::Array(arr) => default_any_array_pat(arr),
        Pat::Object(obj) => default_any_object(obj),
        _ => {}
    }
}

pub(crate) fn default_any_ident(i: &mut Ident) {
    if i.type_ann.is_some() {
        return;
    }

    i.type_ann = Some(TsTypeAnn {
        span: DUMMY_SP,
        type_ann: box TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        }),
    });
}

pub(crate) fn default_any_array_pat(arr: &mut ArrayPat) {
    if arr.type_ann.is_some() {
        return;
    }
    let cnt = arr.elems.len();

    arr.type_ann = Some(TsTypeAnn {
        span: arr.span,
        type_ann: box TsType::TsTupleType(TsTupleType {
            span: DUMMY_SP,
            elem_types: arr
                .elems
                .iter_mut()
                .map(|elem| {
                    let span = elem.span();
                    // any
                    let ty = match elem {
                        Some(Pat::Array(ref mut arr)) => {
                            default_any_array_pat(arr);
                            arr.type_ann.take().unwrap().type_ann
                        }
                        Some(Pat::Object(ref mut obj)) => {
                            default_any_object(obj);
                            obj.type_ann.take().unwrap().type_ann
                        }

                        _ => box TsType::TsKeywordType(TsKeywordType {
                            span: DUMMY_SP,
                            kind: TsKeywordTypeKind::TsAnyKeyword,
                        }),
                    };

                    TsTupleElement {
                        span,
                        // TODO?
                        label: None,
                        ty: *ty,
                    }
                })
                .collect(),
        }),
    })
}

pub(crate) fn default_any_object(obj: &mut ObjectPat) {
    if obj.type_ann.is_some() {
        return;
    }

    let mut members = Vec::with_capacity(obj.props.len());

    for props in &mut obj.props {
        match props {
            ObjectPatProp::KeyValue(p) => {
                match *p.value {
                    Pat::Array(_) | Pat::Object(_) => {
                        default_any_pat(&mut *p.value);
                    }
                    _ => {}
                }

                members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                    span: DUMMY_SP,
                    readonly: false,
                    key: box prop_name_to_expr(p.key.clone()),
                    computed: false,
                    optional: false,
                    init: None,
                    params: vec![],
                    type_ann: {
                        let type_ann = p.value.get_mut_ty().take().cloned().map(|ty| TsTypeAnn {
                            span: DUMMY_SP,
                            type_ann: box ty,
                        });
                        p.value.set_ty(None);
                        type_ann
                    },
                    type_params: None,
                }))
            }
            ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                members.push(TsTypeElement::TsPropertySignature(TsPropertySignature {
                    span: DUMMY_SP,
                    readonly: false,
                    key: box Expr::Ident(key.clone()),
                    computed: false,
                    optional: false,
                    init: None,
                    params: vec![],
                    type_ann: None,
                    type_params: None,
                }))
            }
            ObjectPatProp::Rest(..) => {}
        }
    }

    obj.type_ann = Some(TsTypeAnn {
        span: DUMMY_SP,
        type_ann: box TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members,
        }),
    })
}

pub(crate) fn default_any_param(p: &mut TsFnParam) {
    match p {
        TsFnParam::Ident(i) => default_any_ident(i),
        TsFnParam::Array(arr) => default_any_array_pat(arr),
        TsFnParam::Rest(rest) => {}
        TsFnParam::Object(obj) => default_any_object(obj),
    }
}
