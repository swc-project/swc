use serde::{Serialize, Deserialize};

use crate::ast::{
    class::{ClassMethodKind},
    common::{BaseNode, Identifier, Access, Param, Decorator, IdOrString, IdOrRest, Noop},
    expr::{Expression},
    lit::{NumericLiteral, StringLiteral, BooleanLiteral, BigIntLiteral},
    object::{ObjectKey},
    pat::{AssignmentPattern},
    stmt::{Statement},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSTypeElement {
    #[serde(rename = "TSCallSignatureDeclaration")]
    CallSignatureDecl(TSCallSignatureDeclaration),
    #[serde(rename = "TSConstructSignatureDeclaration")]
    ConstructSignatureDecl(TSConstructSignatureDeclaration),
    #[serde(rename = "TSPropertySignature")]
    PropSignature(TSPropertySignature),
    #[serde(rename = "TSMethodSignature")]
    MethodSignature(TSMethodSignature),
    #[serde(rename = "TSIndexSignature")]
    IndexSignature(TSIndexSignature),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSType {
    #[serde(rename = "TSAnyKeyword")]
    AnyKeyword(TSAnyKeyword),
    #[serde(rename = "TSBooleanKeyword")]
    BooleanKeyword(TSBooleanKeyword),
    #[serde(rename = "TSBigIntKeyword")]
    BigIntKeyword(TSBigIntKeyword),
    #[serde(rename = "TSIntrinsicKeyword")]
    IntrinsicKeyword(TSIntrinsicKeyword),
    #[serde(rename = "TSNeverKeyword")]
    NeverKeyword(TSNeverKeyword),
    #[serde(rename = "TSNullKeyword")]
    NullKeyword(TSNullKeyword),
    #[serde(rename = "TSNumberKeyword")]
    NumberKeyword(TSNumberKeyword),
    #[serde(rename = "TSObjectKeyword")]
    ObjectKeyword(TSObjectKeyword),
    #[serde(rename = "TSStringKeyword")]
    StringKeyword(TSStringKeyword),
    #[serde(rename = "TSSymbolKeyword")]
    SymbolKeyword(TSSymbolKeyword),
    #[serde(rename = "TSUndefinedKeyword")]
    UndefinedKeyword(TSUndefinedKeyword),
    #[serde(rename = "TSUnknownKeyword")]
    UnknownKeyword(TSUnknownKeyword),
    #[serde(rename = "TSVoidKeyword")]
    VoidKeyword(TSVoidKeyword),
    #[serde(rename = "TSThisType")]
    This(TSThisType),
    #[serde(rename = "TSFunctionType")]
    Function(TSFunctionType),
    #[serde(rename = "TSConstructorType")]
    Constructor(TSConstructorType),
    #[serde(rename = "TSTypeReference")]
    TypeRef(TSTypeReference),
    #[serde(rename = "TSTypePredicate")]
    TypePredicate(TSTypePredicate),
    #[serde(rename = "TSTypeQuery")]
    TypeQuery(TSTypeQuery),
    #[serde(rename = "TSTypeLiteral")]
    TypeLiteral(TSTypeLiteral),
    #[serde(rename = "TSArrayType")]
    Array(TSArrayType),
    #[serde(rename = "TSTupleType")]
    Tuple(TSTupleType),
    #[serde(rename = "TSOptionalType")]
    Optional(TSOptionalType),
    #[serde(rename = "TSRestType")]
    Rest(TSRestType),
    #[serde(rename = "TSUnionType")]
    Union(TSUnionType),
    #[serde(rename = "TSIntersectionType")]
    Intersection(TSIntersectionType),
    #[serde(rename = "TSConditionalType")]
    Conditional(TSConditionalType),
    #[serde(rename = "TSInferType")]
    Infer(TSInferType),
    #[serde(rename = "TSParenthesizedType")]
    Parenthesized(TSParenthesizedType),
    #[serde(rename = "TSTypeOperator")]
    TypeOp(TSTypeOperator),
    #[serde(rename = "TSIndexedAccessType")]
    IndexedAccess(TSIndexedAccessType),
    #[serde(rename = "TSMappedType")]
    Mapped(TSMappedType),
    #[serde(rename = "TSLiteralType")]
    Literal(TSLiteralType),
    #[serde(rename = "TSExpressionWithTypeArguments")]
    ExprWithArgs(TSExpressionWithTypeArguments),
    #[serde(rename = "TSImportType")]
    Import(TSImportType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSBaseType {
    #[serde(rename = "TSAnyKeyword")]
    Any(TSAnyKeyword),
    #[serde(rename = "TSBooleanKeyword")]
    Boolean(TSBooleanKeyword),
    #[serde(rename = "TSBigIntKeyword")]
    BigInt(TSBigIntKeyword),
    #[serde(rename = "TSIntrinsicKeyword")]
    Intrinsic(TSIntrinsicKeyword),
    #[serde(rename = "TSNeverKeyword")]
    Never(TSNeverKeyword),
    #[serde(rename = "TSNullKeyword")]
    Null(TSNullKeyword),
    #[serde(rename = "TSNumberKeyword")]
    Number(TSNumberKeyword),
    #[serde(rename = "TSObjectKeyword")]
    Object(TSObjectKeyword),
    #[serde(rename = "TSStringKeyword")]
    String(TSStringKeyword),
    #[serde(rename = "TSSymbolKeyword")]
    Symbol(TSSymbolKeyword),
    #[serde(rename = "TSUndefinedKeyword")]
    Undefined(TSUndefinedKeyword),
    #[serde(rename = "TSUnknownKeyword")]
    Unknown(TSUnknownKeyword),
    #[serde(rename = "TSVoidKeyword")]
    Void(TSVoidKeyword),
    #[serde(rename = "TSThisType")]
    This(TSThisType),
    #[serde(rename = "TSLiteralType")]
    Literal(TSLiteralType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSParamPropParam {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "AssignmentPattern")]
    Assignment(AssignmentPattern),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSFuncDeclTypeParams {
    #[serde(rename = "TSTypeParameterDeclaration")]
    Type(TSTypeParameterDeclaration),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSFuncDeclTypeAnnot {
    #[serde(rename = "TSTypeAnnotation")]
    Type(TSTypeAnnotation),
    Noop(Noop),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSQualifiedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub left: Box<TSEntityName>,
    pub right: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    pub type_annotation: Option<TSTypeAnnotation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSPropertySignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: Expression,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(default)]
    pub initializer: Option<Expression>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSMethodSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: Expression,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterDeclaration>,
    #[serde(default)]
    pub parameters: Vec<IdOrRest>,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexSignature {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub paramters: Vec<Identifier>,
    #[serde(default)]
    pub type_annotation: Option<TSTypeAnnotation>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSAnyKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSBooleanKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSBigIntKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSIntrinsicKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNeverKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNullKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNumberKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSObjectKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSStringKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSSymbolKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUndefinedKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUnknownKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSVoidKeyword {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSThisType {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSEntityName {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "TSQualifiedName")]
    Qualified(TSQualifiedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_name: TSEntityName,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSTypePredicateParamName {
    #[serde(rename = "Identifier")]
    Id(Identifier),
    #[serde(rename = "TSThisType")]
    This(TSThisType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSTypeQueryExprName {
    #[serde(rename = "TSEntityName")]
    EntityName(TSEntityName),
    #[serde(rename = "TSImportType")]
    ImportType(TSImportType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeQuery {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expr_name: TSTypeQueryExprName,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeLiteral {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSArrayType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSTupleTypeElType {
    TSType(TSType),
    #[serde(rename = "TSNamedTupleMember")]
    Member(TSNamedTupleMember),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTupleType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub element_types: Vec<TSTupleTypeElType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSOptionalType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSRestType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSUnionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSIntersectionType {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSInferType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_parameter: Box<TSTypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSParenthesizedType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeOperator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<TSType>,
    #[serde(default)]
    pub operator: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSIndexedAccessType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object_type: Box<TSType>,
    pub index_type: Box<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSLiteralTypeLiteral {
    #[serde(rename = "NumericLiteral")]
    Numeric(NumericLiteral),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "BooleanLiteral")]
    Boolean(BooleanLiteral),
    #[serde(rename = "BigIntLiteral")]
    BigInt(BigIntLiteral),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSLiteralType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub literal: TSLiteralTypeLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSExpressionWithTypeArguments {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: TSEntityName,
    #[serde(default)]
    pub type_parameters: Option<TSTypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSInterfaceBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<TSTypeElement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSAsExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
    pub type_annotation: TSType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TSTypeAssertion {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TSType,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    pub initializer: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSEnumMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    #[serde(default)]
    pub initializer: Option<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSModuleDeclBody {
    #[serde(rename = "TSModuleBlock")]
    Block(TSModuleBlock),
    #[serde(rename = "TSModuleDeclaration")]
    Decl(TSModuleDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSModuleBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum TSImportEqualsDeclModuleRef {
    #[serde(rename = "TSEntityName")]
    Name(TSEntityName),
    #[serde(rename = "TSExternalModuleReference")]
    External(TSExternalModuleReference),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSExternalModuleReference {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: StringLiteral,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNonNullExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSExportAssignment {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSNamespaceExportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<TSType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub params: Vec<TSTypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TSTypeParameter {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub constraint: Option<Box<TSType>>,
    #[serde(default)]
    pub default: Option<Box<TSType>>,
    #[serde(default)]
    pub name: String,
}
