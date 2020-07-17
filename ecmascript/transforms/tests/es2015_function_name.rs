#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat::es2015::{arrow, block_scoping, classes::Classes, function_name, Shorthand},
    modules::{amd::amd, common_js::common_js, umd::umd},
    proposals::decorators,
    resolver,
};

#[macro_use]
mod common;

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
  var Foo = function() {
   _classCallCheck(this, Foo);
  };
  _defineProperty(Foo, 'num', 0);
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

// function_name_function_collision
test!(
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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

// function_name_export_default_arrow_renaming_module_umd
test!(
    ignore,
    syntax(),
    |tester| chain!(
        resolver(),
        function_name(),
        Shorthand,
        arrow(),
        umd(
            tester.cm.clone(),
            Mark::fresh(Mark::root()),
            Default::default()
        )
    ),
    function_name_export_default_arrow_renaming_module_umd,
    r#"
export default (a) => {
  return { a() { return a } };
}

"#,
    r#"
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

"#
);

// function_name_collisions
test!(
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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

// function_name_modules_2
test!(
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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

//// function_name_export_default_arrow_renaming_module_system
//test!(syntax(),|_| tr("{
//  "plugins": [
//    function_name(),
//    Shorthand,
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

// function_name_await
test!(
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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

// function_name_function_assignment
test!(
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
        function_name(),
    ),
    function_name_function_assignment,
    r#"
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

"#,
    r#"
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

"#
);

// function_name_shorthand_property
test!(
    // not important
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
        function_name(),
    ),
    function_name_shorthand_property,
    r#"
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

"#,
    r#"
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

"#
);

// function_name_export_default_arrow_renaming_module_amd
test!(
    ignore,
    syntax(),
    |_| chain!(function_name(), Shorthand, arrow(), amd(Default::default())),
    function_name_export_default_arrow_renaming_module_amd,
    r#"
export default (a) => {
  return { a() { return a } };
}

"#,
    r#"
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

"#
);

// function_name_object
test!(
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        function_name(),
        Classes::default(),
        decorators(decorators::Config { legacy: true })
    ),
    function_name_object,
    r#"
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

"#,
    r#"
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

"#
);

// function_name_export
test!(
    // not important
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        function_name(),
        Classes::default(),
        decorators(decorators::Config { legacy: true })
    ),
    function_name_export,
    r#"
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

"#,
    r#"
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

"#
);

// function_name_global
test!(
    // Cost of development is too high.
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        function_name(),
        Classes::default(),
    ),
    function_name_global,
    r#"
var test = {
  setInterval: function(fn, ms) {
    setInterval(fn, ms);
  }
};

"#,
    r#"
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

"#
);

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

// function_name_modules
test!(
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
        function_name(),
        common_js(Mark::fresh(Mark::root()), Default::default()),
    ),
    function_name_modules,
    r#"
import events from "events";

class Template {
  events() {
    return events;
  }
}

console.log(new Template().events());

"#,
    r#"
"use strict";

var _events = _interopRequireDefault(require("events"));

let Template =
/*#__PURE__*/
function () {
  'use strict';
  function Template() {
    _classCallCheck(this, Template);
  }

  _createClass(Template, [{
    key: "events",
    value: function events() {
      return _events.default;
    }
  }]);
  return Template;
}();

console.log(new Template().events());

"#
);

// function_name_eval
test!(
    syntax(),
    |_| chain!(
        resolver(),
        function_name(),
        Classes::default(),
        decorators(decorators::Config { legacy: true })
    ),
    function_name_eval,
    r#"
var a = {
  eval: function () {
    return eval;
  }
};

"#,
    r#"
var a = {
  eval: function _eval() {
    return eval;
  }
};

"#
);

// function_name_modules_3
test!(
    syntax(),
    |_| chain!(
        resolver(),
        function_name(),
        Classes::default(),
        decorators(decorators::Config { legacy: true }),
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
      return _store.getForm().toJS();
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
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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
        Shorthand,
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
        decorators(decorators::Config { legacy: true }),
        function_name(),
        Classes::default()
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
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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

// function_name_own_bindings
test!(
    // not important
    ignore,
    syntax(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config { legacy: true }),
        Classes::default(),
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

// function_name_export_default_arrow_renaming_module_es6
test!(
    ignore,
    syntax(),
    |_| chain!(arrow(), Shorthand, function_name()),
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
