use super::*;

fn syntax() -> ::swc_ecma_parser::Syntax {
  Default::default()
}

fn tr(_helpers: Arc<Helpers>) -> impl Fold<Module> {
  system_js()
}

// systemjs_export_named_7
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named_7,
  r#"
export function foo2(bar) {}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  function foo2(bar) {}

  _export("foo2", foo2);

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_get_module_name_option

// systemjs_export_const_destructuring_deep
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_const_destructuring_deep,
  r#"
export const { foo: { bar: [baz, qux] } } = {};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var baz, qux;
  return {
    setters: [],
    execute: function () {
      ({
        foo: {
          bar: [baz, qux]
        }
      } = {}), _export("baz", baz), _export("qux", qux);
    }
  };
});

"#
);

// systemjs_export_default_2
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_2,
  r#"
export default {};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", {});
    }
  };
});

"#
);

// systemjs_export_const_destructuring_array
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_const_destructuring_array,
  r#"
export const [foo, bar] = [];

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var foo, bar;
  return {
    setters: [],
    execute: function () {
      [foo, bar] = [], _export("foo", foo), _export("bar", bar);
    }
  };
});

"#
);

// systemjs_export_const_destructuring_array_rest
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_const_destructuring_array_rest,
  r#"
export const [foo, bar, ...baz] = [];

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var foo, bar, baz;
  return {
    setters: [],
    execute: function () {
      [foo, bar, ...baz] = [], _export("foo", foo), _export("bar", bar), _export("baz", baz);
    }
  };
});

"#
);

// systemjs_export_default_7
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_7,
  r#"
export default function foo () {}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  function foo() {}

  _export("default", foo);

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_export_from_5
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_from_5,
  r#"
export {foo as default} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      _export("default", _foo.foo);
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_export_const_destructuring_array_default_params
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_const_destructuring_array_default_params,
  r#"
export const [foo, bar = 2] = [];

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var foo, bar;
  return {
    setters: [],
    execute: function () {
      [foo, bar = 2] = [], _export("foo", foo), _export("bar", bar);
    }
  };
});

"#
);

// systemjs_export_const_destructuring_object_default_params
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_const_destructuring_object_default_params,
  r#"
export const { foo, bar = 1 } = {};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var foo, bar;
  return {
    setters: [],
    execute: function () {
      ({
        foo,
        bar = 1
      } = {}), _export("foo", foo), _export("bar", bar);
    }
  };
});

"#
);

// systemjs_export_named
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named,
  r#"
export {foo};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("foo", foo);
    }
  };
});

"#
);

// systemjs_export_named_5
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named_5,
  r#"
export {foo as default, bar};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", foo);

      _export("bar", bar);
    }
  };
});

"#
);

// systemjs_export_default_4
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_4,
  r#"
export default foo;

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", foo);
    }
  };
});

"#
);

// dynamic_import

// systemjs_hoist_function_exports
test!(
  syntax(),
  tr(Default::default()),
  systemjs_hoist_function_exports,
  r#"
import { isEven } from "./evens";

export function nextOdd(n) {
  return p = isEven(n) ? n + 1 : n + 2;
}

export var p = 5;

for (var a in b) ;

for (var i = 0, j = 0;;) ;

export var isOdd = (function (isEven) {
  return function (n) {
    return !isEven(n);
  };
})(isEven);

"#,
  r#"
System.register(["./evens"], function (_export, _context) {
  "use strict";

  var isEven, p, a, i, j, isOdd;

  function nextOdd(n) {
    return _export("p", p = isEven(n) ? n + 1 : n + 2);
  }

  _export("nextOdd", nextOdd);

  _export("a", void 0);

  return {
    setters: [function (_evens) {
      isEven = _evens.isEven;
    }],
    execute: function () {
      _export("p", p = 5);

      for (a in b);

      for (i = 0, j = 0;;);

      _export("isOdd", isOdd = function (isEven) {
        return function (n) {
          return !isEven(n);
        };
      }(isEven));
    }
  };
});

"#
);

// systemjs_export_fn_decl
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_fn_decl,
  r#"
var testProp = 'test property';

function testFunc() {
  return 'test function';
}

export {
  testFunc,
  testProp
};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var testProp;

  function testFunc() {
    return 'test function';
  }

  _export("testFunc", testFunc);

  return {
    setters: [],
    execute: function () {
      _export("testProp", testProp = 'test property');
    }
  };
});
"#
);

