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

#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

pub use self::{
    class::{
        AutoAccessor, Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, Key,
        MethodKind, PrivateMethod, PrivateProp, StaticBlock,
    },
    decl::{ClassDecl, Decl, FnDecl, UsingDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::*,
    function::{Function, Param, ParamOrTsParamProp},
    ident::{BindingIdent, EsReserved, Id, Ident, PrivateName},
    jsx::{
        JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement, JSXClosingFragment,
        JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr, JSXExprContainer,
        JSXFragment, JSXMemberExpr, JSXNamespacedName, JSXObject, JSXOpeningElement,
        JSXOpeningFragment, JSXSpreadChild, JSXText,
    },
    list::ListFormat,
    lit::{BigInt, Bool, Lit, Null, Number, Regex, Str},
    module::{Module, ModuleItem, Program, Script},
    module_decl::{
        DefaultDecl, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
        ExportDefaultSpecifier, ExportNamedSpecifier, ExportNamespaceSpecifier, ExportSpecifier,
        ImportDecl, ImportDefaultSpecifier, ImportNamedSpecifier, ImportPhase, ImportSpecifier,
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
        ExprStmt, ForHead, ForInStmt, ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt, Stmt,
        SwitchCase, SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr, WhileStmt, WithStmt,
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
        TsParenthesizedType, TsPropertySignature, TsQualifiedName, TsRestType, TsSatisfiesExpr,
        TsSetterSignature, TsThisType, TsThisTypeOrIdent, TsTplLitType, TsTupleElement,
        TsTupleType, TsType, TsTypeAliasDecl, TsTypeAnn, TsTypeAssertion, TsTypeElement, TsTypeLit,
        TsTypeOperator, TsTypeOperatorOp, TsTypeParam, TsTypeParamDecl, TsTypeParamInstantiation,
        TsTypePredicate, TsTypeQuery, TsTypeQueryExpr, TsTypeRef, TsUnionOrIntersectionType,
        TsUnionType,
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
#[derive(Eq, Default, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Invalid {
    pub span: Span,
}

impl Take for Invalid {
    fn dummy() -> Self {
        Invalid::default()
    }
}

/// Note: This type implements `Serailize` and `Deserialize` if `serde` is
/// enabled, instead of requiring `serde-impl` feature.
#[derive(Debug, Default, Clone, Copy, PartialOrd, Ord, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
pub enum EsVersion {
    #[cfg_attr(feature = "serde", serde(rename = "es3", alias = "ES3"))]
    Es3,
    #[cfg_attr(feature = "serde", serde(rename = "es5", alias = "ES5"))]
    #[default]
    Es5,
    #[cfg_attr(
        feature = "serde",
        serde(rename = "es2015", alias = "ES2015", alias = "ES6", alias = "es6")
    )]
    Es2015,
    #[cfg_attr(feature = "serde", serde(rename = "es2016", alias = "ES2016"))]
    Es2016,
    #[cfg_attr(feature = "serde", serde(rename = "es2017", alias = "ES2017"))]
    Es2017,
    #[cfg_attr(feature = "serde", serde(rename = "es2018", alias = "ES2018"))]
    Es2018,
    #[cfg_attr(feature = "serde", serde(rename = "es2019", alias = "ES2019"))]
    Es2019,
    #[cfg_attr(feature = "serde", serde(rename = "es2020", alias = "ES2020"))]
    Es2020,
    #[cfg_attr(feature = "serde", serde(rename = "es2021", alias = "ES2021"))]
    Es2021,
    #[cfg_attr(feature = "serde", serde(rename = "es2022", alias = "ES2022"))]
    Es2022,
    #[cfg_attr(feature = "serde", serde(rename = "esnext", alias = "EsNext"))]
    EsNext,
}

impl EsVersion {
    pub const fn latest() -> Self {
        EsVersion::EsNext
    }
}

