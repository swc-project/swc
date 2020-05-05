use super::Analyzer;
use crate::{
    analyzer::{props::ComputedPropMode, util::ResultExt, Ctx},
    ty,
    ty::{
        Alias, Array, CallSignature, Conditional, ConstructorSignature, ImportType, IndexSignature,
        IndexedAccessType, InferType, Interface, Intersection, Mapped, MethodSignature, Operator,
        Predicate, PropertySignature, QueryExpr, QueryType, Ref, TsExpr, Tuple, Type, TypeElement,
        TypeLit, TypeParam, TypeParamDecl, TypeParamInstantiation, Union,
    },
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_atoms::js_word;
use swc_common::{Spanned, VisitMutWith, VisitWith};
use swc_ecma_ast::*;

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
            name: p.name.sym.clone(),
            constraint: try_opt!(self.validate(&mut p.constraint)).map(Box::new),
            default: try_opt!(self.validate(&mut p.default)).map(Box::new),
        };
        self.register_type(param.name.clone(), param.clone().into())?;

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
            let ty: Type = d.type_ann.validate_with(self)?;
            let type_params = try_opt!(d.type_params.validate_with(self));
            let alias = Alias {
                span: d.span(),
                ty: box ty,
                type_params,
            };
            self.register_type(d.id.sym.clone(), Type::Alias(alias.clone()))?;
            alias
        };

        Ok(alias)
    }
}

#[validator]
impl Validate<TsInterfaceDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<Interface>;

    fn validate(&mut self, d: &mut TsInterfaceDecl) -> Self::Output {
        let ty = Interface {
            span: d.span,
            name: d.id.sym.clone(),
            type_params: try_opt!(self.validate(&mut d.type_params)),
            extends: self.validate(&mut d.extends)?,
            body: self.validate(&mut d.body)?,
        };

        self.register_type(d.id.sym.clone(), ty.clone().into())
            .store(&mut self.info.errors);

        self.resolve_parent_interfaces(&mut d.extends);

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
        if d.computed {
            self.validate_computed_prop_key(d.span(), &mut d.key);
        }

        Ok(MethodSignature {
            span: d.span,
            readonly: d.readonly,
            key: d.key.clone(),
            computed: d.computed,
            optional: d.optional,
            params: self.validate(&mut d.params)?,
            ret_ty: try_opt!(self.validate(&mut d.type_ann)),
            type_params: try_opt!(self.validate(&mut d.type_params)),
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
            type_ann: try_opt!(self.validate(&mut d.type_ann)),
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
            types: t.elem_types.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsConditionalType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Conditional>;

    fn validate(&mut self, t: &mut TsConditionalType) -> Self::Output {
        Ok(Conditional {
            span: t.span,
            check_type: box t.check_type.validate_with(self)?,
            extends_type: box t.extends_type.validate_with(self)?,
            true_type: box t.true_type.validate_with(self)?,
            false_type: box t.false_type.validate_with(self)?,
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
            ty: try_opt!(ty.type_ann.validate_with(self)).map(Box::new),
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
            ty: box ty.type_ann.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsArrayType> for Analyzer<'_, '_> {
    type Output = ValidationResult<Array>;

    fn validate(&mut self, node: &mut TsArrayType) -> Self::Output {
        Ok(Array {
            span: node.span,
            elem_type: box node.elem_type.validate_with(self)?,
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
        Ok(ty::Function {
            span: t.span,
            type_params: try_opt!(t.type_params.validate_with(self)),
            params: t.params.validate_with(self)?,
            ret_ty: box t.type_ann.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsConstructorType> for Analyzer<'_, '_> {
    type Output = ValidationResult<ty::Constructor>;

    fn validate(&mut self, t: &mut TsConstructorType) -> Self::Output {
        Ok(ty::Constructor {
            span: t.span,
            type_params: try_opt!(t.type_params.validate_with(self)),
            params: t.params.validate_with(self)?,
            type_ann: box t.type_ann.validate_with(self)?,
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
    type Output = ValidationResult<Type>;

    fn validate(&mut self, t: &mut TsTypeRef) -> Self::Output {
        self.record(t);

        let type_args = try_opt!(t.type_params.validate_with(self));

        match t.type_name {
            TsEntityName::Ident(ref i) if i.sym == js_word!("Array") && type_args.is_some() => {
                if type_args.as_ref().unwrap().params.len() == 1 {
                    return Ok(Type::Array(Array {
                        span: t.span,
                        elem_type: box type_args.unwrap().params.into_iter().next().unwrap(),
                    }));
                }
            }

            TsEntityName::Ident(ref i) => {
                if let Some(types) = self.find_type(&i.sym) {
                    for ty in types {
                        match ty.normalize() {
                            Type::Param(..) => return Ok(ty.clone()),
                            _ => {}
                        }
                    }
                }
            }

            _ => {}
        }

        Ok(Ref {
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
            ty: try_opt!(t.type_ann.validate_with(self).map(|res| res.map(Box::new))),
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
            obj_type: box t.obj_type.validate_with(self)?,
            index_type: box t.index_type.validate_with(self)?,
        })
    }
}

#[validator]
impl Validate<TsType> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, ty: &mut TsType) -> Self::Output {
        self.record(ty);

        Ok(match ty {
            TsType::TsThisType(this) => Type::This(this.clone()),
            TsType::TsLitType(ty) => Type::Lit(ty.clone()),
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
            TsType::TsParenthesizedType(ty) => self.validate(ty)?,
            TsType::TsTypeRef(ty) => self.validate(ty)?,
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
