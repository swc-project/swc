use super::*;
use crate::{
    compat::es2015::{block_scoping, Classes},
    helpers::Helpers,
};
use std::sync::Arc;
use swc_ecma_parser::{EsConfig, Syntax};

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        class_private_props: true,
        class_props: true,
        ..Default::default()
    })
}

fn tr(helpers: Arc<Helpers>) -> impl Fold<Module> {
    chain!(
        class_properties(helpers.clone()),
        Classes { helpers },
        block_scoping()
    )
}

test!(
    syntax(),
    tr(Default::default()),
    public_static_infer_name,
    r#"
var Foo = class {
  static num = 0;
}

"#,
    r#"
var _class, _temp;

var Foo = (_temp = _class = function Foo() {
  

  _classCallCheck(this, Foo);
}, _defineProperty(_class, "num", 0), _temp);

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
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
    tr(Default::default()),
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
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _this;

    _classCallCheck(this, Foo);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this));
    _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    return _this;
  }

  return Foo;
}(Bar);

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
var Child =
/*#__PURE__*/
function (_Parent) {
  

  _inherits(Child, _Parent);

  function Child() {
    var _this;

    _classCallCheck(this, Child);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Child).call(this));

    _scopedFunctionWithThis.set(_assertThisInitialized(_this), {
      writable: true,
      value: () => {
        _this.name = {};
      }
    });

    return _this;
  }

  return Child;
}(Parent);

var _scopedFunctionWithThis = new WeakMap();

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
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
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _this;

    _classCallCheck(this, Foo);

    if (condition) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this));
      _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this));
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
    tr,
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
    tr,
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
    tr,
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
    tr(Default::default()),
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
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    

    _inherits(WithContext, _Component);

    function WithContext() {
      _classCallCheck(this, WithContext);
      return _possibleConstructorReturn(this, _getPrototypeOf(WithContext).apply(this, arguments));
    }

    return WithContext;
  }(Component), _defineProperty(_class, "propTypes", {
    context: PropTypes.shape({
      addCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func
    })
  }), _temp;
}

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
  

  _classCallCheck(this, A);
  _defineProperty(this, "force", force);
  _defineProperty(this, "foo", _get(_getPrototypeOf(A.prototype), "method", this).call(this));
};

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
    tr,
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
    tr(Default::default()),
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
var C = function C() {
  

  _classCallCheck(this, C);
  _defineProperty(this, "y", _classPrivateFieldGet(this, _x));

  _x.set(this, {
    writable: true,
    value: void 0
  });
};

var _x = new WeakMap();

expect(() => {
  new C();
}).toThrow();

"#
);

test!(
    syntax(),
    tr(Default::default()),
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


let Hello = function Hello() {
  _classCallCheck(this, Hello);
  return {
    toString() {
      return 'hello';
    }

  };
};

let Outer =
/*#__PURE__*/
function (_Hello) {
  _inherits(Outer, _Hello);

  function Outer() {
    var _this;

    _classCallCheck(this, Outer);

    var _this2 = _this = _possibleConstructorReturn(this, _getPrototypeOf(Outer).call(this));

    let Inner = function Inner() {
      _classCallCheck(this, Inner);
      _defineProperty(this, _this2, "hello");
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
    tr(Default::default()),
    public_instance_undefined,
    r#"
class Foo {
  bar;
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", void 0);
};

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
var Foo =
/*#__PURE__*/
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _this;

    _classCallCheck(this, Foo);

    if (condition) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this));

      _bar.set(_assertThisInitialized(_this), {
        writable: true,
        value: "foo"
      });
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this));

      _bar.set(_assertThisInitialized(_this), {
        writable: true,
        value: "foo"
      });
    }

    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

var _bar = new WeakMap();

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
    public_regression_t2983,
    r#"
call(class {
  static test = true
});

export default class {
  static test = true
};

"#,
    r#"
var _class, _temp;

call((_temp = _class = function _class() {
  _classCallCheck(this, _class);
}, _defineProperty(_class, "test", true), _temp));

var _default = function _default() {
  _classCallCheck(this, _default);
};

_defineProperty(_default, "test", true);
export { _default as default };
;

"#
);

test!(
    syntax(),
    tr(Default::default()),
    public_static,
    r#"
class Foo {
  static bar = "foo";
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);
};

_defineProperty(Foo, "bar", "foo");