/// Warning: The particular implementation of serialization and deserialization
/// of the ast nodes may change in the future, and so these types would be
/// removed. It's safe to say they will be serializable in some form or another,
/// but not necessarily with these specific types underlying the implementation.
/// As such, *use these types at your own risk*.
#[cfg(feature = "rkyv-impl")]
#[doc(hidden)]
pub use self::{
    class::{
        ArchivedAutoAccessor, ArchivedClass, ArchivedClassMember, ArchivedClassMethod,
        ArchivedClassProp, ArchivedConstructor, ArchivedDecorator, ArchivedKey, ArchivedMethodKind,
        ArchivedPrivateMethod, ArchivedPrivateProp, ArchivedStaticBlock,
    },
    decl::{
        ArchivedClassDecl, ArchivedDecl, ArchivedFnDecl, ArchivedUsingDecl, ArchivedVarDecl,
        ArchivedVarDeclKind, ArchivedVarDeclarator,
    },
    expr::{
        ArchivedArrayLit, ArchivedArrowExpr, ArchivedAssignExpr, ArchivedAssignTarget,
        ArchivedAwaitExpr, ArchivedBinExpr, ArchivedBlockStmtOrExpr, ArchivedCallExpr,
        ArchivedCallee, ArchivedClassExpr, ArchivedCondExpr, ArchivedExpr, ArchivedExprOrSpread,
        ArchivedFnExpr, ArchivedImport, ArchivedMemberExpr, ArchivedMemberProp,
        ArchivedMetaPropExpr, ArchivedMetaPropKind, ArchivedNewExpr, ArchivedObjectLit,
        ArchivedOptCall, ArchivedOptChainBase, ArchivedOptChainExpr, ArchivedParenExpr,
        ArchivedPropOrSpread, ArchivedSeqExpr, ArchivedSpreadElement, ArchivedSuper,
        ArchivedSuperProp, ArchivedSuperPropExpr, ArchivedTaggedTpl, ArchivedThisExpr, ArchivedTpl,
        ArchivedTplElement, ArchivedUnaryExpr, ArchivedUpdateExpr, ArchivedYieldExpr,
    },
    function::{ArchivedFunction, ArchivedParam, ArchivedParamOrTsParamProp},
    ident::{ArchivedBindingIdent, ArchivedIdent, ArchivedPrivateName},
    jsx::{
        ArchivedJSXAttr, ArchivedJSXAttrName, ArchivedJSXAttrOrSpread, ArchivedJSXAttrValue,
        ArchivedJSXClosingElement, ArchivedJSXClosingFragment, ArchivedJSXElement,
        ArchivedJSXElementChild, ArchivedJSXElementName, ArchivedJSXEmptyExpr, ArchivedJSXExpr,
        ArchivedJSXExprContainer, ArchivedJSXFragment, ArchivedJSXMemberExpr,
        ArchivedJSXNamespacedName, ArchivedJSXObject, ArchivedJSXOpeningElement,
        ArchivedJSXOpeningFragment, ArchivedJSXSpreadChild, ArchivedJSXText,
    },
    lit::{
        ArchivedBigInt, ArchivedBool, ArchivedLit, ArchivedNull, ArchivedNumber, ArchivedRegex,
        ArchivedStr,
    },
    module::{
        ArchivedModule, ArchivedModuleItem, ArchivedProgram, ArchivedReservedUnused, ArchivedScript,
    },
    module_decl::{
        ArchivedDefaultDecl, ArchivedExportAll, ArchivedExportDecl, ArchivedExportDefaultDecl,
        ArchivedExportDefaultExpr, ArchivedExportDefaultSpecifier, ArchivedExportNamedSpecifier,
        ArchivedExportNamespaceSpecifier, ArchivedExportSpecifier, ArchivedImportDecl,
        ArchivedImportDefaultSpecifier, ArchivedImportNamedSpecifier, ArchivedImportSpecifier,
        ArchivedImportStarAsSpecifier, ArchivedModuleDecl, ArchivedModuleExportName,
        ArchivedNamedExport,
    },
    operators::{ArchivedAssignOp, ArchivedBinaryOp, ArchivedUnaryOp, ArchivedUpdateOp},
    pat::{
        ArchivedArrayPat, ArchivedAssignPat, ArchivedAssignPatProp, ArchivedKeyValuePatProp,
        ArchivedObjectPat, ArchivedObjectPatProp, ArchivedPat, ArchivedRestPat,
    },
    prop::{
        ArchivedAssignProp, ArchivedComputedPropName, ArchivedGetterProp, ArchivedKeyValueProp,
        ArchivedMethodProp, ArchivedProp, ArchivedPropName, ArchivedSetterProp,
    },
    stmt::{
        ArchivedBlockStmt, ArchivedBreakStmt, ArchivedCatchClause, ArchivedContinueStmt,
        ArchivedDebuggerStmt, ArchivedDoWhileStmt, ArchivedEmptyStmt, ArchivedExprStmt,
        ArchivedForHead, ArchivedForInStmt, ArchivedForOfStmt, ArchivedForStmt, ArchivedIfStmt,
        ArchivedLabeledStmt, ArchivedReturnStmt, ArchivedStmt, ArchivedSwitchCase,
        ArchivedSwitchStmt, ArchivedThrowStmt, ArchivedTryStmt, ArchivedVarDeclOrExpr,
        ArchivedWhileStmt, ArchivedWithStmt,
    },
    typescript::{
        ArchivedAccessibility, ArchivedTruePlusMinus, ArchivedTsArrayType, ArchivedTsAsExpr,
        ArchivedTsCallSignatureDecl, ArchivedTsConditionalType, ArchivedTsConstAssertion,
        ArchivedTsConstructSignatureDecl, ArchivedTsConstructorType, ArchivedTsEntityName,
        ArchivedTsEnumDecl, ArchivedTsEnumMember, ArchivedTsEnumMemberId,
        ArchivedTsExportAssignment, ArchivedTsExprWithTypeArgs, ArchivedTsExternalModuleRef,
        ArchivedTsFnOrConstructorType, ArchivedTsFnParam, ArchivedTsFnType,
        ArchivedTsGetterSignature, ArchivedTsImportEqualsDecl, ArchivedTsImportType,
        ArchivedTsIndexSignature, ArchivedTsIndexedAccessType, ArchivedTsInferType,
        ArchivedTsInstantiation, ArchivedTsInterfaceBody, ArchivedTsInterfaceDecl,
        ArchivedTsIntersectionType, ArchivedTsKeywordType, ArchivedTsKeywordTypeKind,
        ArchivedTsLit, ArchivedTsLitType, ArchivedTsMappedType, ArchivedTsMethodSignature,
        ArchivedTsModuleBlock, ArchivedTsModuleDecl, ArchivedTsModuleName, ArchivedTsModuleRef,
        ArchivedTsNamespaceBody, ArchivedTsNamespaceDecl, ArchivedTsNamespaceExportDecl,
        ArchivedTsNonNullExpr, ArchivedTsOptionalType, ArchivedTsParamProp,
        ArchivedTsParamPropParam, ArchivedTsParenthesizedType, ArchivedTsPropertySignature,
        ArchivedTsQualifiedName, ArchivedTsRestType, ArchivedTsSatisfiesExpr,
        ArchivedTsSetterSignature, ArchivedTsThisType, ArchivedTsThisTypeOrIdent,
        ArchivedTsTplLitType, ArchivedTsTupleElement, ArchivedTsTupleType, ArchivedTsType,
        ArchivedTsTypeAliasDecl, ArchivedTsTypeAnn, ArchivedTsTypeAssertion, ArchivedTsTypeElement,
        ArchivedTsTypeLit, ArchivedTsTypeOperator, ArchivedTsTypeOperatorOp, ArchivedTsTypeParam,
        ArchivedTsTypeParamDecl, ArchivedTsTypeParamInstantiation, ArchivedTsTypePredicate,
        ArchivedTsTypeQuery, ArchivedTsTypeQueryExpr, ArchivedTsTypeRef,
        ArchivedTsUnionOrIntersectionType, ArchivedTsUnionType,
    },
};
