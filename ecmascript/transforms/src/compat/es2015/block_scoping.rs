use crate::scope::ScopeKind;
use ast::*;
use fnv::FnvHashSet;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Mark};

pub fn block_scoping() -> BlockFolder<'static> {
    BlockFolder::new(Mark::root(), Scope::new(ScopeKind::Fn, None), None)
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of this scope
    parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    kind: ScopeKind,

    /// All references declared in this scope
    declared_symbols: FnvHashSet<JsWord>,
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            declared_symbols: Default::default(),
        }
    }
}

#[derive(Clone)]
pub struct BlockFolder<'a> {
    mark: Mark,
    current: Scope<'a>,
    cur_defining: Option<(JsWord, Mark)>,
}

impl<'a> BlockFolder<'a> {
    fn new(mark: Mark, current: Scope<'a>, cur_defining: Option<(JsWord, Mark)>) -> Self {
        BlockFolder {
            mark,
            current,
            cur_defining,
        }
    }

    fn mark_for(&self, sym: &JsWord) -> Option<Mark> {
        let mut mark = self.mark;
        let mut scope = Some(&self.current);

        while let Some(cur) = scope {
            if cur.declared_symbols.contains(sym) {
                if mark == Mark::root() {
                    return None;
                }
                return Some(mark);
            }
            mark = mark.parent();
            scope = cur.parent;
        }

        None
    }

    fn fold_binding_ident(&mut self, ident: Ident) -> Ident {
        let (should_insert, mark) = if let Some((ref cur, override_mark)) = self.cur_defining {
            if *cur != ident.sym {
                (true, self.mark)
            } else {
                eprintln!("Overriding! {}:{:?}", ident.sym, override_mark);
                (false, override_mark)
            }
        } else {
            (true, self.mark)
        };

        if should_insert {
            self.current.declared_symbols.insert(ident.sym.clone());
        }

        Ident {
            span: if mark == Mark::root() {
                ident.span
            } else {
                ident.span.apply_mark(mark)
            },
            sym: ident.sym,
            ..ident
        }
    }
}

impl<'a> Fold<Function> for BlockFolder<'a> {
    fn fold(&mut self, f: Function) -> Function {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = BlockFolder::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
        );

        let f = f.fold_children(&mut child_folder);
        self.cur_defining = child_folder.cur_defining;
        f
    }
}

impl<'a> Fold<BlockStmt> for BlockFolder<'a> {
    fn fold(&mut self, block: BlockStmt) -> BlockStmt {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = BlockFolder::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.cur_defining.take(),
        );

        let block = block.fold_children(&mut child_folder);
        self.cur_defining = child_folder.cur_defining;
        block
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

impl<'a> Fold<FnExpr> for BlockFolder<'a> {
    fn fold(&mut self, e: FnExpr) -> FnExpr {
        let ident = if let Some(ident) = e.ident {
            Some(self.fold_binding_ident(ident))
        } else {
            None
        };

        let function = e.function.fold_with(self);

        FnExpr { ident, function }
    }
}

impl<'a> Fold<FnDecl> for BlockFolder<'a> {
    fn fold(&mut self, node: FnDecl) -> FnDecl {
        let ident = self.fold_binding_ident(node.ident);

        let function = node.function.fold_with(self);

        FnDecl {
            ident,
            function,
            ..node
        }
    }
}

impl<'a> Fold<Pat> for BlockFolder<'a> {
    fn fold(&mut self, pat: Pat) -> Pat {
        match pat {
            Pat::Ident(ident) => {
                let ident = self.fold_binding_ident(ident);
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
            // Leftmost one of a member expression shoukld be resolved.
            Expr::Member(me) => Expr::Member(MemberExpr {
                obj: me.obj.fold_with(self),
                ..me
            }),
            _ => expr.fold_children(self),
        }
    }
}

impl<'a> Fold<VarDeclarator> for BlockFolder<'a> {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        // order is important

        let name = decl.name.fold_with(self);

        let cur_name = match name {
            Pat::Ident(Ident { ref sym, .. }) => Some((sym.clone(), self.mark)),
            _ => None,
        };

        let old_def = self.cur_defining.take();
        self.cur_defining = cur_name;

        let init = decl.init.fold_children(self);

        self.cur_defining = old_def;

