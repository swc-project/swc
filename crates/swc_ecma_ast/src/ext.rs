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

pub trait AstNodeExt: 'static + Send + Sync + Debug + Spanned {}

pub trait DeclExt: AstNodeExt {}

pub trait PatExt: AstNodeExt {}

pub trait ExprExt: AstNodeExt {}

pub trait StmtExt: AstNodeExt {}

pub trait ModuleDeclExt: AstNodeExt {}
