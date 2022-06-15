use std::{fs::read_to_string, path::PathBuf};

use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015,
    es2015::{block_scoping, for_of::for_of},
    es2017::async_to_generator,
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture, Tester};

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    for_loop,
    "for (const key in obj) {
            const bar = obj[key];

            let qux;
            let fog;

            if (Array.isArray(bar)) {
            qux = bar[0];
            fog = bar[1];
            } else {
            qux = bar;
            }

            baz(key, qux, fog);
        }",
    "for (var key in obj) {
            var bar = obj[key];

            var qux = void 0;
            var fog = void 0;

            if (Array.isArray(bar)) {
            qux = bar[0];
            fog = bar[1];
            } else {
            qux = bar;
            }

            baz(key, qux, fog);
        }"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    for_let_loop,
    "let functions = [];
for (let i = 0; i < 10; i++) {
	functions.push(function() {
		console.log(i);
	});
}
functions[0]();
functions[7]();",
    "
var _loop = function(i) {
    functions.push(function() {
        console.log(i);
    });
};
var functions = [];
for(var i = 0; i < 10; i++)_loop(i);
functions[0]();
functions[7]();
"
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    for_let_loop_exec,
    "let functions = [];
for (let i = 0; i < 10; i++) {
	functions.push(function() {
		return i;
	});
}
expect(functions[0]()).toBe(0);
expect(functions[7]()).toBe(7);
"
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    for_let_of_exec,
    "let functions = [];
for (let i of [1, 3, 5, 7, 9]) {
	functions.push(function() {
		return i;
	});
}
expect(functions[0]()).toBe(1);
expect(functions[1]()).toBe(3);
"
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| chain!(for_of(Default::default()), block_scoping()),
    issue_609_1,
    "let functions = [];
for (let i of [1, 3, 5, 7, 9]) {
	functions.push(function() {
		return i;
	});
}
expect(functions[0]()).toBe(1);
expect(functions[1]()).toBe(3);
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_662,
    "function foo(parts) {
  let match = null;

  for (let i = 1; i >= 0; i--) {
    for (let j = 0; j >= 0; j--) {
      match = parts[i][j];

      if (match) {
        break;
      }
    }

    if (match) {
      break;
    }
  }

  return match;
}

foo();",
    "function foo(parts) {
  var match = null;

  for (var i = 1; i >= 0; i--) {
    for (var j = 0; j >= 0; j--) {
      match = parts[i][j];

      if (match) {
        break;
      }
    }

    if (match) {
      break;
    }
  }

  return match;
}

