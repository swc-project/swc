use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::ast_serde;

use crate::{
    common::{BaseNode, IdOrQualifiedId, IdOrString, Identifier},
    expr::TypeCastExpression,
    lit::StringLiteral,
    module::{ExportKind, ExportNamespaceSpecifier, ExportSpecifier},
    stmt::BlockStatement,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Flow {
    #[tag("AnyTypeAnnotation")]
    AnyTypeAnnotation(AnyTypeAnnotation),
    #[tag("ArrayTypeAnnotation")]
    ArrayTypeAnnotation(ArrayTypeAnnotation),
    #[tag("BooleanTypeAnnotation")]
    BooleanTypeAnnotation(BooleanTypeAnnotation),
    #[tag("BooleanLiteralTypeAnnotation")]
    BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    #[tag("NullLiteralTypeAnnotation")]
    NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    #[tag("ClassImplements")]
    ClassImplements(ClassImplements),
    #[tag("DeclareClass")]
    DeclareClass(DeclareClass),
    #[tag("DeclareFunction")]
    DeclareFunction(DeclareFunction),
    #[tag("DeclareInterface")]
    DeclareInterface(DeclareInterface),
    #[tag("DeclareModule")]
    DeclareModule(DeclareModule),
    #[tag("DeclareModuleExports")]
    DeclareModuleExports(DeclareModuleExports),
    #[tag("DeclareTypeAlias")]
    DeclareTypeAlias(DeclareTypeAlias),
    #[tag("DeclareOpaqueType")]
    DeclareOpaqueType(DeclareOpaqueType),
    #[tag("DeclareVariable")]
    DeclareVariable(DeclareVariable),
    #[tag("DeclareExportDeclaration")]
    DeclareExportDeclaration(DeclareExportDeclaration),
    #[tag("DeclareExportAllDeclaration")]
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    #[tag("DeclaredPredicate")]
    DeclaredPredicate(DeclaredPredicate),
    #[tag("ExistsTypeAnnotation")]
    ExistsTypeAnnotation(ExistsTypeAnnotation),
    #[tag("FunctionTypeAnnotation")]
    FunctionTypeAnnotation(FunctionTypeAnnotation),
    #[tag("FunctionTypeParam")]
    FunctionTypeParam(FunctionTypeParam),
    #[tag("GenericTypeAnnotation")]
    GenericTypeAnnotation(GenericTypeAnnotation),
    #[tag("InferredPredicate")]
    InferredPredicate(InferredPredicate),
    #[tag("InterfaceExtends")]
    InterfaceExtends(InterfaceExtends),
    #[tag("InterfaceDeclaration")]
    InterfaceDeclaration(InterfaceDeclaration),
    #[tag("InterfaceTypeAnnotation")]
    InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    #[tag("IntersectionTypeAnnotation")]
    IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    #[tag("MixedTypeAnnotation")]
    MixedTypeAnnotation(MixedTypeAnnotation),
    #[tag("EmptyTypeAnnotation")]
    EmptyTypeAnnotation(EmptyTypeAnnotation),
    #[tag("NullableTypeAnnotation")]
    NullableTypeAnnotation(NullableTypeAnnotation),
    #[tag("NumberLiteralTypeAnnotation")]
    NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    #[tag("NumberTypeAnnotation")]
    NumberTypeAnnotation(NumberTypeAnnotation),
    #[tag("ObjectTypeAnnotation")]
    ObjectTypeAnnotation(ObjectTypeAnnotation),
    #[tag("ObjectTypeInternalSlot")]
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    #[tag("ObjectTypeCallProperty")]
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    #[tag("ObjectTypeIndexer")]
    ObjectTypeIndexer(ObjectTypeIndexer),
    #[tag("ObjectTypeProperty")]
    ObjectTypeProperty(ObjectTypeProperty),
    #[tag("ObjectTypeSpreadProperty")]
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    #[tag("OpaqueType")]
    OpaqueType(OpaqueType),
    #[tag("QualifiedTypeIdentifier")]
    QualifiedTypeIdentifier(QualifiedTypeIdentifier),
    #[tag("StringLiteralTypeAnnotation")]
    StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    #[tag("StringTypeAnnotation")]
    StringTypeAnnotation(StringTypeAnnotation),
    #[tag("SymbolTypeAnnotation")]
    SymbolTypeAnnotation(SymbolTypeAnnotation),
    #[tag("ThisTypeAnnotation")]
    ThisTypeAnnotation(ThisTypeAnnotation),
    #[tag("TupleTypeAnnotation")]
    TupleTypeAnnotation(TupleTypeAnnotation),
    #[tag("TypeofTypeAnnotation")]
    TypeofTypeAnnotation(TypeofTypeAnnotation),
    #[tag("TypeAlias")]
    TypeAlias(TypeAlias),
    #[tag("TypeAnnotation")]
    TypeAnnotation(TypeAnnotation),
    #[tag("TypeCastExpression")]
    TypeCastExpression(TypeCastExpression),
    #[tag("TypeParameter")]
    TypeParameter(TypeParameter),
    #[tag("TypeParameterDeclaration")]
    TypeParameterDeclaration(TypeParameterDeclaration),
    #[tag("TypeParameterInstantiation")]
    TypeParameterInstantiation(TypeParameterInstantiation),
    #[tag("UnionTypeAnnotation")]
    UnionTypeAnnotation(UnionTypeAnnotation),
    #[tag("Variance")]
    Variance(Variance),
    #[tag("VoidTypeAnnotation")]
    VoidTypeAnnotation(VoidTypeAnnotation),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum FlowType {
    #[tag("AnyTypeAnnotation")]
    Any(AnyTypeAnnotation),
    #[tag("ArrayTypeAnnotation")]
    Array(ArrayTypeAnnotation),
    #[tag("BooleanTypeAnnotation")]
    Boolean(BooleanTypeAnnotation),
    #[tag("BooleanLiteralTypeAnnotation")]
    BooleanLiteral(BooleanLiteralTypeAnnotation),
    #[tag("NullLiteralTypeAnnotation")]
    NullLiteral(NullLiteralTypeAnnotation),
    #[tag("ExistsTypeAnnotation")]
    Exists(ExistsTypeAnnotation),
    #[tag("FunctionTypeAnnotation")]
    Function(FunctionTypeAnnotation),
    #[tag("GenericTypeAnnotation")]
    Generic(GenericTypeAnnotation),
    #[tag("InterfaceTypeAnnotation")]
    Interface(InterfaceTypeAnnotation),
    #[tag("IntersectionTypeAnnotation")]
    Intersection(IntersectionTypeAnnotation),
    #[tag("MixedTypeAnnotation")]
    Mixed(MixedTypeAnnotation),
    #[tag("EmptyTypeAnnotation")]
    Empty(EmptyTypeAnnotation),
    #[tag("NullableTypeAnnotation")]
    Nullable(NullableTypeAnnotation),
    #[tag("NumberLiteralTypeAnnotation")]
    NumerLiteral(NumberLiteralTypeAnnotation),
    #[tag("NumberTypeAnnotation")]
    Number(NumberTypeAnnotation),
    #[tag("ObjectTypeAnnotation")]
    Object(ObjectTypeAnnotation),
    #[tag("StringLiteralTypeAnnotation")]
    StringLiteral(StringLiteralTypeAnnotation),
    #[tag("StringTypeAnnotation")]
    String(StringTypeAnnotation),
    #[tag("SymbolTypeAnnotation")]
    Symbol(SymbolTypeAnnotation),
    #[tag("ThisTypeAnnotation")]
    This(ThisTypeAnnotation),
    #[tag("TupleTypeAnnotation")]
    Tuple(TupleTypeAnnotation),
    #[tag("TypeofTypeAnnotation")]
    Typeof(TypeofTypeAnnotation),
    #[tag("UnionTypeAnnotation")]
    Union(UnionTypeAnnotation),
    #[tag("VoidTypeAnnotation")]
    Void(VoidTypeAnnotation),
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde]
pub enum FlowBaseAnnotation {
    #[tag("AnyTypeAnnotation")]
    Any(AnyTypeAnnotation),
    #[tag("BooleanTypeAnnotation")]
    Boolean(BooleanTypeAnnotation),
    #[tag("NullLiteralTypeAnnotation")]
    NullLiteral(NullLiteralTypeAnnotation),
    #[tag("MixedTypeAnnotation")]
    Mixed(MixedTypeAnnotation),
    #[tag("EmptyTypeAnnotation")]
    Empty(EmptyTypeAnnotation),
    #[tag("NumberTypeAnnotation")]
    Number(NumberTypeAnnotation),
    #[tag("StringTypeAnnotation")]
    String(StringTypeAnnotation),
    #[tag("SymbolTypeAnnotation")]
    Symbol(SymbolTypeAnnotation),
    #[tag("ThisTypeAnnotation")]
    This(ThisTypeAnnotation),
    #[tag("VoidTypeAnnotation")]
    Void(VoidTypeAnnotation),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum FlowDeclaration {
    #[tag("DeclareClass")]
    Class(DeclareClass),
    #[tag("DeclareFunction")]
    Func(DeclareFunction),
    #[tag("DeclareInterface")]
    Interface(DeclareInterface),
    #[tag("DeclareModule")]
    Module(DeclareModule),
    #[tag("DeclareModuleExports")]
    ModuleExports(DeclareModuleExports),
    #[tag("DeclareTypeAlias")]
    DeclareTypeAlias(DeclareTypeAlias),
    #[tag("DeclareOpaqueType")]
    DeclareOpaqueType(DeclareOpaqueType),
    #[tag("DeclareVariable")]
    Var(DeclareVariable),
    #[tag("DeclareExportDeclaration")]
    ExportDecl(DeclareExportDeclaration),
    #[tag("DeclareExportAllDeclaration")]
    ExportAllDecl(DeclareExportAllDeclaration),
    #[tag("InterfaceDeclaration")]
    InterfaceDeclaration(InterfaceDeclaration),
    #[tag("OpaqueType")]
    OpaqueType(OpaqueType),
    #[tag("TypeAlias")]
    TypeAlias(TypeAlias),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum FlowPredicate {
    #[tag("DeclaredPredicate")]
    DeclaredPredicate(DeclaredPredicate),
    #[tag("InferredPredicate")]
    InferredPredicate(InferredPredicate),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct AnyTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ArrayTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct BooleanTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct BooleanLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct NullLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct ExistsTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionTypeParam {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: Option<Identifier>,
    pub type_annotation: Box<FlowType>,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub params: Vec<FunctionTypeParam>,
    #[serde(default)]
    pub rest: Option<Box<FunctionTypeParam>>,
    pub return_type: Box<FlowType>,
    #[serde(default)]
    pub optional: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<TypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum PlusOrMinus {
    Plus,
    Minus,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct Variance {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: PlusOrMinus,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TypeParameter {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub bound: Option<TypeAnnotation>,
    #[serde(default)]
    pub default: Option<FlowType>,
    #[serde(default)]
    pub variance: Option<Variance>,
    #[serde(default)]
    pub name: JsWord,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct GenericTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceExtends {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ObjectTypePropKind {
    Init,
    Get,
    Set,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ObjectTypeProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: IdOrString,
    pub value: FlowType,
    #[serde(default)]
    pub variance: Option<Variance>,
    pub kind: ObjectTypePropKind,
    #[serde(default)]
    pub method: bool,
    #[serde(default)]
    pub optional: bool,
    #[serde(default)]
    pub proto: bool,
    #[serde(default, rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ObjectTypeSpreadProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: FlowType,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectTypeAnnotProp {
    #[tag("ObjectTypeProperty")]
    Prop(ObjectTypeProperty),
    #[tag("ObjectTypeSpreadProperty")]
    Spread(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ObjectTypeIndexer {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    pub key: FlowType,
    pub value: FlowType,
    #[serde(default)]
    pub variance: Option<Variance>,
    #[serde(default, rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ObjectTypeCallProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: FlowType,
    #[serde(rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct ObjectTypeInternalSlot {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub value: FlowType,
    #[serde(default)]
    pub optional: bool,
    #[serde(default, rename = "static")]
    pub is_static: bool,
    #[serde(default)]
    pub method: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub properties: Vec<ObjectTypeAnnotProp>,
    #[serde(default)]
    pub indexers: Option<Vec<ObjectTypeIndexer>>,
    #[serde(default)]
    pub call_properties: Option<Vec<ObjectTypeCallProperty>>,
    #[serde(default)]
    pub internal_slots: Option<Vec<ObjectTypeInternalSlot>>,
    #[serde(default)]
    pub exact: bool,
    #[serde(default)]
    pub inexact: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(flatten)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct IntersectionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(flatten)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct MixedTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct EmptyTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct NullableTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct NumberLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct NumberTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct StringLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: JsWord,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct StringTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct SymbolTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct ThisTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TupleTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct TypeofTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct UnionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct VoidTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct OpaqueType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub supertype: Option<FlowType>,
    pub impltype: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareOpaqueType {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub supertype: Option<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeAlias {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    pub right: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassImplements {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareClass {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TypeParameterInstantiation>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub implements: Option<Vec<ClassImplements>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub predicate: Option<Box<DeclaredPredicate>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareInterface {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
    #[serde(default)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    #[serde(default)]
    pub implements: Option<Vec<ClassImplements>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ModuleKind {
    #[serde(rename = "CommonJS")]
    CommonJs,
    #[serde(rename = "ES")]
    Es,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DeclareModule {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub body: BlockStatement,
    #[serde(default)]
    pub kind: Option<ModuleKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareModuleExports {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareTypeAlias {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    pub right: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DeclareVariable {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum DeclareExportDeclSpecifier {
    #[tag("ExportSpecifier")]
    Export(ExportSpecifier),
    #[tag("ExportNamespaceSpecifier")]
    Namespace(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DeclareExportDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub declaration: Option<Box<Flow>>,
    #[serde(default)]
    pub specifiers: Option<Vec<DeclareExportDeclSpecifier>>,
    #[serde(default)]
    pub source: Option<StringLiteral>,
    #[serde(default)]
    pub default: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    #[serde(default)]
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct DeclaredPredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: Box<Flow>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type")]
pub struct InferredPredicate {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterDeclaration>,
    #[serde(default)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
    #[serde(default)]
    pub implements: Option<Vec<ClassImplements>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
pub struct QualifiedTypeIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub qualification: Box<IdOrQualifiedId>,
}
