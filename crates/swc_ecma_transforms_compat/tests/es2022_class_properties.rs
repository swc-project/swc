#![allow(deprecated)]

use std::{fs::read_to_string, path::PathBuf};

use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{arrow, block_scoping, classes, function_name, template_literal},
    es2016::exponentiation,
    es2017::async_to_generator,
    es2022::class_properties,
    es3::reserved_words,
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, Tester};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        ..Default::default()
    })
}

fn tr(t: &Tester) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        function_name(),
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping(),
        reserved_words(false),
    )
}

test!(
    syntax(),
    |t| tr(t),
    public_static_infer_name,
    r#"
var Foo = class {
  static num = 0;
}

"#,
    r#"
var _Foo;
var Foo = (_Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    },
    _defineProperty(_Foo, "num", 0),
    _Foo);
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_call_exec,
    r#"
class Foo {
  foo = function() {
    return this;
  }

  test(other) {
    return [this.foo(), other.foo()];
  }
}

const f = new Foo;
const o = new Foo;
const test = f.test(o);
expect(test[0]).toBe(f);
expect(test[1]).toBe(o);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_instance_computed,
    r#"
function test(x) {
  class F {
    [x] = 1;
    constructor() {}
  }

  x = 'deadbeef';
  expect(new F().foo).toBe(1);
  x = 'wrong';
  expect(new F().foo).toBe(1);
}

test('foo');

"#,
    r#"
function test(x) {
    var _x = x;
    var F = function F() {
        "use strict";
        _classCallCheck(this, F);
        _defineProperty(this, _x, 1);
    };
    x = 'deadbeef';
    expect(new F().foo).toBe(1);
    x = 'wrong';
    expect(new F().foo).toBe(1);
}
test('foo');

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_statement,
    r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    super();
  }
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function (Bar1) {
  "use strict";

  _inherits(Foo, Bar1);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;

    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    return _this;
  }

  return Foo;
}(Bar);

"#
);

test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            function_name(),
            class_properties(Some(t.comments.clone()), Default::default()),
        )
    },
    private_class_method,
    r#"
class Foo {
    #foo () {}
}
"#,
    r#"
var _foo = new WeakSet();
class Foo {
    constructor(){
        _classPrivateMethodInit(this, _foo);
    }
}
function foo() {
}
"#
);

test!(
    syntax(),
    |t| tr(t),
    private_foobar,
    r#"
class Child extends Parent {
  constructor() {
    super();
  }

  #scopedFunctionWithThis = () => {
    this.name = {};
  }
}

"#,
    r#"
var _scopedFunctionWithThis = new WeakMap();
var Child =
/*#__PURE__*/
function (Parent) {
  "use strict";

  _inherits(Child, Parent);
  var _super = _createSuper(Child);
  function Child() {
    _classCallCheck(this, Child);
    var _this;

    _this = _super.call(this);

    _classPrivateFieldInit(_assertThisInitialized(_this), _scopedFunctionWithThis, {
      writable: true,
      value: () => {
        _this.name = {};
      }
    });

    return _this;
  }

  return Child;
}(Parent);
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_call_exec,
    r#"
class Foo {
  #foo = function() {
    return this;
  }

  test(other) {
    return [this.#foo(), other.#foo()];
  }
}

const f = new Foo;
const o = new Foo;
const test = f.test(o);
expect(test[0]).toBe(f);
expect(test[1]).toBe(o);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_derived_multiple_supers,
    r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    if (condition) {
      super();
    } else {
      super();
    }
  }
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function (Bar1) {
  "use strict";

  _inherits(Foo, Bar1);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;


    if (condition) {
      _this = _super.call(this);
      _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    } else {
      _this = _super.call(this);
      _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    }

    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_static_call_exec,
    r#"
class Foo {
  static #foo = function(x) {
    return x;
  }

  test(x) {
    return Foo.#foo(x);
  }
}

const f = new Foo;
const test = f.test();
expect(f.test("bar")).toBe("bar");

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_instance_undefined_exec,
    r#"
class Foo {
  #bar;

  test() {
    return this.#bar;
  }
}

expect(new Foo().test()).toBe(undefined);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_instance_exec,
    r#"
class Foo {
  #bar = "foo";

  test() {
    return this.#bar;
  }

  update() {
    this.#bar++;
  }

  set(val) {
    this.#bar = val;
  }

  static test(foo) {
    return foo.#bar;
  }

  static update(foo) {
    foo.#bar **= 2;
  }
}

const f = new Foo();
expect(f.test()).toBe("foo");
expect(Foo.test(f)).toBe("foo");
expect("bar" in f).toBe(false);

f.set(1);
expect(f.test()).toBe(1);
f.update();
expect(Foo.test(f)).toBe(2);
Foo.update(f);
expect(f.test()).toBe(4);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_regression_t6719,
    r#"
function withContext(ComposedComponent) {
    return class WithContext extends Component {

        static propTypes = {
            context: PropTypes.shape(
                {
                    addCss: PropTypes.func,
                    setTitle: PropTypes.func,
                    setMeta: PropTypes.func,
                }
            ),
        };
    };
}

"#,
    r#"
function withContext(ComposedComponent) {
  var _WithContext
  return _WithContext = function(Component1) {
      "use strict";
      _inherits(WithContext, Component1);
      var _super = _createSuper(WithContext);
      function WithContext() {
        _classCallCheck(this, WithContext);
        return _super.apply(this, arguments);
      }
      return WithContext;
    }(Component),
    _defineProperty(_WithContext, "propTypes", {
      context: PropTypes.shape({
        addCss: PropTypes.func,
        setTitle: PropTypes.func,
        setMeta: PropTypes.func
      })
    }),
    _WithContext;
}

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_with_collision,
    r#"
class A {
  force = force;
  foo = super.method();

  constructor(force) {}
}

"#,
    r#"
var A = function A(force1) {
  "use strict";

  _classCallCheck(this, A);
  _defineProperty(this, "force", force);
  _defineProperty(this, "foo", _get(_getPrototypeOf(A.prototype), "method", this).call(this));
};

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_call,
    r#"
class Foo {
  foo = function() {
    return this;
  }

  test(other) {
    this.foo();
    other.obj.foo();
  }
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);
    _defineProperty(this, "foo", function () {
      return this;
    });
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      this.foo();
      other.obj.foo();
    }
  }]);
  return Foo;
}();

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_instance_computed_exec,
    r#"
function test(x) {
  class F {
    [x] = 1;
    constructor() {}
  }

  x = 'deadbeef';
  expect(new F().foo).toBe(1);
  x = 'wrong';
  expect(new F().foo).toBe(1);
}

test('foo');

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_declaration_order,
    r#"
class C {
  y = this.#x;
  #x;
}

expect(() => {
  new C();
}).toThrow();

"#,
    r#"
var _x = new WeakMap();
var C = function C() {
  "use strict";

  _classCallCheck(this, C);
  _defineProperty(this, "y", _classPrivateFieldGet(this, _x));

  _classPrivateFieldInit(this, _x, {
    writable: true,
    value: void 0
  });
};

expect(() => {
  new C();
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    nested_class_super_call_in_key,
    r#"

class Hello {
  constructor() {
    return {
      toString() {
        return 'hello';
      },
    };
  }
}

class Outer extends Hello {
  constructor() {
    class Inner {
      [super()] = "hello";
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#,
    r#"


var Hello = function Hello() {
  "use strict";
  _classCallCheck(this, Hello);
  return {
    toString() {
      return 'hello';
    }

  };
};

var Outer = function (Hello) {
  "use strict";
  _inherits(Outer, Hello);
  var _super = _createSuper(Outer);
  function Outer() {
    _classCallCheck(this, Outer);
    var _this;

    var _ref = _this = _super.call(this);

    var Inner = function Inner() {
      _classCallCheck(this, Inner);
      _defineProperty(this, _ref, "hello");
    };

    return _possibleConstructorReturn(_this, new Inner());
  }

  return Outer;
}(Hello);

expect(new Outer().hello).toBe('hello');

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_instance_undefined,
    r#"
class Foo {
  bar;
}

"#,
    r#"
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", void 0);
};

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_derived_multiple_supers,
    r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    if (condition) {
      super();
    } else {
      super();
    }
  }
}

"#,
    r#"
var _bar = new WeakMap();
var Foo =
/*#__PURE__*/
function (Bar) {
  "use strict";

  _inherits(Foo, Bar);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;


    if (condition) {
      _this = _super.call(this);

      _classPrivateFieldInit(_assertThisInitialized(_this), _bar, {
        writable: true,
        value: "foo"
      });
    } else {
      _this = _super.call(this);

      _classPrivateFieldInit(_assertThisInitialized(_this), _bar, {
        writable: true,
        value: "foo"
      });
    }

    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_native_classes_exec,
    r#"
class Foo {
  static foo = "foo";
  bar = "bar";

  static test() {
    return Foo.foo;
  }

  test() {
    return this.bar;
  }
}

const f = new Foo();
expect("foo" in Foo).toBe(true)
expect("bar" in f).toBe(true)
expect(Foo.test()).toBe("foo")
expect(f.test()).toBe("bar")

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_regression_t2983,
    r#"
call(class {
  static test = true
});

export default class {
  static test = true
}

"#,
    r#"
  var _class
  call((_class = function _class() {
          "use strict";
          _classCallCheck(this, _class);
      },
      _defineProperty(_class, "test", true),
      _class
  ));
  var _class1 = function _class1() {
      "use strict";
      _classCallCheck(this, _class1);
  };
  _defineProperty(_class1, "test", true);
  export { _class1 as default };
"#
);

test!(
    syntax(),
    |t| tr(t),
    public_static,
    r#"
class Foo {
  static bar = "foo";
}

"#,
    r#"
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
};

_defineProperty(Foo, "bar", "foo");

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_instance_undefined,
    r#"
class Foo {
  #bar;
}

"#,
    r#"
var _bar = new WeakMap();
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _bar, {
    writable: true,
    value: void 0
  });
};
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_declaration_order_exec,
    r#"
class C {
  y = this.#x;
  #x;
}

expect(() => {
  new C();
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_update,
    r#"
class Foo {
  foo = 0;

  test(other) {
    this.foo++;
    ++this.foo;
    other.obj.foo++;
    ++other.obj.foo;
  }
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);
    _defineProperty(this, "foo", 0);
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      this.foo++;
      ++this.foo;
      other.obj.foo++;
      ++other.obj.foo;
    }
  }]);
  return Foo;
}();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_call,
    r#"
class A {
  foo() {
    return "bar";
  }
}

class B extends A {
  foo = super.foo();
}

"#,
    "
var A =
/*#__PURE__*/
function () {
  \"use strict\";

  function A() {
    _classCallCheck(this, A);
  }

  _createClass(A, [{
    key: \"foo\",
    value: function foo() {
      return \"bar\";
    }
  }]);
  return A;
}();

var B =
/*#__PURE__*/
function (A) {
  \"use strict\";

  _inherits(B, A);
  var _super = _createSuper(B);
  function B() {
    _classCallCheck(this, B);
    var _this;

    _this = _super.apply(this, arguments);
    _defineProperty(_assertThisInitialized(_this), \"foo\", _get((_assertThisInitialized(_this), \
     _getPrototypeOf(B.prototype)), \"foo\", _this).call(_this));
    return _this;
  }

  return B;
}(A);

"
);

test!(
    syntax(),
    |t| tr(t),
    private_constructor_collision,
    r#"
var foo = "bar";

class Foo {
  #bar = foo;

  constructor() {
    var foo = "foo";
  }
}

"#,
    r#"
var foo = "bar";
var _bar = new WeakMap();

var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _bar, {
    writable: true,
    value: foo
  });
  var foo1 = "foo";

};
"#
);

test!(
    syntax(),
    |t| tr(t),
    public_constructor_collision,
    r#"
var foo = "bar";

class Foo {
  bar = foo;
  static bar = baz;

  constructor() {
    var foo = "foo";
    var baz = "baz";
  }
}

"#,
    r#"
var foo = "bar";

var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", foo);
  var foo1 = "foo";
  var _$baz = "baz";
};

_defineProperty(Foo, "bar", baz);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_computed,
    r#"
const foo = "foo";
const bar = () => {};
const four = 4;

