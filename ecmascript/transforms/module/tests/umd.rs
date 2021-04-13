use swc_common::chain;
use swc_common::Mark;
use swc_ecma_parser::EsConfig;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_compat::es2015::function_name;
use swc_ecma_transforms_compat::es2015::shorthand;
use swc_ecma_transforms_module::umd::umd;
use swc_ecma_transforms_module::umd::Config;
use swc_ecma_transforms_module::util;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::Tester;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        dynamic_import: true,
        ..Default::default()
    })
}

fn tr(tester: &mut Tester<'_>, config: Config) -> impl Fold {
    let mark = Mark::fresh(Mark::root());
    chain!(
        resolver_with_mark(mark),
        umd(tester.cm.clone(), mark, config)
    )
}

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    issue_335,
    "import bar from 'bar';

obj[bar('bas')] = '123'",
    "(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['bar'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(require('bar'));
    } else {
        var mod = {
            exports: {
            }
        };
        factory(global.bar);
        global.input = mod.exports;
    }
})(this, function(_bar) {
    'use strict';
    _bar = _interopRequireDefault(_bar);
    obj[(0, _bar).default('bas')] = '123';
});"
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    issue_332,
    "import foo from 'foo';

export const bar = { foo }",
    "
  (function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'foo'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('foo'));
    } else {
        var mod = {
            exports: {
            }
        };
        factory(mod.exports, global.foo);
        global.input = mod.exports;
    }
})(this, function(_exports, _foo) {
    'use strict';
    _foo = _interopRequireDefault(_foo);
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    _exports.bar = void 0;
    const bar = {
        foo: _foo.default
    };
    _exports.bar = bar;
});
"
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            config: util::Config {
                strict: true,
                ..Default::default()
            },
            ..Default::default()
        }
    ),
    custom_strict,
    r#"export function foo(){}"#,
    r#"
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {
            }
        };
        factory(mod.exports);
        global.input = mod.exports;
    }
})(this, function(_exports) {
    'use strict';
    _exports.foo = foo;
    function foo() {
    }
});

"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            config: util::Config {
                strict_mode: false,
                ..Default::default()
            },
            ..Default::default()
        }
    ),
    custom_non_strict_mode,
    r#"export function foo(){}"#,
    r#"
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {
            }
        };
        factory(mod.exports);
        global.input = mod.exports;
    }
})(this, function(_exports) {
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    _exports.foo = foo;
    function foo() {
    }
});

"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            config: util::Config {
                no_interop: true,
                ..Default::default()
            },
            ..Default::default()
        }
    ),
    custom_no_interop,
    r#"import * as foo from 'foo';
    import bar from 'bar';"#,
    r#"
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['foo', 'bar'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(require('foo'), require('bar'));
    } else {
        var mod = {
            exports: {
            }
        };
        factory(global.foo, global.bar);
        global.input = mod.exports;
    }
})(this, function(foo, _bar) {
    'use strict';
});
"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    custom_usage,
    r#"
import React from 'react'
window.React = React;
  "#,
    r#"
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['react'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(require('react'));
    } else {
        var mod = {
            exports: {
            }
        };
        factory(global.react);
        global.input = mod.exports;
    }
})(this, function(_react) {
    'use strict';
    _react = _interopRequireDefault(_react);
    window.React = _react.default;
});
"#
);

// exports_variable
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    exports_variable,
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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.foo8 = foo8;
  _exports.foo2 = _exports.foo7 = _exports.foo3 = _exports.foo4 = _exports.bar =
    _exports.foo = _exports.foo5 = _exports.foo6 = void 0;
 var foo = 1;
  _exports.foo = foo;
  var foo2 = 1,
      bar = 2;
  _exports.foo2 = foo2;
  _exports.bar = bar;

  var foo3 = function () {};

  _exports.foo3 = foo3;
  var foo4;
  _exports.foo4 = foo4;
  let foo5 = 2;
  _exports.foo5 = foo5;
  let foo6;
  _exports.foo6 = foo6;
  const foo7 = 3;
  _exports.foo7 = foo7;

  function foo8() {}

  class foo9 {}

  _exports.foo9 = foo9;
});

"#
);

// export_named
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_named,
    r#"
var foo;
export {foo};

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.foo = void 0;
  var foo;
  _exports.foo = foo;
});

"#
);

// export_default_11
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_11,
    r#"
export default new Cachier()

export function Cachier(databaseName) {}

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Cachier = Cachier;
  _exports.default = void 0;

  var _default = new Cachier();

  _exports.default = _default;

  function Cachier(databaseName) {}
});

"#
);

// module_id_with_overridden_global

// export_from_4
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_from_4,
    r#"
export {foo as bar} from "foo";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "bar", {
    enumerable: true,
    get: function () {
      return _foo.foo;
    }
  });
});

"#
);

// override_import_name

// export_default_3
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_3,
    r#"
export default [];

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = [];
  _exports.default = _default;
});

"#
);

// imports_exact_globals_false_with_overrides

// imports_exact_globals_true_with_overrides

// imports_default
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    imports_default,
    r#"
