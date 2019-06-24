use crate::util::IntoCow;
use std::{borrow::Cow, mem::transmute};
use swc_atoms::JsWord;
use swc_common::{Fold, FromVariant, Span, Spanned};
use swc_ecma_ast::*;

mod assign;
mod convert;
pub mod merge;

pub trait TypeRefExt<'a>: Sized + Clone {
    fn into_type_ref(self) -> TypeRef<'a>;
    fn to_type_ref(&'a self) -> TypeRef<'a>;

    /// Returns generalized type if `self` is a literal type.
    fn generalize_lit(self) -> TypeRef<'a> {
        let ty = self.into_type_ref();

        match *ty.as_ref() {
            Type::Lit(TsLitType { span, ref lit }) => {
                return Type::Keyword(TsKeywordType {
                    span,
                    kind: match *lit {
                        TsLit::Bool(Bool { .. }) => TsKeywordTypeKind::TsBooleanKeyword,
                        TsLit::Number(Number { .. }) => TsKeywordTypeKind::TsNumberKeyword,
                        TsLit::Str(Str { .. }) => TsKeywordTypeKind::TsStringKeyword,
                    },
                })
                .owned()
            }
            _ => {}
        }

        ty
    }

    fn to_static(&self) -> Type<'static> {
        self.clone().into_type_ref().into_owned().into_static()
    }

    fn cast<'b>(&'a self) -> TypeRef<'b>
    where
        'a: 'b,
    {
        // 'a lives longer than 'b, so this is ok
        unsafe { transmute::<TypeRef<'a>, TypeRef<'b>>(self.to_type_ref()) }
    }
}

impl<'a> TypeRefExt<'a> for TypeRef<'a> {
    #[inline]
    fn into_type_ref(self) -> TypeRef<'a> {
        self
    }

    fn to_type_ref(&'a self) -> TypeRef<'a> {
        match *self {
            Cow::Borrowed(b) => Cow::Borrowed(b),
            Cow::Owned(ref o) => Cow::Borrowed(o),
        }
    }
}

impl<'a> TypeRefExt<'a> for Type<'a> {
    #[inline]
    fn into_type_ref(self) -> TypeRef<'a> {
        Cow::Owned(self)
    }

    fn to_type_ref(&'a self) -> TypeRef<'a> {
        Cow::Borrowed(self)
    }
}

pub type TypeRef<'a> = Cow<'a, Type<'a>>;

#[derive(Debug, Fold, Clone, PartialEq, Spanned, FromVariant)]
pub enum Type<'a> {
    This(TsThisType),
    Lit(TsLitType),
    TypeLit(TypeLit<'a>),
    Keyword(TsKeywordType),
    Simple(Cow<'a, TsType>),
    Array(Array<'a>),
    Union(Union<'a>),
    Intersection(Intersection<'a>),
    Function(Function<'a>),
    Constructor(Constructor<'a>),

    EnumVariant(EnumVariant),

    Interface(Interface<'a>),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(Alias<'a>),
    Namespace(TsNamespaceDecl),
    Module(TsModuleDecl),
    Class(Class),

    /// Used for storing core types.
    ///
    /// Don't match on this directly. Instead, use `.as_eef()`.
    Static(#[fold(ignore)] &'static Type<'static>),
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Alias<'a> {
    pub span: Span,
    pub type_params: Option<TypeParamDecl<'a>>,
    pub ty: Box<TypeRef<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Interface<'a> {
    pub span: Span,
    pub type_params: Option<TypeParamDecl<'a>>,
    pub extends: Vec<TsExpr<'a>>,
    pub body: Vec<TypeElement<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct TypeLit<'a> {
    pub span: Span,
    pub members: Vec<TypeElement<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct TypeParamDecl<'a> {
    pub span: Span,
    pub params: Vec<TypeParam<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct TypeParam<'a> {
    pub span: Span,
    pub name: JsWord,

    pub constraint: Option<Box<TypeRef<'a>>>,
    pub default: Option<Box<TypeRef<'a>>>,
}

/// Typescript expression with type arguments
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct TsExpr<'a> {
    pub span: Span,
    pub expr: TsEntityName,
    pub type_params: Option<TypeParamInstantiation<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct TypeParamInstantiation<'a> {
    pub span: Span,
    pub params: Vec<Box<TypeRef<'a>>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned, FromVariant)]
pub enum TypeElement<'a> {
    Call(CallSignature<'a>),
    Constructor(ConstructorSignature<'a>),
    Property(PropertySignature<'a>),
    Method(MethodSignature<'a>),
    Index(IndexSignature<'a>),
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct CallSignature<'a> {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub type_params: Option<TypeParamDecl<'a>>,
    pub ret_ty: Option<TypeRef<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct ConstructorSignature<'a> {
    pub span: Span,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Option<TypeRef<'a>>,
    pub type_params: Option<TypeParamDecl<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct PropertySignature<'a> {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub init: Option<Box<Expr>>,
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TypeRef<'a>>,
    pub type_params: Option<TypeParamDecl<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct MethodSignature<'a> {
    pub span: Span,
    pub readonly: bool,
    pub key: Box<Expr>,
    pub computed: bool,
    pub optional: bool,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Option<TypeRef<'a>>,
    pub type_params: Option<TypeParamDecl<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct IndexSignature<'a> {
    pub params: Vec<TsFnParam>,
    pub type_ann: Option<TypeRef<'a>>,

    pub readonly: bool,
    pub span: Span,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Array<'a> {
    pub span: Span,
    pub elem_type: Box<TypeRef<'a>>,
}

/// a | b
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Union<'a> {
    pub span: Span,
    pub types: Vec<TypeRef<'a>>,
}

/// a & b
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Intersection<'a> {
    pub span: Span,
    pub types: Vec<TypeRef<'a>>,
}

/// FooEnum.A
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct EnumVariant {
    pub span: Span,
    pub enum_name: JsWord,
    pub name: JsWord,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Function<'a> {
    pub span: Span,
    pub type_params: Option<TypeParamDecl<'a>>,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Box<TypeRef<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Constructor<'a> {
    pub span: Span,
    pub type_params: Option<TypeParamDecl<'a>>,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Box<TypeRef<'a>>,
}

impl Type<'_> {
    pub fn contains_void(&self) -> bool {
        match *self.as_ref() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsVoidKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.contains_void()),

            _ => false,
        }
    }

    pub fn is_any(&self) -> bool {
        match *self.as_ref() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.is_any()),

            _ => false,
        }
    }

    pub fn is_unknown(&self) -> bool {
        match *self.as_ref() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.is_unknown()),

            _ => false,
        }
    }

    pub fn contains_undefined(&self) -> bool {
        match *self.as_ref() {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.contains_undefined()),

            _ => false,
        }
    }
}

impl Type<'_> {
    pub fn is_keyword(&self, k: TsKeywordTypeKind) -> bool {
        match *self.as_ref() {
            Type::Keyword(TsKeywordType { kind, .. }) if kind == k => true,
            _ => false,
        }
    }
    pub fn is_never(&self) -> bool {
        self.is_keyword(TsKeywordTypeKind::TsNeverKeyword)
    }

    pub const fn never<'any>(span: Span) -> Type<'any> {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsNeverKeyword,
        })
    }

    pub const fn undefined<'any>(span: Span) -> Type<'any> {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsUndefinedKeyword,
        })
    }

    pub const fn any<'any>(span: Span) -> Type<'any> {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        })
    }
}

