#![cfg(all(
    feature = "swc_ecma_transforms_compat",
    feature = "swc_ecma_transforms_module",
    feature = "swc_ecma_transforms_optimization",
    feature = "swc_ecma_transforms_proposal",
))]

use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_compat::es2015::block_scoping;
use swc_ecma_transforms_compat::es2015::classes;
use swc_ecma_transforms_compat::es2015::function_name;
use swc_ecma_transforms_compat::es2015::shorthand;
use swc_ecma_transforms_compat::es2020::class_properties;
use swc_ecma_transforms_module::common_js::common_js;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Fold {
    chain!(resolver(), function_name(), block_scoping())
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
};"#,
    r#"var number = function number(x) {
  return x;
};"#
);

test!(
    syntax(),
    |_| tr(),
    assign,
    r#"number = function (x) {
  return x;
};"#,
    r#"number = function number(x) {
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
"#,
    r#"
var TestClass = {
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

test!(
    syntax(),
    |_| tr(),
    class_simple,
    r#"
var Foo = function() {
  var Foo = function () {
   _classCallCheck(this, Foo);
  };
  _defineProperty(Foo, 'num', 0);
  return Foo;
}();
expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe('Foo');
"#,
    r#"
var Foo = function() {
  var Foo1 = function() {
   _classCallCheck(this, Foo1);
  };
  _defineProperty(Foo1, 'num', 0);
  return Foo1;
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
};",
    "var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || ({
        __proto__: []
      }) instanceof Array && function (d1, b1) {
        d1.__proto__ = b1;
  } || function (d1, b1) {
    for (var p in b1) if (b1.hasOwnProperty(p)) d1[p] = b1[p];
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

"#,
    r#"
export const x = ({
  x
}) => x;
export const y = function y() {};

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
//"#, r#"
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
//"#, r#"
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
    |_| chain!(arrow(), function_name()),
    function_name_with_arrow_functions_transform,
    r#"
const x = () => x;
const y = x => x();
const z = { z: () => y(x) }.z;

"#,
    r#"
const x = function x() {
  return x;
};

const y = function y(x) {
  return x();
};

const z = {
  z: function z() {
    return y(x);
  }
}.z;

"#
);

