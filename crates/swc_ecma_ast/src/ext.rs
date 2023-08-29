use std::fmt::Debug;

pub struct ExtNode<T: ?Sized>(pub Box<T>);

pub trait AstNodeExt: 'static + Send + Sync + Debug {}

pub trait DeclExt: AstNodeExt {}

pub trait PatExt: AstNodeExt {}

pub trait ExprExt: AstNodeExt {}

pub trait StmtExt: AstNodeExt {}

pub trait ModuleDeclExt: AstNodeExt {}
