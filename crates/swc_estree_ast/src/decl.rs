use serde::{Deserialize, Serialize};
use swc_common::ast_serde;

use crate::{
    class::ClassDeclaration,
    common::{BaseNode, Identifier, LVal, Param, TypeAnnotOrNoop, TypeParamDeclOrNoop},
    expr::{Expression, FunctionExpression},
    flow::{
        DeclareClass, DeclareExportAllDeclaration, DeclareExportDeclaration, DeclareFunction,
        DeclareInterface, DeclareModule, DeclareModuleExports, DeclareOpaqueType, DeclareTypeAlias,
        DeclareVariable, InterfaceDeclaration, OpaqueType, TypeAlias,
    },
    lit::{BooleanLiteral, NumericLiteral, StringLiteral},
    module::{
        ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ImportDeclaration,
    },
    stmt::BlockStatement,
    typescript::{
        TSDeclareFunction, TSEnumDeclaration, TSInterfaceDeclaration, TSModuleDeclaration,
        TSTypeAliasDeclaration,
    },
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Declaration {
    #[tag("FunctionDeclaration")]
    FuncDecl(FunctionDeclaration),
    #[tag("VariableDeclaration")]
    VarDecl(VariableDeclaration),
    #[tag("ClassDeclaration")]
    ClassDecl(ClassDeclaration),
    #[tag("ExportAllDeclaration")]
    ExportAllDecl(ExportAllDeclaration),
    #[tag("ExportDefaultDeclaration")]
    ExportDefaultDecl(ExportDefaultDeclaration),
    #[tag("ExportNamedDeclaration")]
    ExportNamedDecl(ExportNamedDeclaration),
    #[tag("ImportDeclaration")]
    ImportDecl(ImportDeclaration),
    #[tag("DeclareClass")]
    DeclClass(DeclareClass),
    #[tag("DeclareFunction")]
    DeclFunc(DeclareFunction),
    #[tag("DeclareInterface")]
    DeclInterface(DeclareInterface),
    #[tag("DeclareModule")]
    DeclModule(DeclareModule),
    #[tag("DeclareModuleExports")]
    DeclModuleExports(DeclareModuleExports),
    #[tag("DeclareTypeAlias")]
    DeclTypeAlias(DeclareTypeAlias),
    #[tag("DeclareOpaqueType")]
    DeclOpaqueType(DeclareOpaqueType),
    #[tag("DeclareVariable")]
    DeclVar(DeclareVariable),
    #[tag("DeclareExportDeclaration")]
    DeclExportDecl(DeclareExportDeclaration),
    #[tag("DeclareExportAllDeclaration")]
    DeclExportAllDecl(DeclareExportAllDeclaration),
    #[tag("InterfaceDeclaration")]
    InterfaceDecl(InterfaceDeclaration),
    #[tag("OpaqueType")]
    OpaqueType(OpaqueType),
    #[tag("TypeAlias")]
    TypeAlias(TypeAlias),
    #[tag("EnumDeclaration")]
    EnumDecl(EnumDeclaration),
    #[tag("TSDeclareFunction")]
    TSDeclFunc(TSDeclareFunction),
    #[tag("TSInterfaceDeclaration")]
    TSInterfaceDecl(TSInterfaceDeclaration),
    #[tag("TSTypeAliasDeclaration")]
    TSTypeAliasDecl(TSTypeAliasDeclaration),
    #[tag("TSEnumDeclaration")]
    TSEnumDecl(TSEnumDeclaration),
    #[tag("TSModuleDeclaration")]
    TSModuleDecl(TSModuleDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum VariableDeclarationKind {
    Var,
    Let,
    Const,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("VariableDeclarator")]
pub struct VariableDeclarator {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: LVal,
    #[serde(default)]
    pub init: Option<Box<Expression>>,
    #[serde(
        default,
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub definite: Option<bool>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("VariableDeclaration")]
pub struct VariableDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: VariableDeclarationKind,
    #[serde(default)]
    pub declarations: Vec<VariableDeclarator>,
    #[serde(
        default,
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub declare: Option<bool>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("FunctionDeclaration")]
pub struct FunctionDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub id: Option<Identifier>,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::ser::skip_expression_for_fn")]
    pub expression: bool,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

impl From<FunctionExpression> for FunctionDeclaration {
    fn from(expr: FunctionExpression) -> Self {
        FunctionDeclaration {
            base: expr.base,
            id: expr.id,
            params: expr.params,
            body: expr.body,
            generator: expr.generator,
            is_async: expr.is_async,
            expression: false,
            return_type: expr.return_type,
            type_parameters: expr.type_parameters,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumBooleanMember")]
pub struct EnumBooleanMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub init: BooleanLiteral,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumNumberMember")]
pub struct EnumNumberMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub init: NumericLiteral,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumStringMember")]
pub struct EnumStringMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub init: StringLiteral,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum EnumStringBodyMember {
    #[tag("EnumStringBodyMember")]
    String(EnumStringMember),
    #[tag("EnumDefaultedMember")]
    Defaulted(EnumDefaultedMember),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumDefaultedMember")]
pub struct EnumDefaultedMember {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum EnumMember {
    #[tag("EnumBooleanMember")]
    Boolean(EnumBooleanMember),
    #[tag("EnumNumberMember")]
    Number(EnumNumberMember),
    #[tag("EnumStringMember")]
    String(EnumStringMember),
    #[tag("EnumDefaultedMember")]
    Defaulted(EnumDefaultedMember),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumBooleanBody")]
pub struct EnumBooleanBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumBooleanMember>,
    #[serde(default)]
    pub explicit_type: bool,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumNumberBody")]
pub struct EnumNumberBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumNumberMember>,
    #[serde(default)]
    pub explicit_type: bool,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumStringBody")]
pub struct EnumStringBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumStringBodyMember>,
    #[serde(default)]
    pub explicit_type: bool,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumSymbolBody")]
pub struct EnumSymbolBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub members: Vec<EnumDefaultedMember>,
    #[serde(default)]
    pub has_unknown_members: bool,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum EnumBody {
    #[tag("EnumBooleanBody")]
    Boolean(EnumBooleanBody),
    #[tag("EnumNumberBody")]
    Number(EnumNumberBody),
    #[tag("EnumStringBody")]
    String(EnumStringBody),
    #[tag("EnumSymbolBody")]
    Symbol(EnumSymbolBody),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("EnumDeclaration")]
pub struct EnumDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    pub body: EnumBody,
}
