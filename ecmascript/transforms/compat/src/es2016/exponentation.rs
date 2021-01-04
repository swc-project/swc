use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::PatOrExprExt;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

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
pub fn exponentation() -> impl Fold {
    Exponentation
}

#[derive(Clone, Copy)]
struct Exponentation;

#[derive(Default)]
struct AssignFolder {
    vars: Vec<VarDeclarator>,
}

#[fast_path(ShouldFold)]
impl Fold for AssignFolder {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("**="),
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
                        return Expr::Assign(AssignExpr {
                            span,
                            left,
                            op: op!("="),
                            right,
                        });
                    }
                };
                Expr::Assign(AssignExpr {
                    span,
                    left,
                    op: op!("="),
                    right: Box::new(mk_call(span, Box::new(lhs.into()), right)),
                })
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

#[fast_path(ShouldFold)]
impl Fold for Exponentation {
    noop_fold_type!();

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl Exponentation {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + VisitWith<ShouldFold>,
        Vec<T>: FoldWith<Self> + VisitWith<ShouldFold>,
    {
        let stmts = stmts.fold_children_with(self);

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
                            declare: false,
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
        type_args: Default::default(),
    })
}

#[derive(Default)]
struct ShouldFold {
    found: bool,
}
impl Visit for ShouldFold {
    noop_visit_type!();

    fn visit_bin_expr(&mut self, e: &BinExpr, _: &dyn Node) {
        if e.op == op!("**") {
            self.found = true;
        }
    }

    fn visit_assign_expr(&mut self, e: &AssignExpr, _: &dyn Node) {
        if e.op == op!("**=") {
            self.found = true;
        }

        if !self.found {
            e.left.visit_with(e as _, self);
            e.right.visit_with(e as _, self);
        }
    }
}

impl Check for ShouldFold {
    fn should_handle(&self) -> bool {
        self.found
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;
    use swc_ecma_transforms_testing::test_exec;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Exponentation,
        babel_binary,
        "2 ** 2",
        "Math.pow(2, 2)"
    );

    test_exec!(
        ignore,
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
        |_| Exponentation,
        assign,
        r#"x **= 3"#,
        r#"x = Math.pow(x, 3)"#,
        ok_if_code_eq
    );

    //     test!(::swc_ecma_parser::Syntax::default(),
    //         |_| Exponentation,
    //         babel_4403,
    //         "var a, b;
    // a[`${b++}`] **= 1;",
    //         "var _ref;

    // var a, b;
    // _ref = `${b++}`, a[_ref] = Math.pow(a[_ref], 1);"
    //     );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Exponentation,
        issue_740,
        "self.a = 10 ** 2",
        "self.a = Math.pow(10, 2)",
        ok_if_code_eq
    );

    // https://github.com/swc-project/swc/pull/741/files
    // bu JakeChampion
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Exponentation,
        babel_binary_member_assignment_expression,
        "var x = {}; x.a = 2 ** 2",
        "var x = {}; x.a = Math.pow(2, 2)"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Exponentation,
        assign_to_object_property,
        r#"var self = {}; self.x **= 3"#,
        r#"var self = {}; var ref = self.x; self.x = Math.pow(ref, 3);"#,
        ok_if_code_eq
    );
}
