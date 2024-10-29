#![allow(clippy::unit_arg)]

use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::computed_props::{computed_properties, Config};
use swc_ecma_transforms_testing::{test, test_exec};

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    computed_properties(Default::default())
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_210,
    "
const b = {[a]: 1}
export const c = {[a]: 1}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    big_int,
    "
const b = {1n: 1, [x]: 'x', 2n: 2}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    accessors,
    r#"var obj = {
  get [foobar]() {
    return "foobar";
  },
  set [foobar](x) {
    console.log(x);
  },
  get test() {
    return "regular getter after computed property";
  },
  set "test"(x) {
    console.log(x);
  }
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680,
    r#"
const obj = {
    get [1]() {}
};
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680_2,
    r#"
let a = "outside";
const obj = {
  get [{
    get [a]() {
      let a = "inside";
      return a;
    },
  }.outside]() {
    let a = "middle";
    return a;
  },
};

expect(obj.inside).toBe("middle");
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680_3,
    r#"
const obj = {
  foo() {
      const obj2 = {
          get [1]() {
              return 42;
          },
      };
      return obj2;
  },
};

expect(obj.foo()[1]).toBe(42);
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680_4,
    r#"
const obj = {
  foo() {
      const obj2 = {
          get [1]() {
              return 42;
          },
      };
      return obj2;
  },
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    argument,
    r#"foo({
  [bar]: "foobar"
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    assignment,
    r#"foo = {
  [bar]: "foobar"
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    method,
    r#"var obj = {
  [foobar]() {
    return "foobar";
  },
  test() {
    return "regular method after computed property";
  }
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    mixed,
    r#"var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
  foo: "foo",
  bar: "bar",
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    multiple,
    r#"var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo"
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    single,
    r#"var obj = {
  ["x" + foo]: "heh"
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    symbol,
    r#"var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    symbol_exec,
    r#"
var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    this,
    r#"var obj = {
  ["x" + foo.bar]: "heh",
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_1,
    "
({
  foo: {
    bar: null,
    [baz]: null
  },

  [bon]: {
    flab: null
  }
});

export function corge() {}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_2,
    "
export function corge() {}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_3,
    "
export function corge() {}

({
  foo: {
    bar: null,
    [baz]: null
  },

  [bon]: {
    flab: null
  }
});
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_4,
    "
export class Foo {}

({
  foo: {
    bar: null,
    [baz]: null
  },

  [bon]: {
    flab: null
  }
});
"
);

// spec_mixed
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_mixed,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
  foo: "foo",
  bar: "bar",
};

"#
);

// spec_single
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_single,
    r#"
var obj = {
  ["x" + foo]: "heh"
};

"#
);

// spec

// regression_7144
test!(
    syntax(),
    |_| tr(Default::default()),
    regression_7144,
    r#"
export default {
  [a]: b,
  [c]: d
};
"#
);

// spec_multiple
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_multiple,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
};

"#
);

// spec_this
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_this,
    r#"
var obj = {
  ["x" + foo.bar]: "heh"
};

"#
);

// spec_method
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_method,
    r#"
var obj = {
  [foobar]() {
    return "foobar";
  },
  test() {
    return "regular method after computed property";
  }
};

"#
);

// spec_assignment
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_assignment,
    r#"
foo = {
  [bar]: "foobar"
};

"#
);

// spec_argument
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_argument,
    r#"
foo({
  [bar]: "foobar"
});

"#
);

// spec_two
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_two,
    r#"
var obj = {
  first: "first",
  ["second"]: "second"
};

"#
);

// spec_variable
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_variable,
    r#"
var foo = {
  [bar]: "foobar"
};

"#
);

// spec_symbol_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    spec_symbol_exec,
    r#"
var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)

"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_assignment,
    r#"
foo = {
  [bar]: "foobar"
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_argument,
    r#"
foo({
  [bar]: "foobar"
});
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_coerce,
    r#"
var obj = {
  foo: "bar",
  [bar]: "foo"
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_method,
    r#"
var obj = {
  [foobar]() {
    return "foobar";
  },
  test() {
    return "regular method after computed property";
  }
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_mixed,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
  foo: "foo",
  bar: "bar",
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_multiple,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_single,
    r#"
var obj = {
  ["x" + foo]: "heh"
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_this,
    r#"
var obj = {
  ["x" + foo.bar]: "heh"
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_two,
    r#"
var obj = {
  first: "first",
  [second]: "second"
}
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_variable,
    r#"
var foo = {
  [bar]: "foobar",
};
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_str_lit,
    r#"
var foo = {
["213"]: "foobar",
};
"#
);

test_exec!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_symbol,
    r#"
var k = Symbol();
var foo = {
[Symbol.iterator]: "foobar",
get [k]() {
  return k;
}
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)

"#
);
