#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unreachable_patterns)]
#![deny(missing_copy_implementations)]
#![deny(trivial_casts)]
#![deny(trivial_numeric_casts)]
#![deny(unreachable_pub)]
#![deny(clippy::all)]
#![allow(clippy::enum_variant_names)]
#![allow(clippy::clone_on_copy)]
#![recursion_limit = "1024"]

// #![deny(variant_size_differences)]

use serde::{Deserialize, Serialize};
use swc_common::{ast_node, EqIgnoreSpan, Span};

pub use self::{
    class::{
        Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, MethodKind,
        PrivateMethod, PrivateProp, StaticBlock,
    },
    decl::{ClassDecl, Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::{
        ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BlockStmtOrExpr, CallExpr, Callee,
        ClassExpr, CondExpr, Expr, ExprOrSpread, FnExpr, Import, MemberExpr, MemberProp,
        MetaPropExpr, MetaPropKind, NewExpr, ObjectLit, OptCall, OptChainBase, OptChainExpr,
        ParenExpr, PatOrExpr, PropOrSpread, SeqExpr, SpreadElement, Super, SuperProp,
        SuperPropExpr, TaggedTpl, ThisExpr, Tpl, TplElement, UnaryExpr, UpdateExpr, YieldExpr,
    },
    function::{Function, Param, ParamOrTsParamProp},
    ident::{BindingIdent, Id, Ident, IdentExt, PrivateName},
    jsx::{
        JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement, JSXClosingFragment,
        JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr, JSXExprContainer,
        JSXFragment, JSXMemberExpr, JSXNamespacedName, JSXObject, JSXOpeningElement,
        JSXOpeningFragment, JSXSpreadChild, JSXText,
    },
    list::ListFormat,
    lit::{BigInt, Bool, Lit, Null, Number, Regex, Str},
    module::{Module, ModuleItem, Program, ReservedUnused, Script},
    module_decl::{
        DefaultDecl, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
        ExportDefaultSpecifier, ExportNamedSpecifier, ExportNamespaceSpecifier, ExportSpecifier,
        ImportDecl, ImportDefaultSpecifier, ImportNamedSpecifier, ImportSpecifier,
        ImportStarAsSpecifier, ModuleDecl, ModuleExportName, NamedExport,
    },
    operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
    pat::{
        ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, RestPat,
    },
    prop::{
        AssignProp, ComputedPropName, GetterProp, KeyValueProp, MethodProp, Prop, PropName,
        SetterProp,
    },
    source_map::{SourceMapperExt, SpanExt},
    stmt::{
        BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, DoWhileStmt, EmptyStmt,
        ExprStmt, ForInStmt, ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt, Stmt, SwitchCase,
        SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr, VarDeclOrPat, WhileStmt, WithStmt,
    },
    typescript::{
        Accessibility, TruePlusMinus, TsArrayType, TsAsExpr, TsCallSignatureDecl,
        TsConditionalType, TsConstAssertion, TsConstructSignatureDecl, TsConstructorType,
        TsEntityName, TsEnumDecl, TsEnumMember, TsEnumMemberId, TsExportAssignment,
        TsExprWithTypeArgs, TsExternalModuleRef, TsFnOrConstructorType, TsFnParam, TsFnType,
        TsGetterSignature, TsImportEqualsDecl, TsImportType, TsIndexSignature, TsIndexedAccessType,
        TsInferType, TsInstantiation, TsInterfaceBody, TsInterfaceDecl, TsIntersectionType,
        TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsMappedType, TsMethodSignature,
        TsModuleBlock, TsModuleDecl, TsModuleName, TsModuleRef, TsNamespaceBody, TsNamespaceDecl,
        TsNamespaceExportDecl, TsNonNullExpr, TsOptionalType, TsParamProp, TsParamPropParam,
        TsParenthesizedType, TsPropertySignature, TsQualifiedName, TsRestType, TsSetterSignature,
        TsThisType, TsThisTypeOrIdent, TsTplLitType, TsTupleElement, TsTupleType, TsType,
        TsTypeAliasDecl, TsTypeAnn, TsTypeAssertion, TsTypeElement, TsTypeLit, TsTypeOperator,
        TsTypeOperatorOp, TsTypeParam, TsTypeParamDecl, TsTypeParamInstantiation, TsTypePredicate,
        TsTypeQuery, TsTypeQueryExpr, TsTypeRef, TsUnionOrIntersectionType, TsUnionType,
    },
};

#[macro_use]
mod macros;
mod class;
mod decl;
mod expr;
mod function;
mod ident;
mod jsx;
mod list;
mod lit;
mod module;
mod module_decl;
mod operators;
mod pat;
mod prop;
mod source_map;
mod stmt;
mod typescript;

/// Represents a invalid node.
#[ast_node("Invalid")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Invalid {
    pub span: Span,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialOrd, Ord, PartialEq, Eq, Hash)]
pub enum EsVersion {
    #[serde(rename = "es3")]
    Es3,
    #[serde(rename = "es5")]
    Es5,
    #[serde(rename = "es2015")]
    Es2015,
    #[serde(rename = "es2016")]
    Es2016,
    #[serde(rename = "es2017")]
    Es2017,
    #[serde(rename = "es2018")]
    Es2018,
    #[serde(rename = "es2019")]
    Es2019,
    #[serde(rename = "es2020")]
    Es2020,
    #[serde(rename = "es2021")]
    Es2021,
    #[serde(rename = "es2022")]
    Es2022,
}

impl EsVersion {
    /// Get the latest version. This is `es2022` for now, but it will be changed
    /// if a new version of specification is released.
    pub const fn latest() -> Self {
        EsVersion::Es2022
    }
}

impl Default for EsVersion {
    fn default() -> Self {
        EsVersion::Es5
    }
}
