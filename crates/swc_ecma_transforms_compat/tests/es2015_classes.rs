use std::{fs::read_to_string, path::PathBuf};

use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015,
    es2015::{arrow, block_scoping, classes, classes::Config, spread},
    es2016, es2017, es2018, es2022,
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture, Tester};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(tester: &Tester) -> impl Fold {
    classes(Some(tester.comments.clone()), Default::default())
}

fn spec_tr(tester: &Tester) -> impl Fold {
    chain!(
        resolver(Mark::new(), Mark::new(), false),
        classes(Some(tester.comments.clone()), Default::default()),
        spread(spread::Config {
            ..Default::default()
        }),
        block_scoping(),
    )
}

test!(
    syntax(),
    |t| tr(t),
    bigint_literial_methods,
    "
class Foo {
  1n() {}
  get 2n() {}
  set 3n(x) {}
}
",
    r#"
let Foo = function () {
  "use strict";
  function Foo() {
    _classCallCheck(this, Foo);
  }
  _createClass(Foo, [
    {
      key: "1",
      value: function () {},
    },
    {
      key: "2",
      get: function () {},
    },
    {
      key: "3",
      set: function (x) {},
    },
  ]);
  return Foo;
}();
"#
);

test!(
    syntax(),
    |t| tr(t),
    issue_189,
    r#"
class HomePage extends React.Component {}
"#,
    r#"
let HomePage = function(_Component) {
    "use strict";
    _inherits(HomePage, _Component);
    var _super = _createSuper(HomePage);
    function HomePage() {
        _classCallCheck(this, HomePage);
        return _super.apply(this, arguments);
    }
    return HomePage;
}(React.Component);
"#
);

test!(
    syntax(),
    |t| tr(t),
    custom_singleton,
    r#"
let singleton;
class Sub extends Foo {
  constructor() {
    if (singleton) {
      return singleton;
    }
    singleton = super();
  }
}
"#,
    r#"
let singleton;
let Sub = function(Foo) {
    "use strict";
    _inherits(Sub, Foo);

    var _super = _createSuper(Sub);

    function Sub() {
        _classCallCheck(this, Sub);
        var _this;
        if (singleton) {
            return _possibleConstructorReturn(_this, singleton);
        }
        singleton = _this = _super.call(this);
        return _possibleConstructorReturn(_this);
    }
    return Sub;
}(Foo);
"#
);

test!(
    syntax(),
    |t| tr(t),
    custom_native,
    r#"
    class List extends Array {}
"#,
    r#"
let List = function(Array) {
    "use strict";
    _inherits(List, Array);
    var _super = _createSuper(List);
    function List() {
        _classCallCheck(this, List);
        return _super.apply(this, arguments);
    }
    return List;
}(_wrapNativeSuper(Array));
"#
);

test_exec!(
    syntax(),
    |t| tr(t),
    custom_nested,
    r#"
class Hello{
  constructor(){
    return {
      toString () {
        return 'hello';
      }
    };
  }
}
class Outer extends Hello{
  constructor(){
    var _ref = super();
    class Inner{
      constructor(){
        this[_ref] = 'hello';
      }
    }
    return new Inner();
  }
}
expect(new Outer().hello).toBe('hello');
"#
);

// spec_constructor_only
test!(
    syntax(),
    |t| spec_tr(t),
    spec_constructor_only,
    r#"
class Foo {
    constructor() {

    }
}
"#,
    r#"
var Foo = function Foo() {
  "use strict";
_classCallCheck(this, Foo);
};

"#
);

// extend_builtins_wrap_native_super

// spec_name_method_collision

// exec_super

// regression_5769_exec
test_exec!(
    syntax(),
    |t| tr(t),
    regression_5769_exec,
    r#"
class Point {
  getX() {
    expect(this.x).toBe(3); // C
  }
}

class ColorPoint extends Point {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    expect(this.x).toBe(3);   // A
    expect(super.x).toBeUndefined();  // B
  }

  m() {
    this.getX()
  }
}

const cp = new ColorPoint();
cp.m();

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_5_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_5_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    Foo[this];
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_statement
test!(
    // We don't use function-name pass
    ignore,
    syntax(),
    |t| spec_tr(t),
    spec_statement,
    r#"
var BaseView = class BaseView {
  constructor() {
    this.autoRender = true;
  }
}

var BaseView = class {
  constructor() {
    this.autoRender = true;
  }
}

var BaseView = class {
  foo() {
    this.autoRender = true;
  }
}

"#,
    r#"
var BaseView = function BaseView() {
  "use strict";
_classCallCheck(this, BaseView);
  this.autoRender = true;
};

var BaseView = function BaseView() {
  "use strict";
_classCallCheck(this, BaseView);
  this.autoRender = true;
};

var BaseView =
/*#__PURE__*/
function () {
  "use strict";
function BaseView() {
    _classCallCheck(this, BaseView);
  }

  _createClass(BaseView, [{
    key: "foo",
    value: function foo() {
      this.autoRender = true;
    }
  }]);
  return BaseView;
}();

"#
);

// get_set_set_semantics_getter_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_getter_defined_on_parent,
    r#"

class Base {
  get test() {
    return 1;
  }
};

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(() => {
  // this requires helpers to be in file (not external), so they
  // are in "strict" mode code.
  obj.set();
}).toThrow();
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#,
    r#"


let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    get: function () {
      return 1;
    }
  }]);

  return Base;
}();

;

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(() => {
  // this requires helpers to be in file (not external), so they
  // are in "strict" mode code.
  obj.set();
}).toThrow();
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#
);

// spec_derived_constructor_must_call_super
test!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super,
    r#"
class Foo extends Bar {
  constructor() {

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

    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

// get_set_get_semantics_data_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_data_defined_on_parent,
    r#"

class Base {
}
Base.prototype.test = 1;

class Obj extends Base {
  get() {
    return super.test;
  }
}
Obj.prototype.test = 2;

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

Base.prototype.test = 1;

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "get",
    value: function get() {
      return _get(_getPrototypeOf(Obj.prototype), "test", this);
    }
  }]);

  return Obj;
}(Base);

Obj.prototype.test = 2;
const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#
);

// extend_builtins_spec

// spec_super_reference_before_in_lambda_2

// regression_8499
test!(
    syntax(),
    |t| tr(t),
    regression_8499,
    r#"
// Pretend that `Reflect.construct` isn't supported.
this.Reflect = undefined;

this.HTMLElement = function() {
  // Here, `this.HTMLElement` is this function, not the original HTMLElement
  // constructor. `this.constructor` should be this function too, but isn't.
  constructor = this.constructor;
};

var constructor;

class CustomElement extends HTMLElement {};
new CustomElement();

expect(constructor).toBe(CustomElement);



"#,
    r#"
this.Reflect = undefined;
this.HTMLElement = function() {
    constructor = this.constructor;
};
var constructor;
let CustomElement = function(HTMLElement) {
    "use strict";
    _inherits(CustomElement, HTMLElement);
    var _super = _createSuper(CustomElement);
    function CustomElement() {
        _classCallCheck(this, CustomElement);
        return _super.apply(this, arguments);
    }
    return CustomElement;
}(_wrapNativeSuper(HTMLElement));
;
new CustomElement();
expect(constructor).toBe(CustomElement);

"#
);

// regression_5817
test!(
    syntax(),
    |t| chain!(tr(t), arrow()),
    regression_5817,
    r#"
class A extends B {
  constructor() {
    super();

    this.arrow1 = (x) => { return x; };
    this.arrow2 = (x) => x;
  }
}

"#,
    r#"
let A = function(B) {
    "use strict";
    _inherits(A, B);
    var _super = _createSuper(A);
    function A() {
        _classCallCheck(this, A);
        var _this;
        _this = _super.call(this);
        _this.arrow1 = function(x) {
            return x;
        };
        _this.arrow2 = function(x) {
            return x;
        };
        return _this;
    }
    return A;
}(B);


"#
);

// spec_super_reference_before_in_lambda_3

// get_set_set_semantics_not_defined_on_parent_setter_on_obj
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_setter_on_obj,
    r#"

class Base {
}

let value = 2;
class Obj extends Base {
  set test(v) {
    expect(this).toBe(obj);
    value = v;
  }

  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(value).toBe(2);
expect(obj.test).toBe(3);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

let value = 2;

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "test",
    set: function (v) {
      expect(this).toBe(obj);
      value = v;
    }
  }, {
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(value).toBe(2);
expect(obj.test).toBe(3);

"#
);

// get_set_get_semantics_setter_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_setter_defined_on_parent,
    r#"

class Base {
  set test(v) {
    throw new Error("called");
  }
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#,
    r#"


let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    set: function (v) {
      throw new Error("called");
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "get",
    value: function get() {
      return _get(_getPrototypeOf(Obj.prototype), "test", this);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_4
test!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_4,
    r#"
class Foo extends Bar {
  constructor() {
    const fn = () => this;
    super();
    fn();
  }
}

"#,
    r#"
var Foo = function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);

    var _super = _createSuper(Foo);

    function Foo() {
        _classCallCheck(this, Foo);
        var _this;
        var fn = ()=>_assertThisInitialized(_this)
        ;
        _this = _super.call(this);
        fn();
        return _this;
    }
    return Foo;
}(Bar);
"#
);

// spec_calling_super_properties
test!(
    syntax(),
    |t| spec_tr(t),
    spec_calling_super_properties,
    r#"
class Test extends Foo {
  constructor() {
    super();
    super.test.whatever();
    super.test();
  }

  static test() {
    return super.wow();
  }
}

"#,
    r#"
    var Test = /*#__PURE__*/function (Foo) {
      "use strict";
      _inherits(Test, Foo);

      var _super = _createSuper(Test);

      function Test() {
        _classCallCheck(this, Test);

        var _this = _super.call(this);

        _get((_assertThisInitialized(_this), _getPrototypeOf(Test.prototype)), "test", _this).whatever();

        _get((_assertThisInitialized(_this), _getPrototypeOf(Test.prototype)), "test", _this).call(_this);

        return _this;
      }

      _createClass(Test, null, [{
        key: "test",
        value: function test() {
          return _get(_getPrototypeOf(Test), "wow", this).call(this);
        }
      }]);

      return Test;
    }(Foo);
"#
);

// spec_super_reference_before_bare_super

// spec_super_reference_before_bare_super_inline

// spec_instance_getter_and_setter
test!(
    syntax(),
    |t| spec_tr(t),
    spec_instance_getter_and_setter,
    r#"
class Test {
  get test() {
    return 5 + 5;
  }
  set test(val) {
    this._test = val;
  }
}

"#,
    r#"
var Test =
/*#__PURE__*/
function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
  }

  _createClass(Test, [{
    key: "test",
    get: function () {
      return 5 + 5;
    },
    set: function (val) {
      this._test = val;
    }
  }]);
  return Test;
}();

"#
);

// regression_2941
test!(
    // Module
    ignore,
    syntax(),
    |t| tr(t),
    regression_2941,
    r#"
export default class {}

"#,
    r#"


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  _classCallCheck(this, _default);
};

exports.default = _default;

"#
);

// regression_t2494
test!(
    syntax(),
    |t| tr(t),
    regression_t2494,
    r#"
var x = {
  Foo: class extends Foo {}
};

"#,
    r#"
var x = {
  Foo:
  /*#__PURE__*/
  function (Foo) {
  "use strict";
_inherits(_class, Foo);
  var _super = _createSuper(_class);
    function _class() {
      _classCallCheck(this, _class);
      return _super.apply(this, arguments);
    }

    return _class;
  }(Foo)
};

"#
);