class MyClass {
  static [one()] = "test";
  static [2 * 4 + 7] = "247";
  static [2 * four + 7] = "247";
  static [2 * four + seven] = "247";
  [null] = "null";
  [undefined] = "undefined";
  [void 0] = "void 0";
  get ["whatever"]() {}
  set ["whatever"](value) {}
  get [computed()]() {}
  set [computed()](value) {}
  ["test" + one]() {}
  static [10]() {}
  [/regex/] = "regex";
  [foo] = "foo";
  [bar] = "bar";
  [baz] = "baz";
  [`template`] = "template";
  [`template${expression}`] = "template-with-expression";
}

"#,
    r#"
var foo = "foo";
var bar = ()=>{
};
var four = 4;
var _ref = one(),
    _ref1 = 2 * 4 + 7,
    _ref2 = 2 * four + 7,
    _ref3 = 2 * four + seven,
    _undefined = undefined,
    _ref4 = void 0,
    tmp = computed(),
    tmp1 = computed(),
    tmp2 = "test" + one,
    _ref5 = /regex/,
    _foo = foo,
    _bar = bar,
    _baz = baz,
    _ref6 = `template${expression}`;


var MyClass = function() {
    "use strict";
    function MyClass() {
        _classCallCheck(this, MyClass);
        _defineProperty(this, null, "null");
        _defineProperty(this, _undefined, "undefined");
        _defineProperty(this, _ref4, "void 0");
        _defineProperty(this, _ref5, "regex");
        _defineProperty(this, _foo, "foo");
        _defineProperty(this, _bar, "bar");
        _defineProperty(this, _baz, "baz");
        _defineProperty(this, `template`, "template");
        _defineProperty(this, _ref6, "template-with-expression");
    }
    _createClass(MyClass, [{
             key: "whatever", get: function () {
                }
        }, {
             key: "whatever", set: function (value) {
                }
        }, {
             key: tmp, get: function () {
                }
        }, {
             key: tmp1, set: function (value) {
                }
        }, {
             key: tmp2, value: function () {
                }
        }], [{
             key: 10, value: function () {
                }
        }]);
    return MyClass;
}();
_defineProperty(MyClass, _ref, "test");
_defineProperty(MyClass, _ref1, "247");
_defineProperty(MyClass, _ref2, "247");
_defineProperty(MyClass, _ref3, "247");

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_assignment,
    r#"
class Foo {
  foo = 0;

  test(other) {
    this.foo++;
    this.foo += 1;
    this.foo = 2;
    other.obj.foo++;
    other.obj.foo += 1;
    other.obj.foo = 2;
  }
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);
    _defineProperty(this, "foo", 0);
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      this.foo++;
      this.foo += 1;
      this.foo = 2;
      other.obj.foo++;
      other.obj.foo += 1;
      other.obj.foo = 2;
    }
  }]);
  return Foo;
}();

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_static_exec,
    r#"
class Foo {
  static num = 0;
  static str = "foo";
}

expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.str).toBe("foo");
expect(Foo.str = "bar").toBe("bar");

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    regression_7371_exec_1,
    r#"

class C {
}

class A extends C {
  field = 1;

  constructor() {
    super();

    class B extends C {
      constructor() {
        super();

        expect(this.field).toBeUndefined();
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new A();
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    regression_7371_exec_2,
    r#"
class Obj {
  constructor() {
    return {};
  }
}

// ensure superClass is still transformed
class SuperClass extends Obj {
  field = 1;

  constructor() {
    class B extends (super(), Obj) {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new SuperClass();

// ensure ComputedKey Method is still transformed
class ComputedMethod extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()]() { }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedMethod();


// ensure ComputedKey Field is still transformed
class ComputedField extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()] = 1;
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedField();

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_static_inherited_exec,
    r#"
class Base {
  static #foo = 1;

  static getThis() {
    return this.#foo;
  }

  static updateThis(val) {
    return (this.#foo = val);
  }

  static getClass() {
    return Base.#foo;
  }

  static updateClass(val) {
    return (Base.#foo = val);
  }
}

class Sub1 extends Base {
  static #foo = 2;

  static update(val) {
    return (this.#foo = val);
  }
}

class Sub2 extends Base {}

expect(Base.getThis()).toBe(1);
expect(Base.getClass()).toBe(1);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(1);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(1);

expect(Sub1.update(3)).toBe(3);
expect(Base.getThis()).toBe(1);
expect(Base.getClass()).toBe(1);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(1);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(1);

expect(Base.updateThis(4)).toBe(4);
expect(Base.getThis()).toBe(4);
expect(Base.getClass()).toBe(4);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(4);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(4);

expect(Base.updateClass(5)).toBe(5);
expect(Base.getThis()).toBe(5);
expect(Base.getClass()).toBe(5);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(5);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(5);

expect(() => Sub2.updateThis(6)).toThrow();
expect(Sub2.updateClass(7)).toBe(7);
expect(Base.getThis()).toBe(7);
expect(Base.getClass()).toBe(7);
expect(() => Sub1.getThis()).toThrow();
expect(Sub1.getClass()).toBe(7);
expect(() => Sub2.getThis()).toThrow();
expect(Sub2.getClass()).toBe(7);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    nested_class_super_property_in_key_exec,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    class Inner {
      [super.toString()] = 'hello';
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_super_statement,
    r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    super();
  }
}

"#,
    r#"
var _bar = new WeakMap();
var Foo =
/*#__PURE__*/
function (Bar) {
  "use strict";

  _inherits(Foo, Bar);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;

    _this = _super.call(this);

    _classPrivateFieldInit(_assertThisInitialized(_this), _bar, {
      writable: true,
      value: "foo"
    });

    return _this;
  }

  return Foo;
}(Bar);
"#
);

test!(
    syntax(),
    |t| tr(t),
    private_private_in_derived,
    r#"
class Outer {
  #outer;

  constructor() {
    class Test extends this.#outer {
    }
  }
}

"#,
    r#"
var _outer = new WeakMap();

var Outer = function Outer() {
 "use strict";
  _classCallCheck(this, Outer);
  var _this = this;

  _classPrivateFieldInit(this, _outer, {
    writable: true,
    value: void 0
  });

  var Test = function (_superClass) {
    _inherits(Test, _superClass);
    var _super = _createSuper(Test);
    function Test() {
      _classCallCheck(this, Test);
      return _super.apply(this, arguments);
    }

    return Test;
  }(_classPrivateFieldGet(_this, _outer));
};
"#
);

test!(
    syntax(),
    |t| tr(t),
    private_update,
    r#"
class Foo {
  #foo = 0;

  test(other) {
    this.#foo++;
    ++this.#foo;
    other.obj.#foo++;
    ++other.obj.#foo;
  }
}

"#,
    r#"
var _foo = new WeakMap();
var Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 0
        });
    }
    _createClass(Foo, [
        {
            key: "test",
            value: function test(other) {
                _classPrivateFieldUpdate(this, _foo).value++;
                ++_classPrivateFieldUpdate(this, _foo).value;
                _classPrivateFieldUpdate(other.obj, _foo).value++;
                ++_classPrivateFieldUpdate(other.obj, _foo).value;
            }
        }
    ]);
    return Foo;
}();
"#
);

test!(
    syntax(),
    |t| tr(t),
    public_super_expression,
    r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    foo(super());
  }
}

"#,
    r#"
var Foo = function (Bar1) {
  "use strict";

  _inherits(Foo, Bar1);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;

    var _temp;
    foo((_temp = _this = _super.call(this), _defineProperty(_assertThisInitialized(_this), "bar", "foo"), _temp));
    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_computed_initialization_order_exec,
    r#"
const actualOrder = [];

const track = i => {
  actualOrder.push(i);
  return i;
};

class MyClass {
  static [track(1)] = track(10);
  [track(2)] = track(13);
  get [track(3)]() {
    return "foo";
  }
  set [track(4)](value) {
    this.bar = value;
  }
  [track(5)] = track(14);
  static [track(6)] = track(11);
  static [track(7)] = track(12);
  [track(8)]() {}
  [track(9)] = track(15);
}

const inst = new MyClass();

const expectedOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
expect(actualOrder).toEqual(expectedOrder);

expect(MyClass[1]).toBe(10);
expect(inst[2]).toBe(13);
expect(inst[3]).toBe("foo");
inst[4] = "baz";
expect(inst.bar).toBe("baz");
expect(inst[5]).toBe(14);
expect(MyClass[6]).toBe(11);
expect(MyClass[7]).toBe(12);
expect(typeof inst[8]).toBe("function");
expect(inst[9]).toBe(15);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    nested_class_super_call_in_key_exec,
    r#"

class Hello {
  constructor() {
    return {
      toString() {
        return 'hello';
      },
    };
  }
}

class Outer extends Hello {
  constructor() {
    class Inner {
      [super()] = "hello";
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_update_exec,
    r#"
class Foo {
  #foo = 0;

  test(other) {
    return [
      this.#foo++,
      this.#foo,
      ++this.#foo,
      this.#foo,
      other.obj.#foo++,
      other.obj.#foo,
      ++other.obj.#foo,
      other.obj.#foo,
    ];
  }
}

const f = new Foo;
const results = f.test({ obj: f });
expect(results[0]).toBe(0);
expect(results[1]).toBe(1);
expect(results[2]).toBe(2);
expect(results[3]).toBe(2);
expect(results[4]).toBe(2);
expect(results[5]).toBe(3);
expect(results[6]).toBe(4);
expect(results[7]).toBe(4);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_extracted_this,
    r#"
var foo = "bar";

class Foo {
  bar = this;
  baz = foo;

  constructor(foo) {
  }
}

"#,
    r#"
var foo = "bar";

var Foo = function Foo(foo1) {
  "use strict";

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", this);
  _defineProperty(this, "baz", foo);
};

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_derived,
    r#"
class Foo {
  #prop = "foo";
}

class Bar extends Foo {
  #prop = "bar";
}

"#,
    r#"
var _prop = new WeakMap();
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _prop, {
    writable: true,
    value: "foo"
  });
};

var _prop1 = new WeakMap();

var Bar =
/*#__PURE__*/
function (Foo) {
  "use strict";

  _inherits(Bar, Foo);
  var _super = _createSuper(Bar);
  function Bar() {
    _classCallCheck(this, Bar);
    var _this;

    _this = _super.apply(this, arguments);

    _classPrivateFieldInit(_assertThisInitialized(_this), _prop1, {
      writable: true,
      value: "bar"
    });

    return _this;
  }

  return Bar;
}(Foo);
"#
);

test!(
    syntax(),
    |t| tr(t),
    private_super_call,
    r#"
class A {
  foo() {
    return "bar";
  }
}

class B extends A {
  #foo = super.foo();
}

"#,
    r#"
var A = function () {
  "use strict";

  function A() {
    _classCallCheck(this, A);
  }

  _createClass(A, [{
    key: "foo",
    value: function foo() {
      return "bar";
    }
  }]);
  return A;
}();

var _foo = new WeakMap();
var B =
/*#__PURE__*/
function (A) {
  "use strict";

  _inherits(B, A);
  var _super = _createSuper(B);
  function B() {
    _classCallCheck(this, B);
    var _this;

    _this = _super.apply(this, arguments);

    _classPrivateFieldInit(_assertThisInitialized(_this), _foo, {
      writable: true,
      value: _get((_assertThisInitialized(_this), _getPrototypeOf(B.prototype)), "foo", _this).call(_this)
    });

    return _this;
  }

  return B;
}(A);
"#
);

test!(
    syntax(),
    |t| tr(t),
    private_reference_in_other_property,
    r#"
class Foo {
  one = this.#private;
  #two = this.#private;
  #private = 0;
  three = this.#private;
  #four = this.#private;
}

"#,
    r#"
var _two = new WeakMap(), _private = new WeakMap(), _four = new WeakMap();

var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
  _defineProperty(this, "one", _classPrivateFieldGet(this, _private));

  _classPrivateFieldInit(this, _two, {
    writable: true,
    value: _classPrivateFieldGet(this, _private)
  });

  _classPrivateFieldInit(this, _private, {
    writable: true,
    value: 0
  });

  _defineProperty(this, "three", _classPrivateFieldGet(this, _private));

  _classPrivateFieldInit(this, _four, {
    writable: true,
    value: _classPrivateFieldGet(this, _private)
  });
};
"#
);

test!(
    syntax(),
    |t| tr(t),
    nested_class_super_property_in_key,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    class Inner {
      [super.toString()] = 'hello';
    }

    return new Inner();
  }
}

expect(new Outer().hello).toBe('hello');

"#,
    r#"


var Hello = function () {
  "use strict";
  function Hello() {
    _classCallCheck(this, Hello);
  }

  _createClass(Hello, [{
    key: "toString",
    value: function toString() {
      return 'hello';
    }
  }]);
  return Hello;
}();

