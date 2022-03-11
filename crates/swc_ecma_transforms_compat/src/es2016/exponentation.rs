use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{ParExplode, Parallel};
use swc_ecma_transforms_macros::parallel;
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
pub fn exponentation() -> impl Fold + VisitMut {
    as_folder(Exponentation::default())
}

#[derive(Default)]
struct Exponentation {
    vars: Vec<VarDeclarator>,
}

impl Parallel for Exponentation {
    fn create(&self) -> Self {
        Self::default()
    }

    fn merge(&mut self, other: Self) {
        self.vars.extend(other.vars);
    }
}

#[swc_trace]
impl ParExplode for Exponentation {
    fn after_one_stmt(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.vars.is_empty() {
            stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: self.vars.take(),
                declare: false,
            })));
        }
    }

    fn after_one_module_item(&mut self, stmts: &mut Vec<ModuleItem>) {
        if !self.vars.is_empty() {
            stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: self.vars.take(),
                declare: false,
            }))));
        }
    }
}

#[swc_trace]
#[parallel(explode)]
impl VisitMut for Exponentation {
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
        |_| exponentation(),
        babel_binary,
        "2 ** 2",
        "Math.pow(2, 2)"
    );

    test_exec!(
        ignore,
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentation(),
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
        |_| exponentation(),
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
        |_| exponentation(),
        assign,
        r#"x **= 3"#,
        r#"x = Math.pow(x, 3)"#,
        ok_if_code_eq
    );

    //     test!(::swc_ecma_parser::Syntax::default(),
    //         |_| exponentation(),
    //         babel_4403,
    //         "var a, b;
    // a[`${b++}`] **= 1;",
    //         "var _ref;

    // var a, b;
    // _ref = `${b++}`, a[_ref] = Math.pow(a[_ref], 1);"
    //     );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentation(),
        issue_740,
        "self.a = 10 ** 2",
        "self.a = Math.pow(10, 2)",
        ok_if_code_eq
    );

    // https://github.com/swc-project/swc/pull/741/files
    // bu JakeChampion
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentation(),
        babel_binary_member_assignment_expression,
        "var x = {}; x.a = 2 ** 2",
        "var x = {}; x.a = Math.pow(2, 2)"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| exponentation(),
        assign_to_object_property,
        r#"var self = {}; self.x **= 3"#,
        r#"var self = {}; var ref = self.x; self.x = Math.pow(ref, 3);"#,
        ok_if_code_eq
    );
}