// spec_inferred_expression_name
test!(
    syntax(),
    |t| spec_tr(t),
    spec_inferred_expression_name,
    r#"
var o = { foo: class foo {} };

"#,
    r#"
var o = {
  foo: function foo() {
    "use strict";

    _classCallCheck(this, foo);
  }
};

"#
);

// regression_8499_exec
test_exec!(
    // Wrong test (babel + jest fails)
    ignore,
    syntax(),
    |t| tr(t),
    regression_8499_exec,
    r#"
// Pretend that `Reflect.construct` isn't supported.
this.Reflect = undefined;

this.HTMLElement = function() {
  // Here, `this.HTMLElement` is this function, not the original HTMLElement
  // constructor. `this.constructor` should be this function too, but isn't.
  constructor = this.constructor;
};

var constructor;

class CustomElement extends HTMLElement {};
new CustomElement();

expect(constructor).toBe(CustomElement);



"#
);

// spec_default_super
test!(
    syntax(),
    |t| spec_tr(t),
    spec_default_super,
    r#"
class Test {
  constructor() {
    return super.constructor;
  }

  static test() {
    return super.constructor;
  }
}

// Instances
expect(Object.getPrototypeOf(Test.prototype)).toBe(Object.prototype);
expect(new Test()).toBe(Object);

// Static
expect(Object.getPrototypeOf(Test)).toBe(Function.prototype);
expect(Test.test()).toBe(Function);

"#,
    r#"
var Test =
/*#__PURE__*/
function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
    return _get(_getPrototypeOf(Test.prototype), "constructor", this);
  }

  _createClass(Test, null, [{
    key: "test",
    value: function test() {
      return _get(_getPrototypeOf(Test), "constructor", this);
    }
  }]);
  return Test;
}(); // Instances


expect(Object.getPrototypeOf(Test.prototype)).toBe(Object.prototype);
expect(new Test()).toBe(Object); // Static

expect(Object.getPrototypeOf(Test)).toBe(Function.prototype);
expect(Test.test()).toBe(Function);

"#
);

// spec_default_super
test!(
    syntax(),
    |t| spec_tr(t),
    spec_default_super_constructor,
    r#"
class Test {
  constructor() {
    return super.constructor;
  }
}
"#,
    r#"
var Test = function Test() {
  "use strict";
  _classCallCheck(this, Test);
  return _get(_getPrototypeOf(Test.prototype), "constructor", this);
}
"#
);

// get_set_get_semantics_getter_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_getter_defined_on_parent,
    r#"

class Base {
  get test() {
    expect(this).toBe(obj);
    return 1;
  }
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#,
    r#"


let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    get: function () {
      expect(this).toBe(obj);
      return 1;
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "get",
    value: function get() {
      return _get(_getPrototypeOf(Obj.prototype), "test", this);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#
);

// spec

// spec_this_not_allowed_before_super_in_derived_classes
test!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes,
    r#"
class Foo extends Bar {
  constructor() {
    this.foo = "bar";
    super();
  }
}

"#,
    r#"
var Foo = function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    var _super = _createSuper(Foo);
    function Foo() {
        _classCallCheck(this, Foo);
        var _this;
        _this.foo = "bar";
        _this = _super.call(this);
        return _this;
    }
    return Foo;
}(Bar);


"#
);

// get_set_call_semantics_getter_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_getter_defined_on_parent,
    r#"

class Base {
  get test() {
    expect(this).toBe(obj);
    return function(...args) {
      expect(this).toBe(obj);
      expect(args).toEqual([1, 2, 3]);
      return 1;
    };
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#,
    r#"


let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    get: function () {
      expect(this).toBe(obj);
      return function (...args) {
        expect(this).toBe(obj);
        expect(args).toEqual([1, 2, 3]);
        return 1;
      };
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "call",
    value: function call() {
      _get(_getPrototypeOf(Obj.prototype), "test", this).call(this, 1, 2, 3);

      _get(_getPrototypeOf(Obj.prototype), "test", this).call(this, 1, ...[2, 3]);

      _get(_getPrototypeOf(Obj.prototype), "test", this).call(this, ...[1, 2, 3]);

      return _get(_getPrototypeOf(Obj.prototype), "test", this).apply(this, arguments);
    }
  }, {
    key: "test",
    value: function test() {
      throw new Error("called");
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#
);

// spec_derived_constructor_must_call_super_4_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_4_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// exec_retain_no_call_on

// spec_export_default
test!(
    syntax(),
    |t| spec_tr(t),
    spec_export_default,
    r#"
export default class Foo {}

"#,
    r#"
var Foo = function Foo() {
  "use strict";
  _classCallCheck(this, Foo);
};

export { Foo as default };

"#
);

// get_set_call_semantics_data_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_data_defined_on_parent,
    r#"

class Base {
  test(...args) {
    expect(this).toBe(obj);
    expect(args).toEqual([1, 2, 3]);
    return 1;
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#,
    r#"


let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    value: function test(...args) {
      expect(this).toBe(obj);
      expect(args).toEqual([1, 2, 3]);
      return 1;
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);

  var _super = _createSuper(Obj);

  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "call",
    value: function call() {
      _get(_getPrototypeOf(Obj.prototype), "test", this).call(this, 1, 2, 3);

      _get(_getPrototypeOf(Obj.prototype), "test", this).call(this, 1, ...[2, 3]);

      _get(_getPrototypeOf(Obj.prototype), "test", this).call(this, ...[1, 2, 3]);

      return _get(_getPrototypeOf(Obj.prototype), "test", this).apply(this, arguments);
    }
  }, {
    key: "test",
    value: function test() {
      throw new Error("called");
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#
);

// spec_static
test!(
    syntax(),
    |t| spec_tr(t),
    spec_static,
    r#"
class A {
  static a() {

  }

  static get b(){

  }

  static set b(b){

  }
}

"#,
    r#"
var A =
/*#__PURE__*/
function () {
  "use strict";

  function A() {
    _classCallCheck(this, A);
  }

  _createClass(A, null, [{
    key: "a",
    value: function a() {}
  }, {
    key: "b",
    get: function () {},
    set: function (b) {}
  }]);
  return A;
}();

"#
);

// regression_t6755

// get_set_memoized_update
test!(
    syntax(),
    |t| tr(t),
    get_set_memoized_update,
    r#"

class Base {}
Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true,
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true,
});

let i = 0;
const proper = {
  get prop() {
    return i++;
  },
};

class Obj extends Base {
  update() {
    super[proper.prop]++;
  }

  update2() {
    super[i]++;
  }
}

const obj = new Obj();

obj.update();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);

obj.update2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true
});
let i = 0;
const proper = {
  get prop() {
    return i++;
  }

};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "update",
    value: function update() {
      var _prop, _super_prop;

      _set(_getPrototypeOf(Obj.prototype), _prop = proper.prop, (_super_prop = +_get(_getPrototypeOf(Obj.prototype), _prop, this)) + 1, this, true), _super_prop;
    }
  }, {
    key: "update2",
    value: function update2() {
      var _i, _super_i

      _set(_getPrototypeOf(Obj.prototype), _i = i, (_super_i = +_get(_getPrototypeOf(Obj.prototype), _i, this)) + 1, this, true), _super_i;
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
obj.update();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);
obj.update2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#
);

// spec_nested_class_super_property_in_key
test!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_class_super_property_in_key,
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
      [super.toString()]() {
        return 'hello';
      }
    }

    return new Inner();
  }
}

expect(new Outer().hello()).toBe('hello');

"#,
    r#"


var Hello =
/*#__PURE__*/
function () {
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

    var Inner = /*#__PURE__*/function () {
      function Inner() {
        _classCallCheck(this, Inner);
      }

      _createClass(Inner, [{
        key: _get((_assertThisInitialized(_this), _getPrototypeOf(Outer.prototype)), "toString", _this).call(_this),
        value: function () {
          return 'hello';
        }
      }]);

    return Inner;
  }();

    return _possibleConstructorReturn(_this, new Inner());
  }

  return Outer;
}(Hello);

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_super_reference_in_prop_expression
test!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_in_prop_exression,
    r#"
class Foo extends Bar {
  constructor() {
    super[super().method]();
  }
}
"#,
    r#"
    var Foo = /*#__PURE__*/function (Bar1) {
      "use strict";
      _inherits(Foo, Bar1);

      var _super = _createSuper(Foo);

      function Foo() {
        _classCallCheck(this, Foo);

      var _this;

      _get((_assertThisInitialized(_this), _getPrototypeOf(Foo.prototype)), (_this = _super.call(this)).method, _this).call(_this);

        return _possibleConstructorReturn(_this);
      }

      return Foo;
    }(Bar);
"#
);

// spec_super_reference_before_in_lambda_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_in_lambda_exec,
    r#"
class Bar {
  test() {}
}

class Foo extends Bar {
  constructor() {
    const t = () => super.test()
    super();
  }
}

new Foo();
"#
);

// spec_nested_class_super_call_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_class_super_call_in_key_exec,
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
      [super()]() {
        return 'hello';
      }
    }

    return new Inner();
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_4_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_4_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => this;
    super();
    fn();
  }
}

new Foo();

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_2
test!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_2,
    r#"
class Foo extends Bar {
  constructor() {
    super(this);
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
    _this = _super.call(this, _assertThisInitialized(_this))
    return _this;
  }

  return Foo;
}(Bar);

"#
);

// spec_accessing_super_properties
test!(
    syntax(),
    |t| spec_tr(t),
    spec_accessing_super_properties,
    r#"
class Test extends Foo {
  constructor() {
    super();
    super.test;
    super.test.whatever;
  }
}

"#,
    r#"
    var Test = /*#__PURE__*/function (Foo) {
      "use strict";
      _inherits(Test, Foo);

      var _super = _createSuper(Test);

      function Test() {
        _classCallCheck(this, Test);
        var _this = _super.call(this);

        _get((_assertThisInitialized(_this), _getPrototypeOf(Test.prototype)), "test", _this);

        _get((_assertThisInitialized(_this), _getPrototypeOf(Test.prototype)), "test", _this).whatever;
        return _this;
      }

      return Test;
    }(Foo);

"#
);

// exec_shadow

// spec_computed_methods
test!(
    syntax(),
    |t| spec_tr(t),
    spec_computed_methods,
    r#"
class Foo {
  foo() {}
  "foo"() {}
  [bar]() {}
  [bar + "foo"]() {}
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
    key: "foo",
    value: function foo() {}
  }, {
    key: "foo",
    value: function foo() {}
  }, {
    key: bar,
    value: function() {}
  }, {
    key: bar + "foo",
    value: function () {}
  }]);
  return Foo;
}();

"#
);

// extend_builtins_shadowed

// get_set_set_semantics_data_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_data_defined_on_parent,
    r#"

class Base  {
}
Object.defineProperty(Base.prototype, 'test', {
  value: 1,
  writable: true,
  configurable: true,
});

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

Object.defineProperty(Base.prototype, 'test', {
  value: 1,
  writable: true,
  configurable: true
});

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#
);

// get_set_set_semantics_not_defined_on_parent_getter_on_obj
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_getter_on_obj,
    r#"

class Base {
}

class Obj extends Base {
  get test() { }

  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "test",
    get: function () {}
  }, {
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#
);

// get_set

// spec_returning_from_derived_constructor_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_returning_from_derived_constructor_exec,
    r#"

class Foo {
  constructor() {
    return { x: 1 };
  }
}

expect(new Foo().x).toBe(1);

class Bar extends Foo {
  constructor() {
    super();
    return;
  }
}

