use ast::*;
use crate::util::{ExprFactory, StmtLike};
use swc_common::{Fold, FoldWith, Mark, Span, Spanned, DUMMY_SP};

/// `@babel/plugin-transform-exponentiation-operator`
///
/// # Example
///
/// ## In
///
/// ```js
/// let x = 10 ** 2;
///
/// x **= 3;
/// ```
///
/// ## Out
///
/// ```js
/// let x = Math.pow(10, 2);
///
/// x = Math.pow(x, 3);
/// ```
#[derive(Debug, Clone, Copy)]
pub struct Exponentation;

#[derive(Default)]
struct AssignFolder {
    vars: Vec<VarDeclarator>,
}

impl Fold<Expr> for AssignFolder {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("**="),
                right,
            }) => {
                let lhs: Ident = match left {
                    PatOrExpr::Pat(box Pat::Ident(ref i))
                    | PatOrExpr::Expr(box Expr::Ident(ref i)) => i.clone(),

                    // unimplemented
                    PatOrExpr::Expr(ref e) => {
                        let mark = Mark::fresh(Mark::root());
                        let span = e.span().apply_mark(mark);
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: quote_ident!(span, "ref").into(),
                            init: Some(e.clone()),
                        });
                        quote_ident!(span, "ref")
                    }

                    left => {
                        return Expr::Assign(AssignExpr {
                            span,
                            left,
                            op: op!("="),
                            right,
                        })
                    }
                };
                return Expr::Assign(AssignExpr {
                    span,
                    left,
                    op: op!("="),
                    right: box mk_call(span, box lhs.into(), right),
                });
            }
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("**"),
                right,
            }) => mk_call(span, left, right),
            _ => e,
        }
    }
}

impl<T: StmtLike> Fold<Vec<T>> for Exponentation
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = vec![];

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = AssignFolder::default();
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                        }))));
                    }

                    buf.push(T::from_stmt(stmt));
                }
            }
        }

        buf
    }
}

fn mk_call(span: Span, left: Box<Expr>, right: Box<Expr>) -> Expr {
    // Math.pow()
    Expr::Call(CallExpr {
        span,
        callee: member_expr!(span, Math.pow).as_callee(),

        args: vec![left.as_arg(), right.as_arg()],
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(Exponentation, babel_binary, "2 ** 2", "Math.pow(2, 2)");

    test_exec!(
        ignore,
        |_| Exponentation,
        babel_comprehensive,
        r#"expect(2 ** 3).toBe(8);
expect(3 * 2 ** 3).toBe(24);
var x = 2;
expect(2 ** ++x).toBe(8);
expect(2 ** -1 * 2).toBe(1);

var calls = 0;
var q = {q: 3};
var o = {
  get p() {
    calls++;
    return q;
  }
};

o.p.q **= 2;
expect(calls).toBe(1);
expect(o.p.q).toBe(9);

expect(2 ** (3 ** 2)).toBe(512);
expect(2 ** 3 ** 2).toBe(512);"#
    );

    test_exec!(
        // FIXME
        ignore,
        |_| Exponentation,
        babel_memoize_object,
        r#"var counters = 0;
Object.defineProperty(global, "reader", {
  get: function () {
    counters += 1;
    return { x: 2 };
  },
  configurable: true
});
reader.x **= 2;
expect(counters).toBe(1);"#
    );

    test!(
        Exponentation,
        assign,
        r#"x **= 3"#,
        r#"x = Math.pow(x, 3)"#,
        ok_if_code_eq
    );

    //     test!(
    //         Exponentation,
    //         babel_4403,
    //         "var a, b;
    // a[`${b++}`] **= 1;",
    //         "var _ref;

    // var a, b;
    // _ref = `${b++}`, a[_ref] = Math.pow(a[_ref], 1);"
    //     );
}
