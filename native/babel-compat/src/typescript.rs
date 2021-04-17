use crate::{Context, Babelify};
use swc_babel_ast::{
    IdOrRest, Access, RestElement, Identifier, IdOrString, TSTypeAnnotation, TSType, TSAnyKeyword,
    TSUnknownKeyword, TSNumberKeyword, TSObjectKeyword, TSBooleanKeyword, TSBigIntKeyword,
    TSStringKeyword, TSSymbolKeyword, TSVoidKeyword, TSUndefinedKeyword, TSNullKeyword,
    TSNeverKeyword, TSIntrinsicKeyword, TSThisType, TSFunctionType, TSConstructorType,
    TSTypeParameterDeclaration, TSTypeParameter, TSIndexSignature, TSExpressionWithTypeArguments,
    TSTypeParameterInstantiation, TSEntityName, TSQualifiedName, TSParameterProperty,
    TSParamPropParam, TSModuleDeclaration, TSModuleDeclBody, TSModuleBlock, TSEnumDeclaration,
    TSEnumMember, TSTypeAliasDeclaration, TSInterfaceDeclaration, TSInterfaceBody, TSTypeElement,
    TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSPropertySignature,
    TSMethodSignature, TSImportEqualsDeclaration, TSImportEqualsDeclModuleRef,
    TSExternalModuleReference, TSExportAssignment, TSNamespaceExportDeclaration, TSTypeReference,
    TSTypePredicate, TSTypePredicateParamName, TSTypeQuery, TSTypeQueryExprName, TSImportType,
    TSTypeLiteral, TSArrayType, TSTupleType, TSTupleTypeElType, TSNamedTupleMember, TSOptionalType,
    TSRestType, TSUnionType, TSIntersectionType, TSConditionalType, TSInferType,
    TSParenthesizedType, TSTypeOperator, TSIndexedAccessType, TSMappedType, TSLiteralType,
    TSLiteralTypeLiteral, TSAsExpression, TSTypeAssertion, TSNonNullExpression, ArrayPattern,
    ObjectPattern,
};

use swc_ecma_ast::{
    TsTypeAnn, TsType, TsKeywordType, TsKeywordTypeKind, TsThisType, TsFnOrConstructorType,
    TsFnType, TsFnParam, TsTypeParamDecl, TsTypeParam, Accessibility, TsIndexSignature,
    TsConstructorType, TsExprWithTypeArgs, TsTypeParamInstantiation, TsEntityName, TsQualifiedName,
    TsParamProp, TsParamPropParam, TsModuleDecl, TsNamespaceBody, TsModuleBlock, TsModuleName,
    TsEnumDecl, TsEnumMember, TsEnumMemberId, TsTypeAliasDecl, TsNamespaceDecl, TsInterfaceDecl,
    TsInterfaceBody, TsTypeElement, TsCallSignatureDecl, TsConstructSignatureDecl,
    TsPropertySignature, TsMethodSignature, TsImportEqualsDecl, TsModuleRef,
    TsExternalModuleRef, TsExportAssignment, TsNamespaceExportDecl, TsTypeRef, TsTypePredicate,
    TsThisTypeOrIdent, TsTypeQuery, TsTypeQueryExpr, TsImportType, TsTypeLit, TsArrayType,
    TsTupleType, TsTupleElement, Pat, TsOptionalType, TsRestType, TsUnionOrIntersectionType,
    TsUnionType, TsIntersectionType, TsConditionalType, TsInferType, TsParenthesizedType,
    TsTypeOperator, TsTypeOperatorOp, TsIndexedAccessType, TsMappedType, TruePlusMinus, TsLitType,
    TsLit, TsTplLitType, TsAsExpr, TsTypeAssertion, TsNonNullExpr, TsConstAssertion,
};
use swc_common::Spanned;
use serde::{Serialize, Deserialize};
use std::any::type_name_of_val;

impl Babelify for TsTypeAnn {
    type Output = TSTypeAnnotation;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeAnnotation {
            base: ctx.base(self.span),
            type_annotation: self.type_ann.babelify(ctx),
        }
    }
}

