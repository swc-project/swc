use crate::{Ident, Str, TsEntityName, TsQualifiedName, TsTypeParamDecl};
use swc_common::{ast_node, Span};
use swc_ecma_ast::{Ident, Str};

#[ast_node]
pub struct JsDoc {
    pub span: Span,

    pub description: Str,
    pub tags: Vec<JsDocTagItem>,
}

/// JsDoc tag with comments.
#[ast_node]
pub struct JsDocTagItem {
    pub span: Span,
    #[serde(rename = "tagName")]
    pub tag_name: Ident,
    #[serde(flatten)]
    pub tag: JsDocTag,
}

#[ast_node]
pub enum JsDocTag {
    #[tag("JsDocUnknownTag")]
    Unknown(JsDocUnknownTag),
    #[tag("JsDocAugmentsTag")]
    Augments(JsDocAugmentsTag),
    #[tag("JsDocImplementsTag")]
    Implements(JsDocImplementsTag),
    #[tag("JsDocAuthorTag")]
    Author(JsDocAuthorTag),
    #[tag("JsDocClassTag")]
    Class(JsDocClassTag),
    #[tag("JsDocPublicTag")]
    Public(JsDocPublicTag),
    #[tag("JsDocPrivateTag")]
    Private(JsDocPrivateTag),
    #[tag("JsDocProtectedTag")]
    Protected(JsDocProtectedTag),
    #[tag("JsDocReadonlyTag")]
    Readonly(JsDocReadonlyTag),
    #[tag("JsDocCallbackTag")]
    Callback(JsDocCallbackTag),
    #[tag("JsDocEnumTag")]
    Enum(JsDocEnumTag),
    #[tag("JsDocParameterTag")]
    Parameter(JsDocParameterTag),
    #[tag("JsDocReturnTag")]
    Return(JsDocReturnTag),
    #[tag("JsDocThisTag")]
    This(JsDocThisTag),
    #[tag("JsDocTypeTag")]
    Type(JsDocTypeTag),
    #[tag("JsDocTemplateTag")]
    Template(JsDocTemplateTag),
    #[tag("JsDocTypedefTag")]
    Typedef(JsDocTypedefTag),
    #[tag("JsDocPropertyTag")]
    Property(JsDocPropertyTag),
}

#[ast_node]
pub struct JsDocUnknownTag {
    pub span: Span,
    pub extras: Str,
}

/// `@extends`, `@augments`
#[ast_node]
pub struct JsDocAugmentsTag {
    pub span: Span,
    pub class: JsDocExprWithTypeArgs,
}

#[ast_node]
pub struct JsDocImplementsTag {
    pub span: Span,
    pub class: JsDocExprWithTypeArgs,
}

#[ast_node]
pub struct JsDocExprWithTypeArgs {
    pub span: Span,

    // TODO parent: HeritageClause | JSDocAugmentsTag | JSDocImplementsTag;
    pub expr: Box<JsDocExpr>,
}

#[ast_node]
pub enum JsDocExpr {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("TsQualifiedName")]
    Property(TsQualifiedName),
}

