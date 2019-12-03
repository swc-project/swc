// private_super_statement
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_super_statement, r#"
class Foo extends Bar {
  #bar = "foo";

  constructor() {
    super();
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  "use strict";

  babelHelpers.inherits(Foo, _Bar);

  function Foo() {
    var _this;

    babelHelpers.classCallCheck(this, Foo);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));

    _bar.set(babelHelpers.assertThisInitialized(_this), {
      writable: true,
      value: "foo"
    });

    return _this;
  }

  return Foo;
}(Bar);

var _bar = new WeakMap();

"#);

// public_static_infer_name
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_static_infer_name, r#"
var Foo = class {
  static num = 0;
}

"#, r#"
var _class, _temp;

var Foo = (_temp = _class = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
}, babelHelpers.defineProperty(_class, "num", 0), _temp);

"#);

// public_regression_T6719
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_regression_T6719, r#"
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

"#, r#"
function withContext(ComposedComponent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    "use strict";

    babelHelpers.inherits(WithContext, _Component);

    function WithContext() {
      babelHelpers.classCallCheck(this, WithContext);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(WithContext).apply(this, arguments));
    }

    return WithContext;
  }(Component), babelHelpers.defineProperty(_class, "propTypes", {
    context: PropTypes.shape({
      addCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func
    })
  }), _temp;
}

"#);

// public_regression_T7364
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-async-to-generator",
    ["proposal-class-properties"]
  ]
}
"), public_regression_T7364, r#"
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

"#, r#"
class MyClass {
  constructor() {
    var _this = this;

    babelHelpers.defineProperty(this, "myAsyncMethod",
    /*#__PURE__*/
    babelHelpers.asyncToGenerator(function* () {
      console.log(_this);
    }));
  }

}

(class MyClass2 {
  constructor() {
    var _this2 = this;

    babelHelpers.defineProperty(this, "myAsyncMethod",
    /*#__PURE__*/
    babelHelpers.asyncToGenerator(function* () {
      console.log(_this2);
    }));
  }

});

export default class MyClass3 {
  constructor() {
    var _this3 = this;

    babelHelpers.defineProperty(this, "myAsyncMethod",
    /*#__PURE__*/
    babelHelpers.asyncToGenerator(function* () {
      console.log(_this3);
    }));
  }

}

"#);

// public_instance_computed
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_instance_computed, r#"
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

"#, r#"
function test(x) {
  var _x;

  _x = x;

  var F = function F() {
    "use strict";

    babelHelpers.classCallCheck(this, F);
    babelHelpers.defineProperty(this, _x, 1);
  };

  x = 'deadbeef';
  expect(new F().foo).toBe(1);
  x = 'wrong';
  expect(new F().foo).toBe(1);
}

test('foo');

"#);

// public_static_undefined
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_static_undefined, r#"
class Foo {
  static bar;
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
};

babelHelpers.defineProperty(Foo, "bar", void 0);

"#);

// public_instance
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_instance, r#"
class Foo {
  bar = "foo";
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
  babelHelpers.defineProperty(this, "bar", "foo");
};

"#);

// private_regression_T6719
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_regression_T6719, r#"
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

"#, r#"
function withContext(ComposedComponent) {
  var _class, _temp, _propTypes;

  return _temp = _class = class WithContext extends Component {}, _propTypes = {
    writable: true,
    value: {
      context: PropTypes.shape({
        addCss: PropTypes.func,
        setTitle: PropTypes.func,
        setMeta: PropTypes.func
      })
    }
  }, _temp;
}

"#);

// public_foobar
test!(syntax(),|_| tr("{
  "plugins": ["external-helpers", "proposal-class-properties"],
  "presets": ["env"]
}
"), public_foobar, r#"
class Child extends Parent {
    constructor() {
        super();
    }

    scopedFunctionWithThis = () => {
        this.name = {};
    }
}

"#, r#"
var Child =
/*#__PURE__*/
function (_Parent) {
  "use strict";

  babelHelpers.inherits(Child, _Parent);

  function Child() {
    var _this;

    babelHelpers.classCallCheck(this, Child);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Child).call(this));
    babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "scopedFunctionWithThis", function () {
      _this.name = {};
    });
    return _this;
  }

  return Child;
}(Parent);

"#);

// private_reevaluated
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_reevaluated, r#"
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

"#, r#"
function classFactory() {
  var _class, _temp, _foo, _bar;

  return _temp = _class = class Foo {
    constructor() {
      _foo.set(this, {
        writable: true,
        value: "foo"
      });
    }

    instance() {
      return babelHelpers.classPrivateFieldGet(this, _foo);
    }

    static() {
      return babelHelpers.classStaticPrivateFieldSpecGet(Foo, _class, _bar);
    }

    static instance(inst) {
      return babelHelpers.classPrivateFieldGet(inst, _foo);
    }

    static static() {
      return babelHelpers.classStaticPrivateFieldSpecGet(Foo, _class, _bar);
    }

  }, _foo = new WeakMap(), _bar = {
    writable: true,
    value: "bar"
  }, _temp;
}

"#);

