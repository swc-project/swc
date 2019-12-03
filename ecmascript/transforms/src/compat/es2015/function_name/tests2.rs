/Users/kdy1/projects/swc/ecmascript/transforms/src/compat/es2015/function_name/fixtures

// function_name_function_collision
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_function_collision, r#"
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

"#, r#"
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

"#);

// function_name_export_default_arrow_renaming_module_umd
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-function-name",
    "transform-shorthand-properties",
    "transform-arrow-functions",
    "transform-modules-umd"
  ]
}
"), function_name_export_default_arrow_renaming_module_umd, r#"
export default (a) => {
  return { a() { return a } };
}

"#, r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.input = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = function _default(_a) {
    return {
      a: function a() {
        return _a;
      }
    };
  };

  _exports.default = _default;
});

"#);

// function_name_collisions
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_collisions, r#"
var obj = {
  search: function({search}) {
    console.log(search);
  }
};

function search({search}) {
  console.log(search);
}

"#, r#"
var obj = {
  search: function search({
    search: _search
  }) {
    console.log(_search);
  }
};

function search({
  search
}) {
  console.log(search);
}

"#);

// issues_5004
test!(syntax(),|_| tr("{
  "plugins": ["external-helpers", "transform-function-name"]
}
"), issues_5004, r#"
export const x = ({x}) => x;
export const y = function () {};

"#, r#"
export const x = ({
  x
}) => x;
export const y = function y() {};

"#);

// function_name_modules_2
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }],
    "transform-modules-commonjs"
  ]
}
"), function_name_modules_2, r#"
import last from "lodash/last"

export default class Container {
  last(key) {
    if (!this.has(key)) {
      return;
    }

    return last(this.tokens.get(key))
  }
}

"#, r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _last2 = babelHelpers.interopRequireDefault(require("lodash/last"));

let Container =
/*#__PURE__*/
function () {
  function Container() {
    babelHelpers.classCallCheck(this, Container);
  }

  babelHelpers.createClass(Container, [{
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

"#);

// function_name_export_default_arrow_renaming_module_system
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-function-name",
    "transform-shorthand-properties",
    "transform-arrow-functions",
    "transform-modules-systemjs"
  ]
}
"), function_name_export_default_arrow_renaming_module_system, r#"
export default (a) => {
  return { a() { return a } };
}

"#, r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", function (_a) {
        return {
          a: function a() {
            return _a;
          }
        };
      });
    }
  };
});

"#);

// function_name_export_default_arrow_renaming_2
test!(syntax(),|_| tr("{
  "presets": ["env"]
}
"), function_name_export_default_arrow_renaming_2, r#"
export default () => ({
  x: ({x}) => {}
})

"#, r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default() {
  return {
    x: function x(_ref) {
      var _x = _ref.x;
    }
  };
};

exports["default"] = _default;

"#);

// function_name_await
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_await, r#"
export {};

var obj = { await: function () {} };

"#, r#"
export {};
var obj = {
  await: function _await() {}
};

"#);

// function_name_function_assignment
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_function_assignment, r#"
var foo;
foo = function() {
};

var baz;
baz = function() {
  baz();
};
baz = 12;

bar = function() {
  bar();
};

"#, r#"
var foo;

foo = function foo() {};

var _baz;

_baz = function baz() {
  _baz();
};

_baz = 12;

bar = function (_bar) {
  function bar() {
    return _bar.apply(this, arguments);
  }

  bar.toString = function () {
    return _bar.toString();
  };

  return bar;
}(function () {
  bar();
});

"#);

// function_name_shorthand_property
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_shorthand_property, r#"
var Utils = {
  get: function() {}
};

var { get } = Utils;

var bar = {
  get: function(arg) {
    get(arg, "baz");
  }
};

var f = function ({ foo = "bar" }) {
  var obj = {
    // same name as parameter
    foo: function () {
      foo;
    }
  };
};

"#, r#"
var Utils = {
  get: function get() {}
};
var {
  get: _get
} = Utils;
var bar = {
  get: function get(arg) {
    _get(arg, "baz");
  }
};

var f = function f({
  foo: _foo = "bar"
}) {
  var obj = {
    // same name as parameter
    foo: function foo() {
      _foo;
    }
  };
};

