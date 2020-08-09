use super::Type;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::prop_name_to_expr;

impl From<Box<Type>> for TsType {
    fn from(ty: Box<Type>) -> Self {
        (*ty).into()
    }
}

impl From<Type> for TsType {
    fn from(t: Type) -> Self {
        match t {
            Type::This(t) => t.into(),
            Type::Lit(t) => t.into(),
            Type::Query(t) => t.into(),
            Type::Infer(t) => t.into(),
            Type::Import(t) => t.into(),
            Type::Predicate(t) => t.into(),
            Type::IndexedAccessType(t) => t.into(),
            Type::Ref(t) => t.into(),
            Type::TypeLit(t) => t.into(),
            Type::Keyword(t) => t.into(),
            Type::Conditional(t) => t.into(),
            Type::Tuple(t) => t.into(),
            Type::Array(t) => t.into(),
            Type::Union(t) => t.into(),
            Type::Intersection(t) => t.into(),
            Type::Function(t) => t.into(),
            Type::Constructor(t) => t.into(),
            Type::Method(t) => t.into(),
            Type::Operator(t) => t.into(),
            Type::Param(t) => t.into(),
            Type::EnumVariant(t) => t.into(),
            Type::Interface(t) => t.into(),
            Type::Enum(t) => t.into(),
            Type::Mapped(t) => t.into(),
            Type::Alias(t) => t.into(),
            Type::Namespace(..) => {
                unreachable!("TsNamespaceDecl should be handled before converting to TsType")
            }
            Type::Module(t) => t.into(),
            Type::Class(t) => t.into(),
            Type::ClassInstance(t) => t.into(),
            Type::Static(t) => (*t.ty).clone().into(),
            Type::Arc(t) => (*t).clone().into(),
        }
    }
}

impl From<super::QueryType> for TsType {
    fn from(t: super::QueryType) -> Self {
        TsType::TsTypeQuery(TsTypeQuery {
            span: t.span,
            expr_name: t.expr.into(),
        })
    }
}

impl From<super::QueryExpr> for TsTypeQueryExpr {
    fn from(t: super::QueryExpr) -> Self {
        match t {
            super::QueryExpr::TsEntityName(t) => TsTypeQueryExpr::TsEntityName(t),
            super::QueryExpr::Import(t) => TsTypeQueryExpr::Import(t.into()),
        }
    }
}

impl From<super::ImportType> for TsImportType {
    fn from(t: super::ImportType) -> Self {
        TsImportType {
            span: t.span,
            arg: t.arg,
            qualifier: t.qualifier,
            type_args: t.type_params.map(From::from),
        }
    }
}

impl From<super::InferType> for TsType {
    fn from(t: super::InferType) -> Self {
        TsType::TsInferType(TsInferType {
            span: t.span,
            type_param: t.type_param.into(),
        })
    }
}

impl From<super::ImportType> for TsType {
    fn from(t: super::ImportType) -> Self {
        TsType::TsImportType(TsImportType {
            span: t.span,
            arg: t.arg,
            qualifier: t.qualifier,
            type_args: t.type_params.map(From::from),
        })
    }
}

impl From<super::Predicate> for TsType {
    fn from(t: super::Predicate) -> Self {
        TsType::TsTypePredicate(TsTypePredicate {
            span: t.span,
            asserts: t.asserts,
            param_name: t.param_name,
            type_ann: t.ty.map(From::from),
        })
    }
}

impl From<super::IndexedAccessType> for TsType {
    fn from(t: super::IndexedAccessType) -> Self {
        TsType::TsIndexedAccessType(TsIndexedAccessType {
            span: t.span,
            readonly: t.readonly,
            obj_type: t.obj_type.into(),
            index_type: t.index_type.into(),
        })
    }
}

impl From<super::Ref> for TsType {
    fn from(t: super::Ref) -> Self {
        TsType::TsTypeRef(TsTypeRef {
            span: t.span,
            type_name: t.type_name,
            type_params: t.type_args.map(From::from),
        })
    }
}

