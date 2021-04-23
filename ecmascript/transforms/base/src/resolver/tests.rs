use crate::hygiene::Config;

use super::*;
use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_visit::{as_folder, Fold, VisitMut, VisitMutWith};

struct TsHygiene {
    top_level_mark: Mark,
}

impl VisitMut for TsHygiene {
    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if SyntaxContext::empty().apply_mark(self.top_level_mark) == i.span.ctxt {
            println!("ts_hygiene: {} is top-level", i.sym);
            return;
        }

        let ctxt = format!("{:?}", i.span.ctxt).replace("#", "");
        i.sym = format!("{}__{}", i.sym, ctxt).into();
        i.span = i.span.with_ctxt(SyntaxContext::empty());
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);
        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        match n {
            PropName::Computed(n) => {
                n.visit_mut_with(self);
            }
            _ => {}
        }
    }

    fn visit_mut_ts_qualified_name(&mut self, q: &mut TsQualifiedName) {
        q.left.visit_mut_with(self);
    }
}

/// Typescript transforms
fn ts_tr() -> impl Fold {
    let top_level_mark = Mark::fresh(Mark::root());
    chain!(
        ts_resolver(top_level_mark),
        as_folder(TsHygiene { top_level_mark })
    )
}

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        class_props: true,
        ..Default::default()
    })
}

fn ts() -> Syntax {
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    })
}

fn run_test<F, V>(syntax: Syntax, tr: F, src: &str, to: &str)
where
    F: FnOnce() -> V,
    V: Fold,
{
    crate::tests::test_transform(syntax, |_| tr(), src, to, true, Default::default());
}

fn run_test_with_config<F, V>(
    syntax: Syntax,
    tr: F,
    src: &str,
    to: &str,
    config: crate::hygiene::Config,
) where
    F: FnOnce() -> V,
    V: Fold,
{
    crate::tests::test_transform(syntax, |_| tr(), src, to, true, config);
}

macro_rules! to_ts {
    ($name:ident, $src:literal, $to:literal) => {
        #[test]
        fn $name() {
            run_test(ts(), || ts_tr(), $src, $to);
        }
    };
}

macro_rules! to {
    ($name:ident, $src:literal, $to:literal) => {
        #[test]
        fn $name() {
            run_test(syntax(), || resolver(), $src, $to);
        }
    };
}

macro_rules! identical_ts {
    ($name:ident, $src:literal) => {
        to_ts!($name, $src, $src);
    };
}

macro_rules! identical {
    ($name:ident, $src:literal) => {
        to!($name, $src, $src);
    };
}

macro_rules! identical_no_block {
    ($name:ident, $src:literal) => {
        #[test]
        fn $name() {
            run_test(syntax(), || resolver(), $src, $src);
        }
    };
}

#[test]
fn test_mark_for() {
    ::testing::run_test(false, |_, _| {
        let mark1 = Mark::fresh(Mark::root());
        let mark2 = Mark::fresh(mark1);
        let mark3 = Mark::fresh(mark2);
        let mark4 = Mark::fresh(mark3);

        let folder1 = Resolver::new(mark1, Scope::new(ScopeKind::Block, None), true);
        let mut folder2 = Resolver::new(
            mark2,
            Scope::new(ScopeKind::Block, Some(&folder1.current)),
            true,
        );
        folder2.current.declared_symbols.insert("foo".into());

        let mut folder3 = Resolver::new(
            mark3,
            Scope::new(ScopeKind::Block, Some(&folder2.current)),
            true,
        );
        folder3.current.declared_symbols.insert("bar".into());
        assert_eq!(folder3.mark_for_ref(&"bar".into()), Some(mark3));

        let mut folder4 = Resolver::new(
            mark4,
            Scope::new(ScopeKind::Block, Some(&folder3.current)),
            true,
        );
        folder4.current.declared_symbols.insert("foo".into());

        assert_eq!(folder4.mark_for_ref(&"foo".into()), Some(mark4));
        assert_eq!(folder4.mark_for_ref(&"bar".into()), Some(mark3));
        Ok(())
    })
    .unwrap();
}

to!(
    basic_no_usage,
    "
        let foo;
        {
            let foo;
        }
        ",
    "
        let foo;
        {
            let foo1;
        }
        "
);

to!(
    class_nested_var,
    "
        var ConstructorScoping = function ConstructorScoping() {
            _classCallCheck(this, ConstructorScoping);
            var bar;
            {
                let bar;
                use(bar);
            }
        }
        ",
    "
        var ConstructorScoping = function ConstructorScoping1() {
            _classCallCheck(this, ConstructorScoping1);
            var bar;
            {
                let bar1;
                use(bar1);
            }
        }
        "
);

to!(
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
                let foo1 = 2;
                use(foo1);
            }
            use(foo);
        }
        "#
);

to!(
    general_assignment_patterns,
    r#"const foo = "foo";

function foobar() {
  for (let item of [1, 2, 3]) {
    let foo = "bar";
    [bar, foo] = [1, 2];
  }
}"#,
    r#"const foo = "foo";

function foobar() {
  for (let item of [1, 2, 3]) {
    let foo1 = "bar";
    [bar, foo1] = [1, 2];
  }
}"#
);

to!(
    general_function,
    r#"function test() {
  let foo = "bar";
}"#,
    r#"function test() {
  let foo = "bar";
}"#
);

#[test]
#[ignore]
fn babel_issue_1051() {
    run_test(
        Default::default(),
        || resolver(),
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
      };"#,
    );
}

