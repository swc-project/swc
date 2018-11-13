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