impl From<super::TypeLit> for TsType {
    fn from(t: super::TypeLit) -> Self {
        TsType::TsTypeLit(TsTypeLit {
            span: t.span,
            members: t.members.into_iter().map(From::from).collect(),
        })
    }
}

impl From<super::Conditional> for TsType {
    fn from(t: super::Conditional) -> Self {
        TsType::TsConditionalType(TsConditionalType {
            span: t.span,
            check_type: box (*t.check_type).into(),
            extends_type: box (*t.extends_type).into(),
            true_type: box (*t.true_type).into(),
            false_type: box (*t.false_type).into(),
        })
    }
}

impl From<super::Tuple> for TsType {
    fn from(t: super::Tuple) -> Self {
        TsType::TsTupleType(TsTupleType {
            span: t.span,
            elem_types: t.types.into_iter().map(From::from).collect(),
        })
    }
}

impl From<super::TupleElement> for TsTupleElement {
    fn from(e: super::TupleElement) -> Self {
        TsTupleElement {
            span: e.span,
            label: e.label.map(|v| v.into()),
            ty: e.ty.into(),
        }
    }
}

impl From<super::Array> for TsType {
    fn from(t: super::Array) -> Self {
        TsType::TsArrayType(TsArrayType {
            span: t.span,
            elem_type: box (*t.elem_type).into(),
        })
    }
}

impl From<super::Union> for TsType {
    fn from(t: super::Union) -> Self {
        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(TsUnionType {
            span: t.span,
            types: t.types.into_iter().map(From::from).collect(),
        }))
    }
}

impl From<super::Intersection> for TsType {
    fn from(t: super::Intersection) -> Self {
        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(
            TsIntersectionType {
                span: t.span,
                types: t.types.into_iter().map(From::from).collect(),
            },
        ))
    }
}

impl From<super::Function> for TsType {
    fn from(t: super::Function) -> Self {
        TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
            span: t.span,
            params: t.params.into_iter().map(From::from).collect(),
            type_params: t.type_params.map(From::from),
            type_ann: t.ret_ty.into(),
        }))
    }
}

impl From<super::Constructor> for TsType {
    fn from(t: super::Constructor) -> Self {
        TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsConstructorType(
            TsConstructorType {
                span: t.span,
                params: t.params.into_iter().map(From::from).collect(),
                type_params: t.type_params.map(From::from),
                type_ann: t.type_ann.into(),
            },
        ))
    }
}

impl From<super::Method> for TsType {
    fn from(t: super::Method) -> Self {
        TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
            span: t.span,
            params: t.params.into_iter().map(From::from).collect(),
            type_params: t.type_params.map(From::from),
            type_ann: t.ret_ty.into(),
        }))
    }
}

impl From<super::TypeParamDecl> for TsTypeParamDecl {
    fn from(t: super::TypeParamDecl) -> Self {
        TsTypeParamDecl {
            span: t.span,
            params: t.params.into_iter().map(From::from).collect(),
        }
    }
}

impl From<super::Type> for TsTypeAnn {
    fn from(t: super::Type) -> Self {
        TsTypeAnn {
            span: t.span(),
            type_ann: box t.into(),
        }
    }
}

impl From<Box<super::Type>> for TsTypeAnn {
    fn from(t: Box<super::Type>) -> Self {
        (*t).into()
    }
}

impl From<Box<super::Type>> for Box<TsType> {
    fn from(t: Box<super::Type>) -> Self {
        box (*t).into()
    }
}

impl From<super::TypeParam> for TsTypeParam {
    fn from(t: super::TypeParam) -> Self {
        TsTypeParam {
            span: t.span,
            // TODO
            name: t.name.into(),
            constraint: t.constraint.map(From::from),
            default: t.default.map(From::from),
        }
    }
}

impl From<super::Operator> for TsType {
    fn from(t: super::Operator) -> Self {
        TsTypeOperator {
            span: t.span,
            op: t.op,
            type_ann: t.ty.into(),
        }
        .into()
    }
}

