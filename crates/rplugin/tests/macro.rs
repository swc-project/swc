pub struct BinExpr {
    pub left: Box<Expr>,
    pub op: String,
    pub right: Box<Expr>,
}

pub enum Expr {
    Lit(Lit),
    Bin(BinExpr),
}

pub enum Lit {
    Number(usize),
}

#[rplugin::ast_for_plugin(crate)]
mod plugin {

    pub struct BinExpr {
        pub left: Box<Expr>,
        pub op: String,
        pub right: Box<Expr>,
    }

    pub enum Expr {
        Lit(Lit),
        Bin(BinExpr),
    }

    pub enum Lit {
        Number(usize),
    }
}