var Outer = function (Hello) {
  "use strict";
  _inherits(Outer, Hello);
  var _super = _createSuper(Outer);
  function Outer() {
    _classCallCheck(this, Outer);
    var _this = _super.call(this);

    var _ref = _get((_assertThisInitialized(_this), _getPrototypeOf(Outer.prototype)), "toString", _this).call(_this);

    var Inner = function Inner() {
      _classCallCheck(this, Inner);
      _defineProperty(this, _ref, 'hello');
    };

    return _possibleConstructorReturn(_this, new Inner());
  }

  return Outer;
}(Hello);

expect(new Outer().hello).toBe('hello');

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_reevaluated_exec,
    r#"
function classFactory() {
  return class Foo {
    #foo = "foo";
    static #bar = "bar";

    instance() {
      return this.#foo;
    }

    static() {
      return Foo.#bar;
    }

    static instance(inst) {
      return inst.#foo;
    }

    static static() {
      return Foo.#bar;
    }
  };
}

const Foo1 = classFactory();
const Foo2 = classFactory();

const f1 = new Foo1();
const f2 = new Foo2();

expect(f1.instance()).toBe("foo");
expect(f1.static()).toBe("bar");
expect(f2.instance()).toBe("foo");
expect(f2.static()).toBe("bar");

expect(Foo1.instance(f1)).toBe("foo");
expect(Foo1.static()).toBe("bar");
expect(Foo2.instance(f2)).toBe("foo");
expect(Foo2.static()).toBe("bar");

expect(() => {
  f1.instance.call(f2), undefined;
}).toThrow();
expect(() => {
  f2.instance.call(f1), undefined;
}).toThrow();
expect(() => {
  Foo1.instance(f2), undefined;
}).toThrow();
expect(() => {
  Foo2.instance(f1), undefined;
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_numeric,
    r#"
class Foo {
  0 = "foo";
  1 = "bar";
}

"#,
    r#"
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
  _defineProperty(this, 0, "foo");
  _defineProperty(this, 1, "bar");
};

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_assignment,
    r#"
class Foo {
  #foo = 0;

  test(other) {
    this.#foo += 1;
    this.#foo = 2;
    other.obj.#foo += 1;
    other.obj.#foo = 2;
  }
}

"#,
    r#"
var _foo = new WeakMap();
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);

    _classPrivateFieldInit(this, _foo, {
      writable: true,
      value: 0
    });
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _obj;

      _classPrivateFieldSet(this, _foo, _classPrivateFieldGet(this, _foo) + 1);
      _classPrivateFieldSet(this, _foo, 2);
      _classPrivateFieldSet(_obj = other.obj, _foo, _classPrivateFieldGet(_obj, _foo) + 1);
      _classPrivateFieldSet(other.obj, _foo, 2);
    }
  }]);
  return Foo;
}();
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_constructor_collision_exec,
    r#"
var foo = "bar";

class Foo {
  #bar = foo;

  constructor() {
    var foo = "foo";
  }

  test() {
    return this.#bar;
  }
}

const f = new Foo;
expect(f.test()).toBe(foo);
expect("bar" in f).toBe(false);

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_static_export,
    r#"
export class MyClass {
  static property = value;
}

export default class MyClass2 {
  static property = value;
}

"#,
    r#"
export var MyClass = function MyClass() {
  "use strict";
  _classCallCheck(this, MyClass);
};
_defineProperty(MyClass, "property", value);

var MyClass2 = function MyClass2() {
  "use strict";
  _classCallCheck(this, MyClass2);
};

_defineProperty(MyClass2, "property", value);
export { MyClass2 as default };

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_multiple,
    r#"
class Foo {
  #x = 0;
  #y = this.#x;
}

"#,
    r#"
var _x = new WeakMap(), _y = new WeakMap();
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _x, {
    writable: true,
    value: 0
  });

  _classPrivateFieldInit(this, _y, {
    writable: true,
    value: _classPrivateFieldGet(this, _x)
  });
};
"#
);

test!(
    syntax(),
    |t| tr(t),
    public_derived,
    r#"
class Foo extends Bar {
  bar = "foo";
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function (Bar) {
  "use strict";

  _inherits(Foo, Bar);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;

    _this = _super.apply(this, arguments);
    _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    return _this;
  }

  return Foo;
}(Bar);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_static_undefined_exec,
    r#"
class Foo {
  static num;
}

expect("num" in Foo).toBe(true);
expect(Foo.num).toBeUndefined();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_instance,
    r#"
class Foo {
  bar = "foo";
}

"#,
    r#"
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", "foo");
};

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    static_property_tdz_edgest_case_exec,
    r#"
expect(() => {
  class A {
    static [{ x: A || 0 }.x];
  }
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    public_non_block_arrow_func,
    r#"
export default param =>
  class App {
    static props = {
      prop1: 'prop1',
      prop2: 'prop2'
    }

    getParam() {
      return param;
    }
  }

"#,
    r#"
export default ((param)=>{
  var App = function() {
    "use strict";
    function App() {
      _classCallCheck(this, App);
    }
    _createClass(App, [{
      key: "getParam",
      value: function getParam() {
        return param;
      }
    }]);
    return App;
  }();
  _defineProperty(App, "props", {
    prop1: 'prop1', prop2: 'prop2'
  });
  return App;
});
"#
);

test!(
    syntax(),
    |t| tr(t),
    public_static_undefined,
    r#"
class Foo {
  static bar;
}

"#,
    r#"
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);
};

_defineProperty(Foo, "bar", void 0);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_static_infer_name_exec,
    r#"
var Foo = class {
  static num = 0;
}

expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe("Foo");

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    static_property_tdz_general_exec,
    r#"
expect(() => {
  class C {
    static [C + 3] = 3;
  }
}).toThrow();

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_call,
    r#"
class Foo {
  #foo = function() {
    return this;
  }

  test(other) {
    this.#foo();
    other.obj.#foo();
  }
}

"#,
    r#"
var _foo = new WeakMap();
var Foo = function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);

    _classPrivateFieldInit(this, _foo, {
      writable: true,
      value: function () {
        return this;
      }
    });
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _obj;

      _classPrivateFieldGet(this, _foo).call(this);
      _classPrivateFieldGet(_obj = other.obj, _foo).call(_obj);
    }
  }]);
  return Foo;
}();
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_derived_exec,
    r#"
class Foo {
  #prop = "foo";

  foo() {
    return this.#prop;
  }
}

class Bar extends Foo {
  #prop = "bar";

  bar() {
    return this.#prop;
  }
}

const f = new Foo;
expect(f.foo()).toBe("foo");

const b = new Bar;
expect(b.foo()).toBe("foo");
expect(b.bar()).toBe("bar");

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_extracted_this,
    r#"
var foo = "bar";

class Foo {
  #bar = this;
  #baz = foo;

  constructor(foo) {
  }
}

"#,
    r#"
var foo = "bar";

var _bar = new WeakMap(), _baz = new WeakMap();

var Foo = function Foo(foo1) {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _bar, {
    writable: true,
    value: this
  });

  _classPrivateFieldInit(this, _baz, {
    writable: true,
    value: foo
  });
};
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_canonical_exec,
    r#"
class Point {
    #x;
    #y;

    constructor(x = 0, y = 0) {
        this.#x = +x;
        this.#y = +y;
    }

    get x() { return this.#x }
    set x(value) { this.#x = +value }

    get y() { return this.#y }
    set y(value) { this.#y = +value }

    equals(p) { return this.#x === p.#x && this.#y === p.#y }

    toString() { return `Point<${ this.#x },${ this.#y }>` }

}

const p1 = new Point(1, 2);
const p2 = new Point(2, 3);
const p3 = new Point(1, 2);

expect(p1.x).toBe(1);
expect(p1.y).toBe(2);
expect(p2.x).toBe(2);
expect(p2.y).toBe(3);
expect(p3.x).toBe(1);
expect(p3.y).toBe(2);

expect(p1.equals(p1)).toBe(true)
expect(p1.equals(p2)).toBe(false)
expect(p1.equals(p3)).toBe(true)
expect(p2.equals(p1)).toBe(false)
expect(p2.equals(p2)).toBe(true)
expect(p2.equals(p3)).toBe(false)
expect(p3.equals(p1)).toBe(true)
expect(p3.equals(p2)).toBe(false)
expect(p3.equals(p3)).toBe(true)

expect(p1.toString()).toBe("Point<1,2>")
expect(p2.toString()).toBe("Point<2,3>")
expect(p3.toString()).toBe("Point<1,2>")

p1.x += 1;
p1.y = 3;
p2.x -= 1;
p2.y = 3;
p3.x = 0;
p3.y = 0;

expect(p1.x).toBe(2);
expect(p1.y).toBe(3);
expect(p2.x).toBe(1);
expect(p2.y).toBe(3);
expect(p3.x).toBe(0);
expect(p3.y).toBe(0);

expect(p1.equals(p1)).toBe(true)
expect(p1.equals(p2)).toBe(false)
expect(p1.equals(p3)).toBe(false)
expect(p2.equals(p1)).toBe(false)
expect(p2.equals(p2)).toBe(true)
expect(p2.equals(p3)).toBe(false)
expect(p3.equals(p1)).toBe(false)
expect(p3.equals(p2)).toBe(false)
expect(p3.equals(p3)).toBe(true)

expect(p1.toString()).toBe("Point<2,3>")
expect(p2.toString()).toBe("Point<1,3>")
expect(p3.toString()).toBe("Point<0,0>")

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_static_undefined_exec,
    r#"
class Foo {
  static #bar;

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

expect("bar" in Foo).toBe(false);
expect(Foo.test()).toBe(undefined);
expect(Foo.test()).toBe(undefined);

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    public_update_exec,
    r#"
class Foo {
  foo = 0;

  test(other) {
    return [
      this.foo++,
      this.foo,
      ++this.foo,
      this.foo,
      other.obj.foo++,
      other.obj.foo,
      ++other.obj.foo,
      other.obj.foo,
    ];
  }
}

const f = new Foo;
const results = f.test({ obj: f });
expect(results[0]).toBe(0);
expect(results[1]).toBe(1);
expect(results[2]).toBe(2);
expect(results[3]).toBe(2);
expect(results[4]).toBe(2);
expect(results[5]).toBe(3);
expect(results[6]).toBe(4);
expect(results[7]).toBe(4);

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_static_call,
    r#"
class Foo {
  static #foo = function(x) {
    return x;
  }

  test(x) {
    return Foo.#foo(x);
  }
}


"#,
    r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(x) {
      return _classStaticPrivateFieldSpecGet(Foo, Foo, _foo).call(Foo, x);
    }
  }]);
  return Foo;
}();

var _foo = {
  writable: true,
  value: function (x) {
    return x;
  }
};

"#
);

test!(
    syntax(),
    |t| tr(t),
    private_super_expression,
    r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    foo(super());
  }
}

"#,
    r#"
var _bar = new WeakMap();
var Foo =
/*#__PURE__*/
function (Bar) {
  "use strict";

  _inherits(Foo, Bar);
  var _super = _createSuper(Foo);
  function Foo() {
    _classCallCheck(this, Foo);
    var _this;

    var _temp;
    foo((_temp = _this = _super.call(this), _classPrivateFieldInit(_assertThisInitialized(_this), _bar, {
      writable: true,
      value: "foo"
    }), _temp));
    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_native_classes_exec,
    r#"
class Foo {
  static #foo = "foo";
  #bar = "bar";

  static test() {
    return Foo.#foo;
  }

  test() {
    return this.#bar;
  }
}

const f = new Foo();
expect("foo" in Foo).toBe(false)
expect("bar" in f).toBe(false)
expect(Foo.test()).toBe("foo")
expect(f.test()).toBe("bar")

"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    private_multiple_exec,
    r#"
class Foo {
  #x = 0;
  #y = this.#x + 1;

  test() {
    return this.#y;
  }
}

const f = new Foo();
expect(f.test()).toBe(1);

"#
);

test!(
    syntax(),
    |t| tr(t),
    custom_instance_update,
    "
class Foo {
    #x = 0;

    test() {
        this.#x++;
        ++this.#x;
    }
}
",
    r#"
var _x = new WeakMap();
var Foo = function () {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);

        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: 0
        });
    }

    _createClass(Foo, [
        {
            key: "test",
            value: function test() {
                _classPrivateFieldUpdate(this, _x).value++;
                ++_classPrivateFieldUpdate(this, _x).value;
            }
        }
    ]);

    return Foo;
}();
"#
);

