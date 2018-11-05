use swc_common::{pos::Mark, Fold, FoldWith};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy)]
pub struct Exponentation;

impl Fold<Expr> for Exponentation {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Bin(BinExpr {
                left,
                op: op!("**"),
                right,
                span,
            }) => {
                let span = span.apply_mark(Mark::fresh(Mark::root()));

                // Math.pow()
                Expr::Call(CallExpr {
                    span,
                    callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(
                            box Ident {
                                span,
                                sym: "Math".into(),
                            }
                            .into(),
                        ),
                        prop: box Ident {
                            span,
                            sym: "pow".into(),
                        }
                        .into(),
                        computed: false,
                    })),

                    args: vec![
                        ExprOrSpread {
                            expr: left,
                            spread: None,
                        },
                        ExprOrSpread {
                            expr: right,
                            spread: None,
                        },
                    ],
                })
            }
            _ => e,
        }
    }
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