import foo from "foo";
import {default as foo2} from "foo";

foo;
foo2;

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.foo);
    global.input = mod.exports;
  }
})(this, function (_foo) {
  "use strict";

  _foo = _interopRequireDefault(_foo);
  _foo.default;
  _foo.default;
});

"#
);

// export_named_3
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_named_3,
    r#"
var foo, bar;
export {foo as default, bar};

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.bar = _exports.default = void 0;
  var foo, bar;
  _exports.default = foo;
  _exports.bar = bar;
});

"#
);

// imports_glob
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    imports_glob,
    r#"
import * as foo from "foo";

foo;

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.foo);
    global.input = mod.exports;
  }
})(this, function (foo) {
  "use strict";

  foo = _interopRequireWildcard(foo);
  foo;
});

"#
);

// export_default_6
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_6,
    r#"
export default class {}

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class _default {}

  _exports.default = _default;
});

"#
);

// export_default_5
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_5,
    r#"
export default function () {}

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  function _default() {}
  _exports.default = _default;
});

"#
);

// hoist_function_exports
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    hoist_function_exports,
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
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./evens"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./evens"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.evens);
    global.input = mod.exports;
  }
})(this, function (_exports, _evens) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.nextOdd = nextOdd;
  _exports.isOdd = void 0;

  function nextOdd(n) {
    return (0, _evens).isEven(n) ? n + 1 : n + 2;
  }

  var isOdd = function (isEven) {
    return function (n) {
      return !isEven(n);
    };
  }(_evens.isEven);

  _exports.isOdd = isOdd;
});

"#
);

// export_from_2
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_from_2,
    r#"
export {foo as default} from "foo";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _foo.foo;
    }
  });
});

"#
);

// imports_exact_globals_true

// export_default_8
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_8,
    r#"
export default class Foo {}

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Foo {}

  _exports.default = Foo;
});

"#
);

// module_name

// module_id

// export_named_5
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_named_5,
    r#"
var foo, bar;
export {foo, bar};

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.bar = _exports.foo = void 0;
  var foo, bar;
  _exports.foo = foo;
  _exports.bar = bar;
});

"#
);

// imports_exact_globals_false
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    imports_exact_globals_false,
    r#"
import fooBar1 from "foo-bar";
import fooBar2 from "./mylib/foo-bar";
import fizzBuzz from "fizzbuzz";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["foo-bar", "./mylib/foo-bar", "fizzbuzz"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("foo-bar"), require("./mylib/foo-bar"), require("fizzbuzz"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.fooBar, global.fooBar, global.fizzbuzz);
    global.input = mod.exports;
  }
})(this, function (_fooBar, _fooBar1, _fizzbuzz) {
  "use strict";

  _fooBar = _interopRequireDefault(_fooBar);
  _fooBar1 = _interopRequireDefault(_fooBar1);
  _fizzbuzz = _interopRequireDefault(_fizzbuzz);
});

"#
);

// module_id_with_overridden_global_in_namespace

// regression_4192

// export_default_10
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_10,
    r#"
export default (function(){return "foo"})();

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = function () {
    return "foo";
  }();

  _exports.default = _default;
});

"#
);

// export_from
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_from,
    r#"
export {foo} from "foo";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "foo", {
    enumerable: true,
    get: function () {
      return _foo.foo;
    }
  });
});

"#
);

// export_from_5
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_from_5,
    r#"
export {foo, bar} from "foo";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "foo", {
    enumerable: true,
    get: function () {
      return _foo.foo;
    }
  });
  Object.defineProperty(_exports, "bar", {
    enumerable: true,
    get: function () {
      return _foo.bar;
    }
  });
});

"#
);

// module_name_with_overridden_global

// export_default_2
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_2,
    r#"
export default {};

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {};
  _exports.default = _default;
});

"#
);

// imports_named
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    imports_named,
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
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.foo);
    global.input = mod.exports;
  }
})(this, function (_foo) {
  "use strict";

  _foo.bar;
  _foo.bar2;
  _foo.baz;
  _foo.bar;
  _foo.bar;
  _foo.xyz;
});

"#
);

// imports_mixing
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    imports_mixing,
    r#"
import foo, {baz as xyz} from "foo";
xyz;

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.foo);
    global.input = mod.exports;
  }
})(this, function (_foo) {
  "use strict";

  _foo = _interopRequireWildcard(_foo);
  _foo.baz;
});

"#
);

// remap
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    remap,
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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.e = _exports.c = _exports.a = _exports.test = _exports.f = void 0;
  var test = 2;
  _exports.test = test;
  _exports.test = test = 5;
  _exports.test = test = +test + 1;

  (function () {
    var test1 = 2;
    test1 = 3;
    test1++;
  })();

  var a = 2;
  _exports.a = a;
  _exports.a = a = 3;
  var b = 2;
  _exports.c = b;
  _exports.c = b = 3;
  var d = 3;
  _exports.e = d;
  _exports.f = d;
  _exports.f = _exports.e = d = 4;
});

"#
);

// get_module_name_option

