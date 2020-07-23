use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

pub trait PatOrExprExt {
    fn as_ref(&self) -> &PatOrExpr;
    fn as_mut(&mut self) -> &mut PatOrExpr;

    fn as_expr(&mut self) -> Option<&Expr> {
        match self.as_ref() {
            PatOrExpr::Expr(e) => Some(e),
            PatOrExpr::Pat(p) => match &**p {
                Pat::Expr(e) => Some(e),
                _ => None,
            },
        }
    }

    fn as_expr_mut(&mut self) -> Option<&mut Expr> {
        match self.as_mut() {
            PatOrExpr::Expr(e) => Some(&mut e),
            PatOrExpr::Pat(p) => match &**p {
                Pat::Expr(e) => Some(&mut e),
                _ => None,
            },
        }
    }

    fn as_ident(&self) -> Option<&Ident> {
        if let Some(expr) = self.as_expr() {
            match expr {
                Expr::Ident(i) => return Some(i),
                _ => {}
            }
        }

        match self.as_ref() {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => Some(i),
                _ => None,
            },
        }
    }

    fn as_ident_mut(&mut self) -> Option<&mut Ident> {
        if let Some(expr) = self.as_expr_mut() {
            match expr {
                Expr::Ident(i) => return Some(i),
                _ => {}
            }
        }

        match self.as_mut() {
            PatOrExpr::Pat(p) => match p {
                Pat::Ident(i) => Some(&mut *i),

                _ => None,
            },
            _ => None,
        }
    }
}

impl PatOrExprExt for PatOrExpr {
    fn as_ref(&self) -> &PatOrExpr {
        self
    }

    fn as_mut(&mut self) -> &mut PatOrExpr {
        self
    }
}