#[test]
#[ignore]
fn babel_issue_2174() {
    run_test(
        Default::default(),
        || resolver(),
        "if (true) {
        function foo() {}
        function bar() {
          return foo;
        }
        for (var x in {}) {}
      }",
        "
      if (true) {
        var foo = function () {};
      
        var bar = function () {
          return foo;
        };
      
        for (var x in {}) {}
      }",
    );
}

#[test]
#[ignore]
fn babel_issue_4363() {
    run_test(
        Default::default(),
        || resolver(),
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
      }"#,
    );
}

#[test]
#[ignore = "Cannot represent function expression without parens (in result code)"]
fn babel_issue_4946() {
    run_test(
        Default::default(),
        || resolver(),
        r#"(function foo() {
        let foo = true;
      });"#,
        r#"(function foo() {
        var foo = true;
      });"#,
    );
}

// TODO: try {} catch (a) { let a } should report error

#[test]
fn babel_issue_973() {
    run_test(
        Default::default(),
        || resolver(),
        r#"let arr = [];
    for(let i = 0; i < 10; i++) {
      for (let i = 0; i < 10; i++) {
        arr.push(() => i);
      }
    }
    "#,
        r#"let arr = [];
    for(let i = 0; i < 10; i++){
        for(let i1 = 0; i1 < 10; i1++){
            arr.push(()=>i1);
        }
    }"#,
    );
}

to!(
    pass_assignment,
    r#"let a = 1;
    a = 2;
    expect(a).toBe(2);"#,
    "
    let a = 1;
    a = 2;
    expect(a).toBe(2);
    "
);

to!(
    pass_call,
    r#"let a = 1;

    function b() {
        return a + 1;
    }

    expect(b()).toBe(2);"#,
    "
    let a = 1;
    function b() {
        return a + 1;
    }
    expect(b()).toBe(2);
    "
);

to!(
    pass_update,
    r#"let a = 1;
a++;
expect(a).toBe(2);"#,
    "
    let a = 1;
    a++;
    expect(a).toBe(2);
    "
);

to!(
    fn_param,
    r#"let a = 'foo';
    function foo(a) {
        use(a);
    }"#,
    r#"let a = 'foo';
    function foo(a1) {
        use(a1);
    }"#
);

to!(
    fn_body,
    r#"let a = 'foo';
    function foo() {
        let a = 'bar';
        use(a);
    }"#,
    r#"let a = 'foo';
    function foo() {
        let a1 = 'bar';
        use(a1);
    }"#
);

to!(
    shorthand,
    r#"let a = 'foo';
    function foo() {
        let a = 'bar';
        use({a});
    }"#,
    r#"let a = 'foo';
    function foo() {
        let a1 = 'bar';
        use({a: a1});
    }"#
);

to!(
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

to!(
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
    var Foo1 = function(_Bar) {
            _inherits(Foo2, _Bar);
            function Foo2() {
            }
            return Foo2;
        }(Bar);
        "#
);

to!(
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
    var Foo1 = function(_Bar) {
            _inherits(Foo2, _Bar);
            function Foo2() {
            }
            return Foo2;
        }(Bar);
        "#
);

to!(
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
var Outer1 = function(_Hello) {
    _inherits(Outer2, _Hello);
    function Outer2() {
        _classCallCheck(this, Outer2);
        var _this = _possibleConstructorReturn(this, _getPrototypeOf(Outer2).call(this));
        var Inner = function() {
            function Inner1() {
                _classCallCheck(this, Inner1);
            }
            _createClass(Inner1, [{
                     key: _get(_getPrototypeOf(Outer2.prototype), 'toString', _assertThisInitialized(_this)).call(_this), value: function() {
                            return 'hello';
                        } 
                }]);
            return Inner1;
        }();
        return _possibleConstructorReturn(_this, new Inner());
    }
    return Outer2;
}(Hello);
"#
);

to!(
    class_var_constructor_only,
    r#"var Foo = function Foo(){}"#,
    r#"var Foo = function Foo1(){}"#
);

to!(
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
    }(Bar);"#,
    r#"
    var Foo1 = function(_Bar) {
        _inherits(Foo2, _Bar);
        function Foo2() {
            var _this;
            _classCallCheck(this, Foo2);
            Foo2[_assertThisInitialized(_this)];
            return _possibleConstructorReturn(_this);
        }
        return Foo2;
    }(Bar);
    "#
);

to!(
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
}(Foo);"#,
    r#"
    var singleton;
    var Sub1 = function(_Foo) {
        _inherits(Sub2, _Foo);
        function Sub2() {
            var _this;
            _classCallCheck(this, Sub2);
            if (singleton) {
                return _possibleConstructorReturn(_this, singleton);
            }
            singleton = _this = _possibleConstructorReturn(this, _getPrototypeOf(Sub2).call(this));
            return _possibleConstructorReturn(_this);
        }
        return Sub2;
    }(Foo);"#
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

to!(
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
    expect(i[sym]()).toBe(3);",
    "var sym = Symbol();
    var Foo = function() {
        function Foo1() {
            _classCallCheck(this, Foo1);
        }
        _createClass(Foo1, [{
                 key: sym, value: function() {
                        return 1;
                    } 
            }]);
        return Foo1;
    }();
    var Bar1 = function(_Foo) {
        _inherits(Bar2, _Foo);
        function Bar2() {
            _classCallCheck(this, Bar2);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar2).apply(this, arguments));
        }
        _createClass(Bar2, [{
                 key: sym, value: function() {
                        return _get(_getPrototypeOf(Bar2.prototype), sym, this)() + 2;
                    } 
            }]);
        return Bar2;
    }(Foo);
    var i = new Bar1();
    expect(i[sym]()).toBe(3);"
);

