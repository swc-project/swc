use ast::*;
use crate::scope::{Scope, ScopeKind};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Mark};

pub fn block_scoping() -> BlockFolder<'static> {
    BlockFolder::new(Mark::fresh(Mark::root()), Scope::new(ScopeKind::Fn, None))
}

pub struct BlockFolder<'a> {
    mark: Mark,
    current: Scope<'a>,
}
impl<'a> BlockFolder<'a> {
    fn new(mark: Mark, current: Scope<'a>) -> Self {
        BlockFolder { mark, current }
    }

    fn mark_for(&self, sym: &JsWord) -> Option<Mark> {
        let mut mark = self.mark;
        let mut scope = Some(&self.current);

        while let Some(cur) = scope {
            if cur.declared_symbols.contains(sym) {
                return Some(mark);
            }
            mark = mark.parent();
            scope = cur.parent;
        }

        None
    }
}

impl<'a> Fold<Function> for BlockFolder<'a> {
    fn fold(&mut self, f: Function) -> Function {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder =
            BlockFolder::new(child_mark, Scope::new(ScopeKind::Fn, Some(&self.current)));

        f.fold_children(&mut child_folder)
    }
}

impl<'a> Fold<BlockStmt> for BlockFolder<'a> {
    fn fold(&mut self, block: BlockStmt) -> BlockStmt {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = BlockFolder::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
        );

        block.fold_children(&mut child_folder)
    }
}

impl<'a> Fold<VarDecl> for BlockFolder<'a> {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        let var = var.fold_children(self);
        VarDecl {
            kind: VarDeclKind::Var,
            ..var
        }
    }
}

impl<'a> Fold<Pat> for BlockFolder<'a> {
    fn fold(&mut self, pat: Pat) -> Pat {
        match pat {
            Pat::Ident(ident) => {
                self.current.declared_symbols.insert(ident.sym.clone());
                let ident = Ident {
                    sym: ident.sym,
                    span: ident.span.apply_mark(self.mark),
                };
                return Pat::Ident(ident);
            }

            // TODO(kdy1): Is this ok?
            _ => pat.fold_children(self),
        }
    }
}

impl<'a> Fold<Expr> for BlockFolder<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Ident(Ident { sym, span }) => {
                if let Some(mark) = self.mark_for(&sym) {
                    Expr::Ident(Ident {
                        sym,
                        span: span.apply_mark(mark),
                    })
                } else {
                    // Cannot resolve reference. (TODO: Report error)
                    Expr::Ident(Ident { sym, span })
                }
            }

            // Leftmost one of a member expression shoukld be resolved.
            Expr::Member(me) => Expr::Member(MemberExpr {
                obj: me.obj.fold_with(self),
                ..me
            }),
            _ => expr.fold_children(self),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mark_for() {
        ::testing::run_test(|_, _, _| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);
            let mark3 = Mark::fresh(mark2);
            let mark4 = Mark::fresh(mark3);

            let folder1 = BlockFolder::new(mark1, Scope::new(ScopeKind::Block, None));
            let mut folder2 =
                BlockFolder::new(mark2, Scope::new(ScopeKind::Block, Some(&folder1.current)));
            folder2.current.declared_symbols.insert("foo".into());

            let mut folder3 =
                BlockFolder::new(mark3, Scope::new(ScopeKind::Block, Some(&folder2.current)));
            folder3.current.declared_symbols.insert("bar".into());
            assert_eq!(folder3.mark_for(&"bar".into()), Some(mark3));

            let mut folder4 =
                BlockFolder::new(mark4, Scope::new(ScopeKind::Block, Some(&folder3.current)));
            folder4.current.declared_symbols.insert("foo".into());

            assert_eq!(folder4.mark_for(&"foo".into()), Some(mark4));
            assert_eq!(folder4.mark_for(&"bar".into()), Some(mark3));
            Ok(())
        })
        .unwrap();
    }

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
for(var i = 0; i < 10; i++){
    for(var i1 = 0; i1 < 10; i1++){
        arr.push(()=>i1);
    }
}"#
    );

    test_exec!(
        |_| block_scoping(),
        pass_assignment,
        r#"let a = 1;
a = 2;
expect(a).toBe(2);"#
    );

    test_exec!(
        |_| block_scoping(),
        pass_call,
        r#"let a = 1;

function b() {
  return a + 1;
}

expect(b()).toBe(2);"#
    );

    test_exec!(
        |_| block_scoping(),
        pass_update,
        r#"let a = 1;
a++;
expect(a).toBe(2);"#
    );

    test!(
        block_scoping(),
        fn_param,
        r#"let a = 'foo';
    function foo(a) {
        use(a);
    }"#,
        r#"var a = 'foo';
    function foo(a1) {
        use(a1);
    }"#
    );

    test!(
        block_scoping(),
        fn_body,
        r#"let a = 'foo';
    function foo() {
        let a = 'bar';
        use(a);
    }"#,
        r#"var a = 'foo';
    function foo() {
        var a1 = 'bar';
        use(a1);
    }"#
    );
}