expect(new Bar().x).toBe(1);

class Bar2 extends Foo {
  constructor() {
    super();
    expect(this.x).toBe(1);
    return { x: 2 };
  }
}

expect(new Bar2().x).toBe(2);


let singleton;
class Sub extends Foo {
  constructor() {
    if (singleton) {
      return singleton;
    }
    singleton = super();
  }
}

let instance = new Sub;
expect(instance).toBe(singleton);

instance = new Sub;
expect(instance).toBe(singleton);

class Null extends Foo {
  constructor() {
    if (false) {
      super();
    }
    return null;
    super();
  }
}

expect(() => {
  new Null();
}).toThrow("this");

"#
);

// regression_2694

// regression_5769
test!(
    syntax(),
    |t| tr(t),
    regression_5769,
    r#"
class Point {
  getX() {
    expect(this.x).toBe(3); // C
  }
}

class ColorPoint extends Point {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    expect(this.x).toBe(3);   // A
    expect(super.x).toBeUndefined();  // B
  }

  m() {
    this.getX();
  }
}

const cp = new ColorPoint();
cp.m();

"#,
    r#"
let Point =
/*#__PURE__*/
function () {
  "use strict";
function Point() {
    _classCallCheck(this, Point);
  }

  _createClass(Point, [{
    key: "getX",
    value: function getX() {
      expect(this.x).toBe(3); // C
    }
  }]);
  return Point;
}();

let ColorPoint =
/*#__PURE__*/
function (Point) {
  "use strict";
_inherits(ColorPoint, Point);
var _super = _createSuper(ColorPoint);
  function ColorPoint() {
    _classCallCheck(this, ColorPoint);

    var _this;

    _this = _super.call(this);
    _this.x = 2;

    _set((_assertThisInitialized(_this), _getPrototypeOf(ColorPoint.prototype)), "x", 3, _this, true);

    expect(_this.x).toBe(3); // A

    expect(_get((_assertThisInitialized(_this), _getPrototypeOf(ColorPoint.prototype)), "x", _this)).toBeUndefined(); // B

    return _this;
  }

  _createClass(ColorPoint, [{
    key: "m",
    value: function m() {
      this.getX();
    }
  }]);
  return ColorPoint;
}(Point);

const cp = new ColorPoint();
cp.m();

"#
);

// spec_super_function_fallback
test!(
    syntax(),
    |t| spec_tr(t),
    spec_super_function_fallback,
    r#"
class Test {
  constructor() {
    super.hasOwnProperty("test");
  }
}

"#,
    r#"
var Test = function Test() {
  "use strict";

  _classCallCheck(this, Test);
  _get(_getPrototypeOf(Test.prototype), "hasOwnProperty", this).call(this, "test");
};

"#
);

// regression_t7537

// regression_3028
test!(
    // Module
    ignore,
    syntax(),
    |t| tr(t),
    regression_3028,
    r#"
class b {
}

class a1 extends b {
  constructor() {
    super();
    this.x = () => this;
  }
}

export default class a2 extends b {
  constructor() {
    super();
    this.x = () => this;
  }
}

"#,
    r#"


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var b = function b() {
  _classCallCheck(this, b);
};

var a1 =
/*#__PURE__*/
function (_b) {
  _inherits(a1, _b);

  function a1() {
    var _this;

    _classCallCheck(this, a1);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(a1).call(this));

    _this.x = function () {
      return _assertThisInitialized(_this);
    };

    return _this;
  }

  return a1;
}(b);

var a2 =
/*#__PURE__*/
function (_b2) {
  _inherits(a2, _b2);

  function a2() {
    var _this2;

    _classCallCheck(this, a2);
    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(a2).call(this));

    _this2.x = function () {
      return _assertThisInitialized(_assertThisInitialized(_this2));
    };

    return _this2;
  }

  return a2;
}(b);

exports.default = a2;

"#
);

// spec_super_illegal_non_constructor_call

// spec_instance_setter
test!(
    syntax(),
    |t| spec_tr(t),
    spec_instance_setter,
    r#"
class Test {
  set test(val) {
  this._test = val;
  }
}

"#,
    r#"
var Test =
/*#__PURE__*/
function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
  }

  _createClass(Test, [{
    key: "test",
    set: function (val) {
      this._test = val;
    }
  }]);
  return Test;
}();

"#
);

// spec_nested_object_super_call_in_key
test!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_object_super_call_in_key,
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
    const Inner = {
      [super()]() {
        return 'hello';
      },
    };

    return Inner;
  }
}

expect(new Outer().hello()).toBe('hello');

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

    var Inner = {
      [_this = _super.call(this)]() {
        return 'hello';
      }

    };
    return _possibleConstructorReturn(_this, Inner);
  }

  return Outer;
}(Hello);

expect(new Outer().hello()).toBe('hello');

"#
);

// get_set_set_semantics_not_defined_on_parent_not_on_obj
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_not_on_obj,
    r#"

class Base {
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#
);

// spec_derived_constructor_no_super_return_falsy
test!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_no_super_return_falsey,
    r#"
class Child extends Base {
    constructor(){
        return false;
    }
}

"#,
    r#"
var Child = function(Base1) {
    "use strict";
    _inherits(Child, Base1);
    var _super = _createSuper(Child);
    function Child() {
        _classCallCheck(this, Child);
        var _this;
        return _possibleConstructorReturn(_this, false);
    }
    return Child;
}(Base);

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_5
test!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_5,
    r#"
class Foo extends Bar {
  constructor() {
    Foo[this];
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
    Foo[_assertThisInitialized(_this)];
    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

// exec_super_change

// spec_constructor
test!(
    syntax(),
    |t| spec_tr(t),
    spec_constructor,
    r#"
class Test {
  constructor() {
    this.state = "test";
  }
}

class Foo extends Bar {
  constructor() {
    super();
    this.state = "test";
  }
}

class ConstructorScoping {
  constructor(){
    let bar;
    {
      let bar;
    }
  }
}

"#,
    r#"
var Test = function Test() {
  "use strict";

  _classCallCheck(this, Test);
  this.state = "test";
};

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
    _this.state = "test";
    return _this;
  }

  return Foo;
}(Bar);

var ConstructorScoping = function ConstructorScoping() {
  "use strict";

  _classCallCheck(this, ConstructorScoping);
  var bar;
  {
    var bar1;
  }
};

"#
);

// spec_preserves_directives
test!(
    syntax(),
    |t| spec_tr(t),
    spec_preserves_directives,
    r#"
class MyCtrl {
  constructor(a) {
    "any directive prologue";
    foo;
  }
}

class MyCtrl2 {
  constructor(a) {
    "a";
    "b";
    foo;
  }
}

class MyCtrl3 {
  constructor(a) {
    "a";
    foo;
    "b";
  }
}

"#,
    r#"
var MyCtrl = function MyCtrl(a) {
  "any directive prologue";
  "use strict";

  _classCallCheck(this, MyCtrl);
  foo;
};

var MyCtrl2 = function MyCtrl2(a) {
  "a";
  "b";
  "use strict";

  _classCallCheck(this, MyCtrl2);
  foo;
};

var MyCtrl3 = function MyCtrl3(a) {
  "a";
  "use strict";

  _classCallCheck(this, MyCtrl3);
  foo;
  "b";
};

"#
);

// spec_super_reference_before_in_lambda

// spec_derived_constructor_no_super_return_object
test!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_no_super_return_object,
    r#"
class Child extends Base {
    constructor(){
        return {};
    }
}

"#,
    r#"
var Child = function(Base1) {
    "use strict";
    _inherits(Child, Base1);
    var _super = _createSuper(Child);
    function Child() {
        _classCallCheck(this, Child);
        var _this;
        return _possibleConstructorReturn(_this, {
        });
    }
    return Child;
}(Base);


"#
);

// regression_t6750
test!(
    // Module
    ignore,
    syntax(),
    |t| tr(t),
    regression_t6750,
    r#"
export default function() {
  return class Select {
    query(query) {
    }
  }
}

"#,
    r#"


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return (
    /*#__PURE__*/
    function () {
      function Select() {
        _classCallCheck(this, Select);
      }

      _createClass(Select, [{
        key: "query",
        value: function query(_query) {}
      }]);
      return Select;
    }()
  );
}

"#
);

// spec_instance_method
test!(
    syntax(),
    |t| spec_tr(t),
    spec_instance_method,
    r#"
class Test {
  test() {
  return 5 + 5;
  }
}

"#,
    r#"
var Test =
/*#__PURE__*/
function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
  }

  _createClass(Test, [{
    key: "test",
    value: function test() {
      return 5 + 5;
    }
  }]);
  return Test;
}();

"#
);

// regression_t2997
test!(
    syntax(),
    |t| tr(t),
    regression_t2997,
    r#"
class A {}

class B extends A {
  constructor() {
    return super();
  }
}

"#,
    r#"
let A = function A() {
  "use strict";
_classCallCheck(this, A);
};

let B =
/*#__PURE__*/
function (A) {
  "use strict";
_inherits(B, A);
var _super = _createSuper(B);
  function B() {
    _classCallCheck(this, B);
    var _this;

    return _possibleConstructorReturn(_this, _this = _super.call(this));
  }

  return B;
}(A);

"#
);

// spec_constructor_binding_collision
test!(
    syntax(),
    |t| spec_tr(t),
    spec_constructor_binding_collision,
    r#"
class Example {
  constructor() {
    var Example;
  }
}

var t = new Example();

"#,
    r#"
var Example = function Example() {
  "use strict";
_classCallCheck(this, Example);

  var Example1;
};

var t = new Example();

"#
);

// spec_super_class_anonymous
test!(
    syntax(),
    |t| spec_tr(t),
    spec_super_class_anonymous,
    r#"
class TestEmpty extends (class {}) {
}

class TestConstructorOnly extends (class { constructor() {} }) {
}

class TestMethodOnly extends (class { method() {} }) {
}

class TestConstructorAndMethod extends (class {
  constructor() {}
  method() {}
}) {
}

class TestMultipleMethods extends (class {
  m1() {}
  m2() {}
}) {}

"#,
    r#"
    var TestEmpty = function(_superClass) {
      "use strict";
      _inherits(TestEmpty, _superClass);
      var _super = _createSuper(TestEmpty);
      function TestEmpty() {
          _classCallCheck(this, TestEmpty);
          return _super.apply(this, arguments);
      }
      return TestEmpty;
  }(function _class() {
      "use strict";
      _classCallCheck(this, _class);
  });
  var TestConstructorOnly = function(_superClass) {
      "use strict";
      _inherits(TestConstructorOnly, _superClass);
      var _super = _createSuper(TestConstructorOnly);
      function TestConstructorOnly() {
          _classCallCheck(this, TestConstructorOnly);
          return _super.apply(this, arguments);
      }
      return TestConstructorOnly;
  }(function _class() {
      "use strict";
      _classCallCheck(this, _class);
  });
  var TestMethodOnly = function(_superClass) {
      "use strict";
      _inherits(TestMethodOnly, _superClass);
      var _super = _createSuper(TestMethodOnly);
      function TestMethodOnly() {
          _classCallCheck(this, TestMethodOnly);
          return _super.apply(this, arguments);
      }
      return TestMethodOnly;
  }(function() {
      "use strict";
      function _class() {
          _classCallCheck(this, _class);
      }
      _createClass(_class, [
          {
              key: "method",
              value: function method() {
              }
          }
      ]);
      return _class;
  }());
  var TestConstructorAndMethod = function(_superClass) {
      "use strict";
      _inherits(TestConstructorAndMethod, _superClass);
      var _super = _createSuper(TestConstructorAndMethod);
      function TestConstructorAndMethod() {
          _classCallCheck(this, TestConstructorAndMethod);
          return _super.apply(this, arguments);
      }
      return TestConstructorAndMethod;
  }(function() {
      "use strict";
      function _class() {
          _classCallCheck(this, _class);
      }
      _createClass(_class, [
          {
              key: "method",
              value: function method() {
              }
          }
      ]);
      return _class;
  }());
  var TestMultipleMethods = function(_superClass) {
      "use strict";
      _inherits(TestMultipleMethods, _superClass);
      var _super = _createSuper(TestMultipleMethods);
      function TestMultipleMethods() {
          _classCallCheck(this, TestMultipleMethods);
          return _super.apply(this, arguments);
      }
      return TestMultipleMethods;
  }(function() {
      "use strict";
      function _class() {
          _classCallCheck(this, _class);
      }
      _createClass(_class, [
          {
              key: "m1",
              value: function m1() {
              }
          },
          {
              key: "m2",
              value: function m2() {
              }
          }
      ]);
      return _class;
  }());

"#
);