identical!(module_01, "import { foo as foo } from 'src';");

identical!(
    issue_271,
    "function foo(scope) {
    var startOperation = function startOperation1(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
}"
);

identical!(
    issue_281_01,
    "function foo(e) {
  e: { break e; }
}"
);

identical!(
    issue_281_02,
    "function foo(e) {
  e: {
    try {
    } catch (e1) {
      o = null;
      break e
    }
  }
}"
);

identical_no_block!(
    issue_292_1,
    "var __assign = function () {
  __assign = Object.assign || function __assign1(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};"
);

identical_no_block!(
    issue_292_2,
    "__assign = Object.assign || function __assign1(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  __assign.apply(this, arguments);"
);

identical!(
    issue_295,
    "export var bar = {};
class Foo {
  constructor() {
    bar;
  }
}"
);

identical!(
    issue_308,
    "function bar(props) {}
var Foo = function Foo1() {
    _classCallCheck(this, Foo1);
    super();
    _defineProperty(this, 'onBar', ()=>{
        bar();
    });
    bar();
};
"
);

identical!(
    issue_308_2,
    "
function wrapper(){
    function bar(props) {}
    var Foo = function Foo1() {
        _classCallCheck(this, Foo1);
        super();
        _defineProperty(this, 'onBar', ()=>{
            bar();
        });
        bar();
    };   
}
"
);

identical!(
    issue_369_1,
    "export function input(name) {
    return `${name}.md?render`;
}

export default function({
    name, input: inp,
}) {
    inp = inp || input(name);
    return {input: inp};
};
"
);

to!(
    issue_369_2,
    "
function a() {}
function b() {}
function foo({a: b}){
	expect(b).toBe('a')
}
foo({a: 'a'})",
    "
    function a() {
    }
    function b() {
    }
    function foo({ a: b1  }) {
        expect(b1).toBe('a');
    }
    foo({
        a: 'a'
    });
    "
);

identical!(
    issue_396_1,
    "
function foo() {
  bar;
  function bar() {}
}
"
);

identical!(
    issue_396_2,
    "
function foo() {
    var bar = function bar1() {
    };
    bar;
}
"
);

to!(
    issue_404,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}",
    "function foo(bar) {
    const { foo: foo1  } = bar;
    return foo1;
}
"
);

to!(
    issue_438,
    "function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }",
    "function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf1(o1, p1) {
            o1.__proto__ = p1;
            return o1;
        };
        return _setPrototypeOf(o, p);
    }"
);

to!(
    issue_454_1,
    "var a = 2;
function foo() {
  try {
    var a = 1;
    a;
  } catch (err) {
    // ignored
  }
  a;
}",
    "var a = 2;
function foo() {
    try {
        var a1 = 1;
        a1;
    } catch (err) {
    }
    a1;
}"
);

to!(
    issue_454_2,
    "function a() {}
function foo() {
  function b() {
    a();
  }
  function a() {}
}",
    "function a1() {
}
function foo() {
    function b() {
        a2();
    }
    function a2() {
    }
}"
);

to!(
    issue_454_3,
    "function a() {}
function foo() {
    function b() {
        a();
    }
    function a() {
        b();
    }
}",
    "function a1() {
}
function foo() {
    function b() {
        a2();
    }
    function a2() {
        b();
    }
}"
);

to!(
    regression_of_454,
    "function broken(x) {
        var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
                _classCallCheck(this, Foo);
                return _possibleConstructorReturn(this, _getPrototypeOf(Foo).apply(this, \
     arguments));
            }
            return Foo;
        }(Bar);
    }",
    "function broken(x) {
        var Foo1 = function(_Bar) {
            _inherits(Foo2, _Bar);
            function Foo2() {
                _classCallCheck(this, Foo2);
                return _possibleConstructorReturn(this, _getPrototypeOf(Foo2).apply(this, \
     arguments));
            }
            return Foo2;
        }(Bar);
    }"
);

to!(
    issue_461,
    "
for (var x in ['']) {
    (x => 0)(x);
}",
    "
for(var x in ['']){
    ((x1)=>0)(x);
}
"
);

to!(
    issue_483,
    "
function se(t,e,n,r){
//...
try{return O.apply(n,f.querySelectorAll(c)),n}catch(e){S(t,!0)}finally{s===N&&e.
removeAttribute('id')}
}
",
    "
function se(t, e, n, r) {
    try {
        return O.apply(n, f.querySelectorAll(c)), n;
    } catch (e1) {
        S(t, !0);
    } finally{
        s === N && e.removeAttribute('id');
    }
}
"
);

identical!(
    in_constructor,
    "
class C {
}

class A extends C {
  constructor() {
    super();

    class B extends C {
      constructor() {
        super();
      }
    }

    new B();
  }
}
"
);

#[test]
fn issue_578_1() {
    run_test(
        syntax(),
        || resolver(),
        "
    import { myFunction } from './dep.js'
    
    class SomeClass {
      constructor(properties) {
        this.props = properties;
      }
      call () {
        const {myFunction} = this.props
        if (myFunction) {
          myFunction()
        } else {
          console.log('DID NOT WORK!')
        }
      }
    }
    
    let instance = new SomeClass({
      myFunction: () => {
        console.log('CORRECT FUNCTION CALLED')
      }
    });
    
    instance.call()",
        "import { myFunction } from './dep.js';
    class SomeClass{
        constructor(properties){
            this.props = properties;
        }
         call() {
            const { myFunction: myFunction1  } = this.props;
            if (myFunction1) {
                myFunction1();
            } else {
                console.log('DID NOT WORK!');
            }
        }
    }
    let instance = new SomeClass({
        myFunction: ()=>{
            console.log('CORRECT FUNCTION CALLED');
        }
    });
    instance.call()",
    );
}

