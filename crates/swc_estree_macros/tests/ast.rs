use swc_estree_macros::estree_ast;

#[estree_ast(flavors(babel, acorn))]
pub mod ast {
    use swc_common::ast_serde;

    pub enum Expr {
        Lit(Lit),
    }

    #[flavor(babel)]
    #[ast_serde]
    #[derive(Debug, Clone, PartialEq)]
    pub enum Lit {
        #[tag("Bool")]
        Bool(bool),
    }

    #[flavor(acorn)]
    #[ast_serde("Literal")]
    #[derive(Debug, Clone, PartialEq)]
    pub struct Lit {}

    impl From<Lit> for Expr {
        fn from(lit: Lit) -> Self {
            Expr::Lit(lit)
        }
    }
}
