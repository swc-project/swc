use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_transforms_base::helpers::inject_helpers;
use swc_ecma_transforms_base::hygiene::hygiene;
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_transforms_compat::es2015::block_scoped_functions;
use swc_ecma_transforms_compat::es2015::block_scoping;
use swc_ecma_transforms_compat::es2015::classes;
use swc_ecma_transforms_compat::es2015::destructuring;
use swc_ecma_transforms_compat::es2015::for_of;
use swc_ecma_transforms_compat::es2015::parameters;
use swc_ecma_transforms_compat::es2015::regenerator;
use swc_ecma_transforms_compat::es2015::spread;
use swc_ecma_transforms_compat::es2018::object_rest_spread;
use swc_ecma_transforms_module::common_js::common_js;
use swc_ecma_transforms_module::import_analysis::import_analyzer;
use swc_ecma_transforms_module::util::Config;
use swc_ecma_transforms_module::util::Lazy;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        dynamic_import: true,
        top_level_await: true,
        ..Default::default()
    })
}
fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsConfig {
        ..Default::default()
    })
}

fn tr(config: Config) -> impl Fold {
    let mark = Mark::fresh(Mark::root());

    chain!(resolver_with_mark(mark), common_js(mark, config))
}

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_369,
    "export function input(name) {
    return `${name}.md?render`;
}

export default function({
    name, input: inp,
}) {
    inp = inp || input(name);
    return {input: inp};
}",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.input = input;
function input(name) {
    return `${name}.md?render`;
}
function _default({ name , input: inp  }) {
    inp = inp || input(name);
    return {
        input: inp
    };
}
exports.default = _default;"
);

test!(
    syntax(),
    |_| common_js(Mark::fresh(Mark::root()), Default::default()),
    issue_389_1,
    "
import Foo from 'foo';
Foo.bar = true;
",
    "
'use strict';
var _foo = _interopRequireDefault(require('foo'));
_foo.default.bar = true;
"
);

test!(
    syntax(),
    |_| {
        let mark = Mark::fresh(Mark::root());

        chain!(
            resolver_with_mark(mark),
            // Optional::new(typescript::strip(), syntax.typescript()),
            import_analyzer(),
            inject_helpers(),
            common_js(mark, Default::default()),
            hygiene(),
            fixer(None)
        )
    },
    issue_389_2,
    "
import Foo from 'foo';
Foo.bar = true;
",
    "
'use strict';
var _foo = _interopRequireDefault(require('foo'));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_foo.default.bar = true;
"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_335,
    "import bar from 'bar';

obj[bar('bas')] = '123'",
    "'use strict';
var _bar = _interopRequireDefault(require('bar'));
obj[(0, _bar).default('bas')] = '123';"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_332,
    "import foo from 'foo';

export const bar = { foo }",
    "
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.bar = void 0;
var _foo = _interopRequireDefault(require('foo'));
const bar = {
    foo: _foo.default
};
exports.bar = bar;"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_326,
    "import foo from 'foo';
import bar from '../foo';
foo, bar",
    "'use strict';
var _foo = _interopRequireDefault(require('foo'));
var _foo1 = _interopRequireDefault(require('../foo'));

_foo.default, _foo1.default"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_235,
    "import {Foo as Bar} from 'something';
export const fn = ({a = new Bar()}) => a;",
    "
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.fn = void 0;
var _something = require('something');
const fn = ({ a =new _something.Foo()  })=>a
;
exports.fn = fn;
"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    custom_usage,
    r#"
import React from 'react'
window.React = React;
  "#,
    r#"
'use strict';
var _react = _interopRequireDefault(require('react'));
window.React = _react.default;
"#
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    custom_01,
    r#"
var foo = 1;
export var foo = 2;
foo = 3;
"#,
    r#"
"use strict";
Object.defineProperty(exports, '__esModule', {
     value: true
});

exports.foo = void 0;
var foo = 1;
var foo = 2;
exports.foo = foo;
exports.foo = foo = 3;

"#
);
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    custom_02,
    r#"
export const good = {
  a(bad1) {
    (...bad2) => { };
  }
};"#,
    r#"
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.good = void 0;
const good = {
  a (bad1) {
    (...bad2)=>{};
  }
};
exports.good = good;

"#
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_176,
    r#"
"use strict";

let x = 4;"#,
    r#"
"use strict";

let x = 4;
"#
);

// strict_export_2
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_2,
    r#"
var foo;
export { foo as default };

"#,
    r#"
"use strict";

exports.default = void 0;
var foo;
exports.default = foo;

"#
);

// interop_hoist_function_exports
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_hoist_function_exports,
    r#"
import { isEven } from "./evens";

export function nextOdd(n) {
  return isEven(n) ? n + 1 : n + 2;
}

export var isOdd = (function (isEven) {
  return function (n) {
    return !isEven(n);
  };
})(isEven);

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextOdd = nextOdd;
exports.isOdd = void 0;

var _evens = require("./evens");

function nextOdd(n) {
  return (0, _evens).isEven(n) ? n + 1 : n + 2;
}

var isOdd = function (isEven) {
  return function (n) {
    return !isEven(n);
  };
}(_evens.isEven);

exports.isOdd = isOdd;

"#
);

// regression_t7199

// misc_undefined_this_root_declaration
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    misc_undefined_this_root_declaration,
    r#"
var self = this;

"#,
    r#"
"use strict";

var self = void 0;

"#
);

// interop_export_default_3
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_3,
    r#"
export default [];

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [];
exports.default = _default;

"#
);

// misc_copy_getters_setters
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    misc_copy_getters_setters,
    r#"
import Foo, { baz } from "./moduleWithGetter";

export { Foo, baz };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moduleWithGetter = _interopRequireWildcard(require("./moduleWithGetter"));

Object.defineProperty(exports, "Foo", {
  enumerable: true,
  get: function () {
    return _moduleWithGetter.default;
  }
});
Object.defineProperty(exports, "baz", {
  enumerable: true,
  get: function () {
    return _moduleWithGetter.baz;
  }
});

"#
);

// source_map

// regression_t7165

// regression_lazy_7176

// interop_multi_load

// update_expression_positive_suffix
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    update_expression_positive_suffix,
    r#"
export let diffLevel = 0;

export function diff() {
  if (!++diffLevel) {
    console.log("hey");
  }
}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffLevel = void 0;
let diffLevel = 0;
exports.diffLevel = diffLevel;

function diff() {
  if (!(exports.diffLevel = diffLevel = +diffLevel + 1)) {
    console.log("hey");
  }
}

"#
);

// interop_export_default_11
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_11,
    r#"
export default new Cachier()

export function Cachier(databaseName) {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.Cachier = Cachier;
exports.default = void 0;

var _default = new Cachier();

exports.default = _default;

function Cachier(databaseName) {}
"#
);

// interop_export_named_5
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_named_5,
    r#"
var foo, bar;
export {foo as default, bar};

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = exports.default = void 0;
var foo, bar;
exports.default = foo;
exports.bar = bar;

"#
);

// interop_exports_variable
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_exports_variable,
    r#"
export var foo = 1;
export var foo2 = 1, bar = 2;
export var foo3 = function () {};
export var foo4;
export let foo5 = 2;
export let foo6;
export const foo7 = 3;
export function foo8 () {}
export class foo9 {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo8 = foo8;
exports.foo2 = exports.foo7 = exports.foo3 = exports.foo4 = exports.bar =
  exports.foo = exports.foo5 = exports.foo6 = void 0;

var foo = 1;
exports.foo = foo;
var foo2 = 1, bar = 2;
exports.foo2 = foo2;
exports.bar = bar;

var foo3 = function () {};

exports.foo3 = foo3;
var foo4;
exports.foo4 = foo4;
let foo5 = 2;
exports.foo5 = foo5;
let foo6;
exports.foo6 = foo6;
const foo7 = 3;
exports.foo7 = foo7;

function foo8() {}

class foo9 {}
exports.foo9 = foo9;

"#
);