#[test]
fn global_object() {
    run_test(
        syntax(),
        || resolver(),
        "function foo(Object) {
        Object.defineProperty()
    }",
        "function foo(Object1) {
    Object1.defineProperty();
}",
    );
}

identical!(
    hoisting,
    "function foo() {
        return XXX
    }
    var XXX = 1;
    "
);

identical!(
    issue_678,
    "({
  foo() {
    function bar() {
      bar;
    }
  },
});"
);

identical!(
    issue_688,
    "function test() {
    if (typeof Missing == typeof EXTENDS) {
        console.log('missing');
    }
    var EXTENDS = 'test';
}"
);

identical!(
    issue_688_2,
    "function test() {
    if (typeof Missing == typeof EXTENDS) {
        console.log('missing');
    }
    {
        var EXTENDS = 'test';
    }
}"
);

identical!(
    issue_699_1,
    "function foo() {	
  return () => {	
    function Bar() {}	
    Bar.qux = '';	
    return Bar;	
  };	
}	
"
);

identical!(
    issue_760,
    "var initialState = 'foo';
    export default function reducer(state = initialState, action = {}) {
    }"
);

to!(
    issue_788_1,
    "window.addEventListener('message', (e) => {
        try {
            console.log(e.data);
        } catch(e) {
            console.log(e);
        }
    });",
    "window.addEventListener('message', (e) => {
        try {
            console.log(e.data);
        } catch(e1) {
            console.log(e1);
        }
    });"
);

to!(
    issue_788_2,
    "window.addEventListener('message', function(e) {
    try {
        console.log(e.data);
    } catch(e) {
        console.log(e);
    }
});",
    "window.addEventListener('message', function(e) {
    try {
        console.log(e.data);
    } catch(e1) {
        console.log(e1);
    }
});"
);

identical_ts!(ts_resolver_001, "type A = B;");

identical_ts!(
    ts_resolver_002,
    "
    class A {}
    new A();
    "
);

identical_ts!(
    ts_resolver_003,
    "
    class Foo<T> {}
    class A {}
    class B {}
    new Foo<A>();
    new Foo<B>();
    "
);

to_ts!(
    ts_resolver_class_constructor,
    "
class G<T> {}
class Foo {
    constructor() {
        class Foo {
            
        }

        new G<Foo__2>();
    }
}
new G<Foo>();
",
    "
class G<T> {
}
class Foo {
    constructor(){
        class Foo__2 {
        }
        new G<Foo__2>();
    }
}
new G<Foo>();
        "
);

to_ts!(
    ts_resolver_class_getter,
    "
class G<T> {}
class Foo {
    get foo() {
        class Foo {
            
        }

        new G<Foo>();
    }
}
",
    "
class G<T> {
}
class Foo {
    get foo() {
        class Foo__2 {
        }
        new G<Foo__2>();
    }
}
    "
);

to_ts!(
    ts_resolver_nested_interface,
    "
interface Foo {
    name: string
}

function foo() {
    interface Foo {
        name: string
    }
    const foo = {} as Foo;
}
const bar = {} as Foo;

    ",
    "
interface Foo {
    name__0: string;
}
function foo() {
    interface Foo__2 {
        name__0: string;
    }
    const foo__2 = {
    } as Foo__2;
}
const bar = {
} as Foo;
    "
);

to_ts!(
    ts_resolver_nested_enum,
    "
enum Foo {
    name: string
}

function foo() {
    enum Foo {
        name: string
    }
    const foo = {} as Foo;
}
const bar = {} as Foo;

",
    "
    enum Foo {
        name__0,
        string__0
    }
    function foo() {
        enum Foo__2 {
            name__0,
            string__0
        }
        const foo__2 = {
        } as Foo__2;
    }
    const bar = {
    } as Foo;
    "
);

to_ts!(
    ts_resolver_nested_type_alias,
    "
type Foo = {};

function foo() {
    type Foo = string | number;
    const foo = {} as Foo;
}
const bar = {} as Foo;
    ",
    "
type Foo = {
};
function foo() {
    type Foo__2 = string | number;
    const foo__2 = {
    } as Foo__2;
}
const bar = {
} as Foo;    
    "
);

to_ts!(
    ts_resolver_import_and_type_ann,
    "
import { Nullable } from 'nullable';
const a: Nullable<string> = 'hello';
console.log(a);
    ",
    "
import { Nullable } from 'nullable';
const a: Nullable<string> = 'hello';
console.log(a);
    "
);

identical_ts!(
    ts_resolver_import_and_type_param,
    "
import { Nullable } from 'nullable';
import { SomeOther } from 'other';
const a: Nullable<SomeOther> = 'hello';
console.log(a);
    "
);

identical_ts!(
    ts_resolver_import_and_implements,
    "
import { Nullable } from 'nullable';
import { Component } from 'react';
class Foo implements Component<Nullable> {}
new Foo();
    "
);

identical_ts!(
    ts_resolver_import_and_extends,
    "
    import { Nullable } from 'nullable';
    import { Component } from 'react';
    class Foo extends Component<Nullable, {}> {}
    new Foo();
    "
);

