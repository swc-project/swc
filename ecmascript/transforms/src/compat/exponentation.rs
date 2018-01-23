use swc_common::{FoldWith, Folder};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy)]
pub struct Exponentation;

impl Folder<ExprKind> for Exponentation {
    fn fold(&mut self, e: ExprKind) -> ExprKind {
        let e = e.fold_children(self);

        match e {
            ExprKind::Bin(BinExpr {
                left,
                op: op!("**"),
                right,
            }) => {
                // TODO: Apply context
                let span = left.span.to(right.span);

                ExprKind::Call(CallExpr {
                    callee: ExprOrSuper::Expr(box Expr {
                        span,
                        node: ExprKind::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(
                                Ident {
                                    span,
                                    sym: "Math".into(),
                                }.into(),
                            ),
                            prop: Ident {
                                span,
                                sym: "pow".into(),
                            }.into(),
                            computed: false,
                        }),
                    }),

                    args: vec![ExprOrSpread::Expr(left), ExprOrSpread::Expr(right)],
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
