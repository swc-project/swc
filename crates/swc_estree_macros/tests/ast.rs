use swc_estree_macros::estree_ast;

#[estree_ast(flavors(babel, acorn))]
pub mod ast {

    pub enum Expr {
        #[flavor(babel)]
        Lit(Lit),
    }

    #[flavor(babel)]
    pub enum Lit {}

    #[flavor(acorn)]
    pub struct Lit {}
}