// function_name_modules_3
test!(
    syntax(),
    |_| chain!(
        resolver(),
        function_name(),
        classes(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    function_name_modules_3,
    r#"
import {getForm} from "./store"

export default class Login extends React.Component {
  getForm() {
    return getForm().toJS()
  }
}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = require("./store");

let Login =
/*#__PURE__*/
function (_Component) {
  'use strict';
  _inherits(Login, _Component);

  function Login() {
    _classCallCheck(this, Login);
    return _possibleConstructorReturn(this, _getPrototypeOf(Login).apply(this, arguments));
  }

  _createClass(Login, [{
    key: "getForm",
    value: function getForm() {
      return (0, _store).getForm().toJS();
    }
  }]);
  return Login;
}(React.Component);

exports.default = Login;

"#
);

// function_name_basic
test!(
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
    function_name_basic,
    r#"
var g = function () {
  doSmth();
};

"#,
    r#"
var g = function g() {
  doSmth();
};

"#
);

// function_name_export_default_arrow_renaming
test!(
    ignore,
    syntax(),
    |_| chain!(
        arrow(),
        shorthand(),
        function_name(),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    function_name_export_default_arrow_renaming,
    r#"
export default (a) => {
  return { a() { return a } };
}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_a) {
  return {
    a: function a() {
      return _a;
    }
  };
};

exports.default = _default;

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

"#,
    r#"
const x = {
  [null]: function _null() {},
  [/regex/gi]: function _regex_gi() {},
  [`y`]: function y() {},
  [`abc${y}def`]: function abcdef() {},
  [0]: function _() {},
  [false]: function _false() {}
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
//"#, r#"
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
//"#, r#"
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
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        function_name(),
        classes()
    ),
    function_name_self_reference,
    r#"
var f = function () {
  console.log(f, g);
};

f = null;

"#,
    r#"
var _f = function f() {
  console.log(_f, g);
};

_f = null;

"#
);

// function_name_with_arrow_functions_transform_spec
test!(
    ignore,
    syntax(),
    |_| chain!(arrow(), function_name()),
    function_name_with_arrow_functions_transform_spec,
    r#"
// These are actually handled by transform-arrow-functions
const x = () => x;
const y = x => x();
const z = { z: () => y(x) }.z;

"#,
    r#"
var _this = this;

// These are actually handled by transform-arrow-functions
const _x = function x() {
  _newArrowCheck(this, _this);
  return _x;
}.bind(this);

const y = function y(x) {
  _newArrowCheck(this, _this);
  return x();
}.bind(this);

const z = {
  z: function z() {
    _newArrowCheck(this, _this);
    return y(_x);
  }.bind(this)
}.z;

"#
);

// function_name_method_definition
test!(
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
    function_name_method_definition,
    r#"
({ x() {} });

"#,
    r#"
({
  x() {}

});

"#
);

// function_name_export_default_arrow_renaming_module_es6
test!(
    ignore,
    syntax(),
    |_| chain!(arrow(), shorthand(), function_name()),
    function_name_export_default_arrow_renaming_module_es6,
    r#"
export default (a) => {
  return { a() { return a } };
}

"#,
    r#"
export default (function (_a) {
  return {
    a: function a() {
      return _a;
    }
  };
});

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

"#,
    r#"
var i = function i1() {
    i = 5;
};
var j = function j1() {
    ({ j  } = 5);
    ({ y: j  } = 5);
    ;
};
"#
);

// function_name_own_bindings
test!(
    // not important
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
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

"#,
    r#"
var f = function f() {
var f = 2;
};

var g = function g(_g) {
_g;
};

var obj = {
f: function f(_f) {
_f;
}
};

"#
);

// decorators_legacy_interop_strict
test!(
    // See: https://github.com/swc-project/swc/issues/421
    ignore,
    syntax(),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
        classes(),
    ),
    decorators_legacy_interop_strict,
    r#"
function dec() {}

class A {
@dec a;

@dec b = 123;

c = 456;
}

"#,
    r#"
var _class, _descriptor, _descriptor2, _temp;

function dec() {}

let A = (_class = (_temp = function A() {
"use strict";

_classCallCheck(this, A);

_initializerDefineProperty(this, "a", _descriptor, this);

_initializerDefineProperty(this, "b", _descriptor2, this);

_defineProperty(this, "c", 456);
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "a", [dec], {
configurable: true,
enumerable: true,
writable: true,
initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "b", [dec], {
configurable: true,
enumerable: true,
writable: true,
initializer: function () {
return 123;
}
})), _class);

"#
);

// function_name_function_collision
test!(
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
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

"#,
    r#"
function _f() {
_f;
}

{
let obj = {
f: function f() {
  _f;
}
};
}

(function _b() {
var obj = {
b: function b() {
  _b;
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
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
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

"#,
    r#"
var obj = {
search: function search({
search: search1
}) {
console.log(search1);
}
};

function search({ search: search1 }) {
console.log(search1);
}

"#
);

// function_name_modules_2
test!(
    ignore,
    Default::default(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
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

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports.default = void 0;

var _last2 = _interopRequireDefault(require("lodash/last"));

let Container =
/*#__PURE__*/
function () {
function Container() {
_classCallCheck(this, Container);
}

_createClass(Container, [{
key: "last",
value: function last(key) {
  if (!this.has(key)) {
    return;
  }

  return (0, _last2.default)(this.tokens.get(key));
}
}]);
return Container;
}();

exports.default = Container;

"#
);

// function_name_await
test!(
    Default::default(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
    function_name_await,
    r#"
export {};

var obj = { await: function () {} };

"#,
    r#"
export {};
var obj = {
await: function _await() {}
};

"#
);
