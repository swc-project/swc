//! Do not use: This is not a public api and it can be changed without a version
//! bump.

use std::ops::DerefMut;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

/// Do not use: This is not a public api and it can be changed without a version
/// bump.
pub trait PatOrExprExt: AsOptExpr {
    fn as_ref(&self) -> &PatOrExpr;
    fn as_mut(&mut self) -> &mut PatOrExpr;

    fn as_ident(&self) -> Option<&Ident> {
        if let Some(Expr::Ident(i)) = self.as_expr() {
            return Some(i);
        }

        match self.as_ref() {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => Some(&i.id),
                _ => None,
            },
        }
    }

    fn as_ident_mut(&mut self) -> Option<&mut Ident> {
        match self.as_mut() {
            PatOrExpr::Pat(p) => match **p {
                Pat::Ident(ref mut i) => Some(&mut i.id),
                Pat::Expr(ref mut e) => match e.deref_mut() {
                    Expr::Ident(i) => Some(i),
                    _ => None,
                },
                _ => None,
            },
            PatOrExpr::Expr(ref mut e) => match e.deref_mut() {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
        }
    }

    fn normalize_expr(self) -> Self;

    fn normalize_ident(self) -> Self;
}

impl PatOrExprExt for PatOrExpr {
    fn as_ref(&self) -> &PatOrExpr {
        self
    }

    fn as_mut(&mut self) -> &mut PatOrExpr {
        self
    }

    fn normalize_expr(self) -> Self {
        match self {
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => PatOrExpr::Expr(expr),
                _ => PatOrExpr::Pat(pat),
            },
            _ => self,
        }
    }

    fn normalize_ident(self) -> Self {
        match self {
            PatOrExpr::Expr(expr) => match *expr {
                Expr::Ident(i) => PatOrExpr::Pat(i.into()),
                _ => PatOrExpr::Expr(expr),
            },
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => match *expr {
                    Expr::Ident(i) => PatOrExpr::Pat(i.into()),
                    _ => PatOrExpr::Expr(expr),
                },
                _ => PatOrExpr::Pat(pat),
            },
        }
    }
}

pub trait ExprRefExt: ExprExt {
    fn as_ident(&self) -> Option<&Ident> {
        match self.as_expr() {
            Expr::Ident(ref i) => Some(i),
            _ => None,
        }
    }
}

impl<T> ExprRefExt for T where T: ExprExt {}

/// Do not use: This is not a public api and it can be changed without a version
/// bump.
pub trait AsOptExpr {
    fn as_expr(&self) -> Option<&Expr>;
    fn as_expr_mut(&mut self) -> Option<&mut Expr>;
}

impl AsOptExpr for PatOrExpr {
    fn as_expr(&self) -> Option<&Expr> {
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
            PatOrExpr::Expr(e) => Some(e.deref_mut()),
            PatOrExpr::Pat(p) => match &mut **p {
                Pat::Expr(e) => Some(e.deref_mut()),
                _ => None,
            },
        }
    }
}

impl AsOptExpr for Callee {
    fn as_expr(&self) -> Option<&Expr> {
        match self {
            Callee::Super(_) | Callee::Import(_) => None,
            Callee::Expr(e) => Some(e),
        }
    }

    fn as_expr_mut(&mut self) -> Option<&mut Expr> {
        match self {
            Callee::Super(_) | Callee::Import(_) => None,
            Callee::Expr(e) => Some(e),
        }
    }
}

impl<N> AsOptExpr for Option<N>
where
    N: AsOptExpr,
{
    fn as_expr(&self) -> Option<&Expr> {
        match self {
            Some(n) => n.as_expr(),
            None => None,
        }
    }

    fn as_expr_mut(&mut self) -> Option<&mut Expr> {
        match self {
            None => None,
            Some(n) => n.as_expr_mut(),
        }
    }
}
