use super::*;
use crate::compat::es2015::block_scoping;

fn tr() -> impl Fold<Module> {
    chain!(resolver(), block_scoping())
}

macro_rules! identical {
    ($name:ident, $src:literal) => {
        test!(
            ::swc_ecma_parser::Syntax::default(),
            |_| tr(),
            $name,
            $src,
            $src
        );
    };
}

#[test]
fn test_mark_for() {
    ::testing::run_test(false, |_, _| {
        let mark1 = Mark::fresh(Mark::root());
        let mark2 = Mark::fresh(mark1);
        let mark3 = Mark::fresh(mark2);
        let mark4 = Mark::fresh(mark3);

        let folder1 = Resolver::new(mark1, Scope::new(ScopeKind::Block, None), None);
        let mut folder2 = Resolver::new(
            mark2,
            Scope::new(ScopeKind::Block, Some(&folder1.current)),
            None,
        );
        folder2.current.declared_symbols.insert("foo".into());

        let mut folder3 = Resolver::new(
            mark3,
            Scope::new(ScopeKind::Block, Some(&folder2.current)),
            None,
        );
        folder3.current.declared_symbols.insert("bar".into());
        assert_eq!(folder3.mark_for(&"bar".into()), Some(mark3));

        let mut folder4 = Resolver::new(
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
    |_| tr(),
    basic_no_usage,
    "
        let foo;
        {
            let foo;
        }
        ",
    "
        var foo;
        {
            var foo1;
        }
        "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    class_nested_var,
    "
        var ConstructorScoping = function ConstructorScoping() {
            _classCallCheck(this, ConstructorScoping);
            var bar;
            {
                var bar;
            }
        }
        ",
    "
        var ConstructorScoping = function ConstructorScoping() {
            _classCallCheck(this, ConstructorScoping);
            var bar;
            {
                var bar1;
            }
        }
        "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    // Cannot represent function expression without parens (in result code)
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
    pass_assignment,
    r#"let a = 1;
a = 2;
expect(a).toBe(2);"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    pass_call,
    r#"let a = 1;

function b() {
  return a + 1;
}

expect(b()).toBe(2);"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    pass_update,
    r#"let a = 1;
a++;
expect(a).toBe(2);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
        |_|  tr(),
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

identical!(class_var_constructor_only, r#"var Foo = function Foo(){}"#);

identical!(
    class_var,
    r#"
        var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
                var _this;
                _classCallCheck(this, Foo);
                Foo[_assertThisInitialized(_this)];
                return _possibleConstructorReturn(_this);
            }
            return Foo;
        }(Bar);
"#
);

identical!(
    class_singleton,
    r#"
var singleton;
var Sub = function(_Foo) {
    _inherits(Sub, _Foo);
    function Sub() {
        var _this;
        _classCallCheck(this, Sub);
        if (singleton) {
            return _possibleConstructorReturn(_this, singleton);
        }
        singleton = _this = _possibleConstructorReturn(this, _getPrototypeOf(Sub).call(this));
        return _possibleConstructorReturn(_this);
    }
    return Sub;
}(Foo);
        "#
);

identical!(
    regression_001,
    "var sym = Symbol();

class Foo {
  [sym] () {
    return 1;
  }
}

class Bar extends Foo {
  [sym] () {
    return super[sym]() + 2;
  }
}

var i = new Bar();

expect(i[sym]()).toBe(3);"
);

identical!(
    regression_002,
    "var sym = Symbol();
    var Foo = function() {
        function Foo() {
            _classCallCheck(this, Foo);
        }
        _createClass(Foo, [{
                 key: sym, value: function() {
                        return 1;
                    } 
            }]);
        return Foo;
    }();
    var Bar = function(_Foo) {
        _inherits(Bar, _Foo);
        function Bar() {
            _classCallCheck(this, Bar);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar).apply(this, arguments));
        }
        _createClass(Bar, [{
                 key: sym, value: function() {
                        return _get(_getPrototypeOf(Bar.prototype), sym, this)() + 2;
                    } 
            }]);
        return Bar;
    }(Foo);
    var i = new Bar();
    expect(i[sym]()).toBe(3);"
);

identical!(module_01, "import { foo as foo } from 'src';");

identical!(
    issue_271,
    "function foo(scope) {
    var startOperation = function startOperation(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
}"
);