// systemjs_export_default_9
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_9,
  r#"
export default (function(){return "foo"})();

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", function () {
        return "foo";
      }());
    }
  };
});

"#
);

// systemjs_export_named_3
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named_3,
  r#"
export {foo as bar};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("bar", foo);
    }
  };
});

"#
);

// systemjs_export_named_2
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named_2,
  r#"
export {foo, bar};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("foo", foo);

      _export("bar", bar);
    }
  };
});

"#
);

// systemjs_hoisting_bindings
test!(
  syntax(),
  tr(Default::default()),
  systemjs_hoisting_bindings,
  r#"
export function a() {
  alert("a");
  c++;
}

export var c = 5;

function b() {
  a();
}

b();

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var c;

  function a() {
    alert("a");
    _export("c", +c + 1), c++;
  }

  _export("a", a);

  function b() {
    a();
  }

  return {
    setters: [],
    execute: function () {
      _export("c", c = 5);

      b();
    }
  };
});

"#
);

// systemjs_export_default_5
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_5,
  r#"
export default function () {}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  _export("default", function () {});

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_export_default
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default,
  r#"
export default 42;

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", 42);
    }
  };
});

"#
);

// systemjs_export_default_3
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_3,
  r#"
export default [];

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", []);
    }
  };
});

"#
);

// dynamic_import_import_meta
test!(
  syntax(),
  tr(Default::default()),
  dynamic_import_import_meta,
  r#"
console.log(import.meta.url);
"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      console.log(_context.meta.url);
    }
  };
});

"#
);

// dynamic_import_dynamic_import
test!(
  syntax(),
  tr(Default::default()),
  dynamic_import_dynamic_import,
  r#"
export function lazyLoadOperation () {
  return import('./x')
  .then(function (x) {
    x.y();
  });
}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  function lazyLoadOperation() {
    return _context.import('./x').then(function (x) {
      x.y();
    });
  }

  _export("lazyLoadOperation", lazyLoadOperation);

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_export_default_8
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_8,
  r#"
export default class Foo {}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      class Foo {}

      _export("default", Foo);
    }
  };
});

"#
);

// systemjs_export_named_4
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named_4,
  r#"
export {foo as default};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  return {
    setters: [],
    execute: function () {
      _export("default", foo);
    }
  };
});

"#
);

// systemjs_export_uninitialized
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_uninitialized,
  r#"
export var m;
"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var m;

  _export("m", void 0);

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_module_name
test!(
  syntax(),
  tr(Default::default()),
  systemjs_module_name,
  r#"
export var name = __moduleName;
"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var name;
  return {
    setters: [],
    execute: function () {
      _export("name", name = _context.id);
    }
  };
});

"#
);

// systemjs_export_const_destructuring_object
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_const_destructuring_object,
  r#"
export const { foo: bar, baz } = {};

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var bar, baz;
  return {
    setters: [],
    execute: function () {
      ({
        foo: bar,
        baz
      } = {}), _export("bar", bar), _export("baz", baz);
    }
  };
});

"#
);

// systemjs_export_from_2
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_from_2,
  r#"
