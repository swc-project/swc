use swc_ecma_ast::*;
use swc_common::{Fold, FoldWith};

pub(super) struct ThisInStaticFolder {
    pub ident: Ident,
}

impl Fold<Expr> for ThisInStaticFolder {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::This(..) => Expr::Ident(self.ident.clone()),
            _ => e,
        }
    }
}

macro_rules! nop {
    ($T:ty) => {
        impl Fold<$T> for ThisInStaticFolder {
            fn fold(&mut self, n: $T) -> $T {
                n
            }
        }
    };
}

nop!(Function);
nop!(Class);