// private_call
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_call, r#"
class Foo {
  #foo = function() {
    return this;
  }

  test(other) {
    this.#foo();
    other.obj.#foo();
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);

    _foo.set(this, {
      writable: true,
      value: function () {
        return this;
      }
    });
  }

  babelHelpers.createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _other$obj;

      babelHelpers.classPrivateFieldGet(this, _foo).call(this);
      babelHelpers.classPrivateFieldGet(_other$obj = other.obj, _foo).call(_other$obj);
    }
  }]);
  return Foo;
}();

var _foo = new WeakMap();

"#);

// private_static
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_static, r#"
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

"#, r#"
class Foo {
  static test() {
    return babelHelpers.classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

  test() {
    return babelHelpers.classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

}

var _bar = {
  writable: true,
  value: "foo"
};
expect("bar" in Foo).toBe(false);
expect(Foo.test()).toBe("foo");
expect(Foo.test()).toBe("foo");

"#);

// private_super_call
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_super_call, r#"
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
  "use strict";

  function A() {
    babelHelpers.classCallCheck(this, A);
  }

  babelHelpers.createClass(A, [{
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
  "use strict";

  babelHelpers.inherits(B, _A);

  function B(...args) {
    var _this;

    babelHelpers.classCallCheck(this, B);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(B).call(this, ...args));

    _foo.set(babelHelpers.assertThisInitialized(_this), {
      writable: true,
      value: babelHelpers.get(babelHelpers.getPrototypeOf(B.prototype), "foo", babelHelpers.assertThisInitialized(_this)).call(babelHelpers.assertThisInitialized(_this))
    });

    return _this;
  }

  return B;
}(A);

var _foo = new WeakMap();

"#);

// regression_T6719
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    ["proposal-class-properties", { "loose": true }],
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), regression_T6719, r#"
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

"#, r#"
function withContext(ComposedComponent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    "use strict";

    babelHelpers.inherits(WithContext, _Component);

    function WithContext() {
      babelHelpers.classCallCheck(this, WithContext);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(WithContext).apply(this, arguments));
    }

    return WithContext;
  }(Component), _class.propTypes = {
    context: PropTypes.shape({
      addCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func
    })
  }, _temp;
}

"#);

// private_foobar
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_foobar, r#"
class Child extends Parent {
  constructor() {
    super();
  }

  #scopedFunctionWithThis = () => {
    this.name = {};
  }
}