foo();"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_686,
    "module.exports = function(values) {
    var vars = [];
    var elem = null, name, val;
    for (var i = 0; i < this.elements.length; i++) {
      elem = this.elements[i];
      name = elem.name;
      if (!name) continue;
      val = values[name];
      if (val == null) val = '';
      switch (elem.type) {
      case 'submit':
        break;
      case 'radio':
      case 'checkbox':
        elem.checked = val.some(function(str) {
          return str.toString() == elem.value;
        });
        break;
      case 'select-multiple':
        elem.fill(val);
        break;
      case 'textarea':
        elem.innerText = val;
        break;
      case 'hidden':
        break;
      default:
        if (elem.fill) {
          elem.fill(val);
        } else {
          elem.value = val;
        }
        break;
      }
    }
    return vars;
  };",
    "
        module.exports = function(values) {
            var _this = this, _loop = function(i) {
                elem = _this.elements[i];
                name = elem.name;
                if (!name) return \"continue\";
                val = values[name];
                if (val == null) val = '';
                switch(elem.type){
                    case 'submit':
                        break;
                    case 'radio':
                    case 'checkbox':
                        elem.checked = val.some(function(str) {
                            return str.toString() == elem.value;
                        });
                        break;
                    case 'select-multiple':
                        elem.fill(val);
                        break;
                    case 'textarea':
                        elem.innerText = val;
                        break;
                    case 'hidden':
                        break;
                    default:
                        if (elem.fill) {
                            elem.fill(val);
                        } else {
                            elem.value = val;
                        }
                        break;
                }
            };
            var vars = [];
            var elem = null, name, val;
            for(var i = 0; i < this.elements.length; i++)_loop(i);
            return vars;
        };
        "
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_723_1,
    "function foo() {
  const lod = { 0: { mig: 'bana' }};

  for (let i = 0; i < 1; i++) {
    const { mig } = lod[i];

    return false;

    (zap) => zap === mig;
  }

  return true;
}
expect(foo()).toBe(false);
"
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    issue_723_2,
    "function foo() {
  const lod = { 0: { mig: 'bana' }};

  for (let i = 0; i < 1; i++) {
    const { mig } = lod[i];

    return false;

    (zap) => zap === mig;
  }

  return true;
}
expect(foo()).toBe(false);
"
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    issue_1022_1,
    "
        for (let i = 0; i < 5; i++) {
            console.log(i++, [2].every(x => x != i))
        }
        ",
    r#"
        var _loop = function(i1) {
            console.log(i1++, [
                2
            ].every(function(x) {
                return x != i1;
            }));
            i = i1, void 0;
        };
        for(var i = 0; i < 5; i++)_loop(i);
        "#
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    issue_1022_2,
    "
        for (let i = 0; i < 5; i++) {
            console.log(i++, [2].every(x => x != i))
            if (i % 2 === 0) continue
        }
        ",
    r#"
        var _loop = function(i1) {
            console.log(i1++, [
                2
            ].every(function(x) {
                return x != i1;
            }));
            if (i1 % 2 === 0) return i = i1, "continue";
            i = i1, void 0;
        };
        for(var i = 0; i < 5; i++)_loop(i);
        "#
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    issue_1022_3,
    "
        for (let i = 0; i < 5; i++) {
            console.log(i++, [2].every(x => x != i))
            if (i % 2 === 0) break
        }
        ",
    r#"
        var _loop = function(i1) {
            console.log(i1++, [
                2
            ].every(function(x) {
                return x != i1;
            }));
            if (i1 % 2 === 0) return i = i1, "break";
            i = i1, void 0;
        };
        for(var i = 0; i < 5; i++){
            var _ret = _loop(i);
            if (_ret === "break") break;
        }
        "#
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    issue_1021_1,
    "
        class C {
            m() {
                for (let x = 0; x < 10; x++) console.log(this, y => y != x)
            }
        }
        ",
    r#"
        var C = function() {
            "use strict";
            function C() {
                _classCallCheck(this, C);
            }
            _createClass(C, [
                {
                    key: "m",
                    value: function m() {
                        var _this = this, _loop = function(x) {
                            console.log(_this, function(y) {
                                return y != x;
                            });
                        };
                        for(var x = 0; x < 10; x++)_loop(x);
                    }
                }
            ]);
            return C;
        }();
        "#
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    issue_1036_1,
    "
        async function foo() {
            await Promise.all([[1], [2], [3]].map(
                async ([a]) => Promise.resolve().then(() => a * 2))
            )
        }
        ",
    "
        async function foo() {
            await Promise.all([
                [
                    1
                ],
                [
                    2
                ],
                [
                    3
                ]
            ].map(async function(param) {
                var _param = _slicedToArray(param, 1), a = _param[0];
                return Promise.resolve().then(function() {
                    return a * 2;
                });
            }));
        }
        "
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator(Default::default()),
            es2015::es2015(
                mark,
                Some(comments.clone()),
                es2015::Config {
                    ..Default::default()
                },
            )
        )
    },
    issue_1036_2,
    "
        async function foo() {
            await Promise.all([[1], [2], [3]].map(
                async ([a]) => Promise.resolve().then(() => a * 2))
            )
        }
        ",
    r#"
    var regeneratorRuntime = require("regenerator-runtime");
    function foo() {
        return _foo.apply(this, arguments);
    }
    function _foo() {
        _foo = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return Promise.all([
                            [
                                1
                            ],
                            [
                                2
                            ],
                            [
                                3
                            ]
                        ].map(function() {
                            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(param) {
                                var _param, a;
                                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                    while(1)switch(_ctx.prev = _ctx.next){
                                        case 0:
                                            _param = _slicedToArray(param, 1), a = _param[0];
                                            return _ctx.abrupt("return", Promise.resolve().then(function() {
                                                return a * 2;
                                            }));
                                        case 2:
                                        case "end":
                                            return _ctx.stop();
                                    }
                                }, _callee);
                            }));
                            return function(_) {
                                return _ref.apply(this, arguments);
                            };
                        }()));
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return _foo.apply(this, arguments);
    }
"#
);