// interop_export_from_2
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_2,
    r#"
export {foo} from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.defineProperty(exports, "foo", {
  enumerable: true,
  get: function () {
    return _foo.foo;
  }
});
"#
);

// lazy_local_reexport_default
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_reexport_default,
    r#"
import foo from "./foo";
export { foo as default };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = _interopRequireDefault(require("./foo"));

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _foo.default;
  }
});

"#
);

// lazy_local_reexport_namespace
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_reexport_namespace,
    r#"
import * as namespace from "./foo";
export { namespace };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.namespace = void 0;
var namespace = _interopRequireWildcard(require("./foo"));
exports.namespace = namespace;

"#
);

// regression_es3_compatibility_function

// regression_es3_compatibility_named_function

// interop_export_default_6
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_6,
    r#"
export default class {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class _default {}

exports.default = _default;

"#
);

// no_interop_import_default_only
test!(
    syntax(),
    |_| tr(Config {
        no_interop: true,
        ..Default::default()
    }),
    no_interop_import_default_only,
    r#"
import foo from "foo";

foo();

"#,
    r#"
"use strict";

var _foo = require("foo");

(0, _foo).default();

"#
);

// regression_4462_T7565

// interop_export_from_7
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_7,
    r#"
export {default as foo} from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = _interopRequireDefault(require("foo"));

Object.defineProperty(exports, "foo", {
  enumerable: true,
  get: function () {
    return _foo.default;
  }
});

"#
);

// interop_remap
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_remap,
    r#"
export var test = 2;
test = 5;
test++;

(function () {
  var test = 2;
  test = 3;
  test++;
})();

var a = 2;
export { a };
a = 3;

var b = 2;
export { b as c };
b = 3;

var d = 3;
export { d as e, d as f };
d = 4;

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.e = exports.c = exports.a = exports.test = exports.f = void 0;
var test = 2;
exports.test = test;
exports.test = test = 5;
exports.test = test = +test + 1;

(function () {
  var test1 = 2;
  test1 = 3;
  test1++;
})();

var a = 2;
exports.a = a;
exports.a = a = 3;
var b = 2;
exports.c = b;
exports.c = b = 3;
var d = 3;
exports.e = d;
exports.f = d;
exports.f = exports.e = d = 4;

"#
);

// regression_es3_compatibility_class

// lazy_dep_reexport_all
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_reexport_all,
    r#"
export * from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.keys(_foo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _foo[key];
    }
  });
});

"#
);

// misc_copy_getters_setters_star

// regression_t7160

// lazy_local_sideeffect
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_sideeffect,
    r#"
import "./a";

"#,
    r#"
"use strict";

require("./a");

"#
);

// strict_export_const_destructuring_deep
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_deep,
    r#"
export const { foo: { bar: [baz, qux] } } = {};

"#,
    r#"
"use strict";

exports.qux = exports.baz = void 0;
const {
  foo: {
    bar: [baz, qux]
  }
} = {};
exports.baz = baz;
exports.qux = qux;

"#
);

// lazy_local_reexport_all
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_reexport_all,
    r#"
export * from "./foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("./foo");

Object.keys(_foo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _foo[key];
    }
  });
});

"#
);

// interop_illegal_export_esmodule_2

// interop_export_from_4
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_4,
    r#"
export {foo as bar} from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.defineProperty(exports, "bar", {
  enumerable: true,
  get: function () {
    return _foo.foo;
  }
});

"#
);

// interop_export_destructured
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_destructured,
    r#"
export let x = 0;
export let y = 0;

export function f1 () {
  ({x} = { x: 1 });
}

export function f2 () {
  ({x, y} = { x: 2, y: 3 });
}

export function f3 () {
  [x, y, z] = [3, 4, 5]
}

export function f4 () {
  [x, , y] = [3, 4, 5]
}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.f1 = f1;
exports.f2 = f2;
exports.f3 = f3;
exports.f4 = f4;
exports.y = exports.x = void 0;
let x = 0;
exports.x = x;
let y = 0;
exports.y = y;

function f1() {
  ({
    x
  } = {
    x: 1
  }), exports.x = x;
}

function f2() {
  ({
    x,
    y
  } = {
    x: 2,
    y: 3
  }), exports.x = x, exports.y = y;
}

function f3() {
  [x, y, z] = [3, 4, 5], exports.x = x, exports.y = y;
}

function f4() {
  [x,, y] = [3, 4, 5], exports.x = x, exports.y = y;
}

"#
);

// strict_export_const_destructuring_array
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_array,
    r#"
export const [foo, bar] = [];

"#,
    r#"
"use strict";

exports.bar = exports.foo = void 0;
const [foo, bar] = [];
exports.foo = foo;
exports.bar = bar;

"#
);

// interop_export_named_3
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_named_3,
    r#"
var foo;
export {foo as bar};

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = void 0;
var foo;
exports.bar = foo;

"#
);

// strict_import_source

// interop_imports_glob
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_imports_glob,
    r#"
import * as foo from "foo";

"#,
    r#"
"use strict";

var foo = _interopRequireWildcard(require("foo"));

"#
);

// misc

// strict_export_all

// strict_export
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export,
    r#"
export function foo() {}

"#,
    r#"
"use strict";

exports.foo = foo;

function foo() {}

"#
);

// no_interop_import_wildcard
test!(
    syntax(),
    |_| tr(Config {
        no_interop: true,
        ..Default::default()
    }),
    no_interop_import_wildcard,
    r#"
import * as foo from 'foo';

foo.bar();
foo.baz();

"#,
    r#"
"use strict";

var foo = require("foo");

foo.bar();
foo.baz();

"#
);

// interop_export_default_5
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_5,
    r#"
export default function () {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _default() {}
exports.default = _default;

"#
);

// strict_export_const_destructuring_object_default_params
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_object_default_params,
    r#"
export const { foo, bar = 1 } = {};

"#,
    r#"
"use strict";

exports.bar = exports.foo = void 0;
const {
  foo,
  bar = 1
} = {};
exports.foo = foo;
exports.bar = bar;

"#
);

// lazy_whitelist_reexport_all
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_reexport_all,
    r#"
export * from "white";

export * from "black";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _white = require("white");
var _black = require("black");

Object.keys(_white).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _white[key];
    }
  });
});

Object.keys(_black).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _black[key];
    }
  });
});

"#
);

// misc_reference_source_map

// lazy_dep_import_namespace
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_import_namespace,
    r#"
import * as foo from "foo";

function use() {
  console.log(foo);
}
"#,
    r#"
"use strict";

function foo() {
  const data = _interopRequireWildcard(require("foo"));

  foo = function () {
    return data;
  };

  return data;
}

function use() {
  console.log(foo());
}

"#
);

// lazy_whitelist_reexport_default
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_reexport_default,
    r#"
import foo from "white";
export { foo as default };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _white() {
    const data = _interopRequireDefault(require("white"));
    _white = function() {
        return data;
    };
    return data;
}

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _white().default;
  }
});

"#
);

// misc_local_exports_decl

// interop_export_default_8
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_8,
    r#"
export default class Foo {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Foo {}

exports.default = Foo;

"#
);

// strict_export_1
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_1,
    r#"
export default foo;

"#,
    r#"
"use strict";

exports.default = void 0;
var _default = foo;
exports.default = _default;

"#
);

// lazy_local_import_named
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_import_named,
    r#"
import { foo } from "./foo";

console.log(foo);

"#,
    r#"
"use strict";

var _foo = require("./foo");

console.log(_foo.foo);

"#
);

