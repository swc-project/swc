use super::Context;
use crate::ast::{
    common::{
        IdOrRest, TypeAnnotOrNoop, TypeParamDeclOrNoop, Access, RestElement, Identifier,
        SuperTypeParams,
    },
    class::ClassImpl,
    typescript::{
        TSTypeAnnotation, TSType, TSAnyKeyword, TSUnknownKeyword, TSNumberKeyword, TSObjectKeyword,
        TSBooleanKeyword, TSBigIntKeyword, TSStringKeyword, TSSymbolKeyword, TSVoidKeyword,
        TSUndefinedKeyword, TSNullKeyword, TSNeverKeyword, TSIntrinsicKeyword, TSThisType,
        TSFunctionType, TSConstructorType, TSTypeParameterDeclaration, TSTypeParameter,
        TSIndexSignature, TSExpressionWithTypeArguments, TSTypeParameterInstantiation, TSEntityName,
        TSQualifiedName, TSParameterProperty, TSParamPropParam,
    },
    pat::{ArrayPattern, ObjectPattern},
};
use crate::convert::Babelify;
use swc_ecma_ast::{
    TsTypeAnn, TsType, TsKeywordType, TsKeywordTypeKind, TsThisType, TsFnOrConstructorType,
    TsFnType, TsFnParam, TsTypeParamDecl, TsTypeParam, Accessibility, TsIndexSignature,
    TsConstructorType, TsExprWithTypeArgs, TsTypeParamInstantiation, TsEntityName, TsQualifiedName,
    TsParamProp, TsParamPropParam,
};
use swc_common::Spanned;
use serde::{Serialize, Deserialize};

impl Babelify for TsTypeAnn {
    type Output = TSTypeAnnotation;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeAnnotation {
            base: ctx.base(self.span),
            type_annotation: self.type_ann.babelify(ctx),
        }
    }
}

impl From<TSTypeAnnotation> for TypeAnnotOrNoop {
    fn from(t: TSTypeAnnotation) -> Self {
        TypeAnnotOrNoop::TS(t)
    }
}