export {foo} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      _export("foo", _foo.foo);
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_imports_mixing
test!(
  syntax(),
  tr(Default::default()),
  systemjs_imports_mixing,
  r#"
import foo, {baz as xyz} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  var foo, xyz;
  return {
    setters: [function (_foo) {
      foo = _foo.default;
      xyz = _foo.baz;
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_remap
test!(
  syntax(),
  tr(Default::default()),
  systemjs_remap,
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
System.register([], function (_export, _context) {
  "use strict";

  var test, a, b, d;
  return {
    setters: [],
    execute: function () {
      _export("test", test = 2);

      _export("test", test = 5);

      _export("test", +test + 1), test++;

      (function () {
        var test = 2;
        test = 3;
        test++;
      })();

      _export("a", a = 2);

      _export("a", a = 3);

      _export("c", b = 2);

      _export("c", b = 3);

      _export("f", _export("e", d = 3));

      _export("f", _export("e", d = 4));
    }
  };
});

"#
);

// systemjs_imports_default
test!(
  syntax(),
  tr(Default::default()),
  systemjs_imports_default,
  r#"
import foo from "foo";
import {default as foo2} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  var foo, foo2;
  return {
    setters: [function (_foo) {
      foo = _foo.default;
      foo2 = _foo.default;
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_export_from_6
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_from_6,
  r#"
export {foo as default, bar} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      _export({
        default: _foo.foo,
        bar: _foo.bar
      });
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_imports_numbered
test!(
  syntax(),
  tr(Default::default()),
  systemjs_imports_numbered,
  r#"
import "2";
import "1";

"#,
  r#"
System.register(["2", "1"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_) {}, function (_2) {}],
    execute: function () {}
  };
});

"#
);

// systemjs_imports_glob
test!(
  syntax(),
  tr(Default::default()),
  systemjs_imports_glob,
  r#"
import * as foo from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  var foo;
  return {
    setters: [function (_foo) {
      foo = _foo;
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_imports
test!(
  syntax(),
  tr(Default::default()),
  systemjs_imports,
  r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";

"#,
  r#"
System.register(["foo", "foo-bar", "./directory/foo-bar"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {}, function (_fooBar) {}, function (_directoryFooBar) {}],
    execute: function () {}
  };
});

"#
);

// systemjs_export_from_3
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_from_3,
  r#"
export {foo, bar} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      _export({
        foo: _foo.foo,
        bar: _foo.bar
      });
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_exports_variable
test!(
  syntax(),
  tr(Default::default()),
  systemjs_exports_variable,
  r#"
export var foo = 1;
export var foo2 = function () {};
export var foo3;
export let foo4 = 2;
export let foo5;
export const foo6 = 3;
export function foo7 () {}
export class foo8 {}
foo3 = 5;

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  var foo, foo2, foo3, foo4, foo5, foo6;

  function foo7() {}

  _export("foo7", foo7);

  _export({
    foo3: void 0,
    foo5: void 0
  });

  return {
    setters: [],
    execute: function () {
      _export("foo", foo = 1);

      _export("foo2", foo2 = function () {});

      _export("foo4", foo4 = 2);

      _export("foo6", foo6 = 3);

      class foo8 {}

      _export("foo8", foo8);

      _export("foo3", foo3 = 5);
    }
  };
});

"#
);

// systemjs_imports_named
test!(
  syntax(),
  tr(Default::default()),
  systemjs_imports_named,
  r#"
import {bar} from "foo";
import {bar2, baz} from "foo";
import {bar as baz2} from "foo";
import {bar as baz3, xyz} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  var bar, bar2, baz, baz2, baz3, xyz;
  return {
    setters: [function (_foo) {
      bar = _foo.bar;
      bar2 = _foo.bar2;
      baz = _foo.baz;
      baz2 = _foo.bar;
      baz3 = _foo.bar;
      xyz = _foo.xyz;
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_export_named_6
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_named_6,
  r#"
export function foo() {}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  function foo() {}

  _export("foo", foo);

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_export_from
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_from,
  r#"
export * from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      var _exportObj = {};

      for (var _key in _foo) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _foo[_key];
      }

      _export(_exportObj);
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_export_const_destructuring_object_rest

// systemjs_export_default_6
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_default_6,
  r#"
export default class {}

"#,
  r#"
System.register([], function (_export, _context) {
  "use strict";

  _export("default", class {});

  return {
    setters: [],
    execute: function () {}
  };
});

"#
);

// systemjs_export_from_4
test!(
  syntax(),
  tr(Default::default()),
  systemjs_export_from_4,
  r#"
export {foo as bar} from "foo";

"#,
  r#"
System.register(["foo"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_foo) {
      _export("bar", _foo.foo);
    }],
    execute: function () {}
  };
});

"#
);

// systemjs_overview
test!(
  syntax(),
  tr(Default::default()),
  systemjs_overview,
  r#"
import "foo";
import "foo-bar";
import "./directory/foo-bar";
import foo from "foo";
import * as foo2 from "foo";
import {bar} from "foo";
import {foo as bar2} from "foo";

export {test};
export var test2 = 5;

export default test;

"#,
  r#"
System.register(["foo", "foo-bar", "./directory/foo-bar"], function (_export, _context) {
  "use strict";

  var foo, foo2, bar, bar2, test2;
  return {
    setters: [function (_foo) {
      foo = _foo.default;
      foo2 = _foo;
      bar = _foo.bar;
      bar2 = _foo.foo;
    }, function (_fooBar) {}, function (_directoryFooBar) {}],
    execute: function () {
      _export("test", test);

      _export("test2", test2 = 5);

      _export("default", test);
    }
  };
});

"#
);

// systemjs
