use super::*;

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    issue_203,
    r#"
const obj = {};

obj.prop = {
  alpha: {
    charlie: true
  },
  beta: {
    charlie: true,
    delta: true
  }
};
"#,
    r#"
const obj = {};

obj.prop = {
  alpha: {
    charlie: true
  },
  beta: {
    charlie: true,
    delta: true
  }
};
"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    combination_dupes,
    r#"var x = { a: 5, a: 6 };"#,
    r#"var x = _defineProperty({
  a: 5
}, "a", 6);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    combination_no_dupes,
    r#"var x = { a: 5, b: 6 };"#,
    r#"var x = { a: 5, b: 6 };"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    dup_keys_both_quoted,
    r#"var x = { "a\n b": 5, "a\n b": 6 };"#,
    r#"var x = {
  "a\n b": 5,
  ["a\n b"]: 6
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    dup_keys_dupes,
    r#"var x = { a: 5, a: 6 };"#,
    r#"var x = {
  a: 5,
  ["a"]: 6
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    dup_keys_getter,
    r#"var x = { a: 5, get a() {return 6;} };"#,
    r#"var x = {
  a: 5,

  get ["a"]() {
    return 6;
  }

};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    dup_keys_getter_and_setter,
    r#"var x = {
  get a() {},
  set a(x) {},
  get a() {},
  set a(x) {},
  a: 3,
  b: 4,
  get b() {},
  set b(x) {},
  get c() {},
  c: 5,
  set c(x) {},
  set d(x) {},
  d: 6,
  get d() {}
};"#,
    r#"var x = {
  get a() {},

  set a(x) {},

  get ["a"]() {},

  set ["a"](x) {},

  ["a"]: 3,
  b: 4,

  get ["b"]() {},

  set ["b"](x) {},

  get c() {},

  ["c"]: 5,

  set ["c"](x) {},

  set d(x) {},

  ["d"]: 6,

  get ["d"]() {}

};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| DuplicateKeys,
    dup_keys_one_quoted,
    r#"var x = { a: 5, "a": 6 };"#,
    r#"var x = {
  a: 5,
  ["a"]: 6
};"#
);
