use crate::util::ExprFactory;
use swc_common::{Fold, FoldWith, Span};
use swc_ecma_ast::*;

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

impl Fold<Expr> for Exponentation {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("**="),
                right,
            }) => {
                let i = match left {
                    PatOrExpr::Pat(box Pat::Ident(ref i)) => i.clone(),
                    PatOrExpr::Expr(box Expr::Ident(ref i)) => i.clone(),

                    // unimplemented
                    _ => {
                        println!("!!!{:?}", left);
                        return Expr::Assign(AssignExpr {
                            span,
                            left,
                            op: op!("**="),
                            right,
                        });
                    }
                };
                return Expr::Assign(AssignExpr {
                    span: mark!(span),
                    left,
                    op: op!("="),
                    right: box mk_call(span, box Expr::Ident(i), right),
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

fn mk_call(span: Span, left: Box<Expr>, right: Box<Expr>) -> Expr {
    let span = mark!(span);

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
        Exponentation,
        babel_comprehensive,
        r#"assert.equal(8, 2 ** 3);
assert.equal(24, 3 * 2 ** 3);
var x = 2;
assert.equal(8, 2 ** ++x);
assert.equal(1, 2 ** -1 * 2);

var calls = 0;
var q = {q: 3};
var o = {
  get p() {
    calls++;
    return q;
  }
};

o.p.q **= 2;
assert.equal(1, calls);
assert.equal(9, o.p.q);

assert.equal(512, 2 ** (3 ** 2));
assert.equal(512, 2 ** 3 ** 2);"#
    );

    test_exec!(
        Exponentation,
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
assert.ok(counters === 1);"#
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
