#![cfg(all(
    feature = "swc_ecma_transforms_compat",
    feature = "swc_ecma_transforms_module",
    feature = "swc_ecma_transforms_optimization",
    feature = "swc_ecma_transforms_proposal",
))]

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{arrow, block_scoping, classes, function_name, shorthand},
    es2022::class_properties,
};
use swc_ecma_transforms_module::common_js::common_js;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_testing::test;

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        function_name(),
        block_scoping(unresolved_mark),
    )
}

//macro_rules! identical {
//    ($name:ident, $src:literal) => {
//        test!(syntax(), |_| tr(), $name, $src, $src);
//    };
//}

test!(
    syntax(),
    |_| tr(),
    basic,
    r#"var number = function (x) {
  return x;
};"#
);

test!(
    syntax(),
    |_| tr(),
    assign,
    r#"number = function (x) {
  return x;
};"#
);

test!(
    syntax(),
    |_| tr(),
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
"#
);

test!(
    syntax(),
    |_| tr(),
    class_simple,
    r#"
var Foo = function() {
  var Foo = function () {
   _class_call_check(this, Foo);
  };
  _define_property(Foo, 'num', 0);
  return Foo;
}();
expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe('Foo');
"#
);

test!(
    syntax(),
    |_| tr(),
    issue_288_01,
    "var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};"
);

//identical!(
//    issue_288_02,
//    "function components_Link_extends() {
//      components_Link_extends = Object.assign || function (target) { for (var
// i = 1; i < \     arguments.length; i++) { var source = arguments[i]; for (var
// key in source) { if \     (Object.prototype.hasOwnProperty.call(source, key))
// { target[key] = source[key]; } } } \     return target; };
//    return components_Link_extends.apply(this, arguments); }"
//);

// issues_5004
test!(
    syntax(),
    |_| function_name(),
    issues_5004,
    r#"
export const x = ({x}) => x;
export const y = function () {};

"#
);

//// function_name_export_default_arrow_renaming_module_system
//test!(syntax(),|_| tr("{
//  "plugins": [
//    function_name(),
//    shorthand(),
//    arrow(),
//    "transform-modules-systemjs"
//  ]
//}
//"), function_name_export_default_arrow_renaming_module_system, r#"
//export default (a) => {
//  return { a() { return a } };
//}
//
//"# r#"
//System.register([], function (_export, _context) {
//  "use strict";
//
//  return {
//    setters: [],
//    execute: function () {
//      _export("default", function (_a) {
//        return {
//          a: function a() {
//            return _a;
//          }
//        };
//      });
//    }
//  };
//});
//
//"#);

//// function_name_export_default_arrow_renaming_2
//test!(syntax(),|_| tr("{
//  "presets": ["env"]
//}
//"), function_name_export_default_arrow_renaming_2, r#"
//export default () => ({
//  x: ({x}) => {}
//})
//
//"# r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var _default = function _default() {
//  return {
//    x: function x(_ref) {
//      var _x = _ref.x;
//    }
//  };
//};
//
//exports["default"] = _default;
//
//"#);

// function_name_with_arrow_functions_transform
test!(
    ignore,
    syntax(),
    |_| (arrow(Mark::new()), function_name()),
    function_name_with_arrow_functions_transform,
    r#"
const x = () => x;
const y = x => x();
const z = { z: () => y(x) }.z;

"#
);

// function_name_modules_3
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            function_name(),
            classes(Default::default()),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            common_js(
                Default::default(),
                unresolved_mark,
                Default::default(),
                Default::default(),
            ),
        )
    },
    function_name_modules_3,
    r#"
import {getForm} from "./store"

export default class Login extends React.Component {
  getForm() {
    return getForm().toJS()
  }
}

"#
);

// function_name_basic
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_basic,
    r#"
var g = function () {
  doSmth();
};

"#
);

// function_name_export_default_arrow_renaming
test!(
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        (
            arrow(unresolved_mark),
            shorthand(),
            function_name(),
            common_js(
                Default::default(),
                unresolved_mark,
                Default::default(),
                Default::default(),
            ),
        )
    },
    function_name_export_default_arrow_renaming,
    r#"
export default (a) => {
  return { a() { return a } };
}

