use ast::*;
use crate::util::StmtLike;
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-destructuring`
///
/// # Example
/// ## In
/// ```js
/// let {x, y} = obj;
///
/// let [a, b, ...rest] = arr;
/// ```
/// ## Out
/// ```js
/// let _obj = obj,
///     x = _obj.x,
///     y = _obj.y;
///
/// let _arr = arr,
///     _arr2 = _toArray(_arr),
///     a = _arr2[0],
///     b = _arr2[1],
///     rest = _arr2.slice(2);
/// ```
pub fn destructuring() -> impl Fold<Module> {
    Destructuring
}

#[derive(Debug, Clone, Copy, Default)]
struct Destructuring;

impl Fold<Vec<VarDeclarator>> for Destructuring {
    fn fold(&mut self, declarators: Vec<VarDeclarator>) -> Vec<VarDeclarator> {
        let is_complex = declarators.iter().any(|d| match d.name {
            Pat::Ident(..) => false,
            _ => true,
        });
        if !is_complex {
            return declarators;
        }

        let mut decls = vec![];

        for decl in declarators {
            match decl.name {
                Pat::Ident(..) => decls.push(decl),
                Pat::Array(ArrayPat { span, elems }) => {
                    assert!(
                        decl.init.is_some(),
                        "Desturing pattern binding requires initializer"
                    );
                    let mark = Mark::fresh(Mark::root());
                    let ref_ident = quote_ident!(span.apply_mark(mark), "ref");

                    let ref_var = VarDeclarator {
                        span,
                        name: Pat::Ident(ref_ident.clone()),
                        init: decl.init,
                    };
                    decls.push(ref_var);
                    for (i, elem) in elems.into_iter().enumerate() {
                        let elem = match elem {
                            Some(elem) => elem,
                            None => continue,
                        };

                        let var_decl = VarDeclarator {
                            span: elem.span(),
                            // This might be pattern.
                            // So we fold it again.
                            name: elem,
                            init: Some(box make_ref_idx_expr(&ref_ident, i)),
                        };
                        decls.extend(vec![var_decl].fold_with(self));
                    }
                }
                _ => unimplemented!("Pattern {:?}", decl),
            }
        }

        decls
    }
}

impl Destructuring {
    fn fold_assign(&mut self, expr: Expr) -> Result<(VarDecl, Expr), Expr> {
        match expr {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("="),
                right,
            }) => match left {
                PatOrExpr::Pat(pat) => match *pat {
                    Pat::Ident(..) => {
                        return Err(Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Pat(pat),
                            op: op!("="),
                            right,
                        }))
                    }
                    Pat::Array(ArrayPat { span, elems }) => {
                        let mark = Mark::fresh(Mark::root());
                        let ref_ident = quote_ident!(span.apply_mark(mark), "ref");

                        let ref_var = VarDeclarator {
                            span,
                            name: Pat::Ident(ref_ident.clone()),
                            init: Some(right),
                        };
                        let var_decl = VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            decls: vec![ref_var],
                        };

                        let mut exprs = vec![];

                        for (i, elem) in elems.into_iter().enumerate() {
                            let elem = match elem {
                                Some(elem) => elem,
                                None => continue,
                            };

                            exprs.push(box Expr::Assign(AssignExpr {
                                span: elem.span(),
                                op: op!("="),
                                left: PatOrExpr::Pat(box elem),
                                right: box make_ref_idx_expr(&ref_ident, i),
                            }));
                        }

                        Ok((
                            var_decl,
                            Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs,
                            }),
                        ))
                    }
                    _ => unimplemented!("assignment pattern {:?}", pat),
                },
                _ => {
                    return Err(Expr::Assign(AssignExpr {
                        span,
                        left,
                        op: op!("="),
                        right,
                    }))
                }
            },
            _ => Err(expr),
        }
    }
}

impl<T: StmtLike> Fold<Vec<T>> for Destructuring
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = vec![];
        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => match stmt {
                    Stmt::Expr(box expr) => {
                        let res = self.fold_assign(expr);
                        match res {
                            Err(expr) => buf.push(T::from_stmt(Stmt::Expr(box expr))),
                            Ok((var_decl, expr)) => {
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(var_decl))));
                                buf.push(T::from_stmt(Stmt::Expr(box expr)));
                            }
                        }
                    }
                    _ => buf.push(T::from_stmt(stmt)),
                },
            }
        }

        buf
    }
}

fn make_ref_idx_expr(ref_ident: &Ident, i: usize) -> Expr {
    Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: ExprOrSuper::Expr(box ref_ident.clone().into()),
        // Use `[]`
        computed: true,
        prop: box Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: i as f64,
        })),
    })
}