"#);

// function_name_export_default_arrow_renaming_module_amd
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-function-name",
    "transform-shorthand-properties",
    "transform-arrow-functions",
    "transform-modules-amd"
  ]
}
"), function_name_export_default_arrow_renaming_module_amd, r#"
export default (a) => {
  return { a() { return a } };
}

"#, r#"
define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = function _default(_a) {
    return {
      a: function a() {
        return _a;
      }
    };
  };

  _exports.default = _default;
});

"#);

// function_name_object
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_object, r#"
var obj = {
  f: function () {
    (function f() {
      console.log(f);
    })();
  },

  h: function () {
    console.log(h);
  },

  m: function () {
    doSmth();
  }
};

"#, r#"
var obj = {
  f: function f() {
    (function f() {
      console.log(f);
    })();
  },
  h: function (_h) {
    function h() {
      return _h.apply(this, arguments);
    }

    h.toString = function () {
      return _h.toString();
    };

    return h;
  }(function () {
    console.log(h);
  }),
  m: function m() {
    doSmth();
  }
};

"#);

// function_name_export
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_export, r#"
export var foo = "yes", foob = "no";

export function whatever() {}

export default function wowzers() {}

var bar = {
  foo: function () {
    foo;
  },

  whatever: function () {
    whatever;
  },

  wowzers: function () {
    wowzers;
  }
};

"#, r#"
var _foo = "yes",
    foob = "no";
export { _foo as foo, foob };

function _whatever() {}

export { _whatever as whatever };

function _wowzers() {}

export { _wowzers as default };
var bar = {
  foo: function foo() {
    _foo;
  },
  whatever: function whatever() {
    _whatever;
  },
  wowzers: function wowzers() {
    _wowzers;
  }
};

"#);

// function_name_global
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_global, r#"
var test = {
  setInterval: function(fn, ms) {
    setInterval(fn, ms);
  }
};

"#, r#"
var test = {
  setInterval: function (_setInterval) {
    function setInterval(_x, _x2) {
      return _setInterval.apply(this, arguments);
    }

    setInterval.toString = function () {
      return _setInterval.toString();
    };

    return setInterval;
  }(function (fn, ms) {
    setInterval(fn, ms);
  })
};

"#);

// function_name_with_arrow_functions_transform
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-arrow-functions"
  ]
}
"), function_name_with_arrow_functions_transform, r#"
const x = () => x;
const y = x => x();
const z = { z: () => y(x) }.z;

"#, r#"
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

"#);

// function_name_modules
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-modules-commonjs",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_modules, r#"
import events from "events";

class Template {
  events() {
    return events;
  }
}

console.log(new Template().events());

"#, r#"
"use strict";

var _events2 = babelHelpers.interopRequireDefault(require("events"));

let Template =
/*#__PURE__*/
function () {
  function Template() {
    babelHelpers.classCallCheck(this, Template);
  }

  babelHelpers.createClass(Template, [{
    key: "events",
    value: function events() {
      return _events2.default;
    }
  }]);
  return Template;
}();

console.log(new Template().events());

"#);

// function_name_eval
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_eval, r#"
var a = {
  eval: function () {
    return eval;
  }
};

"#, r#"
var a = {
  eval: function _eval() {
    return eval;
  }
};

"#);

// function_name_modules_3
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-modules-commonjs",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_modules_3, r#"
import {getForm} from "./store"

export default class Login extends React.Component {
  getForm() {
    return getForm().toJS()
  }
}

"#, r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = require("./store");

let Login =
/*#__PURE__*/
function (_React$Component) {
  babelHelpers.inherits(Login, _React$Component);

  function Login() {
    babelHelpers.classCallCheck(this, Login);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Login).apply(this, arguments));
  }

  babelHelpers.createClass(Login, [{
    key: "getForm",
    value: function getForm() {
      return (0, _store.getForm)().toJS();
    }
  }]);
  return Login;
}(React.Component);

exports.default = Login;

"#);

// function_name_basic
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_basic, r#"
var g = function () {
  doSmth();
};

"#, r#"
var g = function g() {
  doSmth();
};