// interop_export_default_2
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_2,
    r#"
export default {};

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {};
exports.default = _default;

"#
);

// interop_export_named
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_named_1,
    r#"
var foo;
export {foo};

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = void 0;
var foo;
exports.foo = foo;

"#
);

// interop_imports_ordering
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_imports_ordering,
    r#"
import './foo';
import bar from './bar';
import './derp';
import { qux } from './qux';

"#,
    r#"
"use strict";

require("./foo");

var _bar = _interopRequireDefault(require("./bar"));

require("./derp");

var _qux = require("./qux");

"#
);

// strict_export_3
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_3,
    r#"
export {};

export {} from 'foo';

"#,
    r#"
"use strict";

require("foo");

"#
);

// interop_export_named_4
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_named_4,
    r#"
var foo;
export {foo as default};

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var foo;
exports.default = foo;

"#
);

// misc_import_const_throw
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    misc_import_const_throw,
    r#"
import Foo from "foo";

import * as Bar from "bar";

import { Baz } from "baz";

Foo = 42;
Bar = 43;
Baz = 44;

({Foo} = {});
({Bar} = {});
({Baz} = {});

({prop: Foo} = {});
({prop: Bar} = {});
({prop: Baz} = {});

"#,
    r#"
"use strict";

var _foo = _interopRequireDefault(require("foo"));

var Bar = _interopRequireWildcard(require("bar"));

var _baz = require("baz");

Foo = (42, (function() {
    throw new Error('"' + 'Foo' + '" is read-only.');
})());
Bar = (43, (function() {
    throw new Error('"' + 'Bar' + '" is read-only.');
})());
Baz = (44, (function() {
    throw new Error('"' + 'Baz' + '" is read-only.');
})());
({ Foo  } = ( {
}, (function() {
    throw new Error('"' + 'Foo' + '" is read-only.');
})()));
({ Bar  } = ( {
}, (function() {
    throw new Error('"' + 'Bar' + '" is read-only.');
})()));
({ Baz  } = ( {
}, (function() {
    throw new Error('"' + 'Baz' + '" is read-only.');
})()));
({ prop: Foo  } = ( {
}, (function() {
    throw new Error('"' + 'Foo' + '" is read-only.');
})()));
({ prop: Bar  } = ( {
}, (function() {
    throw new Error('"' + 'Bar' + '" is read-only.');
})()));
({ prop: Baz  } = ( {
}, (function() {
    throw new Error('"' + 'Baz' + '" is read-only.');
})()));


"#
);

// lazy_local_import_default
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_import_default,
    r#"
import foo from "./foo";

console.log(foo);

"#,
    r#"
"use strict";

var _foo = _interopRequireDefault(require("./foo"));

console.log(_foo.default);

"#
);

// lazy_whitelist_reexport_namespace
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_reexport_namespace,
    r#"
import * as namespace1 from "white";
export { namespace1 };

import * as namespace2 from "black";
export { namespace2 };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.namespace2 = void 0;
function namespace1() {
  const data = _interopRequireWildcard(require("white"));

  namespace1 = function () {
    return data;
  };

  return data;
}


var namespace2 = _interopRequireWildcard(require("black"));
Object.defineProperty(exports, "namespace1", {
  enumerable: true,
  get: function () {
    return namespace1();
  }
});
exports.namespace2 = namespace2;

"#
);

// interop_export_from_3
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_3,
    r#"
export {foo, bar} from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.defineProperty(exports, "foo", {
  enumerable: true,
  get: function () {
    return _foo.foo;
  }
});
Object.defineProperty(exports, "bar", {
  enumerable: true,
  get: function () {
    return _foo.bar;
  }
});

"#
);

// lazy_dep_reexport_named
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_reexport_named,
    r#"
import { named } from "foo";
export { named };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function _foo() {
  const data = require("foo");

  _foo = function () {
    return data;
  };

  return data;
}
Object.defineProperty(exports, "named", {
  enumerable: true,
  get: function () {
    return _foo().named;
  }
});


"#
);

// auxiliary_comment_overview
test!(
    // Comment is not supported yet
    ignore,
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    auxiliary_comment_overview,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";
import foo from "foo2";
import * as foo2 from "foo3";
import {bar} from "foo4";
import {foo as bar2} from "foo5";

var test;
export {test};
export var test2 = 5;

bar(foo, bar2);

/* my comment */
bar2;
foo;

"#,
    r#"
/*before*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test2 = exports.test = void 0;

/*after*/

/*before*/
require("foo")
/*after*/
;

/*before*/
require("foo-bar")
/*after*/
;

/*before*/
require("./directory/foo-bar")
/*after*/
;

var
/*before*/
_foo2 = _interopRequireDefault(require("foo2"))
/*after*/
;

var
/*before*/
foo2 = _interopRequireDefault(require("foo3"))
/*after*/
;

var
/*before*/
_foo4 = require("foo4")
/*after*/
;

var
/*before*/
_foo5 = require("foo5")
/*after*/
;

var test;

/*before*/
exports.test = test;

/*after*/
var test2 = 5;

/*before*/
exports.test2 = test2;

/*after*/

/*before*/
(0,
/*after*/

/*before*/
_foo4
/*after*/
.
/*before*/
bar)
/*after*/
(
/*before*/
_foo2
/*after*/
.
/*before*/
default
/*after*/
,
/*before*/
_foo5
/*after*/
.
/*before*/
foo
/*after*/
);
/* my comment */

/*before*/
_foo5
/*after*/
.
/*before*/
foo
/*after*/
;

/*before*/
_foo2
/*after*/
.
/*before*/
default
/*after*/
;

"#
);

// misc_module_exports

// interop_imports_default
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_imports_default,
    r#"
import foo from "foo";
import {default as foo2} from "foo";

foo;
foo2;

"#,
    r#"
"use strict";

var _foo = _interopRequireDefault(require("foo"));

_foo.default;
_foo.default;

"#
);

// misc_undefined_this_root_reference
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    misc_undefined_this_root_reference,
    r#"
this;

"#,
    r#"
"use strict";

void 0;

"#
);

// regression_t7272

// interop_export_default_10
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_10,
    r#"
export default (function(){return "foo"})();

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function () {
  return "foo";
}();

exports.default = _default;

"#
);

// lazy_whitelist_import_named
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_import_named,
    r#"
import { foo1 } from "white";

function use1() {
  console.log(foo1);
}

import { foo2 } from "black";

function use2() {
  console.log(foo2);
}

"#,
    r#"
"use strict";

function _white() {
  const data = require("white");

  _white = function () {
    return data;
  };

  return data;
}

var _black = require("black");

function use1() {
  console.log(_white().foo1);
}
function use2() {
  console.log(_black.foo2);
}

"#
);

// interop_export_default
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default,
    r#"
export default 42;

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = 42;
exports.default = _default;

"#
);

// strict

// lazy_local_import_namespace
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_import_namespace,
    r#"
import * as foo from "./foo";

console.log(foo);

"#,
    r#"
"use strict";

var foo = _interopRequireWildcard(require("./foo"));
console.log(foo);

"#
);

// interop

// interop_export_default_7
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_7,
    r#"
export default function foo () {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function foo() {}

exports.default = foo;

"#
);

// lazy_whitelist_reexport_named
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_reexport_named,
    r#"
import { named1 } from "white";
export { named1 };

import { named2 } from "black";
export { named2 };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _white() {
  const data = require("white");

  _white = function () {
    return data;
  };

  return data;
}

var _black = require("black");

Object.defineProperty(exports, "named1", {
  enumerable: true,
  get: function () {
    return _white().named1;
  }
});
Object.defineProperty(exports, "named2", {
  enumerable: true,
  get: function () {
    return _black.named2;
  }
});




"#
);

// lazy_dep