impl Babelify for TsFnType {
    type Output = TSFunctionType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSFunctionType {
            base: ctx.base(self.span),
            parameters: self.params.iter().map(|p| p.clone().babelify(ctx).into()).collect(),
            type_parameters: self.type_params.map(|decl| decl.babelify(ctx)),
            type_annotation: Some(Box::new(self.type_ann.babelify(ctx))),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TsFnParamOutput {
    Id(Identifier),
    Array(ArrayPattern),
    Rest(RestElement),
    Object(ObjectPattern),
}

impl Babelify for TsFnParam {
    type Output = TsFnParamOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsFnParam::Ident(i) => TsFnParamOutput::Id(i.babelify(ctx)),
            TsFnParam::Array(a) => TsFnParamOutput::Array(a.babelify(ctx)),
            TsFnParam::Rest(r) => TsFnParamOutput::Rest(r.babelify(ctx)),
            TsFnParam::Object(o) => TsFnParamOutput::Object(o.babelify(ctx)),
        }
    }
}

impl From<TsFnParamOutput> for IdOrRest {
    fn from(o: TsFnParamOutput) -> Self {
        match o {
            TsFnParamOutput::Id(i) => IdOrRest::Id(i),
            TsFnParamOutput::Rest(r) => IdOrRest::Rest(r),
            _ => panic!("illegal conversion: Cannot convert {} to IdOrRest (in impl From<TsFnParamOutput> for IdOrRest)", type_name_of_val(&o)),
        }
    }
}

impl From<TsFnParamOutput> for Identifier {
    fn from(o: TsFnParamOutput) -> Self {
        match o {
            TsFnParamOutput::Id(i) => i,
            _ => panic!("illegal conversion: Cannot convert {} to Identifier (in impl From<TsFnParamOutput> for Identifier)", type_name_of_val(&o)),
        }
    }
}


impl Babelify for TsTypeParamDecl {
    type Output = TSTypeParameterDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeParameterDeclaration {
            base: ctx.base(self.span),
            params: self.params.iter().map(|p| p.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsTypeParam {
    type Output = TSTypeParameter;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeParameter {
            base: ctx.base(self.span),
            name: self.name.sym.to_string(),
            constraint: self.constraint.map(|c| Box::new(c.babelify(ctx))),
            default: self.default.map(|d| Box::new(d.babelify(ctx))),
        }
    }
}

impl Babelify for TsTypeParamInstantiation {
    type Output = TSTypeParameterInstantiation;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeParameterInstantiation {
            base: ctx.base(self.span),
            params: self.params.iter().map(|param| param.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsParamProp {
    type Output = TSParameterProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSParameterProperty {
            base: ctx.base(self.span),
            parameter: self.param.babelify(ctx),
            accessibility: self.accessibility.map(|access| access.babelify(ctx)),
            readonly: Some(self.readonly),
        }
    }
}

impl Babelify for TsParamPropParam {
    type Output = TSParamPropParam;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsParamPropParam::Ident(i) => TSParamPropParam::Id(i.babelify(ctx)),
            TsParamPropParam::Assign(a) => TSParamPropParam::Assignment(a.babelify(ctx)),
        }
    }
}

impl Babelify for TsQualifiedName {
    type Output = TSQualifiedName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSQualifiedName {
            base: ctx.base(self.span()),
            left: Box::new(self.left.babelify(ctx)),
            right: self.right.babelify(ctx),
        }
    }
}

impl Babelify for TsEntityName {
    type Output = TSEntityName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsEntityName::TsQualifiedName(n) => TSEntityName::Qualified(n.babelify(ctx)),
            TsEntityName::Ident(i) => TSEntityName::Id(i.babelify(ctx)),
        }
    }
}