"#
);

test!(
    syntax(),
    tr(Default::default()),
    private_instance_undefined,
    r#"
class Foo {
  #bar;
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);

  _bar.set(this, {
    writable: true,
    value: void 0
  });
};

var _bar = new WeakMap();

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
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

test!(syntax(), tr(Default::default()), public_super_call, r#"
class A {
  foo() {
    return "bar";
  }
}

class B extends A {
  foo = super.foo();
}

"#, r#"
var A =
/*#__PURE__*/
function () {
  

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

var B =
/*#__PURE__*/
function (_A) {
  

  _inherits(B, _A);

  function B() {
    var _this;

    _classCallCheck(this, B);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
    _defineProperty(_assertThisInitialized(_this), "foo", _get(_getPrototypeOf(B.prototype), "foo", _assertThisInitialized(_this)).call(_this));
    return _this;
  }

  return B;
}(A);

"#);

test!(
    syntax(),
    tr(Default::default()),
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

var Foo = function Foo() {
  

  _classCallCheck(this, Foo);

  _bar.set(this, {
    writable: true,
    value: foo
  });

  var _foo = "foo";
};

var _bar = new WeakMap();

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
  

  _classCallCheck(this, Foo);
  var foo1 = "foo";
  var baz = "baz";
  _defineProperty(this, "bar", foo);
};

_defineProperty(Foo, "bar", baz);

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
var foo = 'foo';
var bar = ()=>{
};
var four = 4;
var _ref = one(), _ref1 = 2 * 4 + 7, _ref2 = 2 * four + 7, _ref3 = 2 * four + seven,
  _ref4 = null, _undefined = undefined, _ref5 = void 0, tmp = 'whatever',
  tmp1 = 'whatever', tmp2 = computed(), tmp3 = computed(), tmp4 = 'test' + one,
  tmp5 = 10, _ref6 = /regex/, _foo = foo, _bar = bar, _baz = baz,
  _ref7 = `template`, _ref8 = `template${expression}`;
var MyClass = function() {
    function MyClass() {
        _classCallCheck(this, MyClass);
        _defineProperty(this, _ref4, 'null');
        _defineProperty(this, _undefined, 'undefined');
        _defineProperty(this, _ref5, 'void 0');
        _defineProperty(this, _ref6, 'regex');
        _defineProperty(this, _foo, 'foo');
        _defineProperty(this, _bar, 'bar');
        _defineProperty(this, _baz, 'baz');
        _defineProperty(this, _ref7, 'template');
        _defineProperty(this, _ref8, 'template-with-expression');
    }
    _createClass(MyClass, [{
             key: tmp, get: function () {
                } 
        }, {
             key: tmp1, set: function (value) {
                } 
        }, {
             key: tmp2, get: function () {
                } 
        }, {
             key: tmp3, set: function (value) {
                } 
        }, {
             key: tmp4, value: function () {
                } 
        }], [{
             key: tmp5, value: function () {
                } 
        }]);
    return MyClass;
}();
_defineProperty(MyClass, _ref, 'test');
_defineProperty(MyClass, _ref1, '247');
_defineProperty(MyClass, _ref2, '247');
_defineProperty(MyClass, _ref3, '247');

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
    tr,
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
    tr,
    regression_7371_exec,
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
    tr,
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
    tr,
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
    tr(Default::default()),
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
var Foo =
/*#__PURE__*/
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _this;

    _classCallCheck(this, Foo);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this));

    _bar.set(_assertThisInitialized(_this), {
      writable: true,
      value: "foo"
    });

    return _this;
  }

  return Foo;
}(Bar);

var _bar = new WeakMap();

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
var Outer = function Outer() {
  

  _classCallCheck(this, Outer);

  _outer.set(this, {
    writable: true,
    value: void 0
  });

  var Test =
  /*#__PURE__*/
  function (_babelHelpers$classPr) {
    _inherits(Test, _babelHelpers$classPr);

    function Test() {
      _classCallCheck(this, Test);
      return _possibleConstructorReturn(this, _getPrototypeOf(Test).apply(this, arguments));
    }

    return Test;
  }(_classPrivateFieldGet(this, _outer));
};

var _outer = new WeakMap();

"#
);