// interop_export_from
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_1,
    r#"
export * from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.keys(_foo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _foo[key];
    }
  });
});

"#
);

// disable_strict_mode_strict_mode_false
test!(
    syntax(),
    |_| tr(Config {
        strict_mode: false,
        ..Default::default()
    }),
    disable_strict_mode_strict_mode_false,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";

"#,
    r#"
require("foo");

require("foo-bar");

require("./directory/foo-bar");

"#
);

// interop_export_from_6
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_6,
    r#"
export {foo as default, bar} from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _foo.foo;
  }
});
Object.defineProperty(exports, "bar", {
  enumerable: true,
  get: function () {
    return _foo.bar;
  }
});

"#
);

// interop_export_from_5
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_5,
    r#"
export {foo as default} from "foo";

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _foo.foo;
  }
});

"#
);

// strict_import
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_import,
    r#"
import foo from "foo";
import { default as foo2 } from "foo";
import { foo3 } from "foo";
import * as foo4 from "foo";

foo;
foo2;
foo3;
foo3();

"#,
    r#"
"use strict";

var foo4 = _interopRequireWildcard(require("foo"));
foo4.default;
foo4.default;
foo4.foo3;
(0, foo4).foo3();

"#
);

// interop_export_named_2
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_named_2,
    r#"
var foo, bar;
export {foo, bar};

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = exports.foo = void 0;
var foo, bar;
exports.foo = foo;
exports.bar = bar;

"#
);

// lazy_whitelist_import_default
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_import_default,
    r#"
import foo1 from "white";

console.log(foo1);

import foo2 from "black";

console.log(foo2);

"#,
    r#"
"use strict";

var _white = _interopRequireDefault(require("white"));
var _black = _interopRequireDefault(require('black'));

console.log(_white.default);
console.log(_black.default);

"#
);

// interop_imports
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_imports,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";

"#,
    r#"
"use strict";

require("foo");

require("foo-bar");

require("./directory/foo-bar");

"#
);

// lazy_local

// strict_export_const_destructuring_object
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_object,
    r#"
export const { foo: bar, baz } = {};

"#,
    r#"
"use strict";

exports.baz = exports.bar = void 0;
const {
  foo: bar,
  baz
} = {};
exports.bar = bar;
exports.baz = baz;

"#
);

// regression_issue_9155

// update_expression_negative_suffix
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    update_expression_negative_suffix,
    r#"
export let diffLevel = 0;

export function diff() {
  if (!--diffLevel) {
    console.log("hey");
  }
}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffLevel = void 0;
let diffLevel = 0;
exports.diffLevel = diffLevel;

function diff() {
  if (!(exports.diffLevel = diffLevel = +diffLevel - 1)) {
    console.log("hey");
  }
}

"#
);

// interop_module_shadow
test!(
    // TODO(kdy1): Unignore this
    ignore,
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_module_shadow,
    r#"
export function module() {

}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.module = _module;

function _module() {}

"#
);

// strict_export_const_destructuring_object_rest
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_object_rest,
    r#"
export const { foo, ...bar } = {};

"#,
    r#"
"use strict";

exports.bar = exports.foo = void 0;
const {
  foo,
  ...bar
} = {};
exports.foo = foo;
exports.bar = bar;

"#
);

// lazy_whitelist_sideeffect
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_sideeffect,
    r#"
import "white";
import "black";

"#,
    r#"
"use strict";

require("white");

require("black");

"#
);

// lazy_dep_reexport_namespace
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_reexport_namespace,
    r#"
import * as namespace from "foo";
export { namespace };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function namespace() {
  const data = _interopRequireWildcard(require("foo"));

  namespace = function () {
    return data;
  };

  return data;
}


Object.defineProperty(exports, "namespace", {
  enumerable: true,
  get: function () {
    return namespace();
  }
});

"#
);

// interop_export_default_4
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_4,
    r#"
export default foo;

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = foo;
exports.default = _default;

"#
);

// no_interop_export_from
test!(
    syntax(),
    |_| tr(Config {
        no_interop: true,
        ..Default::default()
    }),
    no_interop_export_from,
    r#"
export { default } from 'foo';

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _foo = require("foo");
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _foo.default;
  }
});


"#
);

// regression_es3_compatibility

// lazy_dep_sideeffect
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_sideeffect,
    r#"
import "foo";

"#,
    r#"
"use strict";

require("foo");

"#
);

// interop_export_from_8
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_from_8,
    r#"
import { foo, foo1, foo2, foo3, foo4, foo5, foo6, foo7, foo8, foo9, foo10, foo11, foo12,
    foo13, foo14, foo15, foo16, foo17, foo18, foo19, foo20, foo21, foo22, foo23, foo24, foo25,
    foo26, foo27, foo28, foo29, foo30, foo31, foo32, foo33, foo34, foo35, foo36, foo37, foo38,
    foo39, foo40, foo41, foo42, foo43, foo44, foo45, foo46, foo47, foo48, foo49, foo50, foo51,
    foo52, foo53, foo54, foo55, foo56, foo57, foo58, foo59, foo60, foo61, foo62, foo63, foo64,
    foo65, foo66, foo67, foo68, foo69, foo70, foo71, foo72, foo73, foo74, foo75, foo76, foo77,
    foo78, foo79, foo80, foo81, foo82, foo83, foo84, foo85, foo86, foo87, foo88, foo89, foo90,
    foo91, foo92, foo93, foo94, foo95, foo96, foo97, foo98, foo99, foo100 } from "foo";
export { foo, foo1, foo2, foo3, foo4, foo5, foo6, foo7, foo8, foo9, foo10, foo11, foo12,
    foo13, foo14, foo15, foo16, foo17, foo18, foo19, foo20, foo21, foo22, foo23, foo24, foo25,
    foo26, foo27, foo28, foo29, foo30, foo31, foo32, foo33, foo34, foo35, foo36, foo37, foo38,
    foo39, foo40, foo41, foo42, foo43, foo44, foo45, foo46, foo47, foo48, foo49, foo50, foo51,
    foo52, foo53, foo54, foo55, foo56, foo57, foo58, foo59, foo60, foo61, foo62, foo63, foo64,
    foo65, foo66, foo67, foo68, foo69, foo70, foo71, foo72, foo73, foo74, foo75, foo76, foo77,
    foo78, foo79, foo80, foo81, foo82, foo83, foo84, foo85, foo86, foo87, foo88, foo89, foo90,
    foo91, foo92, foo93, foo94, foo95, foo96, foo97, foo98, foo99, foo100 }
"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("foo");