// export_named_2
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_named_2,
    r#"
var foo;
export {foo as default};

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var foo;
  _exports.default = foo;
});

"#
);

// export_default_7
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_7,
    r#"
export default function foo () {}

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  function foo() {}
  _exports.default = foo;

});

"#
);

// override_export_name

// non_default_imports
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    non_default_imports,
    r#"
import { render } from "./lib/render";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./lib/render"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./lib/render"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.render);
    global.input = mod.exports;
  }
})(this, function (_render) {
  "use strict";
});

"#
);

// imports
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    imports,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["foo", "foo-bar", "./directory/foo-bar"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("foo"), require("foo-bar"), require("./directory/foo-bar"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.foo, global.fooBar, global.fooBar);
    global.input = mod.exports;
  }
})(this, function (_foo, _fooBar, _fooBar1) {
  "use strict";
});

"#
);

// export_default
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default,
    r#"
export default 42;

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = 42;
  _exports.default = _default;
});

"#
);

// export_default_4
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_4,
    r#"
export default foo;

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = foo;
  _exports.default = _default;
});

"#
);

// export_from_3
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_from_3,
    r#"
export {foo as default, bar} from "foo";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _foo.foo;
    }
  });
  Object.defineProperty(_exports, "bar", {
    enumerable: true,
    get: function () {
      return _foo.bar;
    }
  });
});

"#
);

// export_default_9
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_default_9,
    r#"
var foo;
export { foo as default };


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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var foo;
  _exports.default = foo;
});

"#
);

// overview
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    overview,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";
import foo from "foo";
import * as foo2 from "foo";
import {bar} from "foo";
import {foo as bar2} from "foo";

var test;
export {test};
export var test2 = 5;

export default test;

bar;
bar2;

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo", "foo-bar", "./directory/foo-bar"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"), require("foo-bar"), require("./directory/foo-bar"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo, global.fooBar, global.fooBar);
    global.input = mod.exports;
  }
})(this, function (_exports, foo2, _fooBar, _fooBar1) {
  "use strict";
  foo2 = _interopRequireWildcard(foo2);
  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.test2 = _exports.test = void 0;
  var test;
  _exports.test = test;
  var test2 = 5;
  _exports.test2 = test2;
  var _default = test;
  _exports.default = _default;
  foo2.bar;
  foo2.foo;
});

"#
);

// module_id_with_overridden_global_in_very_nested_namespace

// export_named_4
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_named_4,
    r#"
var foo;
export {foo as bar};

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
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.bar = void 0;
  var foo;
  _exports.bar = foo;
});

"#
);

// export_from_6
test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    export_from_6,
    r#"
export * from "foo";

"#,
    r#"
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "foo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("foo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.foo);
    global.input = mod.exports;
  }
})(this, function (_exports, _foo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_foo).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _foo[key];
      }
    });
  });
});

"#
);

// umd

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    issue_456_1,
    "import { join as e } from 'path';
export const foo = function () {
  function e(t) {}
  return A(e, {}), e
}();",
    "\
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'path'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('path'));
    } else {
        var mod = {
            exports: {
            }
        };
        factory(mod.exports, global.path);
        global.input = mod.exports;
    }
})(this, function(_exports, _path) {
    'use strict';
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    _exports.foo = void 0;
    const foo = function() {
        function e(t) {
        }
        return A(e, {}), e;
    }();
    _exports.foo = foo;
});
"
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            ..Default::default()
        }
    ),
    issue_456_2,
    "import { join as e } from 'path';
export const foo = function () {
  var e = 1;
  return A(e, {}), e
}();",
    "(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'path'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('path'));
    } else {
        var mod = {
            exports: {
            }
        };
        factory(mod.exports, global.path);
        global.input = mod.exports;
    }
})(this, function(_exports, _path) {
    'use strict';
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    _exports.foo = void 0;
    const foo = function() {
        var e = 1;
        return A(e, {
        }), e;
    }();
    _exports.foo = foo;
});"
);

test!(
    syntax(),
    |t| tr(
        t,
        Config {
            ..Default::default()
        }
    ),
    issue_1018_1,
    "async function foo() {
    await import('foo');
  }",
    "
    (function(global, factory) {
      if (typeof define === \"function\" && define.amd) {
          define([], factory);
      } else if (typeof exports !== \"undefined\") {
          factory();
      } else {
          var mod = {
              exports: {
              }
          };
          factory();
          global.input = mod.exports;
      }
  })(this, function() {
      \"use strict\";
      async function foo() {
          await (exports === undefined ? new Promise(function(resolve, reject) {
              require([
                  \"foo\"
              ], function(dep) {
                  resolve(dep);
              }, function(err) {
                  reject(err);
              });
          }) : Promise.resolve().then(function() {
              return _interopRequireWildcard(require(\"foo\"));
          }));
      }
  });      
    ",
    ok_if_code_eq
);

// function_name_export_default_arrow_renaming_module_umd
test!(
    ignore,
    syntax(),
    |tester| chain!(
        resolver(),
        function_name(),
        shorthand(),
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