fn static_type(ty: Cow<Type>) -> TypeRef<'static> {
    ty.into_owned().into_static().into_cow()
}

fn map_types<'a, 'b, F>(types: Vec<TypeRef<'a>>, map: F) -> Vec<TypeRef<'b>>
where
    F: Fn(TypeRef<'a>) -> TypeRef<'b>,
{
    types.into_iter().map(map).collect()
}

impl Type<'_> {
    pub fn into_static(self) -> Type<'static> {
        match self {
            Type::This(this) => Type::This(this),
            Type::TypeLit(lit) => Type::TypeLit(lit.into_static()),
            Type::Lit(lit) => Type::Lit(lit),
            Type::Keyword(lit) => Type::Keyword(lit),
            Type::Simple(s) => Type::Simple(s.into_owned().into_cow()),
            Type::Array(Array { span, elem_type }) => Type::Array(Array {
                span,
                elem_type: box static_type(*elem_type),
            }),

            Type::Union(Union { span, types }) => Type::Union(Union {
                span,
                types: map_types(types, static_type),
            }),
            Type::Intersection(Intersection { span, types }) => Type::Intersection(Intersection {
                span,
                types: map_types(types, static_type),
            }),

            Type::Function(Function {
                span,
                type_params,
                params,
                ret_ty,
            }) => Type::Function(Function {
                span,
                type_params: type_params.map(|v| v.into_static()),
                params,
                ret_ty: box static_type(*ret_ty),
            }),

            Type::Constructor(Constructor {
                span,
                type_params,
                params,
                ret_ty,
            }) => Type::Constructor(Constructor {
                span,
                type_params: type_params.map(|v| v.into_static()),
                params,
                ret_ty: box static_type(*ret_ty),
            }),

            Type::Interface(i) => Type::Interface(i.into_static()),

            Type::Enum(e) => Type::Enum(e),
            Type::EnumVariant(e) => Type::EnumVariant(e),
            Type::Class(c) => Type::Class(c),
            Type::Alias(a) => Type::Alias(a.into_static()),
            Type::Namespace(n) => Type::Namespace(n),
            Type::Module(m) => Type::Module(m),

            Type::Static(s) => Type::Static(s),
        }
    }
}

