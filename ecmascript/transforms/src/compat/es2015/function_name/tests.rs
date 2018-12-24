use super::*;

test!(
    FnName,
    basic,
    r#"var number = function (x) {
  return x;
};"#,
    r#"var number = function number(x) {
  return x;
};"#
);

test!(
    FnName,
    assign,
    r#"number = function (x) {
  return x;
};"#,
    r#"number = function number(x) {
  return x;
};"#
);

test!(
    FnName,
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
let TestClass = {
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
