#![deny(unreachable_patterns)]
#![deny(missing_copy_implementations)]
#![deny(missing_debug_implementations)]
#![deny(trivial_casts)]
#![deny(trivial_numeric_casts)]
#![deny(unreachable_pub)]
#![deny(variant_size_differences)]

extern crate enum_kind;
extern crate serde;
#[macro_use]
extern crate string_enum;
#[cfg(test)]
extern crate serde_json;
extern crate swc_atoms;
extern crate swc_common;

pub use self::{
    class::{
        Class, ClassMember, ClassMethod, ClassProp, ClassProperty, Constructor, Decorator, Method,
        MethodKind, PrivateMethod, PrivateProp,
    },
    decl::{ClassDecl, Decl, FnDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::{
        ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BlockStmtOrExpr, CallExpr, ClassExpr,
        CondExpr, Expr, ExprOrSpread, ExprOrSuper, FnExpr, MemberExpr, MetaPropExpr, NewExpr,
        ObjectLit, ParenExpr, PatOrExpr, PropOrSpread, SeqExpr, SpreadElement, TaggedTpl, ThisExpr,
        Tpl, TplElement, UnaryExpr, UpdateExpr, YieldExpr,
    },
    function::{Function, PatOrTsParamProp},
    ident::{Ident, IdentExt, PrivateName},
    jsx::{
        JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement, JSXClosingFragment,
        JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr, JSXExprContainer,
        JSXFragment, JSXMemberExpr, JSXNamespacedName, JSXObject, JSXOpeningElement,
        JSXOpeningFragment, JSXSpreadChild, JSXText,
    },
    lit::{Bool, Lit, Null, Number, Regex, RegexFlags, Str},
    module::{Module, ModuleItem, Script},
    module_decl::{
        DefaultExportSpecifier, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
        ExportSpecifier, ImportDecl, ImportDefault, ImportSpecific, ImportSpecifier, ImportStarAs,
        ModuleDecl, NamedExport, NamedExportSpecifier, NamespaceExportSpecifier,
    },
    operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
    pat::{
        ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, RestPat,
    },
    prop::{AssignProp, GetterProp, KeyValueProp, MethodProp, Prop, PropName, SetterProp},
    stmt::{
        BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, DoWhileStmt, EmptyStmt,
        ForInStmt, ForOfStmt, ForStmt, IfStmt, LabeledStmt, ReturnStmt, Stmt, SwitchCase,
        SwitchStmt, ThrowStmt, TryStmt, VarDeclOrExpr, VarDeclOrPat, WhileStmt, WithStmt,
    },
    typescript::{
        Accessibility, TruePlusMinus, TsArrayType, TsAsExpr, TsCallSignatureDecl,
        TsConditionalType, TsConstructSignatureDecl, TsConstructorType, TsEntityName, TsEnumDecl,
        TsEnumMember, TsEnumMemberId, TsExportAssignment, TsExprWithTypeArgs, TsExternalModuleRef,
        TsFnOrConstructorType, TsFnParam, TsFnType, TsImportEqualsDecl, TsIndexSignature,
        TsIndexedAccessType, TsInferType, TsInterfaceBody, TsInterfaceDecl, TsIntersectionType,
        TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsMappedType, TsMethodSignature,
        TsModuleBlock, TsModuleDecl, TsModuleName, TsModuleRef, TsNamespaceBody, TsNamespaceDecl,
        TsNamespaceExportDecl, TsNonNullExpr, TsOptionalType, TsParamProp, TsParamPropParam,
        TsParenthesizedType, TsPropertySignature, TsQualifiedName, TsRestType, TsSignatureDecl,
        TsThisType, TsThisTypeOrIdent, TsTupleType, TsType, TsTypeAliasDecl, TsTypeAnn,
        TsTypeAssertion, TsTypeCastExpr, TsTypeElement, TsTypeLit, TsTypeOperator,
        TsTypeOperatorOp, TsTypeParam, TsTypeParamDecl, TsTypeParamInstantiation, TsTypePredicate,
        TsTypeQuery, TsTypeRef, TsUnionOrIntersectionType, TsUnionType,
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
mod lit;
mod module;
mod module_decl;
mod operators;
mod pat;
mod prop;
mod stmt;
mod typescript;