test!(
    syntax(),
    |t| tr(t),
    custom_static_update,
    "
class Foo {
    static #x = 0;

    test() {
        Foo.#x++;
        ++Foo.#x;
    }
}
",
    r#"
var Foo = function () {
  "use strict";
  function Foo() {
      _classCallCheck(this, Foo);
  }

  _createClass(Foo, [
      {
          key: "test",
          value: function test() {
              _classStaticPrivateFieldUpdate(Foo, Foo, _x).value++;
              ++_classStaticPrivateFieldUpdate(Foo, Foo, _x).value;
          }
      }
  ]);

  return Foo;
}();
var _x = {
  writable: true,
  value: 0
};
"#
);

test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Some(t.comments.clone()), Default::default())
        )
    },
    issue_308,
    "function bar(props) {}
class Foo {
  constructor() {
    super();
    bar();
  }
  onBar = () => {
    bar();
  };
}",
    "function bar(props) {
}
class Foo{
    constructor(){
        super();
        _defineProperty(this, \"onBar\", ()=>{
            bar();
        });
        bar();
    }
}
"
);

test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Some(t.comments.clone()), Default::default()),
            classes(Some(t.comments.clone()), Default::default())
        )
    },
    issue_342,
    "class Foo {
  constructor(bar) {
    this._bar = bar;
  }

  qux = {
    frob: (bar) => {},
  };
}",
    "
let Foo = function Foo(bar) {
    \"use strict\";
    _classCallCheck(this, Foo);
    _defineProperty(this, \"qux\", {
        frob: (bar)=>{
        }
    });
    this._bar = bar;
};"
);

test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Some(t.comments.clone()), Default::default()),
            block_scoping()
        )
    },
    issue_443,
    "
const MODE = 1;

class foo {
  static MODE = MODE;

  constructor() {
    this.mode = MODE;
  }
}
",
    "var MODE = 1;
class foo{
    constructor(){
        this.mode = MODE;
    }
}
_defineProperty(foo, \"MODE\", MODE);"
);

// public_regression_t7364
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default())
    ),
    public_regression_t7364,
    r#"
class MyClass {
  myAsyncMethod = async () => {
    console.log(this);
  }
}

(class MyClass2 {
  myAsyncMethod = async () => {
    console.log(this);
  }
})

export default class MyClass3 {
  myAsyncMethod = async () => {
    console.log(this);
  }
}

"#,
    r#"
    class MyClass {
      constructor(){
          var _this = this;
          _defineProperty(this, "myAsyncMethod", _asyncToGenerator(function*() {
              console.log(_this);
          }));
      }
    }

    (class MyClass2 {
        constructor(){
            var _this = this;
            _defineProperty(this, "myAsyncMethod", _asyncToGenerator(function*() {
                console.log(_this);
            }));
        }
    })

    class MyClass3 {
        constructor(){
            var _this = this;
            _defineProperty(this, "myAsyncMethod", _asyncToGenerator(function*() {
                console.log(_this);
            }));
        }
    }
    export { MyClass3 as default };
"#
);

// private_regression_t6719
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_regression_t6719,
    r#"
function withContext(ComposedComponent) {
    return class WithContext extends Component {

        static #propTypes = {
            context: PropTypes.shape(
                {
                    addCss: PropTypes.func,
                    setTitle: PropTypes.func,
                    setMeta: PropTypes.func,
                }
            ),
        };
    };
}

"#,
    r#"
function withContext(ComposedComponent) {
    var _WithContext, _propTypes;
    return _WithContext = class WithContext extends Component{
        }, _propTypes = {
            writable: true,
            value: {
                context: PropTypes.shape({
                    addCss: PropTypes.func,
                    setTitle: PropTypes.func,
                    setMeta: PropTypes.func
                })
            }
        },
        _WithContext;
}


"#
);

// public_foobar
//test!(syntax(),|t| tr("{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env"]
//}
//"), public_foobar, r#"
//class Child extends Parent {
//    constructor() {
//        super();
//    }
//
//    scopedFunctionWithThis = () => {
//        this.name = {};
//    }
//}
//
//"#, r#"
//var Child =
// /*#__PURE__*/
//function (_Parent) {
//  "use strict";
//
//  _inherits(Child, _Parent);
//
//  function Child() {
//    var _this;
//
//    _classCallCheck(this, Child);
//    _this = _possibleConstructorReturn(this,
// _getPrototypeOf(Child).call(this));
//    _defineProperty(_assertThisInitialized(_this), "scopedFunctionWithThis",
// function () {      _this.name = {};
//    });
//    return _this;
//  }
//
//  return Child;
//}(Parent);
//
//"#);

// private_reevaluated
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_reevaluated,
    r#"
function classFactory() {
  return class Foo {
    #foo = "foo";
    static #bar = "bar";

    instance() {
      return this.#foo;
    }

    static() {
      return Foo.#bar;
    }

    static instance(inst) {
      return inst.#foo;
    }

    static static() {
      return Foo.#bar;
    }
  };
}

"#,
    r#"
function classFactory() {
    var _foo, _Foo, _bar;
    return _foo = new WeakMap(), _Foo = class Foo {
            instance() {
                return _classPrivateFieldGet(this, _foo);
            }
            static() {
                return _classStaticPrivateFieldSpecGet(Foo, _Foo, _bar);
            }
            static  instance(inst) {
                return _classPrivateFieldGet(inst, _foo);
            }
            static  static() {
                return _classStaticPrivateFieldSpecGet(Foo, _Foo, _bar);
            }
            constructor(){
                _classPrivateFieldInit(this, _foo, {
                    writable: true,
                    value: "foo"
                });
            }
        }, _bar = {
            writable: true,
            value: "bar"
        },
        _Foo;
}
"#
);

// private_static
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_static,
    r#"
class Foo {
  static #bar = "foo";

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

expect("bar" in Foo).toBe(false)
expect(Foo.test()).toBe("foo")
expect(Foo.test()).toBe("foo")

"#,
    r#"
class Foo {
  static test() {
    return _classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

  test() {
    return _classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

}

var _bar = {
  writable: true,
  value: "foo"
};
expect("bar" in Foo).toBe(false);
expect(Foo.test()).toBe("foo");
expect(Foo.test()).toBe("foo");

"#
);

// private_destructuring_object_pattern_1
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_destructuring_object_pattern_1,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 'foo';
    ({ x: this.x = this.#client, y: this.#client, z: this.z = this.#client } = props)
  }
}
"#,
    r#"
var _client = new WeakMap();
var Foo = function Foo(props) {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _client, {
    writable: true,
    value: void 0
  });

  _classPrivateFieldSet(this, _client, 'foo');
  ({
    x: this.x = _classPrivateFieldGet(this, _client),
    y: _classPrivateFieldDestructureSet(this, _client).value,
    z: this.z = _classPrivateFieldGet(this, _client)
  } = props);
};
"#
);

// private_static_inherited
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_static_inherited,
    r#"
class Base {
  static #foo = 1;

  static getThis() {
    return this.#foo;
  }

  static updateThis(val) {
    return (this.#foo = val);
  }

  static getClass() {
    return Base.#foo;
  }

  static updateClass(val) {
    return (Base.#foo = val);
  }
}

class Sub1 extends Base {
  static #foo = 2;

  static update(val) {
    return (this.#foo = val);
  }
}

class Sub2 extends Base {}

"#,
    r#"
class Base {
  static getThis() {
    return _classStaticPrivateFieldSpecGet(this, Base, _foo);
  }

  static updateThis(val) {
    return _classStaticPrivateFieldSpecSet(this, Base, _foo, val);
  }

  static getClass() {
    return _classStaticPrivateFieldSpecGet(Base, Base, _foo);
  }

  static updateClass(val) {
    return _classStaticPrivateFieldSpecSet(Base, Base, _foo, val);
  }

}

var _foo = {
  writable: true,
  value: 1
};

class Sub1 extends Base {
  static update(val) {
    return _classStaticPrivateFieldSpecSet(this, Sub1, _foo1, val);
  }

}

var _foo1 = {
  writable: true,
  value: 2
};

class Sub2 extends Base {}

"#
);

// private_destructuring_object_pattern_1_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_destructuring_object_pattern_1_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 'foo';
    ;({ x: this.x = this.#client, y: this.#client, z: this.z = this.#client } = props)
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo({ y: 'bar' });
expect(foo.getClient()).toBe('bar');
expect(foo.x).toBe('foo');
expect(foo.z).toBe('bar');

"#
);

// private_static_undefined
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_static_undefined,
    r#"
class Foo {
  static #bar;

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

"#,
    r#"
class Foo {
  static test() {
    return _classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

  test() {
    return _classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

}

var _bar = {
  writable: true,
  value: void 0
};

"#
);

// private_destructuring_array_pattern
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_destructuring_array_pattern,
    r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client] = props);
  }
}

"#,
    r#"
var _client = new WeakMap();
var Foo = function Foo(props) {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _client, {
    writable: true,
    value: void 0
  });

  [_classPrivateFieldDestructureSet(this, _client).value] = props;
};
"#
);

// private_regression_t2983
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_regression_t2983,
    r#"
call(class {
  static #test = true
});

export default class {
  static #test = true
}

"#,
    r#"
var _class, _test;
call((_class = class {
    }, _test = {
        writable: true,
        value: true
    }, _class
  ));
class _class1{
}
var _test1 = {
    writable: true,
    value: true
};
export { _class1 as default }


"#
);

// private_regression_t7364
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default()),
        block_scoping()
    ),
    private_regression_t7364,
    r#"
class MyClass {
  #myAsyncMethod = async () => {
    console.log(this);
  }
}

(class MyClass2 {
  #myAsyncMethod = async () => {
    console.log(this);
  }
})

export default class MyClass3 {
  #myAsyncMethod = async () => {
    console.log(this);
  }
}

"#,
    r#"
var _myAsyncMethod;
var _myAsyncMethod1 = new WeakMap();
class MyClass {
    constructor(){
        var _this = this;
        _classPrivateFieldInit(this, _myAsyncMethod1, {
            writable: true,
            value: _asyncToGenerator(function*() {
                console.log(_this);
            })
        });
    }
}
_myAsyncMethod = new WeakMap(),
class MyClass2 {
    constructor(){
        var _this = this;
        _classPrivateFieldInit(this, _myAsyncMethod, {
            writable: true,
            value: _asyncToGenerator(function*() {
                console.log(_this);
            })
        });
    }
};
var _myAsyncMethod2 = new WeakMap();
class MyClass3 {
    constructor(){
        var _this = this;
        _classPrivateFieldInit(this, _myAsyncMethod2, {
            writable: true,
            value: _asyncToGenerator(function*() {
                console.log(_this);
            })
        });
    }
}
export { MyClass3 as default };
"#
);

// private_destructuring_array_pattern_1
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_destructuring_array_pattern_1,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 1;
    ([this.x = this.#client, this.#client, this.y = this.#client] = props);
  }
}
"#,
    r#"
var _client = new WeakMap();
var Foo = function Foo(props) {
    "use strict";

    _classCallCheck(this, Foo);

    _classPrivateFieldInit(this, _client, {
        writable: true,
        value: void 0
    });

    _classPrivateFieldSet(this, _client, 1);
    [this.x = _classPrivateFieldGet(this, _client), _classPrivateFieldDestructureSet(this, _client).value, this.y = _classPrivateFieldGet(this, _client)] = props;
};
"#
);

// regression_8882_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    regression_8882_exec,
    r#"
const classes = [];
for (let i = 0; i <= 10; ++i) {
  classes.push(
    class A {
      [i] = `computed field ${i}`;
      static foo = `static field ${i}`;
      #bar = `private field ${i}`;
      getBar() {
        return this.#bar;
      }
    }
  );
}

for(let i=0; i<= 10; ++i) {
  const clazz = classes[i];
  expect(clazz.foo).toBe('static field ' + i);

  const instance = new clazz();
  expect(Object.getOwnPropertyNames(instance)).toEqual([String(i)])
  expect(instance[i]).toBe('computed field ' + i);
  expect(instance.getBar()).toBe('private field ' + i);
}
"#
);

test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    regression_8882_exec_2,
    r#"
const classes = [];
for (let i = 0; i <= 10; ++i) {
  class A {
    [i] = `computed field ${i}`;
    static foo = `static field ${i}`;
    #bar = `private field ${i}`;
    getBar() {
      return this.#bar;
    }
  }

  classes.push(A)
}

