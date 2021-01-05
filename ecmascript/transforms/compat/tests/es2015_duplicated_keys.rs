use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::duplicate_keys;
use swc_ecma_transforms_testing::test;

fn syntax() -> Syntax {
    Default::default()
}

test!(
    syntax(),
    |_| duplicate_keys(),
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
    syntax(),
    |_| duplicate_keys(),
    combination_dupes,
    r#"var x = { a: 5, a: 6 };"#,
    r#"var x = _defineProperty({
  a: 5
}, "a", 6);"#
);

test!(
    syntax(),
    |_| duplicate_keys(),
    combination_no_dupes,
    r#"var x = { a: 5, b: 6 };"#,
    r#"var x = { a: 5, b: 6 };"#
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_both_quoted,
    r#"var x = { "a\n b": 5, "a\n b": 6 };"#,
    r#"var x = {
  "a\n b": 5,
  ["a\n b"]: 6
};"#
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_dupes,
    r#"var x = { a: 5, a: 6 };"#,
    r#"var x = {
  a: 5,
  ["a"]: 6
};"#
);

test!(
    syntax(),
    |_| duplicate_keys(),
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
    syntax(),
    |_| duplicate_keys(),
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
    syntax(),
    |_| duplicate_keys(),
    dup_keys_one_quoted,
    r#"var x = { a: 5, "a": 6 };"#,
    r#"var x = {
  a: 5,
  ["a"]: 6
};"#
);

// duplicate_keys_getter
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_getter,
    r#"
var x = { a: 5, get a() {return 6;} };

"#,
    r#"
var x = {
  a: 5,

  get ["a"]() {
    return 6;
  }

};

"#
);

// duplicate_keys_dupes
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_dupes,
    r#"
var x = { a: 5, a: 6 };

"#,
    r#"
var x = {
  a: 5,
  ["a"]: 6
};

"#
);

// duplicate_keys_both_quoted
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_both_quoted,
    r#"
var x = { "a\n b": 5, "a\n b": 6 };

"#,
    r#"
var x = {
  "a\n b": 5,
  ["a\n b"]: 6
};

"#
);

// duplicate_keys_no_dupes
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_no_dupes,
    r#"
var x = { a: 5, b: 6 };

"#,
    r#"
var x = {
  a: 5,
  b: 6
};

"#
);

// duplicate_keys_getters_and_setters
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_getters_and_setters,
    r#"
var x = {
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
};

"#,
    r#"
var x = {
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

};

"#
);

// duplicate_keys_one_quoted
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_one_quoted,
    r#"
var x = { a: 5, "a": 6 };

"#,
    r#"
var x = {
  a: 5,
  ["a"]: 6
};

"#
);
