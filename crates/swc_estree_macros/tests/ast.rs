use swc_estree_macros::estree_ast;

#[estree_ast(flavors(babel, acorn))]
pub mod ast {

    pub enum Expr {}
}