"#, r#"
var Child =
/*#__PURE__*/
function (_Parent) {
  "use strict";

  babelHelpers.inherits(Child, _Parent);

  function Child() {
    var _this;

    babelHelpers.classCallCheck(this, Child);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Child).call(this));

    _scopedFunctionWithThis.set(babelHelpers.assertThisInitialized(_this), {
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

"#);

// private_destructuring_object_pattern_1
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_destructuring_object_pattern_1, r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 'foo';
    ({ x: this.x = this.#client, y: this.#client, z: this.z = this.#client } = props)
  }
}
"#, r#"
var Foo = function Foo(props) {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _client.set(this, {
    writable: true,
    value: void 0
  });

  babelHelpers.classPrivateFieldSet(this, _client, 'foo');
  ({
    x: this.x = babelHelpers.classPrivateFieldGet(this, _client),
    y: babelHelpers.classPrivateFieldDestructureSet(this, _client).value,
    z: this.z = babelHelpers.classPrivateFieldGet(this, _client)
  } = props);
};

var _client = new WeakMap();

"#);

// private_static_undefined_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_super_call
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_super_call, r#"
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
  "use strict";

  function A() {
    babelHelpers.classCallCheck(this, A);
  }

  babelHelpers.createClass(A, [{
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
  "use strict";

  babelHelpers.inherits(B, _A);

  function B(...args) {
    var _this;

    babelHelpers.classCallCheck(this, B);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(B).call(this, ...args));
    babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "foo", babelHelpers.get(babelHelpers.getPrototypeOf(B.prototype), "foo", babelHelpers.assertThisInitialized(_this)).call(babelHelpers.assertThisInitialized(_this)));
    return _this;
  }

  return B;
}(A);

"#);

// public_numeric
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_numeric, r#"
class Foo {
  0 = "foo";
  1 = "bar";
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
  babelHelpers.defineProperty(this, 0, "foo");
  babelHelpers.defineProperty(this, 1, "bar");
};

"#);

// private_static_inherited
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_static_inherited, r#"
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

"#, r#"
class Base {
  static getThis() {
    return babelHelpers.classStaticPrivateFieldSpecGet(this, Base, _foo);
  }

  static updateThis(val) {
    return babelHelpers.classStaticPrivateFieldSpecSet(this, Base, _foo, val);
  }

  static getClass() {
    return babelHelpers.classStaticPrivateFieldSpecGet(Base, Base, _foo);
  }

  static updateClass(val) {
    return babelHelpers.classStaticPrivateFieldSpecSet(Base, Base, _foo, val);
  }

}

var _foo = {
  writable: true,
  value: 1
};

class Sub1 extends Base {
  static update(val) {
    return babelHelpers.classStaticPrivateFieldSpecSet(this, Sub1, _foo2, val);
  }

}

var _foo2 = {
  writable: true,
  value: 2
};

class Sub2 extends Base {}

"#);

// static_property_tdz_edgest_case_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    static_property_tdz_edgest_case_exec,
    r#"
expect(() => {
  class A {
    static [{ x: A || 0 }.x];
  }
}).toThrow();

"#
);

// public_assignment
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_assignment, r#"
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

"#, r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);
    babelHelpers.defineProperty(this, "foo", 0);
  }

  babelHelpers.createClass(Foo, [{
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

"#);

// private_instance_undefined_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_constructor_collision
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_constructor_collision, r#"
var foo = "bar";

class Foo {
  bar = foo;
  static bar = baz;

  constructor() {
    var foo = "foo";
    var baz = "baz";
  }
}

"#, r#"
var foo = "bar";

var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
  babelHelpers.defineProperty(this, "bar", foo);
  var _foo = "foo";
  var baz = "baz";
};

babelHelpers.defineProperty(Foo, "bar", baz);

"#);

// private_destructuring_object_pattern_1_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// static_property_tdz_decorator_interop
test!(syntax(),|_| tr("{
  "plugins": [
    ["proposal-decorators", { "legacy": true }],
    ["proposal-class-properties", { "loose": true }],
    "transform-classes"
  ]
}
"), static_property_tdz_decorator_interop, r#"
function dec() {}

class A {
  @dec a;

  [Symbol.search]() {}
}

"#, r#"
let _Symbol$search;

var _class, _descriptor, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function dec() {}

let A = (_class = (_temp = (_Symbol$search = Symbol.search,
/*#__PURE__*/
function () {
  "use strict";

  function A() {
    _classCallCheck(this, A);

    _initializerDefineProperty(this, "a", _descriptor, this);
  }

  _createClass(A, [{
    key: _Symbol$search,
    value: function () {}
  }]);

  return A;
}()), _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "a", [dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class);

"#);

// compile_to_class_constructor_collision_ignores_types_loose
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-typescript",
    ["proposal-class-properties", { "loose": true }]
  ]
}
"), compile_to_class_constructor_collision_ignores_types_loose, r#"
class C {
    // Output should not use `_initialiseProps`
    x: T;
    y = 0;
    constructor(T) {}
}

"#, r#"
class C {
  // Output should not use `_initialiseProps`
  constructor(T) {
    this.y = 0;
  }

}

"#);

// public_static
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_static, r#"
class Foo {
  static bar = "foo";
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
};

babelHelpers.defineProperty(Foo, "bar", "foo");

"#);

// private_instance_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_native_classes_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_computed
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_computed, r#"
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

"#, r#"
var _one, _ref, _undefined, _computed, _computed2, _ref2, _ref3, _baz, _ref4;

var foo = "foo";

var bar = () => {};

var four = 4;
_one = one();
_ref = 2 * four + seven;
_undefined = undefined;
_computed = computed();
_computed2 = computed();
_ref2 = "test" + one;
_ref3 = /regex/;
_baz = baz;
_ref4 = `template${expression}`;

var MyClass =
/*#__PURE__*/
function () {
  "use strict";

  function MyClass() {
    babelHelpers.classCallCheck(this, MyClass);
    babelHelpers.defineProperty(this, null, "null");
    babelHelpers.defineProperty(this, _undefined, "undefined");
    babelHelpers.defineProperty(this, void 0, "void 0");
    babelHelpers.defineProperty(this, _ref3, "regex");
    babelHelpers.defineProperty(this, foo, "foo");
    babelHelpers.defineProperty(this, bar, "bar");
    babelHelpers.defineProperty(this, _baz, "baz");
    babelHelpers.defineProperty(this, `template`, "template");
    babelHelpers.defineProperty(this, _ref4, "template-with-expression");
  }

  babelHelpers.createClass(MyClass, [{
    key: _ref2,
    value: function () {}
  }, {
    key: "whatever",
    get: function () {},
    set: function (value) {}
  }, {
    key: _computed,
    get: function () {}
  }, {
    key: _computed2,
    set: function (value) {}
  }], [{
    key: 10,
    value: function () {}
  }]);
  return MyClass;
}();

babelHelpers.defineProperty(MyClass, _one, "test");
babelHelpers.defineProperty(MyClass, 2 * 4 + 7, "247");
babelHelpers.defineProperty(MyClass, 2 * four + 7, "247");
babelHelpers.defineProperty(MyClass, _ref, "247");

"#);

// private_static_undefined
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_static_undefined, r#"
class Foo {
  static #bar;

  static test() {
    return Foo.#bar;
  }

  test() {
    return Foo.#bar;
  }
}

"#, r#"
class Foo {
  static test() {
    return babelHelpers.classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

  test() {
    return babelHelpers.classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
  }

}

var _bar = {
  writable: true,
  value: void 0
};

"#);

// private_destructuring_array_pattern
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_destructuring_array_pattern, r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client] = props);
  }
}

"#, r#"
var Foo = function Foo(props) {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _client.set(this, {
    writable: true,
    value: void 0
  });

  [babelHelpers.classPrivateFieldDestructureSet(this, _client).value] = props;
};

var _client = new WeakMap();

"#);

// public_super_with_collision
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_super_with_collision, r#"
class A {
  force = force;
  foo = super.method();

  constructor(force) {}
}

"#, r#"
var A = function A(_force) {
  "use strict";

  babelHelpers.classCallCheck(this, A);
  babelHelpers.defineProperty(this, "force", force);
  babelHelpers.defineProperty(this, "foo", babelHelpers.get(babelHelpers.getPrototypeOf(A.prototype), "method", this).call(this));
};

"#);

