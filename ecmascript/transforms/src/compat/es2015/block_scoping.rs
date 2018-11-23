use ast::*;
use crate::scope::{Scope, ScopeKind};
use swc_common::{Fold, FoldWith, Mark};

pub fn block_scoping() -> impl Fold<Module> {
    BlockFolder {
        mark: Mark::fresh(Mark::root()),
        current: Scope::new(ScopeKind::Fn, None),
    }
}

struct BlockFolder<'a> {
    mark: Mark,
    current: Scope<'a>,
}

impl<'a> Fold<BlockStmt> for BlockFolder<'a> {
    fn fold(&mut self, block: BlockStmt) -> BlockStmt {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = BlockFolder {
            mark: child_mark,
            current: Scope::new(ScopeKind::Block, Some(&self.current)),
        };

        block.fold_children(&mut child_folder)
    }
}

impl<'a> Fold<VarDecl> for BlockFolder<'a> {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        if var.kind == VarDeclKind::Var {
            return var;
        }

        let var = var.fold_children(self);
        VarDecl {
            kind: VarDeclKind::Var,
            ..var
        }
    }
}

impl<'a> Fold<Pat> for BlockFolder<'a> {
    fn fold(&mut self, pat: Pat) -> Pat {
        let pat = pat.fold_children(self);

        match pat {
            Pat::Ident(ident) => {
                let ident = Ident {
                    sym: ident.sym,
                    span: ident.span.apply_mark(self.mark),
                };
                return Pat::Ident(ident);
            }
            _ => pat,
        }
    }
}

impl<'a> Fold<Expr> for BlockFolder<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Ident(Ident { sym, span }) => Expr::Ident(Ident {
                sym,
                span: span.apply_mark(self.mark),
            }),
            // TODO: Handle member expr
            _ => expr.fold_children(self),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        block_scoping(),
        basic,
        r#"
        {
            var foo = 1;
            {
                let foo = 2;
                use(foo);
            }
            use(foo)
        }
        "#,
        r#"
        {
            var foo = 1;
            {
                var foo1 = 2;
                use(foo1);
            }
            use(foo);
        }
        "#
    );

    test!(
        block_scoping(),
        general_assignment_patterns,
        r#"const foo = "foo";

function foobar() {
  for (let item of [1, 2, 3]) {
    let foo = "bar";
    [bar, foo] = [1, 2];
  }
}"#,
        r#"var foo = "foo";

function foobar() {
  for (var item of [1, 2, 3]) {
    var foo1 = "bar";
    [bar, foo1] = [1, 2];
  }
}"#
    );

    test!(
        block_scoping(),
        general_function,
        r#"function test() {
  let foo = "bar";
}"#,
        r#"function test() {
  var foo = "bar";
}"#
    );

    test!(
        // TODO(kdy1): WTF is this?
        ignore,
        block_scoping(),
        babel_issue_1051,
        r#"foo.func1 = function() {
  if (cond1) {
    for (;;) {
      if (cond2) {
        function func2() {}
        function func3() {}
        func4(function() {
          func2();
        });
        break;
      }
    }
  }
};"#,
        r#"foo.func1 = function () {
  if (cond1) {
    for (;;) {
      if (cond2) {
        var _ret = function () {
          function func2() {}

          function func3() {}

          func4(function () {
            func2();
          });
          return "break";
        }();

        if (_ret === "break") break;
      }
    }
  }
};"#
    );

    test!(
        // TODO(kdy1): WTF is this (again)?
        ignore,
        block_scoping(),
        babel_issue_2174,
        r#"if (true) {
  function foo() {}
  function bar() {
    return foo;
  }
  for (var x in {}) {}
}"#,
        r#"
if (true) {
  var foo = function () {};

  var bar = function () {
    return foo;
  };

  for (var x in {}) {}
}"#
    );

    test!(
        ignore,
        block_scoping(),
        babel_issue_4363,
        r#"function WithoutCurlyBraces() {
  if (true)
    for (let k in kv) {
        function foo() { return this }
        function bar() { return foo.call(this) }
        console.log(this, k) // => undefined
    }
}

function WithCurlyBraces() {
  if (true) {
    for (let k in kv) {
        function foo() { return this }
        function bar() { return foo.call(this) }
        console.log(this, k) // => 777
    }
  }
}"#,
        r#"function WithoutCurlyBraces() {
  var _this = this;

  if (true) {
    var _loop = function (k) {
      function foo() {
        return this;
      }

      function bar() {
        return foo.call(this);
      }

      console.log(_this, k); // => undefined
    };

    for (var k in kv) {
      _loop(k);
    }
  }
}

function WithCurlyBraces() {
  var _this2 = this;

  if (true) {
    var _loop2 = function (k) {
      function foo() {
        return this;
      }

      function bar() {
        return foo.call(this);
      }

      console.log(_this2, k); // => 777
    };

    for (var k in kv) {
      _loop2(k);
    }
  }
}"#
    );

    test!(
        block_scoping(),
        babel_issue_4946,
        r#"(function foo() {
  let foo = true;
});"#,
        r#"(function foo() {
  var foo = true;
});"#
    );

    // TODO: try {} catch (a) { let a } should report error

    test!(
        block_scoping(),
        babel_issue_973,
        r#"let arr = [];
for(let i = 0; i < 10; i++) {
  for (let i = 0; i < 10; i++) {
    arr.push(() => i);
  }
}
"#,
        r#"var arr = [];

for (var i = 0; i < 10; i++) {
  var _loop = function (_i) {
    arr.push(function () {
      return _i;
    });
  };

  for (var _i = 0; _i < 10; _i++) {
    _loop(_i);
  }
}"#
    );

    test_exec!(
        block_scoping(),
        pass_assignment,
        r#"let a = 1;
a = 2;
expect(a).toBe(2);"#
    );

    test_exec!(
        block_scoping(),
        pass_call,
        r#"let a = 1;

function b() {
  return a + 1;
}

expect(b()).toBe(2);"#
    );

    test_exec!(
        block_scoping(),
        pass_update,
        r#"let a = 1;
a++;
expect(a).toBe(2);"#
    );
}
