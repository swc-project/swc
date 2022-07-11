use swc_common::{chain, Mark};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_testing::{compare_stdout, test};
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    let unresolved = Mark::new();
    let global = Mark::new();
    chain!(resolver(unresolved, global, false), arrow(unresolved))
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    issue_233,
    "const foo = () => ({ x, ...y }) => y",
    "const foo = function() {
    return function({ x , ...y }) {
        return y;
    };
};"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    destructuring,
    r#"let foo = ({bar}) => undefined;"#,
    r#"let foo = function ({bar}) {
	return undefined;
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    basic,
    r#"let echo = (bar) => bar"#,
    r#"let echo = function(bar) {
        return bar;
    }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    empty_arguments,
    r#"var t = () => 5 + 5;"#,
    r#"var t = function () {
  return 5 + 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    expression,
    r#"arr.map(x => x * x);"#,
    r#"arr.map(function (x) {
  return x * x;
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    inside_call,
    r#"arr.map(i => i + 1);"#,
    r#"arr.map(function (i) {
  return i + 1;
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    multiple_arguments,
    r#"var t = (i, x) => i * x;"#,
    r#"var t = function (i, x) {
  return i * x;
};"#
);

// test!(::swc_ecma_parser::Syntax::default(),
//     |_| arrow(Mark::new()),
//     nested,
//     r#"module.exports = {
//   init: function () {
//     return new Promise((resolve, reject) => {
//       MongoClient.connect(config.mongodb, (err, db) => {
//         if (err) {
//           return reject(err);
//         }
//         this.db = db;
//         resolve(this);
//       });
//     });
//   }
// };"#,
//     r#"module.exports = {
//   init: function () {
//     var _this = this;

//     return new Promise(function (resolve, reject) {
//       MongoClient.connect(config.mongodb, function (err, db) {
//         if (err) {
//           return reject(err);
//         }

//         _this.db = db;
//         resolve(_this);
//       });
//     });
//   }
// };"#
// );

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    paren_insertion,
    r#"var t = i => i * 5;"#,
    r#"var t = function (i) {
  return i * 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    single_argument,
    r#"var t = (i) => i * 5;"#,
    r#"var t = function (i) {
  return i * 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    statement,
    r#"nums.forEach(v => {
  if (v % 5 === 0) {
  fives.push(v);
  }
});"#,
    r#"nums.forEach(function (v) {
  if (v % 5 === 0) {
    fives.push(v);
  }
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    issue_413,
    r#"
export const getBadgeBorderRadius = (text, color) => {
  return (text && style) || {}
}"#,
    r#"
export const getBadgeBorderRadius = function(text, color) {
    return text && style || {
    };
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    arguments,
    r#"
function test() {
  return () => arguments[0];
}"#,
    r#"
  function test() {
    var _arguments = arguments;
    return function() {
      return _arguments[0];
    }
  }"#
);

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
    arguments_member,
    r#"
  function test() {
    return (foo) => {
      return foo.arguments;
    }
  }"#,
    r#"
  function test() {
    return function(foo) {
      return foo.arguments;
    };
  }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    arguments_fn_expr,
    r#"
  function test() {
    return function() {
      return arguments[0];
    };
  }"#,
    r#"
  function test() {
    return function() {
      return arguments[0];
    };
  }"#
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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    this_in_params,
    r#"
export const getBadgeBorderRadius = (text = this, color = arguments) => {
  return (text && style) || {}
}"#,
    r#"
var _this = this, _arguments = arguments;
export const getBadgeBorderRadius = function(text = _this, color = _arguments) {
  return text && style || {
  };
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    getter_setter,
    r#"
const a = () => ({
  get this() { this;arguments },
  set arguments(a = this) { this;arguments },
  get [this]() { this;arguments },
})
"#,
    r#"
var _this = this;
const a = function () {
  return {
    get this() {
      this;
      arguments;
    },

    set arguments(a = this) {
      this;
      arguments;
    },

    get [_this] () {
        this;
        arguments;
    }
  };
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    method_computed,
    r#"
const a = () => ({
  [this](a = this) { this;arguments },
})
const b = () => class {
  static [this]() {}
  [arguments]() {}
}
"#,
    r#"
var _this = this;
const a = function () {
  return {
    [_this](a = this) {
      this;
      arguments;
    }
  };
};
const b = function() {
  return class {
      static [this]() {}
      [arguments]() {
      }
  };
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(Mark::new()),
    chrome_46,
    "function foo() {
      const a = (a) => new.target
    }",
    "function foo() {
      var _newtarget = new.target;

      const a = function (a) {
        return _newtarget;
      };
    }"
);
