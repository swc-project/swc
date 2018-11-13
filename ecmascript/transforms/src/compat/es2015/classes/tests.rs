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
    method_override,
    r#"class Parent {
  foo(){}
}
class Child extends Parent {
  foo(){
    super.foo();
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

  _createClass(Child, [{
    key: "foo",
    value: function foo() {
      _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype), "foo", this).call(this);
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