/*
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TsSignatureDeclOutput {
    CallSignatureDecl(TSCallSignatureDeclaration),
    ConstructSignatureDecl(TSConstructSignatureDeclaration),
    MethodSignature(TSMethodSignature),
    FuncType(TSFunctionType),
    ConstructorType(TSConstructorType),
}

impl Babelify for TsSignatureDecl {
    type Output = TsSignatureDeclOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsSignatureDecl::TsCallSignatureDecl(t) => TsSignatureDeclOutput::CallSignatureDecl(t.babelify(ctx)),
            TsSignatureDecl::TsConstructSignatureDecl(t) => TsSignatureDeclOutput::ConstructSignatureDecl(t.babelify(ctx)),
            TsSignatureDecl::TsMethodSignature(t) => TsSignatureDeclOutput::MethodSignature(t.babelify(ctx)),
            TsSignatureDecl::TsFnType(t) => TsSignatureDeclOutput::FuncType(t.babelify(ctx)),
            TsSignatureDecl::TsConstructorType(t) => TsSignatureDeclOutput::ConstructorType(t.babelify(ctx)),
        }
    }
}
*/

impl Babelify for TsTypeElement {
    type Output = TSTypeElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsTypeElement::TsCallSignatureDecl(t) => TSTypeElement::CallSignatureDecl(t.babelify(ctx)),
            TsTypeElement::TsConstructSignatureDecl(t) => TSTypeElement::ConstructSignatureDecl(t.babelify(ctx)),
            TsTypeElement::TsPropertySignature(t) => TSTypeElement::PropSignature(t.babelify(ctx)),
            TsTypeElement::TsMethodSignature(t) => TSTypeElement::MethodSignature(t.babelify(ctx)),
            TsTypeElement::TsIndexSignature(t) => TSTypeElement::IndexSignature(t.babelify(ctx)),
            TsTypeElement::TsGetterSignature(_) => panic!("unimplemented"), // TODO(dwoznicki): babel does not have this node
            TsTypeElement::TsSetterSignature(_) => panic!("unimplemented"), // TODO(dwoznicki): babel does not have this node
        }
    }
}

impl Babelify for TsCallSignatureDecl {
    type Output = TSCallSignatureDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSCallSignatureDeclaration {
            base: ctx.base(self.span),
            type_parameters: self.type_params.map(|t| t.babelify(ctx)),
            parameters: self.params.iter().map(|param| param.clone().babelify(ctx).into()).collect(),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
        }
    }
}

impl Babelify for TsConstructSignatureDecl {
    type Output = TSConstructSignatureDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSConstructSignatureDeclaration {
            base: ctx.base(self.span),
            type_parameters: self.type_params.map(|t| t.babelify(ctx)),
            parameters: self.params.iter().map(|param| param.clone().babelify(ctx).into()).collect(),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
        }
    }
}

impl Babelify for TsPropertySignature {
    type Output = TSPropertySignature;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSPropertySignature {
            base: ctx.base(self.span),
            key: Box::new(self.key.babelify(ctx).into()),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
            initializer: self.init.map(|i| Box::new(i.babelify(ctx).into())),
            computed: Some(self.computed),
            optional: Some(self.optional),
            readonly: Some(self.readonly),
        }
    }
}

impl Babelify for TsMethodSignature {
    type Output = TSMethodSignature;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSMethodSignature {
            base: ctx.base(self.span),
            key: Box::new(self.key.babelify(ctx).into()),
            type_parameters: self.type_params.map(|t| t.babelify(ctx)),
            parameters: self.params.iter().map(|param| param.clone().babelify(ctx).into()).collect(),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
            computed: Some(self.computed),
            optional: Some(self.optional),
        }
    }
}

impl Babelify for TsIndexSignature {
    type Output = TSIndexSignature;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSIndexSignature {
            base: ctx.base(self.span),
            paramters: self.params.iter().map(|param| param.clone().babelify(ctx).into()).collect(),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
            readonly: Some(self.readonly),
        }
    }
}

