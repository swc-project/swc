use super::*;

test!(
    Classes::default(),
    basic,
    r#"class Test {
  constructor(name) {
    this.name = name;
  }

  logger () {
    console.log("Hello", this.name);
  }
}"#,
    r#"var Test = function () {
  function Test(name) {
    _classCallCheck(this, Test);

    this.name = name;
  }

  _createClass(Test, [{
    key: "logger",
    value: function logger() {
      console.log("Hello", this.name);
    }
  }]);

  return Test;
}();"#
);

test!(
    Classes::default(),
    method_hoisted,
    r#"class Foo {
  foo(){
  }
  constructor(s){
  }
}"#,
    r#"var Foo = function () {
  function Foo(s) {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: "foo",
    value: function foo() {}
  }]);

  return Foo;
}();"#
);

test!(
    Classes::default(),
    static_method,
    r#"class Foo {
  static st(){}
}"#,
    r#"var Foo = function () {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, null, [{
    key: "st",
    value: function st() {}
  }]);

  return Foo;
}();"#
);

test!(
    Classes::default(),
    complex_with_consturctor,
    r#"class Foo {
  foo(){
  }
  constructor(s){
  }
  static st(){}
}"#,
    r#"var Foo = function () {
  function Foo(s) {
    _classCallCheck(this, Foo);
  }
  _createClass(Foo, [{
    key: "foo",
    value: function foo() {}
  }], [{
    key: "st",
    value: function st() {}
  }]);

  return Foo;
}();"#
);

test!(
  Classes::default(),
  super_access,
  r#"class Parent {
  foo(a){}
}
class Child extends Parent {
  foo(a, b){
    super.foo(a);
    super.f;
    super.f.f.f.f;
  }
  
  bar(){
  }
}"#,
  r#"var Parent = function () {
  function Parent() {
    _classCallCheck(this, Parent);
  }

  _createClass(Parent, [{
    key: "foo",
    value: function foo(a) {}
  }]);

  return Parent;
}();

var Child = function (_Parent) {
  _inherits(Child, _Parent);

  function Child() {
    _classCallCheck(this, Child);

    return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
  }

  _createClass(Child, [{
    key: "foo",
    value: function foo(a, b) {
      _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype), "foo", this).call(this, a);
      _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype), "f", this);
      _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype), "f", this).f.f.f;
    }
  }, {
    key: "bar",
    value: function bar() {}
  }]);

  return Child;
}(Parent);"#
);

test!(
    Classes::default(),
    method_override,
    r#"class Parent {
  foo(a){}
}
class Child extends Parent {
  foo(a, b){
    super.foo(a);
  }
  
  bar(){
  }
}"#,
    r#"var Parent = function () {
  function Parent() {
    _classCallCheck(this, Parent);
  }

  _createClass(Parent, [{
    key: "foo",
    value: function foo(a) {}
  }]);

  return Parent;
}();

var Child = function (_Parent) {
  _inherits(Child, _Parent);

  function Child() {
    _classCallCheck(this, Child);

    return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
  }

  _createClass(Child, [{
    key: "foo",
    value: function foo(a, b) {
      _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype), "foo", this).call(this, a);
    }
  }, {
    key: "bar",
    value: function bar() {}
  }]);

  return Child;
}(Parent);"#
);

test!(Classes::default(), inherit_constructor, r#"class Parent {
  constructor(){
  }
  foo(){}
}
class Child extends Parent {
}"#, r#"var Parent = function () {
  function Parent() {
    _classCallCheck(this, Parent);
  }

  _createClass(Parent, [{
    key: "foo",
    value: function foo() {}
  }]);

  return Parent;
}();

var Child = function (_Parent) {
  _inherits(Child, _Parent);

  function Child() {
    _classCallCheck(this, Child);

    return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
  }

  return Child;
}(Parent);"#);

test!(
    Classes::default(),
    custom_constructor,
    r#"class Parent {
  constructor(){
  }
  foo(){}
}
class Child extends Parent {
  constructor(){
  	super();
  }
}"#,
    r#"var Parent = function () {
  function Parent() {
    _classCallCheck(this, Parent);
  }

  _createClass(Parent, [{
    key: "foo",
    value: function foo() {}
  }]);

  return Parent;
}();

var Child = function (_Parent) {
  _inherits(Child, _Parent);

  function Child() {
    _classCallCheck(this, Child);

    return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).call(this));
  }

  return Child;
}(Parent);"#
);

test!(
    Classes::default(),
    custom_constructor_super_order,
    r#"class Parent {
  constructor(){
  }
  foo(){}
}
class Child extends Parent {
  constructor(){
    console.log('foo');
  	super();
    console.log('bar');
  }
}"#,
    r#"var Parent = function () {
  function Parent() {
    _classCallCheck(this, Parent);
  }

  _createClass(Parent, [{
    key: 'foo',
    value: function foo() {}
  }]);

  return Parent;
}();

var Child = function (_Parent) {
  _inherits(Child, _Parent);

  function Child() {
    _classCallCheck(this, Child);

    console.log('foo');

    var _this = _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).call(this));

    console.log('bar');
    return _this;
  }

  return Child;
}(Parent);"#
);

test_exec!(
    |helpers| Classes { helpers },
    get_semantics_getter_defined_on_parent,
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
expect(obj.get()).toBe(1);"#
);

test_exec!(
    |helpers| Classes { helpers },
    get_semantics_not_defined_on_parent,
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

test_exec!(
    |helpers| Classes { helpers },
    get_semantics_setter_defined_on_parent,
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

test_exec!(
    |helpers| Classes { helpers },
    call_semantics_data_defined_on_parent,
    r#""use strict";
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
expect(obj.call(1, 2, 3)).toBe(1);"#
);

test_exec!(
    |helpers| Classes { helpers },
    call_semantics_getter_defined_on_parent,
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
expect(obj.call(1, 2, 3)).toBe(1);"#
);

test_exec!(
    |helpers| Classes { helpers },
    call_semantics_not_defined_on_parent,
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
}).toThrowError(TypeError)"#
);

test_exec!(
    |helpers| Classes { helpers },
    call_semantics_setter_defined_on_parent,
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
}).toThrowError(TypeError)"#
);

test_exec!(
    |helpers| Classes { helpers },
    get_semantics_data_defined_on_parent,
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
expect(obj.get()).toBe(1);"#
);

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_data_defined_on_parent,
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

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_getter_defined_on_parent,
    r#"
"use strict";
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
expect(obj.test).toBe(2);"#
);

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_not_defined_on_parent_data_on_obj,
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
expect(obj.test).toBe(3);"#
);

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_not_defined_on_parent_getter_on_obj,
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
expect(obj.test).toBe(3);"#
);

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_not_defined_on_parent_not_on_obj,
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
expect(obj.test).toBe(3);"#
);

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_not_defined_on_parent_setter_on_obj,
    r#"
"use strict";
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
expect(obj.test).toBe(3);"#
);

test_exec!(
    |helpers| Classes { helpers },
    set_semantics_setter_defined_on_parent,
    r#"
"use strict";
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
expect(obj.test).toBe(2);"#
);