impl<'a> Type<'a> {
    /// `Type::Static` is normalized.
    pub fn as_ref<'s, 'c, 'd>(&'s self) -> &'c Type<'d>
    where
        'a: 'c + 'd,
        's: 'c + 'd,
    {
        match *self {
            Type::Static(v) => unsafe {
                // 'static lives longer than anything
                transmute::<_, &'c Type<'d>>(v)
            },
            _ => unsafe {
                // Shorten lifetimes
                transmute::<_, &'c Type<'d>>(self)
            },
        }
    }
}

impl Type<'static> {
    /// Converts `Type<'static>` into `TypeRef<'a>`.
    pub fn owned<'a>(self) -> TypeRef<'a> {
        unsafe { transmute::<Cow<'_, Type<'static>>, TypeRef<'a>>(Cow::Owned(self)) }
    }

    /// Converts `Type<'static>` into `TypeRef<'a>`.
    #[inline]
    pub fn static_cast(&self) -> TypeRef {
        unsafe { transmute::<Cow<'_, Type<'static>>, TypeRef<'_>>(Cow::Borrowed(self)) }
    }
}

impl Interface<'_> {
    pub fn into_static(self) -> Interface<'static> {
        Interface {
            span: self.span,

            type_params: self.type_params.map(|v| v.into_static()),
            extends: self.extends.into_iter().map(|v| v.into_static()).collect(),
            body: self.body.into_iter().map(|v| v.into_static()).collect(),
        }
    }
}

impl TsExpr<'_> {
    pub fn into_static(self) -> TsExpr<'static> {
        TsExpr {
            span: self.span,
            expr: self.expr,
            type_params: self.type_params.map(|v| v.into_static()),
        }
    }
}

impl TypeElement<'_> {
    pub fn into_static(self) -> TypeElement<'static> {
        match self {
            TypeElement::Call(call) => TypeElement::Call(call.into_static()),
            TypeElement::Constructor(c) => TypeElement::Constructor(c.into_static()),
            TypeElement::Index(i) => TypeElement::Index(i.into_static()),
            TypeElement::Method(m) => TypeElement::Method(m.into_static()),
            TypeElement::Property(p) => TypeElement::Property(p.into_static()),
        }
    }
}

impl TypeParamInstantiation<'_> {
    pub fn into_static(self) -> TypeParamInstantiation<'static> {
        TypeParamInstantiation {
            span: self.span,
            params: self
                .params
                .into_iter()
                .map(|v| box static_type(*v))
                .collect(),
        }
    }
}

impl CallSignature<'_> {
    pub fn into_static(self) -> CallSignature<'static> {
        CallSignature {
            span: self.span,
            params: self.params,
            type_params: self.type_params.map(|v| v.into_static()),
            ret_ty: self.ret_ty.map(static_type),
        }
    }
}

impl ConstructorSignature<'_> {
    pub fn into_static(self) -> ConstructorSignature<'static> {
        ConstructorSignature {
            span: self.span,
            params: self.params,
            ret_ty: self.ret_ty.map(static_type),
            type_params: self.type_params.map(|v| v.into_static()),
        }
    }
}

impl IndexSignature<'_> {
    pub fn into_static(self) -> IndexSignature<'static> {
        IndexSignature {
            span: self.span,
            readonly: self.readonly,
            params: self.params,
            type_ann: self.type_ann.map(static_type),
        }
    }
}

impl MethodSignature<'_> {
    pub fn into_static(self) -> MethodSignature<'static> {
        MethodSignature {
            span: self.span,
            computed: self.computed,
            optional: self.optional,
            key: self.key,
            params: self.params,
            readonly: self.readonly,
            ret_ty: self.ret_ty.map(static_type),
            type_params: self.type_params.map(|v| v.into_static()),
        }
    }
}

impl PropertySignature<'_> {
    pub fn into_static(self) -> PropertySignature<'static> {
        PropertySignature {
            span: self.span,
            computed: self.computed,
            optional: self.optional,
            init: self.init,
            key: self.key,
            params: self.params,
            readonly: self.readonly,
            type_ann: self.type_ann.map(static_type),
            type_params: self.type_params.map(|v| v.into_static()),
        }
    }
}

impl TypeParam<'_> {
    pub fn into_static(self) -> TypeParam<'static> {
        TypeParam {
            span: self.span,
            name: self.name,
            constraint: self.constraint.map(|v| box static_type(*v)),
            default: self.default.map(|v| box static_type(*v)),
        }
    }
}

impl TypeParamDecl<'_> {
    pub fn into_static(self) -> TypeParamDecl<'static> {
        TypeParamDecl {
            span: self.span,
            params: self.params.into_iter().map(|v| v.into_static()).collect(),
        }
    }
}

impl TypeLit<'_> {
    pub fn into_static(self) -> TypeLit<'static> {
        TypeLit {
            span: self.span,
            members: self.members.into_iter().map(|v| v.into_static()).collect(),
        }
    }
}

impl Alias<'_> {
    pub fn into_static(self) -> Alias<'static> {
        Alias {
            span: self.span,
            type_params: self.type_params.map(|v| v.into_static()),
            ty: box static_type(*self.ty),
        }
    }
}