"#);

// function_name_export_default_arrow_renaming
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-function-name",
    "transform-shorthand-properties",
    "transform-arrow-functions",
    "transform-modules-commonjs"
  ]
}
"), function_name_export_default_arrow_renaming, r#"
export default (a) => {
  return { a() { return a } };
}

"#, r#"
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

"#);

// issues_7199
test!(syntax(),|_| tr("{
  "plugins": ["external-helpers", "transform-function-name"]
}
"), issues_7199, r#"
const x = {
  [null]: function () {},
  [/regex/gi]: function () {},
  [`y`]: function () {},
  [`abc${y}def`]: function () {},
  [0]: function () {},
  [false]: function () {},
};

"#, r#"
const x = {
  [null]: function _null() {},
  [/regex/gi]: function _regex_gi() {},
  [`y`]: function y() {},
  [`abc${y}def`]: function abcdef() {},
  [0]: function _() {},
  [false]: function _false() {}
};

"#);

// function_name_export_default_arrow_renaming_3
test!(syntax(),|_| tr("{
  "presets": ["env", "react"]
}
"), function_name_export_default_arrow_renaming_3, r#"
export default ({ onClick }) => (
  <div onClick={() => onClick()} />
)


"#, r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(_ref) {
  var _onClick = _ref.onClick;
  return React.createElement("div", {
    onClick: function onClick() {
      return _onClick();
    }
  });
};

exports["default"] = _default;

"#);

// function_name_export_default_arrow_renaming_es3
test!(syntax(),|_| tr("{
  "presets": ["env"],
  "plugins": [
    "transform-member-expression-literals",
    "transform-property-literals"
  ]
}
"), function_name_export_default_arrow_renaming_es3, r#"
export default (a) => {
  return { a() { return a } };
}

"#, r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(_a) {
  return {
    a: function a() {
      return _a;
    }
  };
};

exports["default"] = _default;

"#);

// function_name_self_reference
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_self_reference, r#"
var f = function () {
  console.log(f, g);
};

f = null;

"#, r#"
var _f = function f() {
  console.log(_f, g);
};

_f = null;

"#);

// function_name_with_arrow_functions_transform_spec
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    ["transform-arrow-functions", { "spec": true }]
  ]
}
"), function_name_with_arrow_functions_transform_spec, r#"
// These are actually handled by transform-arrow-functions
const x = () => x;
const y = x => x();
const z = { z: () => y(x) }.z;

"#, r#"
var _this = this;

// These are actually handled by transform-arrow-functions
const _x = function x() {
  babelHelpers.newArrowCheck(this, _this);
  return _x;
}.bind(this);

const y = function y(x) {
  babelHelpers.newArrowCheck(this, _this);
  return x();
}.bind(this);

const z = {
  z: function z() {
    babelHelpers.newArrowCheck(this, _this);
    return y(_x);
  }.bind(this)
}.z;

"#);

// function_name_method_definition
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_method_definition, r#"
({ x() {} });

"#, r#"
({
  x() {}

});

"#);

// function_name_own_bindings
test!(syntax(),|_| tr("{
  "plugins": [
    "external-helpers",
    "transform-function-name",
    "transform-classes",
    ["proposal-decorators", { "legacy": true }]
  ]
}
"), function_name_own_bindings, r#"
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

"#, r#"
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

"#);

// function_name_export_default_arrow_renaming_module_es6
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-function-name",
    "transform-shorthand-properties",
    "transform-arrow-functions"
  ]
}
"), function_name_export_default_arrow_renaming_module_es6, r#"
export default (a) => {
  return { a() { return a } };
}

"#, r#"
export default (function (_a) {
  return {
    a: function a() {
      return _a;
    }
  };
});

"#);

// function_name_assignment
test!(syntax(),|_| tr(Default::default()), function_name_assignment, r#"
var i = function () {
  i = 5;
};

var j = function () {
  ({ j } = 5);
  ({ y: j } = 5);
  ;
};

"#, r#"
var _i = function i() {
  _i = 5;
};

var _j = function j() {
  ({
    j: _j
  } = 5);
  ({
    y: _j
  } = 5);
  ;
};

"#);
