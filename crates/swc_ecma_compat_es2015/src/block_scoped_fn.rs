use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::IdentUsageFinder;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn block_scoped_functions() -> impl Pass {
    visit_mut_pass(BlockScopedFns)
}

#[derive(Clone, Copy)]
struct BlockScopedFns;

#[swc_trace]
impl VisitMut for BlockScopedFns {
    noop_visit_mut_type!(fail);

    fn visit_mut_function(&mut self, n: &mut Function) {
        let Some(body) = &mut n.body else { return };

        n.params.visit_mut_with(self);

        // skip function scope
        body.visit_mut_children_with(self);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        n.visit_mut_children_with(self);

        let mut stmts = Vec::with_capacity(n.stmts.len());
        let mut extra_stmts = Vec::with_capacity(n.stmts.len());

        for stmt in n.stmts.take() {
            if let Stmt::Expr(ExprStmt { ref expr, .. }) = stmt {
                if let Expr::Lit(Lit::Str(..)) = &**expr {
                    stmts.push(stmt);
                    continue;
                }
            }

            if let Stmt::Decl(Decl::Fn(decl)) = stmt {
                if IdentUsageFinder::find(&decl.ident.to_id(), &decl.function) {
                    extra_stmts.push(decl.into());
                    continue;
                }
                stmts.push(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: decl.ident.clone().into(),
                            init: Some(Box::new(Expr::Fn(FnExpr {
                                ident: Some(decl.ident),
                                function: decl.function,
                            }))),
                            definite: false,
                        }],
                        ..Default::default()
                    }
                    .into(),
                )
            } else {
                extra_stmts.push(stmt)
            }
        }

        stmts.append(&mut extra_stmts);

        n.stmts = stmts
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        hoisting,
        r#"
{
    function fn1() { fn2(); }

    fn1();

    function fn2() { }
}
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        basic,
        r#"{
  function name (n) {
    return n;
  }
}

name("Steve");"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        basic_2,
        r#"
        {
            function foo() {
                return function bar() {
                    {
                        function baz() {}
                    }
                };
                function baz() {}
                {
                    function bar() {}
                    {
                        function bar() {}
                    }
                }
            }
        }
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        issue_271,
        "
function foo(scope) {
    scope.startOperation = startOperation;

    function startOperation(operation) {
        scope.agentOperation = operation;
    }
}
"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        issue_288_1,
        "function components_Link_extends() { components_Link_extends = Object.assign || function \
         (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for \
         (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { \
         target[key] = source[key]; } } } return target; }; return \
         components_Link_extends.apply(this, arguments); }

"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        issue_288_2,
        "function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        hoisting_directives,
        "function foo() {
            'use strict';
            function _interop_require_default(obj) {
              return obj && obj.__esModule ? obj : {
                default: obj
              };
            }
        }"
    );
}