identical_ts!(
    ts_resolver_method_type_param,
    "
import { Nullable } from 'nullable';
import { Another } from 'some';
class A {
    do(): Nullable<Another> {
    return null;
    }
}
new A();
    "
);

to_ts!(
    ts_resolver_nested_type_ref,
    "
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Another } from 'some';
class A extends Nullable {
    other: Nullable<Another>;
}
new A();
    ",
    "
import { Nullable } from 'nullable';
import { SomeOther } from 'some';
import { Another } from 'some';
class A extends Nullable {
    other__0: Nullable<Another>;
}
new A();
    "
);

// See: https://github.com/denoland/deno_lint/pull/304
to_ts!(
    ts_resolver_parameter,
    "
    new Promise((resolve: () => void, _) => {
        setTimeout(resolve, 100);
    });
    ",
    "
    new Promise((resolve__2: () => void, ___2) => {
        setTimeout(resolve__2, 100);
    });
    "
);

// See: https://github.com/denoland/deno_lint/pull/304
to_ts!(
    let_scoping,
    "
    function wrapper() {
        const usage = () => {
            return a;
        };
        let a;
    }
    ",
    "
    function wrapper() {
        const usage__2 = ()=>{
            return a__2;
        };
        let a__2;
    }    
    "
);

to_ts!(
    ts_resolver_parameter_property,
    r#"
    class PartWriter implements Deno.Writer {
        constructor(
          private writer: Deno.Writer,
          readonly boundary: string,
          public headers: Headers,
          isFirstBoundary: boolean,
        ) {
          let buf = "";
          if (isFirstBoundary) {
            buf += `--${boundary}\r\n`;
          } else {
            buf += `\r\n--${boundary}\r\n`;
          }
          for (const [key, value] of headers.entries()) {
            buf += `${key}: ${value}\r\n`;
          }
          buf += `\r\n`;
          this.partHeader = buf;
        }
    }
    "#,
    r#"
    class PartWriter {
        constructor(private writer__2: Deno.Writer, readonly boundary__2: string, public headers__2: Headers, isFirstBoundary__2: boolean){
            let buf__2 = "";
            if (isFirstBoundary__2) {
                buf__2 += `--${boundary__2}\r\n`;
            } else {
                buf__2 += `\r\n--${boundary__2}\r\n`;
            }
            for (const [key__3, value__3] of headers__2.entries()){
                buf__2 += `${key__3}: ${value__3}\r\n`;
            }
            buf__2 += `\r\n`;
            this.partHeader = buf__2;
        }
    }
    "#
);

to_ts!(
    ts_resolver_catch_param,
    r#"
function wrapper(...args) {
    try {
        return target(...args);
    } catch (err) {
        switch (err.name) {
        }
    }
}
    "#,
    "
    function wrapper(...args__2) {
        try {
            return target(...args__2);
        } catch (err__3) {
            switch(err__3.name){
            }
        }
    }
    "
);

to_ts!(
    function_scope_1,
    r#"
function wrapper(a) {
    var a;
    {
        let a;
    }
}
    "#,
    "
function wrapper(a__2) {
    var a__2;
    {
        let a__3;
    }
}    
    "
);

to_ts!(
    function_scope_2,
    r#"
function wrapper(a) {
    {
        let a;
    }
}
    "#,
    "
function wrapper(a__2) {
    {
        let a__3;
    }
}    
    "
);

to_ts!(
    function_scope_3,
    r#"
function wrapper(a) {
    {
        var a;
    }
}
    "#,
    "
function wrapper(a__2) {
    {
        var a__2;
    }
}    
    "
);

to_ts!(
    function_scope_4,
    r#"
function wrapper(a) {
    let a;
}
    "#,
    "
function wrapper(a__2) {
    let a__2;
}    
    "
);

to_ts!(
    ts_resolver_deno_undef_001,
    r#"
    const directiveHandlers: DirectiveHandlers = {
        TAG(state, _name, ...args: string[]): void {
          const handle = args[0];
          if (!PATTERN_TAG_HANDLE.test(handle)) {
          }
        },
      };
    "#,
    r#"
    const directiveHandlers: DirectiveHandlers = {
        TAG (state__2, _name__2, ...args__2: string[]): void {
            const handle__2 = args__2[0];
            if (!PATTERN_TAG_HANDLE.test(handle__2)) {
            }
        }
    };
    "#
);

to!(
    issue_1086,
    "
    const b = [];
    {
      let a;
      for (a in b) {
        console.log(a);
      }
    }
    ",
    "
    const b = [];
    {
      let a;
      for (a in b) {
        console.log(a);
      }
    }
    "
);

to!(
    issue_1140,
    r#"
    const categories = [{ key: "apple" }, { key: "banana" }, { key: "strawberry" }];

    const item = "some item";

    const catNames = categories.reduce((a, item) => {
    return { ...a, [item.key.toString()]: item };
    }, {});
    "#,
    r#"
    const categories = [
        {
            key: "apple"
        },
        {
            key: "banana"
        },
        {
            key: "strawberry"
        }
    ];
    const item = "some item";
    const catNames = categories.reduce((a, item1)=>{
        return {
            ...a,
            [item1.key.toString()]: item1
        };
    }, {
    });

    "#
);

// https://github.com/swc-project/swc/pull/1171
to!(
    pr_1171_1,
    r#"
    function isAbsolute() {}

    function parse(path) {
        const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        if (isAbsolute) {
        }
    }
    "#,
    r#"
    function isAbsolute() {}

    function parse(path) {
        const isAbsolute1 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        if (isAbsolute1) {
        }
    }
    "#
);

