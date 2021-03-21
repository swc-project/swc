use std::{clone::Clone, cmp::Eq, hash::Hash, mem::replace};
use swc_atoms::js_word;
use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub(crate) mod fast_graph;

const TRACK: bool = false;

pub(crate) trait VarDeclaratorExt: Into<VarDeclarator> {
    fn into_module_item(self, injected_ctxt: SyntaxContext, name: &str) -> ModuleItem {
        ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP.with_ctxt(injected_ctxt),
            kind: VarDeclKind::Const,
            declare: false,
            decls: if TRACK {
                vec![
                    self.into(),
                    Str {
                        span: DUMMY_SP,
                        value: name.into(),
                        has_escape: false,
                        kind: Default::default(),
                    }
                    .assign_to(Ident::new("INJECTED_FROM".into(), DUMMY_SP)),
                ]
            } else {
                vec![self.into()]
            },
        })))
    }
}

impl<T> VarDeclaratorExt for T where T: Into<VarDeclarator> {}

pub(crate) trait ExprExt: Into<Expr> {
    #[track_caller]
    fn assign_to<T>(self, lhs: T) -> VarDeclarator
    where
        T: IdentLike,
    {
        let init = self.into();
        let lhs = lhs.into_id();

        if cfg!(debug_assertions) {
            match &init {
                Expr::Ident(rhs) => {
                    debug_assert_ne!(lhs, rhs.to_id());
                }
                _ => {}
            }
        }

        VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(Ident::new(lhs.0, DUMMY_SP.with_ctxt(lhs.1)).into()),
            init: Some(Box::new(init)),
            definite: false,
        }
    }
}

impl<T> ExprExt for T where T: Into<Expr> {}

/// Helper for migration from [Fold] to [VisitMut]
pub(crate) trait MapWithMut: Sized {
    fn dummy() -> Self;

    fn take(&mut self) -> Self {
        replace(self, Self::dummy())
    }

    #[inline]
    fn map_with_mut<F>(&mut self, op: F)
    where
        F: FnOnce(Self) -> Self,
    {
        let dummy = Self::dummy();
        let v = replace(self, dummy);
        let v = op(v);
        let _dummy = replace(self, v);
    }
}

impl MapWithMut for ModuleItem {
    #[inline(always)]
    fn dummy() -> Self {
        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
    }
}

impl MapWithMut for Stmt {
    #[inline(always)]
    fn dummy() -> Self {
        Stmt::Empty(EmptyStmt { span: DUMMY_SP })
    }
}

impl MapWithMut for Expr {
    #[inline(always)]
    fn dummy() -> Self {
        Expr::Invalid(Invalid { span: DUMMY_SP })
    }
}

impl MapWithMut for Pat {
    #[inline(always)]
    fn dummy() -> Self {
        Pat::Invalid(Invalid { span: DUMMY_SP })
    }
}

impl<T> MapWithMut for Option<T> {
    #[inline(always)]
    fn dummy() -> Self {
        None
    }
}

impl<T> MapWithMut for Vec<T> {
    #[inline(always)]
    fn dummy() -> Self {
        Vec::new()
    }
}

impl<T> MapWithMut for Box<T>
where
    T: MapWithMut,
{
    #[inline(always)]
    fn dummy() -> Self {
        Box::new(T::dummy())
    }
}

impl MapWithMut for Ident {
    fn dummy() -> Self {
        Ident::new(js_word!(""), DUMMY_SP)
    }
}

impl MapWithMut for ObjectPatProp {
    fn dummy() -> Self {
        ObjectPatProp::Assign(AssignPatProp {
            span: DUMMY_SP,
            key: Ident::dummy(),
            value: None,
        })
    }
}

impl MapWithMut for PatOrExpr {
    fn dummy() -> Self {
        PatOrExpr::Pat(Box::new(Pat::Ident(Ident::dummy().into())))
    }
}

impl MapWithMut for ClassExpr {
    fn dummy() -> Self {
        ClassExpr {
            ident: None,
            class: MapWithMut::dummy(),
        }
    }
}

impl MapWithMut for FnExpr {
    fn dummy() -> Self {
        FnExpr {
            ident: None,
            function: MapWithMut::dummy(),
        }
    }
}

impl MapWithMut for Class {
    fn dummy() -> Self {
        Class {
            span: Default::default(),
            decorators: Default::default(),
            body: Default::default(),
            super_class: Default::default(),
            is_abstract: Default::default(),
            type_params: Default::default(),
            super_type_params: Default::default(),
            implements: Default::default(),
        }
    }
}

impl MapWithMut for Function {
    fn dummy() -> Self {
        Function {
            params: Default::default(),
            decorators: Default::default(),
            span: Default::default(),
            body: Default::default(),
            is_generator: Default::default(),
            is_async: Default::default(),
            type_params: Default::default(),
            return_type: Default::default(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct CHashSet<V>
where
    V: Eq + Hash,
{
    inner: CloneMap<V, ()>,
}

impl<V> CHashSet<V>
where
    V: Eq + Hash,
{
    pub fn insert(&self, v: V) -> bool {
        self.inner.insert(v, ()).is_none()
    }
}

impl<V> Default for CHashSet<V>
where
    V: Eq + Hash,
{
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}

#[derive(Debug)]
pub(crate) struct CloneMap<K, V>
where
    K: Eq + Hash,
    V: Clone,
{
    #[cfg(feature = "concurrent")]
    inner: dashmap::DashMap<K, V>,
    #[cfg(not(feature = "concurrent"))]
    inner: std::cell::RefCell<std::collections::HashMap<K, V>>,
}

impl<K, V> Default for CloneMap<K, V>
where
    K: Eq + Hash,
    V: Clone,
{
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}

impl<K, V> CloneMap<K, V>
where
    K: Eq + Hash,
    V: Clone,
{
    #[cfg(feature = "concurrent")]
    pub fn get(&self, k: &K) -> Option<V> {
        if let Some(v) = self.inner.get(k) {
            Some(v.value().clone())
        } else {
            None
        }
    }

    #[cfg(not(feature = "concurrent"))]
    pub fn get(&self, k: &K) -> Option<V> {
        if let Some(v) = self.inner.borrow().get(k) {
            Some(v.clone())
        } else {
            None
        }
    }

    #[cfg(feature = "concurrent")]
    pub fn insert(&self, k: K, v: V) -> Option<V> {
        self.inner.insert(k, v)
    }

    #[cfg(not(feature = "concurrent"))]
    pub fn insert(&self, k: K, v: V) -> Option<V> {
        self.inner.borrow_mut().insert(k, v)
    }
}

pub(crate) struct HygieneRemover;

impl VisitMut for HygieneRemover {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, s: &mut Span) {
        *s = s.with_ctxt(SyntaxContext::empty())
    }
}

#[cfg(feature = "rayon")]
pub(crate) use rayon::join;

#[cfg(not(feature = "rayon"))]
pub(crate) fn join<A, B, RA, RB>(oper_a: A, oper_b: B) -> (RA, RB)
where
    A: FnOnce() -> RA,
    B: FnOnce() -> RB,
{
    (oper_a(), oper_b())
}

#[cfg(feature = "rayon")]
pub(crate) use rayon::iter::IntoParallelIterator;

/// Fake trait
#[cfg(not(feature = "rayon"))]
pub(crate) trait IntoParallelIterator: Sized + IntoIterator {
    fn into_par_iter(self) -> <Self as IntoIterator>::IntoIter {
        self.into_iter()
    }
}

#[cfg(not(feature = "rayon"))]
impl<T> IntoParallelIterator for T where T: IntoIterator {}
