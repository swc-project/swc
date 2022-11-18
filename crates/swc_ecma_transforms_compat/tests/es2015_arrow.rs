use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_testing::{compare_stdout, test, test_fixture};
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    let unresolved = Mark::new();
    let global = Mark::new();
    chain!(resolver(unresolved, global, false), arrow(unresolved))
}

compare_stdout!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    arguments_nested_arrow,
    "
    function test() {
      console.log(arguments[0]);
      return () => {
        console.log(arguments[0]);
        return () => {
          console.log(arguments[0])
        };
      }
    }

    test()(1)(2);
    "
);

compare_stdout!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    arguments_nested_fn,
    "
    function test() {
      console.log(arguments[0]);
      return () => {
        console.log(arguments[0]);
        return function() {
          console.log(arguments[0]);
          return () => {
            console.log(arguments[0])
          };
        };
      }
    }
    test()(1)(2)(3);
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    issue_2212_1,
    "const foo = () => this",
    "
    var _this = this;
    const foo = function() {
        return _this;
    };
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    issue_2212_2,
    "
    const foo = function (){
        () => () => () => this
    }
    ",
    "
    const foo = function() {
      var _this = this;
      (function() {
          return function() {
              return function() {
                  return _this;
              };
          };
      });
    };
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    fixture_this,
    r#"
function b() {
  var t = x => this.x + x;
}

class Foo extends (function(){}) {
  constructor(){
    var foo = () => this;

    if (true){
        console.log(super(), foo());
    } else {
        super();
        console.log(foo());
    }
  }
}
"#,
    r#"
function b() {
  var _this = this;

  var t = function (x) {
    return _this.x + x;
  };
}

class Foo extends function () {} {
  constructor() {
    var _this;

    var foo = function () {
      return _this;
    };

    if (true) {
      console.log((super(), _this = this), foo());
    } else {
      super(), _this = this;
      console.log(foo());
    }
  }

}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    fixture_arguments,
    r#"
function fn() {
  var foo = () => {
    return arguments;
  };
}

var bar = () => arguments;

var baz = () => () => arguments;
"#,
    r#"
var _arguments = arguments;

function fn() {
  var _arguments = arguments;

  var foo = function () {
    return _arguments;
  };
}

var bar = function () {
  return _arguments;
};

var baz = function () {
  return function () {
    return _arguments;
  };
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    two_arrow,
    r#"
let foo = () => this;
let bar = () => this;
let foo1 = () => arguments;
let bar1 = () => arguments;
"#,
    r#"
var _this = this, _arguments = arguments;
let foo = function () {
  return _this;
}
let bar = function () {
  return _this;
}
let foo1 = function () {
  return _arguments;
}
let bar1 = function () {
  return _arguments;
}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    computed_props,
    r#"
var a = {
  [(() => this)()]: 123
}
"#,
    r#"
var _this = this;

var a = {
  [function () {
    return _this;
  }()]: 123
};
"#
);

#[testing::fixture("tests/arrow/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            chain!(
                resolver(unresolved_mark, Mark::new(), false),
                arrow(unresolved_mark)
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