// spec_method_return_type_annotation

// spec_nested_class_super_call_in_key
test!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_class_super_call_in_key,
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
      [super()]() {
        return 'hello';
      }
    }

    return new Inner();
  }
}

expect(new Outer().hello()).toBe('hello');

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
    var _this = this;
    var _this1;

    var Inner =
    /*#__PURE__*/
    function () {
      function Inner() {
        _classCallCheck(this, Inner);
      }

      _createClass(Inner, [{
        key: _this1 = _super.call(_this),
        value: function () {
          return 'hello';
        }
      }]);
      return Inner;
    }();

    return _possibleConstructorReturn(_this1, new Inner());
  }

  return Outer;
}(Hello);

expect(new Outer().hello()).toBe('hello');

"#
);

// extend_builtins_builtin_objects_throw_when_wrapped

// regression_2663
test!(
    // Module
    ignore,
    syntax(),
    |t| tr(t),
    regression_2663,
    r#"
import net from 'net';
import { EventEmitter } from 'events';
import BinarySerializer from './helpers/binary-serializer';
// import ...

export default class Connection extends EventEmitter {
    constructor(endpoint, joinKey, joinData, roomId) {
        super();

        this.isConnected = false;
        this.roomId = roomId;

        // ...
    }

    send(message) {
        this.sock.write(BinarySerializer.serializeMessage(message));
    }

    disconnect() {
        this.sock.close();
    }
}

"#,
    r#"


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _net = _interopRequireDefault(require("net"));

var _events = require("events");

var _binarySerializer = _interopRequireDefault(require("./helpers/binary-serializer"));

// import ...
var Connection =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  function Connection(endpoint, joinKey, joinData, roomId) {
    var _this;

    _classCallCheck(this, Connection);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connection).call(this));
    _this.isConnected = false;
    _this.roomId = roomId; // ...

    return _this;
  }

  _createClass(Connection, [{
    key: "send",
    value: function send(message) {
      this.sock.write(_binarySerializer.default.serializeMessage(message));
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.sock.close();
    }
  }]);
  return Connection;
}(_events.EventEmitter);

exports.default = Connection;

"#
);

// get_set_set_semantics_setter_defined_on_parent_exec
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_setter_defined_on_parent_exec,
    r#"

let value = 1;
class Base {
  set test(v) {
    value = v;
  }
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(value).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#
);

// regression_5817_exec
test_exec!(
    syntax(),
    |t| tr(t),
    regression_5817_exec,
    r#"
// https://github.com/babel/babel/issues/5817

class Parent {}

class Table extends Parent {
  constructor() {
    super();
    this.returnParam = (param) => {
      return param;
    }
  }
}

const table = new Table();

expect(table.returnParam(false)).toBe(false);

"#
);

// exec_class_prototype

// spec_instance_getter
test!(
    syntax(),
    |t| spec_tr(t),
    spec_instance_getter,
    r#"
class Test {
  get test() {
  return 5 + 5;
  }
}

"#,
    r#"
var Test =
/*#__PURE__*/
function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
  }

  _createClass(Test, [{
    key: "test",
    get: function () {
      return 5 + 5;
    }
  }]);
  return Test;
}();

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_3
test!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_3,
    r#"
class Foo extends Bar {
  constructor() {
    const fn = () => this;
    fn();
    super();
  }
}

"#,
    r#"
var Foo = function(Bar1) {
    "use strict";
    _inherits(Foo, Bar1);
    var _super = _createSuper(Foo);
    function Foo() {
        _classCallCheck(this, Foo);
        var _this;
        var fn = ()=>_assertThisInitialized(_this)
        ;
        fn();
        _this = _super.call(this);
        return _this;
    }
    return Foo;
}(Bar);


"#
);

// spec_accessing_super_class
test!(
    // TODO(kdy1): Unignore this.
    ignore,
    syntax(),
    |t| spec_tr(t),
    spec_accessing_super_class,
    r#"
class Test extends Foo {
  constructor() {
    woops.super.test();
    super();
    super.test();

    super(...arguments);
    super("test", ...arguments);

    super.test(...arguments);
    super.test("test", ...arguments);
  }

  test() {
    super.test();
    super.test(...arguments);
    super.test("test", ...arguments);
  }

  static foo() {
    super.foo();
    super.foo(...arguments);
    super.foo("test", ...arguments);
  }
}

"#,
    r#"
var Test =
/*#__PURE__*/
function (Foo) {
  "use strict";
  _inherits(Test, Foo);

  function Test() {
    var _babelHelpers$getProt, _babelHelpers$get;

    var _this;

    _classCallCheck(this, Test);
    woops.super.test();
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Test).call(this));
    _get(_getPrototypeOf(Test.prototype), "test", _assertThisInitialized(_this)).call(_this);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Test).apply(this, arguments));
    _this = _possibleConstructorReturn(this, (_babelHelpers$getProt = _getPrototypeOf(Test)).call.apply(_babelHelpers$getProt, [this, "test"].concat(Array.prototype.slice.call(arguments))));
    _get(_getPrototypeOf(Test.prototype), "test", _assertThisInitialized(_this)).apply(_assertThisInitialized(_this), arguments);

    (_babelHelpers$get = _get(_getPrototypeOf(Test.prototype), "test", _assertThisInitialized(_this))).call.apply(_babelHelpers$get, [_assertThisInitialized(_this), "test"].concat(Array.prototype.slice.call(arguments)));

    return _this;
  }

  _createClass(Test, [{
    key: "test",
    value: function test() {
      var _babelHelpers$get2;

      _get(_getPrototypeOf(Test.prototype), "test", this).call(this);
      _get(_getPrototypeOf(Test.prototype), "test", this).apply(this, arguments);

      (_babelHelpers$get2 = _get(_getPrototypeOf(Test.prototype), "test", this)).call.apply(_babelHelpers$get2, [this, "test"].concat(Array.prototype.slice.call(arguments)));
    }
  }], [{
    key: "foo",
    value: function foo() {
      var _babelHelpers$get3;

      _get(_getPrototypeOf(Test), "foo", this).call(this);
      _get(_getPrototypeOf(Test), "foo", this).apply(this, arguments);

      (_babelHelpers$get3 = _get(_getPrototypeOf(Test), "foo", this)).call.apply(_babelHelpers$get3, [this, "test"].concat(Array.prototype.slice.call(arguments)));
    }
  }]);
  return Test;
}(Foo);

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    this.foo = "bar";
    super();
  }
}

expect(() => new Foo()).toThrow();

"#
);

// spec_nested_object_super_property_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_object_super_property_in_key_exec,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    const Inner = {
      [super.toString()]() {
        return 'hello';
      },
    };

    return Inner;
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// regression_t6712
test!(
    syntax(),
    |t| tr(t),
    regression_t6712,
    r#"
class A {
  foo() {
    const foo = 2;
  }
}

"#,
    r#"
let A =
/*#__PURE__*/
function () {
  "use strict";
function A() {
    _classCallCheck(this, A);
  }

  _createClass(A, [{
    key: "foo",
    value: function foo() {
      const foo = 2;
    }
  }]);
  return A;
}();

"#
);

// get_set_set_semantics_setter_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_setter_defined_on_parent,
    r#"

let value = 1;
class Base {
  set test(v) {
    value = v;
  }
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(value).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#,
    r#"


let value = 1;

let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    set: function (v) {
      value = v;
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.set()).toBe(3);
expect(value).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#
);

// get_set_call_semantics_not_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_not_defined_on_parent,
    r#"

class Base {
}

class Obj extends Base {
  call() {
    return super.test();
  }

  test() {
    throw new Error("gobbledygook");
  }
}

const obj = new Obj();
expect(() => {
  obj.call();

  // Asser that this throws, but that it's not
  // Obj.p.test's error that is thrown
}).toThrowError(TypeError)

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return  _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "call",
    value: function call() {
      return _get(_getPrototypeOf(Obj.prototype), "test", this).call(this);
    }
  }, {
    key: "test",
    value: function test() {
      throw new Error("gobbledygook");
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(() => {
  obj.call(); // Asser that this throws, but that it's not
  // Obj.p.test's error that is thrown
}).toThrowError(TypeError);

"#
);

// spec_derived_constructor_must_call_super_2_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_2_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    if (eval("false")) super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// exec_declaration

// spec_nested_object_super_property_in_key
test!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_object_super_property_in_key,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    const Inner = {
      [super.toString()]() {
        return 'hello';
      },
    };

    return Inner;
  }
}

expect(new Outer().hello()).toBe('hello');

"#,
    r#"


var Hello =
/*#__PURE__*/
function () {
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

var Outer =
/*#__PURE__*/
function (Hello) {
  "use strict";
  _inherits(Outer, Hello);
  var _super = _createSuper(Outer);
  function Outer() {
    _classCallCheck(this, Outer);
    var _this = _super.call(this);
    var Inner = {
      [_get((_assertThisInitialized(_this), _getPrototypeOf(Outer.prototype)), "toString", _this).call(_this)] () {
        return 'hello';
      }

    };
    return _possibleConstructorReturn(_this, Inner);
  }

  return Outer;
}(Hello);

expect(new Outer().hello()).toBe('hello');

"#
);

test!(
    syntax(),
    |t| tr(t),
    nested_this_in_key,
    r#"
class Outer extends B {
  constructor() {
    class Inner {
      [this]() {
        return 'hello';
      }
    }

    function foo() {
      return this;
    }

    return new Inner();
  }
}
"#,
    r#"
let Outer = function(B) {
  "use strict";
  _inherits(Outer, B);
  var _super = _createSuper(Outer);
  function Outer() {
      _classCallCheck(this, Outer);
      var _this;
      let Inner = function() {
          function Inner() {
              _classCallCheck(this, Inner);
          }
          _createClass(Inner, [
              {
                  key: _assertThisInitialized(_this),
                  value: function () {
                      return 'hello';
                  }
              }
          ]);
          return Inner;
      }();
      function foo() {
          return this;
      }
      return _possibleConstructorReturn(_this, new Inner());
  }
  return Outer;
}(B);
"#
);

// get_set_set_semantics_not_defined_on_parent_setter_on_obj_exec
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_setter_on_obj_exec,
    r#"

class Base {
}

let value = 2;
class Obj extends Base {
  set test(v) {
    value = v;
  }

  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(value).toBe(2);
expect(obj.test).toBe(3);

"#
);

// exec_expression

