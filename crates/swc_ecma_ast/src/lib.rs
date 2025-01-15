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

pub use num_bigint::BigInt as BigIntValue;
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};
use swc_common::{ast_node, pass::Either, util::take::Take, EqIgnoreSpan, Span};

pub use self::{
    class::{
        AutoAccessor, Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, Key,
        MethodKind, PrivateMethod, PrivateProp, StaticBlock,
    },
    decl::{ClassDecl, Decl, FnDecl, UsingDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::*,
    function::{Function, Param, ParamOrTsParamProp},
    ident::{
        unsafe_id, unsafe_id_from_ident, BindingIdent, EsReserved, Id, Ident, IdentName,
        PrivateName, UnsafeId,
    },
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

/// A map from the [Program] to the [Program].
///
/// This trait is used to implement transformations. The implementor may decide
/// to implement [Fold] or [VisitMut] if the transform is fine to start from an
/// arbitrary node.
///
/// Tuple of [Pass] implementations also implements [Pass], but it's limited to
/// 12 items for fast compile time. If you have more passes, nest it like `(a,
/// (b, c), (d, e))`
pub trait Pass {
    fn process(&mut self, program: &mut Program);
}

/// Optional pass implementation.
impl<P> Pass for Option<P>
where
    P: Pass,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program) {
        if let Some(pass) = self {
            pass.process(program);
        }
    }
}

impl<P: ?Sized> Pass for Box<P>
where
    P: Pass,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program) {
        (**self).process(program);
    }
}

impl<P: ?Sized> Pass for &'_ mut P
where
    P: Pass,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program) {
        (**self).process(program);
    }
}

impl<L, R> Pass for Either<L, R>
where
    L: Pass,
    R: Pass,
{
    #[inline]
    fn process(&mut self, program: &mut Program) {
        match self {
            Either::Left(l) => l.process(program),
            Either::Right(r) => r.process(program),
        }
    }
}

impl<P> Pass for swc_visit::Optional<P>
where
    P: Pass,
{
    #[inline]
    fn process(&mut self, program: &mut Program) {
        if self.enabled {
            self.visitor.process(program);
        }
    }
}

impl<P> Pass for swc_visit::Repeat<P>
where
    P: Pass + swc_visit::Repeated,
{
    #[inline]
    fn process(&mut self, program: &mut Program) {
        loop {
            self.pass.reset();
            self.pass.process(program);

            if !self.pass.changed() {
                break;
            }
        }
    }
}

impl Program {
    #[inline(always)]
    pub fn mutate<P>(&mut self, mut pass: P)
    where
        P: Pass,
    {
        pass.process(self);
    }

    #[inline(always)]
    pub fn apply<P>(mut self, mut pass: P) -> Self
    where
        P: Pass,
    {
        pass.process(&mut self);
        self
    }
}

macro_rules! impl_pass_for_tuple {
    (
        [$idx:tt, $name:ident], $([$idx_rest:tt, $name_rest:ident]),*
    ) => {
        impl<$name, $($name_rest),*> Pass for ($name, $($name_rest),*)
        where
            $name: Pass,
            $($name_rest: Pass),*
        {
            #[inline]
            fn process(&mut self, program: &mut Program) {
                self.$idx.process(program);

                $(
                    self.$idx_rest.process(program);
                )*

            }
        }
    };
}

impl_pass_for_tuple!([0, A], [1, B]);
impl_pass_for_tuple!([0, A], [1, B], [2, C]);
impl_pass_for_tuple!([0, A], [1, B], [2, C], [3, D]);
impl_pass_for_tuple!([0, A], [1, B], [2, C], [3, D], [4, E]);
impl_pass_for_tuple!([0, A], [1, B], [2, C], [3, D], [4, E], [5, F]);
impl_pass_for_tuple!([0, A], [1, B], [2, C], [3, D], [4, E], [5, F], [6, G]);
impl_pass_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H]
);
impl_pass_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I]
);
impl_pass_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J]
);
impl_pass_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J],
    [10, K]
);
impl_pass_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J],
    [10, K],
    [11, L]
);
impl_pass_for_tuple!(
    [0, A],
    [1, B],
    [2, C],
    [3, D],
    [4, E],
    [5, F],
    [6, G],
    [7, H],
    [8, I],
    [9, J],
    [10, K],
    [11, L],
    [12, M]
);

#[inline(always)]
pub fn noop_pass() -> impl Pass {
    fn noop(_: &mut Program) {}

    fn_pass(noop)
}

#[inline(always)]
pub fn fn_pass(f: impl FnMut(&mut Program)) -> impl Pass {
    FnPass { f }
}

struct FnPass<F> {
    f: F,
}

impl<F> Pass for FnPass<F>
where
    F: FnMut(&mut Program),
{
    fn process(&mut self, program: &mut Program) {
        (self.f)(program);
    }
}

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
#[cfg_attr(feature = "serde", derive(Serialize))]
#[cfg_attr(feature = "serde", serde(rename_all = "lowercase"))]
pub enum EsVersion {
    Es3,
    #[default]
    Es5,
    Es2015,
    Es2016,
    Es2017,
    Es2018,
    Es2019,
    Es2020,
    Es2021,
    Es2022,
    Es2023,
    Es2024,
    EsNext,
}

#[cfg(feature = "serde")]
impl<'de> Deserialize<'de> for EsVersion {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use serde::de::Error;

        let s = String::deserialize(deserializer)?;
        match s.to_lowercase().as_str() {
            "es3" => Ok(EsVersion::Es3),
            "es5" => Ok(EsVersion::Es5),
            "es2015" | "es6" => Ok(EsVersion::Es2015),
            "es2016" => Ok(EsVersion::Es2016),
            "es2017" => Ok(EsVersion::Es2017),
            "es2018" => Ok(EsVersion::Es2018),
            "es2019" => Ok(EsVersion::Es2019),
            "es2020" => Ok(EsVersion::Es2020),
            "es2021" => Ok(EsVersion::Es2021),
            "es2022" => Ok(EsVersion::Es2022),
            "es2023" => Ok(EsVersion::Es2023),
            "es2024" => Ok(EsVersion::Es2024),
            "esnext" => Ok(EsVersion::EsNext),
            _ => Err(D::Error::custom(format!("Unknown ES version: {}", s))),
        }
    }
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
    ident::{ArchivedBindingIdent, ArchivedIdent, ArchivedIdentName, ArchivedPrivateName},
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
    module::{ArchivedModule, ArchivedModuleItem, ArchivedProgram, ArchivedScript},
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
