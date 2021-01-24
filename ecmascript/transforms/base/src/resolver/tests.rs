use super::*;
use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_visit::{as_folder, Fold, VisitMut, VisitMutWith};

struct TsHygiene {
    top_level_mark: Mark,
}

impl VisitMut for TsHygiene {
    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.type_ann.visit_mut_with(self);

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

    fn visit_mut_prop_name(&mut self, _: &mut PropName) {}

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
    crate::tests::test_transform(syntax, |_| tr(), src, to, true);
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

        let folder1 = Resolver::new(mark1, Scope::new(ScopeKind::Block, None), None, true);
        let mut folder2 = Resolver::new(
            mark2,
            Scope::new(ScopeKind::Block, Some(&folder1.current)),
            None,
            true,
        );
        folder2.current.declared_symbols.insert("foo".into());

        let mut folder3 = Resolver::new(
            mark3,
            Scope::new(ScopeKind::Block, Some(&folder2.current)),
            None,
            true,
        );
        folder3.current.declared_symbols.insert("bar".into());
        assert_eq!(folder3.mark_for_ref(&"bar".into()), Some(mark3));

        let mut folder4 = Resolver::new(
            mark4,
            Scope::new(ScopeKind::Block, Some(&folder3.current)),
            None,
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
        var ConstructorScoping = function ConstructorScoping() {
            _classCallCheck(this, ConstructorScoping);
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
    var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
            }
            return Foo;
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
    var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
            }
            return Foo;
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
  __assign = Object.assign || function __assign(t) {
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
    "__assign = Object.assign || function __assign(t) {
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
var Foo = function Foo() {
    _classCallCheck(this, Foo);
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
    var Foo = function Foo() {
        _classCallCheck(this, Foo);
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
    var bar = function bar() {
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
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o1, p1) {
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

identical!(
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
}
"
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
    } catch (e) {
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

identical!(
    issue_788_1,
    "window.addEventListener('message', (e) => {
    try {
        console.log(e.data);
    } catch(e) {
        console.log(e);
    }
});"
);

identical!(
    issue_788_2,
    "window.addEventListener('message', function(e) {
    try {
        console.log(e.data);
    } catch(e) {
        console.log(e);
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
    ts_resolver_neseted_interface,
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
    name: string;
}
function foo() {
    interface Foo__2 {
        name: string;
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
    ts_resolver_neseted_type_alias,
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
        x: T__2;
    }
    interface B {
        m: string;
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
            x: T__3;
        }
        interface B__2 {
            m: string;
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
        Fe = !1;
        var i = l.firstBaseUpdate,
            o = l.lastBaseUpdate,
            u = l.shared.pending;
        if (u !== null) {
            l.shared.pending = null;
            var s = u,
                d = s.next;
            s.next = null, o === null ? i = d : o.next = d, o = s;
            var y = e.alternate;
            if (y !== null) {
                y = y.updateQueue;
                var _ = y.lastBaseUpdate;
                _ !== o && (_ === null ? y.firstBaseUpdate = d : _.next = d, y.lastBaseUpdate = s)
            }
        }
        if (i !== null) {
            _ = l.baseState, o = 0, y = d = s = null;
            do {
                u = i.lane;
                var h = i.eventTime;
                if ((r & u) === u) {
                    y !== null && (y = y.next = {
                        eventTime: h,
                        lane: 0,
                        tag: i.tag,
                        payload: i.payload,
                        callback: i.callback,
                        next: null
                    });
                    e: {
                        var k = e,
                            E = i;
                        switch (u = n, h = t, E.tag) {
                            case 1:
                                if (k = E.payload, typeof k == 'function') {
                                    _ = k.call(h, _, u);
                                    break e
                                }
                                _ = k;
                                break e;
                            case 3:
                                k.flags = k.flags & -4097 | 64;
                            case 0:
                                if (k = E.payload, u = typeof k == 'function' ? k.call(h, _, u) : \
     k, u == null) break e;
                                _ = R({}, _, u);
                                break e;
                            case 2:
                                Fe = !0
                        }
                    }
                    i.callback !== null && (e.flags |= 32, u = l.effects, u === null ? l.effects = \
     [i] : u.push(i))
                } else h = {
                    eventTime: h,
                    lane: u,
                    tag: i.tag,
                    payload: i.payload,
                    callback: i.callback,
                    next: null
                }, y === null ? (d = y = h, s = _) : y = y.next = h, o |= u;
                if (i = i.next, i === null) {
                    if (u = l.shared.pending, u === null) break;
                    i = u.next, u.next = null, l.lastBaseUpdate = u, l.shared.pending = null
                }
            } while (1);
            y === null && (s = _), l.baseState = s, l.firstBaseUpdate = d, l.lastBaseUpdate = y, \
     gt |= o, e.lanes = o, e.memoizedState = _
        }
    }
    ",
    ""
);