for(let i=0; i<= 10; ++i) {
  const clazz = classes[i];
  expect(clazz.foo).toBe('static field ' + i);

  const instance = new clazz();
  expect(Object.getOwnPropertyNames(instance)).toEqual([String(i)])
  expect(instance[i]).toBe('computed field ' + i);
  expect(instance.getBar()).toBe('private field ' + i);
}
"#
);

test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_field_reinitialized,
    r#"
class Base {
  constructor(obj) {
    return obj;
  }
}

class Derived extends Base {
  #c = 123
}

const foo = {}
new Derived(foo)
expect(() => new Derived(foo)).toThrow()
"#
);

//// regression_6154
//test!(syntax(),|t| tr("{
//  "presets": ["env"],
//  "plugins": class_properties(Some(t.comments.clone()),Default::default())
//}
//"), regression_6154, r#"
//class Test {
//  constructor() {
//    class Other extends Test {
//      a = () => super.test;
//      static a = () => super.test;
//    }
//  }
//}
//
//"#, r#"
//function _typeof(obj) { if (typeof Symbol === "function" && typeof
// Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return
// typeof obj; }; } else { _typeof = function _typeof(obj) { return obj &&
// typeof Symbol === "function" && obj.constructor === Symbol && obj !==
// Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
//
//function _possibleConstructorReturn(self, call) { if (call && (_typeof(call)
// === "object" || typeof call === "function")) { return call; } return
// _assertThisInitialized(self); }
//
//function _assertThisInitialized(self) { if (self === void 0) { throw new
// ReferenceError("this hasn't been initialised - super() hasn't been called");
// } return self; }
//
//function _inherits(subClass, superClass) { if (typeof superClass !==
// "function" && superClass !== null) { throw new TypeError("Super expression
// must either be null or a function"); } subClass.prototype =
// Object.create(superClass && superClass.prototype, { constructor: { value:
// subClass, writable: true, configurable: true } }); if (superClass)
// _setPrototypeOf(subClass, superClass); }
//
//function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ||
// function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return
// _setPrototypeOf(o, p); }
//
//function _get(target, property, receiver) { if (typeof Reflect !==
// "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function
// _get(target, property, receiver) { var base = _superPropBase(target,
// property); if (!base) return; var desc =
// Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return
// desc.get.call(receiver); } return desc.value; }; } return _get(target,
// property, receiver || target); }
//
//function _superPropBase(object, property) { while
// (!Object.prototype.hasOwnProperty.call(object, property)) { object =
// _getPrototypeOf(object); if (object === null) break; } return object; }
//
//function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ?
// Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ ||
// Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
//
//function _defineProperty(obj, key, value) { if (key in obj) {
// Object.defineProperty(obj, key, { value: value, enumerable: true,
// configurable: true, writable: true }); } else { obj[key] = value; } return
// obj; }
//
//function _classCallCheck(instance, Constructor) { if (!(instance instanceof
// Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
//var Test = function Test() {
//  "use strict";
//
//  _classCallCheck(this, Test);
//
//  var Other =
//  /*#__PURE__*/
//  function (_Test) {
//    _inherits(Other, _Test);
//
//    function Other() {
//      var _getPrototypeOf2;
//
//      var _this;
//
//      _classCallCheck(this, Other);
//
//      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key
// < _len; _key++) {        args[_key] = arguments[_key];
//      }
//
//      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 =
// _getPrototypeOf(Other)).call.apply(_getPrototypeOf2, [this].concat(args)));
//
//      _defineProperty(_assertThisInitialized(_this), "a", function () {
//        return _get(_getPrototypeOf(Other.prototype), "test",
// _assertThisInitialized(_this));      });
//
//      return _this;
//    }
//
//    return Other;
//  }(Test);
//
//  _defineProperty(Other, "a", function () {
//    return _get(_getPrototypeOf(Other), "test", Other);
//  });
//};
//
//"#);

// private_static_export
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_static_export,
    r#"
export class MyClass {
  static #property = value;
}

export default class MyClass2 {
  static #property = value;
}

"#,
    r#"
export class MyClass {}
var _property = {
  writable: true,
  value: value
};
class MyClass2{
}
var _property1 = {
  writable: true,
  value: value
};
export { MyClass2 as default }
"#
);

// static_property_tdz_edgest_case
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default())
    ),
    static_property_tdz_edgest_case,
    r#"
class A {
  static [{ x: A || 0 }.x];
}

"#,
    r#"
let _x = {
  x: (_classNameTDZError("A"), A) || 0
}.x;

let A = function A() {
  "use strict";

  _classCallCheck(this, A);
};

_defineProperty(A, _x, void 0);

"#
);

test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default())
    ),
    static_property_tdz_false_alarm,
    r#"
class A {
static A = 123;
}
"#,
    r#"
let A = function A() {
  "use strict";
  _classCallCheck(this, A);
};
_defineProperty(A, "A", 123)
"#
);

// regression_6153
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        arrow()
    ),
    regression_6153,
    r#"
() => {
  class Foo {
    fn = () => console.log(this);
    static fn = () => console.log(this);
  }
};

() => class Bar {
  fn = () => console.log(this);
  static fn = () => console.log(this);
};

() => {
  class Baz {
    fn = () => console.log(this);
    force = force
    static fn = () => console.log(this);

    constructor(force) {}
  }
};

var qux = function() {
  class Qux {
    fn = () => console.log(this);
    static fn = () => console.log(this);
  }
}.bind(this)

"#,
    r#"
(function () {
  class Foo {
    constructor() {
      var _this = this;
      _defineProperty(this, "fn", function() {
        return console.log(_this);
      });
    }

  }

  _defineProperty(Foo, "fn", function () {
    return console.log(Foo);
  });
});

(function () {
  class Bar {
    constructor() {
      var _this = this;
      _defineProperty(this, "fn", function() {
        return console.log(_this);
      });
    }

  }
  _defineProperty(Bar, "fn", function () {
    return console.log(Bar);
  });
  return Bar;
});

(function () {
  class Baz {
    constructor(force){
      var _this = this;
      _defineProperty(this, "fn", function() {
        return console.log(_this);
      });
      _defineProperty(this, "force", force);
    }

  }

  _defineProperty(Baz, "fn", function () {
    return console.log(Baz);
  });
});

var qux = (function () {
  class Qux {
    constructor() {
      var _this = this;
      _defineProperty(this, "fn", function() {
        return console.log(_this);
      });
    }

  }

  _defineProperty(Qux, "fn", function () {
    return console.log(Qux);
  });
}).bind(this);

"#
);

// regression_7371
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        arrow()
    ),
    regression_7371,
    r#"
"use strict";
class C {
}

class A extends C {
  field = 1;