impl Babelify for TsType {
    type Output = TSType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsType::TsKeywordType(t) => {
                match t.babelify(ctx) {
                    TsKeywordTypeOutput::Any(a) => TSType::AnyKeyword(a),
                    TsKeywordTypeOutput::Unknown(u) => TSType::UnknownKeyword(u),
                    TsKeywordTypeOutput::Number(n) => TSType::NumberKeyword(n),
                    TsKeywordTypeOutput::Object(o) => TSType::ObjectKeyword(o),
                    TsKeywordTypeOutput::Boolean(b) => TSType::BooleanKeyword(b),
                    TsKeywordTypeOutput::BigInt(i) => TSType::BigIntKeyword(i),
                    TsKeywordTypeOutput::String(s) => TSType::StringKeyword(s),
                    TsKeywordTypeOutput::Symbol(s) => TSType::SymbolKeyword(s),
                    TsKeywordTypeOutput::Void(v) => TSType::VoidKeyword(v),
                    TsKeywordTypeOutput::Undefined(u) => TSType::UndefinedKeyword(u),
                    TsKeywordTypeOutput::Null(n) => TSType::NullKeyword(n),
                    TsKeywordTypeOutput::Never(n) => TSType::NeverKeyword(n),
                    TsKeywordTypeOutput::Intrinsic(i) => TSType::IntrinsicKeyword(i),
                }
            },
            TsType::TsThisType(t) => TSType::This(t.babelify(ctx)),
            TsType::TsFnOrConstructorType(t) => {
                match t.babelify(ctx) {
                    TsFnOrConstructorTypeOutput::Func(f) => TSType::Function(f),
                    TsFnOrConstructorTypeOutput::Constructor(c) => TSType::Constructor(c),
                }
            },
            TsType::TsTypeRef(r) => TSType::TypeRef(r.babelify(ctx)),
            TsType::TsTypeQuery(q) => TSType::TypeQuery(q.babelify(ctx)),
            TsType::TsTypeLit(l) => TSType::TypeLiteral(l.babelify(ctx)),
            TsType::TsArrayType(a) => TSType::Array(a.babelify(ctx)),
            TsType::TsTupleType(t) => TSType::Tuple(t.babelify(ctx)),
            TsType::TsOptionalType(o) => TSType::Optional(o.babelify(ctx)),
            TsType::TsRestType(r) => TSType::Rest(r.babelify(ctx)),
            TsType::TsUnionOrIntersectionType(t) => {
                match t.babelify(ctx) {
                    TsUnionOrIntersectionTypeOutput::Union(u) => TSType::Union(u),
                    TsUnionOrIntersectionTypeOutput::Intersection(i) => TSType::Intersection(i),
                }
            },
            TsType::TsConditionalType(c) => TSType::Conditional(c.babelify(ctx)),
            TsType::TsInferType(i) => TSType::Infer(i.babelify(ctx)),
            TsType::TsParenthesizedType(p) => TSType::Parenthesized(p.babelify(ctx)),
            TsType::TsTypeOperator(o) => TSType::TypeOp(o.babelify(ctx)),
            TsType::TsIndexedAccessType(a) => TSType::IndexedAccess(a.babelify(ctx)),
            TsType::TsMappedType(m) => TSType::Mapped(m.babelify(ctx)),
            TsType::TsLitType(l) => TSType::Literal(l.babelify(ctx)),
            TsType::TsTypePredicate(p) => TSType::TypePredicate(p.babelify(ctx)),
            TsType::TsImportType(i) => TSType::Import(i.babelify(ctx)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TsFnOrConstructorTypeOutput {
    Func(TSFunctionType),
    Constructor(TSConstructorType),
}

impl Babelify for TsFnOrConstructorType {
    type Output = TsFnOrConstructorTypeOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsFnOrConstructorType::TsFnType(t) => TsFnOrConstructorTypeOutput::Func(t.babelify(ctx)),
            TsFnOrConstructorType::TsConstructorType(t) => TsFnOrConstructorTypeOutput::Constructor(t.babelify(ctx)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TsKeywordTypeOutput {
    Any(TSAnyKeyword),
    Unknown(TSUnknownKeyword),
    Number(TSNumberKeyword),
    Object(TSObjectKeyword),
    Boolean(TSBooleanKeyword),
    BigInt(TSBigIntKeyword),
    String(TSStringKeyword),
    Symbol(TSSymbolKeyword),
    Void(TSVoidKeyword),
    Undefined(TSUndefinedKeyword),
    Null(TSNullKeyword),
    Never(TSNeverKeyword),
    Intrinsic(TSIntrinsicKeyword),
}

impl Babelify for TsKeywordType {
    type Output = TsKeywordTypeOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self.kind {
            TsKeywordTypeKind::TsAnyKeyword => TsKeywordTypeOutput::Any(TSAnyKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsUnknownKeyword => TsKeywordTypeOutput::Unknown(TSUnknownKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsNumberKeyword => TsKeywordTypeOutput::Number(TSNumberKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsObjectKeyword => TsKeywordTypeOutput::Object(TSObjectKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsBooleanKeyword => TsKeywordTypeOutput::Boolean(TSBooleanKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsBigIntKeyword => TsKeywordTypeOutput::BigInt(TSBigIntKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsStringKeyword => TsKeywordTypeOutput::String(TSStringKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsSymbolKeyword => TsKeywordTypeOutput::Symbol(TSSymbolKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsVoidKeyword => TsKeywordTypeOutput::Void(TSVoidKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsUndefinedKeyword => TsKeywordTypeOutput::Undefined(TSUndefinedKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsNullKeyword => TsKeywordTypeOutput::Null(TSNullKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsNeverKeyword => TsKeywordTypeOutput::Never(TSNeverKeyword {
                base: ctx.base(self.span),
            }),
            TsKeywordTypeKind::TsIntrinsicKeyword => TsKeywordTypeOutput::Intrinsic(TSIntrinsicKeyword {
                base: ctx.base(self.span),
            }),
        }
    }
}

impl Babelify for TsThisType {
    type Output = TSThisType;
    
    fn babelify(self, ctx: &Context) -> Self::Output {
        TSThisType {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for TsConstructorType {
    type Output = TSConstructorType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSConstructorType {
            base: ctx.base(self.span),
            parameters: self.params.iter().map(|param| param.clone().babelify(ctx).into()).collect(),
            type_parameters: self.type_params.map(|decl| decl.babelify(ctx)),
            type_annotation: Some(Box::new(self.type_ann.babelify(ctx))),
            is_abstract: Some(self.is_abstract),
        }
    }
}

impl Babelify for TsTypeRef {
    type Output = TSTypeReference;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeReference {
            base: ctx.base(self.span),
            type_name: self.type_name.babelify(ctx),
            type_parameters: self.type_params.map(|t| t.babelify(ctx)),
        }
    }
}

impl Babelify for TsTypePredicate {
    type Output = TSTypePredicate;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypePredicate {
            base: ctx.base(self.span),
            parameter_name: self.param_name.babelify(ctx),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
            asserts: Some(self.asserts),
        }
    }
}

impl Babelify for TsThisTypeOrIdent {
    type Output = TSTypePredicateParamName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsThisTypeOrIdent::Ident(i) => TSTypePredicateParamName::Id(i.babelify(ctx)),
            TsThisTypeOrIdent::TsThisType(t) => TSTypePredicateParamName::This(t.babelify(ctx)),
        }
    }
}

impl Babelify for TsTypeQuery {
    type Output = TSTypeQuery;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeQuery {
            base: ctx.base(self.span),
            expr_name: self.expr_name.babelify(ctx),
        }
    }
}

impl Babelify for TsTypeQueryExpr {
    type Output = TSTypeQueryExprName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsTypeQueryExpr::TsEntityName(n) => TSTypeQueryExprName::EntityName(n.babelify(ctx)),
            TsTypeQueryExpr::Import(i) => TSTypeQueryExprName::ImportType(i.babelify(ctx)),
        }
    }
}

impl Babelify for TsImportType {
    type Output = TSImportType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSImportType {
            base: ctx.base(self.span),
            argument: self.arg.babelify(ctx),
            qualifier: self.qualifier.map(|qual| qual.babelify(ctx)),
            type_parameters: self.type_args.map(|param| param.babelify(ctx)),
        }
    }
}

impl Babelify for TsTypeLit {
    type Output = TSTypeLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeLiteral {
            base: ctx.base(self.span),
            members: self.members.iter().map(|memb| memb.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsArrayType {
    type Output = TSArrayType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSArrayType {
            base: ctx.base(self.span),
            element_type: Box::new(self.elem_type.babelify(ctx)),
        }
    }
}

impl Babelify for TsTupleType {
    type Output = TSTupleType;
    
    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTupleType {
            base: ctx.base(self.span),
            element_types: self.elem_types.iter().map(|t| t.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsTupleElement {
    type Output = TSTupleTypeElType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self.label {
            None => TSTupleTypeElType::TSType(self.ty.babelify(ctx)),
            Some(pat) => {
                TSTupleTypeElType::Member(TSNamedTupleMember {
                    base: ctx.base(self.span),
                    label: match pat {
                        Pat::Ident(id) => id.babelify(ctx),
                        Pat::Rest(rest) => {
                            match *rest.arg {
                                Pat::Ident(id) => id.babelify(ctx),
                                _ => panic!("illegal conversion: Cannot convert {} to Identifier (in impl Babelify for TsTupleElement)", type_name_of_val(&rest.arg)),
                            }
                        },
                        _ => panic!("illegal conversion: Cannot convert {} to Identifier (in impl Babelify for TsTupleElement)", type_name_of_val(&pat)),
                    },
                    element_type: self.ty.babelify(ctx),
                    optional: Default::default(),
               })
            }
        }
    }
}

impl Babelify for TsOptionalType {
    type Output = TSOptionalType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSOptionalType {
            base: ctx.base(self.span),
            type_annotation: Box::new(self.type_ann.babelify(ctx)),
        }
    }
}

impl Babelify for TsRestType {
    type Output = TSRestType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSRestType {
            base: ctx.base(self.span),
            type_annotation: Box::new(self.type_ann.babelify(ctx)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TsUnionOrIntersectionTypeOutput {
    Union(TSUnionType),
    Intersection(TSIntersectionType),
}

impl Babelify for TsUnionOrIntersectionType {
    type Output = TsUnionOrIntersectionTypeOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsUnionOrIntersectionType::TsUnionType(u) => TsUnionOrIntersectionTypeOutput::Union(u.babelify(ctx)),
            TsUnionOrIntersectionType::TsIntersectionType(i) => TsUnionOrIntersectionTypeOutput::Intersection(i.babelify(ctx)),
        }
    }
}

impl Babelify for TsUnionType {
    type Output = TSUnionType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSUnionType {
            base: ctx.base(self.span),
            types: self.types.iter().map(|t| t.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsIntersectionType {
    type Output = TSIntersectionType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSIntersectionType {
            base: ctx.base(self.span),
            types: self.types.iter().map(|t| t.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsConditionalType {
    type Output = TSConditionalType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSConditionalType {
            base: ctx.base(self.span),
            check_type: Box::new(self.check_type.babelify(ctx)),
            extends_type: Box::new(self.extends_type.babelify(ctx)),
            true_type: Box::new(self.true_type.babelify(ctx)),
            false_type: Box::new(self.false_type.babelify(ctx)),
        }
    }
}

impl Babelify for TsInferType {
    type Output = TSInferType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSInferType {
            base: ctx.base(self.span),
            type_parameter: Box::new(self.type_param.babelify(ctx)),
        }
    }
}

impl Babelify for TsParenthesizedType {
    type Output = TSParenthesizedType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSParenthesizedType {
            base: ctx.base(self.span),
            type_annotation: Box::new(self.type_ann.babelify(ctx)),
        }
    }
}

impl Babelify for TsTypeOperator {
    type Output = TSTypeOperator;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeOperator {
            base: ctx.base(self.span),
            type_annotation: Box::new(self.type_ann.babelify(ctx)),
            operator: self.op.babelify(ctx),
        }
    }
}

impl Babelify for TsTypeOperatorOp {
    type Output = String;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            TsTypeOperatorOp::KeyOf => "keyof".to_string(),
            TsTypeOperatorOp::Unique => "unique".to_string(),
            TsTypeOperatorOp::ReadOnly => "readonly".to_string(),
        }
    }
}

impl Babelify for TsIndexedAccessType {
    type Output = TSIndexedAccessType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSIndexedAccessType {
            base: ctx.base(self.span),
            object_type: Box::new(self.obj_type.babelify(ctx)),
            index_type: Box::new(self.index_type.babelify(ctx)),
        }
    }
}

// TODO(dwoznicki): I don't understand how Babel handles the +/- symbol, so this
// conversion will not work properly yet.
impl Babelify for TsMappedType {
    type Output = TSMappedType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSMappedType {
            base: ctx.base(self.span),
            type_parameter: Box::new(self.type_param.babelify(ctx)),
            type_annotation: self.type_ann.map(|ann| Box::new(ann.babelify(ctx))),
            name_type: self.name_type.map(|t| Box::new(t.babelify(ctx))),
            optional: self.optional.map(|val| val == TruePlusMinus::True),
            readonly: self.readonly.map(|val| val == TruePlusMinus::True),
        }
    }
}

impl Babelify for TsLitType {
    type Output = TSLiteralType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSLiteralType {
            base: ctx.base(self.span),
            literal: self.lit.babelify(ctx),
        }
    }
}

impl Babelify for TsLit {
    type Output = TSLiteralTypeLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsLit::Number(n) => TSLiteralTypeLiteral::Numeric(n.babelify(ctx)),
            TsLit::Str(s) => TSLiteralTypeLiteral::String(s.babelify(ctx)),
            TsLit::Bool(b) => TSLiteralTypeLiteral::Boolean(b.babelify(ctx)),
            TsLit::BigInt(i) => TSLiteralTypeLiteral::BigInt(i.babelify(ctx)),
            _ => panic!("illegal conversion: Cannot convert {} to TSLiteralTypeLiteral (in impl Babelify for TsLit)", type_name_of_val(&self)),
        }
    }
}

// TODO(dwoznicki): Babel does not appear to have a corresponding template literal TS node.
impl Babelify for TsTplLitType {
    type Output = String;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        panic!("unimplemented");
    }
}

impl Babelify for TsInterfaceDecl {
    type Output = TSInterfaceDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSInterfaceDeclaration {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
            type_parameters: self.type_params.map(|t| t.babelify(ctx)),
            extends: self.extends.first().map(|ext| ext.clone().babelify(ctx)),
            body: self.body.babelify(ctx),
            declare: Some(self.declare),
        }
    }
}

impl Babelify for TsInterfaceBody {
    type Output = TSInterfaceBody;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSInterfaceBody {
            base: ctx.base(self.span),
            body: self.body.iter().map(|el| el.clone().babelify(ctx)).collect(),
        }
    }
}

impl Babelify for TsExprWithTypeArgs {
    type Output = TSExpressionWithTypeArguments;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSExpressionWithTypeArguments {
            base: ctx.base(self.span),
            expression: self.expr.babelify(ctx),
            type_parameters: self.type_args.map(|arg| arg.babelify(ctx)),
        }
    }
}

impl Babelify for TsTypeAliasDecl {
    type Output = TSTypeAliasDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeAliasDeclaration {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
            type_parameters: self.type_params.map(|t| t.babelify(ctx)),
            type_annotation: self.type_ann.babelify(ctx),
            declare: Some(self.declare),
        }
    }
}

impl Babelify for TsEnumDecl {
    type Output = TSEnumDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSEnumDeclaration {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
            members: self.members.iter().map(|memb| memb.clone().babelify(ctx)).collect(),
            is_const: Some(self.is_const),
            declare: Some(self.declare),
            initializer: Default::default(),
        }
    }
}

impl Babelify for TsEnumMember {
    type Output = TSEnumMember;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSEnumMember {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
            initializer: self.init.map(|i| Box::new(i.babelify(ctx).into())),
        }
    }
}