test_exec!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator(Default::default()),
            es2015::es2015(
                mark,
                Some(comments.clone()),
                es2015::Config {
                    ..Default::default()
                },
            )
        )
    },
    issue_1036_3,
    "
        const x = async function() {
            return await Promise.all([[1], [2], [3]].map(
                async ([a]) => Promise.resolve().then(() => a * 2))
            )
        };
        return x().then(x => {
            expect(x).toEqual([2, 4, 6])
        })
        "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_1231_1,
    "
    function combineOverlappingMatches(matches) {
        let hasOverlaps = false

        for (let i = matches.length - 1; i >= 0; i--) {
            let currentMatch = matches[i]
            let overlap = matches.find(match => {
                return match !== currentMatch && match.itemsType === currentMatch.itemsType
            })

            if (overlap) {
                hasOverlaps = true
                matches.splice(i, 1)
            }
        }

        if (hasOverlaps) {
            combineOverlappingMatches(matches)
        }
    }

    combineOverlappingMatches([1])
    ",
    "
    function combineOverlappingMatches(matches) {
        var _loop = function(i) {
            var currentMatch = matches[i];
            var overlap = matches.find((match)=>{
                return match !== currentMatch && match.itemsType === currentMatch.itemsType;
            });
            if (overlap) {
                hasOverlaps = true;
                matches.splice(i, 1);
            }
        };
        var hasOverlaps = false;
        for(var i = matches.length - 1; i >= 0; i--)_loop(i);
        if (hasOverlaps) {
            combineOverlappingMatches(matches);
        }
    }
    combineOverlappingMatches([
        1
    ]);
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_1415_1,
    "
    export function test(items) {
        const infoMap = new WeakMap();
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            let info;
            switch (item.type) {
            case 'branch1':
                info = item.method1();
                break;
            case 'branch2':
                info = item.method2();
                break;
            case 'branch3':
                info = item.method3(
                Object.fromEntries(
                    item.subItems.map((t) => [item.alias ?? t.name, getInfo(t)])
                )
                );
                break;
            default:
                throw new Error('boom');
            }
            infoMap.set(item, info); // important
        }

        function getInfo(item) {
            if (!infoMap.has(item)) {
            throw new Error('no info yet');
            }
            return infoMap.get(item);
        }
    }
    ",
    "
    export function test(items) {
        var _loop = function(i) {
            var item = items[i];
            var info = void 0;
            switch(item.type){
                case 'branch1':
                    info = item.method1();
                    break;
                case 'branch2':
                    info = item.method2();
                    break;
                case 'branch3':
                    info = item.method3(Object.fromEntries(item.subItems.map((t)=>[
                            item.alias ?? t.name,
                            getInfo(t)
                        ]
                    )));
                    break;
                default:
                    throw new Error('boom');
            }
            infoMap.set(item, info);
        };
        var infoMap = new WeakMap();
        for(var i = 0; i < items.length; i += 1)_loop(i);
        function getInfo(item) {
            if (!infoMap.has(item)) {
                throw new Error('no info yet');
            }
            return infoMap.get(item);
        }
    }
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    arguments_loop,
    "
        function test() {
            for (var i = 0; i < arguments.length; i++) {
              var arg = arguments[i];
              console.log((() => arg)());
            }
        }
        ",
    "
        function test() {
            var _arguments = arguments, _loop = function(i) {
                var arg = _arguments[i];
                console.log(function() {
                    return arg;
                }());
            };
            for(var i = 0; i < arguments.length; i++)_loop(i);
        }
        "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    arguments_loop_member,
    "
        function test(a) {
            for (var i = 0; i < a.arguments.length; i++) {
              var arg = a.arguments[i];
              console.log((() => arg)());
            }
        }
        ",
    "
        function test(a) {
            var _loop = function(i) {
                var arg = a.arguments[i];
                console.log(function() {
                    return arg;
                }());
            };
            for(var i = 0; i < a.arguments.length; i++)_loop(i);
        }
        "
);