impl From<super::TypeParam> for TsType {
    fn from(t: super::TypeParam) -> Self {
        TsType::TsTypeRef(TsTypeRef {
            span: t.span,
            // TODO
            type_name: t.name.into(),
            type_params: None,
        })
    }
}

impl From<super::EnumVariant> for TsType {
    fn from(t: super::EnumVariant) -> Self {
        TsType::TsTypeRef(TsTypeRef {
            span: t.span,
            type_name: TsEntityName::TsQualifiedName(box TsQualifiedName {
                left: t.enum_name.into(),
                right: Ident::new(t.name, DUMMY_SP),
            }),
            type_params: None,
        })
    }
}

impl From<super::Enum> for TsType {
    fn from(t: super::Enum) -> Self {
        TsType::TsTypeRef(TsTypeRef {
            span: t.span,
            // TODO
            type_name: t.id.into(),
            type_params: None,
        })
    }
}

impl From<super::Interface> for TsType {
    fn from(t: super::Interface) -> Self {
        TsTypeRef {
            span: t.span,
            // TODO
            type_name: TsEntityName::Ident(t.name.into()),
            type_params: None,
        }
        .into()
    }
}

impl From<super::Mapped> for TsType {
    fn from(t: super::Mapped) -> Self {
        TsMappedType {
            span: t.span,

            readonly: t.readonly,
            type_param: t.type_param.into(),
            optional: t.optional.map(From::from),
            type_ann: t.ty.map(From::from),
        }
        .into()
    }
}

impl From<super::Alias> for TsType {
    fn from(t: super::Alias) -> Self {
        (*t.ty).into()
    }
}

impl From<super::Module> for TsType {
    fn from(_: super::Module) -> Self {
        unreachable!("super::Module should be handled before converting to TsType")
    }
}

impl From<super::TypeParamInstantiation> for TsTypeParamInstantiation {
    fn from(t: super::TypeParamInstantiation) -> Self {
        TsTypeParamInstantiation {
            span: t.span,
            params: t.params.into_iter().map(|v| box v.into()).collect(),
        }
    }
}

impl From<super::Operator> for TsTypeOperator {
    fn from(t: super::Operator) -> Self {
        TsTypeOperator {
            span: t.span,
            op: t.op,
            type_ann: t.ty.into(),
        }
    }
}

impl From<super::Class> for TsType {
    fn from(t: super::Class) -> Self {
        // TODO: Handle generics
        TsTypeLit {
            span: t.span,
            members: t.body.into_iter().map(From::from).collect(),
        }
        .into()
    }
}

impl From<super::ClassInstance> for TsType {
    fn from(_: super::ClassInstance) -> Self {
        unimplemented!("From<super::ClassInstance> for TsType")
    }
}

impl From<super::ClassMember> for TsTypeElement {
    fn from(m: super::ClassMember) -> Self {
        match m {
            super::ClassMember::Constructor(c) => {
                TsTypeElement::TsConstructSignatureDecl(TsConstructSignatureDecl {
                    span: c.span,
                    params: c.params.into_iter().map(From::from).collect(),
                    type_ann: c.ret_ty.map(From::from),
                    type_params: c.type_params.map(From::from),
                })
            }
            super::ClassMember::Method(m) => TsTypeElement::TsMethodSignature(TsMethodSignature {
                span: m.span,
                readonly: false,
                computed: match m.key {
                    PropName::Computed(_) => true,
                    _ => false,
                },
                key: box prop_name_to_expr(m.key),
                optional: m.is_optional,
                params: m.params.into_iter().map(From::from).collect(),
                type_ann: Some(TsTypeAnn {
                    span: DUMMY_SP,
                    type_ann: box (*m.ret_ty).into(),
                }),
                type_params: m.type_params.map(From::from),
            }),
            super::ClassMember::Property(p) => {
                TsTypeElement::TsPropertySignature(TsPropertySignature {
                    span: p.span,
                    readonly: p.readonly,
                    key: p.key,
                    computed: p.computed,
                    optional: p.is_optional,
                    init: None,
                    params: vec![],
                    type_ann: p.value.map(|ty| TsTypeAnn {
                        span: DUMMY_SP,
                        type_ann: box ty.into(),
                    }),
                    type_params: None,
                })
            }
            super::ClassMember::IndexSignature(s) => {
                TsTypeElement::TsIndexSignature(TsIndexSignature {
                    span: s.span,
                    params: s.params.into_iter().map(From::from).collect(),
                    type_ann: s.type_ann.map(|ty| TsTypeAnn {
                        span: DUMMY_SP,
                        type_ann: box ty.into(),
                    }),
                    readonly: s.readonly,
                })
            }
        }
    }
}