// private_reevaluated_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_regression_T2983
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_regression_T2983, r#"
call(class {
  static #test = true
});

export default class {
  static #test = true
};

"#, r#"
var _class, _temp, _test;

call((_temp = _class = class {}, _test = {
  writable: true,
  value: true
}, _temp));
export default class _class2 {}
var _test2 = {
  writable: true,
  value: true
};
;

"#);

// private_regression_T7364
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties",
    "transform-async-to-generator"
  ]
}
"), private_regression_T7364, r#"
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

"#, r#"
class MyClass {
  constructor() {
    var _this = this;

    _myAsyncMethod.set(this, {
      writable: true,
      value: function () {
        var _ref = babelHelpers.asyncToGenerator(function* () {
          console.log(_this);
        });

        return function value() {
          return _ref.apply(this, arguments);
        };
      }()
    });
  }

}

var _myAsyncMethod = new WeakMap();

(class MyClass2 {
  constructor() {
    var _this2 = this;

    _myAsyncMethod2.set(this, {
      writable: true,
      value: function () {
        var _ref2 = babelHelpers.asyncToGenerator(function* () {
          console.log(_this2);
        });

        return function value() {
          return _ref2.apply(this, arguments);
        };
      }()
    });
  }

});

var _myAsyncMethod2 = new WeakMap();

export default class MyClass3 {
  constructor() {
    var _this3 = this;

    _myAsyncMethod3.set(this, {
      writable: true,
      value: function () {
        var _ref3 = babelHelpers.asyncToGenerator(function* () {
          console.log(_this3);
        });

        return function value() {
          return _ref3.apply(this, arguments);
        };
      }()
    });
  }

}

var _myAsyncMethod3 = new WeakMap();

"#);

// public_call
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_call, r#"
class Foo {
  foo = function() {
    return this;
  }

  test(other) {
    this.foo();
    other.obj.foo();
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);
    babelHelpers.defineProperty(this, "foo", function () {
      return this;
    });
  }

  babelHelpers.createClass(Foo, [{
    key: "test",
    value: function test(other) {
      this.foo();
      other.obj.foo();
    }
  }]);
  return Foo;
}();

"#);

// public_static_export
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_static_export, r#"
export class MyClass {
  static property = value;
}

export default class MyClass2 {
  static property = value;
}

"#, r#"
export var MyClass = function MyClass() {
  babelHelpers.classCallCheck(this, MyClass);
};
babelHelpers.defineProperty(MyClass, "property", value);

var MyClass2 = function MyClass2() {
  babelHelpers.classCallCheck(this, MyClass2);
};

babelHelpers.defineProperty(MyClass2, "property", value);
export { MyClass2 as default };

"#);

// private_destructuring_array_pattern_1
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_destructuring_array_pattern_1, r#"
class Foo {
  #client

  constructor(props) {
    this.#client = 1;
    ([this.x = this.#client, this.#client, this.y = this.#client] = props);
  }
}
"#, r#"
var Foo = function Foo(props) {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _client.set(this, {
    writable: true,
    value: void 0
  });

  babelHelpers.classPrivateFieldSet(this, _client, 1);
  [this.x = babelHelpers.classPrivateFieldGet(this, _client), babelHelpers.classPrivateFieldDestructureSet(this, _client).value, this.y = babelHelpers.classPrivateFieldGet(this, _client)] = props;
};

var _client = new WeakMap();

"#);

// private_constructor_collision
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_constructor_collision, r#"
var foo = "bar";

class Foo {
  #bar = foo;

  constructor() {
    var foo = "foo";
  }
}

"#, r#"
var foo = "bar";

var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _bar.set(this, {
    writable: true,
    value: foo
  });

  var _foo = "foo";
};

var _bar = new WeakMap();

"#);

// private_reference_in_other_property
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_reference_in_other_property, r#"
class Foo {
  one = this.#private;
  #two = this.#private;
  #private = 0;
  three = this.#private;
  #four = this.#private;
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
  babelHelpers.defineProperty(this, "one", babelHelpers.classPrivateFieldGet(this, _private));

  _two.set(this, {
    writable: true,
    value: babelHelpers.classPrivateFieldGet(this, _private)
  });

  _private.set(this, {
    writable: true,
    value: 0
  });

  babelHelpers.defineProperty(this, "three", babelHelpers.classPrivateFieldGet(this, _private));

  _four.set(this, {
    writable: true,
    value: babelHelpers.classPrivateFieldGet(this, _private)
  });
};

var _two = new WeakMap();

var _private = new WeakMap();

var _four = new WeakMap();

"#);

// decorators_legacy_interop_strict
test!(syntax(),|_| tr("{
  "plugins": [
    ["proposal-decorators", { "legacy": true }],
    ["proposal-class-properties"],
    "transform-classes"
  ]
}
"), decorators_legacy_interop_strict, r#"
function dec() {}

class A {
  @dec a;

  @dec b = 123;

  c = 456;
}

"#, r#"
var _class, _descriptor, _descriptor2, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function dec() {}

let A = (_class = (_temp = function A() {
  "use strict";

  _classCallCheck(this, A);

  _initializerDefineProperty(this, "a", _descriptor, this);

  _initializerDefineProperty(this, "b", _descriptor2, this);

  _defineProperty(this, "c", 456);
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "a", [dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "b", [dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 123;
  }
})), _class);

"#);

// regression_8882_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// regression_6154
test!(syntax(),|_| tr("{
  "presets": ["env"],
  "plugins": ["proposal-class-properties"]
}
"), regression_6154, r#"
class Test {
  constructor() {
    class Other extends Test {
      a = () => super.test;
      static a = () => super.test;
    }
  }
}

"#, r#"
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Test = function Test() {
  "use strict";

  _classCallCheck(this, Test);

  var Other =
  /*#__PURE__*/
  function (_Test) {
    _inherits(Other, _Test);

    function Other() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Other);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Other)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "a", function () {
        return _get(_getPrototypeOf(Other.prototype), "test", _assertThisInitialized(_this));
      });

      return _this;
    }

