use std::fmt::Debug;

use swc_common::{Span, Spanned};

pub struct ExtNode<T: ?Sized + AstNodeExt>(pub Box<T>);

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

pub trait AstNodeExt: 'static + Send + Sync + Debug + Spanned {}

pub trait DeclExt: AstNodeExt {}

pub trait PatExt: AstNodeExt {}

pub trait ExprExt: AstNodeExt {}

pub trait StmtExt: AstNodeExt {}

pub trait ModuleDeclExt: AstNodeExt {}
