use super::*;

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    destructuring,
    r#"let foo = ({bar}) => undefined;"#,
    r#"let foo = function ({bar}) {
	return undefined;
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    basic,
    r#"let echo = (bar) => bar"#,
    r#"let echo = function(bar) {
        return bar;
    }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    empty_arguments,
    r#"var t = () => 5 + 5;"#,
    r#"var t = function () {
  return 5 + 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    expression,
    r#"arr.map(x => x * x);"#,
    r#"arr.map(function (x) {
  return x * x;
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    inside_call,
    r#"arr.map(i => i + 1);"#,
    r#"arr.map(function (i) {
  return i + 1;
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    multiple_arguments,
    r#"var t = (i, x) => i * x;"#,
    r#"var t = function (i, x) {
  return i * x;
};"#
);

// test!(::swc_ecma_parser::Syntax::default(),
//     |_| Arrow,
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
    |_| Arrow,
    paren_insertion,
    r#"var t = i => i * 5;"#,
    r#"var t = function (i) {
  return i * 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
    single_argument,
    r#"var t = (i) => i * 5;"#,
    r#"var t = function (i) {
  return i * 5;
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Arrow,
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