Object.defineProperty(exports, "foo", {
  enumerable: true,
  get: function () {
    return _foo.foo;
  }
});
Object.defineProperty(exports, "foo1", {
  enumerable: true,
  get: function () {
    return _foo.foo1;
  }
});
Object.defineProperty(exports, "foo2", {
  enumerable: true,
  get: function () {
    return _foo.foo2;
  }
});
Object.defineProperty(exports, "foo3", {
  enumerable: true,
  get: function () {
    return _foo.foo3;
  }
});
Object.defineProperty(exports, "foo4", {
  enumerable: true,
  get: function () {
    return _foo.foo4;
  }
});
Object.defineProperty(exports, "foo5", {
  enumerable: true,
  get: function () {
    return _foo.foo5;
  }
});
Object.defineProperty(exports, "foo6", {
  enumerable: true,
  get: function () {
    return _foo.foo6;
  }
});
Object.defineProperty(exports, "foo7", {
  enumerable: true,
  get: function () {
    return _foo.foo7;
  }
});
Object.defineProperty(exports, "foo8", {
  enumerable: true,
  get: function () {
    return _foo.foo8;
  }
});
Object.defineProperty(exports, "foo9", {
  enumerable: true,
  get: function () {
    return _foo.foo9;
  }
});
Object.defineProperty(exports, "foo10", {
  enumerable: true,
  get: function () {
    return _foo.foo10;
  }
});
Object.defineProperty(exports, "foo11", {
  enumerable: true,
  get: function () {
    return _foo.foo11;
  }
});
Object.defineProperty(exports, "foo12", {
  enumerable: true,
  get: function () {
    return _foo.foo12;
  }
});
Object.defineProperty(exports, "foo13", {
  enumerable: true,
  get: function () {
    return _foo.foo13;
  }
});
Object.defineProperty(exports, "foo14", {
  enumerable: true,
  get: function () {
    return _foo.foo14;
  }
});
Object.defineProperty(exports, "foo15", {
  enumerable: true,
  get: function () {
    return _foo.foo15;
  }
});
Object.defineProperty(exports, "foo16", {
  enumerable: true,
  get: function () {
    return _foo.foo16;
  }
});
Object.defineProperty(exports, "foo17", {
  enumerable: true,
  get: function () {
    return _foo.foo17;
  }
});
Object.defineProperty(exports, "foo18", {
  enumerable: true,
  get: function () {
    return _foo.foo18;
  }
});
Object.defineProperty(exports, "foo19", {
  enumerable: true,
  get: function () {
    return _foo.foo19;
  }
});
Object.defineProperty(exports, "foo20", {
  enumerable: true,
  get: function () {
    return _foo.foo20;
  }
});
Object.defineProperty(exports, "foo21", {
  enumerable: true,
  get: function () {
    return _foo.foo21;
  }
});
Object.defineProperty(exports, "foo22", {
  enumerable: true,
  get: function () {
    return _foo.foo22;
  }
});
Object.defineProperty(exports, "foo23", {
  enumerable: true,
  get: function () {
    return _foo.foo23;
  }
});
Object.defineProperty(exports, "foo24", {
  enumerable: true,
  get: function () {
    return _foo.foo24;
  }
});
Object.defineProperty(exports, "foo25", {
  enumerable: true,
  get: function () {
    return _foo.foo25;
  }
});
Object.defineProperty(exports, "foo26", {
  enumerable: true,
  get: function () {
    return _foo.foo26;
  }
});
Object.defineProperty(exports, "foo27", {
  enumerable: true,
  get: function () {
    return _foo.foo27;
  }
});
Object.defineProperty(exports, "foo28", {
  enumerable: true,
  get: function () {
    return _foo.foo28;
  }
});
Object.defineProperty(exports, "foo29", {
  enumerable: true,
  get: function () {
    return _foo.foo29;
  }
});
Object.defineProperty(exports, "foo30", {
  enumerable: true,
  get: function () {
    return _foo.foo30;
  }
});
Object.defineProperty(exports, "foo31", {
  enumerable: true,
  get: function () {
    return _foo.foo31;
  }
});
Object.defineProperty(exports, "foo32", {
  enumerable: true,
  get: function () {
    return _foo.foo32;
  }
});
Object.defineProperty(exports, "foo33", {
  enumerable: true,
  get: function () {
    return _foo.foo33;
  }
});
Object.defineProperty(exports, "foo34", {
  enumerable: true,
  get: function () {
    return _foo.foo34;
  }
});
Object.defineProperty(exports, "foo35", {
  enumerable: true,
  get: function () {
    return _foo.foo35;
  }
});
Object.defineProperty(exports, "foo36", {
  enumerable: true,
  get: function () {
    return _foo.foo36;
  }
});
Object.defineProperty(exports, "foo37", {
  enumerable: true,
  get: function () {
    return _foo.foo37;
  }
});
Object.defineProperty(exports, "foo38", {
  enumerable: true,
  get: function () {
    return _foo.foo38;
  }
});
Object.defineProperty(exports, "foo39", {
  enumerable: true,
  get: function () {
    return _foo.foo39;
  }
});
Object.defineProperty(exports, "foo40", {
  enumerable: true,
  get: function () {
    return _foo.foo40;
  }
});
Object.defineProperty(exports, "foo41", {
  enumerable: true,
  get: function () {
    return _foo.foo41;
  }
});
Object.defineProperty(exports, "foo42", {
  enumerable: true,
  get: function () {
    return _foo.foo42;
  }
});
Object.defineProperty(exports, "foo43", {
  enumerable: true,
  get: function () {
    return _foo.foo43;
  }
});
Object.defineProperty(exports, "foo44", {
  enumerable: true,
  get: function () {
    return _foo.foo44;
  }
});
Object.defineProperty(exports, "foo45", {
  enumerable: true,
  get: function () {
    return _foo.foo45;
  }
});
Object.defineProperty(exports, "foo46", {
  enumerable: true,
  get: function () {
    return _foo.foo46;
  }
});
Object.defineProperty(exports, "foo47", {
  enumerable: true,
  get: function () {
    return _foo.foo47;
  }
});
Object.defineProperty(exports, "foo48", {
  enumerable: true,
  get: function () {
    return _foo.foo48;
  }
});
Object.defineProperty(exports, "foo49", {
  enumerable: true,
  get: function () {
    return _foo.foo49;
  }
});
Object.defineProperty(exports, "foo50", {
  enumerable: true,
  get: function () {
    return _foo.foo50;
  }
});
Object.defineProperty(exports, "foo51", {
  enumerable: true,
  get: function () {
    return _foo.foo51;
  }
});
Object.defineProperty(exports, "foo52", {
  enumerable: true,
  get: function () {
    return _foo.foo52;
  }
});
Object.defineProperty(exports, "foo53", {
  enumerable: true,
  get: function () {
    return _foo.foo53;
  }
});
Object.defineProperty(exports, "foo54", {
  enumerable: true,
  get: function () {
    return _foo.foo54;
  }
});
Object.defineProperty(exports, "foo55", {
  enumerable: true,
  get: function () {
    return _foo.foo55;
  }
});
Object.defineProperty(exports, "foo56", {
  enumerable: true,
  get: function () {
    return _foo.foo56;
  }
});
Object.defineProperty(exports, "foo57", {
  enumerable: true,
  get: function () {
    return _foo.foo57;
  }
});
Object.defineProperty(exports, "foo58", {
  enumerable: true,
  get: function () {
    return _foo.foo58;
  }
});
Object.defineProperty(exports, "foo59", {
  enumerable: true,
  get: function () {
    return _foo.foo59;
  }
});
Object.defineProperty(exports, "foo60", {
  enumerable: true,
  get: function () {
    return _foo.foo60;
  }
});
Object.defineProperty(exports, "foo61", {
  enumerable: true,
  get: function () {
    return _foo.foo61;
  }
});
Object.defineProperty(exports, "foo62", {
  enumerable: true,
  get: function () {
    return _foo.foo62;
  }
});
Object.defineProperty(exports, "foo63", {
  enumerable: true,
  get: function () {
    return _foo.foo63;
  }
});
Object.defineProperty(exports, "foo64", {
  enumerable: true,
  get: function () {
    return _foo.foo64;
  }
});
Object.defineProperty(exports, "foo65", {
  enumerable: true,
  get: function () {
    return _foo.foo65;
  }
});
Object.defineProperty(exports, "foo66", {
  enumerable: true,
  get: function () {
    return _foo.foo66;
  }
});
Object.defineProperty(exports, "foo67", {
  enumerable: true,
  get: function () {
    return _foo.foo67;
  }
});
Object.defineProperty(exports, "foo68", {
  enumerable: true,
  get: function () {
    return _foo.foo68;
  }
});
Object.defineProperty(exports, "foo69", {
  enumerable: true,
  get: function () {
    return _foo.foo69;
  }
});
Object.defineProperty(exports, "foo70", {
  enumerable: true,
  get: function () {
    return _foo.foo70;
  }
});
Object.defineProperty(exports, "foo71", {
  enumerable: true,
  get: function () {
    return _foo.foo71;
  }
});
Object.defineProperty(exports, "foo72", {
  enumerable: true,
  get: function () {
    return _foo.foo72;
  }
});
Object.defineProperty(exports, "foo73", {
  enumerable: true,
  get: function () {
    return _foo.foo73;
  }
});
Object.defineProperty(exports, "foo74", {
  enumerable: true,
  get: function () {
    return _foo.foo74;
  }
});
Object.defineProperty(exports, "foo75", {
  enumerable: true,
  get: function () {
    return _foo.foo75;
  }
});
Object.defineProperty(exports, "foo76", {
  enumerable: true,
  get: function () {
    return _foo.foo76;
  }
});
Object.defineProperty(exports, "foo77", {
  enumerable: true,
  get: function () {
    return _foo.foo77;
  }
});
Object.defineProperty(exports, "foo78", {
  enumerable: true,
  get: function () {
    return _foo.foo78;
  }
});
Object.defineProperty(exports, "foo79", {
  enumerable: true,
  get: function () {
    return _foo.foo79;
  }
});
Object.defineProperty(exports, "foo80", {
  enumerable: true,
  get: function () {
    return _foo.foo80;
  }
});
Object.defineProperty(exports, "foo81", {
  enumerable: true,
  get: function () {
    return _foo.foo81;
  }
});
Object.defineProperty(exports, "foo82", {
  enumerable: true,
  get: function () {
    return _foo.foo82;
  }
});
Object.defineProperty(exports, "foo83", {
  enumerable: true,
  get: function () {
    return _foo.foo83;
  }
});
Object.defineProperty(exports, "foo84", {
  enumerable: true,
  get: function () {
    return _foo.foo84;
  }
});
Object.defineProperty(exports, "foo85", {
  enumerable: true,
  get: function () {
    return _foo.foo85;
  }
});
Object.defineProperty(exports, "foo86", {
  enumerable: true,
  get: function () {
    return _foo.foo86;
  }
});
Object.defineProperty(exports, "foo87", {
  enumerable: true,
  get: function () {
    return _foo.foo87;
  }
});
Object.defineProperty(exports, "foo88", {
  enumerable: true,
  get: function () {
    return _foo.foo88;
  }
});
Object.defineProperty(exports, "foo89", {
  enumerable: true,
  get: function () {
    return _foo.foo89;
  }
});
Object.defineProperty(exports, "foo90", {
  enumerable: true,
  get: function () {
    return _foo.foo90;
  }
});
Object.defineProperty(exports, "foo91", {
  enumerable: true,
  get: function () {
    return _foo.foo91;
  }
});
Object.defineProperty(exports, "foo92", {
  enumerable: true,
  get: function () {
    return _foo.foo92;
  }
});
Object.defineProperty(exports, "foo93", {
  enumerable: true,
  get: function () {
    return _foo.foo93;
  }
});
Object.defineProperty(exports, "foo94", {
  enumerable: true,
  get: function () {
    return _foo.foo94;
  }
});
Object.defineProperty(exports, "foo95", {
  enumerable: true,
  get: function () {
    return _foo.foo95;
  }
});
Object.defineProperty(exports, "foo96", {
  enumerable: true,
  get: function () {
    return _foo.foo96;
  }
});
Object.defineProperty(exports, "foo97", {
  enumerable: true,
  get: function () {
    return _foo.foo97;
  }
});
Object.defineProperty(exports, "foo98", {
  enumerable: true,
  get: function () {
    return _foo.foo98;
  }
});
Object.defineProperty(exports, "foo99", {
  enumerable: true,
  get: function () {
    return _foo.foo99;
  }
});
Object.defineProperty(exports, "foo100", {
  enumerable: true,
  get: function () {
    return _foo.foo100;
  }
});

