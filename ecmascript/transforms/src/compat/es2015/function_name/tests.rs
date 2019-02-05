use super::*;
use crate::compat::es2015::{block_scoping, resolver};

fn tr() -> impl Fold<Module> {
    chain!(resolver(), function_name(), block_scoping())
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    basic,
    r#"var number = function (x) {
  return x;
};"#,
    r#"var number = function number(x) {
  return x;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    assign,
    r#"number = function (x) {
  return x;
};"#,
    r#"number = function number(x) {
  return x;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    let_complex,
    r#"
let TestClass = {
  name: "John Doe",

  testMethodFailure() {
    return new Promise(async function(resolve) {
      console.log(this);
      setTimeout(resolve, 1000);
    });
  }
};
"#,
    r#"
var TestClass = {
  name: "John Doe",

  testMethodFailure() {
    return new Promise(async function(resolve) {
      console.log(this);
      setTimeout(resolve, 1000);
    });
  }
}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    class_simple,
    r#"
var Foo = function() {
  var Foo = function () {
   _classCallCheck(this, Foo);
  };
  _defineProperty(Foo, 'num', 0);
  return Foo;
}();
expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe('Foo');
"#,
    r#"
var Foo = function() {
  var Foo = function Foo() {
   _classCallCheck(this, Foo);
  };
  _defineProperty(Foo, 'num', 0);
  return Foo;
}();
expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe('Foo');
"#
);