// spec_this_not_allowed_before_super_in_derived_classes_2_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_2_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    super(this);
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_super_reference_before_bare_super_inline_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_bare_super_inline_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    super.foo(super());
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// get_set_call_semantics_setter_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_setter_defined_on_parent,
    r#"

class Base {
  set test(v) {
    throw new Error("gobbledygook");
  }
}

class Obj extends Base {
  call() {
    return super.test();
  }

  test() {
    throw new Error("gobbledygook");
  }
}

const obj = new Obj();
expect(() => {
  obj.call();

  // Assert that this throws, but that it's not
  // a gobbledygook error that is thrown
}).toThrowError(TypeError)

"#,
    r#"


let Base =
/*#__PURE__*/
function () {
  "use strict";
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: "test",
    set: function (v) {
      throw new Error("gobbledygook");
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "call",
    value: function call() {
      return _get(_getPrototypeOf(Obj.prototype), "test", this).call(this);
    }
  }, {
    key: "test",
    value: function test() {
      throw new Error("gobbledygook");
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
expect(() => {
  obj.call(); // Assert that this throws, but that it's not
  // a gobbledygook error that is thrown
}).toThrowError(TypeError);

"#
);

// spec_super_class
test!(
    syntax(),
    |t| spec_tr(t),
    spec_super_class,
    r#"
class Test extends Foo { }

"#,
    r#"
var Test =
/*#__PURE__*/
function (Foo1) {
  "use strict";

  _inherits(Test, Foo1);
  var _super = _createSuper(Test);

  function Test() {
    _classCallCheck(this, Test);
    return _super.apply(this, arguments);
  }

  return Test;
}(Foo);

"#
);

// spec_super_call_only_allowed_in_derived_constructor

// spec_nested_object_super_call_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_object_super_call_in_key_exec,
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
    const Inner = {
      [super()]() {
        return 'hello';
      },
    };

    return Inner;
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_derived_constructor_must_call_super_2
test!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_2,
    r#"
class Foo extends Bar {
  constructor() {
    if (eval("false")) super();
  }
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

    if (eval("false")) _this = _super.call(this);
    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

// spec_derived_constructor_must_call_super_3
test!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_3,
    r#"
class Foo extends Bar {
  constructor() {
    const fn = () => super();
    fn();
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

    var fn = () => _this = _super.call(this)

    fn();
    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_3_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_3_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => this;
    fn();
    super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// get_set_set_semantics_not_defined_on_parent_data_on_obj
test!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_data_on_obj,
    r#"

class Base {
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "set",
    value: function set() {
      return _set(_getPrototypeOf(Obj.prototype), "test", 3, this, true);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#
);

// get_set_memoized_assign
test!(
    syntax(),
    |t| tr(t),
    get_set_memoized_assign,
    r#"

class Base {}
Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true,
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true,
});

let i = 0;
const proper = {
  get prop() {
    return i++;
  },
};

class Obj extends Base {
  assign() {
    super[proper.prop] += 1;
  }

  assign2() {
    super[i] += 1;
  }
}

const obj = new Obj();

obj.assign();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);

obj.assign2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};


Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true
});
let i = 0;
const proper = {
  get prop() {
    return i++;
  }

};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "assign",
    value: function assign() {
      var _prop;

      _set(_getPrototypeOf(Obj.prototype), _prop = proper.prop, _get(_getPrototypeOf(Obj.prototype), _prop, this) + 1, this, true);
    }
  }, {
    key: "assign2",
    value: function assign2() {
      var _i;

      _set(_getPrototypeOf(Obj.prototype), _i = i, _get(_getPrototypeOf(Obj.prototype), _i, this) + 1, this, true);
    }
  }]);

  return Obj;
}(Base);

const obj = new Obj();
obj.assign();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);
obj.assign2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#
);

// spec_nested_class_super_property_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_class_super_property_in_key_exec,
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
      [super.toString()]() {
        return 'hello';
      }
    }

    return new Inner();
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_relaxed_method_coercion
test!(
    syntax(),
    |t| spec_tr(t),
    spec_relaxed_method_coercion,
    r#"
// #1649

class Foo {
  [Symbol()]() {}
  [Symbol()]() {}
}

"#,
    r#"
// #1649
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: Symbol(),
    value: function () {}
  }, {
    key: Symbol(),
    value: function () {}
  }]);
  return Foo;
}();

"#
);

// spec_derived_constructor_must_call_super_3_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_3_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => super();
    fn();
  }
}

new Foo();

"#
);

// spec_computed_methods_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_computed_methods_exec,
    r#"
const sym = Symbol();

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

let i = new Bar();

expect(i[sym]()).toBe(3);

"#
);

// spec_derived_constructor_must_call_super_4
test!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_4,
    r#"
class Foo extends Bar {
  constructor() {
    const fn = () => super();
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


    var fn = () => _this = _super.call(this)

    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);

"#
);

// spec_super_class_id_member_expression
test!(
    syntax(),
    |t| spec_tr(t),
    spec_super_class_id_member_expression,
    r#"
class BaseController extends Chaplin.Controller {

}

class BaseController2 extends Chaplin.Controller.Another {

}

"#,
    r#"
var BaseController =
/*#__PURE__*/
function (_Controller) {
  "use strict";

  _inherits(BaseController, _Controller);
  var _super = _createSuper(BaseController);
  function BaseController() {
    _classCallCheck(this, BaseController);
    return _super.apply(this, arguments);
  }

  return BaseController;
}(Chaplin.Controller);

var BaseController2 =
/*#__PURE__*/
function (_Another) {
  "use strict";

  _inherits(BaseController2, _Another);
  var _super = _createSuper(BaseController2);
  function BaseController2() {
    _classCallCheck(this, BaseController2);
    return _super.apply(this, arguments);
  }

  return BaseController2;
}(Chaplin.Controller.Another);

"#
);

// spec_delay_arrow_function_for_bare_super_derived
test!(
    syntax(),
    |t| spec_tr(t),
    spec_delay_arrow_function_for_bare_super_derived,
    r#"
class Foo extends Bar {
  constructor() {
    super(() => {
      this.test;
    });
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

    _this = _super.call(this, () => {
      _this.test;
    });
    return _this;
  }

  return Foo;
}(Bar);

"#
);

// extend_builtins_overwritten_null

// spec_default_super_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_default_super_exec,
    r#"
class Test {
  constructor() {
    return super.constructor;
  }

  static test() {
    return super.constructor;
  }
}

// Instances
expect(Object.getPrototypeOf(Test.prototype)).toBe(Object.prototype);
expect(new Test()).toBe(Object);

// Static
expect(Object.getPrototypeOf(Test)).toBe(Function.prototype);
expect(Test.test()).toBe(Function);

"#
);

// spec_super_reference_before_in_lambda_3_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_in_lambda_3_exec,
    r#"
class Bar {
  test() {}
}

class Foo extends Bar {
  constructor() {
    const t = () => super.test()
    super();
    t();
  }
}

new Foo();

"#
);

// regression

// get_set_get_semantics_not_defined_on_parent
test!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_not_defined_on_parent,
    r#"

class Base {
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#,
    r#"


let Base = function Base() {
  "use strict";
  _classCallCheck(this, Base);
};

let Obj =
/*#__PURE__*/
function (Base) {
  "use strict";
  _inherits(Obj, Base);
  var _super = _createSuper(Obj);
  function Obj() {
    _classCallCheck(this, Obj);

    return _super.apply(this, arguments);
  }

  _createClass(Obj, [{
    key: "get",
    value: function get() {
      return _get(_getPrototypeOf(Obj.prototype), "test", this);
    }
  }]);

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#
);

// extend_builtins_super_called

// spec_plain_class
test!(
    syntax(),
    |t| spec_tr(t),
    spec_plain_class,
    r#"
class Test { }

"#,
    r#"
var Test = function Test() {
  "use strict";

  _classCallCheck(this, Test);
};

"#
);

// spec_super_reference_before_bare_super_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_bare_super_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    super.foo();
    super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_super_reference_before_in_lambda_2_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_in_lambda_2_exec,
    r#"
class Bar {
  test() {}
}

class Foo extends Bar {
  constructor() {
    const t = () => super.test()
    t();
    super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_derived_constructor_must_call_super_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {

  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// exec_return

// spec_export_super_class
test!(
    syntax(),
    |t| spec_tr(t),
    spec_export_super_class,
    r#"
export default class extends A {}

"#,
    r#"
var _default =
/*#__PURE__*/
function (A1) {
  "use strict";
  _inherits(_default, A1);
  var _super = _createSuper(_default);
  function _default() {
    _classCallCheck(this, _default);
    return _super.apply(this, arguments);
  }

  return _default;
}(A);

export { _default as default };

"#
);

// extend_builtins_wrap_native_super_exec
test_exec!(
    syntax(),
    |t| tr(t),
    extend_builtins_wrap_native_super_exec,
    r#"
// basic sanity check to confirm the external wrapNativeSuper helper works

class Test1 extends Array {
  name() {
    return 'test1';
  }
}

class Test2 extends Array {
  name() {
    return 'test2';
  }
}

var t1 = new Test1();
var t2 = new Test2();

expect(Test1).not.toBe(Test2);
expect(t1).not.toBe(t2);
expect(t1.name()).toBe('test1');
expect(t2.name()).toBe('test2');
expect(t1).toBeInstanceOf(Test1);
expect(t2).toBeInstanceOf(Test2);
expect(t1).toBeInstanceOf(Array);
expect(t2).toBeInstanceOf(Array);

"#
);

// spec_super_reference_in_prop_expression_exec
test_exec!(
    // babel also fails on this
    ignore,
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_in_prop_exression_exec,
    r#"
let called = false;

class A {
  method() {
    called = true;
  }

  get methodName() {
    return "method";
  }
}

class B extends A {
  constructor() {
    super[super().methodName]()
  }
}

new B();
expect(called).toBe(true);

"#
);

// extend_builtins_imported_babel_plugin_transform_builtin_classes

// get_set_set_semantics_getter_defined_on_parent_exec
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_getter_defined_on_parent_exec,
    r#"

let called = false;
class Base {
  get test() {
    called = true;
    return 1;
  }
};

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(() => {
  obj.set();
}).toThrow();
expect(called).toBe(false);
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#
);

test!(
    syntax(),
    |t| spec_tr(t),
    issue_454_followup,
    "if (true){
    class Foo extends Bar { }
}",
    "if (true) {
    var Foo = function(Bar) {
        \"use strict\";
        _inherits(Foo, Bar);
        var _super = _createSuper(Foo);
        function Foo() {
            _classCallCheck(this, Foo);
            return _super.apply(this, arguments);
        }
        return Foo;
    }(Bar);
}"
);

test!(
    syntax(),
    |t| spec_tr(t),
    issue_454_followup_2,
    "function broken(x, ...foo) {
  if (true) {
    class Foo extends Bar { }
    return hello(...foo)
  }
}",
    "function broken(x, ...foo) {
    if (true) {
        var Foo = function(Bar) {
            \"use strict\";
            _inherits(Foo, Bar);
            var _super = _createSuper(Foo);
            function Foo() {
                _classCallCheck(this, Foo);
                return _super.apply(this, arguments);
            }
            return Foo;
        }(Bar);
        return hello.apply(void 0, _toConsumableArray(foo));
    }
}"
);

