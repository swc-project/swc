/// Should be cheap to clone.
pub trait Proxy: Clone {
    type AstNode: 'static;
}