impl Babelify for TsEnumMemberId {
    type Output = IdOrString;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsEnumMemberId::Ident(i) => IdOrString::Id(i.babelify(ctx)),
            TsEnumMemberId::Str(s) => IdOrString::String(s.babelify(ctx)),
        }
    }
}

impl Babelify for TsModuleDecl {
    type Output = TSModuleDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSModuleDeclaration {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
            body: Box::new(self.body.unwrap().babelify(ctx)),
            declare: Some(self.declare),
            global: Some(self.global),
        }
    }
}

impl Babelify for TsNamespaceBody {
    type Output = TSModuleDeclBody;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsNamespaceBody::TsModuleBlock(b) => TSModuleDeclBody::Block(b.babelify(ctx)),
            TsNamespaceBody::TsNamespaceDecl(d) => TSModuleDeclBody::Decl(d.babelify(ctx)),
        }
    }
}

impl Babelify for TsModuleBlock {
    type Output = TSModuleBlock;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSModuleBlock {
            base: ctx.base(self.span),
            body: self.body.iter().map(|m| m.clone().babelify(ctx).into()).collect(),
        }
    }
}

impl Babelify for TsNamespaceDecl {
    type Output = TSModuleDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSModuleDeclaration {
            base: ctx.base(self.span),
            id: IdOrString::Id(self.id.babelify(ctx)),
            body: Box::new(self.body.babelify(ctx)),
            declare: Some(self.declare),
            global: Some(self.global),
        }
    }
}

