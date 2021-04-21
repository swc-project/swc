use swc_common::ast_serde;

#[ast_serde]
pub enum Ambiguous {
    #[tag("A")]
    A(A),
    #[tag("B")]
    B(B),
}
#[ast_serde("B")]
pub struct A {}

#[ast_serde("B")]
pub struct B {}
