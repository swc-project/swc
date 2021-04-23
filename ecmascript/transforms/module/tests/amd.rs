use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_compat::es2015::for_of;
use swc_ecma_transforms_compat::es2015::function_name;
use swc_ecma_transforms_compat::es2015::shorthand;
use swc_ecma_transforms_module::amd::amd;
use swc_ecma_transforms_module::amd::Config;
use swc_ecma_transforms_module::util;
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        dynamic_import: true,
        ..Default::default()
    })
}

fn tr(config: Config) -> impl Fold {
    chain!(resolver(), amd(config))
}

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_335,
    "import bar from 'bar';

obj[bar('bas')] = '123'",
    "define(['bar'], function(_bar) {
    'use strict';
    _bar = _interopRequireDefault(_bar);
    obj[(0, _bar).default('bas')] = '123';
});"
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
define(['exports', 'foo'], function(_exports, _foo) {
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
    |_| tr(Config {
        config: util::Config {
            strict: true,
            ..Default::default()
        },
        ..Default::default()
    }),
    custom_strict,
    r#"export function foo(){}"#,
    r#"
define(['exports'], function(_exports) {
    'use strict';
    _exports.foo = foo;
    function foo(){}
});
"#
);

test!(
    syntax(),
    |_| tr(Config {
        config: util::Config {
            strict_mode: false,
            ..Default::default()
        },
        ..Default::default()
    }),
    custom_non_strict_mode,
    r#"export function foo(){}"#,
    r#"
define(['exports'], function(_exports) {
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    _exports.foo = foo;
    function foo(){}
});
"#
);

test!(
    syntax(),
    |_| tr(Config {
        config: util::Config {
            no_interop: true,
            ..Default::default()
        },
        ..Default::default()
    }),
    custom_no_interop,
    r#"import * as foo from 'foo';
    import bar from 'bar';"#,
    r#"
define(['foo', 'bar'], function(foo, _bar) {
    'use strict';
});
"#
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
define(['react'], function(_react) {
    'use strict';
    _react = _interopRequireDefault(_react);
    window.React = _react.default;
});
"#
);

test!(
    syntax(),
    |_| tr(Config {
        module_id: Some("moduleId".into()),
        ..Default::default()
    }),
    custom_named_define,
    r#"
import {foo} from 'src';
export {foo};
  "#,
    r#"define('moduleId', ['exports', 'src'], function(_exports, _src) {
    'use strict';
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    Object.defineProperty(_exports, 'foo', {
        enumerable: true,
        get: function() {
            return _src.foo;
        }
    });
});
"#
);

// export_default_4
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_4,
    r#"
export default foo;

"#,
    r#"