impl Babelify for TsModuleName {
    type Output = IdOrString;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsModuleName::Ident(i) => IdOrString::Id(i.babelify(ctx)),
            TsModuleName::Str(s) => IdOrString::String(s.babelify(ctx)),
        }
    }
}

impl Babelify for TsImportEqualsDecl {
    type Output = TSImportEqualsDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSImportEqualsDeclaration {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
            module_reference: self.module_ref.babelify(ctx),
            is_export: self.is_export,
        }
    }
}

impl Babelify for TsModuleRef {
    type Output = TSImportEqualsDeclModuleRef;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsModuleRef::TsEntityName(n) => TSImportEqualsDeclModuleRef::Name(n.babelify(ctx)),
            TsModuleRef::TsExternalModuleRef(e) => TSImportEqualsDeclModuleRef::External(e.babelify(ctx)),
        }
    }
}

impl Babelify for TsExternalModuleRef {
    type Output = TSExternalModuleReference;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSExternalModuleReference {
            base: ctx.base(self.span),
            expression: self.expr.babelify(ctx),
        }
    }
}

impl Babelify for TsExportAssignment {
    type Output = TSExportAssignment;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSExportAssignment {
            base: ctx.base(self.span),
            expression: Box::new(self.expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for TsNamespaceExportDecl {
    type Output = TSNamespaceExportDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSNamespaceExportDeclaration {
            base: ctx.base(self.span),
            id: self.id.babelify(ctx),
        }
    }
}

impl Babelify for TsAsExpr {
    type Output = TSAsExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSAsExpression {
            base: ctx.base(self.span),
            expression: Box::new(self.expr.babelify(ctx).into()),
            type_annotation: self.type_ann.babelify(ctx),
        }
    }
}

impl Babelify for TsTypeAssertion {
    type Output = TSTypeAssertion;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeAssertion {
            base: ctx.base(self.span),
            expression: Box::new(self.expr.babelify(ctx).into()),
            type_annotation: self.type_ann.babelify(ctx),
        }
    }
}

impl Babelify for TsNonNullExpr {
    type Output = TSNonNullExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSNonNullExpression {
            base: ctx.base(self.span),
            expression: Box::new(self.expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for Accessibility {
    type Output = Access;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            Accessibility::Public => Access::Public,
            Accessibility::Protected => Access::Protected,
            Accessibility::Private => Access::Private,
        }
    }
}

// TODO(dwoznicki): There does not appear to be a corresponding Babel node for this.
impl Babelify for TsConstAssertion {
    type Output = String;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        panic!("unimplemented");
    }
}