#[ast_node]
pub struct JsDocAuthorTag {
    pub span: Span,
    /// `<name> [<emailAddress>]`
    pub author: Str,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocClassTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocPublicTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocPrivateTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocProtectedTag {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocReadonlyTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocCallbackTag {
    pub span: Span,
    pub name: Option<Ident>,
    #[serde(rename = "fullName")]
    pub full_name: Option<JsDocNamespaceBody>,
    // TODO: pub type_expr: JSDocSignature;
}

#[ast_node]
pub struct JsDocPropertyTag {
    pub span: Span,

    pub name: TsEntityName,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<JsDocTypeExpr>,
    /// Whether the property name came before the type -- non-standard for
    /// JSDoc, but Typescript-like
    pub is_name_first: bool,
    pub is_bracketed: bool,
}

#[ast_node]
pub struct JsDocParameterTag {
    pub span: Span,

    pub name: TsEntityName,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<JsDocTypeExpr>,
    /// Whether the property name came before the type -- non-standard for
    /// JSDoc, but Typescript-like
    pub is_name_first: bool,
    pub is_bracketed: bool,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocEnumTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocReturnTag {
    pub span: Span,
    #[serde(rename = "typeExpression")]
    type_expr: Option<JsDocTypeExpr>,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocThisTag {
    pub span: Span,
}

#[ast_node]
pub struct JsDocTypeTag {
    pub span: Span,
    #[serde(rename = "typeExpression")]
    pub type_expr: JsDocTypeExpr,
}

#[ast_node]
pub struct JsDocTemplateTag {
    pub span: Span,
    pub constraint: Option<JsDocTypeExpr>,
    #[serde(rename = "typeParameters")]
    pub type_params: Vec<TsTypeParamDecl>,
}

#[ast_node]
pub struct JsDocTypedefTag {
    pub span: Span,
    #[serde(rename = "full_name")]
    pub full_name: Option<JsDocNamespaceBody>,

    pub name: Option<Ident>,
    #[serde(rename = "typeExpression")]
    pub type_expr: Option<JsDocTypeExprOrTypeLit>,
}

#[ast_node]
pub enum JsDocType {
    /// `*`
    #[tag("JsDocAllType")]
    All(JsDocAllType),
    /// `?`
    #[tag("JsDocUnknownType")]
    Unknown(JsDocUnknownType),
    #[tag("JsDocNullableType")]
    Nullable(JsDocNullableType),
    #[tag("JsDocNonNullableType")]
    NonNullable(JsDocNonNullableType),
    #[tag("JsDocOptionalType")]
    Optional(JsDocOptionalType),
    #[tag("JsDocFunctionType")]
    Function(JsDocFunctionType),
    #[tag("JsDocVariadicType")]
    Variadic(JsDocVariadicType),
    // https://jsdoc.app/about-namepaths.html
    #[tag("JsDocNamePathType")]
    NamePath(JsDocNamePathType),
    #[tag("JsDocUnionType")]
    Union(JsDocUnionType),
    #[tag("JsDocParenType")]
    Paren(JsDocParenType),
}

#[ast_node]
pub struct JsDocUnionType {
    pub span: Span,
    pub types: Vec<JsDocType>,
}

#[ast_node]
pub struct JsDocParenType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocAllType {
    pub span: Span,
}

#[ast_node]
#[derive(Copy, Eq)]
pub struct JsDocUnknownType {
    pub span: Span,
}

#[ast_node]
pub struct JsDocNullableType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocNonNullableType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocOptionalType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

/// TODO: Add fields
#[ast_node]
pub struct JsDocFunctionType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocVariadicType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

#[ast_node]
pub struct JsDocNamePathType {
    pub span: Span,
    pub ty: Box<JsDocType>,
}

/// represents a top level: { type } expression in a JSDoc comment.
#[ast_node]
pub struct JsDocTypeExpr {
    pub span: Span,
    pub ty: JsDocType,
}

#[ast_node]
pub struct JsDocNamespaceDecl {
    pub span: Span,
    pub name: Ident,
    pub body: Vec<JsDocNamespaceBody>,
}

#[ast_node]
pub enum JsDocNamespaceBody {
    #[tag("Identifier")]
    Ident(Box<Ident>),
    #[tag("JsDocNamespaceDecl")]
    Decl(Box<JsDocNamespaceDecl>),
}

#[ast_node]
pub enum JsDocTypeExprOrTypeLit {
    #[tag("JsDocTypeExpr")]
    Expr(Box<JsDocTypeExpr>),
    #[tag("JsDocTypeLit")]
    TypeLit(Box<JsDocTypeLit>),
}

#[ast_node]
pub struct JsDocTypeLit {
    pub span: Span,
    pub tags: Vec<JsDocPropOrParam>,
    /// If true, then this type literal represents an *array* of its type.
    pub is_array_type: bool,
}

#[ast_node]
pub enum JsDocPropOrParam {
    #[tag("JsDocPropertyTag")]
    Prop(JsDocPropertyTag),
    #[tag("JsDocParameterTag")]
    Param(JsDocParameterTag),
}