"#
);

// strict_export_const_destructuring_array_default_params
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_array_default_params,
    r#"
export const [foo, bar = 2] = [];

"#,
    r#"
"use strict";

exports.bar = exports.foo = void 0;
const [foo, bar = 2] = [];
exports.foo = foo;
exports.bar = bar;

"#
);

// interop_imports_named
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_imports_named,
    r#"
import {bar} from "foo";
import {bar2, baz} from "foo";
import {bar as baz2} from "foo";
import {bar as baz3, xyz} from "foo";

bar;
bar2;
baz;
baz2;
baz3;
xyz;

"#,
    r#"
"use strict";

var _foo = require("foo");

_foo.bar;
_foo.bar2;
_foo.baz;
_foo.bar;
_foo.bar;
_foo.xyz;

"#
);

// regression_es3_compatibility_named_class

// disable_strict_mode

// lazy_whitelist_import_namespace
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::List(vec!["white".into()]),
        ..Default::default()
    }),
    lazy_whitelist_import_namespace,
    r#"
import * as foo1 from "white";

function use1(){
  console.log(foo1);
}

import * as foo2 from "black";

function use2(){
  console.log(foo2);
}

"#,
    r#"
"use strict";

function foo1() {
  const data = _interopRequireWildcard(require("white"));

  foo1 = function () {
    return data;
  };

  return data;
}
var foo2 = _interopRequireWildcard(require("black"));

function use1() {
  console.log(foo1());
}
function use2() {
  console.log(foo2);
}

"#
);

// lazy_dep_import_named
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_import_named,
    r#"
import { foo } from "foo";

function use() {
  console.log(foo);
}

"#,
    r#"
"use strict";

function _foo() {
  const data = require("foo");

  _foo = function () {
    return data;
  };

  return data;
}

function use() {
  console.log(_foo().foo);
}

"#
);

// lazy_dep_reexport_default
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_reexport_default,
    r#"
import foo from "foo";
export { foo as default };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _foo() {
  const data = _interopRequireDefault(require("foo"));

  _foo = function () {
    return data;
  };

  return data;
}

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _foo().default;
  }
});

"#
);

// interop_export_default_9
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_default_9,
    r#"
var foo;
export { foo as default };


"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var foo;
exports.default = foo;

"#
);

// misc_undefined_this_arrow_function
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    misc_undefined_this_arrow_function,
    r#"
var foo = () => this;

"#,
    r#"
"use strict";

var foo = () => void 0;

"#
);

// misc_undefined_this_root_call
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    misc_undefined_this_root_call,
    r#"
this.foo();

"#,
    r#"
"use strict";

(void 0).foo();

"#
);

// strict_import_wildcard
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_import_wildcard,
    r#"
import * as foo from 'foo';

foo.bar();
foo.baz();

"#,
    r#"
"use strict";

var foo = _interopRequireWildcard(require("foo"));
foo.bar();
foo.baz();

"#
);

// lazy_dep_import_default
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_dep_import_default,
    r#"
import foo from "foo";

function use() {
  console.log(foo);
}
"#,
    r#"
"use strict";

function _foo() {
  const data = _interopRequireDefault(require("foo"));

  _foo = function () {
    return data;
  };

  return data;
}

function use() {
  console.log(_foo().default);
}
"#
);

// lazy_local_reexport_named
test!(
    syntax(),
    |_| tr(Config {
        lazy: Lazy::Bool(true),
        ..Default::default()
    }),
    lazy_local_reexport_named,
    r#"
import { named } from "./foo";
export { named };

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _foo = require("./foo");

Object.defineProperty(exports, "named", {
  enumerable: true,
  get: function () {
    return _foo.named;
  }
});
"#
);

// strict_export_const_destructuring_array_rest
test!(
    syntax(),
    |_| tr(Config {
        strict: true,
        ..Default::default()
    }),
    strict_export_const_destructuring_array_rest,
    r#"
export const [foo, bar, ...baz] = [];

"#,
    r#"
"use strict";

exports.baz = exports.bar = exports.foo = void 0;
const [foo, bar, ...baz] = [];
exports.foo = foo;
exports.bar = bar;
exports.baz = baz;

"#
);