test!(
    syntax(),
    |t| chain!(
        resolver(Mark::new(), Mark::new(), false),
        classes(Some(t.comments.clone()), Default::default())
    ),
    duplicate_ident,
    r#"
class Foo extends Bar {
  constructor() {
    var Foo = 123;
    console.log(Foo)
  }
}
"#,
    r#"
let Foo = /*#__PURE__*/function (Bar) {
  "use strict";
  _inherits(Foo, Bar);

  var _super = _createSuper(Foo);

  function Foo() {
    _classCallCheck(this, Foo);
    var _this;

    var Foo1 = 123;
    console.log(Foo1)

    return _possibleConstructorReturn(_this);
  }

  return Foo;
}(Bar);
"#
);

//// regression_3028
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_3028,
//    r#"
//class b {
//}
//
//class a1 extends b {
//  constructor() {
//    super();
//    this.x = () => this;
//  }
//}
//
//export default class a2 extends b {
//  constructor() {
//    super();
//    this.x = () => this;
//  }
//}
//
//"#,
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var b = function b() {
//  _classCallCheck(this, b);
//};
//
//var a1 =
// /*#__PURE__*/
//function (_b) {
//  _inherits(a1, _b);
//
//  function a1() {
//    var _this;
//
//    _classCallCheck(this, a1);
//    _this = _possibleConstructorReturn(this, _getPrototypeOf(a1).call(this));
//
//    _this.x = function () {
//      return _assertThisInitialized(_this);
//    };
//
//    return _this;
//  }
//
//  return a1;
//}(b);
//
//var a2 =
// /*#__PURE__*/
//function (_b2) {
//  _inherits(a2, _b2);
//
//  function a2() {
//    var _this2;
//
//    _classCallCheck(this, a2);
//    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(a2).call(this));
//
//    _this2.x = function () {
//      return _assertThisInitialized(_this2);
//    };
//
//    return _this2;
//  }
//
//  return a2;
//}(b);
//
//exports["default"] = a2;
//
//"#
//);

//// regression_t2997
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_t2997,
//    r#"
//class A {}
//
//class B extends A {
//  constructor() {
//    return super();
//  }
//}
//
//"#,
//    r#"
//var A = function A() {
//  "use strict";
//
//  _classCallCheck(this, A);
//};
//
//var B =
// /*#__PURE__*/
//function (A) {
//  "use strict";
//
//  _inherits(B, A);
//
//  function B() {
//    var _this;
//
//    _classCallCheck(this, B);
//    return _possibleConstructorReturn(_this, _this =
// _possibleConstructorReturn(this, _getPrototypeOf(B).call(this)));  }
//
//  return B;
//}(A);
//
//"#
//);

// extend_builtins_shadowed
test!(
    // Cost is too high while being useless
    ignore,
    syntax(),
    |t| tr(t),
    extend_builtins_shadowed,
    r#"
class Array {}

class List extends Array {}
"#,
    r#"
let Array = function Array() {
  "use strict";

  _classCallCheck(this, Array);
};

let List =
/*#__PURE__*/
function (Array) {
  "use strict";

  _inherits(List, Array);

  function List() {
    _classCallCheck(this, List);
    return _possibleConstructorReturn(this, _getPrototypeOf(List).apply(this, arguments));
  }

  return List;
}(Array);

"#
);

//// regression_2694
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [],
//  "presets": ["env"]
//}
//"#),
//    regression_2694,
//    r#"
//import BaseFoo from './BaseFoo';
//
//export default class SubFoo extends BaseFoo {
//  static talk() {
//    super.talk();
//    console.log('SubFoo.talk');
//  }
//}
//
//"#,
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var BaseFoo2 = _interopRequireDefault(require("./BaseFoo"));
//
//var SubFoo =
// /*#__PURE__*/
//function (BaseFoo) {
//  _inherits(SubFoo, BaseFoo);
//
//  function SubFoo() {
//    _classCallCheck(this, SubFoo);
//    return _possibleConstructorReturn(this,
// _getPrototypeOf(SubFoo).apply(this, arguments));  }
//
//  _createClass(SubFoo, null, [{
//    key: "talk",
//    value: function talk() {
//      _get(_getPrototypeOf(SubFoo), "talk", this).call(this);
//      console.log('SubFoo.talk');
//    }
//  }]);
//  return SubFoo;
//}(BaseFoo2["default"]);
//
//exports["default"] = SubFoo;
//
//"#
//);

//// regression_t2494
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_t2494,
//    r#"
//var x = {
//  Foo: class extends Foo {}
//};
//
//"#,
//    r#"
//var x = {
//  Foo:
//  /*#__PURE__*/
//  function (Foo) {
//    "use strict";
//
//    _inherits(_class, Foo);
//
//    function _class() {
//      _classCallCheck(this, _class);
//      return _possibleConstructorReturn(this,
// _getPrototypeOf(_class).apply(this, arguments));    }
//
//    return _class;
//  }(Foo)
//};
//
//"#
//);

// extend_builtins_imported_babel_plugin_transform_builtin_classes
test_exec!(
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    extend_builtins_imported_babel_plugin_transform_builtin_classes_exec,
    r#"
// Imported from
// https://github.com/WebReflection/babel-plugin-transform-builtin-classes/blob/85efe1374e1c59a8323c7eddd4326f6c93d9f64f/test/test.js

class List extends Array {
  constructor(value) {
    super().push(value);
  }
  push(value) {
    super.push(value);
    return this;
  }
}

expect(new List(1)).toBeInstanceOf(List);
expect(new List(2)).toBeInstanceOf(Array);

var l = new List(3);
expect(l).toHaveLength(1);
expect(l[0]).toBe(3);
expect(l.push(4)).toBe(l);
expect(l).toHaveLength(2);
expect(l.join()).toBe('3,4');

class SecondLevel extends List {
  method() {
    return this;
  }
}

expect(new SecondLevel(1)).toBeInstanceOf(SecondLevel);
expect(new SecondLevel(2)).toBeInstanceOf(List);
expect(new SecondLevel(3)).toBeInstanceOf(Array);

var s = new SecondLevel(4);
expect(s).toHaveLength(1);
expect(s[0]).toBe(4);
expect(s.push(5)).toBe(s);
expect(s).toHaveLength(2);
expect(s.join()).toBe('4,5');
expect(s.method()).toBe(s);

"#
);

// get_set_call_semantics_setter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_setter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  set test(v) {
    throw new Error("gobbledygook");
  }
}

class Obj extends Base {
  call() {
    return super.test();
  }

  test() {
    throw new Error("gobbledygook");
  }
}

const obj = new Obj();
expect(() => {
  obj.call();

  // Asser that this throws, but that it's not
  // a gobbledygook error that is thrown
}).toThrowError(TypeError)

"#
);

// get_set_call_semantics_not_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_not_defined_on_parent_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  call() {
    return super.test();
  }

  test() {
    throw new Error("gobbledygook");
  }
}

const obj = new Obj();
expect(() => {
  obj.call();

  // Asser that this throws, but that it's not
  // Obj.p.test's error that is thrown
}).toThrowError(TypeError)

"#
);

// get_set_set_semantics_not_defined_on_parent_getter_on_obj
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_getter_on_obj_exec,
    r#"
"use strict";
class Base {
}

let called = false;
class Obj extends Base {
  get test() {
    called = true;
  }

  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(called).toBe(false);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#
);

//// regression_t6712
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_t6712,
//    r#"
//class A {
//  foo() {
//    const foo = 2;
//  }
//}
//
//"#,
//    r#"
//var A =
// /*#__PURE__*/
//function () {
//  "use strict";
//
//  function A() {
//    _classCallCheck(this, A);
//  }
//
//  _createClass(A, [{
//    key: "foo",
//    value: function foo() {
//      var foo = 2;
//    }
//  }]);
//  return A;
//}();
//
//"#
//);

// get_set_set_semantics_not_defined_on_parent_data_on_obj
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_data_on_obj_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#
);

//// regression_2663
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_2663,
//    r#"
//import net from 'net';
//import { EventEmitter } from 'events';
//import BinarySerializer from './helpers/binary-serializer';
//// import ...
//
//export default class Connection extends EventEmitter {
//    constructor(endpoint, joinKey, joinData, roomId) {
//        super();
//
//        this.isConnected = false;
//        this.roomId = roomId;
//
//        // ...
//    }
//
//    send(message) {
//        this.sock.write(BinarySerializer.serializeMessage(message));
//    }
//
//    disconnect() {
//        this.sock.close();
//    }
//}
//
//"#,
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var _net = _interopRequireDefault(require("net"));
//
//var _events = require("events");
//
//var _binarySerializer =
// _interopRequireDefault(require("./helpers/binary-serializer"));
//
//// import ...
//var Connection =
// /*#__PURE__*/
//function (_EventEmitter) {
//  _inherits(Connection, _EventEmitter);
//
//  function Connection(endpoint, joinKey, joinData, roomId) {
//    var _this;
//
//    _classCallCheck(this, Connection);
//    _this = _possibleConstructorReturn(this,
// _getPrototypeOf(Connection).call(this));    _this.isConnected = false;
//    _this.roomId = roomId; // ...
//
//    return _this;
//  }
//
//  _createClass(Connection, [{
//    key: "send",
//    value: function send(message) {
//      this.sock.write(_binarySerializer["default"].serializeMessage(message));
//    }
//  }, {
//    key: "disconnect",
//    value: function disconnect() {
//      this.sock.close();
//    }
//  }]);
//  return Connection;
//}(_events.EventEmitter);
//
//exports["default"] = Connection;
//
//"#
//);

// extend_builtins_spec
test_exec!(
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    extend_builtins_spec_exec,
    r#"
class List extends Array {}

expect(new List).toBeInstanceOf(List);
expect(new List).toBeInstanceOf(Array);

"#
);

// get_set_call_semantics_data_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_data_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  test(...args) {
    expect(this).toBe(obj);
    expect(args).toEqual([1, 2, 3]);
    return 1;
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#
);

// get_set_memoized_assign
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_memoized_assign_exec,
    r#"
"use strict";
class Base {}
Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true,
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true,
});

let i = 0;
const proper = {
  get prop() {
    return i++;
  },
};

class Obj extends Base {
  assign() {
    super[proper.prop] += 1;
  }

  assign2() {
    super[i] += 1;
  }
}

const obj = new Obj();

obj.assign();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);

obj.assign2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#
);

//// regression_5769
//test_exec!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_5769_exec,
//    r#"
//class Point {
//  getX() {
//    expect(this.x).toBe(3); // C
//  }
//}
//
//class ColorPoint extends Point {
//  constructor() {
//    super();
//    this.x = 2;
//    super.x = 3;
//    expect(this.x).toBe(3);   // A
//    expect(super.x).toBeUndefined();  // B
//  }
//
//  m() {
//    this.getX()
//  }
//}
//
//const cp = new ColorPoint();
//cp.m();
//
//"#
//);

// get_set_get_semantics_setter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_setter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  set test(v) {
    throw new Error("called");
  }
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#
);

//// regression_t7537
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": ["transform-exponentiation-operator"],
//  "presets": ["env"]
//}
//"#),
//    regression_t7537,
//    r#"
//class B{}
//class A extends B{
//  constructor(track){
//    if (track !== undefined) super(track);
//    else super();
//  }
//}
//
//"#,
//    r#"
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
//function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ?
// Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ ||
// Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
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
//function _classCallCheck(instance, Constructor) { if (!(instance instanceof
// Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
//var B = function B() {
//  "use strict";
//
//  _classCallCheck(this, B);
//};
//
//var A =
// /*#__PURE__*/
//function (_B) {
//  "use strict";
//
//  _inherits(A, _B);
//
//  function A(track) {
//    var _this;
//
//    _classCallCheck(this, A);
//
//    if (track !== undefined) _this = _possibleConstructorReturn(this,
// _getPrototypeOf(A).call(this, track));else _this =
// _possibleConstructorReturn(this, _getPrototypeOf(A).call(this));
//    return _possibleConstructorReturn(_this);
//  }
//
//  return A;
//}(B);
//
//"#
//);