// https://github.com/swc-project/swc/pull/1171
to!(
    pr_1171_2,
    r#"
    function parse(path) {
        const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        if (isAbsolute) {
        }
    }

    function isAbsolute() {}
    "#,
    r#"
    function parse(path) {
        const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        if (isAbsolute) {
        }
    }

    function isAbsolute() {}
    "#
);

to_ts!(
    type_checker_001,
    "
    const assign = <T, K1 extends keyof T, K2 extends keyof T[K1]>(object: T, key1: K1, key2: K2) \
     => (value: T[K1][K2]) => object[key1][key2] = value;
    ",
    "const assign = <T__2, K1__2 extends keyof T__2, K2__2 extends keyof T__2[K1__2]>(object__2: \
     T__2, key1__2: K1__2, key2__2: K2__2)=>(value__3: \
     T__2[K1__2][K2__2])=>object__2[key1__2][key2__2] = value__3"
);

to_ts!(
    type_checker_002,
    "
    export declare function foo<T>(obj: T): T extends () => infer P ? P : never;
    export function bar<T>(obj: T) {
        return foo(obj);
    }
    ",
    "
    export declare function foo<T__2>(obj__2: T__2): T__2 extends () => infer P ? P : never;
    export function bar<T__3>(obj__3: T__3) {
        return foo(obj__3);
    }
"
);

to_ts!(
    deno_lint_486,
    "
    function foo() {
        target++;
        {
            var target = 0;
        }
    }
    ",
    "
    function foo() {
        target__2++;
        {
            var target__2 = 0;
        }
    }
    "
);

to_ts!(
    deno_lint_463_1,
    "(() => {
    function foo() {
        return new Bar();
    }
    class Bar {}
    })();",
    "
    (()=>{
        function foo__1() {
            return new Bar__1();
        }
        class Bar__1 {
        }
    })();
    "
);

to_ts!(
    deno_lint_463_2,
    "function wrapper() {
        function foo() {
            return new Bar();
        }
        class Bar {}
    }",
    "
    function wrapper() {
        function foo__2() {
            return new Bar__2();
        }
        class Bar__2 {
        }
    }
    "
);

to!(
    deno_issue_8620_1,
    "
    const b = 1;
    const b1 = 2;
    {
        const b = 3;
        const b1 = 4;
        const b2 = 5;
    }
    ",
    "
    const b = 1;
    const b1 = 2;
    {
        const b2 = 3;
        const b11 = 4;
        const b21 = 5;
    }

    "
);

to_ts!(
    ts_module_name_1,
    "
    module Top {
        module A {
            export function b() {
                
            }
        }
        A.b()
    }
    ",
    "
    module Top {
        module A__2 {
            export function b__0() {
            }
        }
        A__2.b();
    }    
    "
);

to_ts!(
    ts_as_operator_ambiguity_1,
    "
    interface A<T> { x: T; }
    interface B { m: string; }

    // Make sure this is a type assertion to an array type, and not nested comparison operators.
    var x: any;
    var y = x as A<B>[];
    var z = y[0].m; // z should be string
    ",
    "
    interface A<T__2> {
        x__0: T__2;
    }
    interface B {
        m__0: string;
    }
    var x: any;
    var y = x as A<B>[];
    var z = y[0].m;
    "
);

to_ts!(
    ts_as_operator_ambiguity_2,
    "
    module Top {
        interface A<T> { x: T; }
        interface B { m: string; }

        var x: any;
        var y = x as A<B>[];
        var z = y[0].m; // z should be string
    }
    ",
    "
    module Top {
        interface A__2<T__3> {
            x__0: T__3;
        }
        interface B__2 {
            m__0: string;
        }
        var x: any;
        var y = x as A__2<B__2>[];
        var z = y[0].m;
    }
    
    "
);

to!(
    deno_9121_1,
    "
    var _ = 1;
    function wt(e, n, t, r) {
        var l = e.updateQueue;
        if (u !== null) {
            if (y !== null) {
                var _ = y.lastBaseUpdate;
            }
        }
        if (i !== null) {
            _ = l.baseState, o = 0, y = d = s = null;
        }
    }
    ",
    "
    var _ = 1;
    function wt(e, n, t, r) {
        var l = e.updateQueue;
        if (u !== null) {
            if (y !== null) {
                var _1 = y.lastBaseUpdate;
            }
        }
        if (i !== null) {
            _1 = l.baseState, o = 0, y = d = s = null;
        }
    }
    "
);

to!(
    deno_9121_2,
    "
    var _ = 1;
    function wt() {
        if (u !== null) {
            if (y !== null) {
                var _ = 2;
            }
        }
        if (i !== null) {
            _ = 3;
        }
    }
    ",
    "
    var _ = 1;
    function wt() {
        if (u !== null) {
            if (y !== null) {
                var _1 = 2;
            }
        }
        if (i !== null) {
            _1 = 3;
        }
    }
    "
);

