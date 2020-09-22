use crate::{
    ty,
    ty::{Class, FnParam, Intersection, Type, TypeElement, TypeParamInstantiation, Union},
};
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{drop_span, ModuleItemLike, StmtLike};

pub(crate) mod named;
pub(crate) mod property_map;

pub(crate) trait AsModuleDecl: StmtLike + ModuleItemLike {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt>;
}

impl AsModuleDecl for Stmt {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt> {
        Err(self)
    }
}

impl AsModuleDecl for ModuleItem {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt> {
        match self {
            ModuleItem::ModuleDecl(decl) => Ok(decl),
            ModuleItem::Stmt(stmt) => Err(stmt),
        }
    }
}

pub trait EqIgnoreSpan {
    fn eq_ignore_span(&self, to: &Self) -> bool;
}

pub trait TypeEq<T = Self> {
    fn type_eq(&self, to: &T) -> bool;
}

macro_rules! impl_by_clone {
    ($T:ty) => {
        impl EqIgnoreSpan for $T {
            fn eq_ignore_span(&self, to: &Self) -> bool {
                drop_span(self.clone()) == drop_span(to.clone())
            }
        }

        impl TypeEq<$T> for $T {
            fn type_eq(&self, to: &$T) -> bool {
                use swc_ecma_visit::FoldWith;

                let l = self.clone().fold_with(&mut TypeEqHelper);
                let r = to.clone().fold_with(&mut TypeEqHelper);

                l == r
            }
        }
    };
}

macro_rules! impl_ty_by_clone {
    ($T:ty) => {
        impl EqIgnoreSpan for $T {
            fn eq_ignore_span(&self, to: &Self) -> bool {
                use swc_ts_types::FoldWith;
                self.clone().fold_with(&mut SpanRemover) == to.clone().fold_with(&mut SpanRemover)
            }
        }

        impl TypeEq<$T> for $T {
            fn type_eq(&self, to: &$T) -> bool {
                use swc_ts_types::FoldWith;

                let l = self.clone().fold_with(&mut TypeEqHelper);
                let r = to.clone().fold_with(&mut TypeEqHelper);

                l == r
            }
        }
    };
}

impl_ty_by_clone!(Type);
impl_by_clone!(Expr);
impl_ty_by_clone!(TypeElement);
impl_by_clone!(TsLit);
impl_by_clone!(TsLitType);
impl_by_clone!(PropName);
impl_ty_by_clone!(Class);
impl_ty_by_clone!(FnParam);
impl_by_clone!(ComputedPropName);
impl_by_clone!(TsEntityName);
impl_ty_by_clone!(TypeParamInstantiation);
impl_by_clone!(TsTupleElement);

struct SpanRemover;
impl ty::Fold for SpanRemover {
    fn fold_span(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

struct TypeEqHelper;
impl ty::Fold for TypeEqHelper {
    fn fold_span(&mut self, _: Span) -> Span {
        DUMMY_SP
    }

    fn fold_fn_param(&mut self, mut p: FnParam) -> FnParam {
        p.pat = Pat::Invalid(Invalid { span: DUMMY_SP });
        p
    }

    fn fold_expr(&mut self, node: Expr) -> Expr {
        use swc_ecma_visit::FoldWith;

        node.fold_with(self)
    }

    fn fold_ident(&mut self, node: Ident) -> Ident {
        use swc_ecma_visit::FoldWith;

        node.fold_with(self)
    }
}

impl swc_ecma_visit::Fold for TypeEqHelper {
    fn fold_span(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

impl<T> EqIgnoreSpan for Box<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, to: &Self) -> bool {
        (**self).eq_ignore_span(&**to)
    }
}

impl<T> EqIgnoreSpan for Option<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, to: &Self) -> bool {
        match (self.as_ref(), to.as_ref()) {
            (Some(l), Some(r)) => l.eq_ignore_span(r),
            (None, None) => true,
            _ => false,
        }
    }
}

impl<T> EqIgnoreSpan for Vec<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, to: &Self) -> bool {
        if self.len() != to.len() {
            return false;
        }

        self.iter()
            .zip(to.iter())
            .all(|(l, r)| l.eq_ignore_span(&r))
    }
}

impl<T> TypeEq for Box<T>
where
    T: TypeEq,
{
    fn type_eq(&self, to: &Self) -> bool {
        (**self).type_eq(&**to)
    }
}

impl<T> TypeEq for Option<T>
where
    T: TypeEq,
{
    fn type_eq(&self, to: &Self) -> bool {
        match (self.as_ref(), to.as_ref()) {
            (Some(l), Some(r)) => l.type_eq(r),
            (None, None) => true,
            _ => false,
        }
    }
}

impl<T> TypeEq for Vec<T>
where
    T: TypeEq,
{
    fn type_eq(&self, to: &Self) -> bool {
        if self.len() != to.len() {
            return false;
        }

        self.iter().zip(to.iter()).all(|(l, r)| l.type_eq(&r))
    }
}

/// TODO: Change it to return Box<Type>
pub(crate) trait RemoveTypes {
    /// Removes falsy values from `self`.
    fn remove_falsy(self) -> Type;

    /// Removes truthy values from `self`.
    fn remove_truthy(self) -> Type;
}

