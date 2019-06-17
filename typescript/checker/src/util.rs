use swc_atoms::js_word;
use swc_common::{Fold, FoldWith, Span, DUMMY_SP};
use swc_ecma_ast::*;

pub trait ModuleItemLike: StmtLike {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        Err(self)
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Err(decl)
    }
}

pub trait StmtLike: Sized {
    fn try_into_stmt(self) -> Result<Stmt, Self>;
    fn as_stmt(&self) -> Option<&Stmt>;
    fn from_stmt(stmt: Stmt) -> Self;
}

impl ModuleItemLike for Stmt {}

impl StmtLike for Stmt {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        Ok(self)
    }
    fn as_stmt(&self) -> Option<&Stmt> {
        Some(&self)
    }
    fn from_stmt(stmt: Stmt) -> Self {
        stmt
    }
}

impl ModuleItemLike for ModuleItem {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        match self {
            ModuleItem::ModuleDecl(decl) => Ok(decl),
            _ => Err(self),
        }
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Ok(ModuleItem::ModuleDecl(decl))
    }
}
impl StmtLike for ModuleItem {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        match self {
            ModuleItem::Stmt(stmt) => Ok(stmt),
            _ => Err(self),
        }
    }
    fn as_stmt(&self) -> Option<&Stmt> {
        match *self {
            ModuleItem::Stmt(ref stmt) => Some(stmt),
            _ => None,
        }
    }
    fn from_stmt(stmt: Stmt) -> Self {
        ModuleItem::Stmt(stmt)
    }
}

pub trait EqIgnoreSpan {
    fn eq_ignore_span(&self, to: &Self) -> bool;
}

pub trait EqIgnoreNameAndSpan {
    fn eq_ignore_name_and_span(&self, to: &Self) -> bool;
}

macro_rules! impl_by_clone {
    ($T:ty) => {
        impl EqIgnoreSpan for $T {
            fn eq_ignore_span(&self, to: &Self) -> bool {
                self.clone().fold_with(&mut SpanRemover) == to.clone().fold_with(&mut SpanRemover)
            }
        }

        impl EqIgnoreNameAndSpan for $T {
            fn eq_ignore_name_and_span(&self, to: &Self) -> bool {
                let l = self.clone().fold_with(&mut SpanAndNameRemover);
                let r = to.clone().fold_with(&mut SpanAndNameRemover);
                l == r
            }
        }
    };
}

impl_by_clone!(TsType);
impl_by_clone!(Expr);
impl_by_clone!(TsTypeElement);
impl_by_clone!(TsLit);

struct SpanRemover;
impl Fold<Span> for SpanRemover {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

struct SpanAndNameRemover;
impl Fold<Span> for SpanAndNameRemover {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}
impl Fold<Ident> for SpanAndNameRemover {
    fn fold(&mut self, i: Ident) -> Ident {
        Ident {
            sym: js_word!(""),
            span: DUMMY_SP,
            ..i.fold_children(self)
        }
    }
}

/// TsEntityName is used in type position.
impl Fold<TsEntityName> for SpanAndNameRemover {
    fn fold(&mut self, n: TsEntityName) -> TsEntityName {
        match n {
            TsEntityName::Ident(i) => TsEntityName::Ident(Ident {
                span: DUMMY_SP,
                ..i.fold_children(self)
            }),
            TsEntityName::TsQualifiedName(q) => TsEntityName::TsQualifiedName(q.fold_with(self)),
        }
    }
}

impl Fold<TsQualifiedName> for SpanRemover {
    fn fold(&mut self, n: TsQualifiedName) -> TsQualifiedName {
        TsQualifiedName {
            left: n.left.fold_with(self),
            right: Ident {
                span: DUMMY_SP,
                ..n.right
            },
        }
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

impl<T> EqIgnoreNameAndSpan for Box<T>
where
    T: EqIgnoreNameAndSpan,
{
    fn eq_ignore_name_and_span(&self, to: &Self) -> bool {
        (**self).eq_ignore_name_and_span(&**to)
    }
}

impl<T> EqIgnoreNameAndSpan for Option<T>
where
    T: EqIgnoreNameAndSpan,
{
    fn eq_ignore_name_and_span(&self, to: &Self) -> bool {
        match (self.as_ref(), to.as_ref()) {
            (Some(l), Some(r)) => l.eq_ignore_name_and_span(r),
            (None, None) => true,
            _ => false,
        }
    }
}

impl<T> EqIgnoreNameAndSpan for Vec<T>
where
    T: EqIgnoreNameAndSpan,
{
    fn eq_ignore_name_and_span(&self, to: &Self) -> bool {
        if self.len() != to.len() {
            return false;
        }

        self.iter()
            .zip(to.iter())
            .all(|(l, r)| l.eq_ignore_name_and_span(&r))
    }
}