to_ts!(
    type_parameter_used_as_type_parameter_contrain,
    "
    function foo<T, U extends T>(x: T, y: U): T {
        x = y;
        return y;
    }
    
    function foo2<U extends T, T>(x: T, y: U): T {
        x = y;
        return y;
    }
    
    var f = function <T, U extends T>(x: T, y: U): T {
        x = y;
        return y;
    }
    
    var f2 = function <U extends T, T>(x: T, y: U): T {
        x = y;
        return y;
    }
    
    var f3 = <T, U extends T>(x: T, y: U): T => {
        x = y;
        return y;
    }
    
    var f4 = <U extends T, T>(x: T, y: U): T => {
        x = y;
        return y;
    }
    ",
    "
    function foo<T__2, U__2 extends T__2>(x__2: T__2, y__2: U__2): T__2 {
        x__2 = y__2;
        return y__2;
    }
    function foo2<U__3 extends T__3, T__3>(x__3: T__3, y__3: U__3): T__3 {
        x__3 = y__3;
        return y__3;
    }
    var f = function<T__4, U__4 extends T__4>(x__4: T__4, y__4: U__4): T__4 {
        x__4 = y__4;
        return y__4;
    };
    var f2 = function<U__5 extends T__5, T__5>(x__5: T__5, y__5: U__5): T__5 {
        x__5 = y__5;
        return y__5;
    };
    var f3 = <T__6, U__6 extends T__6>(x__6: T__6, y__6: U__6)=>{
        x__6 = y__6;
        return y__6;
    };
    var f4 = <U__7 extends T__7, T__7>(x__7: T__7, y__7: U__7)=>{
        x__7 = y__7;
        return y__7;
    };    
    "
);

to_ts!(
    type_parameter_used_as_type_parameter_contrain_2,
    "
    var f3 = <T, U extends T>(x: T, y: U): T => {
        x = y;
        return y;
    }
    ",
    "
    var f3 = <T__2, U__2 extends T__2>(x__2: T__2, y__2: U__2)=>{
        x__2 = y__2;
        return y__2;
    };
    "
);

to_ts!(
    type_parameter_used_as_type_parameter_contrain_3,
    "
    var f4 = <U extends T, T>(x: T, y: U): T => {
        x = y;
        return y;
    }
    ",
    "
    var f4 = <U__2 extends T__2, T__2>(x__2: T__2, y__2: U__2)=>{
        x__2 = y__2;
        return y__2;
    };
    "
);

to_ts!(
    generic_call_type_argument_inference,
    "
    class C<T, U> {
        constructor(public t: T, public u: U) {
        }
    
        foo(t: T, u: U) {
            return t;
        }
    
        foo2(t: T, u: U) {
            return u;
        }
    
        foo3<T>(t: T, u: U) {
            return t;
        }
    
        foo4<U>(t: T, u: U) {
            return t;
        }
    
        foo5<T,U>(t: T, u: U) {
            return t;
        }
    
        foo6<T, U>() {
            var x: T;
            return x;
        }
    
        foo7<T, U>(u: U) {
            var x: T;
            return x;
        }
    
        foo8<T, U>() {
            var x: T;
            return x;
        }
    }    
    ",
    "
    class C<T, U> {
        constructor(public t__2: T, public u__2: U){
        }
        foo(t__3: T, u__3: U) {
            return t__3;
        }
        foo2(t__4: T, u__4: U) {
            return u__4;
        }
        foo3<T__5>(t__5: T__5, u__5: U) {
            return t__5;
        }
        foo4<U__6>(t__6: T, u__6: U__6) {
            return t__6;
        }
        foo5<T__7, U__7>(t__7: T__7, u__7: U__7) {
            return t__7;
        }
        foo6<T__8, U__8>() {
            var x__8: T__8;
            return x__8;
        }
        foo7<T__9, U__9>(u__9: U__9) {
            var x__9: T__9;
            return x__9;
        }
        foo8<T__10, U__10>() {
            var x__10: T__10;
            return x__10;
        }
    }
    "
);

to_ts!(
    generated_contextual_typing_01,
    "
    class Base { private p; }
    var x338 = (n: { (): Base[]; }) => n;
    x338(function named() { return [d1, d2] });
    ",
    "
    class Base {
        private p__0;
    }
    var x338 = (n__2: {
        (): Base[];
    })=>n__2;
    x338(function named__3() {
        return [
            d1,
            d2
        ];
    });
    "
);

to!(
    issue_1402,
    "
    var e = 1;
    try {
        throw 2;
    } catch (e) {
        console.log(e);
    }
    ",
    "
    var e = 1;
    try {
        throw 2;
    } catch (e1) {
        console.log(e1);
    }
    "
);

to_ts!(
    deno_lint_612_1,
    "
    class T {
        #foo(x) {}
        #bar(x) {}
    }
  ",
    "
    class T {
        #foo__0(x__2) {
       }
        #bar__0(x__3) {
       }
    }
    "
);

to_ts!(
    deno_lint_612_2,
    "
    class T {
        #foo(x) {
            use(x)
        }
        #bar(x) {
            use(x)
        }
    }
  ",
    "
    class T {
        #foo__0(x__2) {
            use(x__2);
        }
        #bar__0(x__3) {
            use(x__3);
        }
    }
    "
);

to_ts!(
    tsc_conformance_types_type_aliases_type_aliases_1,
    "
    interface I6 { x : string }
    type T6 = I6;
    var x6: I6;
    var x6: T6;
    ",
    "
    interface I6 {
        x__0: string;
    }
    type T6 = I6;
    var x6: I6;
    var x6: T6;
    "
);

#[test]
fn issue_1279_1() {
    run_test_with_config(
        Default::default(),
        || resolver(),
        "class Foo {
            static f = 1;
            static g = Foo.f;
        }",
        "
        let Foo1 = class Foo {
            static f = 1;
            static g = Foo.f;
        };
        ",
        Config {
            keep_class_names: true,
        },
    );
}

