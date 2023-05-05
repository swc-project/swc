#![allow(clippy::unit_arg)]

use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::computed_props::{computed_properties, Config};
use swc_ecma_transforms_testing::{test, test_exec};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr(_: ()) -> impl Fold {
    computed_properties(Default::default())
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_210,
    "
const b = {[a]: 1}
export const c = {[a]: 1}
",
    "const b = _define_property({
}, a, 1);
export const c = _define_property({
}, a, 1);"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    big_int,
    "
const b = {1n: 1, [x]: 'x', 2n: 2}
",
    "var _obj;
const b = (_obj = {
    1n: 1
}, _define_property(_obj, x, 'x'), _define_property(_obj, 2n, 2), _obj);"
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
"#,
    r#"var _obj, _mutatorMap = {
};
var obj = ( _obj = {
}, _mutatorMap[foobar] = _mutatorMap[foobar] || {
}, _mutatorMap[foobar].get = function() {
    return "foobar";
}, _mutatorMap[foobar] = _mutatorMap[foobar] || {
}, _mutatorMap[foobar].set = function(x) {
    console.log(x);
}, _mutatorMap["test"] = _mutatorMap["test"] || {
}, _mutatorMap["test"].get = function() {
    return "regular getter after computed property";
}, _mutatorMap["test"] = _mutatorMap["test"] || {
}, _mutatorMap["test"].set = function(x) {
    console.log(x);
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680,
    r#"
const obj = {
    get [1]() {}
};
"#,
    "
var _obj, _mutatorMap = {};
const obj = (
    _obj = {},
    _mutatorMap[1] = _mutatorMap[1] || {},
    _mutatorMap[1].get = function() {},
    _define_enumerable_properties(_obj, _mutatorMap), 
    _obj
);
"
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
"#,
    "
const obj = {
  foo() {
    var _obj, _mutatorMap = {};
    const obj2 = (
        _obj = {},
        _mutatorMap[1] = _mutatorMap[1] || {},
        _mutatorMap[1].get = function () {
            return 42;
        },
        _define_enumerable_properties(_obj, _mutatorMap),
        _obj
    );
    return obj2;
  },
};
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    argument,
    r#"foo({
  [bar]: "foobar"
});"#,
    r#"foo(_define_property({}, bar, "foobar"));
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    assignment,
    r#"foo = {
  [bar]: "foobar"
};"#,
    r#"foo = _define_property({}, bar, "foobar");"#
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
};"#,
    r#"var _obj;

var obj = (_obj = {}, _define_property(_obj, foobar, function () {
  return "foobar";
}), _define_property(_obj, "test", function () {
  return "regular method after computed property";
}), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    mixed,
    r#"var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
  foo: "foo",
  bar: "bar"
};"#,
    r#"var _obj;

var obj = (_obj = {}, _define_property(_obj, "x" + foo, "heh"), _define_property(_obj,
 "y" + bar, "noo"), _define_property(_obj, "foo", "foo"), _define_property(_obj, "bar", "bar"), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    multiple,
    r#"var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo"
};"#,
    r#"var _obj;

var obj = (_obj = {}, _define_property(_obj, "x" + foo, "heh"),
_define_property(_obj, "y" + bar, "noo"), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    single,
    r#"var obj = {
  ["x" + foo]: "heh"
};"#,
    r#"var obj = _define_property({}, "x" + foo, "heh");"#
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
"#,
    r#"var k = Symbol();
var _obj, _mutatorMap = {
};
var foo = ( _obj = {
}, _define_property(_obj, Symbol.iterator, "foobar"), _mutatorMap[k] = _mutatorMap[k] || {
}, _mutatorMap[k].get = function() {
    return k;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);"#
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
  ["x" + foo.bar]: "heh"
};"#,
    r#"var obj = _define_property({}, "x" + foo.bar, "heh");"#
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
",
    "
_define_property({
    foo: _define_property({
        bar: null
    }, baz, null)
}, bon, {
    flab: null
});
export function corge() {
}"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_2,
    "
export function corge() {}
",
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
",
    "
export function corge() {
}
_define_property({
    foo: _define_property({
        bar: null
    }, baz, null)
}, bon, {
    flab: null
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
",
    "
export class Foo {}

_define_property({
    foo: _define_property({
        bar: null
    }, baz, null)
}, bon, {
    flab: null
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
  bar: "bar"
};

"#,
    r#"
var _obj;

var obj = (_obj = {}, _define_property(_obj, "x" + foo, "heh"), _define_property(_obj, "y" + bar, "noo"), _define_property(_obj, "foo", "foo"), _define_property(_obj, "bar", "bar"), _obj);

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

"#,
    r#"
var obj = _define_property({}, "x" + foo, "heh");

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
"#,
    r#"
var _obj;

export default (_obj = {}, _define_property(_obj, a, b), _define_property(_obj, c, d), _obj);

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
  ["y" + bar]: "noo"
};

"#,
    r#"
var _obj;

var obj = (_obj = {}, _define_property(_obj, "x" + foo, "heh"), _define_property(_obj, "y" + bar, "noo"), _obj);

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

"#,
    r#"
var obj = _define_property({}, "x" + foo.bar, "heh");

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

"#,
    r#"
var _obj;

var obj = (_obj = {}, _define_property(_obj, foobar, function () {
  return "foobar";
}), _define_property(_obj, "test", function () {
  return "regular method after computed property";
}), _obj);

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

"#,
    r#"
foo = _define_property({}, bar, "foobar");

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

"#,
    r#"
foo(_define_property({}, bar, "foobar"));

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
  ["second"]: "second",
};

"#,
    r#"
var obj = _define_property({
  first: "first"
}, "second", "second");

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

"#,
    r#"
var foo = _define_property({}, bar, "foobar");

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
"#,
    r#"
var _obj;

foo = (_obj = {}, _obj[bar] = "foobar", _obj);
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
"#,
    r#"
var _obj;

foo((_obj = {}, _obj[bar] = "foobar", _obj));
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
"#,
    r#"
var _obj;

var obj = (_obj = {
  foo: "bar"
}, _obj[bar] = "foo", _obj);
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
"#,
    r#"
var _obj;

var obj = (_obj = {}, _obj[foobar] = function () {
  return "foobar";
}, _obj.test = function () {
  return "regular method after computed property";
}, _obj);
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
  bar: "bar"
};
"#,
    r#"
var _obj;

var obj = (_obj = {}, _obj["x" + foo] = "heh", _obj["y" + bar] = "noo", _obj.foo = "foo", _obj.bar = "bar", _obj);
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_multiple,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo"
};
"#,
    r#"
var _obj;

var obj = (_obj = {}, _obj["x" + foo] = "heh", _obj["y" + bar] = "noo", _obj);
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
"#,
    r#"
var _obj;

var obj = (_obj = {}, _obj["x" + foo] = "heh", _obj);
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
"#,
    r#"
var _obj;

var obj = (_obj = {}, _obj["x" + foo.bar] = "heh", _obj);
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_two,
    r#"
var obj = {
  first: "first",
  [second]: "second",
}
"#,
    r#"
var _obj;

var obj = (_obj = {
  first: "first"
}, _obj[second] = "second", _obj);
"#
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_variable,
    r#"
var foo = {
  [bar]: "foobar"
};
"#,
    r#"
var _obj;

var foo = (_obj = {}, _obj[bar] = "foobar", _obj);
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
"#,
    r#"
var _obj;
var foo = (_obj = {
}, _obj["213"] = "foobar", _obj);
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
