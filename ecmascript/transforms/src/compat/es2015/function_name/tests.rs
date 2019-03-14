use super::*;
use crate::{compat::es2015::block_scoping, resolver};

fn tr() -> impl Fold<Module> {
    chain!(resolver(), function_name(), block_scoping())
}

macro_rules! identical {
    ($name:ident, $src:literal) => {
        test!(
            ::swc_ecma_parser::Syntax::default(),
            |_| tr(),
            $name,
            $src,
            $src
        );
    };
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
  var Foo = function() {
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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_288_01,
    "var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};",
    "var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d1, b1) {
        d1.__proto__ = b1;
  } || function (d1, b1) {
    for (var p in b1) if (b1.hasOwnProperty(p)) d1[p] = b1[p];
  };

  return extendStatics(d, b);
};"
);

identical!(
    issue_288_02,
    "function components_Link_extends() {
      components_Link_extends = Object.assign || function (target) { for (var i = 1; i < \
     arguments.length; i++) { var source = arguments[i]; for (var key in source) { if \
     (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } \
     return target; };
    return components_Link_extends.apply(this, arguments); }"
);
