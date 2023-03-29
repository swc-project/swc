use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::IdentUsageFinder;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn block_scoped_functions() -> impl Fold + VisitMut {
    as_folder(BlockScopedFns)
}

#[derive(Clone, Copy)]
struct BlockScopedFns;

#[swc_trace]
impl VisitMut for BlockScopedFns {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        let mut stmts = Vec::with_capacity(items.len());
        let mut extra_stmts = Vec::with_capacity(items.len());

        for mut stmt in items.take() {
            if let Stmt::Expr(ExprStmt { ref expr, .. }) = stmt {
                if let Expr::Lit(Lit::Str(..)) = &**expr {
                    stmts.push(stmt);
                    continue;
                }
            }

            // This is to preserve function Class()
            if stmt.span().is_dummy() {
                extra_stmts.push(stmt)
            } else {
                match stmt {
                    Stmt::Decl(Decl::Fn(decl)) => {
                        if IdentUsageFinder::find(&decl.ident.to_id(), &decl.function) {
                            extra_stmts.push(Stmt::Decl(Decl::Fn(decl)));
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
                                declare: false,
                            }
                            .into(),
                        )
                    }
                    _ => {
                        stmt.visit_mut_children_with(self);
                        extra_stmts.push(stmt)
                    }
                }
            }
        }

        stmts.append(&mut extra_stmts);

        *items = stmts
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
"#,
        r#"
{
    let fn1 = function fn1() {
        fn2();
    };
    let fn2 = function fn2() {
    };
    fn1();
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

name("Steve");"#,
        r#"{
  let name = function name(n) {
    return n;
  };
}
name("Steve");
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
",
        "
function foo(scope) {
    let startOperation = function startOperation(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
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

",
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
",
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
            function _interopRequireDefault(obj) {
              return obj && obj.__esModule ? obj : {
                default: obj
              };
            }
        }",
        "function foo() {
            'use strict';
            let _interopRequireDefault = function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            };
        }
"
    );
}
