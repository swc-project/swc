use std::fmt::Debug;

pub trait AstNodeExt: 'static + Send + Sync + Debug {}

pub trait PatExt: AstNodeExt {}

pub trait ExprExt: AstNodeExt {}

pub trait StmtExt: AstNodeExt {}

pub trait ModuleDeclExt: AstNodeExt {}