        VarDeclarator { name, init, ..decl }
    }
}

impl<'a> Fold<Ident> for BlockFolder<'a> {
    fn fold(&mut self, i: Ident) -> Ident {
        let Ident { span, sym, .. } = i;
        if self.cur_defining.as_ref().map(|v| &v.0) == Some(&sym) {
            return Ident { sym, ..i };
        }

        if let Some(mark) = self.mark_for(&sym) {
            Ident {
                sym,
                span: span.apply_mark(mark),
                ..i
            }
        } else {
            // Cannot resolve reference. (TODO: Report error)
            Ident { sym, span, ..i }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mark_for() {
        ::testing::run_test(false, |_, _| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);
            let mark3 = Mark::fresh(mark2);
            let mark4 = Mark::fresh(mark3);

            let folder1 = BlockFolder::new(mark1, Scope::new(ScopeKind::Block, None), None);
            let mut folder2 = BlockFolder::new(
                mark2,
                Scope::new(ScopeKind::Block, Some(&folder1.current)),
                None,
            );
            folder2.current.declared_symbols.insert("foo".into());

            let mut folder3 = BlockFolder::new(
                mark3,
                Scope::new(ScopeKind::Block, Some(&folder2.current)),
                None,
            );
            folder3.current.declared_symbols.insert("bar".into());
            assert_eq!(folder3.mark_for(&"bar".into()), Some(mark3));

            let mut folder4 = BlockFolder::new(
                mark4,
                Scope::new(ScopeKind::Block, Some(&folder3.current)),
                None,
            );
            folder4.current.declared_symbols.insert("foo".into());

            assert_eq!(folder4.mark_for(&"foo".into()), Some(mark4));
            assert_eq!(folder4.mark_for(&"bar".into()), Some(mark3));
            Ok(())
        })
        .unwrap();
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
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
            var foo1 = 1;
            {
                var foo = 2;
                use(foo);
            }
            use(foo1);
        }
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
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
        ignore,
        ::swc_ecma_parser::Syntax::default(),
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
        ignore,
        ::swc_ecma_parser::Syntax::default(),
        // TODO(kdy1): WTF is this (again)?
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
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        pass_assignment,
        r#"let a = 1;
a = 2;
expect(a).toBe(2);"#
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        pass_call,
        r#"let a = 1;

function b() {
  return a + 1;
}

expect(b()).toBe(2);"#
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        pass_update,
        r#"let a = 1;
a++;
expect(a).toBe(2);"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
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
        ::swc_ecma_parser::Syntax::default(),
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

    test!(
        ::swc_ecma_parser::Syntax::default(),
        block_scoping(),
        shorthand,
        r#"let a = 'foo';
    function foo() {
        let a = 'bar';
        use({a});
    }"#,
        r#"var a = 'foo';
    function foo() {
        var a1 = 'bar';
        use({a: a1});
    }"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        block_scoping(),
        same_level,
        r#"
        var a = 'foo';
        var a = 'bar';
        "#,
        r#"
        var a = 'foo';
        var a = 'bar';
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        block_scoping(),
        class_block,
        r#"
    var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
            }
            return Foo;
        }(Bar);
    "#,
        r#"
    var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
            }
            return Foo;
        }(Bar);
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        block_scoping(),
        class_block_2,
        r#"
    var Foo = (function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
            }
            return Foo;
        })(Bar);
    "#,
        r#"
    var Foo = (function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
            }
            return Foo;
        })(Bar);
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        block_scoping(),
        class_nested,
        r#"
var Outer = function(_Hello) {
    _inherits(Outer, _Hello);
    function Outer() {
        _classCallCheck(this, Outer);
        var _this = _possibleConstructorReturn(this, _getPrototypeOf(Outer).call(this));
        var Inner = function() {
            function Inner() {
                _classCallCheck(this, Inner);
            }
            _createClass(Inner, [{
                     key: _get(_getPrototypeOf(Outer.prototype), 'toString', _assertThisInitialized(_this)).call(_this), value: function() {
                            return 'hello';
                        } 
                }]);
            return Inner;
        }();
        return _possibleConstructorReturn(_this, new Inner());
    }
    return Outer;
}(Hello);
"#,
        r#"
var Outer = function(_Hello) {
    _inherits(Outer, _Hello);
    function Outer() {
        _classCallCheck(this, Outer);
        var _this = _possibleConstructorReturn(this, _getPrototypeOf(Outer).call(this));
        var Inner = function() {
            function Inner() {
                _classCallCheck(this, Inner);
            }
            _createClass(Inner, [{
                     key: _get(_getPrototypeOf(Outer.prototype), 'toString', _assertThisInitialized(_this)).call(_this), value: function() {
                            return 'hello';
                        } 
                }]);
            return Inner;
        }();
        return _possibleConstructorReturn(_this, new Inner());
    }
    return Outer;
}(Hello);
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        block_scoping(),
        class_var,
        r#"var Foo = function Foo(){}"#,
        r#"var Foo = function Foo(){}"#
    );
}
