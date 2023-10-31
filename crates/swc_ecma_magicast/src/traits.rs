use crate::data::Data;

/// Should be cheap to clone.
pub trait Proxy: Clone {
    type AstNode: 'static;

    fn data<'a>(&'a self) -> &Data<'a, Self::AstNode>;
}
