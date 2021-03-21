use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::UsageFinder;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub fn block_scoped_functions() -> impl Fold {
    BlockScopedFns
}

#[derive(Clone, Copy)]
struct BlockScopedFns;

impl Fold for BlockScopedFns {
    noop_fold_type!();

    fn fold_stmts(&mut self, items: Vec<Stmt>) -> Vec<Stmt> {
        let mut stmts = Vec::with_capacity(items.len());
        let mut extra_stmts = Vec::with_capacity(items.len());

        for stmt in items {
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
                        if UsageFinder::find(&decl.ident, &decl.function) {
                            extra_stmts.push(Stmt::Decl(Decl::Fn(decl)));
                            continue;
                        }
                        stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Let,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(decl.ident.clone().into()),
                                init: Some(Box::new(Expr::Fn(FnExpr {
                                    ident: Some(decl.ident),
                                    function: decl.function,
                                }))),
                                definite: false,
                            }],
                            declare: false,
                        })))
                    }
                    _ => extra_stmts.push(stmt.fold_children_with(self)),
                }
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| BlockScopedFns,
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
        |_| BlockScopedFns,
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
        |_| BlockScopedFns,
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
        |_| BlockScopedFns,
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
        |_| BlockScopedFns,
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
        |_| BlockScopedFns,
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