impl From<super::TypeElement> for TsTypeElement {
    fn from(e: super::TypeElement) -> Self {
        match e {
            super::TypeElement::Call(e) => {
                TsTypeElement::TsCallSignatureDecl(TsCallSignatureDecl {
                    span: e.span,
                    params: e.params.into_iter().map(|v| v.into()).collect(),
                    type_ann: e.ret_ty.map(From::from),
                    type_params: e.type_params.map(From::from),
                })
            }
            super::TypeElement::Constructor(e) => {
                TsTypeElement::TsConstructSignatureDecl(TsConstructSignatureDecl {
                    span: e.span,
                    params: e.params.into_iter().map(|v| v.into()).collect(),
                    type_ann: e.ret_ty.map(From::from),
                    type_params: e.type_params.map(From::from),
                })
            }
            super::TypeElement::Property(e) => {
                TsTypeElement::TsPropertySignature(TsPropertySignature {
                    span: e.span,
                    readonly: e.readonly,
                    key: e.key,
                    computed: e.computed,
                    optional: e.optional,
                    init: None,
                    params: e.params.into_iter().map(From::from).collect(),
                    type_ann: e.type_ann.map(From::from),
                    type_params: e.type_params.map(From::from),
                })
            }
            super::TypeElement::Method(e) => TsTypeElement::TsMethodSignature(TsMethodSignature {
                span: e.span,
                readonly: e.readonly,
                key: e.key,
                computed: e.computed,
                optional: e.optional,
                params: e.params.into_iter().map(From::from).collect(),
                type_ann: e.ret_ty.map(From::from),
                type_params: e.type_params.map(From::from),
            }),
            super::TypeElement::Index(e) => TsTypeElement::TsIndexSignature(TsIndexSignature {
                params: e.params.into_iter().map(From::from).collect(),
                type_ann: e.type_ann.map(From::from),
                readonly: e.readonly,
                span: e.span,
            }),
        }
    }
}

impl From<super::FnParam> for TsFnParam {
    fn from(t: super::FnParam) -> Self {
        let ty = t.ty;
        let type_ann = Some(TsTypeAnn {
            span: DUMMY_SP,
            type_ann: ty.into(),
        });

        match t.pat {
            Pat::Ident(i) => TsFnParam::Ident(Ident {
                span: t.span,
                sym: i.sym,
                type_ann,
                optional: !t.required,
            }),
            Pat::Array(a) => TsFnParam::Array(ArrayPat {
                span: t.span,
                type_ann,
                elems: a.elems,
                optional: !t.required,
            }),
            Pat::Rest(r) => TsFnParam::Rest(RestPat {
                span: t.span,
                dot3_token: r.dot3_token,
                arg: r.arg,
                type_ann,
            }),
            Pat::Object(o) => TsFnParam::Object(ObjectPat {
                span: t.span,
                type_ann,
                props: o.props,
                optional: o.optional,
            }),
            _ => unimplemented!("From<super::FnParam> for TsFnParam"),
        }
    }
}

impl From<super::Type> for Box<TsType> {
    fn from(t: Type) -> Self {
        box t.into()
    }
}