compare_stdout!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    arguments_arrow,
    "
    function test() {
        for (var i = 0; i < arguments.length; i++) {
            console.log((() => arguments[i])());
        }
    }

    test(1, 2, 3);
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(
            mark,
            Some(comments.clone()),
            es2015::Config {
                ..Default::default()
            },
        )
    },
    arguments_function,
    "
        function test() {
            for (var i = 0; i < arguments.length; i++) {
              console.log((function () { return arguments[i] })());
            }
        }
        ",
    "
        function test() {
            var _loop = function(i) {
                console.log(function() {
                    return arguments[i];
                }());
            };
            for(var i = 0; i < arguments.length; i++)_loop(i);
        }
        "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_1462_1,
    "
    export default function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);

            if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
            }

            ownKeys.forEach(function (key) {
            defineProperty(target, key, source[key]);
            });
        }

        return target;
    }
    ",
    "
    export default function _objectSpread(target) {
        var _arguments = arguments, _loop = function(i) {
            var source = _arguments[i] != null ? _arguments[i] : {
            };
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === 'function') {
                ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) \
     {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                }));
            }
            ownKeys.forEach(function(key) {
                defineProperty(target, key, source[key]);
            });
        };
        for(var i = 1; i < arguments.length; i++)_loop(i);
        return target;
    }
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_2027_1,
    "
    const keys = {
        a: 1,
        b: 2,
    }

    const controller = {}

    for (const key in keys) {
        controller[key] = (c, ...d) => {
            console.log(keys[key])
        }
      }
    ",
    "
    var _loop = function(key) {
        controller[key] = (c, ...d)=>{
            console.log(keys[key]);
        };
    };
    var keys = {
        a: 1,
        b: 2
    };
    var controller = {
    };
    for(var key in keys)_loop(key);
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |t| {
        let mark = Mark::fresh(Mark::root());

        es2015(mark, Some(t.comments.clone()), Default::default())
    },
    issue_2027_2,
    "
    const keys = {
        a: 1,
        b: 2,
    }

    const controller = {}

    for (const key in keys) {
        controller[key] = (c, ...d) => {
            console.log(keys[key])
        }
      }
    ",
    "
    var _loop = function(key) {
        controller[key] = function(c) {
            for(var _len = arguments.length, d = new Array(_len > 1 ? _len - 1 : 0), _key = 1; \
     _key < _len; _key++){
                d[_key - 1] = arguments[_key];
            }
            console.log(keys[key]);
        };
    };
    var keys = {
        a: 1,
        b: 2
    };
    var controller = {
    };
    for(var key in keys)_loop(key);
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_2998_1,
    "
    let a = 5;
for (let b = 0; b < a; b++) {
    let c = 0, b = 10, d = 100;
    console.log(b);
}
    ",
    "
    var a = 5;
for(var b = 0; b < a; b++){
    var c = 0, b1 = 10, d = 100;
    console.log(b);
}
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_2998_2,
    "
    for (var a; ;) { }
    for (var a = ['a', 'b']; ;) { }
    ",
    "
    for (var a; ;) { }
    for (var a = ['a', 'b']; ;) { }
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_4196,
    "
    for (let i = 0; i < 2; i++) {
        if (i === 0) continue
        if (i === 1) break

        [1].forEach((_) => {
          console.log(i)
        })
    }
    ",
    r#"
    var _loop = function(i) {
        if (i === 0) return "continue";
        if (i === 1) return "break";
        [
            1
        ].forEach((_)=>{
            console.log(i);
        });
    };
    for(var i = 0; i < 2; i++){
        var _ret = _loop(i);
        if (_ret === "break") break;
    }
    "#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    labeled_break,
    "
    a:
    b:
    for (let i = 0; i < 2; i++) {
        if (i === 0) continue a
        if (i === 1) break b

        [1].forEach((_) => {
          console.log(i)
        })
    }
    ",
    r#"
    var _loop = function(i) {
        if (i === 0) return "continue|a";
        if (i === 1) return "break|b";
        [
            1
        ].forEach((_)=>{
            console.log(i);
        });
    };
    a: b: for(var i = 0; i < 2; i++){
        var _ret = _loop(i);
        switch(_ret){
            case "continue|a":
                continue a;
            case "break|b":
                break b;
        }
    }
    "#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(),
    issue_2998_3,
    "let a = 5;
const expected = [];
for (let b = 0; b < a; b++) {
    let c = 0, b = 10, d = 100;
    expected.push(b);
}
expect(expected).toEqual([0,1,2,3,4]);
"
);

#[testing::fixture("tests/block-scoping/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(&input).unwrap();
    compare_stdout(
        Default::default(),
        |_| chain!(resolver(Mark::new(), Mark::new(), false), block_scoping()),
        &input,
    );
}

#[testing::fixture("tests/block-scoping/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| chain!(resolver(Mark::new(), Mark::new(), false), block_scoping()),
        &input,
        &output,
    );
}
