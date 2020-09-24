//! This crate exists to reduce compile time.
//!
//! The visitor is too slow to compile everytime I make change.
#![deny(unused)]
#![feature(box_syntax)]

pub use self::{
    id::Id,
    visit::{Fold, FoldWith, Node as TypeNode, Visit, VisitMut, VisitMutWith, VisitWith},
};
use fxhash::FxHashMap;
use is_macro::Is;
use num_bigint::BigInt;
use num_traits::Zero;
use std::{
    fmt::Debug,
    iter::FusedIterator,
    mem::transmute,
    sync::{
        atomic::{AtomicUsize, Ordering::SeqCst},
        Arc,
    },
};
use swc_atoms::{js_word, JsWord};
use swc_common::{FromVariant, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::{
    Accessibility, Expr, Ident, MethodKind, Pat, PropName, Str, TruePlusMinus, TsEntityName,
    TsEnumMemberId, TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsNamespaceDecl,
    TsThisType, TsThisTypeOrIdent, TsTypeOperatorOp,
};
use swc_ecma_utils::{
    Value,
    Value::{Known, Unknown},
};

mod convert;
mod id;
mod visit;

#[derive(Debug, Clone, Default, PartialEq)]
pub struct ModuleTypeInfo {
    pub vars: FxHashMap<Id, Box<Type>>,
    pub types: FxHashMap<Id, Vec<Box<Type>>>,
}

impl ModuleTypeInfo {
    pub fn extend(&mut self, other: Self) {
        self.types.extend(other.types);
        self.vars.extend(other.vars);
    }
}

/// This type is expected to stored in a [Box], like `Vec<Box<Type>>`.
#[derive(Debug, Clone, PartialEq, Spanned, FromVariant, Is)]
pub enum Type {
    This(TsThisType),
    Lit(TsLitType),
    Query(QueryType),
    Infer(InferType),
    Import(ImportType),
    Predicate(Predicate),
    IndexedAccessType(IndexedAccessType),

    #[is(name = "ref_type")]
    Ref(Ref),
    TypeLit(TypeLit),
    Keyword(TsKeywordType),
    Conditional(Conditional),
    Tuple(Tuple),
    Array(Array),
    #[is(name = "union_type")]
    Union(Union),
    Intersection(Intersection),
    Function(Function),
    Constructor(Constructor),
    Method(Method),

    Operator(Operator),

    #[is(name = "type_param")]
    Param(TypeParam),
    EnumVariant(EnumVariant),

    Interface(Interface),
    #[is(name = "enum_type")]
    Enum(Enum),

    Mapped(Mapped),

    /// export type A<B> = Foo<B>;
    Alias(Alias),
    Namespace(TsNamespaceDecl),
    Module(Module),

    Class(Class),
    /// Instance of the class.
    ///
    /// This variant is required ([TypeLit] is insufficient) because of codes
    /// like
    ///
    ///
    /// ```ts
    /// class A {
    ///     a: string;
    /// }
    ///
    /// class B {
    ///     a: string;
    ///     b: string;
    /// }
    /// ```
    ClassInstance(ClassInstance),

    /// Used for storing core types.
    ///
    /// Don't match on this directly. Instead, use `.normalize()`.
    #[is(name = "static_type")]
    Static(Static),

    Arc(Arc<Type>),

    Rest(RestType),

    Optional(OptionalType),

    Symbol(Symbol),
}

#[derive(Debug, Clone)]
pub struct SymbolIdGenerator {
    inner: Arc<AtomicUsize>,
}

impl SymbolIdGenerator {
    /// Creates a new symbol id.
    ///
    /// Do **not** mix with symbol ids from other generator.
    pub fn generate(&self) -> SymbolId {
        let id = self.inner.fetch_add(1, SeqCst);

        SymbolId(id)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct SymbolId(usize);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Spanned)]
pub struct Symbol {
    pub span: Span,
    pub value: SymbolId,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct RestType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct OptionalType {
    pub span: Span,
    pub ty: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct IndexedAccessType {
    pub span: Span,
    pub readonly: bool,
    pub obj_type: Box<Type>,
    pub index_type: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Ref {
    pub span: Span,
    pub type_name: TsEntityName,
    pub type_args: Option<TypeParamInstantiation>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct InferType {
    pub span: Span,
    pub type_param: TypeParam,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct QueryType {
    pub span: Span,
    pub expr: QueryExpr,
}

#[derive(Debug, Clone, PartialEq, Spanned, FromVariant)]
pub enum QueryExpr {
    TsEntityName(TsEntityName),
    Import(ImportType),
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct ImportType {
    pub span: Span,
    pub arg: Str,
    pub qualifier: Option<TsEntityName>,
    pub type_params: Option<TypeParamInstantiation>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Module {
    pub span: Span,
    pub exports: ModuleTypeInfo,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Enum {
    pub span: Span,
    pub declare: bool,
    pub is_const: bool,
    pub id: Ident,
    pub members: Vec<EnumMember>,
    pub has_num: bool,
    pub has_str: bool,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct EnumMember {
    pub span: Span,
    pub id: TsEnumMemberId,
    pub val: Expr,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Class {
    pub span: Span,
    pub is_abstract: bool,
    pub name: Option<Id>,
    pub super_class: Option<Box<Type>>,
    pub body: Vec<ClassMember>,
    pub type_params: Option<TypeParamDecl>,
    // pub implements: Vec<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct ClassInstance {
    pub span: Span,
    pub cls: Class,
    pub type_args: Option<TypeParamInstantiation>,
    // pub implements: Vec<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned, FromVariant)]
pub enum ClassMember {
    Constructor(ConstructorSignature),
    Method(Method),
    Property(ClassProperty),
    IndexSignature(IndexSignature),
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct ClassProperty {
    pub span: Span,
    pub key: Box<Expr>,
    pub value: Option<Box<Type>>,
    pub is_static: bool,
    pub computed: bool,
    pub accessibility: Option<Accessibility>,
    pub is_abstract: bool,
    pub is_optional: bool,
    pub readonly: bool,
    pub definite: bool,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Method {
    pub span: Span,
    pub key: PropName,
    pub is_static: bool,
    pub is_abstract: bool,
    pub is_optional: bool,
    pub type_params: Option<TypeParamDecl>,
    pub params: Vec<FnParam>,
    pub ret_ty: Box<Type>,
    pub kind: MethodKind,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Mapped {
    pub span: Span,
    pub readonly: Option<TruePlusMinus>,
    pub optional: Option<TruePlusMinus>,
    pub type_param: TypeParam,
    pub ty: Option<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Conditional {
    pub span: Span,
    pub check_type: Box<Type>,
    pub extends_type: Box<Type>,
    pub true_type: Box<Type>,
    pub false_type: Box<Type>,
}

#[derive(Debug, Clone, Copy, PartialEq, Spanned)]
pub struct Static {
    pub span: Span,
    pub ty: &'static Type,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Operator {
    pub span: Span,
    pub op: TsTypeOperatorOp,
    pub ty: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Tuple {
    pub span: Span,
    pub elems: Vec<TupleElement>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TupleElement {
    pub span: Span,
    pub label: Option<Pat>,
    pub ty: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Alias {
    pub span: Span,
    pub type_params: Option<TypeParamDecl>,
    pub ty: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Interface {
    pub span: Span,
    pub name: Id,
    pub type_params: Option<TypeParamDecl>,
    pub extends: Vec<TsExpr>,
    pub body: Vec<TypeElement>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TypeLit {
    pub span: Span,
    pub members: Vec<TypeElement>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TypeParamDecl {
    pub span: Span,
    pub params: Vec<TypeParam>,
}

/// Typescript expression with type arguments
#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TsExpr {
    pub span: Span,
    pub expr: TsEntityName,
    pub type_args: Option<TypeParamInstantiation>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TypeParamInstantiation {
    pub span: Span,
    pub params: Vec<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned, FromVariant)]
pub enum TypeElement {
    Call(CallSignature),
    Constructor(ConstructorSignature),
    Property(PropertySignature),
    Method(MethodSignature),
    Index(IndexSignature),
}

impl TypeElement {
    pub fn key(&self) -> Option<&Expr> {
        static CONSTRUCTOR: Expr = Expr::Ident(Ident::new(js_word!("constructor"), DUMMY_SP));

        match self {
            TypeElement::Call(..) => None,
            TypeElement::Constructor(..) => Some(&CONSTRUCTOR),
            TypeElement::Property(p) => Some(&p.key),
            TypeElement::Method(m) => Some(&m.key),
            TypeElement::Index(_) => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct CallSignature {
    pub span: Span,
    pub params: Vec<FnParam>,
    pub type_params: Option<TypeParamDecl>,
    pub ret_ty: Option<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct ConstructorSignature {
    pub span: Span,
    pub params: Vec<FnParam>,
    pub ret_ty: Option<Box<Type>>,
    pub type_params: Option<TypeParamDecl>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct PropertySignature {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub params: Vec<FnParam>,
    pub type_ann: Option<Box<Type>>,
    pub type_params: Option<TypeParamDecl>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct MethodSignature {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub params: Vec<FnParam>,
    pub ret_ty: Option<Box<Type>>,
    pub type_params: Option<TypeParamDecl>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct IndexSignature {
    pub params: Vec<FnParam>,
    pub type_ann: Option<Box<Type>>,

    pub readonly: bool,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Array {
    pub span: Span,
    pub elem_type: Box<Type>,
}

/// a | b
#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Union {
    pub span: Span,
    pub types: Vec<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct FnParam {
    pub span: Span,
    pub required: bool,
    pub pat: Pat,
    pub ty: Box<Type>,
}

/// a & b
#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Intersection {
    pub span: Span,
    pub types: Vec<Box<Type>>,
}

/// A type parameter
#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TypeParam {
    pub span: Span,
    pub name: Id,
    pub constraint: Option<Box<Type>>,
    pub default: Option<Box<Type>>,
}

/// FooEnum.A
#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct EnumVariant {
    pub span: Span,
    pub enum_name: Id,
    pub name: JsWord,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Function {
    pub span: Span,
    pub type_params: Option<TypeParamDecl>,
    pub params: Vec<FnParam>,
    pub ret_ty: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Constructor {
    pub span: Span,
    pub type_params: Option<TypeParamDecl>,
    pub params: Vec<FnParam>,
    pub type_ann: Box<Type>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct Predicate {
    pub span: Span,
    pub param_name: TsThisTypeOrIdent,
    pub asserts: bool,
    pub ty: Option<Box<Type>>,
}

#[derive(Debug, Clone, PartialEq, Spanned)]
pub struct TypeOrSpread {
    pub span: Span,
    pub spread: Option<Span>,
    pub ty: Box<Type>,
}

impl Type {
    /// Creates a new type from `iter`.
    ///
    /// Note:
    ///
    ///  - never types are excluded.
    pub fn union<I: IntoIterator<Item = Box<Self>>>(iter: I) -> Box<Self> {
        let mut span = DUMMY_SP;

        let mut tys = vec![];

        for ty in iter {
            let sp = ty.span();

            if sp.lo() < span.lo() {
                span = span.with_lo(sp.lo());
            }
            if sp.hi() > span.hi() {
                span = span.with_hi(sp.hi());
            }

            match *ty {
                Type::Union(Union { types, .. }) => {
                    assert_ne!(types, vec![]);
                    tys.extend(types);
                }

                _ => tys.push(ty),
            }
        }

        if tys.is_empty() {
            unreachable!("Type::union() should not be called with an empty iterator")
        }

        tys.retain(|ty| !ty.is_never());

        match tys.len() {
            0 => Type::never(span),
            1 => tys.into_iter().next().unwrap(),
            _ => Box::new(Type::Union(Union { span, types: tys })),
        }
    }

    pub fn contains_void(&self) -> bool {
        match *self.normalize() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsVoidKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.contains_void()),

            _ => false,
        }
    }

    pub fn is_any(&self) -> bool {
        match *self.normalize() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.is_any()),

            _ => false,
        }
    }

    pub fn is_unknown(&self) -> bool {
        match *self.normalize() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.is_unknown()),

            _ => false,
        }
    }

    pub fn contains_undefined(&self) -> bool {
        match *self.normalize() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.contains_undefined()),

            _ => false,
        }
    }
}

impl Type {
    pub fn is_kwd(&self, k: TsKeywordTypeKind) -> bool {
        match *self.normalize() {
            Type::Keyword(TsKeywordType { kind, .. }) if kind == k => true,
            _ => false,
        }
    }

    pub fn is_unique_symbol(&self) -> bool {
        match *self {
            Type::Operator(Operator {
                op: TsTypeOperatorOp::Unique,
                ref ty,
                ..
            }) => ty.is_kwd(TsKeywordTypeKind::TsSymbolKeyword),
            _ => false,
        }
    }

    pub fn is_never(&self) -> bool {
        self.is_kwd(TsKeywordTypeKind::TsNeverKeyword)
    }

    pub fn never<'any>(span: Span) -> Box<Type> {
        box Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsNeverKeyword,
        })
    }

    pub fn undefined<'any>(span: Span) -> Box<Type> {
        box Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsUndefinedKeyword,
        })
    }

    pub fn any<'any>(span: Span) -> Box<Type> {
        box Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        })
    }

    pub fn unknown<'any>(span: Span) -> Box<Type> {
        box Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsUnknownKeyword,
        })
    }
}

impl Type {
    pub fn respan(&mut self, span: Span) {
        if self.span() == span {
            return;
        }

        match self {
            Type::Operator(ty) => ty.span = span,

            Type::Mapped(ty) => ty.span = span,

            Type::Conditional(cond) => cond.span = span,

            Type::This(this) => this.span = span,

            Type::Lit(lit) => lit.span = span,

            Type::TypeLit(lit) => lit.span = span,

            Type::Keyword(kwd) => kwd.span = span,

            Type::Array(arr) => arr.span = span,

            Type::Union(u) => u.span = span,

            Type::Intersection(u) => u.span = span,

            Type::Function(f) => f.span = span,

            Type::Constructor(c) => c.span = span,

            Type::Method(m) => m.span = span,

            Type::Enum(e) => e.span = span,

            Type::EnumVariant(e) => e.span = span,

            Type::Interface(e) => e.span = span,

            Type::Alias(a) => a.span = span,

            Type::Namespace(n) => n.span = span,

            Type::Module(m) => m.span = span,

            Type::Class(c) => c.span = span,

            Type::ClassInstance(c) => c.span = span,

            Type::Param(p) => p.span = span,

            Type::Static(s) => s.span = span,

            Type::Tuple(ty) => ty.span = span,

            Type::Arc(arc) => *self = Type::Arc(arc.clone()),

            Type::Ref(ty) => ty.span = span,

            Type::Query(ty) => ty.span = span,

            Type::Infer(ty) => ty.span = span,

            Type::Import(ty) => ty.span = span,

            Type::Predicate(ty) => ty.span = span,

            Type::IndexedAccessType(ty) => ty.span = span,

            Type::Optional(ty) => ty.span = span,

            Type::Rest(ty) => ty.span = span,

            Type::Symbol(ty) => ty.span = span,
        }
    }
}

//
//impl Type {
//    pub fn into_static(self) -> Type {
//        match self {
//            Type::Operator(ty) => Type::Operator(ty),
//            Type::Mapped(ty) => Type::Mapped(ty),
//            Type::Conditional(cond) => Type::Conditional(cond),
//            Type::This(this) => Type::This(this),
//            Type::TypeLit(lit) => Type::TypeLit(lit),
//            Type::Lit(lit) => Type::Lit(lit),
//            Type::Keyword(lit) => Type::Keyword(lit),
//            Type::Simple(s) => Type::Simple(s),
//            Type::Array(Array { span, elem_type }) => Type::Array(Array {
//                span,
//                elem_type: box static_type(*elem_type),
//            }),
//
//            Type::Union(Union { span, types }) => Type::Union(Union {
//                span,
//                types: map_types(types, static_type),
//            }),
//            Type::Intersection(Intersection { span, types }) =>
// Type::Intersection(Intersection {                span,
//                types: map_types(types, static_type),
//            }),
//
//            Type::Function(Function {
//                span,
//                type_params,
//                params,
//                ret_ty,
//            }) => Type::Function(Function {
//                span,
//                type_params: type_params.map(|v| v),
//                params,
//                ret_ty: box static_type(*ret_ty),
//            }),
//
//            Type::Constructor(Constructor {
//                span,
//                type_params,
//                params,
//                ret_ty,
//            }) => Type::Constructor(Constructor {
//                span,
//                type_params: type_params.map(|v| v),
//                params,
//                ret_ty: ret_ty.map(|ret_ty| box static_type(*ret_ty)),
//            }),
//
//            Type::Method(m) => Type::Method(m),
//
//            Type::Interface(i) => Type::Interface(i),
//
//            Type::Param(p) => Type::Param(p),
//
//            Type::Enum(e) => Type::Enum(e),
//            Type::EnumVariant(e) => Type::EnumVariant(e),
//            Type::Class(c) => Type::Class(c),
//            Type::ClassInstance(c) => Type::ClassInstance(c),
//            Type::Alias(a) => Type::Alias(a),
//            Type::Namespace(n) => Type::Namespace(n),
//            Type::Module(m) => Type::Module(m),
//
//            Type::Arc(ty) => Type::Arc(ty),
//
//            Type::Static(s) => Type::Static(s),
//
//            Type::Tuple(t) => Type::Tuple(t),
//        }
//    }
//}

impl Type {
    /// Normalize types.
    pub fn into_owned(self) -> Type {
        match self {
            Type::Arc(ty) => (*ty).clone(),
            Type::Static(s) => s.ty.clone(),
            _ => self,
        }
    }

    /// `Type::Static` is normalized.
    pub fn normalize<'s, 'c>(&'s self) -> &'c Type
    where
        's: 'c,
    {
        match *self {
            Type::Static(Static { ty, .. }) => unsafe {
                // 'static lives longer than anything
                transmute::<&'static Type, &'c Type>(ty)
            },
            Type::Arc(ref s) => {
                //
                unsafe { transmute::<&'s Type, &'c Type>(s) }
            }
            _ => unsafe {
                // Shorten lifetimes
                transmute::<&'s Self, &'c Type>(self)
            },
        }
    }

    ///
    pub fn iter_union(&self) -> impl Debug + Iterator<Item = &Type> {
        Iter { ty: self, idx: 0 }
    }
}

#[derive(Debug)]
struct Iter<'a> {
    ty: &'a Type,
    idx: usize,
}

impl<'a> Iterator for Iter<'a> {
    type Item = &'a Type;

    fn next(&mut self) -> Option<Self::Item> {
        match self.ty {
            Type::Union(ref u) => {
                let ty = u.types.get(self.idx);
                self.idx += 1;
                return Some(&**ty?);
            }

            _ if self.idx == 0 => {
                self.idx = 1;
                Some(&self.ty)
            }

            _ => None,
        }
    }
}

impl FusedIterator for Iter<'_> {}

impl Type {
    pub fn is_str(&self) -> bool {
        match self.normalize() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsStringKeyword,
                ..
            })
            | Type::Lit(TsLitType {
                lit: TsLit::Str(..),
                ..
            }) => true,
            _ => false,
        }
    }
}

//impl Type {
//    /// Converts `Type` into `Type`.
//    pub fn owned(self) -> Type {
//        unsafe { transmute::<Cow<'_, Type>, Type>(Cow::Owned(self)) }
//    }
//
//    /// Converts `Type` into `Type`.
//    #[inline]
//    pub fn static_cast(&self) -> Type {
//        unsafe { transmute::<Cow<'_, Type>, Type>(Cow::Borrowed(self))
// }    }
//}

//impl Interface {
//    pub fn into_static(self) -> Interface<'static> {
//        Interface {
//            span: self.span,
//            name: self.name,
//            type_params: self.type_params.map(|v| v),
//            extends: self.extends.into_iter().map(|v|
// v).collect(),            body: self.body.into_iter().map(|v|
// v).collect(),        }
//    }
//}

//impl TsExpr {
//    pub fn into_static(self) -> TsExpr<'static> {
//        TsExpr {
//            span: self.span,
//            expr: self.expr,
//            type_params: self.type_params.map(|v| v),
//        }
//    }
//}
//
//impl TypeElement<'static> {
//    /// Converts `TypeTypeElement<'static>` into `TypeTypeElement`.
//    #[inline]
//    pub fn static_cast(self) -> TypeElement {
//        unsafe { transmute::<TypeElement<'static>, TypeElement>(self) }
//    }
//}
//
//impl TypeElement {
//    pub fn into_static(self) -> TypeElement<'static> {
//        match self {
//            TypeElement::Call(call) => TypeElement::Call(call),
//            TypeElement::Constructor(c) =>
// TypeElement::Constructor(c),            TypeElement::Index(i)
// => TypeElement::Index(i),            TypeElement::Method(m) =>
// TypeElement::Method(m),            TypeElement::Property(p) =>
// TypeElement::Property(p),        }
//    }
//}
//
//impl TypeParamInstantiation {
//    pub fn into_static(self) -> TypeParamInstantiation<'static> {
//        TypeParamInstantiation {
//            span: self.span,
//            params: self.params.into_iter().map(static_type).collect(),
//        }
//    }
//}
//
//impl CallSignature {
//    pub fn into_static(self) -> CallSignature<'static> {
//        CallSignature {
//            span: self.span,
//            params: self.params,
//            type_params: self.type_params.map(|v| v),
//            ret_ty: self.ret_ty.map(static_type),
//        }
//    }
//}
//
//impl ConstructorSignature {
//    pub fn into_static(self) -> ConstructorSignature<'static> {
//        ConstructorSignature {
//            span: self.span,
//            params: self.params,
//            ret_ty: self.ret_ty.map(static_type),
//            type_params: self.type_params.map(|v| v),
//        }
//    }
//}
//
//impl IndexSignature {
//    pub fn into_static(self) -> IndexSignature<'static> {
//        IndexSignature {
//            span: self.span,
//            readonly: self.readonly,
//            params: self.params,
//            type_ann: self.type_ann.map(static_type),
//        }
//    }
//}
//
//impl MethodSignature {
//    pub fn into_static(self) -> MethodSignature<'static> {
//        MethodSignature {
//            span: self.span,
//            computed: self.computed,
//            optional: self.optional,
//            key: self.key,
//            params: self.params,
//            readonly: self.readonly,
//            ret_ty: self.ret_ty.map(static_type),
//            type_params: self.type_params.map(|v| v),
//        }
//    }
//}
//
//impl PropertySignature {
//    pub fn into_static(self) -> PropertySignature<'static> {
//        PropertySignature {
//            span: self.span,
//            computed: self.computed,
//            optional: self.optional,
//            key: self.key,
//            params: self.params,
//            readonly: self.readonly,
//            type_ann: self.type_ann.map(static_type),
//            type_params: self.type_params.map(|v| v),
//        }
//    }
//}
//
//impl TypeParam {
//    pub fn into_static(self) -> TypeParam<'static> {
//        TypeParam {
//            span: self.span,
//            name: self.name,
//            constraint: self.constraint.map(|v| box static_type(*v)),
//            default: self.default.map(|v| box static_type(*v)),
//        }
//    }
//}
//
//impl TypeParamDecl {
//    pub fn into_static(self) -> TypeParamDecl<'static> {
//        TypeParamDecl {
//            span: self.span,
//            params: self.params.into_iter().map(|v|
// v).collect(),        }
//    }
//}
//
//impl TypeLit {
//    pub fn into_static(self) -> TypeLit<'static> {
//        TypeLit {
//            span: self.span,
//            members: self.members.into_iter().map(|v|
// v).collect(),        }
//    }
//}
//
//impl Alias {
//    pub fn into_static(self) -> Alias<'static> {
//        Alias {
//            span: self.span,
//            type_params: self.type_params.map(|v| v),
//            ty: box static_type(*self.ty),
//        }
//    }
//}
//
//impl TypeParam {
//    pub fn into_static(self) -> TypeParam<'static> {
//        TypeParam {
//            span: self.span,
//            name: self.name,
//            constraint: self.constraint.map(|v| box static_type(*v)),
//            default: self.default.map(|v| box static_type(*v)),
//        }
//    }
//}
//
//impl Tuple {
//    pub fn into_static(self) -> Tuple<'static> {
//        Tuple {
//            span: self.span,
//            types: self.types.into_iter().map(static_type).collect(),
//        }
//    }
//}
//
//impl Conditional {
//    pub fn into_static(self) -> Conditional<'static> {
//        Conditional {
//            span: self.span,
//            check_type: box static_type(*self.check_type),
//            extends_type: box static_type(*self.extends_type),
//            true_type: box static_type(*self.true_type),
//            false_type: box static_type(*self.false_type),
//        }
//    }
//}
//
//impl Mapped {
//    pub fn into_static(self) -> Mapped<'static> {
//        Mapped {
//            span: self.span,
//            readonly: self.readonly,
//            optional: self.optional,
//            type_param: self.type_param,
//            ty: self.ty.map(|ty| box static_type(*ty)),
//        }
//    }
//}
//
//impl Operator {
//    pub fn into_static(self) -> Operator<'static> {
//        Operator {
//            span: self.span,
//            op: self.op,
//            ty: box static_type(*self.ty),
//        }
//    }
//}
//
//impl Class {
//    pub fn into_static(self) -> Class<'static> {
//        Class {
//            span: self.span,
//            is_abstract: self.is_abstract,
//            name: self.name,
//            body: self.body.into_iter().map(|v| v).collect(),
//            type_params: self.type_params.map(|v| v),
//            super_class: self.super_class.map(|v| box static_type(*v)),
//            // implements: map_types(self.implements, static_type),
//        }
//    }
//}
//
//impl ClassInstance {
//    pub fn into_static(self) -> ClassInstance<'static> {
//        ClassInstance {
//            span: self.span,
//            cls: self.cls,
//            type_args: self.type_args.map(|v| v),
//        }
//    }
//}
//
//impl ClassMember {
//    pub fn into_static(self) -> ClassMember<'static> {
//        match self {
//            ClassMember::Constructor(v) =>
// ClassMember::Constructor(v),            ClassMember::Method(v)
// => ClassMember::Method(v),            ClassMember::Property(v)
// => ClassMember::Property(v),            ClassMember::IndexSignature(v) =>
// ClassMember::IndexSignature(v),        }
//    }
//}
//
//impl Constructor {
//    pub fn into_static(self) -> Constructor<'static> {
//        Constructor {
//            span: self.span,
//            params: self.params,
//            type_params: self.type_params.map(|v| v),
//            ret_ty: self.ret_ty.map(|v| box Cow::Owned(v)),
//        }
//    }
//}
//
//impl TypeElement {
//    pub fn key(&self) -> Option<&Expr> {
//        static CONSTRUCTOR_EXPR: Expr =
//            { Expr::Ident(Ident::new(js_word!("constructor"), DUMMY_SP)) };
//
//        match *self {
//            TypeElement::Call(..) => None,
//            TypeElement::Constructor(..) => Some(&CONSTRUCTOR_EXPR),
//            TypeElement::Index(..) => None,
//            TypeElement::Method(ref el) => Some(&el.key),
//            TypeElement::Property(ref el) => Some(&el.key),
//        }
//    }
//}

impl Type {
    /// Freeze the type.
    pub fn freeze(self) -> Box<Type> {
        box match self {
            Self::Static(..) | Self::Arc(..) => self,
            _ => Type::Arc(Arc::new(self)),
        }
    }

    pub fn as_bool(&self) -> Value<bool> {
        match self {
            Type::Static(ty) => ty.ty.as_bool(),
            Type::Arc(ref ty) => ty.as_bool(),

            Type::Class(_) | Type::TypeLit(_) => Known(true),

            Type::Lit(ty) => Known(match &ty.lit {
                TsLit::Number(v) => v.value != 0.0,
                TsLit::Str(v) => v.value != *"",
                TsLit::Tpl(v) => v.quasis.first().unwrap().raw.value != *"",
                TsLit::Bool(v) => v.value,
                TsLit::BigInt(v) => v.value != BigInt::zero(),
            }),
            Type::Keyword(TsKeywordType { kind, .. }) => Known(match kind {
                TsKeywordTypeKind::TsNeverKeyword
                | TsKeywordTypeKind::TsStringKeyword
                | TsKeywordTypeKind::TsNumberKeyword
                | TsKeywordTypeKind::TsUnknownKeyword
                | TsKeywordTypeKind::TsBooleanKeyword
                | TsKeywordTypeKind::TsAnyKeyword => return Unknown,
                TsKeywordTypeKind::TsSymbolKeyword
                | TsKeywordTypeKind::TsBigIntKeyword
                | TsKeywordTypeKind::TsObjectKeyword => true,

                TsKeywordTypeKind::TsUndefinedKeyword
                | TsKeywordTypeKind::TsNullKeyword
                | TsKeywordTypeKind::TsVoidKeyword => false,
            }),

            _ => Unknown,
        }
    }
}

/// Creates a reference
impl From<Ident> for Type {
    fn from(i: Ident) -> Self {
        Type::Ref(Ref {
            span: i.span,
            type_name: TsEntityName::Ident(i),
            type_args: None,
        })
    }
}