test!(syntax(), tr(Default::default()), private_update, r#"
class Foo {
  #foo = 0;

  test(other) {
    this.#foo++;
    ++this.#foo;
    other.obj.#foo++;
    ++other.obj.#foo;
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function () {
  

  function Foo() {
    _classCallCheck(this, Foo);

    _foo.set(this, {
      writable: true,
      value: 0
    });
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _this$foo, _other$obj, _other$obj$foo, _other$obj2;

      _classPrivateFieldSet(this, _foo, (_this$foo = +_classPrivateFieldGet(this, _foo)) + 1), _this$foo;
      _classPrivateFieldSet(this, _foo, +_classPrivateFieldGet(this, _foo) + 1);
      _classPrivateFieldSet(_other$obj = other.obj, _foo, (_other$obj$foo = +_classPrivateFieldGet(_other$obj, _foo)) + 1), _other$obj$foo;
      _classPrivateFieldSet(_other$obj2 = other.obj, _foo, +_classPrivateFieldGet(_other$obj2, _foo) + 1);
    }
  }]);
  return Foo;
}();

var _foo = new WeakMap();

"#);

test!(syntax(), tr(Default::default()), public_super_expression, r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    foo(super());
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _temp, _this;

    _classCallCheck(this, Foo);
    foo((_temp = _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this)), _defineProperty(_assertThisInitialized(_this), "bar", "foo"), _temp));
    return _this;
  }

  return Foo;
}(Bar);

"#);

test_exec!(
    syntax(),
    tr,
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
    tr,
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
    tr,
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
    tr(Default::default()),
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
  

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", this);
  _defineProperty(this, "baz", foo);
};

"#
);

test!(
    syntax(),
    tr(Default::default()),
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
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);

  _prop.set(this, {
    writable: true,
    value: "foo"
  });
};

var _prop = new WeakMap();

var Bar =
/*#__PURE__*/
function (_Foo) {
  

  _inherits(Bar, _Foo);

  function Bar(...args) {
    var _this;

    _classCallCheck(this, Bar);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bar).call(this, ...args));

    _prop2.set(_assertThisInitialized(_this), {
      writable: true,
      value: "bar"
    });

    return _this;
  }

  return Bar;
}(Foo);

var _prop2 = new WeakMap();

"#
);

test!(syntax(), tr(Default::default()), private_super_call, r#"
class A {
  foo() {
    return "bar";
  }
}

class B extends A {
  #foo = super.foo();
}

"#, r#"
var A =
/*#__PURE__*/
function () {
  

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

var B =
/*#__PURE__*/
function (_A) {
  

  _inherits(B, _A);

  function B(...args) {
    var _this;

    _classCallCheck(this, B);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(B).call(this, ...args));

    _foo.set(_assertThisInitialized(_this), {
      writable: true,
      value: _get(_getPrototypeOf(B.prototype), "foo", _assertThisInitialized(_this)).call(_assertThisInitialized(_this))
    });

    return _this;
  }

  return B;
}(A);

var _foo = new WeakMap();

"#);

test!(
    syntax(),
    tr(Default::default()),
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
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);
  _defineProperty(this, "one", _classPrivateFieldGet(this, _private));

  _two.set(this, {
    writable: true,
    value: _classPrivateFieldGet(this, _private)
  });

  _private.set(this, {
    writable: true,
    value: 0
  });

  _defineProperty(this, "three", _classPrivateFieldGet(this, _private));

  _four.set(this, {
    writable: true,
    value: _classPrivateFieldGet(this, _private)
  });
};

var _two = new WeakMap();

var _private = new WeakMap();

var _four = new WeakMap();

"#
);

test!(syntax(), tr(Default::default()), nested_class_super_property_in_key, r#"

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

"#, r#"


let Hello =
/*#__PURE__*/
function () {
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

let Outer =
/*#__PURE__*/
function (_Hello) {
  _inherits(Outer, _Hello);

  function Outer() {
    var _this;

    _classCallCheck(this, Outer);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Outer).call(this));

    var _babelHelpers$get$cal = _get(_getPrototypeOf(Outer.prototype), "toString", _assertThisInitialized(_this)).call(_assertThisInitialized(_this));

    let Inner = function Inner() {
      _classCallCheck(this, Inner);
      _defineProperty(this, _babelHelpers$get$cal, 'hello');
    };

    return _possibleConstructorReturn(_this, new Inner());
  }

  return Outer;
}(Hello);

expect(new Outer().hello).toBe('hello');

