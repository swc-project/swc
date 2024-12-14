pub use num_bigint::BigInt as BigIntValue;
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};
use swc_allocator::arena::{Allocator, Box};
use swc_common::{
    arena::{ast_node, Take},
    pass::Either,
    EqIgnoreSpan, Span,
};

pub use self::{
    class::{
        AutoAccessor, Class, ClassMember, ClassMethod, ClassProp, Constructor, Decorator, Key,
        MethodKind, PrivateMethod, PrivateProp, StaticBlock,
    },
    decl::{ClassDecl, Decl, FnDecl, UsingDecl, VarDecl, VarDeclKind, VarDeclarator},
    expr::*,
    function::{Function, Param, ParamOrTsParamProp},
    ident::{BindingIdent, EsReserved, Id, Ident, IdentName, PrivateName},
    jsx::{
        JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXClosingElement, JSXClosingFragment,
        JSXElement, JSXElementChild, JSXElementName, JSXEmptyExpr, JSXExpr, JSXExprContainer,
        JSXFragment, JSXMemberExpr, JSXNamespacedName, JSXObject, JSXOpeningElement,
        JSXOpeningFragment, JSXSpreadChild, JSXText,
    },
    lit::{BigInt, Bool, Lit, Null, Number, Regex, Str},
    module::{Module, ModuleItem, Program, Script},
    module_decl::{
        DefaultDecl, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
        ExportDefaultSpecifier, ExportNamedSpecifier, ExportNamespaceSpecifier, ExportSpecifier,
        ImportDecl, ImportDefaultSpecifier, ImportNamedSpecifier, ImportPhase, ImportSpecifier,
        ImportStarAsSpecifier, ModuleDecl, ModuleExportName, NamedExport,
    },
    pat::{
        ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, RestPat,
    },
    prop::{
        AssignProp, ComputedPropName, GetterProp, KeyValueProp, MethodProp, Prop, PropName,
        SetterProp,
    },
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
pub use super::{
    list::ListFormat,
    operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
    source_map::{SourceMapperExt, SpanExt},
};

mod class;
mod decl;
mod expr;
mod function;
mod ident;
mod jsx;
mod lit;
mod module;
mod module_decl;
mod pat;
mod prop;
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
pub trait Pass<'a> {
    fn process(&mut self, program: &mut Program<'a>);
}

/// Optional pass implementation.
impl<'a, P> Pass<'a> for Option<P>
where
    P: Pass<'a>,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program<'a>) {
        if let Some(pass) = self {
            pass.process(program);
        }
    }
}

impl<'a, P: ?Sized> Pass<'a> for Box<'a, P>
where
    P: Pass<'a>,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program<'a>) {
        (**self).process(program);
    }
}

impl<'a, P: ?Sized> Pass<'a> for &'_ mut P
where
    P: Pass<'a>,
{
    #[inline(always)]
    fn process(&mut self, program: &mut Program<'a>) {
        (**self).process(program);
    }
}

impl<'a, L, R> Pass<'a> for Either<L, R>
where
    L: Pass<'a>,
    R: Pass<'a>,
{
    #[inline]
    fn process(&mut self, program: &mut Program<'a>) {
        match self {
            Either::Left(l) => l.process(program),
            Either::Right(r) => r.process(program),
        }
    }
}

impl<'a, P> Pass<'a> for swc_visit::Optional<P>
where
    P: Pass<'a>,
{
    #[inline]
    fn process(&mut self, program: &mut Program<'a>) {
        if self.enabled {
            self.visitor.process(program);
        }
    }
}

impl<'a, P> Pass<'a> for swc_visit::Repeat<P>
where
    P: Pass<'a> + swc_visit::Repeated,
{
    #[inline]
    fn process(&mut self, program: &mut Program<'a>) {
        loop {
            self.pass.reset();
            self.pass.process(program);

            if !self.pass.changed() {
                break;
            }
        }
    }
}

impl<'a> Program<'a> {
    #[inline(always)]
    pub fn mutate<P>(&mut self, mut pass: P)
    where
        P: Pass<'a>,
    {
        pass.process(self);
    }

    #[inline(always)]
    pub fn apply<P>(mut self, mut pass: P) -> Self
    where
        P: Pass<'a>,
    {
        pass.process(&mut self);
        self
    }
}

macro_rules! impl_pass_for_tuple {
    (
        [$idx:tt, $name:ident], $([$idx_rest:tt, $name_rest:ident]),*
    ) => {
        impl<'a, $name, $($name_rest),*> Pass<'a> for ($name, $($name_rest),*)
        where
            $name: Pass<'a>,
            $($name_rest: Pass<'a>),*
        {
            #[inline]
            fn process(&mut self, program: &mut Program<'a>) {
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
pub fn noop_pass<'a>() -> impl Pass<'a> {
    fn noop(_: &mut Program<'_>) {}

    fn_pass(noop)
}

#[inline(always)]
pub fn fn_pass<'a>(f: impl FnMut(&mut Program<'a>)) -> impl Pass<'a> {
    FnPass { f }
}

struct FnPass<F> {
    f: F,
}

impl<'a, F> Pass<'a> for FnPass<F>
where
    F: FnMut(&mut Program<'a>),
{
    fn process(&mut self, program: &mut Program<'a>) {
        (self.f)(program);
    }
}

/// Represents a invalid node.
#[ast_node("Invalid")]
#[derive(Eq, Default, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Invalid {
    pub span: Span,
}

impl<'a> Take<'a> for Invalid {
    fn dummy(_: &'a Allocator) -> Self {
        Invalid::default()
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
#[cfg(feature = "rkyv-impl")]
#[doc(hidden)]
pub use super::operators::{ArchivedAssignOp, ArchivedBinaryOp, ArchivedUnaryOp, ArchivedUpdateOp};