    return Other;
  }(Test);

  _defineProperty(Other, "a", function () {
    return _get(_getPrototypeOf(Other), "test", Other);
  });
};

"#);

// private_static_export
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_static_export, r#"
export class MyClass {
  static #property = value;
}

export default class MyClass2 {
  static #property = value;
}

"#, r#"
export class MyClass {}
var _property = {
  writable: true,
  value: value
};
export default class MyClass2 {}
var _property2 = {
  writable: true,
  value: value
};

"#);

// private_canonical_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// static_property_tdz_edgest_case
test!(syntax(),|_| tr("{
  "plugins": ["proposal-class-properties", "transform-classes"]
}
"), static_property_tdz_edgest_case, r#"
class A {
  static [{ x: A || 0 }.x];
}

"#, r#"
let _x$x;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classNameTDZError(name) { throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys."); }

_x$x = {
  x: (_classNameTDZError("A"), A) || 0
}.x;

let A = function A() {
  "use strict";

  _classCallCheck(this, A);
};

_defineProperty(A, _x$x, void 0);

"#);

// private_declaration_order
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_declaration_order, r#"
class C {
  y = this.#x;
  #x;
}

expect(() => {
  new C();
}).toThrow();

"#, r#"
var C = function C() {
  "use strict";

  babelHelpers.classCallCheck(this, C);
  babelHelpers.defineProperty(this, "y", babelHelpers.classPrivateFieldGet(this, _x));

  _x.set(this, {
    writable: true,
    value: void 0
  });
};

var _x = new WeakMap();

expect(() => {
  new C();
}).toThrow();

"#);

// regression_6153
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-arrow-functions"
  ]
}
"), regression_6153, r#"
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

"#, r#"
(function () {
  class Foo {
    constructor() {
      var _this = this;

      babelHelpers.defineProperty(this, "fn", function () {
        return console.log(_this);
      });
    }

  }

  babelHelpers.defineProperty(Foo, "fn", function () {
    return console.log(Foo);
  });
});

(function () {
  var _class, _temp;

  return _temp = _class = class Bar {
    constructor() {
      var _this2 = this;

      babelHelpers.defineProperty(this, "fn", function () {
        return console.log(_this2);
      });
    }

  }, babelHelpers.defineProperty(_class, "fn", function () {
    return console.log(_class);
  }), _temp;
});

(function () {
  class Baz {
    constructor(_force) {
      var _this3 = this;

      babelHelpers.defineProperty(this, "fn", function () {
        return console.log(_this3);
      });
      babelHelpers.defineProperty(this, "force", force);
    }

  }

  babelHelpers.defineProperty(Baz, "fn", function () {
    return console.log(Baz);
  });
});

var qux = function () {
  class Qux {
    constructor() {
      var _this4 = this;

      babelHelpers.defineProperty(this, "fn", function () {
        return console.log(_this4);
      });
    }

  }

  babelHelpers.defineProperty(Qux, "fn", function () {
    return console.log(Qux);
  });
}.bind(this);

"#);

// regression_7371
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-arrow-functions"
  ]
}
"), regression_7371, r#"
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

"#, r#"
"use strict";

class C {}