define(["exports"], function (_exports) {
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

// export_from_2
test!(
    syntax(),
    |_| tr(Default::default()),
    export_from_2,
    r#"
export {foo} from "foo";

"#,
    r#"
define(["exports", "foo"], function (_exports, _foo) {
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

// export_named_2
test!(
    syntax(),
    |_| tr(Default::default()),
    export_named_2,
    r#"
var foo, bar;
export {foo, bar};

"#,
    r#"
define(["exports"], function (_exports) {
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

// imports_default
test!(
    syntax(),
    |_| tr(Default::default()),
    imports_default,
    r#"
import foo from "foo";
import {default as foo2} from "foo";

foo;
foo2;

"#,
    r#"
define(["foo"], function (_foo) {
  "use strict";

  _foo = _interopRequireDefault(_foo);
  _foo.default;
  _foo.default;
});

"#
);

// imports_mixing
test!(
    syntax(),
    |_| tr(Default::default()),
    imports_mixing,
    r#"
import foo, {baz as xyz} from "foo";

foo;
xyz;

"#,
    r#"
define(["foo"], function (_foo) {
  "use strict";

  _foo = _interopRequireWildcard(_foo);
  _foo.default;
  _foo.baz;
});

"#
);

// export_default_9
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_9,
    r#"
var foo;
export { foo as default };

"#,
    r#"
define(["exports"], function (_exports) {
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

// noInterop_export_from

// amd

// export_default
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default,
    r#"
export default 42;

"#,
    r#"
define(["exports"], function (_exports) {
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

// export_default_2
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_2,
    r#"
export default {};

"#,
    r#"
define(["exports"], function (_exports) {
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

// export_from_4
test!(
    syntax(),
    |_| tr(Default::default()),
    export_from_4,
    r#"
export {foo as bar} from "foo";

"#,
    r#"
define(["exports", "foo"], function (_exports, _foo) {
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

// export_named
test!(
    syntax(),
    |_| tr(Default::default()),
    export_named,
    r#"
var foo;
export {foo};

"#,
    r#"
define(["exports"], function (_exports) {
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

// noInterop_import_default_only

// export_from
test!(
    syntax(),
    |_| tr(Default::default()),
    export_from,
    r#"
export * from "foo";

"#,
    r#"
define(["exports", "foo"], function (_exports, _foo) {
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

// export_default_7
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_7,
    r#"
export default function foo () {}

"#,
    r#"
define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = foo;

  function foo() {}
});

"#
);

// export_named_4
test!(
    syntax(),
    |_| tr(Default::default()),
    export_named_4,
    r#"
var foo;
export {foo as default};

"#,
    r#"
define(["exports"], function (_exports) {
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

// imports_glob
test!(
    syntax(),
    |_| tr(Default::default()),
    imports_glob,
    r#"
import * as foo from "foo";

foo;

"#,
    r#"
define(["foo"], function (foo) {
  "use strict";

  foo = _interopRequireWildcard(foo);
  foo;
});

"#
);

// ㅁap
test!(
    syntax(),
    |_| tr(Default::default()),
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
define(["exports"], function (_exports) {
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

// regression_4192

// imports
test!(
    syntax(),
    |_| tr(Default::default()),
    imports,
    r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";

"#,
    r#"
define(["foo", "foo-bar", "./directory/foo-bar"], function (_foo, _fooBar, _fooBar1) {
  "use strict";
});

"#
);

// export_from_3
test!(
    syntax(),
    |_| tr(Default::default()),
    export_from_3,
    r#"
export {foo, bar} from "foo";

"#,
    r#"
define(["exports", "foo"], function (_exports, _foo) {
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

// export_default_5
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_5,
    r#"
export default function () {}

"#,
    r#"
define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default() {}
});

"#
);

// export_default_10
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_10,
    r#"
export default (function(){return "foo"})();

"#,
    r#"
define(["exports"], function (_exports) {
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

// export_named_3
test!(
    syntax(),
    |_| tr(Default::default()),
    export_named_3,
    r#"
var foo;
export {foo as bar};

"#,
    r#"
define(["exports"], function (_exports) {
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

// overview
test!(
    syntax(),
    |_| tr(Default::default()),
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

foo;
foo2;
bar;
bar2;

"#,
    r#"
define(["exports", "foo", "foo-bar", "./directory/foo-bar"],
function (_exports, foo2, _fooBar, _fooBar1) {
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
  foo2.default;
  foo2;
  foo2.bar;
  foo2.foo;
});

"#
);

// export_from_6
test!(
    syntax(),
    |_| tr(Default::default()),
    export_from_6,
    r#"
export {foo as default, bar} from "foo";

"#,
    r#"
define(["exports", "foo"], function (_exports, _foo) {
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

// hoist_function_exports
test!(
    syntax(),
    |_| tr(Default::default()),
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
define(["exports", "./evens"], function (_exports, _evens) {
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

// export_default_8
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_8,
    r#"
export default class Foo {}

"#,
    r#"
define(["exports"], function (_exports) {
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

// export_from_5
test!(
    syntax(),
    |_| tr(Default::default()),
    export_from_5,
    r#"
export {foo as default} from "foo";

"#,
    r#"
define(["exports", "foo"], function (_exports, _foo) {
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

// export_default_3
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_3,
    r#"
export default [];

"#,
    r#"
define(["exports"], function (_exports) {
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

// import_order
test!(
    syntax(),
    |_| tr(Default::default()),
    import_order,
    r#"
import './foo';
import bar from './bar';
import './derp';
import { qux } from './qux';

"#,
    r#"
define(["./foo", "./bar", "./derp", "./qux"], function (_foo, _bar, _derp, _qux) {
  "use strict";

  _bar = _interopRequireDefault(_bar);
});

"#
);

// export_specifier_default
test!(
    syntax(),
    |_| tr(Default::default()),
    export_specifier_default,
    r#"
var a = 1;
export { a as default };

"#,
    r#"
define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var a = 1;
  _exports.default = a;
});

"#
);

// exports_variable
test!(
    syntax(),
    |_| tr(Default::default()),
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
define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.foo8 = foo8;
  _exports.foo2 = _exports.foo7 = _exports.foo3 = _exports.foo4 =
    _exports.bar = _exports.foo = _exports.foo5 = _exports.foo6 = void 0;
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

// imports_named
test!(
    syntax(),
    |_| tr(Default::default()),
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
define(["foo"], function (_foo) {
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

// export_default_6
test!(
    syntax(),
    |_| tr(Default::default()),
    export_default_6,
    r#"
export default class {}

"#,
    r#"
define(["exports"], function (_exports) {
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

// get_module_name_option

// module_name

// export_named_5
test!(
    syntax(),
    |_| tr(Default::default()),
    export_named_5,
    r#"
var foo, bar;
export {foo as default, bar};

"#,
    r#"
define(["exports"], function (_exports) {
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

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_456_1,
    "import { join as e } from 'path';
export const foo = function () {
  function e(t) {}
  return A(e, {}), e
}();",
    "define(['exports', 'path'], function(_exports, _path) {
    'use strict';
    Object.defineProperty(_exports, '__esModule', {
        value: true
    });
    _exports.foo = void 0;
    const foo = function() {
        function e(t) {
        }
        return A(e, {
        }), e;
    }();
    _exports.foo = foo;
});"
);

test!(
    syntax(),
    |_| tr(Config {
        ..Default::default()
    }),
    issue_456_2,
    "import { join as e } from 'path';
export const foo = function () {
  var e = 1;
  return A(e, {}), e
}();",
    "define(['exports', 'path'], function(_exports, _path) {
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
});
"
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
    "define([], function() {
      \"use strict\";
      async function foo() {
          await new Promise(function(resolve, reject) {
              require([
                  \"foo\"
              ], function(dep) {
                  resolve(dep);
              }, function(err) {
                  reject(err);
              });
          });
      }
  });"
);

// for_of_as_array_for_of_import_amd
test!(
    syntax(),
    |_| chain!(
        for_of(for_of::Config { assume_array: true }),
        amd(Default::default())
    ),
    for_of_as_array_for_of_import_amd,
    r#"
import { array } from "foo";

for (const elm of array) {
console.log(elm);
}

"#,
    r#"
define(["foo"], function (_foo) {
"use strict";

for(let _i = 0; _i < _foo.array.length; _i++){
  const elm = _foo.array[_i];
  console.log(elm);
}
});

"#
);

// function_name_export_default_arrow_renaming_module_amd
test!(
    ignore,
    Default::default(),
    |_| chain!(
        function_name(),
        shorthand(),
        arrow(),
        amd(Default::default())
    ),
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
