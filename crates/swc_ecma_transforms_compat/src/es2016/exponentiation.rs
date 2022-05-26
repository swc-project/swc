use std::mem::take;

use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{member_expr, private_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

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
#[tracing::instrument(level = "info", skip_all)]
pub fn exponentiation() -> impl Fold + VisitMut {
    as_folder(Exponentiation::default())
}

#[derive(Default)]
struct Exponentiation {
    vars: Vec<VarDeclarator>,
}

#[swc_trace]
impl VisitMut for Exponentiation {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op @ op!("**="),
                right,
            }) => {
                let lhs: Ident = match left {
                    _ if left.as_ident().is_some() => left.as_ident().unwrap().clone(),

                    // unimplemented
                    PatOrExpr::Expr(ref e) => {
                        let ref_ident = private_ident!(e.span(), "ref");

                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: ref_ident.clone().into(),
                            init: Some(e.clone()),
                            definite: false,
                        });
                        ref_ident
                    }

                    left => {
                        *e = Expr::Assign(AssignExpr {
                            span: *span,
                            left: left.take(),
                            op: op!("="),
                            right: right.take(),
                        });
                        return;
                    }
                };

                *op = op!("=");
                *right = Box::new(mk_call(*span, Box::new(lhs.into()), right.take()));
            }
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("**"),
                right,
            }) => {
                *e = mk_call(*span, left.take(), right.take());
            }
            _ => {}
        }
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        let mut new = vec![];

        for s in stmts.take() {
            stmts.visit_mut_children_with(self);
            new.push(s);

            // Add variable declaration
            // e.g. var ref
            if !self.vars.is_empty() {
                new.push(
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: take(&mut self.vars),
                        declare: false,
                    }))
                    .into(),
                );
            }
        }

        *stmts = new;
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let mut new = vec![];

        for s in stmts.take() {
            stmts.visit_mut_children_with(self);
            new.push(s);

            // Add variable declaration
            // e.g. var ref
            if !self.vars.is_empty() {
                new.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: take(&mut self.vars),
                    declare: false,
                })));
            }
        }

        *stmts = new;
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn mk_call(span: Span, left: Box<Expr>, right: Box<Expr>) -> Expr {
    // Math.pow()
    Expr::Call(CallExpr {
        span,
        callee: member_expr!(span, Math.pow).as_callee(),

        args: vec![left.as_arg(), right.as_arg()],
        type_args: Default::default(),
    })
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::{test, test_exec};

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        babel_binary,
        "2 ** 2",
        "Math.pow(2, 2)"
    );

    test_exec!(
        ignore,
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
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
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
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
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        assign,
        r#"x **= 3"#,
        r#"x = Math.pow(x, 3)"#,
        ok_if_code_eq
    );

    //     test!(::swc_ecma_parser::Syntax::default(),
    //         |_| exponentiation(),
    //         babel_4403,
    //         "var a, b;
    // a[`${b++}`] **= 1;",
    //         "var _ref;

    // var a, b;
    // _ref = `${b++}`, a[_ref] = Math.pow(a[_ref], 1);"
    //     );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        issue_740,
        "self.a = 10 ** 2",
        "self.a = Math.pow(10, 2)",
        ok_if_code_eq
    );

    // https://github.com/swc-project/swc/pull/741/files
    // bu JakeChampion
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        babel_binary_member_assignment_expression,
        "var x = {}; x.a = 2 ** 2",
        "var x = {}; x.a = Math.pow(2, 2)"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentiation(),
        assign_to_object_property,
        r#"var self = {}; self.x **= 3"#,
        r#"var self = {}; var ref = self.x; self.x = Math.pow(ref, 3);"#,
        ok_if_code_eq
    );
}