// regression_t7010
test!(
    // TODO: Unignore this
    ignore,
    syntax(),
    |t| chain!(tr(t), block_scoping()),
    regression_t7010,
    r#"
class Foo {
  constructor(val){
    this._val = val;
  }
  foo2(){
    return foo2(this._val);
  }
}

"#,
    r#"
var Foo =
/*#__PURE__*/
function () {
  "use strict";

  function Foo(val) {
    _classCallCheck(this, Foo);
    this._val = val;
  }

  _createClass(Foo, [{
    key: "foo2",
    value: function (_foo) {
      function foo2() {
        return _foo.apply(this, arguments);
      }

      foo2.toString = function () {
        return _foo.toString();
      };

      return foo2;
    }(function () {
      return foo2(this._val);
    })
  }]);
  return Foo;
}();

"#
);

//// regression_2941
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env", "react"]
//}
//"#),
//    regression_2941,
//    r#"
//export default class {}
//
//"#,
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var _default = function _default() {
//  _classCallCheck(this, _default);
//};
//
//exports["default"] = _default;
//
//"#
//);

// get_set_call_semantics_getter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_getter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  get test() {
    expect(this).toBe(obj);
    return function(...args) {
      expect(this).toBe(obj);
      expect(args).toEqual([1, 2, 3]);
      return 1;
    };
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#
);

// get_set_set_semantics_data_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_data_defined_on_parent_exec,
    r#"
"use strict";
class Base  {
}
Object.defineProperty(Base.prototype, 'test', {
  value: 1,
  writable: true,
  configurable: true,
});

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#
);

// get_set_get_semantics_getter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_getter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  get test() {
    expect(this).toBe(obj);
    return 1;
  }
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#
);

// get_set_memoized_update
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_memoized_update_exec,
    r#"
"use strict";
class Base {}
Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true,
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true,
});

let i = 0;
const proper = {
  get prop() {
    return i++;
  },
};

class Obj extends Base {
  update() {
    super[proper.prop]++;
  }

  update2() {
    super[i]++;
  }
}

const obj = new Obj();

obj.update();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);

obj.update2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#
);

// get_set_get_semantics_not_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_not_defined_on_parent_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#
);

// get_set_set_semantics_not_defined_on_parent_not_on_obj
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_not_on_obj_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#
);

// extend_builtins_builtin_objects_throw_when_wrapped
test_exec!(
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    extend_builtins_builtin_objects_throw_when_wrapped_exec,
    r#"
// JSON is wrapped because it starts with an uppercase letter, but it
// should not be possible to extend it anyway.

expect(() => class BetterJSON extends JSON {}).toThrow();

"#
);

// get_set_get_semantics_data_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_data_defined_on_parent_exec,
    r#"
"use strict";
class Base {
}
Object.defineProperty(Base.prototype, 'test', {
  value: 1,
  writable: true,
  configurable: true,
});

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#
);

// extend_builtins_overwritten_null
test_exec!(
    // Just don't do this.
    ignore,
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    extend_builtins_overwritten_null_exec,
    r#"
var env = {
  Array: null,
};

// We need to use "with" to avoid leaking the modified Array to other tests.
with (env) {
  class List extends Array {}
  expect(List.prototype.__proto__).toBeUndefined();
}

"#
);

// extend_builtins_super_called
test_exec!(
    // Just don't do this. With is evil.
    ignore,
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        block_scoping()
    ),
    extend_builtins_super_called_exec,
    r#"
var called = false;

var env = {
  Array: function Array() {
    called = true;
  }
};

// We need to use "with" to avoid leaking the modified Array to other tests.
with (env) {
  class List extends Array {};
  new List();

  expect(called).toBe(true);
}

"#
);

test_exec!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_846,
    r#"
class SomeClass {
  someMethod() {
     return 1;
  }
}

class OtherClass extends SomeClass {
  anotherMethod() {
    expect(super.someMethod()).toBe(1);
    return 2;
  }
}

const obj = new OtherClass();
expect(obj.anotherMethod()).toBe(2);
"#
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1490_1,
    "
    class ColouredCanvasElement extends CanvasElement {
      createFacets(hidden) {
        hidden = super.createFacets(hidden);
      }
    }
    ",
    "
    let ColouredCanvasElement = function (CanvasElement) {
        \"use strict\";
        _inherits(ColouredCanvasElement, CanvasElement);
        var _super = _createSuper(ColouredCanvasElement);
        function ColouredCanvasElement() {
            _classCallCheck(this, ColouredCanvasElement);
            return _super.apply(this, arguments);
        }
        _createClass(ColouredCanvasElement, [
            {
                key: \"createFacets\",
                value: function createFacets(hidden) {
                    hidden = _get(_getPrototypeOf(ColouredCanvasElement.prototype), \
     \"createFacets\", this).call(this, hidden);
                }
            }
        ]);
        return ColouredCanvasElement;
    }(CanvasElement);
    "
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1490_2,
    "
  class ColouredCanvasElement extends CanvasElement {
    createFacets(hidden) {
      super.createFacets(hidden);
    }
  }
  ",
    "
  let ColouredCanvasElement = function (CanvasElement) {
      \"use strict\";
      _inherits(ColouredCanvasElement, CanvasElement);
      var _super = _createSuper(ColouredCanvasElement);
      function ColouredCanvasElement() {
          _classCallCheck(this, ColouredCanvasElement);
          return _super.apply(this, arguments);
      }
      _createClass(ColouredCanvasElement, [
          {
              key: \"createFacets\",
              value: function createFacets(hidden) {
                  _get(_getPrototypeOf(ColouredCanvasElement.prototype), \"createFacets\", \
     this).call(this, hidden);
              }
          }
      ]);
      return ColouredCanvasElement;
  }(CanvasElement);
  "
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    super_binding,
    "
  class Foo {}
  class Test extends Foo {
    foo() {
      console.log(Foo)
    }
  }
  ",
    "
  let Foo = function Foo() {
    \"use strict\";
    _classCallCheck(this, Foo);
  };
  let Test = function(Foo1) {
    \"use strict\";
    _inherits(Test, Foo1);
    var _super = _createSuper(Test);
    function Test() {
        _classCallCheck(this, Test);
        return _super.apply(this, arguments);
    }
    _createClass(Test, [
        {
            key: \"foo\",
            value: function foo() {
                console.log(Foo);
            }
        }
    ]);
    return Test;
  }(Foo);
  "
);

test_exec!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    super_binding_exec,
    "
  class Foo {}
  class Test extends Foo {
    foo() {
      return 3;
    }
  }
  Foo = 3;
  expect(new Test().foo()).toBe(3);
  "
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1617_1,
    "
    class A extends B {
      foo() {
        super.foo(), bar();
      }
    }
    ",
    r#"
    let A = function(B) {
      "use strict";
      _inherits(A, B);
      var _super = _createSuper(A);
      function A() {
          _classCallCheck(this, A);
          return _super.apply(this, arguments);
      }
      _createClass(A, [
          {
              key: "foo",
              value: function foo() {
                  _get(_getPrototypeOf(A.prototype), "foo", this).call(this), bar();
              }
          }
      ]);
      return A;
  }(B);
    "#
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1617_2,
    "
  class A extends B {
    foo() {
      super.foo();
    }
  }
  ",
    r#"
    let A = function(B) {
      "use strict";
      _inherits(A, B);
      var _super = _createSuper(A);
      function A() {
          _classCallCheck(this, A);
          return _super.apply(this, arguments);
      }
      _createClass(A, [
          {
              key: "foo",
              value: function foo() {
                  _get(_getPrototypeOf(A.prototype), "foo", this).call(this);
              }
          }
      ]);
      return A;
  }(B);
    "#
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1660_1,
    "
    class A {

    }
    ",
    "
    let A = function A() {
      \"use strict\";
      _classCallCheck(this, A);
    };
  "
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    constructor_super_update,
    "
class A extends B {
  constructor() {
    super.foo ++;
    super.bar += 123;
    super[baz] --;
    super[quz] -= 456;
  }
}
  ",
    r#"
let A = function(B) {
  "use strict";
  _inherits(A, B);
  var _super = _createSuper(A);
  function A() {
      _classCallCheck(this, A);
      var _super_foo, _baz, _super_baz, _quz;
      var _this;
      _set((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), "foo", (_super_foo = +_get((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), "foo", _this)) + 1, _this, true), _super_foo;
      _set((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), "bar", _get((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), "bar", _this) + 123, _this, true);
      _set((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), _baz = baz, (_super_baz = +_get((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), _baz, _this)) - 1, _this, true), _super_baz;
      _set((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), _quz = quz, _get((_assertThisInitialized(_this), _getPrototypeOf(A.prototype)), _quz, _this) - 456, _this, true);
      return _possibleConstructorReturn(_this);
  }
  return A;
}(B);
"#
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    prefix_super_update,
    "
class A extends B {
  foo() {
    --super[baz];
  }
}
",
    r#"
let A = function(B) {
  "use strict";
  _inherits(A, B);
  var _super = _createSuper(A);
  function A() {
      _classCallCheck(this, A);
      return _super.apply(this, arguments);
  }
  _createClass(A, [
    {
        key: "foo",
        value: function foo() {
            var _baz;
            _set(_getPrototypeOf(A.prototype), _baz = baz, _get(_getPrototypeOf(A.prototype), _baz, this) - 1, this, true);
        }
    }
  ]);
  return A;
}(B);
"#
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1660_2,
    "
    const foo = class {run(){}};
    ",
    "
    const foo = function() {
        \"use strict\";
        function _class() {
            _classCallCheck(this, _class);
        }
        _createClass(_class, [
            {
                key: \"run\",
                value: function run() {
                }
            }
        ]);
        return _class;
    }();
    "
);

test!(
    syntax(),
    |t| classes(Some(t.comments.clone()), Default::default()),
    issue_1660_3,
    "
    console.log(class { run() { } });
    ",
    "
    console.log(function() {
        \"use strict\";
        function _class() {
            _classCallCheck(this, _class);
        }
        _createClass(_class, [
            {
                key: \"run\",
                value: function run() {
                }
            }
        ]);
        return _class;
    }());
  "
);

test!(
    syntax(),
    |t| {
        let global_mark = Mark::fresh(Mark::root());

        chain!(
            es2022::es2022(Some(t.comments.clone()), Default::default()),
            es2018::es2018(Default::default()),
            es2017::es2017(Default::default()),
            es2016::es2016(),
            es2015::es2015(
                global_mark,
                Some(t.comments.clone()),
                es2015::Config {
                    ..Default::default()
                }
            ),
        )
    },
    issue_1660_4,
    "
  console.log(class { run() { } });
  ",
    "
    console.log(function() {
        \"use strict\";
        function _class() {
            _classCallCheck(this, _class);
        }
        _createClass(_class, [
            {
                key: \"run\",
                value: function run() {
                }
            }
        ]);
        return _class;
    }());
  "
);

test!(
    syntax(),
    |t| {
        let global_mark = Mark::fresh(Mark::root());

        chain!(
            class_properties(Some(t.comments.clone()), Default::default()),
            es2015::es2015(
                global_mark,
                Some(t.comments.clone()),
                es2015::Config {
                    ..Default::default()
                }
            ),
        )
    },
    issue_1660_5,
    "
    console.log(class { run() { } });
    ",
    "
    console.log(function() {
      \"use strict\";
      function _class() {
          _classCallCheck(this, _class);
      }
      _createClass(_class, [
          {
              key: \"run\",
              value: function run() {
              }
          }
      ]);
      return _class;
  }());
    "
);