  constructor() {
    super();

    class B extends C {
      constructor() {
        super();

        expect(this.field).toBeUndefined();
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new A();

class Obj {
  constructor() {
    return {};
  }
}

// ensure superClass is still transformed
class SuperClass extends Obj {
  field = 1;

  constructor() {
    class B extends (super(), Obj) {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new SuperClass();

// ensure ComputedKey Method is still transformed
class ComputedMethod extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()]() { }
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedMethod();


// ensure ComputedKey Field is still transformed
class ComputedField extends Obj {
  field = 1;

  constructor() {
    class B extends Obj {
      constructor() {
        super();

        expect(this.field).toBeUndefined()
      }

      [super()] = 1;
    }

    expect(this.field).toBe(1)

    new B();
  }
}

new ComputedField();

"#,
    r#"
"use strict";

class C {}

class A extends C {
  constructor() {
    super();
    _defineProperty(this, "field", 1);

    class B extends C {
      constructor() {
        super();
        expect(this.field).toBeUndefined();
      }

    }

    expect(this.field).toBe(1);
    new B();
  }

}

new A();

class Obj {
  constructor() {
    return {};
  }

} // ensure superClass is still transformed


class SuperClass extends Obj {
  constructor() {
    var _temp;

    class B extends (_temp = super(), _defineProperty(this, "field", 1), _temp, Obj) {
      constructor() {
        super();
        expect(this.field).toBeUndefined();
      }

    }

    expect(this.field).toBe(1);
    new B();
  }

}

new SuperClass(); // ensure ComputedKey Method is still transformed

class ComputedMethod extends Obj {
  constructor() {
    var _temp;
    let tmp = (_temp = super(), _defineProperty(this, "field", 1), _temp);
    class B extends Obj {
      [tmp]() {}

      constructor() {
        super();
        expect(this.field).toBeUndefined();
      }


    }

    expect(this.field).toBe(1);
    new B();
  }

}

new ComputedMethod(); // ensure ComputedKey Field is still transformed

class ComputedField extends Obj {
  constructor() {
    var _temp;

    let _ref = (_temp = super(), _defineProperty(this, "field", 1), _temp);

    class B extends Obj {
      constructor() {
        super();
        _defineProperty(this, _ref, 1);
        expect(this.field).toBeUndefined();
      }

    }

    expect(this.field).toBe(1);
    new B();
  }

}

new ComputedField();

"#
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_optional_chain_call,
    r#"
class A {
    #fieldFunc;
    x = 1;
    test() {
        this.#fieldFunc?.();
    }
}
"#,
    r#"
var _fieldFunc = new WeakMap();
class A {
    test() {
        _classPrivateFieldGet(this, _fieldFunc)?.call(this);
    }
    constructor(){
        _classPrivateFieldInit(this, _fieldFunc, {
            writable: true,
            value: void 0
        });
        _defineProperty(this, "x", 1);
    }
}
"#
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_optional_chain_member,
    r#"
class MyClass {
  #a
  foo(o) {
    o?.#a
  }
}
"#,
    r#"
var _a = new WeakMap();
class MyClass {
    foo(o) {
        o === null || o === void 0 ? void 0 : _classPrivateFieldGet(o, _a);
    }
    constructor(){
        _classPrivateFieldInit(this, _a, {
            writable: true,
            value: void 0
        });
    }
}
"#
);

// private_canonical
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_canonical,
    r#"
class Point {
    #x;
    #y;

    constructor(x = 0, y = 0) {
        this.#x = +x;
        this.#y = +y;
    }

    get x() { return this.#x }
    set x(value) { this.#x = +value }

    get y() { return this.#y }
    set y(value) { this.#y = +value }

    equals(p) { return this.#x === p.#x && this.#y === p.#y }

    toString() { return `Point<${ this.#x },${ this.#y }>` }

}

"#,
    r#"
var _x = new WeakMap(), _y = new WeakMap();
var Point =
/*#__PURE__*/
function () {
  "use strict";

  function Point(x = 0, y = 0) {
    _classCallCheck(this, Point);

    _classPrivateFieldInit(this, _x, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInit(this, _y, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _x, +x);
    _classPrivateFieldSet(this, _y, +y);
  }

  _createClass(Point, [{
    key: "x",
    get: function () {
      return _classPrivateFieldGet(this, _x);
    },
    set: function (value) {
      _classPrivateFieldSet(this, _x, +value);
    }
  }, {
    key: "y",
    get: function () {
      return _classPrivateFieldGet(this, _y);
    },
    set: function (value) {
      _classPrivateFieldSet(this, _y, +value);
    }
  }, {
    key: "equals",
    value: function equals(p) {
      return _classPrivateFieldGet(this, _x) === _classPrivateFieldGet(p, _x) && _classPrivateFieldGet(this, _y) === _classPrivateFieldGet(p, _y);
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Point<${_classPrivateFieldGet(this, _x)},${_classPrivateFieldGet(this, _y)}>`;
    }
  }]);
  return Point;
}();
"#
);

// regression_8882
test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    regression_8882,
    r#"
const classes = [];
for(let i = 0; i <= 10; ++i){
    classes.push(function() {
        class A{
             getBar() {
                return _classPrivateFieldGet(this, _bar);
            }
            constructor(){
                _defineProperty(this, i, `computed field ${i}`);
                _bar.set(this, {
                    writable: true,
                    value: `private field ${i}`
                });
            }
        }
        _defineProperty(A, 'foo', `static field ${i}`);
        var _bar = new WeakMap();
        return A;
    }());
}

"#,
    r#"
const classes = [];
for(let i = 0; i <= 10; ++i){
    classes.push(function() {
        class A{
             getBar() {
                return _classPrivateFieldGet(this, _bar);
            }
            constructor(){
                _defineProperty(this, i, `computed field ${i}`);
                _bar.set(this, {
                    writable: true,
                    value: `private field ${i}`
                });
            }
        }
        _defineProperty(A, 'foo', `static field ${i}`);
        var _bar = new WeakMap();
        return A;
    }());
}
"#
);

// private_destructuring_array_pattern_3
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_destructuring_array_pattern_3,
    r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client = 5] = props);
  }
}
"#,
    r#"
var _client = new WeakMap();
var Foo = function Foo(props) {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _client, {
    writable: true,
    value: void 0
  });

  [_classPrivateFieldDestructureSet(this, _client).value = 5] = props;
};
"#
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    staic_private_destructuring_array_pattern,
    r#"
class A {
  #a = 123
  foo() {
    [a().#a] = []
  }
}
"#,
    r#"
var _a = /*#__PURE__*/ new WeakMap();
class A {
  foo() {
    [_classPrivateFieldDestructureSet(a(), _a).value] = [];
  }

  constructor() {
    _classPrivateFieldInit(this, _a, {
      writable: true,
      value: 123
    });
  }
}
"#
);

// public_static_super_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    public_static_super_exec,
    r#"
class A {
  static prop = 1;
}

class B extends A {
  static prop = 2;
  static propA = super.prop;
  static getPropA = () => super.prop;
}

const { prop, propA, getPropA } = B;

expect(prop).toBe(2);
expect(propA).toBe(1);
expect(getPropA()).toBe(1);

"#
);

// private_destructuring_array_pattern_2
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_destructuring_array_pattern_2,
    r#"
class Foo {
  #client

  constructor(props) {
    ([x, ...this.#client] = props);
  }
}
"#,
    r#"
var _client = new WeakMap();
var Foo = function Foo(props) {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _client, {
    writable: true,
    value: void 0
  });

  [x, ..._classPrivateFieldDestructureSet(this, _client).value] = props;
};
"#
);

// private_non_block_arrow_func
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_non_block_arrow_func,
    r#"
export default param =>
  class App {
    static #props = {
      prop1: 'prop1',
      prop2: 'prop2'
    }

    getParam() {
      return param;
    }
  }

"#,
    r#"
export default ((param)=>{
    class App{
         getParam() {
            return param;
        }
    }
    var _props = {
        writable: true,
        value: {
            prop1: 'prop1',
            prop2: 'prop2'
        }
    };
    return App;
});


"#
);

// regression_8110
test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    regression_8110,
    r#"
const field = Symbol('field');

class A {
  [field] = 10;
}

"#,
    r#"
const field = Symbol('field');
let _field = field;
class A{
    constructor(){
        _defineProperty(this, _field, 10);
    }
}
"#
);

// public_computed_without_block_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    public_computed_without_block_exec,
    r#"
const createClass = (k) => class { [k()] = 2 };

const clazz = createClass(() => 'foo');
const instance = new clazz();
expect(instance.foo).toBe(2);
"#
);

// private_instance
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        exponentiation(),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping(),
    ),
    private_instance,
    r#"
class Foo {
  #bar = "foo";
}

"#,
    r#"
var _bar = new WeakMap();
var Foo = function Foo() {
  "use strict";

  _classCallCheck(this, Foo);

  _classPrivateFieldInit(this, _bar, {
    writable: true,
    value: "foo"
  });
};
"#
);

// static_property_tdz_general
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default())
    ),
    static_property_tdz_general,
    r#"
class C {
  static [C + 3] = 3;
}

"#,
    r#"
let _ref = (_classNameTDZError("C"), C) + 3;

let C = function C() {
  "use strict";

  _classCallCheck(this, C);
};

_defineProperty(C, _ref, 3);

"#
);

// public_native_classes
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    public_native_classes,
    r#"
class Foo {
  static foo = "foo";
  bar = "bar";
}

"#,
    r#"
class Foo {
  constructor() {
    _defineProperty(this, "bar", "bar");
  }

}

_defineProperty(Foo, "foo", "foo");

"#
);

// public_arrow_static_this_without_transform
test!(
    // Emitting class properties is not supported yet.
    syntax(),
    |_| arrow(),
    public_arrow_static_this_without_transform,
    r#"
class Foo {
  static fn = () => console.log(this);
}

"#,
    r#"
var _this = this;

class Foo {
  static fn = function () {
    return console.log(_this);
  };
}

"#
);

// private_static_infer_name
test!(
    // Seems useless, while being hard to implement.
    ignore,
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_static_infer_name,
    r#"
var Foo = class {
  static #num = 0;
}

"#,
    r#"
var _class, _temp, _num;

var Foo = (_temp = _class = class Foo {}, _num = {
  writable: true,
  value: 0
}, _temp);

"#
);

// regression_7951
test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(Some(t.comments.clone()), Default::default())
        )
    },
    regression_7951,
    r#"
export class Foo extends Bar {
  static foo = {};

  test = args;
}

"#,
    r#"
export class Foo extends Bar {
  constructor(...args1) {
    super(...args1);
    _defineProperty(this, "test", args);
  }

}
_defineProperty(Foo, "foo", {});

"#
);

// private_native_classes
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    private_native_classes,
    r#"
class Foo {
  static #foo = "foo";
  #bar = "bar";

  static test() {
    return Foo.#foo;
  }

  test() {
    return this.#bar;
  }
}

"#,
    r#"
var _bar = new WeakMap();
class Foo {

  static test() {
    return _classStaticPrivateFieldSpecGet(Foo, Foo, _foo);
  }

  test() {
    return _classPrivateFieldGet(this, _bar);
  }

  constructor() {
    _classPrivateFieldInit(this, _bar, {
      writable: true,
      value: "bar"
    });
  }
}

var _foo = {
  writable: true,
  value: "foo"
};
"#
);

// public_computed_without_block
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    public_computed_without_block,
    r#"
const createClass = (k) => class { [k()] = 2 };

"#,
    r#"
var createClass = (k)=>{
    var _ref = k();
    var _class = function _class() {
        "use strict";
        _classCallCheck(this, _class);
        _defineProperty(this, _ref, 2);
    };
    return _class;
};

"#
);

// private_destructuring_array_pattern_2_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_destructuring_array_pattern_2_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    let x;
    ;([x, ...this.#client] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo(['foo', 'bar', 'baz', 'quu']);
expect(foo.getClient()).toEqual(['bar', 'baz', 'quu']);

"#
);

// public_static_super
test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    public_static_super,
    r#"
class A {
  static prop = 1;
}

class B extends A {
  static prop = 2;
  static propA = super.prop;
  static getPropA = () => super.prop;
}

"#,
    r#"
var A = function A() {
  "use strict";

  _classCallCheck(this, A);
};

_defineProperty(A, "prop", 1);

var B =
/*#__PURE__*/
function (A) {
  "use strict";

  _inherits(B, A);
  var _super = _createSuper(B);
  function B() {
    _classCallCheck(this, B);
    return _super.apply(this, arguments);
  }

  return B;
}(A);

_defineProperty(B, "prop", 2);
_defineProperty(B, "propA", _get(_getPrototypeOf(B), "prop", B));
_defineProperty(B, "getPropA", () => _get(_getPrototypeOf(B), "prop", B));

"#
);

// private_destructuring_array_pattern_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_destructuring_array_pattern_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    ;([this.#client] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo(['bar']);
expect(foo.getClient()).toBe('bar');

"#
);

// private_destructuring_array_pattern_1_exec
test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    private_destructuring_array_pattern_1_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 1;
    ;([this.x = this.#client, this.#client, this.y = this.#client] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo([undefined, 'bar']);
expect(foo.getClient()).toBe('bar');
expect(foo.x).toBe(1);
expect(foo.y).toBe('bar');

"#
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1306_1,
    r#"
  class Animal {
    #name;

    constructor(name) {
      this.#name = name
    }

    noise() {
      return this.#name
    }
  }
"#,
    "
    var _name = new WeakMap();
    class Animal {
      noise() {
          return _classPrivateFieldGet(this, _name);
      }
      constructor(name){
          _classPrivateFieldInit(this, _name, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldSet(this, _name, name);
      }
    }
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1306_2,
    r#"
class Animal {
  #name;

  constructor(name) {
    this.#name = name
  }

  noise() {
    return this.#name.toUpperCase()
  }
}
"#,
    "
  var _name = new WeakMap();
  class Animal {
    noise() {
        return _classPrivateFieldGet(this, _name).toUpperCase();
    }
    constructor(name){
        _classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _name, name);
    }
}
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1333_1,
    "
  class Foo {
    #ws;
    #ws2;
    get connected() {
        return this.#ws2 && this.#ws.readyState === _ws1.default.OPEN;
    }
  }
  ",
    "
    var _ws = new WeakMap(), _ws2 = new WeakMap();
    class Foo {
      get connected() {
          return _classPrivateFieldGet(this, _ws2) && _classPrivateFieldGet(this, _ws).readyState \
     === _ws1.default.OPEN;
      }
      constructor(){
        _classPrivateFieldInit(this, _ws, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _ws2, {
            writable: true,
            value: void 0
        });
      }
    }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1333_2,
    "
  class Test {
    #ws;
    #serialization;
    #seq;

    _packet(raw) {
        /** @type {DiscordPacket} */
        let pak;
        try {
            pak = this.#serialization.decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }

        switch (pak.t) {
            case 'READY':
                this.emit(ShardEvent.READY);

                this.session.id = pak.d.session_id;
                this.expectedGuilds = new Set(pak.d.guilds.map((g) => g.id));
                this.status = Status.WAITING_FOR_GUILDS;

                this.heartbeat.acked = true;
                this.heartbeat.new('ready');
                break;
            case 'RESUMED':
                /**
                * Emitted when a shards connection has been resumed.
                * @event Shard#resumed
                */
                this.emit(ShardEvent.RESUMED);

                this.status = Status.READY;
                this.heartbeat.acked = true;
                this.heartbeat.new('resumed');
                break;
        }

        if (pak.s !== null) {
            if (this.#seq !== -1 && pak.s > this.#seq + 1) {
                this._debug(`Non-consecutive sequence [${this.#seq} => ${pak.s}]`);
            }

            this.#seq = pak.s;
        }

        switch (pak.op) {
            case GatewayOp.HELLO:
                this.heartbeat.delay = pak.d.heartbeat_interval;
                this.session.hello();
                break;
            case GatewayOp.RECONNECT:
                this._debug('Gateway asked us to reconnect.');
                this.destroy({ code: 4000 });
                break;
            case GatewayOp.INVALID_SESSION:
                this._debug(`Invalid Session: Resumable => ${pak.d}`);
                if (pak.d) {
                    this.session.resume();
                    break;
                }

                this.#seq = -1;
                this.session.reset();
                this.status = Status.RECONNECTING;

                this.emit(ShardEvent.INVALID_SESSION);
                break;
            case GatewayOp.HEARTBEAT:
                this.heartbeat.new('requested');
                break;
            case GatewayOp.HEARTBEAT_ACK:
                this.heartbeat.ack();
                break;
            default:
                if (
                    this.status === Status.WAITING_FOR_GUILDS &&
                    pak.t === 'GUILD_CREATE'
                ) {
                    this.expectedGuilds.delete(pak.d.id);
                    this._checkReady();
                }
        }
    }
  }
  ",
    "
    var _ws = new WeakMap(), _serialization = new WeakMap(), _seq = new WeakMap();
    class Test {
      _packet(raw) {
          let pak;
          try {
              pak = _classPrivateFieldGet(this, _serialization).decode(raw);
              this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
          } catch (e) {
              this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
              return;
          }
          switch(pak.t){
              case 'READY':
                  this.emit(ShardEvent.READY);
                  this.session.id = pak.d.session_id;
                  this.expectedGuilds = new Set(pak.d.guilds.map((g)=>g.id
                  ));
                  this.status = Status.WAITING_FOR_GUILDS;
                  this.heartbeat.acked = true;
                  this.heartbeat.new('ready');
                  break;
              case 'RESUMED':
                  this.emit(ShardEvent.RESUMED);
                  this.status = Status.READY;
                  this.heartbeat.acked = true;
                  this.heartbeat.new('resumed');
                  break;
          }
          if (pak.s !== null) {
              if (_classPrivateFieldGet(this, _seq) !== -1 && pak.s > _classPrivateFieldGet(this, \
     _seq) + 1) {
                  this._debug(`Non-consecutive sequence [${_classPrivateFieldGet(this, _seq)} => \
     ${pak.s}]`);
              }
              _classPrivateFieldSet(this, _seq, pak.s);
          }
          switch(pak.op){
              case GatewayOp.HELLO:
                  this.heartbeat.delay = pak.d.heartbeat_interval;
                  this.session.hello();
                  break;
              case GatewayOp.RECONNECT:
                  this._debug('Gateway asked us to reconnect.');
                  this.destroy({
                      code: 4000
                  });
                  break;
              case GatewayOp.INVALID_SESSION:
                  this._debug(`Invalid Session: Resumable => ${pak.d}`);
                  if (pak.d) {
                      this.session.resume();
                      break;
                  }
                  _classPrivateFieldSet(this, _seq, -1);
                  this.session.reset();
                  this.status = Status.RECONNECTING;
                  this.emit(ShardEvent.INVALID_SESSION);
                  break;
              case GatewayOp.HEARTBEAT:
                  this.heartbeat.new('requested');
                  break;
              case GatewayOp.HEARTBEAT_ACK:
                  this.heartbeat.ack();
                  break;
              default:
                  if (this.status === Status.WAITING_FOR_GUILDS && pak.t === 'GUILD_CREATE') {
                      this.expectedGuilds.delete(pak.d.id);
                      this._checkReady();
                  }
          }
      }
      constructor(){
          _classPrivateFieldInit(this, _ws, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInit(this, _serialization, {
            writable: true,
            value: void 0
          });
          _classPrivateFieldInit(this, _seq, {
            writable: true,
            value: void 0
          });
      }
  }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1333_3,
    "
    class Test {
      #ws;
      #serialization;

      _packet(raw) {
        /** @type {DiscordPacket} */
        let pak;
        try {
            pak = this.#serialization.decode(raw);
            this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
        } catch (e) {
            this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
            return;
        }

        switch (pak.t) {
            case 'READY':
            case 'RESUMED':
        }
      }
    }
    ",
    "
    var _ws = new WeakMap(), _serialization = new WeakMap();
    class Test {
      _packet(raw) {
          let pak;
          try {
              pak = _classPrivateFieldGet(this, _serialization).decode(raw);
              this.manager.emit(ClientEvent.RAW_PACKET, pak, this);
          } catch (e) {
              this.manager.client.emit(ClientEvent.SHARD_ERROR, e, this);
              return;
          }
          switch(pak.t){
              case 'READY':
              case 'RESUMED':
          }
      }
      constructor(){
          _classPrivateFieldInit(this, _ws, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInit(this, _serialization, {
            writable: true,
            value: void 0
          });
      }
  }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1333_4,
    "
  class Test {
    #ws;
    #serialization;

    _packet(raw) {
      /** @type {DiscordPacket} */
      let pak;
      try {
          pak = this.#serialization.decode(raw);
      } catch (e) {
          return;
      }
    }
  }
  ",
    "
    var _ws = new WeakMap(), _serialization = new WeakMap();
    class Test {
      _packet(raw) {
          let pak;
          try {
              pak = _classPrivateFieldGet(this, _serialization).decode(raw);
          } catch (e) {
              return;
          }
      }
      constructor(){
          _classPrivateFieldInit(this, _ws, {
              writable: true,
              value: void 0
          });
          _classPrivateFieldInit(this, _serialization, {
            writable: true,
            value: void 0
          });
      }
    }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1333_5,
    "
    class Test {
      #serialization;
      _packet(raw) {
        pak = this.#serialization.decode(raw);
      }
    }
    ",
    "
    var _serialization = new WeakMap();
    class Test {
      _packet(raw) {
          pak = _classPrivateFieldGet(this, _serialization).decode(raw);
      }
      constructor(){
        _classPrivateFieldInit(this, _serialization, {
          writable: true,
          value: void 0
        });
      }
    }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1333_6,
    "
    class Test {
      #serialization;
      _packet(raw) {
        this.#serialization.decode(raw);
      }
    }
    ",
    "
    var _serialization = new WeakMap();
    class Test {
      _packet(raw) {
          _classPrivateFieldGet(this, _serialization).decode(raw);
      }
      constructor(){
        _classPrivateFieldInit(this, _serialization, {
          writable: true,
          value: void 0
        });
      }
    }
    "
);

test!(
    syntax(),
    |t| { class_properties(Some(t.comments.clone()), Default::default()) },
    issue_1660_1,
    "
    console.log(class { run() { } });
    ",
    "
    console.log(class {
        run() {
        }
    });
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_3055_1,
    "
export class Node {
    foo() {
        this.#bar(this);
    }

    #bar(parent) {
        parent.#baz(this);
        parent.baz.#baz(this);
    }

    #baz(child) { }
}
",
    "
var _bar = new WeakSet(),
    _baz = new WeakSet();
export class Node {
    foo() {
        _classPrivateMethodGet(this, _bar, bar).call(this, this);
    }
    constructor() {
        _classPrivateMethodInit(this, _bar);
        _classPrivateMethodInit(this, _baz);
    }
}
function bar(parent) {
    var _baz1;
    _classPrivateMethodGet(parent, _baz, baz).call(parent, this);
    _classPrivateMethodGet(_baz1 = parent.baz, _baz, baz).call(_baz1, this);
}
function baz(child) {}
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_3618,
    "
class MyClass {
  get #a() {}
  set #a(x) {}
  static get #b() {}
  static set #b(x) {}
}
",
    "
var _a = /*#__PURE__*/ new WeakMap();

class MyClass {
  constructor() {
    _classPrivateFieldInit(this, _a, {
      get: get_a,
      set: set_a
    });
  }
}

var _b = {
  get: get_b,
  set: set_b
};
function get_a() {}
function set_a(x) {}
function get_b() {}
function set_b(x) {}
"
);

test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default())
    ),
    issue_1694_1,
    "
    class MyClass {
        #get() {
            return 1
        }
        constructor() {
            this.#get(foo);
        }
    }
    ",
    "
    var _get = new WeakSet();
    class MyClass {
        constructor(){
            _classPrivateMethodInit(this, _get);
            _classPrivateMethodGet(this, _get, get).call(this, foo);
        }
    }
    function get() {
        return 1;
    }
    "
);

test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default())
    ),
    issue_1694_2,
    "
class MyClass {
    static #get() {
        return 1
    }
    constructor() {
        MyClass.#get(foo);
    }
}
",
    "
  class MyClass {
      constructor(){
          _classStaticPrivateMethodGet(MyClass, MyClass, get).call(MyClass, foo);
      }
  }
  function get() {
      return 1;
  }
  "
);

test!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default())
    ),
    issue_1702_1,
    "
    class Foo {
      #y;
      static #z = 3;

      constructor() {
        this.x = 1;
        this.#y = 2;
        this.#sssss();
      }

      #sssss() {
        console.log(this.x, this.#y, Foo.#z);
      }
    }

    const instance = new Foo();
    ",
    "
    var _y = new WeakMap(), _sssss = new WeakSet();
    class Foo {
        constructor(){
            _classPrivateMethodInit(this, _sssss);
            _classPrivateFieldInit(this, _y, {
                writable: true,
                value: void 0
            });
            this.x = 1;
            _classPrivateFieldSet(this, _y, 2);
            _classPrivateMethodGet(this, _sssss, sssss).call(this);
        }
    }
    var _z = {
        writable: true,
        value: 3
    };
    function sssss() {
        console.log(this.x, _classPrivateFieldGet(this, _y), _classStaticPrivateFieldSpecGet(Foo, \
     Foo, _z));
    }
    const instance = new Foo();
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1711_1,
    "
    class Foo {
      #value() {
        return 1;
      }
      // #value = 1;

      get(target) {
        return target.#value;
      }
    }
    ",
    "
    var _value = new WeakSet();
    class Foo {
        get(target) {
            return _classPrivateMethodGet(target, _value, value);
        }
        constructor(){
            _classPrivateMethodInit(this, _value);
        }
    }
    function value() {
        return 1;
    }
    "
);

test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1742_1,
    "
    class Foo {
      #tag() {
        return this;
      }

      #tag2 = this.#tag;

      constructor() {
        const receiver = this.#tag`tagged template`;
        expect(receiver).toBe(this);

        const receiver2 = this.#tag2`tagged template`;
        expect(receiver2).toBe(this);
      }
    }
    new Foo();
    "
);

