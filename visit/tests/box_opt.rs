use swc_visit::define;

pub enum Expr {
    Int(usize),
    Str(String),
}

pub struct ExprStmt {
    pub expr: Expr,
}

pub struct Opt {
    pub expr: Option<Expr>,
}

pub struct Boxed {
    pub expr: Box<Expr>,
}

pub struct OptBoxed {
    pub expr: Option<Box<Expr>>,
}

pub trait Node {}

impl<T> Node for T {}

define!({
    pub enum Expr {
        Int(usize),
        Str(String),
    }

    pub struct ExprStmt {
        pub expr: Expr,
    }

    pub struct Opt {
        pub expr: Option<Expr>,
    }

    pub struct Boxed {
        pub expr: Box<Expr>,
    }

    pub struct OptBoxed {
        pub expr: Option<Box<Expr>>,
    }
});