impl Babelify for TsType {
    type Output = TSType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsType::TsKeywordType(t) => {
                match t.babelify(ctx) {
                    TsKeywordTypeOutput::Any(w) => TSType::AnyKeyword(w),
                    TsKeywordTypeOutput::Unknown(w) => TSType::UnknownKeyword(w),
                    TsKeywordTypeOutput::Number(w) => TSType::NumberKeyword(w),
                    TsKeywordTypeOutput::Object(w) => TSType::ObjectKeyword(w),
                    TsKeywordTypeOutput::Boolean(w) => TSType::BooleanKeyword(w),
                    TsKeywordTypeOutput::BigInt(w) => TSType::BigIntKeyword(w),
                    TsKeywordTypeOutput::String(w) => TSType::StringKeyword(w),
                    TsKeywordTypeOutput::Symbol(w) => TSType::SymbolKeyword(w),
                    TsKeywordTypeOutput::Void(w) => TSType::VoidKeyword(w),
                    TsKeywordTypeOutput::Undefined(w) => TSType::UndefinedKeyword(w),
                    TsKeywordTypeOutput::Null(w) => TSType::NullKeyword(w),
                    TsKeywordTypeOutput::Never(w) => TSType::NeverKeyword(w),
                    TsKeywordTypeOutput::Intrinsic(w) => TSType::IntrinsicKeyword(w),
                }
            },
            TsType::TsThisType(t) => TSType::This(t.babelify(ctx)),
            // TsType::TsFnOrConstructorType(f) => panic!(),
            _ => panic!()
        }
    }
}

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsType {
//     #[tag("TsKeywordType")]
//     TsKeywordType(TsKeywordType),
//
//     #[tag("TsThisType")]
//     TsThisType(TsThisType),
//
//     #[tag("TsFunctionType")]
//     #[tag("TsConstructorType")]
//     TsFnOrConstructorType(TsFnOrConstructorType),
//
//     #[tag("TsTypeReference")]
//     TsTypeRef(TsTypeRef),
//
//     #[tag("TsTypeQuery")]
//     TsTypeQuery(TsTypeQuery),
//
//     #[tag("TsTypeLiteral")]
//     TsTypeLit(TsTypeLit),
//
//     #[tag("TsArrayType")]
//     TsArrayType(TsArrayType),
//
//     #[tag("TsTupleType")]
//     TsTupleType(TsTupleType),
//
//     #[tag("TsOptionalType")]
//     TsOptionalType(TsOptionalType),
//
//     #[tag("TsRestType")]
//     TsRestType(TsRestType),
//
//     #[tag("TsUnionType")]
//     #[tag("TsIntersectionType")]
//     TsUnionOrIntersectionType(TsUnionOrIntersectionType),
//
//     #[tag("TsConditionalType")]
//     TsConditionalType(TsConditionalType),
//
//     #[tag("TsInferType")]
//     TsInferType(TsInferType),
//
//     #[tag("TsParenthesizedType")]
//     TsParenthesizedType(TsParenthesizedType),
//
//     #[tag("TsTypeOperator")]
//     TsTypeOperator(TsTypeOperator),
//
//     #[tag("TsIndexedAccessType")]
//     TsIndexedAccessType(TsIndexedAccessType),
//
//     #[tag("TsMappedType")]
//     TsMappedType(TsMappedType),
//
//     #[tag("TsLiteralType")]
//     TsLitType(TsLitType),
//
//     #[tag("TsTypePredicate")]
//     TsTypePredicate(TsTypePredicate),
//
//     #[tag("TsImportType")]
//     TsImportType(TsImportType),
// }
//

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

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsFnOrConstructorType {
//     #[tag("TsFunctionType")]
//     TsFnType(TsFnType),
//     #[tag("TsConstructorType")]
//     TsConstructorType(TsConstructorType),
// }
//

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

// #[ast_node("TsFunctionType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsFnType {
//     pub span: Span,
//     pub params: Vec<TsFnParam>,
//
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: TsTypeAnn,
// }


#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TsFnParamOutput {
    Id(Identifier),
    Array(ArrayPattern),
    Rest(RestElement),
    Object(ObjectPattern),
}

impl From<TsFnParamOutput> for IdOrRest {
    fn from(o: TsFnParamOutput) -> Self {
        match o {
            TsFnParamOutput::Id(i) => IdOrRest::Id(i),
            TsFnParamOutput::Rest(r) => IdOrRest::Rest(r),
            _ => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
        }
    }
}

impl From<TsFnParamOutput> for Identifier {
    fn from(o: TsFnParamOutput) -> Self {
        match o {
            TsFnParamOutput::Id(i) => i,
            _ => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
        }
    }
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

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsFnParam {
//     #[tag("Identifier")]
//     Ident(BindingIdent),
//
//     #[tag("ArrayPattern")]
//     Array(ArrayPat),
//
//     #[tag("RestElement")]
//     Rest(RestPat),
//
//     #[tag("ObjectPattern")]
//     Object(ObjectPat),
// }
//


impl Babelify for TsTypeParamDecl {
    type Output = TSTypeParameterDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeParameterDeclaration {
            base: ctx.base(self.span),
            params: self.params.iter().map(|p| p.clone().babelify(ctx)).collect(),
        }
    }
}

impl From<TSTypeParameterDeclaration> for TypeParamDeclOrNoop {
    fn from(decl: TSTypeParameterDeclaration) -> Self {
        TypeParamDeclOrNoop::TS(decl)
    }
}

// #[ast_node("TsTypeParameterDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeParamDecl {
//     pub span: Span,
//     #[serde(rename = "parameters")]
//     pub params: Vec<TsTypeParam>,
// }

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

//
// #[ast_node("TsTypeParameter")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeParam {
//     pub span: Span,
//     pub name: Ident,
//
//     #[serde(default)]
//     pub constraint: Option<Box<TsType>>,
//
//     #[serde(default)]
//     pub default: Option<Box<TsType>>,
// }
//

impl Babelify for TsTypeParamInstantiation {
    type Output = TSTypeParameterInstantiation;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSTypeParameterInstantiation {
            base: ctx.base(self.span),
            params: self.params.iter().map(|param| param.clone().babelify(ctx)).collect(),
        }
    }
}

impl From<TSTypeParameterInstantiation> for SuperTypeParams {
    fn from(param: TSTypeParameterInstantiation) -> Self {
        SuperTypeParams::TS(param)
    }
}

// #[ast_node("TsTypeParameterInstantiation")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeParamInstantiation {
//     pub span: Span,
//     pub params: Vec<Box<TsType>>,
// }
//

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

// #[ast_node("TsQualifiedName")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsQualifiedName {
//     #[span(lo)]
//     pub left: TsEntityName,
//     #[span(hi)]
//     pub right: Ident,
// }
//

impl Babelify for TsEntityName {
    type Output = TSEntityName;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            TsEntityName::TsQualifiedName(n) => TSEntityName::Qualified(n.babelify(ctx)),
            TsEntityName::Ident(i) => TSEntityName::Id(i.babelify(ctx)),
        }
    }
}

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[allow(variant_size_differences)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsEntityName {
//     #[tag("TsQualifiedName")]
//     TsQualifiedName(Box<TsQualifiedName>),
//
//     #[tag("Identifier")]
//     Ident(Ident),
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsSignatureDecl {
//     #[tag("TsCallSignatureDeclaration")]
//     TsCallSignatureDecl(TsCallSignatureDecl),
//
//     #[tag("TsConstructSignatureDeclaration")]
//     TsConstructSignatureDecl(TsConstructSignatureDecl),
//
//     #[tag("TsMethodSignature")]
//     TsMethodSignature(TsMethodSignature),
//
//     #[tag("TsFunctionType")]
//     TsFnType(TsFnType),
//
//     #[tag("TsConstructorType")]
//     TsConstructorType(TsConstructorType),
// }
//
// // ================
// // TypeScript type members (for type literal / interface / class)
// // ================
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsTypeElement {
//     #[tag("TsCallSignatureDeclaration")]
//     TsCallSignatureDecl(TsCallSignatureDecl),
//
//     #[tag("TsConstructSignatureDeclaration")]
//     TsConstructSignatureDecl(TsConstructSignatureDecl),
//
//     #[tag("TsPropertySignature")]
//     TsPropertySignature(TsPropertySignature),
//
//     #[tag("TsMethodSignature")]
//     TsMethodSignature(TsMethodSignature),
//
//     #[tag("TsIndexSignature")]
//     TsIndexSignature(TsIndexSignature),
// }
//
// #[ast_node("TsCallSignatureDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsCallSignatureDecl {
//     pub span: Span,
//     pub params: Vec<TsFnParam>,
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
// }
//
// #[ast_node("TsConstructSignatureDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsConstructSignatureDecl {
//     pub span: Span,
//     pub params: Vec<TsFnParam>,
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
// }
//
// #[ast_node("TsPropertySignature")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsPropertySignature {
//     pub span: Span,
//     pub readonly: bool,
//     pub key: Box<Expr>,
//     pub computed: bool,
//     pub optional: bool,
//     #[serde(default)]
//     pub init: Option<Box<Expr>>,
//     pub params: Vec<TsFnParam>,
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
// }
//
// #[ast_node("TsMethodSignature")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsMethodSignature {
//     pub span: Span,
//     pub readonly: bool,
//     pub key: Box<Expr>,
//     pub computed: bool,
//     pub optional: bool,
//     pub params: Vec<TsFnParam>,
//     #[serde(default)]
//     pub type_ann: Option<TsTypeAnn>,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
// }

impl Babelify for TsIndexSignature {
    type Output = TSIndexSignature;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TSIndexSignature {
            base: ctx.base(self.span),
            paramters: self.params.iter().map(|param| param.clone().babelify(ctx).into()).collect(),
            type_annotation: self.type_ann.map(|ann| ann.babelify(ctx)),
            readonly: Some(self.readonly),
        }
    }
}

//
// #[ast_node("TsIndexSignature")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsIndexSignature {
//     pub params: Vec<TsFnParam>,
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
//
//     pub readonly: bool,
//     pub span: Span,
// }
//
// // ================
// // TypeScript types
// // ================
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsType {
//     #[tag("TsKeywordType")]
//     TsKeywordType(TsKeywordType),
//
//     #[tag("TsThisType")]
//     TsThisType(TsThisType),
//
//     #[tag("TsFunctionType")]
//     #[tag("TsConstructorType")]
//     TsFnOrConstructorType(TsFnOrConstructorType),
//
//     #[tag("TsTypeReference")]
//     TsTypeRef(TsTypeRef),
//
//     #[tag("TsTypeQuery")]
//     TsTypeQuery(TsTypeQuery),
//
//     #[tag("TsTypeLiteral")]
//     TsTypeLit(TsTypeLit),
//
//     #[tag("TsArrayType")]
//     TsArrayType(TsArrayType),
//
//     #[tag("TsTupleType")]
//     TsTupleType(TsTupleType),
//
//     #[tag("TsOptionalType")]
//     TsOptionalType(TsOptionalType),
//
//     #[tag("TsRestType")]
//     TsRestType(TsRestType),
//
//     #[tag("TsUnionType")]
//     #[tag("TsIntersectionType")]
//     TsUnionOrIntersectionType(TsUnionOrIntersectionType),
//
//     #[tag("TsConditionalType")]
//     TsConditionalType(TsConditionalType),
//
//     #[tag("TsInferType")]
//     TsInferType(TsInferType),
//
//     #[tag("TsParenthesizedType")]
//     TsParenthesizedType(TsParenthesizedType),
//
//     #[tag("TsTypeOperator")]
//     TsTypeOperator(TsTypeOperator),
//
//     #[tag("TsIndexedAccessType")]
//     TsIndexedAccessType(TsIndexedAccessType),
//
//     #[tag("TsMappedType")]
//     TsMappedType(TsMappedType),
//
//     #[tag("TsLiteralType")]
//     TsLitType(TsLitType),
//
//     #[tag("TsTypePredicate")]
//     TsTypePredicate(TsTypePredicate),
//
//     #[tag("TsImportType")]
//     TsImportType(TsImportType),
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsFnOrConstructorType {
//     #[tag("TsFunctionType")]
//     TsFnType(TsFnType),
//     #[tag("TsConstructorType")]
//     TsConstructorType(TsConstructorType),
// }
//
// impl From<TsFnType> for TsType {
//     fn from(t: TsFnType) -> Self {
//         TsFnOrConstructorType::TsFnType(t).into()
//     }
// }
//
// impl From<TsConstructorType> for TsType {
//     fn from(t: TsConstructorType) -> Self {
//         TsFnOrConstructorType::TsConstructorType(t).into()
//     }
// }
//
// impl From<TsUnionType> for TsType {
//     fn from(t: TsUnionType) -> Self {
//         TsUnionOrIntersectionType::TsUnionType(t).into()
//     }
// }
//
// impl From<TsIntersectionType> for TsType {
//     fn from(t: TsIntersectionType) -> Self {
//         TsUnionOrIntersectionType::TsIntersectionType(t).into()
//     }
// }
//
// #[ast_node("TsKeywordType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsKeywordType {
//     pub span: Span,
//     pub kind: TsKeywordTypeKind,
// }
//
// #[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsKeywordTypeKind {
//     #[serde(rename = "any")]
//     TsAnyKeyword,
//
//     #[serde(rename = "unknown")]
//     TsUnknownKeyword,
//
//     #[serde(rename = "number")]
//     TsNumberKeyword,
//
//     #[serde(rename = "object")]
//     TsObjectKeyword,
//
//     #[serde(rename = "boolean")]
//     TsBooleanKeyword,
//
//     #[serde(rename = "bigint")]
//     TsBigIntKeyword,
//
//     #[serde(rename = "string")]
//     TsStringKeyword,
//
//     #[serde(rename = "symbol")]
//     TsSymbolKeyword,
//
//     #[serde(rename = "void")]
//     TsVoidKeyword,
//
//     #[serde(rename = "undefined")]
//     TsUndefinedKeyword,
//
//     #[serde(rename = "null")]
//     TsNullKeyword,
//
//     #[serde(rename = "never")]
//     TsNeverKeyword,
//
//     #[serde(rename = "intrinsic")]
//     TsIntrinsicKeyword,
// }
//
// #[ast_node("TsThisType")]
// #[derive(Copy, Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsThisType {
//     pub span: Span,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsFnParam {
//     #[tag("Identifier")]
//     Ident(BindingIdent),
//
//     #[tag("ArrayPattern")]
//     Array(ArrayPat),
//
//     #[tag("RestElement")]
//     Rest(RestPat),
//
//     #[tag("ObjectPattern")]
//     Object(ObjectPat),
// }
//
// #[ast_node("TsFunctionType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsFnType {
//     pub span: Span,
//     pub params: Vec<TsFnParam>,
//
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: TsTypeAnn,
// }

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

//
// #[ast_node("TsConstructorType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsConstructorType {
//     pub span: Span,
//     pub params: Vec<TsFnParam>,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: TsTypeAnn,
//     pub is_abstract: bool,
// }
//
// #[ast_node("TsTypeReference")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeRef {
//     pub span: Span,
//     pub type_name: TsEntityName,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamInstantiation>,
// }
//
// #[ast_node("TsTypePredicate")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypePredicate {
//     pub span: Span,
//     pub asserts: bool,
//     pub param_name: TsThisTypeOrIdent,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[allow(variant_size_differences)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsThisTypeOrIdent {
//     #[tag("TsThisType")]
//     TsThisType(TsThisType),
//
//     #[tag("Identifier")]
//     Ident(Ident),
// }
//
// /// `typeof` operator
// #[ast_node("TsTypeQuery")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeQuery {
//     pub span: Span,
//     pub expr_name: TsTypeQueryExpr,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsTypeQueryExpr {
//     #[tag("TsQualifiedName")]
//     #[tag("Identifier")]
//     TsEntityName(TsEntityName),
//     #[tag("TsImportType")]
//     Import(TsImportType),
// }
//
// #[ast_node("TsImportType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsImportType {
//     pub span: Span,
//     #[serde(rename = "argument")]
//     pub arg: Str,
//     pub qualifier: Option<TsEntityName>,
//     #[serde(rename = "typeArguments")]
//     pub type_args: Option<TsTypeParamInstantiation>,
// }
//
// #[ast_node("TsTypeLiteral")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeLit {
//     pub span: Span,
//     pub members: Vec<TsTypeElement>,
// }
//
// #[ast_node("TsArrayType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsArrayType {
//     pub span: Span,
//     pub elem_type: Box<TsType>,
// }
//
// #[ast_node("TsTupleType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTupleType {
//     pub span: Span,
//     pub elem_types: Vec<TsTupleElement>,
// }
//
// #[ast_node("TsTupleElement")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTupleElement {
//     pub span: Span,
//     /// `Ident` or `RestPat { arg: Ident }`
//     pub label: Option<Pat>,
//     pub ty: TsType,
// }
//
// #[ast_node("TsOptionalType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsOptionalType {
//     pub span: Span,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[ast_node("TsRestType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsRestType {
//     pub span: Span,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsUnionOrIntersectionType {
//     #[tag("TsUnionType")]
//     TsUnionType(TsUnionType),
//
//     #[tag("TsIntersectionType")]
//     TsIntersectionType(TsIntersectionType),
// }
//
// #[ast_node("TsUnionType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsUnionType {
//     pub span: Span,
//     pub types: Vec<Box<TsType>>,
// }
//
// #[ast_node("TsIntersectionType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsIntersectionType {
//     pub span: Span,
//     pub types: Vec<Box<TsType>>,
// }
//
// #[ast_node("TsConditionalType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsConditionalType {
//     pub span: Span,
//     pub check_type: Box<TsType>,
//     pub extends_type: Box<TsType>,
//     pub true_type: Box<TsType>,
//     pub false_type: Box<TsType>,
// }
//
// #[ast_node("TsInferType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsInferType {
//     pub span: Span,
//     pub type_param: TsTypeParam,
// }
//
// #[ast_node("TsParenthesizedType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsParenthesizedType {
//     pub span: Span,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[ast_node("TsTypeOperator")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeOperator {
//     pub span: Span,
//     pub op: TsTypeOperatorOp,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[derive(StringEnum, Clone, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsTypeOperatorOp {
//     /// `keyof`
//     KeyOf,
//     /// `unique`
//     Unique,
//     /// `readonly`
//     ReadOnly,
// }
//
// #[ast_node("TsIndexedAccessType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsIndexedAccessType {
//     pub span: Span,
//     pub readonly: bool,
//     #[serde(rename = "objectType")]
//     pub obj_type: Box<TsType>,
//     pub index_type: Box<TsType>,
// }
//
// #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TruePlusMinus {
//     True,
//     Plus,
//     Minus,
// }
//
// impl Serialize for TruePlusMinus {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: ::serde::Serializer,
//     {
//         match *self {
//             TruePlusMinus::True => serializer.serialize_bool(true),
//             TruePlusMinus::Plus => serializer.serialize_str("+"),
//             TruePlusMinus::Minus => serializer.serialize_str("-"),
//         }
//     }
// }
//
// impl<'de> Deserialize<'de> for TruePlusMinus {
//     fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
//     where
//         D: Deserializer<'de>,
//     {
//         struct TruePlusMinusVisitor;
//
//         impl<'de> Visitor<'de> for TruePlusMinusVisitor {
//             type Value = TruePlusMinus;
//             fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
//                 formatter.write_str("one of '+', '-', true")
//             }
//
//             fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
//             where
//                 E: de::Error,
//             {
//                 match value {
//                     "+" => Ok(TruePlusMinus::Plus),
//                     "-" => Ok(TruePlusMinus::Minus),
//                     "true" => Ok(TruePlusMinus::True),
//                     _ => Err(de::Error::invalid_value(Unexpected::Str(value), &self)),
//                 }
//             }
//
//             fn visit_bool<E>(self, value: bool) -> Result<Self::Value, E>
//             where
//                 E: de::Error,
//             {
//                 if value {
//                     Ok(TruePlusMinus::True)
//                 } else {
//                     Err(de::Error::invalid_value(Unexpected::Bool(value), &self))
//                 }
//             }
//         }
//
//         deserializer.deserialize_any(TruePlusMinusVisitor)
//     }
// }
//
// #[ast_node("TsMappedType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsMappedType {
//     pub span: Span,
//     #[serde(default)]
//     pub readonly: Option<TruePlusMinus>,
//     pub type_param: TsTypeParam,
//     #[serde(default, rename = "nameType")]
//     pub name_type: Option<Box<TsType>>,
//     #[serde(default)]
//     pub optional: Option<TruePlusMinus>,
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<Box<TsType>>,
// }
//
// #[ast_node("TsLiteralType")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsLitType {
//     pub span: Span,
//     #[serde(rename = "literal")]
//     pub lit: TsLit,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsLit {
//     #[tag("NumericLiteral")]
//     Number(Number),
//
//     #[tag("StringLiteral")]
//     Str(Str),
//
//     #[tag("BooleanLiteral")]
//     Bool(Bool),
//
//     #[tag("BigIntLiteral")]
//     BigInt(BigInt),
//
//     #[tag("TemplateLiteral")]
//     Tpl(TsTplLitType),
// }
//
// #[ast_node("TemplateLiteral")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTplLitType {
//     pub span: Span,
//
//     pub types: Vec<Box<TsType>>,
//
//     pub quasis: Vec<TplElement>,
// }
//
// // // ================
// // // TypeScript declarations
// // // ================
//
// #[ast_node("TsInterfaceDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsInterfaceDecl {
//     pub span: Span,
//     pub id: Ident,
//     pub declare: bool,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
//     pub extends: Vec<TsExprWithTypeArgs>,
//     pub body: TsInterfaceBody,
// }
//
// #[ast_node("TsInterfaceBody")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsInterfaceBody {
//     pub span: Span,
//     pub body: Vec<TsTypeElement>,
// }
//

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

impl From<TSExpressionWithTypeArguments> for ClassImpl {
    fn from(expr: TSExpressionWithTypeArguments) -> Self {
        ClassImpl::TSExpr(expr)
    }
}

// #[ast_node("TsExpressionWithTypeArguments")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsExprWithTypeArgs {
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: TsEntityName,
//     #[serde(default, rename = "typeArguments")]
//     pub type_args: Option<TsTypeParamInstantiation>,
// }
//
// #[ast_node("TsTypeAliasDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeAliasDecl {
//     pub span: Span,
//     pub declare: bool,
//     pub id: Ident,
//     #[serde(default)]
//     pub type_params: Option<TsTypeParamDecl>,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[ast_node("TsEnumDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsEnumDecl {
//     pub span: Span,
//     pub declare: bool,
//     pub is_const: bool,
//     pub id: Ident,
//     pub members: Vec<TsEnumMember>,
// }
//
// #[ast_node("TsEnumMember")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsEnumMember {
//     pub span: Span,
//     pub id: TsEnumMemberId,
//     #[serde(default)]
//     pub init: Option<Box<Expr>>,
// }
//
// ///
// /// - Invalid: [Ident] with empty symbol.
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsEnumMemberId {
//     #[tag("Identifier")]
//     Ident(Ident),
//
//     #[tag("StringLiteral")]
//     Str(Str),
// }
//
// #[ast_node("TsModuleDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsModuleDecl {
//     pub span: Span,
//     pub declare: bool,
//     /// In TypeScript, this is only available through`node.flags`.
//     pub global: bool,
//     pub id: TsModuleName,
//     #[serde(default)]
//     pub body: Option<TsNamespaceBody>,
// }
//
// /// `namespace A.B { }` is a namespace named `A` with another TsNamespaceDecl as
// /// its body.
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsNamespaceBody {
//     #[tag("TsModuleBlock")]
//     TsModuleBlock(TsModuleBlock),
//
//     #[tag("TsNamespaceDeclaration")]
//     TsNamespaceDecl(TsNamespaceDecl),
// }
//
// #[ast_node("TsModuleBlock")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsModuleBlock {
//     pub span: Span,
//     pub body: Vec<ModuleItem>,
// }
//
// #[ast_node("TsNamespaceDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsNamespaceDecl {
//     pub span: Span,
//     pub declare: bool,
//     /// In TypeScript, this is only available through`node.flags`.
//     pub global: bool,
//     pub id: Ident,
//     pub body: Box<TsNamespaceBody>,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsModuleName {
//     #[tag("Identifier")]
//     Ident(Ident),
//
//     #[tag("StringLiteral")]
//     Str(Str),
// }
//
// #[ast_node("TsImportEqualsDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsImportEqualsDecl {
//     pub span: Span,
//     pub declare: bool,
//     pub is_export: bool,
//     pub id: Ident,
//     pub module_ref: TsModuleRef,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum TsModuleRef {
//     #[tag("TsQualifiedName")]
//     #[tag("Identifier")]
//     TsEntityName(TsEntityName),
//
//     #[tag("TsExternalModuleReference")]
//     TsExternalModuleRef(TsExternalModuleRef),
// }
//
// #[ast_node("TsExternalModuleReference")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsExternalModuleRef {
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: Str,
// }
//
// /// TypeScript's own parser uses ExportAssignment for both `export default` and
// /// `export =`. But for @babel/parser, `export default` is an ExportDefaultDecl,
// /// so a TsExportAssignment is always `export =`.
// #[ast_node("TsExportAssignment")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsExportAssignment {
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: Box<Expr>,
// }
//
// #[ast_node("TsNamespaceExportDeclaration")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsNamespaceExportDecl {
//     pub span: Span,
//     pub id: Ident,
// }
//
// // // ================
// // // TypeScript exprs
// // // ================
//
// #[ast_node("TsAsExpression")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsAsExpr {
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: Box<Expr>,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[ast_node("TsTypeAssertion")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsTypeAssertion {
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: Box<Expr>,
//     #[serde(rename = "typeAnnotation")]
//     pub type_ann: Box<TsType>,
// }
//
// #[ast_node("TsNonNullExpression")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsNonNullExpr {
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: Box<Expr>,
// }
//

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


// #[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize, Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum Accessibility {
//     #[serde(rename = "public")]
//     Public,
//     #[serde(rename = "protected")]
//     Protected,
//     #[serde(rename = "private")]
//     Private,
// }
//
// #[ast_node("TsConstAssertion")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct TsConstAssertion {
//     pub span: Span,
//     pub expr: Box<Expr>,
// }
