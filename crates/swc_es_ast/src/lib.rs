//! Arena-based ECMAScript AST.
//!
//! The nodes in this crate are referenced by typed [`Id`] handles backed by
//! [`swc_arena::Arena`]. This avoids pervasive lifetimes while keeping node
//! references strongly typed.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

#[cfg(feature = "encoding-impl")]
pub extern crate cbor4ii;

pub use swc_arena::Id;

pub use crate::{
    class::{Class, ClassMember, ClassMethod, ClassProp, ClassStaticBlock, MethodKind},
    decl::{
        ClassDecl, Decl, FnDecl, TsEnumDecl, TsEnumMember, TsEnumMemberName, TsInterfaceDecl,
        TsTypeAliasDecl, VarDecl, VarDeclKind, VarDeclarator,
    },
    decorator::Decorator,
    expr::{
        ArrayExpr, ArrowBody, ArrowExpr, AssignExpr, AssignOp, AwaitExpr, BinaryExpr, BinaryOp,
        CallExpr, CondExpr, Expr, ExprOrSpread, MemberExpr, MemberProp, MetaPropExpr, MetaPropKind,
        NewExpr, ObjectExpr, OptChainExpr, ParenExpr, SeqExpr, TaggedTemplateExpr, TemplateExpr,
        UnaryExpr, UnaryOp, UpdateExpr, YieldExpr,
    },
    function::{Function, Param},
    ident::{BindingIdent, Ident},
    jsx::{JSXAttr, JSXElement, JSXElementChild, JSXElementName, JSXOpeningElement},
    lit::{BigIntLit, BoolLit, Lit, NullLit, NumberLit, RegexLit, StrLit},
    module_decl::{
        ExportAllDecl, ExportDecl, ExportDefaultDecl, ExportDefaultExprDecl, ExportNamedDecl,
        ExportSpecifier, ImportAttribute, ImportAttributeName, ImportDecl, ImportDefaultSpecifier,
        ImportNamedSpecifier, ImportNamespaceSpecifier, ImportSpecifier, ModuleDecl,
    },
    operator::UpdateOp,
    pat::{
        ArrayPat, AssignPat, ObjectPat, ObjectPatAssign, ObjectPatKeyValue, ObjectPatProp, Pat,
        RestPat,
    },
    program::{Program, ProgramKind},
    prop::{KeyValueProp, PropName},
    stmt::{
        BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, DoWhileStmt, EmptyStmt,
        ExprStmt, ForBinding, ForClassicHead, ForHead, ForInHead, ForInit, ForOfHead, ForStmt,
        IfStmt, LabeledStmt, ReturnStmt, Stmt, SwitchCase, SwitchStmt, ThrowStmt, TryStmt,
        WhileStmt, WithStmt,
    },
    store::AstStore,
    typescript::{
        TsArrayType, TsAsExpr, TsConditionalType, TsFnParam, TsFnType, TsImportType,
        TsIndexedAccessType, TsInferType, TsIntersectionType, TsKeywordType, TsLitType,
        TsMappedType, TsModuleDecl, TsModuleName, TsNamespaceBody, TsNamespaceDecl, TsNonNullExpr,
        TsParenthesizedType, TsSatisfiesExpr, TsTupleType, TsType, TsTypeAnn, TsTypeLit,
        TsTypeMember, TsTypeMemberKind, TsTypeOperatorOp, TsTypeOperatorType, TsTypeQuery,
        TsTypeRef, TsUnionType,
    },
};

mod class;
mod decl;
mod decorator;
mod expr;
mod function;
mod ident;
mod jsx;
mod lit;
mod module_decl;
mod operator;
mod pat;
mod program;
mod prop;
mod stmt;
mod store;
mod typescript;

/// Id for [`Program`].
pub type ProgramId = Id<Program>;
/// Id for [`Stmt`].
pub type StmtId = Id<Stmt>;
/// Id for [`Decl`].
pub type DeclId = Id<Decl>;
/// Id for [`Pat`].
pub type PatId = Id<Pat>;
/// Id for [`Expr`].
pub type ExprId = Id<Expr>;
/// Id for [`ModuleDecl`].
pub type ModuleDeclId = Id<ModuleDecl>;
/// Id for [`Class`].
pub type ClassId = Id<Class>;
/// Id for [`ClassMember`].
pub type ClassMemberId = Id<ClassMember>;
/// Id for [`Function`].
pub type FunctionId = Id<Function>;
/// Id for [`JSXElement`].
pub type JSXElementId = Id<JSXElement>;
/// Id for [`TsType`].
pub type TsTypeId = Id<TsType>;