#[test]
fn issue_1279_2() {
    run_test_with_config(
        Default::default(),
        || resolver(),
        "class Foo {
            static f = 1;
            static g = Foo.f;
            method() {
                class Foo {
                    static nested = 1;
                    static nested2 = Foo.nested;
                }
            }
        }",
        "
        let Foo1 = class Foo {
            static f = 1;
            static g = Foo.f;
            method() {
                let Foo2 = class Foo {
                    static nested = 1;
                    static nested2 = Foo.nested;
                };
            }
        };
        ",
        Config {
            keep_class_names: true,
        },
    );
}

to_ts!(
    deno_9650_1,
    "
    export class X {
        constructor() {
        }
        bad(target :number) {
            const d = 1;
            const min = 0;
            const max = 100;
            console.log('x', `duration ${d} not in range - ${min} ≥ ${d} && ${max} ≥ ${d}`);
        }
    }
    ",
    "
    export class X {
        constructor(){
        }
        bad(target__2: number) {
            const d__2 = 1;
            const min__2 = 0;
            const max__2 = 100;
            console.log('x', `duration ${d__2} not in range - ${min__2} ≥ ${d__2} && ${max__2} ≥ \
     ${d__2}`);
        }
    }
    "
);

to_ts!(
    issue_1517_1,
    "
    interface X {
        get foo(): string;
        set foo(v: string | number);
    }
    ",
    "
    interface X {
        get foo__0(): string;
        set foo__0(v: string | number);
    }
    "
);

to_ts!(
    issue_1517_2,
    "
    type Y = {
        get bar(): string;
        set bar(v: string | number);
    }
    ",
    "
    type Y = {
        get bar__0(): string;
        set bar__0(v: string | number);
    }
    "
);

to_ts!(
    tsc_computed_property_name_11,
    "
    var s: string;
    var n: number;
    var a: any;
    var v = {
        get [s]() { return 0; },
        set [n](v) { },
        get [s + s]() { return 0; },
        set [s + n](v) { },
        get [+s]() { return 0; },
        set [\"\"](v) { },
        get [0]() { return 0; },
        set [a](v) { },
        get [<any>true]() { return 0; },
        set [`hello bye`](v) { },
        get [`hello ${a} bye`]() { return 0; }
    }
    ",
    "
    var s: string;
    var n: number;
    var a: any;
    var v = {
        get [s]() { return 0; },
        set [n](v__2) { },
        get [s + s]() { return 0; },
        set [s + n](v__2) { },
        get [+s]() { return 0; },
        set [\"\"](v__2) { },
        get [0]() { return 0; },
        set [a](v__2) { },
        get [<any>true]() { return 0; },
        set [`hello bye`](v__2) { },
        get [`hello ${a} bye`]() { return 0; }
    }
    "
);

to!(
    fn_expr_scope,
    r#"
    test(function foo() {
        foo = function foo(x) {
            return x === 0 ? 1 : 1 + foo(x - 1);
        };
        return foo(10);
    });
    "#,
    r#"
    test(function foo() {
        foo = function foo1(x) {
            return x === 0 ? 1 : 1 + foo1(x - 1);
        };
        return foo(10);
    });
    "#
);

to!(
    class_expr_scope,
    r#"
    let Test = 2;
    test(class Test {
        hi() {
            console.log(Test);
        }
    });
    Test = 4;
    "#,
    r#"
    let Test = 2;
    test(class Test1 {
        hi() {
            console.log(Test1);
        }
    });
    Test = 4;
    "#
);

to!(
    export_default_fn_decl_scope,
    r#"
    export default function foo() {
        foo = function foo(x) {
            return x === 0 ? 1 : 1 + foo(x - 1);
        };
        return foo(10);
    }

    foo = 2;
    "#,
    r#"
    export default function foo() {
        foo = function foo1(x) {
            return x === 0 ? 1 : 1 + foo1(x - 1);
        };
        return foo(10);
    }

    foo = 2;
    "#
);
to!(
    export_default_class_decl_scope,
    r#"
    export default class Test {
        hi() {
            let Test = 2;
            console.log(Test);
        }
    }

    Test = 2;
    "#,
    r#"
    export default class Test {
        hi() {
            let Test1 = 2;
            console.log(Test1);
        }
    }

    Test = 2;
    "#
);

to!(
    nested_fn_expr_var_scope,
    r#"
    var Test = (function () {
        var Test = (function () {
            var Test = 2;
            return Test;
        })();
      
        return Test;
      })();      
    "#,
    r#"
    var Test = function() {
        var Test1 = function() {
            var Test2 = 2;
            return Test2;
        }();
        return Test1;
    }();
    "#
);

to!(
    nested_fn_expr_var_scope_fn,
    r#"
    var Test = (function () {
        var Test = (function () {
            function Test() {}
            return Test;
        })();
      
        return Test;
      })();      
    "#,
    r#"
    var Test = function() {
        var Test1 = function() {
            function Test2() {
            }
            return Test2;
        }();
        return Test1;
    }();
    "#
);

to!(
    nested_arrow_expr_var_scope,
    r#"
    var Test = (() => {
        var Test = (() => {
            var Test = 2;
            return Test;
        })();
      
        return Test;
      })();          
    "#,
    r#"
    var Test = (()=>{
        var Test1 = (()=>{
            var Test2 = 2;
            return Test2;
        })();
        return Test1;
    })();
    "#
);

to!(
    block_scope_class,
    r#"
    const g = 20;

    function baz() {
        {
            class g {}
            console.log(g);
        }

        return g;
    }
    "#,
    r#"
    const g = 20;

    function baz() {
        {
            class g1 {}
            console.log(g1);
        }

        return g;
    }
    "#
);