test_exec!(
    syntax(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        template_literal(Default::default())
    ),
    issue_1742_2,
    "
  class Foo {
    #tag() {
      return this;
    }

    #tag2 = this.#tag;

    constructor() {
      const receiver = this.#tag`tagged template`;
      expect(receiver).toBe(this);

      const receiver2 = this.#tag2`tagged template`;
      expect(receiver2).toBe(this);
    }
  }
  new Foo();
  "
);

test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    new_target_in_class_prop,
    "
class Foo {
    bar = new.target;
    ['baz'] = new.target;
}

const foo = new Foo();

expect(foo.bar).toBe(undefined);
expect(foo.baz).toBe(undefined);
"
);

test_exec!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    class_field_evalutaion_order,
    "
class Foo {
  a = this.#b;
  get #b() {
    return 1
  }
  static #c = this.#d();
  static #d() {}
}
expect(() => new Foo()).not.toThrow();
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1742_3,
    "
    class Foo {
      #tag() {
        return this;
      }

      #tag2 = this.#tag;

      constructor() {
        const receiver = this.#tag`tagged template`;
        expect(receiver).toBe(this);

        const receiver2 = this.#tag2`tagged template`;
        expect(receiver2).toBe(this);
      }
    }
    new Foo();
    ",
    "
    var _tag = new WeakSet(), _tag2 = new WeakMap();
    class Foo {
        constructor(){
            _classPrivateMethodInit(this, _tag);
            _classPrivateFieldInit(this, _tag2, {
                writable: true,
                value: _classPrivateMethodGet(this, _tag, tag)
            });
            const receiver = _classPrivateMethodGet(this, _tag, tag).bind(this)`tagged template`;
            expect(receiver).toBe(this);
            const receiver2 = _classPrivateFieldGet(this, _tag2).bind(this)`tagged template`;
            expect(receiver2).toBe(this);
        }
    }
    function tag() {
        return this;
    }
    new Foo();
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1869_1,
    "
    class TestClass {
        static Something = 'hello';

        static SomeProperties = {
            firstProp: TestClass.Something,
        };
    }

    function someClassDecorator(c) {
        return c;
    }
    ",
    "
    class TestClass {
    }
    _defineProperty(TestClass, \"Something\", 'hello');
    _defineProperty(TestClass, \"SomeProperties\", {
        firstProp: TestClass.Something
    });
    function someClassDecorator(c) {
        return c;
    }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_1869_2,
    "
    var _class;
    let TestClass = _class = someClassDecorator((_class = class TestClass {
        static Something = 'hello';
        static SomeProperties = {
            firstProp: TestClass.Something
        };
    }) || _class) || _class;
    function someClassDecorator(c) {
        return c;
    }
    ",
    "
    var _TestClass;
    var _class;
    let TestClass = _class = someClassDecorator((_class = (_TestClass =
        class TestClass {
        },
        _defineProperty(_TestClass, \"Something\", 'hello'),
        _defineProperty(_TestClass, \"SomeProperties\", {
            firstProp: _TestClass.Something
        }),
        _TestClass
    )) || _class) || _class;
    function someClassDecorator(c) {
        return c;
    }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_2021_1,
    "
    class Item extends Component {
      constructor(props) {
        super(props);
      }

      input = this.props.item;
    }
    ",
    "
    class Item extends Component {
        constructor(props){
            super(props);
            _defineProperty(this, \"input\", this.props.item);
        }
    }
    "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_3229_1,
    "
class A {
  #D;
  B() {
    1;
    C.#D++;
    E(function() {});
  }
}
  ",
    "
var _D = new WeakMap();
class A {
    B() {
        1;
        _classPrivateFieldUpdate(C, _D).value++;
        E(function() {});
    }
    constructor(){
      _classPrivateFieldInit(this, _D, {
          writable: true,
          value: void 0
      });
    }
}
  "
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_3229_2,
    "
class A {
    #b;
    foo() {
        A.#b += 123
        class B {
            foo() {}
        }
    }
}
",
    "
var _b = new WeakMap();
class A {
    foo() {
        var _A;
        _classPrivateFieldSet(_A = A, _b, _classPrivateFieldGet(_A, _b) + 123);
        class B {
            foo() {}
        }
    }
    constructor(){
      _classPrivateFieldInit(this, _b, {
          writable: true,
          value: void 0
      });
  }
}
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_3368,
    "
class A {
  #a = 'fff'
  static #b = 123
  foo() {
    return class B {
      bar() {
        console.log(this.#a, this.#b, this.#bar)
      }
    }
  }
  #bar() {}
}
",
    "
var _a = new WeakMap(), _bar = new WeakSet();
class A {
    foo() {
        return class B {
            bar() {
              console.log(_classPrivateFieldGet(this, _a), _classStaticPrivateFieldSpecGet(this, \
     A, _b), _classPrivateMethodGet(this, _bar, bar));
            }
        };
    }
    constructor(){
        _classPrivateMethodInit(this, _bar);
        _classPrivateFieldInit(this, _a, {
            writable: true,
            value: 'fff'
        });
    }
}
var _b = {
    writable: true,
    value: 123
};
function bar() {}
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    nested_class_in_arrow,
    "
const a = () => class {
  a = 123
  foo() {
    return class B {
      b = 456
    }
  }
}
",
    "
const a = ()=>{
    class _class {
        foo() {
            return class B {
                constructor() {
                    _defineProperty(this, \"b\", 456);
                }
            };
        }
        constructor(){
            _defineProperty(this, \"a\", 123);
        }
    }
    return _class;
};
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_2481,
    "
class Foo {
    static #prop1 = 42;
    static #prop2 = (() => {
        console.log(this.#prop1);
    })();
}
",
    "
class Foo {
}
var _prop1 = {
    writable: true,
    value: 42
};
var _prop2 = {
    writable: true,
    value: (()=>{
        console.log(_classStaticPrivateFieldSpecGet(Foo, Foo, _prop1));
    })()
};
"
);

test!(
    syntax(),
    |t| class_properties(Some(t.comments.clone()), Default::default()),
    issue_4473,
    "
var test1 = class X {
  [Symbol.toStringTag]() {}
}

function a() {
  const b = class Y {
    x() {
    }
  }
}
",
    "
    var test1 = class X {
      [Symbol.toStringTag]() {}
    
    };
    
    function a() {
      const b = class Y {
        x() {}
    
      };
    }
"
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_complex_super,
    "
class A extends class B {} {
  static x = super.x;
}
",
    "
var _B;

class A extends (_B = class B {}) {}

_defineProperty(A, \"x\", _B.x);
"
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_field,
    "
class A extends B {
  foo = super.bar;
  static foo = super.bar;
}
",
    "
class A extends B {
  constructor(...args) {
    super(...args);
    _defineProperty(this, \"foo\", super.bar);
  }
}

_defineProperty(A, \"foo\", B.bar)
"
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            no_document_all: true,
            ..Default::default()
        }
    ),
    private_optional_chain_member_loose,
    r#"
class MyClass {
  #a
  foo(o) {
    o?.#a
  }
}
"#,
    r#"
var _a = new WeakMap();
class MyClass {
  foo(o) {
    o == null ? void 0 : _classPrivateFieldGet(o, _a);
  }
  constructor(){
    _classPrivateFieldInit(this, _a, {
      writable: true,
      value: void 0
    });
  }
}
"#
);

test_exec!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            set_public_fields: true,
            ..Default::default()
        }
    ),
    set_public_fields_initialization_order,
    r#"
const actualOrder = [];

const track = i => {
  actualOrder.push(i);
  return i;
};

class MyClass {
  static [track(1)] = track(10);
  [track(2)] = track(13);
  get [track(3)]() {
    return "foo";
  }
  set [track(4)](value) {
    this.bar = value;
  }
  [track(5)] = track(14);
  static [track(6)] = track(11);
  static [track(7)] = track(12);
  [track(8)]() {}
  [track(9)] = track(15);
}

const inst = new MyClass();

const expectedOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
expect(actualOrder).toEqual(expectedOrder);

expect(MyClass[1]).toBe(10);
expect(inst[2]).toBe(13);
expect(inst[3]).toBe("foo");
inst[4] = "baz";
expect(inst.bar).toBe("baz");
expect(inst[5]).toBe(14);
expect(MyClass[6]).toBe(11);
expect(MyClass[7]).toBe(12);
expect(typeof inst[8]).toBe("function");
expect(inst[9]).toBe(15);
"#
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            set_public_fields: true,
            ..Default::default()
        }
    ),
    set_public_fields_computed,
    r#"