"#);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
    public_numeric,
    r#"
class Foo {
  0 = "foo";
  1 = "bar";
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);
  _defineProperty(this, 0, "foo");
  _defineProperty(this, 1, "bar");
};

"#
);

test!(syntax(), tr(Default::default()), private_assignment, r#"
class Foo {
  #foo = 0;

  test(other) {
    this.#foo += 1;
    this.#foo = 2;
    other.obj.#foo += 1;
    other.obj.#foo = 2;
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function () {
  

  function Foo() {
    _classCallCheck(this, Foo);

    _foo.set(this, {
      writable: true,
      value: 0
    });
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _other$obj;

      _classPrivateFieldSet(this, _foo, _classPrivateFieldGet(this, _foo) + 1);
      _classPrivateFieldSet(this, _foo, 2);
      _classPrivateFieldSet(_other$obj = other.obj, _foo, _classPrivateFieldGet(_other$obj, _foo) + 1);
      _classPrivateFieldSet(other.obj, _foo, 2);
    }
  }]);
  return Foo;
}();

var _foo = new WeakMap();

"#);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
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
  _classCallCheck(this, MyClass);
};
_defineProperty(MyClass, "property", value);

var MyClass2 = function MyClass2() {
  _classCallCheck(this, MyClass2);
};

_defineProperty(MyClass2, "property", value);
export { MyClass2 as default };

"#
);

test!(
    syntax(),
    tr(Default::default()),
    private_multiple,
    r#"
class Foo {
  #x = 0;
  #y = this.#x;
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);

  _x.set(this, {
    writable: true,
    value: 0
  });

  _y.set(this, {
    writable: true,
    value: _classPrivateFieldGet(this, _x)
  });
};

var _x = new WeakMap();

var _y = new WeakMap();

"#
);

test!(
    syntax(),
    tr(Default::default()),
    public_derived,
    r#"
class Foo extends Bar {
  bar = "foo";
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _this;

    _classCallCheck(this, Foo);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).apply(this, arguments))
    _defineProperty(_assertThisInitialized(_this), "bar", "foo");
    return _this;
  }

  return Foo;
}(Bar);

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
    public_instance,
    r#"
class Foo {
  bar = "foo";
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);
  _defineProperty(this, "bar", "foo");
};

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
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
export default (param => {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function () {
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
  }(), _defineProperty(_class, "props", {
    prop1: 'prop1',
    prop2: 'prop2'
  }), _temp;
});

"#
);

test!(
    syntax(),
    tr(Default::default()),
    public_static_undefined,
    r#"
class Foo {
  static bar;
}

"#,
    r#"
var Foo = function Foo() {
  

  _classCallCheck(this, Foo);
};

_defineProperty(Foo, "bar", void 0);

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr,
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
    tr(Default::default()),
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
var Foo =
/*#__PURE__*/
function () {
  

  function Foo() {
    _classCallCheck(this, Foo);

    _foo.set(this, {
      writable: true,
      value: function () {
        return this;
      }
    });
  }

  _createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _other$obj;

      _classPrivateFieldGet(this, _foo).call(this);
      _classPrivateFieldGet(_other$obj = other.obj, _foo).call(_other$obj);
    }
  }]);
  return Foo;
}();

var _foo = new WeakMap();

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr(Default::default()),
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

var Foo = function Foo(_foo) {
  

  _classCallCheck(this, Foo);

  _bar.set(this, {
    writable: true,
    value: this
  });

  _baz.set(this, {
    writable: true,
    value: foo
  });
};

var _bar = new WeakMap();

var _baz = new WeakMap();

"#
);

test_exec!(
    syntax(),
    tr,
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
    tr,
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
    tr,
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
    tr(Default::default()),
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

test!(syntax(), tr(Default::default()), private_super_expression, r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    foo(super());
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  

  _inherits(Foo, _Bar);

  function Foo() {
    var _temp, _this;

    _classCallCheck(this, Foo);
    foo((_temp = _this = _possibleConstructorReturn(this, _getPrototypeOf(Foo).call(this)), _bar.set(_assertThisInitialized(_this), {
      writable: true,
      value: "foo"
    }), _temp));
    return _this;
  }

  return Foo;
}(Bar);

var _bar = new WeakMap();

"#);

test_exec!(
    syntax(),
    tr,
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
    tr,
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