class A extends C {
  constructor() {
    super();
    babelHelpers.defineProperty(this, "field", 1);

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

    class B extends ((_temp = super(), babelHelpers.defineProperty(this, "field", 1), _temp), Obj) {
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
    var _temp2;

    class B extends Obj {
      constructor() {
        super();
        expect(this.field).toBeUndefined();
      }

      [(_temp2 = super(), babelHelpers.defineProperty(this, "field", 1), _temp2)]() {}

    }

    expect(this.field).toBe(1);
    new B();
  }

}

new ComputedMethod(); // ensure ComputedKey Field is still transformed

class ComputedField extends Obj {
  constructor() {
    let _ref;

    var _temp3;

    _ref = (_temp3 = super(), babelHelpers.defineProperty(this, "field", 1), _temp3);

    class B extends Obj {
      constructor() {
        super();
        babelHelpers.defineProperty(this, _ref, 1);
        expect(this.field).toBeUndefined();
      }

    }

    expect(this.field).toBe(1);
    new B();
  }

}

new ComputedField();

"#);

// private_canonical
test!(syntax(),|_| tr("{
  "minNodeVersion": "6.0.0"
}
"), private_canonical, r#"
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

"#, r#"
var Point =
/*#__PURE__*/
function () {
  "use strict";

  function Point(x = 0, y = 0) {
    babelHelpers.classCallCheck(this, Point);

    _x.set(this, {
      writable: true,
      value: void 0
    });

    _y.set(this, {
      writable: true,
      value: void 0
    });

    babelHelpers.classPrivateFieldSet(this, _x, +x);
    babelHelpers.classPrivateFieldSet(this, _y, +y);
  }

  babelHelpers.createClass(Point, [{
    key: "equals",
    value: function equals(p) {
      return babelHelpers.classPrivateFieldGet(this, _x) === babelHelpers.classPrivateFieldGet(p, _x) && babelHelpers.classPrivateFieldGet(this, _y) === babelHelpers.classPrivateFieldGet(p, _y);
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Point<${babelHelpers.classPrivateFieldGet(this, _x)},${babelHelpers.classPrivateFieldGet(this, _y)}>`;
    }
  }, {
    key: "x",
    get: function () {
      return babelHelpers.classPrivateFieldGet(this, _x);
    },
    set: function (value) {
      babelHelpers.classPrivateFieldSet(this, _x, +value);
    }
  }, {
    key: "y",
    get: function () {
      return babelHelpers.classPrivateFieldGet(this, _y);
    },
    set: function (value) {
      babelHelpers.classPrivateFieldSet(this, _y, +value);
    }
  }]);
  return Point;
}();

var _x = new WeakMap();

var _y = new WeakMap();

"#);

// regression_8882
test!(syntax(),|_| tr("{
  "plugins": ["external-helpers", "proposal-class-properties"]
}
"), regression_8882, r#"
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
"#, r#"
const classes = [];

for (let i = 0; i <= 10; ++i) {
  var _class, _temp, _bar;

  let _i;

  classes.push((_temp = (_i = i, _class = class A {
    constructor() {
      babelHelpers.defineProperty(this, _i, `computed field ${i}`);

      _bar.set(this, {
        writable: true,
        value: `private field ${i}`
      });
    }

    getBar() {
      return babelHelpers.classPrivateFieldGet(this, _bar);
    }

  }), _bar = new WeakMap(), babelHelpers.defineProperty(_class, "foo", `static field ${i}`), _temp));
}

"#);

// private_instance_undefined
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_instance_undefined, r#"
class Foo {
  #bar;
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _bar.set(this, {
    writable: true,
    value: void 0
  });
};

var _bar = new WeakMap();

"#);

// compile_to_class_constructor_collision_ignores_types
test!(syntax(),|_| tr("{
  "plugins": ["transform-typescript", "proposal-class-properties"]
}
"), compile_to_class_constructor_collision_ignores_types, r#"
class C {
    // Output should not use `_initialiseProps`
    x: T;
    y = 0;
    constructor(T) {}
}

"#, r#"
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class C {
  // Output should not use `_initialiseProps`
  constructor(T) {
    _defineProperty(this, "y", 0);
  }

}

"#);

// private_private_in_derived
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_private_in_derived, r#"
class Outer {
  #outer;

  constructor() {
    class Test extends this.#outer {
    }
  }
}

"#, r#"
var Outer = function Outer() {
  "use strict";

  babelHelpers.classCallCheck(this, Outer);

  _outer.set(this, {
    writable: true,
    value: void 0
  });

  var Test =
  /*#__PURE__*/
  function (_babelHelpers$classPr) {
    babelHelpers.inherits(Test, _babelHelpers$classPr);

    function Test() {
      babelHelpers.classCallCheck(this, Test);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Test).apply(this, arguments));
    }

    return Test;
  }(babelHelpers.classPrivateFieldGet(this, _outer));
};

var _outer = new WeakMap();

"#);

// private_destructuring_array_pattern_3
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_destructuring_array_pattern_3, r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client = 5] = props);
  }
}
"#, r#"
var Foo = function Foo(props) {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _client.set(this, {
    writable: true,
    value: void 0
  });

  [babelHelpers.classPrivateFieldDestructureSet(this, _client).value = 5] = props;
};

var _client = new WeakMap();

"#);

// public_static_super_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_destructuring_array_pattern_2, r#"
class Foo {
  #client

  constructor(props) {
    ([x, ...this.#client] = props);
  }
}
"#, r#"
var Foo = function Foo(props) {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _client.set(this, {
    writable: true,
    value: void 0
  });

  [x, ...babelHelpers.classPrivateFieldDestructureSet(this, _client).value] = props;
};

var _client = new WeakMap();

"#);

// private_non_block_arrow_func
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_non_block_arrow_func, r#"
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

"#, r#"
export default (param => {
  var _class, _temp, _props;

  return _temp = _class = class App {
    getParam() {
      return param;
    }

  }, _props = {
    writable: true,
    value: {
      prop1: 'prop1',
      prop2: 'prop2'
    }
  }, _temp;
});

"#);

// regression_T7364
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-async-to-generator",
    ["proposal-class-properties", { "loose": true }]
  ]
}
"), regression_T7364, r#"
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

"#, r#"
class MyClass {
  constructor() {
    var _this = this;

    this.myAsyncMethod =
    /*#__PURE__*/
    babelHelpers.asyncToGenerator(function* () {
      console.log(_this);
    });
  }

}

(class MyClass2 {
  constructor() {
    var _this2 = this;

    this.myAsyncMethod =
    /*#__PURE__*/
    babelHelpers.asyncToGenerator(function* () {
      console.log(_this2);
    });
  }

});

export default class MyClass3 {
  constructor() {
    var _this3 = this;

    this.myAsyncMethod =
    /*#__PURE__*/
    babelHelpers.asyncToGenerator(function* () {
      console.log(_this3);
    });
  }

}

"#);

// regression_8110
test!(syntax(),|_| tr("{
  "plugins": ["external-helpers", "proposal-class-properties"]
}
"), regression_8110, r#"
const field = Symbol('field');

class A {
  [field] = 10;
}

"#, r#"
const field = Symbol('field');

class A {
  constructor() {
    babelHelpers.defineProperty(this, field, 10);
  }

}

"#);

// decorators_legacy_interop_local_define_property
test!(syntax(),|_| tr("{
  "plugins": [
    ["proposal-decorators", { "legacy": true }],
    ["proposal-class-properties"],
    "transform-classes"
  ]
}
"), decorators_legacy_interop_local_define_property, r#"
function dec() {}

// Create a local function binding so babel has to change the name of the helper
function _defineProperty() {}

class A {
  @dec a;

  @dec b = 123;

  c = 456;
}

"#, r#"
var _class, _descriptor, _descriptor2, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

function dec() {} // Create a local function binding so babel has to change the name of the helper


function _defineProperty() {}

let A = (_class = (_temp = function A() {
  "use strict";

  _classCallCheck(this, A);

  _initializerDefineProperty(this, "a", _descriptor, this);

  _initializerDefineProperty(this, "b", _descriptor2, this);

  _defineProperty2(this, "c", 456);
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "a", [dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "b", [dec], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 123;
  }
})), _class);

"#);

// public_static_undefined_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    public_static_undefined_exec,
    r#"
class Foo {
  static num;
}

expect("num" in Foo).toBe(true);
expect(Foo.num).toBeUndefined();

"#
);

// public_computed_without_block_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    public_computed_without_block_exec,
    r#"
const createClass = (k) => class { [k()] = 2 };

const clazz = createClass(() => 'foo');
const instance = new clazz();
expect(instance.foo).toBe(2);
"#
);

// private_instance
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties",
    "transform-exponentiation-operator"
  ]
}
"), private_instance, r#"
class Foo {
  #bar = "foo";
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);

  _bar.set(this, {
    writable: true,
    value: "foo"
  });
};

var _bar = new WeakMap();

"#);

// static_property_tdz_general
test!(syntax(),|_| tr("{
  "plugins": ["proposal-class-properties", "transform-classes"]
}
"), static_property_tdz_general, r#"
class C {
  static [C + 3] = 3;
}

"#, r#"
let _ref;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classNameTDZError(name) { throw new Error("Class \"" + name + "\" cannot be referenced in computed property keys."); }

_ref = (_classNameTDZError("C"), C) + 3;

let C = function C() {
  "use strict";

  _classCallCheck(this, C);
};

_defineProperty(C, _ref, 3);

"#);

// public_derived_multiple_supers
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_derived_multiple_supers, r#"
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

"#, r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  "use strict";

  babelHelpers.inherits(Foo, _Bar);

  function Foo() {
    var _this;

    babelHelpers.classCallCheck(this, Foo);

    if (condition) {
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));
      babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "bar", "foo");
    } else {
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));
      babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "bar", "foo");
    }

    return babelHelpers.possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#);

// public_native_classes
test!(syntax(),|_| tr("{
  "minNodeVersion": "6.0.0",
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_native_classes, r#"
class Foo {
  static foo = "foo";
  bar = "bar";
}

"#, r#"
class Foo {
  constructor() {
    babelHelpers.defineProperty(this, "bar", "bar");
  }

}

babelHelpers.defineProperty(Foo, "foo", "foo");

"#);

// public_arrow_static_this_without_transform
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-arrow-functions",
    "syntax-class-properties"
  ]
}
"), public_arrow_static_this_without_transform, r#"
class Foo {
  static fn = () => console.log(this);
}

"#, r#"
var _this = this;

class Foo {
  static fn = function () {
    return console.log(_this);
  };
}

"#);

// private_declaration_order_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_static_infer_name
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_static_infer_name, r#"
var Foo = class {
  static #num = 0;
}

"#, r#"
var _class, _temp, _num;

var Foo = (_temp = _class = class Foo {}, _num = {
  writable: true,
  value: 0
}, _temp);

"#);

// private_derived_multiple_supers
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_derived_multiple_supers, r#"
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

"#, r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  "use strict";

  babelHelpers.inherits(Foo, _Bar);

  function Foo() {
    var _this;

    babelHelpers.classCallCheck(this, Foo);

    if (condition) {
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));

      _bar.set(babelHelpers.assertThisInitialized(_this), {
        writable: true,
        value: "foo"
      });
    } else {
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));

      _bar.set(babelHelpers.assertThisInitialized(_this), {
        writable: true,
        value: "foo"
      });
    }

    return babelHelpers.possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

var _bar = new WeakMap();

"#);

// regression_T2983
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    ["proposal-class-properties", { "loose": true }],
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), regression_T2983, r#"
call(class {
  static test = true
});

export default class {
  static test = true
};

"#, r#"
var _class, _temp;

call((_temp = _class = function _class() {
  babelHelpers.classCallCheck(this, _class);
}, _class.test = true, _temp));

var _default = function _default() {
  babelHelpers.classCallCheck(this, _default);
};

_default.test = true;
export { _default as default };
;

"#);

// public_instance_undefined
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_instance_undefined, r#"
class Foo {
  bar;
}

"#, r#"
var Foo = function Foo() {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
  babelHelpers.defineProperty(this, "bar", void 0);
};

"#);

// regression_7951
test!(syntax(),|_| tr("{
  "plugins": ["external-helpers", "proposal-class-properties"]
}
"), regression_7951, r#"
export class Foo extends Bar {
  static foo = {};

  test = args;
}

"#, r#"
export class Foo extends Bar {
  constructor(..._args) {
    super(..._args);
    babelHelpers.defineProperty(this, "test", args);
  }

}
babelHelpers.defineProperty(Foo, "foo", {});

"#);

// private_destructuring_array_pattern_3_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    private_destructuring_array_pattern_3_exec,
    r#"
class Foo {
  #client

  constructor(props) {
    ([this.#client = 5] = props);
  }

  getClient() {
    return this.#client;
  }
}

const foo = new Foo([]);
expect(foo.getClient()).toEqual(5);

"#
);

// private_native_classes
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.0.2"
      }
    ],
    "proposal-class-properties",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_native_classes, r#"
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

"#, r#"
class Foo {
  constructor() {
    _bar.set(this, {
      writable: true,
      value: "bar"
    });
  }

  static test() {
    return babelHelpers.classStaticPrivateFieldSpecGet(Foo, Foo, _foo);
  }

  test() {
    return babelHelpers.classPrivateFieldGet(this, _bar);
  }

}

var _bar = new WeakMap();

var _foo = {
  writable: true,
  value: "foo"
};

"#);

// public_super_statement
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_super_statement, r#"
class Foo extends Bar {
  bar = "foo";

  constructor() {
    super();
  }
}

"#, r#"
var Foo =
/*#__PURE__*/
function (_Bar) {
  "use strict";

  babelHelpers.inherits(Foo, _Bar);

  function Foo() {
    var _this;

    babelHelpers.classCallCheck(this, Foo);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this));
    babelHelpers.defineProperty(babelHelpers.assertThisInitialized(_this), "bar", "foo");
    return _this;
  }

  return Foo;
}(Bar);

"#);

// public_instance_computed_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_static_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_computed_without_block
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_computed_without_block, r#"
const createClass = (k) => class { [k()] = 2 };

"#, r#"
var createClass = k => {
  var _temp;

  var _k;

  return _temp = (_k = k(),
  /*#__PURE__*/
  function () {
    "use strict";

    function _class2() {
      babelHelpers.classCallCheck(this, _class2);
      babelHelpers.defineProperty(this, _k, 2);
    }

    return _class2;
  }()), _temp;
};

"#);

// private_assignment
test!(syntax(),|_| tr("{
  "plugins": [
    [
      "external-helpers",
      {
        "helperVersion": "7.4.4"
      }
    ],
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), private_assignment, r#"
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
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);

    _foo.set(this, {
      writable: true,
      value: 0
    });
  }

  babelHelpers.createClass(Foo, [{
    key: "test",
    value: function test(other) {
      var _other$obj;

      babelHelpers.classPrivateFieldSet(this, _foo, babelHelpers.classPrivateFieldGet(this, _foo) + 1);
      babelHelpers.classPrivateFieldSet(this, _foo, 2);
      babelHelpers.classPrivateFieldSet(_other$obj = other.obj, _foo, babelHelpers.classPrivateFieldGet(_other$obj, _foo) + 1);
      babelHelpers.classPrivateFieldSet(other.obj, _foo, 2);
    }
  }]);
  return Foo;
}();

var _foo = new WeakMap();

"#);

// public_call_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_destructuring_array_pattern_2_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_call_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_static_inherited_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_static_super
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "proposal-class-properties",
    "transform-classes",
    "transform-block-scoping",
    "syntax-class-properties"
  ]
}
"), public_static_super, r#"
class A {
  static prop = 1;
}

class B extends A {
  static prop = 2;
  static propA = super.prop;
  static getPropA = () => super.prop;
}

"#, r#"
var A = function A() {
  "use strict";

  babelHelpers.classCallCheck(this, A);
};

babelHelpers.defineProperty(A, "prop", 1);

var B =
/*#__PURE__*/
function (_A) {
  "use strict";

  babelHelpers.inherits(B, _A);

  function B() {
    babelHelpers.classCallCheck(this, B);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(B).apply(this, arguments));
  }

  return B;
}(A);

babelHelpers.defineProperty(B, "prop", 2);
babelHelpers.defineProperty(B, "propA", babelHelpers.get(babelHelpers.getPrototypeOf(B), "prop", B));
babelHelpers.defineProperty(B, "getPropA", () => babelHelpers.get(babelHelpers.getPrototypeOf(B), "prop", B));

"#);

// private_constructor_collision_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// static_property_tdz_general_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    static_property_tdz_general_exec,
    r#"
expect(() => {
  class C {
    static [C + 3] = 3;
  }
}).toThrow();

"#
);

// regression_7371_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    regression_7371_exec,
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

"#
);

// private_destructuring_array_pattern_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_native_classes_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// public_static_infer_name_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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

// private_destructuring_array_pattern_1_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
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
