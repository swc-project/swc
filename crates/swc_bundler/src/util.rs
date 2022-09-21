#![allow(dead_code)]

use std::{clone::Clone, cmp::Eq, hash::Hash};

use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

#[cfg(feature = "concurrent")]
pub(crate) type Readonly<T> = std::sync::Arc<T>;

#[cfg(not(feature = "concurrent"))]
pub(crate) type Readonly<T> = T;

const TRACK: bool = false;

pub(crate) trait VarDeclaratorExt: Into<VarDeclarator> {
    fn into_module_item(self, injected_ctxt: SyntaxContext, name: &str) -> ModuleItem {
        ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: DUMMY_SP.with_ctxt(injected_ctxt),
            kind: VarDeclKind::Const,
            declare: false,
            decls: if TRACK {
                vec![
                    self.into(),
                    Str {
                        span: DUMMY_SP,
                        raw: None,
                        value: name.into(),
                    }
                    .assign_to(Ident::new("INJECTED_FROM".into(), DUMMY_SP)),
                ]
            } else {
                vec![self.into()]
            },
        }))))
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
            if let Expr::Ident(rhs) = &init {
                debug_assert_ne!(lhs, rhs.to_id());
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
    // pub fn insert(&self, v: V) -> bool {
    //     self.inner.insert(v, ()).is_none()
    // }
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
    inner: dashmap::DashMap<K, V, ahash::RandomState>,
    #[cfg(not(feature = "concurrent"))]
    inner: std::cell::RefCell<swc_common::collections::AHashMap<K, V>>,
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
        self.inner.get(k).map(|v| v.value().clone())
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
pub(crate) fn join<A, B, RA, RB>(op_a: A, op_b: B) -> (RA, RB)
where
    A: FnOnce() -> RA,
    B: FnOnce() -> RB,
{
    (op_a(), op_b())
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
