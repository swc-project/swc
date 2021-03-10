use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{BaseNode, Identifier, IdOrQualifiedId, IdOrString},
    expr::{TypeCastExpression},
    module::{ExportKind, ExportSpecifier, ExportNamespaceSpecifier},
    lit::{StringLiteral},
    stmt::{BlockStatement},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Flow {
    AnyTypeAnnotation(AnyTypeAnnotation),
    ArrayTypeAnnotation(ArrayTypeAnnotation),
    BooleanTypeAnnotation(BooleanTypeAnnotation),
    BooleanLiteralTypeAnnotation(BooleanLiteralTypeAnnotation),
    NullLiteralTypeAnnotation(NullLiteralTypeAnnotation),
    ClassImplements(ClassImplements),
    DeclareClass(DeclareClass),
    DeclareFunction(DeclareFunction),
    DeclareInterface(DeclareInterface),
    DeclareModule(DeclareModule),
    DeclareModuleExports(DeclareModuleExports),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareOpaqueType(DeclareOpaqueType),
    DeclareVariable(DeclareVariable),
    DeclareExportDeclaration(DeclareExportDeclaration),
    DeclareExportAllDeclaration(DeclareExportAllDeclaration),
    DeclaredPredicate(DeclaredPredicate),
    ExistsTypeAnnotation(ExistsTypeAnnotation),
    FunctionTypeAnnotation(FunctionTypeAnnotation),
    FunctionTypeParam(FunctionTypeParam),
    GenericTypeAnnotation(GenericTypeAnnotation),
    InferredPredicate(InferredPredicate),
    InterfaceExtends(InterfaceExtends),
    InterfaceDeclaration(InterfaceDeclaration),
    InterfaceTypeAnnotation(InterfaceTypeAnnotation),
    IntersectionTypeAnnotation(IntersectionTypeAnnotation),
    MixedTypeAnnotation(MixedTypeAnnotation),
    EmptyTypeAnnotation(EmptyTypeAnnotation),
    NullableTypeAnnotation(NullableTypeAnnotation),
    NumberLiteralTypeAnnotation(NumberLiteralTypeAnnotation),
    NumberTypeAnnotation(NumberTypeAnnotation),
    ObjectTypeAnnotation(ObjectTypeAnnotation),
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    ObjectTypeIndexer(ObjectTypeIndexer),
    ObjectTypeProperty(ObjectTypeProperty),
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
    OpaqueType(OpaqueType),
    QualifiedTypeIdentifier(QualifiedTypeIdentifier),
    StringLiteralTypeAnnotation(StringLiteralTypeAnnotation),
    StringTypeAnnotation(StringTypeAnnotation),
    SymbolTypeAnnotation(SymbolTypeAnnotation),
    ThisTypeAnnotation(ThisTypeAnnotation),
    TupleTypeAnnotation(TupleTypeAnnotation),
    TypeofTypeAnnotation(TypeofTypeAnnotation),
    TypeAlias(TypeAlias),
    TypeAnnotation(TypeAnnotation),
    TypeCastExpression(TypeCastExpression),
    TypeParameter(TypeParameter),
    TypeParameterDeclaration(TypeParameterDeclaration),
    TypeParameterInstantiation(TypeParameterInstantiation),
    UnionTypeAnnotation(UnionTypeAnnotation),
    Variance(Variance),
    VoidTypeAnnotation(VoidTypeAnnotation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowType {
    #[serde(rename = "AnyTypeAnnotation")]
    Any(AnyTypeAnnotation),
    #[serde(rename = "ArrayTypeAnnotation")]
    Array(ArrayTypeAnnotation),
    #[serde(rename = "BooleanTypeAnnotation")]
    Boolean(BooleanTypeAnnotation),
    #[serde(rename = "BooleanLiteralTypeAnnotation")]
    BooleanLiteral(BooleanLiteralTypeAnnotation),
    #[serde(rename = "NullLiteralTypeAnnotation")]
    NullLiteral(NullLiteralTypeAnnotation),
    #[serde(rename = "ExistsTypeAnnotation")]
    Exists(ExistsTypeAnnotation),
    #[serde(rename = "FunctionTypeAnnotation")]
    Function(FunctionTypeAnnotation),
    #[serde(rename = "GenericTypeAnnotation")]
    Generic(GenericTypeAnnotation),
    #[serde(rename = "InterfaceTypeAnnotation")]
    Interface(InterfaceTypeAnnotation),
    #[serde(rename = "IntersectionTypeAnnotation")]
    Intersection(IntersectionTypeAnnotation),
    #[serde(rename = "MixedTypeAnnotation")]
    Mixed(MixedTypeAnnotation),
    #[serde(rename = "EmptyTypeAnnotation")]
    Empty(EmptyTypeAnnotation),
    #[serde(rename = "NullableTypeAnnotation")]
    Nullable(NullableTypeAnnotation),
    #[serde(rename = "NumberLiteralTypeAnnotation")]
    NumerLiteral(NumberLiteralTypeAnnotation),
    #[serde(rename = "NumberTypeAnnotation")]
    Number(NumberTypeAnnotation),
    #[serde(rename = "ObjectTypeAnnotation")]
    Object(ObjectTypeAnnotation),
    #[serde(rename = "StringLiteralTypeAnnotation")]
    StringLiteral(StringLiteralTypeAnnotation),
    #[serde(rename = "StringTypeAnnotation")]
    String(StringTypeAnnotation),
    #[serde(rename = "SymbolTypeAnnotation")]
    Symbol(SymbolTypeAnnotation),
    #[serde(rename = "ThisTypeAnnotation")]
    This(ThisTypeAnnotation),
    #[serde(rename = "TupleTypeAnnotation")]
    Tuple(TupleTypeAnnotation),
    #[serde(rename = "TypeofTypeAnnotation")]
    Typeof(TypeofTypeAnnotation),
    #[serde(rename = "UnionTypeAnnotation")]
    Union(UnionTypeAnnotation),
    #[serde(rename = "VoidTypeAnnotation")]
    Void(VoidTypeAnnotation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowBaseAnnotation {
    #[serde(rename = "AnyTypeAnnotation")]
    Any(AnyTypeAnnotation),
    #[serde(rename = "BooleanTypeAnnotation")]
    Boolean(BooleanTypeAnnotation),
    #[serde(rename = "NullLiteralTypeAnnotation")]
    NullLiteral(NullLiteralTypeAnnotation),
    #[serde(rename = "MixedTypeAnnotation")]
    Mixed(MixedTypeAnnotation),
    #[serde(rename = "EmptyTypeAnnotation")]
    Empty(EmptyTypeAnnotation),
    #[serde(rename = "NumberTypeAnnotation")]
    Number(NumberTypeAnnotation),
    #[serde(rename = "StringTypeAnnotation")]
    String(StringTypeAnnotation),
    #[serde(rename = "SymbolTypeAnnotation")]
    Symbol(SymbolTypeAnnotation),
    #[serde(rename = "ThisTypeAnnotation")]
    This(ThisTypeAnnotation),
    #[serde(rename = "VoidTypeAnnotation")]
    Void(VoidTypeAnnotation),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowDeclaration {
    #[serde(rename = "DeclareClass")]
    Class(DeclareClass),
    #[serde(rename = "DeclareFunction")]
    Func(DeclareFunction),
    #[serde(rename = "DeclareInterface")]
    Interface(DeclareInterface),
    #[serde(rename = "DeclareModule")]
    Module(DeclareModule),
    #[serde(rename = "DeclareModuleExports")]
    ModuleExports(DeclareModuleExports),
    DeclareTypeAlias(DeclareTypeAlias),
    DeclareOpaqueType(DeclareOpaqueType),
    #[serde(rename = "DeclareVariable")]
    Var(DeclareVariable),
    #[serde(rename = "DeclareExportAllDeclaration")]
    ExportDecl(DeclareExportDeclaration),
    #[serde(rename = "DeclareExportAllDeclaration")]
    ExportAllDecl(DeclareExportAllDeclaration),
    InterfaceDeclaration(InterfaceDeclaration),
    OpaqueType(OpaqueType),
    TypeAlias(TypeAlias),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FlowPredicate {
    DeclaredPredicate(DeclaredPredicate),
    InferredPredicate(InferredPredicate),
}


#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct TypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct AnyTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ArrayTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub element_type: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BooleanTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct BooleanLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NullLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ExistsTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct FunctionTypeParam {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: Option<Identifier>,
    pub type_annotation: Box<FlowType>,
    #[serde(default)]
    pub optional: Option<bool>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameterDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<TypeParameter>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PlusOrMinus {
    Plus,
    Minus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct Variance {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: PlusOrMinus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeParameterInstantiation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub params: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct GenericTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceExtends {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrQualifiedId,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ObjectTypePropKind {
    Init,
    Get,
    Set,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeSpreadProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: FlowType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ObjectTypeAnnotProp {
    #[serde(rename = "ObjectTypeProperty")]
    Prop(ObjectTypeProperty),
    #[serde(rename = "ObjectTypeSpreadProperty")]
    Spread(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ObjectTypeCallProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: FlowType,
    #[serde(rename = "static")]
    pub is_static: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct InterfaceTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(flatten)]
    pub extends: Option<Vec<InterfaceExtends>>,
    pub body: ObjectTypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct IntersectionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(flatten)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct MixedTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct EmptyTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct NullableTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NumberLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct NumberTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StringLiteralTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct StringTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct SymbolTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ThisTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TupleTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct TypeofTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct UnionTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub types: Vec<FlowType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct VoidTypeAnnotation {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassImplements {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub type_parameters: Option<TypeParameterInstantiation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareClass {
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
    #[serde(default)]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareFunction {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub predicate: Option<Box<DeclaredPredicate>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    #[serde(default)]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleKind {
    #[serde(rename = "CommonJS")]
    CommonJs,
    #[serde(rename = "ES")]
    Es,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareModule {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: IdOrString,
    pub body: BlockStatement,
    #[serde(default)]
    pub kind: Option<ModuleKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareModuleExports {
    #[serde(flatten)]
    pub base: BaseNode,
    pub type_annotation: TypeAnnotation,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclareVariable {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum DeclareExportDeclSpecifier {
    #[serde(rename = "ExportSpecifier")]
    Export(ExportSpecifier),
    #[serde(rename = "ExportNamespaceSpecifier")]
    Namespace(ExportNamespaceSpecifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct DeclareExportAllDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub source: StringLiteral,
    #[serde(default)]
    pub export_kind: Option<ExportKind>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct DeclaredPredicate {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: Box<Flow>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct InferredPredicate {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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
    #[serde(default)]
    pub mixins: Option<Vec<InterfaceExtends>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct QualifiedTypeIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub qualification: Box<IdOrQualifiedId>,
}
