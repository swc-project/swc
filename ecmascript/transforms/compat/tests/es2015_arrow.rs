use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_testing::test;

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
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
    |_| arrow(),
    destructuring,
    r#"let foo = ({bar}) => undefined;"#,
    r#"let foo = function ({bar}) {
	return undefined;
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    basic,
    r#"let echo = (bar) => bar"#,
    r#"let echo = function(bar) {
        return bar;
    }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    empty_arguments,
    r#"var t = () => 5 + 5;"#,
    r#"var t = function () {
  return 5 + 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    expression,
    r#"arr.map(x => x * x);"#,
    r#"arr.map(function (x) {
  return x * x;
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    inside_call,
    r#"arr.map(i => i + 1);"#,
    r#"arr.map(function (i) {
  return i + 1;
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    multiple_arguments,
    r#"var t = (i, x) => i * x;"#,
    r#"var t = function (i, x) {
  return i * x;
};"#
);

// test!(::swc_ecma_parser::Syntax::default(),
//     |_| arrow(),
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
    |_| arrow(),
    paren_insertion,
    r#"var t = i => i * 5;"#,
    r#"var t = function (i) {
  return i * 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    single_argument,
    r#"var t = (i) => i * 5;"#,
    r#"var t = function (i) {
  return i * 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
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
    |_| arrow(),
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
    |_| arrow(),
    arguments,
    r#"
function test() {
  return () => arguments[0];
}"#,
    r#"
  function test() {
    return (function(_arguments) {
      return _arguments[0];
    }).bind(this, arguments)
  }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    arguments_nested_arrow,
    r#"
  function test() {
    console.log(arguments[0]);
    return () => {
      console.log(arguments[0]);
      return () => {
        console.log(arguments[0])
      };
    }
  }"#,
    r#"
  function test() {
    console.log(arguments[0]);
    return (function(_arguments) {
        console.log(_arguments[0]);
        return function() {
            console.log(_arguments[0]);
        };
    }).bind(this, arguments);
  }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
    arguments_nested_fn,
    r#"
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
  }"#,
    r#"
  function test() {
    console.log(arguments[0]);
    return (function(_arguments) {
        console.log(_arguments[0]);
        return function() {
            console.log(arguments[0]);
            return (function(_arguments1) {
                console.log(_arguments1[0]);
            }).bind(this, arguments);
        };
    }).bind(this, arguments);
  }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| arrow(),
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
    |_| arrow(),
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