impl RemoveTypes for Type {
    fn remove_falsy(self) -> Type {
        match self {
            Type::Keyword(TsKeywordType { kind, span }) => match kind {
                TsKeywordTypeKind::TsUndefinedKeyword | TsKeywordTypeKind::TsNullKeyword => {
                    return *Type::never(span);
                }
                _ => {}
            },
            Type::Lit(TsLitType {
                lit:
                    TsLit::Bool(Bool {
                        value: false, span, ..
                    }),
                ..
            }) => return *Type::never(span),

            Type::Union(u) => return u.remove_falsy(),
            Type::Intersection(i) => return i.remove_falsy(),
            _ => {}
        }

        self
    }

    fn remove_truthy(self) -> Type {
        match self {
            Type::Lit(TsLitType {
                lit: TsLit::Bool(Bool {
                    value: true, span, ..
                }),
                ..
            }) => return *Type::never(span),

            Type::Union(u) => u.remove_truthy(),
            Type::Intersection(i) => i.remove_truthy(),
            _ => self,
        }
    }
}

impl RemoveTypes for Intersection {
    fn remove_falsy(self) -> Type {
        let types = self
            .types
            .into_iter()
            .map(|ty| box ty.remove_falsy())
            .collect::<Vec<_>>();
        if types.iter().any(|ty| ty.is_never()) {
            return *Type::never(self.span);
        }

        Intersection {
            span: self.span,
            types,
        }
        .into()
    }

    fn remove_truthy(self) -> Type {
        let types = self
            .types
            .into_iter()
            .map(|ty| box ty.remove_truthy())
            .collect::<Vec<_>>();
        if types.iter().any(|ty| ty.is_never()) {
            return *Type::never(self.span);
        }

        Intersection {
            span: self.span,
            types,
        }
        .into()
    }
}

impl RemoveTypes for Union {
    fn remove_falsy(self) -> Type {
        let types = self
            .types
            .into_iter()
            .map(|ty| box ty.remove_falsy())
            .filter(|ty| !ty.is_never())
            .collect();
        Union {
            span: self.span,
            types,
        }
        .into()
    }

    fn remove_truthy(self) -> Type {
        let types = self
            .types
            .into_iter()
            .map(|ty| box ty.remove_truthy())
            .filter(|ty| !ty.is_never())
            .collect();
        Union {
            span: self.span,
            types,
        }
        .into()
    }
}

impl<'a, T> RemoveTypes for Box<T>
where
    T: RemoveTypes,
{
    fn remove_falsy(self) -> Type {
        (*self).remove_falsy()
    }

    fn remove_truthy(self) -> Type {
        (*self).remove_truthy()
    }
}

pub(crate) trait EndsWithRet {
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool;
}

impl EndsWithRet for Stmt {
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool {
        match *self {
            Stmt::Return(..) | Stmt::Break(..) | Stmt::Continue(..) | Stmt::Throw(..) => true,
            Stmt::Block(ref stmt) => stmt.ends_with_ret(),
            _ => false,
        }
    }
}

impl EndsWithRet for BlockStmt {
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool {
        self.stmts.ends_with_ret()
    }
}

impl<T> EndsWithRet for Vec<T>
where
    T: EndsWithRet,
{
    /// Returns true if the statement ends with return, break, continue;
    fn ends_with_ret(&self) -> bool {
        match self.last() {
            Some(ref stmt) => stmt.ends_with_ret(),
            _ => false,
        }
    }
}

pub trait PatExt {
    fn get_ty(&self) -> Option<&TsType>;
    fn get_mut_ty(&mut self) -> Option<&mut TsType>;
    fn set_ty(&mut self, ty: Option<Box<TsType>>);
}

impl PatExt for Pat {
    fn get_ty(&self) -> Option<&TsType> {
        match *self {
            Pat::Array(ArrayPat { ref type_ann, .. })
            | Pat::Assign(AssignPat { ref type_ann, .. })
            | Pat::Ident(Ident { ref type_ann, .. })
            | Pat::Object(ObjectPat { ref type_ann, .. })
            | Pat::Rest(RestPat { ref type_ann, .. }) => type_ann.as_ref().map(|ty| &*ty.type_ann),

            Pat::Invalid(..) | Pat::Expr(box Expr::Invalid(..)) => {
                //Some(TsType::TsKeywordType(TsKeywordType {
                //    span: self.span(),
                //    kind: TsKeywordTypeKind::TsAnyKeyword,
                //}))
                None
            }

            _ => None,
        }
    }

    fn get_mut_ty(&mut self) -> Option<&mut TsType> {
        match *self {
            Pat::Array(ArrayPat {
                ref mut type_ann, ..
            })
            | Pat::Assign(AssignPat {
                ref mut type_ann, ..
            })
            | Pat::Ident(Ident {
                ref mut type_ann, ..
            })
            | Pat::Object(ObjectPat {
                ref mut type_ann, ..
            })
            | Pat::Rest(RestPat {
                ref mut type_ann, ..
            }) => type_ann.as_mut().map(|ty| &mut *ty.type_ann),

            Pat::Invalid(..) | Pat::Expr(box Expr::Invalid(..)) => None,

            _ => None,
        }
    }

    fn set_ty(&mut self, ty: Option<Box<TsType>>) {
        match *self {
            Pat::Array(ArrayPat {
                ref mut type_ann, ..
            })
            | Pat::Assign(AssignPat {
                ref mut type_ann, ..
            })
            | Pat::Ident(Ident {
                ref mut type_ann, ..
            })
            | Pat::Object(ObjectPat {
                ref mut type_ann, ..
            })
            | Pat::Rest(RestPat {
                ref mut type_ann, ..
            }) => {
                *type_ann = ty.map(|type_ann| TsTypeAnn {
                    span: type_ann.span(),
                    type_ann,
                })
            }

            _ => {}
        }
    }
}