"#
);

// issues_7199
test!(
    // Not important
    ignore,
    syntax(),
    |_| function_name(),
    issues_7199,
    r#"
const x = {
  [null]: function () {},
  [/regex/gi]: function () {},
  [`y`]: function () {},
  [`abc${y}def`]: function () {},
  [0]: function () {},
  [false]: function () {},
};

"#
);

//// function_name_export_default_arrow_renaming_3
//test!(syntax(),|_| tr("{
//  "presets": ["env", "react"]
//}
//"), function_name_export_default_arrow_renaming_3, r#"
//export default ({ onClick }) => (
//  <div onClick={() => onClick()} />
//)
//
//
//"# r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var _default = function _default(_ref) {
//  var _onClick = _ref.onClick;
//  return React.createElement("div", {
//    onClick: function onClick() {
//      return _onClick();
//    }
//  });
//};
//
//exports["default"] = _default;
//
//"#);

//// function_name_export_default_arrow_renaming_es3
//test!(syntax(),|_| tr("{
//  "presets": ["env"],
//  "plugins": [
//    "transform-member-expression-literals",
//    "transform-property-literals"
//  ]
//}
//"), function_name_export_default_arrow_renaming_es3, r#"
//export default (a) => {
//  return { a() { return a } };
//}
//
//"# r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var _default = function _default(_a) {
//  return {
//    a: function a() {
//      return _a;
//    }
//  };
//};
//
//exports["default"] = _default;
//
//"#);

// function_name_self_reference
test!(
    // not important
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            function_name(),
            classes(Default::default()),
        )
    },
    function_name_self_reference,
    r#"
var f = function () {
  console.log(f, g);
};

f = null;

"#
);

// function_name_with_arrow_functions_transform_spec
test!(
    ignore,
    syntax(),
    |_| (arrow(Mark::new()), function_name()),
    function_name_with_arrow_functions_transform_spec,
    r#"
// These are actually handled by transform-arrow-functions
const x = () => x;
const y = x => x();
const z = { z: () => y(x) }.z;

"#
);

// function_name_method_definition
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_method_definition,
    r#"
({ x() {} });

"#
);

// function_name_export_default_arrow_renaming_module_es6
test!(
    ignore,
    syntax(),
    |_| (arrow(Mark::new()), shorthand(), function_name()),
    function_name_export_default_arrow_renaming_module_es6,
    r#"
export default (a) => {
  return { a() { return a } };
}

"#
);

// function_name_assignment
test!(
    // not important
    ignore,
    syntax(),
    |_| tr(),
    function_name_assignment,
    r#"
var i = function () {
  i = 5;
};

var j = function () {
  ({ j } = 5);
  ({ y: j } = 5);
  ;
};

"#
);

// function_name_own_bindings
test!(
    // not important
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_own_bindings,
    r#"
var f = function () {
var f = 2;
};

var g = function (g) {
g;
};

var obj = {
f: function (f) {
f;
}
};

"#
);

// decorators_legacy_interop_strict
test!(
    // See: https://github.com/swc-project/swc/issues/421
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
        )
    },
    decorators_legacy_interop_strict,
    r#"
function dec() {}

class A {
@dec a;

@dec b = 123;

c = 456;
}

"#
);

// function_name_function_collision
test!(
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_function_collision,
    r#"
function f() {
f;
}

{
let obj = {
f: function () {
  f;
}
};
}

(function b() {
var obj = {
b: function () {
  b;
}
};

function commit(b) {
b();
}
});

"#
);

// function_name_collisions
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_collisions,
    r#"
var obj = {
    search: function({search}) {
        console.log(search);
    }
};

function search({search}) {
    console.log(search);
}

"#
);

// function_name_modules_2
test!(
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
            common_js(
                Default::default(),
                unresolved_mark,
                Default::default(),
                Default::default(),
            ),
        )
    },
    function_name_modules_2,
    r#"
import last from "lodash/last"

export default class Container {
last(key) {
if (!this.has(key)) {
  return;
}

return last(this.tokens.get(key))
}
}

"#
);

// function_name_await
test!(
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_await,
    r#"
export {};

var obj = { await: function () {} };

"#
);