test!(
    syntax(),
    |t| tr(t),
    issue_1838,
    r#"
    class Foo {
      let() {}
    }
"#,
    r#"
    let Foo = /*#__PURE__*/ function() {
      "use strict";
      function Foo() {
          _classCallCheck(this, Foo);
      }
      _createClass(Foo, [
          {
              key: "let",
              value: function _let() {
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
    issue_1799_1,
    "
    export default function Foo() {
      return call(async (e) => { await doSomething(); })
    }
    ",
    "
    export default function Foo() {
      return call(async (e)=>{
          await doSomething();
      });
    }
    "
);

test!(
    syntax(),
    |t| {
        let global_mark = Mark::fresh(Mark::root());

        chain!(
            class_properties(Some(t.comments.clone()), Default::default()),
            es2015::es2015(
                global_mark,
                Some(t.comments.clone()),
                es2015::Config {
                    ..Default::default()
                }
            ),
        )
    },
    issue_1959_1,
    "
    class Extended extends Base {
      getNext() {
        return super.getNext(114514) + 114514
      }
    }
    ",
    "
var Extended = function(Base) {
    \"use strict\";
    _inherits(Extended, Base);
    var _super = _createSuper(Extended);
    function Extended() {
        _classCallCheck(this, Extended);
        return _super.apply(this, arguments);
    }
    _createClass(Extended, [
        {
            key: \"getNext\",
            value: function getNext() {
                return _get(_getPrototypeOf(Extended.prototype), \"getNext\", this).call(this, \
     114514) + 114514;
            }
        }
    ]);
    return Extended;
}(Base);
    "
);

test!(
    syntax(),
    |t| {
        let global_mark = Mark::fresh(Mark::root());

        chain!(
            class_properties(Some(t.comments.clone()), Default::default()),
            es2015::es2015(
                global_mark,
                Some(t.comments.clone()),
                es2015::Config {
                    ..Default::default()
                }
            ),
        )
    },
    issue_1959_2,
    "
    class Extended extends Base {
      getNext() {
        return super.getNext(114514)
      }
    }
    ",
    "
var Extended = function(Base) {
    \"use strict\";
    _inherits(Extended, Base);
    var _super = _createSuper(Extended);
    function Extended() {
        _classCallCheck(this, Extended);
        return _super.apply(this, arguments);
    }
    _createClass(Extended, [
        {
            key: \"getNext\",
            value: function getNext() {
                return _get(_getPrototypeOf(Extended.prototype), \"getNext\", this).call(this, \
     114514);
            }
        }
    ]);
    return Extended;
}(Base);
    "
);

#[testing::fixture("tests/classes/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(&input).unwrap();
    compare_stdout(
        Default::default(),
        |t| {
            chain!(
                class_properties(Some(t.comments.clone()), Default::default()),
                classes(Some(t.comments.clone()), Default::default())
            )
        },
        &src,
    );
}

#[testing::fixture("tests/classes/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.parent().unwrap().join("output.js");

    test_fixture(
        Default::default(),
        &|t| {
            chain!(
                class_properties(Some(t.comments.clone()), Default::default()),
                classes(Some(t.comments.clone()), Default::default())
            )
        },
        &input,
        &output,
    );
}

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_class,
    r#"
class Test extends Foo {
  constructor() {
    woops.super.test();
    super();
    super.test();

    super(...arguments);
    super("test", ...arguments);

    super.test(...arguments);
    super.test("test", ...arguments);
  }
}
"#,
    r#"
let Test = /*#__PURE__*/function (Foo) {
"use strict";

_inherits(Test, Foo);

var _super = _createSuper(Test);

function Test() {
  _classCallCheck(this, Test);
  var _this;
  woops.super.test();
  _this = _super.call(this);
  Foo.prototype.test.call(_assertThisInitialized(_this));
  _this = _super.call(this, ...arguments);
  _this = _super.call(this, "test", ...arguments);
  Foo.prototype.test.apply(_assertThisInitialized(_this), arguments);
  Foo.prototype.test.call(_assertThisInitialized(_this), "test", ...arguments);
  return _this;
}

return Test;
}(Foo);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_property,
    r#"
class Test extends Foo {
  constructor() {
    super();
    super.test;
    super.test.whatever;
  }
}
"#,
    r#"
let Test = /*#__PURE__*/function (Foo) {
  "use strict";

  _inherits(Test, Foo);

  var _super = _createSuper(Test);

  function Test() {
    _classCallCheck(this, Test);
    var _this = _super.call(this);
    Foo.prototype.test;
    Foo.prototype.test.whatever;
    return _this;
  }

  return Test;
}(Foo);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_call,
    r#"
class Test extends Foo {
  constructor() {
    super();
    super.test.whatever();
    super.test();
  }

  static test() {
    return super.wow();
  }
}
"#,
    r#"
let Test = /*#__PURE__*/function (Foo) {
  "use strict";

  _inherits(Test, Foo);

  var _super = _createSuper(Test);

  function Test() {
    _classCallCheck(this, Test);
    var _this = _super.call(this);

    Foo.prototype.test.whatever();

    Foo.prototype.test.call(_assertThisInitialized(_this));

    return _this;
  }

  _createClass(Test, null, [{
    key: "test",
    value: function test() {
      return Foo.wow.call(this);
    }
  }]);
  return Test;
}(Foo);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_default,
    r#"
class Test {
  constructor() {
    super.hasOwnProperty("test");
    return super.constructor;
  }

  static test() {
    return super.constructor;
  }
}
"#,
    r#"
let Test = /*#__PURE__*/function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
    Object.prototype.hasOwnProperty.call(this, "test");
    return Object.prototype.constructor;
  }

  _createClass(Test, null, [{
    key: "test",
    value: function test() {
      return Function.prototype.constructor;
    }
  }]);
  return Test;
}();
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            constant_super: true,
            ..Default::default()
        }
    ),
    constant_super_update,
    r#"
class A extends B {
  constructor() {
    super.foo ++;
    super.bar += 123;
    super[baz] --;
    super[quz] -= 456
  }
}
"#,
    r#"
let A = function(B) {
  "use strict";
  _inherits(A, B);
  var _super = _createSuper(A);
  function A() {
    _classCallCheck(this, A);
    var _super_foo, _baz, _super_baz, _quz;
    var _this;
    _this.foo = (_super_foo = +B.prototype.foo) + 1, _super_foo;
    _this.bar = B.prototype.bar + 123;
    _this[_baz = baz] = (_super_baz = +B.prototype[_baz]) - 1, _super_baz;
    _this[_quz = quz] = B.prototype[_quz] - 456;
    return _possibleConstructorReturn(_this);
  }
  return A;
}(B);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            no_class_calls: true,
            ..Default::default()
        }
    ),
    no_class_call,
    "class A {}",
    r#"
let A = function A() {
  "use strict";
};
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            no_class_calls: true,
            ..Default::default()
        }
    ),
    no_class_call_constructor,
    r#"
class A {
  constructor() {
    console.log('a');
  }
}

class B {
  b() {
    console.log('b');
  }
}
"#,
    r#"
let A = function A() {
  "use strict";

  console.log('a');
};

let B = /*#__PURE__*/function () {
  "use strict";

  function B() {}

  _createClass(B, [{
    key: "b",
    value: function b() {
      console.log('b');
    }
  }]);
  return B;
}();
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            no_class_calls: true,
            ..Default::default()
        }
    ),
    no_class_call_super,
    r#"
class B {}

class A extends B {
  constructor(track) {
    if (track !== undefined) super(track);
    else super();
  }
}
"#,
    r#"
let B = function B() {
  "use strict";
};

let A = /*#__PURE__*/function (B) {
  "use strict";

  _inherits(A, B);

  var _super = _createSuper(A);

  function A(track) {
    var _this;

    if (track !== undefined) _this = _super.call(this, track);else _this = _super.call(this);
    return _possibleConstructorReturn(_this);
  }

  return A;
}(B);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            set_class_methods: true,
            ..Default::default()
        }
    ),
    set_method_literal_key,
    r#"
class Foo {
  "bar"() {
  }
}
"#,
    r#"
let Foo = /*#__PURE__*/function () {
  "use strict";

  function Foo() {
    _classCallCheck(this, Foo);
  }

  var _proto = Foo.prototype;

  _proto["bar"] = function bar() {};

  return Foo;
}();
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            set_class_methods: true,
            ..Default::default()
        }
    ),
    set_method_static,
    r#"
class Test {
  a() {}
  static b() {}
  c() {}
}
"#,
    r#"
let Test = /*#__PURE__*/function () {
  "use strict";

  function Test() {
    _classCallCheck(this, Test);
  }

  var _proto = Test.prototype;

  _proto.a = function a() {};

  _proto.c = function c() {};

  Test.b = function b() {};

  return Test;
}();
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            set_class_methods: true,
            ..Default::default()
        }
    ),
    set_method_getter_setter,
    r#"
class Test extends Foo {
  "foo"() {}

  get foo() {}

  set foo(a) {}
}
"#,
    r#"
let Test = /*#__PURE__*/function (Foo) {
  "use strict";

  _inherits(Test, Foo);

  var _super = _createSuper(Test);

  function Test() {
    _classCallCheck(this, Test);
    return _super.apply(this, arguments);
  }

  var _proto = Test.prototype;

  _proto["foo"] = function foo() {};

  _createClass(Test, [
    {
      key: "foo",
      get: function () {},
      set: function (a) {}
    }
  ]);

  return Test;
}(Foo);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            super_is_callable_constructor: true,
            ..Default::default()
        }
    ),
    super_callable,
    r#"
class BaseController extends Chaplin.Controller { }

class BaseController2 extends Chaplin.Controller.Another { }
"#,
    r#"
let BaseController = /*#__PURE__*/function (_Controller) {
  "use strict";

  _inherits(BaseController, _Controller);

  function BaseController() {
    _classCallCheck(this, BaseController);
    return _Controller.apply(this, arguments);
  }

  return BaseController;
}(Chaplin.Controller);

let BaseController2 = /*#__PURE__*/function (_Another) {
  "use strict";

  _inherits(BaseController2, _Another);

  function BaseController2() {
    _classCallCheck(this, BaseController2);
    return _Another.apply(this, arguments);
  }

  return BaseController2;
}(Chaplin.Controller.Another);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            super_is_callable_constructor: true,
            ..Default::default()
        }
    ),
    super_callable_super,
    r#"class Test extends Foo { }"#,
    r#"
let Test = /*#__PURE__*/function (Foo) {
  "use strict";

  _inherits(Test, Foo);

  function Test() {
    _classCallCheck(this, Test);
    return Foo.apply(this, arguments);
  }

  return Test;
}(Foo);
"#
);

test!(
    syntax(),
    |t| classes(
        Some(t.comments.clone()),
        Config {
            super_is_callable_constructor: true,
            ..Default::default()
        }
    ),
    issue_3943,
    r#"
class Thing extends B {
  constructor(n) {
    super()
    this.name = n
  }
}
"#,
    r#"
let Thing = function(B) {
    "use strict";
    _inherits(Thing, B);
    function Thing(n) {
        _classCallCheck(this, Thing);
        var _this;
        _this = B.call(this) || this;
        _this.name = n;
        return _this;
    }
    return Thing;
}(B);
"#
);
