use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::ast_serde;

use crate::{
    class::ClassMethodKind,
    common::{Access, BaseNode, Decorator, IdOrRest, IdOrString, Identifier, Noop, Param},
    expr::Expression,
    lit::{BigIntLiteral, BooleanLiteral, NumericLiteral, StringLiteral},
    object::ObjectKey,
    pat::AssignmentPattern,
    stmt::Statement,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSTypeElement {
    #[tag("TSCallSignatureDeclaration")]
    CallSignatureDecl(TSCallSignatureDeclaration),
    #[tag("TSConstructSignatureDeclaration")]
    ConstructSignatureDecl(TSConstructSignatureDeclaration),
    #[tag("TSPropertySignature")]
    PropSignature(TSPropertySignature),
    #[tag("TSMethodSignature")]
    MethodSignature(TSMethodSignature),
    #[tag("TSIndexSignature")]
    IndexSignature(TSIndexSignature),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSType {
    #[tag("TSAnyKeyword")]
    AnyKeyword(TSAnyKeyword),
    #[tag("TSBooleanKeyword")]
    BooleanKeyword(TSBooleanKeyword),
    #[tag("TSBigIntKeyword")]
    BigIntKeyword(TSBigIntKeyword),
    #[tag("TSIntrinsicKeyword")]
    IntrinsicKeyword(TSIntrinsicKeyword),
    #[tag("TSNeverKeyword")]
    NeverKeyword(TSNeverKeyword),
    #[tag("TSNullKeyword")]
    NullKeyword(TSNullKeyword),
    #[tag("TSNumberKeyword")]
    NumberKeyword(TSNumberKeyword),
    #[tag("TSObjectKeyword")]
    ObjectKeyword(TSObjectKeyword),
    #[tag("TSStringKeyword")]
    StringKeyword(TSStringKeyword),
    #[tag("TSSymbolKeyword")]
    SymbolKeyword(TSSymbolKeyword),
    #[tag("TSUndefinedKeyword")]
    UndefinedKeyword(TSUndefinedKeyword),
    #[tag("TSUnknownKeyword")]
    UnknownKeyword(TSUnknownKeyword),
    #[tag("TSVoidKeyword")]
    VoidKeyword(TSVoidKeyword),
    #[tag("TSThisType")]
    This(TSThisType),
    #[tag("TSFunctionType")]
    Function(TSFunctionType),
    #[tag("TSConstructorType")]
    Constructor(TSConstructorType),
    #[tag("TSTypeReference")]
    TypeRef(TSTypeReference),
    #[tag("TSTypePredicate")]
    TypePredicate(TSTypePredicate),
    #[tag("TSTypeQuery")]
    TypeQuery(TSTypeQuery),
    #[tag("TSTypeLiteral")]
    TypeLiteral(TSTypeLiteral),
    #[tag("TSArrayType")]
    Array(TSArrayType),
    #[tag("TSTupleType")]
    Tuple(TSTupleType),
    #[tag("TSOptionalType")]
    Optional(TSOptionalType),
    #[tag("TSRestType")]
    Rest(TSRestType),
    #[tag("TSUnionType")]
    Union(TSUnionType),
    #[tag("TSIntersectionType")]
    Intersection(TSIntersectionType),
    #[tag("TSConditionalType")]
    Conditional(TSConditionalType),
    #[tag("TSInferType")]
    Infer(TSInferType),
    #[tag("TSParenthesizedType")]
    Parenthesized(TSParenthesizedType),
    #[tag("TSTypeOperator")]
    TypeOp(TSTypeOperator),
    #[tag("TSIndexedAccessType")]
    IndexedAccess(TSIndexedAccessType),
    #[tag("TSMappedType")]
    Mapped(TSMappedType),
    #[tag("TSLiteralType")]
    Literal(TSLiteralType),
    #[tag("TSExpressionWithTypeArguments")]
    ExprWithArgs(TSExpressionWithTypeArguments),
    #[tag("TSImportType")]
    Import(TSImportType),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSBaseType {
    #[tag("TSAnyKeyword")]
    Any(TSAnyKeyword),
    #[tag("TSBooleanKeyword")]
    Boolean(TSBooleanKeyword),
    #[tag("TSBigIntKeyword")]
    BigInt(TSBigIntKeyword),
    #[tag("TSIntrinsicKeyword")]
    Intrinsic(TSIntrinsicKeyword),
    #[tag("TSNeverKeyword")]
    Never(TSNeverKeyword),
    #[tag("TSNullKeyword")]
    Null(TSNullKeyword),
    #[tag("TSNumberKeyword")]
    Number(TSNumberKeyword),
    #[tag("TSObjectKeyword")]
    Object(TSObjectKeyword),
    #[tag("TSStringKeyword")]
    String(TSStringKeyword),
    #[tag("TSSymbolKeyword")]
    Symbol(TSSymbolKeyword),
    #[tag("TSUndefinedKeyword")]
    Undefined(TSUndefinedKeyword),
    #[tag("TSUnknownKeyword")]
    Unknown(TSUnknownKeyword),
    #[tag("TSVoidKeyword")]
    Void(TSVoidKeyword),
    #[tag("TSThisType")]
    This(TSThisType),
    #[tag("TSLiteralType")]
    Literal(TSLiteralType),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSParamPropParam {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("AssignmentPattern")]
    Assignment(AssignmentPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSParameterProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub parameter: TSParamPropParam,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSFuncDeclTypeParams {
    #[tag("TSTypeParameterDeclaration")]
    Type(TSTypeParameterDeclaration),
    #[tag("Noop")]
    Noop(Noop),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSFuncDeclTypeAnnot {
    #[tag("TSTypeAnnotation")]
    Type(Box<TSTypeAnnotation>),
    #[tag("Noop")]
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSDeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub type_parameters: Option<TSFuncDeclTypeParams>,
    #[serde(default)]
    pub params: Vec<Param>,
    #[serde(default)]
    pub return_type: Option<TSFuncDeclTypeAnnot>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub generator: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSDeclareMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    pub key: ObjectKey,
    #[serde(default)]
    pub type_parameters: Option<TSFuncDeclTypeParams>,
    #[serde(default)]
    pub params: Vec<Param>,
    #[serde(default)]
    pub return_type: Option<TSFuncDeclTypeAnnot>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub access: Option<Access>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSQualifiedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: Box<TSEntityName>,
    pub right: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSCallSignatureDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConstructSignatureDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSPropertySignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: Box<Expression>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMethodSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: Box<Expression>,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub parameters: Vec<Identifier>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSAnyKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSBooleanKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSBigIntKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSIntrinsicKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSNeverKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSNullKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSNumberKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSObjectKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSStringKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSSymbolKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSUndefinedKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSUnknownKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSVoidKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSThisType {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSFunctionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConstructorType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSEntityName {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("TSQualifiedName")]
    Qualified(TSQualifiedName),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_name: TSEntityName,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSTypePredicateParamName {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("TSThisType")]
    This(TSThisType),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypePredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub parameter_name: TSTypePredicateParamName,
    #[serde(default)]
    pub type_annotation: Option<Box<TSTypeAnnotation>>,
    #[serde(default)]
    pub asserts: Option<bool>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSTypeQueryExprName {
    #[tag("Identifier")]
    #[tag("TSQualifiedName")]
    EntityName(TSEntityName),
    #[tag("TSImportType")]
    ImportType(TSImportType),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeQuery {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expr_name: TSTypeQueryExprName,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSTypeLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSArrayType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: Box<TSType>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSTupleTypeElType {
    #[tag("TSNamedTupleMember")]
    Member(TSNamedTupleMember),
    #[tag("*")]
    TSType(TSType),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTupleType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub element_types: Vec<TSTupleTypeElType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSOptionalType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSRestType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSNamedTupleMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub label: Identifier,
    pub element_type: TSType,
    #[serde(default)]
    pub optional: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSUnionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSIntersectionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSConditionalType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub check_type: Box<TSType>,
    pub extends_type: Box<TSType>,
    pub true_type: Box<TSType>,
    pub false_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInferType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_parameter: Box<TSTypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSParenthesizedType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeOperator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
    #[serde(default)]
    pub operator: JsWord,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexedAccessType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object_type: Box<TSType>,
    pub index_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMappedType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_parameter: Box<TSTypeParameter>,
    #[serde(default)]
    pub type_annotation: Option<Box<TSType>>,
    #[serde(default)]
    pub name_type: Option<Box<TSType>>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSLiteralTypeLiteral {
    #[tag("NumericLiteral")]
    Numeric(NumericLiteral),
    #[tag("StringLiteral")]
    String(StringLiteral),
    #[tag("BooleanLiteral")]
    Boolean(BooleanLiteral),
    #[tag("BigIntLiteral")]
    BigInt(BigIntLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSLiteralType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub literal: TSLiteralTypeLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSExpressionWithTypeArguments {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: TSEntityName,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInterfaceDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub extends: Option<TSExpressionWithTypeArguments>,
    pub body: TSInterfaceBody,
    #[serde(default)]
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSInterfaceBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAliasDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    pub type_annotation: TSType,
    #[serde(default)]
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSAsExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAssertion {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSEnumDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub members: Vec<TSEnumMember>,
    #[serde(default, rename = "const")]
    pub is_const: Option<bool>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub initializer: Option<Box<Expression>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSEnumMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    #[serde(default)]
    pub initializer: Option<Box<Expression>>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSModuleDeclBody {
    #[tag("TSModuleBlock")]
    Block(TSModuleBlock),
    #[tag("TSModuleDeclaration")]
    Decl(TSModuleDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSModuleDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub body: Box<TSModuleDeclBody>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub global: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSModuleBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSImportType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: StringLiteral,
    #[serde(default)]
    pub qualifier: Option<TSEntityName>,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum TSImportEqualsDeclModuleRef {
    #[tag("Identifier")]
    #[tag("TSQualifiedName")]
    Name(TSEntityName),
    #[tag("TSExternalModuleReference")]
    External(TSExternalModuleReference),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSImportEqualsDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub module_reference: TSImportEqualsDeclModuleRef,
    #[serde(default)]
    pub is_export: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct TSExternalModuleReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSNonNullExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSExportAssignment {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSNamespaceExportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSTypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSTypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<TSTypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TSTypeParameter {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub constraint: Option<Box<TSType>>,
    #[serde(default)]
    pub default: Option<Box<TSType>>,
    #[serde(default)]
    pub name: JsWord,

    #[serde(default, rename = "in")]
    pub is_in: bool,
    #[serde(default, rename = "out")]
    pub is_out: bool,
    #[serde(default, rename = "const")]
    pub is_const: bool,
}
