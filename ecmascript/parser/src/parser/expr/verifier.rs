use super::*;
use swc_common::{FoldWith, Folder, Span, Spanned};

impl<'a, I: Input> Parser<'a, I> {
    pub(in parser) fn verify_expr(&self, expr: Box<Expr>) -> PResult<'a, (Box<Expr>)> {
        let mut v = Verifier { errors: vec![] };

        let expr = v.fold(expr);

        if v.errors.is_empty() {
            return Ok(expr);
        }

        //TODO
        let (span, error) = v.errors.into_iter().next().unwrap();
        syntax_error!(self, span, error)
    }
}

pub(super) struct Verifier {
    pub errors: Vec<(Span, SyntaxError)>,
}

impl Folder<Expr> for Verifier {
    fn fold(&mut self, e: Expr) -> Expr {
        match e {
            Expr::Fn(..) | Expr::Arrow(..) => return e,
            _ => e.fold_children(self),
        }
    }
}
impl Folder<ArrayLit> for Verifier {
    fn fold(&mut self, mut arr: ArrayLit) -> ArrayLit {
        let len = {
            let arr_len = arr.elems.len();
            let count_of_none = arr.elems.iter().rev().take_while(|e| e.is_none()).count();

            arr_len - count_of_none
        };

        arr.elems.truncate(len);
        arr.elems.shrink_to_fit();
        arr.fold_children(self)
    }
}

impl Folder<Prop> for Verifier {
    fn fold(&mut self, p: Prop) -> Prop {
        match p {
            Prop::Assign { .. } => {
                self.errors.push((p.span(), SyntaxError::Unexpected));
                return p;
            }
            _ => p.fold_children(self),
        }
    }
}