// update_expression

// misc_reference_source_map_source

// interop_illegal_export_esmodule

// interop_imports_mixing
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_imports_mixing,
    r#"
import foo, {baz as xyz} from "foo";

foo;
xyz;

"#,
    r#"
"use strict";

var _foo = _interopRequireWildcard(require("foo"));

_foo.default;
_foo.baz;

"#
);

// interop_overview
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_overview,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";
import foo from "foo2";
import * as foo2 from "foo3";
import {bar} from "foo4";
import {foo as bar2} from "foo5";

var test;
export {test};
export var test2 = 5;

bar;
bar2;
foo;

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test2 = exports.test = void 0;

require("foo");

require("foo-bar");

require("./directory/foo-bar");

var _foo2 = _interopRequireDefault(require("foo2"));

var foo2 = _interopRequireWildcard(require("foo3"));

var _foo4 = require("foo4");

var _foo5 = require("foo5");

var test;
exports.test = test;
var test2 = 5;
exports.test2 = test2;
_foo4.bar;
_foo5.foo;
_foo2.default;

"#
);

// interop_imports_hoisting

// interop_export_all
test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    interop_export_all,
    r#"
// The fact that this exports both a normal default, and all of the names via
// re-export is an edge case that is important not to miss. See
// https://github.com/babel/babel/issues/8306 as an example.
import _default from 'react';
export default _default;
export * from 'react';

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};

exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));


// The fact that this exports both a normal default, and all of the names via
// re-export is an edge case that is important not to miss. See
// https://github.com/babel/babel/issues/8306 as an example.
var _default = _react.default;
exports.default = _default;

Object.keys(_react).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _react[key];
    }
  });
});

"#
);

// lazy_whitelist

// auxiliary_comment

// source_map_exec
test_exec!(
    // We cannot inject transform at this time.
    ignore,
    syntax(),
    |_| tr(Default::default()),
    source_map_exec,
    r#"
var tests = [
  'import "foo";',
  'import foo from "foo";',
  'import {default as foo2} from "foo";',
  'import * as foo from "foo";',
  'import {bar} from "foo";',
  'import {bar2, baz} from "foo";',
  'import {bar as baz2} from "foo";',
  'import {bar as baz3, xyz} from "foo";',
  'import bar, * as bar2 from "foo";',
  'import bar, {bar2, bar3 as bar4} from "foo";',

  'export var a;',
  'export default function(){};',
  'export default function f(){};',
  'export default 42;',
  'export {foo}; var foo;',
  'export { foo as default }; var foo;',
  'export * from "foo";',
  'export {foo} from "foo";',
  'export {default as foo} from "foo";',
];

tests.forEach(function (code) {
  var res = transform(code, {
    sourceMap: true,
    plugins: opts.plugins
  });

  // Should create mapping
  expect(res.map.mappings).not.toBe('');
});

"#
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_396_1,
    "
function foo() {
  bar;
  function bar() {}
}
",
    "
'use strict';
function foo() {
    bar;
    function bar() {
    }
}
"
);

test!(
    syntax(),
    |_| {
        let mark = Mark::fresh(Mark::root());

        chain!(
            resolver_with_mark(mark),
            block_scoped_functions(),
            block_scoping(),
            common_js(mark, Default::default()),
        )
    },
    issue_396_2,
    "
function foo() {
  bar;
  function bar() {}
}
",
    "
'use strict';
function foo() {
  var bar = function bar() {
  };
  bar;
}
"
);

test!(
    syntax(),
    |_| tr(Config {
        strict: false,
        strict_mode: true,
        no_interop: true,
        ..Default::default()
    }),
    issue_456_1,
    "import { join as e } from 'path';
export const foo = function () {
  function e(t) {}
  return A(e, {}), e
}();",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.foo = void 0;
var _path = require('path');
const foo = function() {
    function e(t) {
    }
    return A(e, {}), e;
}();
exports.foo = foo;
"
);

test!(
    syntax(),
    |_| tr(Config {
        strict: false,
        strict_mode: true,
        no_interop: true,
        ..Default::default()
    }),
    issue_456_2,
    "import { join as e } from 'path';
export const foo = function () {
  var e = 1;
  return A(e, {}), e
}();",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.foo = void 0;
var _path = require('path');
const foo = function() {
    var e = 1;
    return A(e, {
    }), e;
}();
exports.foo = foo;"
);

test!(
    syntax(),
    |_| tr(Config {
        strict: false,
        strict_mode: true,
        no_interop: true,
        ..Default::default()
    }),
    issue_605,
    "export * from 'c';",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
var _c = require('c');
Object.keys(_c).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _c[key];
        }
    });
});
"
);

test!(
    syntax(),
    |_| tr(Config {
        strict: false,
        strict_mode: true,
        no_interop: true,
        ..Default::default()
    }),
    issue_724,
    "import { MongoClient, Db } from 'mongodb'
    require('foo');",
    "'use strict';
  var _mongodb = require('mongodb');
  require('foo');"
);

test!(
    syntax(),
    |_| tr(Config {
        strict: false,
        strict_mode: true,
        ..Default::default()
    }),
    issue_763,
    "import {
    INSTAGRAM_CHECK_PATTERN,
    RESOURCE_FACEBOOK,
    RESOURCE_INSTAGRAM,
    RESOURCE_WEBSITE,
} from '../../../../consts'

const resources = [
    {
        value: RESOURCE_WEBSITE,
        label: 'Webové stránky',
    },
    {
        value: RESOURCE_FACEBOOK,
        label: 'Facebook',
    },
    {
        value: RESOURCE_INSTAGRAM,
        label: 'Instagram',
    },
]",
    "'use strict';
  var _consts = require('../../../../consts');
  const resources = [
      {
          value: _consts.RESOURCE_WEBSITE,
          label: 'Webové stránky'
      },
      {
          value: _consts.RESOURCE_FACEBOOK,
          label: 'Facebook'
      },
      {
          value: _consts.RESOURCE_INSTAGRAM,
          label: 'Instagram'
      }
  ];"
);

test!(
    ts_syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_895,
    "import { queryString } from './url'

export function setup(url: string, obj: any) {
  const _queryString = queryString(obj)
  const _url = url + '?' + _queryString
  return _url
}",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.setup = setup;
var _url = require('./url');
function setup(url: string, obj: any) {
    const _queryString = (0, _url).queryString(obj);
    const _url1 = url + '?' + _queryString;
    return _url1;
}"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_962,
    "import root from './_root.js';
  import stubFalse from './stubFalse.js';
    
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && \
     module;
    
  var moduleExports = freeModule && freeModule.exports === freeExports;
    
  var Buffer = moduleExports ? root.Buffer : undefined;
    
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
    
  var isBuffer = nativeIsBuffer || stubFalse;
    
  export default isBuffer",
    r#"
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = void 0;
    var _rootJs = _interopRequireDefault(require("./_root.js"));
    var _stubFalseJs = _interopRequireDefault(require("./stubFalse.js"));
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? _rootJs.default.Buffer : undefined;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
    var isBuffer = nativeIsBuffer || _stubFalseJs.default;
    var _default = isBuffer;
    exports.default = _default;
"#
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_1018_1,
    "async function foo() {
    await import('foo');
  }",
    "
  \"use strict\";
  async function foo() {
      await Promise.resolve().then(function() {
          return _interopRequireWildcard(require('foo'));
      });
  }
  "
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_1043_1,
    "
  export * from './http';
  export { Scope } from './interfaces'
  ",
    r#"
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _http = require("./http");
var _interfaces = require("./interfaces");
Object.defineProperty(exports, "Scope", {
    enumerable: true,
    get: function() {
        return _interfaces.Scope;
    }
});
Object.keys(_http).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _http[key];
        }
    });
});
  "#
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_1043_2,
    "
