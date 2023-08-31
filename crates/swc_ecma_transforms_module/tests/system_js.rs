#![deny(warnings)]

use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_module::system_js::{system_js, Config};
use swc_ecma_transforms_testing::{test, test_fixture, Tester};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
}

fn tr(_tester: &mut Tester<'_>, config: Config) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        system_js(unresolved_mark, config)
    )
}

test!(
    syntax(),
    |tester| tr(tester, Default::default()),
    allow_continuous_assignment,
    r#"var e = {}; e.a = e.b = e.c = e.d = e.e = e.f = e.g = e.h = e.i = e.j = e.k = e.l = e.m = e.n = e.o = e.p = e.q = e.r = e.s = e.t = e.u = e.v = e.w = e.x = e.y = e.z = e.A = e.B = e.C = e.D = e.E = e.F = e.G = e.H = e.I = e.J = e.K = e.L = e.M = e.N = e.O = e.P = e.Q = e.R = e.S = void 0;"#,
    r#"System.register([], function (_export, _context) {
        "use strict";
        var e;
        return {
            setters: [],
            execute: function () {
                e = {};
                e.a = e.b = e.c = e.d = e.e = e.f = e.g = e.h = e.i = e.j = e.k = e.l = e.m = e.n = e.o = e.p = e.q = e.r = e.s = e.t = e.u = e.v = e.w = e.x = e.y = e.z = e.A = e.B = e.C = e.D = e.E = e.F = e.G = e.H = e.I = e.J = e.K = e.L = e.M = e.N = e.O = e.P = e.Q = e.R = e.S = void 0;
            }
        };
    });"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: true
        }
    ),
    allow_top_level_this_true,
    r#"export var v = this;"#,
    r#"System.register([], function(_export, _context) {
        "use strict";
        var v;
        return {
            setters: [],
            execute: function() {
                _export("v", v = this);
            }
        };
    });"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false
        }
    ),
    iife,
    r#"
    (function(a) {
        this.foo = a;
    })(this);
    "#,
    r#"System.register([], function(_export, _context) {
        "use strict";
        return {
            setters: [],
            execute: function() {
                (function(a) {
                    this.foo = a;
                })(void 0);
            }
        };
    });"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false
        }
    ),
    top_level_this_false_class,
    r#"
    const a = this;
    class A {
        constructor() {
          this.a = 1;
        }
        test() {
          this.a = 2;
        }
    }"#,
    r#"System.register([], function(_export, _context) {
        "use strict";
        var A, a;
        return {
            setters: [],
            execute: function() {
                a = void 0;
                A = class A {
                    constructor(){
                        this.a = 1;
                    }
                    test() {
                        this.a = 2;
                    }
                };
            }
        };
    });"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false
        }
    ),
    allow_top_level_this_false,
    r#"export var v = this;
    function a() {
        function d () {}
        var b = this; 
    } "#,
    r#"System.register([], function(_export, _context) {
        "use strict";
        var v;
        function a() {
            function d() {}
            var b = this;
        }
        return {
            setters: [],
            execute: function() {
                _export("v", v = void 0);
            }
        };
    });"#
);

test!(
    syntax(),
    |tester| tr(tester, Default::default()),
    imports,
    r#"
    import.meta.url;
    import.meta.fn();
    await import('./test2');
    "#,
    r#"
    System.register([], function(_export, _context) {
        "use strict";
        return {
            setters: [],
            execute: async function() {
                _context.meta.url;
                _context.meta.fn();
                await _context.import('./test2');
            }
        };
    });
    "#
);

// TODO: test get-module-name-option, tla

#[testing::fixture("tests/fixture/systemjs/**/input.mjs")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.mjs");

    test_fixture(
        syntax(),
        &|tester| tr(tester, Default::default()),
        &input,
        &output,
        Default::default(),
    );
}
