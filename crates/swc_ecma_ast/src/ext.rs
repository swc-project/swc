use std::{fmt::Debug, hash::Hash, marker::PhantomData};

use swc_common::{EqIgnoreSpan, Span, Spanned};

#[derive(Debug)]
pub struct ExtNode<T: ?Sized + AstNodeExt>(pub Box<T>);

impl<T> Clone for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn clone(&self) -> Self {
        todo!()
    }
}

impl<T> Hash for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        todo!()
    }
}

impl<T> Spanned for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn span(&self) -> Span {
        self.0.span()
    }
}

impl<'de, T> serde::Deserialize<'de> for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        todo!()
    }
}

impl<T> serde::Serialize for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        todo!()
    }
}

impl<T> PartialEq for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn eq(&self, other: &Self) -> bool {
        todo!()
    }
}

impl<T> Eq for ExtNode<T> where T: ?Sized + AstNodeExt {}

impl<T> EqIgnoreSpan for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        todo!()
    }
}

#[cfg(feature = "rkyv-impl")]
impl<T> rkyv::Archive for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
{
    type Archived = ArchivedExtNode<T>;
    type Resolver = ExtNodeResolver<T>;

    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        todo!()
    }
}

#[cfg(feature = "rkyv-impl")]
impl<S, T> rkyv::Serialize<S> for ExtNode<T>
where
    T: ?Sized + AstNodeExt,
    S: rkyv::ser::Serializer,
{
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        todo!()
    }
}

#[cfg(feature = "rkyv-impl")]
struct ArchivedExtNode<T: ?Sized> {
    marker: PhantomData<T>,
}

#[cfg(feature = "rkyv-impl")]
struct ExtNodeResolver<T: ?Sized> {
    marker: PhantomData<T>,
}

pub trait AstNodeExt: 'static + Send + Sync + Debug + Spanned {}

pub trait DeclExt: AstNodeExt {}

pub trait PatExt: AstNodeExt {}

pub trait ExprExt: AstNodeExt {}

pub trait StmtExt: AstNodeExt {}

pub trait ModuleDeclExt: AstNodeExt {}