const foo = "foo";
const bar = () => {};
const four = 4;

class MyClass {
  static [one()] = "test";
  static [2 * 4 + 7] = "247";
  static [2 * four + 7] = "247";
  static [2 * four + seven] = "247";
  [null] = "null";
  [undefined] = "undefined";
  [void 0] = "void 0";
  get ["whatever"]() {}
  set ["whatever"](value) {}
  get [computed()]() {}
  set [computed()](value) {}
  ["test" + one]() {}
  static [10]() {}
  [/regex/] = "regex";
  [foo] = "foo";
  [bar] = "bar";
  [baz] = "baz";
  [`template`] = "template";
  [`template${expression}`] = "template-with-expression";
}
"#,
    r#"
const foo = "foo";
const bar = ()=>{};
const four = 4;
let _ref = one(), _ref1 = 2 * 4 + 7, _ref2 = 2 * four + 7, _ref3 = 2 * four + seven, _undefined = undefined, _ref4 = void 0, tmp = computed(), tmp1 = computed(), tmp2 = "test" + one, _ref5 = /regex/, _foo = foo, _bar = bar, _baz = baz, _ref6 = `template${expression}`;
class MyClass {
    get ["whatever"]() {}
    set ["whatever"](value) {}
    get [tmp]() {}
    set [tmp1](value) {}
    [tmp2]() {}
    static [10]() {}
    constructor(){
        this[null] = "null";
        this[_undefined] = "undefined";
        this[_ref4] = "void 0";
        this[_ref5] = "regex";
        this[_foo] = "foo";
        this[_bar] = "bar";
        this[_baz] = "baz";
        this[`template`] = "template";
        this[_ref6] = "template-with-expression";
    }
}
MyClass[_ref] = "test";
MyClass[_ref1] = "247";
MyClass[_ref2] = "247";
MyClass[_ref3] = "247";
"#
);

test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            class_properties(
                Some(t.comments.clone()),
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                }
            )
        )
    },
    set_public_constructor_collision,
    r#"
var foo = "bar";

class Foo {
  bar = foo;
  static bar = baz;

  constructor() {
    var foo = "foo";
    var baz = "baz";
  }
}
"#,
    r#"
var foo = "bar";

class Foo {
  constructor() {
    this.bar = foo;
    var foo1 = "foo";
    var baz1 = "baz";
  }
}

Foo.bar = baz;
"#
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            set_public_fields: true,
            ..Default::default()
        }
    ),
    set_public_static_undefined,
    r#"
class Foo {
  static bar;
}
"#,
    r#"
class Foo {}

Foo.bar = void 0;
"#
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            private_as_properties: true,
            ..Default::default()
        }
    ),
    private_as_properties_basic,
    r#"
class Cl {
  #privateField = "top secret string";

  constructor() {
    this.publicField = "not secret string";
  }

  get #privateFieldValue() {
    return this.#privateField;
  }

  set #privateFieldValue(newValue) {
    this.#privateField = newValue;
  }

  publicGetPrivateField() {
    return this.#privateFieldValue;
  }

  publicSetPrivateField(newValue) {
    this.#privateFieldValue = newValue;
  }
}
"#,
    r#"
var _privateField = /*#__PURE__*/_classPrivateFieldLooseKey("_privateField"), _privateFieldValue = /*#__PURE__*/_classPrivateFieldLooseKey("_privateFieldValue");

class Cl {
  publicGetPrivateField() {
    return _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue];
  }

  publicSetPrivateField(newValue) {
    _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] = newValue;
  }

  constructor() {
    Object.defineProperty(this, _privateFieldValue, {
      get: get_privateFieldValue,
      set: set_privateFieldValue
    });
    Object.defineProperty(this, _privateField, {
      writable: true,
      value: "top secret string"
    });
    this.publicField = "not secret string";
  }
}

function get_privateFieldValue() {
  return _classPrivateFieldLooseBase(this, _privateField)[_privateField];
}

function set_privateFieldValue(newValue) {
  _classPrivateFieldLooseBase(this, _privateField)[_privateField] = newValue;
}
"#
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            private_as_properties: true,
            ..Default::default()
        }
    ),
    private_as_properties_static,
    r#"
class Cl {
  static #foo() {};
  static #f = 123;
  static get #bar() {};
}
"#,
    r#"
var _foo = _classPrivateFieldLooseKey("_foo"), _f = _classPrivateFieldLooseKey("_f"), _bar = _classPrivateFieldLooseKey("_bar");
class Cl { }

Object.defineProperty(Cl, _foo, {
    value: foo
});
Object.defineProperty(Cl, _bar, {
    get: get_bar,
    set: void 0
});
Object.defineProperty(Cl, _f, {
    writable: true,
    value: 123
});
function foo() {}
function get_bar() {}
"#
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            private_as_properties: true,
            ..Default::default()
        }
    ),
    private_as_properties_getter_only,
    r#"
class Cl {
  #privateField = 0;

  get #privateFieldValue() {
    return this.#privateField;
  }

  constructor() {
    this.#privateFieldValue = 1;
    ([this.#privateFieldValue] = [1]);
  }
}
"#,
    r#"
var _privateField = /*#__PURE__*/_classPrivateFieldLooseKey("_privateField"), _privateFieldValue = /*#__PURE__*/_classPrivateFieldLooseKey("_privateFieldValue");

class Cl {
  constructor() {
    Object.defineProperty(this, _privateFieldValue, {
      get: get_privateFieldValue,
      set: void 0
    });
    Object.defineProperty(this, _privateField, {
      writable: true,
      value: 0
    });
    _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] = 1;
    [_classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue]] = [1];
  }

}

function get_privateFieldValue() {
  return _classPrivateFieldLooseBase(this, _privateField)[_privateField];
}
"#
);

test!(
    syntax(),
    |t| class_properties(
        Some(t.comments.clone()),
        class_properties::Config {
            private_as_properties: true,
            set_public_fields: true,
            ..Default::default()
        }
    ),
    loose_update,
    r#"
class Cl {
  #privateField = "top secret string";

  constructor() {
    this.publicField = "not secret string";
  }

  get #privateFieldValue() {
    return this.#privateField;
  }

  set #privateFieldValue(newValue) {
    this.#privateField = newValue;
  }

  publicGetPrivateField() {
    return this.#privateFieldValue;
  }

  publicSetPrivateField(newValue) {
    this.#privateFieldValue = newValue;
  }

  get publicFieldValue() {
    return this.publicField;
  }

  set publicFieldValue(newValue) {
    this.publicField = newValue;
  }

  testUpdates() {
    this.#privateField = 0;
    this.publicField = 0;
    this.#privateFieldValue = this.#privateFieldValue++;
    this.publicFieldValue = this.publicFieldValue++;

    ++this.#privateFieldValue;
    ++this.publicFieldValue;

    this.#privateFieldValue += 1;
    this.publicFieldValue += 1;

    this.#privateFieldValue = -(this.#privateFieldValue ** this.#privateFieldValue);
    this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
  }
}
"#,
    r#"
var _privateField = /*#__PURE__*/_classPrivateFieldLooseKey("_privateField"), _privateFieldValue = /*#__PURE__*/_classPrivateFieldLooseKey("_privateFieldValue");

class Cl {
  publicGetPrivateField() {
    return _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue];
  }

  publicSetPrivateField(newValue) {
    _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] = newValue;
  }

  get publicFieldValue() {
    return this.publicField;
  }

  set publicFieldValue(newValue) {
    this.publicField = newValue;
  }

  testUpdates() {
    _classPrivateFieldLooseBase(this, _privateField)[_privateField] = 0;
    this.publicField = 0;
    _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] = _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue]++;
    this.publicFieldValue = this.publicFieldValue++;
    ++_classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue];
    ++this.publicFieldValue;
    _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] += 1;
    this.publicFieldValue += 1;
    _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] = -(_classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue] ** _classPrivateFieldLooseBase(this, _privateFieldValue)[_privateFieldValue]);
    this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
  }

  constructor() {
    Object.defineProperty(this, _privateFieldValue, {
      get: get_privateFieldValue,
      set: set_privateFieldValue
    });
    Object.defineProperty(this, _privateField, {
      writable: true,
      value: "top secret string"
    });
    this.publicField = "not secret string";
  }
}

function get_privateFieldValue() {
  return _classPrivateFieldLooseBase(this, _privateField)[_privateField];
}

function set_privateFieldValue(newValue) {
  _classPrivateFieldLooseBase(this, _privateField)[_privateField] = newValue;
}
"#
);

#[testing::fixture("tests/classes/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(&input).unwrap();
    compare_stdout(
        Default::default(),
        |t| class_properties(Some(t.comments.clone()), Default::default()),
        &src,
    );
}