import 'reflect-metadata';

export * from './http';
export { id } from './interfaces';
export * from './pipes';
",
    r#"
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    require("reflect-metadata");
    var _http = require("./http");
    var _interfaces = require("./interfaces");
    var _pipes = require("./pipes");
    Object.defineProperty(exports, "id", {
        enumerable: true,
        get: function() {
            return _interfaces.id;
        }
    });
    Object.keys(_http).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function() {
                return _http[key];
            }
        });
    });
    Object.keys(_pipes).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function() {
                return _pipes[key];
            }
        });
    });
    "#
);

test!(
    syntax(),
    |_| chain!(
        resolver(),
        block_scoping(),
        classes(),
        destructuring(Default::default()),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    issue_578_2,
    "
import { myFunction } from './dep.js'

class SomeClass {
  constructor(properties) {
    this.props = properties;
  }
  call () {
    const {myFunction} = this.props
    if (myFunction) {
      myFunction()
    } else {
      console.log('DID NOT WORK!')
    }
  }
}

let instance = new SomeClass({
  myFunction: () => {
    console.log('CORRECT FUNCTION CALLED')
  }
});

instance.call()",
    "'use strict';
var _depJs = require('./dep.js');
let SomeClass = function() {
    'use strict';
    function SomeClass(properties) {
        _classCallCheck(this, SomeClass);
        this.props = properties;
    }
    _createClass(SomeClass, [{
            key: 'call',
            value: function call() {
                var _props = this.props, myFunction = _props.myFunction;
                if (myFunction) {
                    myFunction();
                } else {
                    console.log('DID NOT WORK!');
                }
            }
        }]);
    return SomeClass;
}();
var instance = new SomeClass({
    myFunction: ()=>{
        console.log('CORRECT FUNCTION CALLED');
    }
});
instance.call();",
    ok_if_code_eq
);

// for_of_as_array_for_of_import_commonjs
test!(
    syntax(),
    |_| chain!(
        for_of(for_of::Config { assume_array: true }),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    for_of_as_array_for_of_import_commonjs,
    r#"
import { array } from "foo";

for (const elm of array) {
console.log(elm);
}

"#,
    r#"
"use strict";

var _foo = require("foo");

for(let _i = 0; _i < _foo.array.length; _i++){
const elm = _foo.array[_i];
console.log(elm);
}

"#
);

// regression_t7178
test!(
    syntax(),
    |_| chain!(
        resolver(),
        object_rest_spread(),
        destructuring(destructuring::Config { loose: false }),
        common_js(Mark::fresh(Mark::root()), Default::default()),
    ),
    regression_t7178,
    r#"
import props from "props";

console.log(props);

(function(){
const { ...props } = this.props;

console.log(props);
})();

"#,
    r#"
"use strict";

var _props = _interopRequireDefault(require("props"));

console.log(_props.default);

(function () {
const props = _extends({}, this.props);
console.log(props);
})();

"#
);

// regression_4209
test!(
    syntax(),
    |_| chain!(
        classes(),
        parameters(),
        destructuring(Default::default()),
        block_scoping(),
        common_js(Mark::fresh(Mark::root()), Default::default()),
    ),
    regression_4209,
    r#"
import { copy } from './copyPaste';

class Thing {
handleCopySomething() {
  copy();
}

completelyUnrelated(copy = 123) {
}
}

"#,
    r#"
"use strict";

var _copyPaste = require("./copyPaste");

var Thing =
/*#__PURE__*/
function () {
'use strict';
function Thing() {
  _classCallCheck(this, Thing);
}

_createClass(Thing, [{
  key: "handleCopySomething",
  value: function handleCopySomething() {
    (0, _copyPaste).copy();
  }
}, {
  key: "completelyUnrelated",
  value: function completelyUnrelated(param) {
    var copy = param === void 0 ? 123 : param;
  }
}]);

return Thing;
}();

"#
);

// regression_6647
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    regression_6647,
    r#"
import a from 'a';
a.preview(...c);

"#,
    r#"
'use strict';
var _a = _interopRequireDefault(require('a'));
var _a1;
(_a1 = _a.default).preview.apply(_a1, _toConsumableArray(c));
"#
);

// regression_6733
test!(
    syntax(),
    |_| chain!(
        resolver(),
        regenerator(Mark::fresh(Mark::root())),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    regression_6733,
    r#"
export default function * () {
var x = yield 5;
return 5;
}

"#,
    r#"
'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
var regeneratorRuntime = require('regenerator-runtime');
var _default = function _callee() {
  var x;
  return regeneratorRuntime.wrap(function _callee$(_ctx) {
      while(1)switch(_ctx.prev = _ctx.next){
          case 0:
              _ctx.next = 2;
              return 5;
          case 2:
              x = _ctx.sent;
              return _ctx.abrupt('return', 5);
          case 4:
          case 'end': return _ctx.stop();
      }
  }, _callee);
};
exports.default = _default;
"#
);

// test interop between cjs module and regenerator
test!(
    syntax(),
    |_| {
        let mark = Mark::fresh(Mark::root());

        chain!(regenerator(mark), common_js(mark, Default::default()),)
    },
    issue_831_2,
    "export function* myGenerator() {
      yield* [1,2,3];
  }",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.myGenerator = myGenerator;
var regeneratorRuntime = require('regenerator-runtime');
var _marked = regeneratorRuntime.mark(myGenerator);
function myGenerator() {
  return regeneratorRuntime.wrap(function myGenerator$(_ctx) {
      while(1)switch(_ctx.prev = _ctx.next){
          case 0:
              return _ctx.delegateYield([
                  1,
                  2,
                  3
              ], _ctx.t0, 1);
          case 1:
          case 'end':
              return _ctx.stop();
      }
  }, _marked);
}"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_1213,
    "
    import foo from 'foo';

    class OK {
      constructor() {
        console.log(foo);
      }
    }
    
    export default class NotOK {
      constructor() {
        console.log(foo);
      }
    }
    ",
    "
    'use strict';
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
    exports.default = void 0;
    
    var _foo = _interopRequireDefault(require('foo'));
    
    class OK {
        constructor() {
            console.log(_foo.default);
        }
    }
    class NotOK {
        constructor() {
            console.log(_foo.default);
        }
    }
    exports.default = NotOK;
    "
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_1423_1,
    "
  'use strict';
  import { arrayUtilities } from 'necessary';

  const { second } = arrayUtilities;

  const elements = [1, 2, 3],
      secondElement = second(elements);

  console.log(secondElement)
  ",
    "
  'use strict';
  var _necessary = require('necessary');
  const { second  } = _necessary.arrayUtilities;
  const elements = [
      1,
      2,
      3
  ], secondElement = second(elements);
  console.log(secondElement);
  "
);

test!(
    syntax(),
    |_| tr(Config {
        no_interop: false,
        strict: true,
        strict_mode: true,
        lazy: Lazy::Bool(false)
    }),
    issue_1480_1,
    "
    const { default: ora } = await import('ora')
  ",
    "
    'use strict';
    const { default: ora  } = await Promise.resolve().then(function() {
        return _interopRequireWildcard(require('ora'));
    });
    "
);

test!(
    syntax(),
    |_| tr(Config {
        no_interop: false,
        strict: true,
        strict_mode: true,
        lazy: Lazy::Bool(false)
    }),
    issue_1480_2,
    "
  import * as ora from 'ora'
",
    "
    'use strict';
    var ora = _interopRequireWildcard(require('ora'));
    "
);
