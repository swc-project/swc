use std::path::PathBuf;

use swc_ecma_parser::Syntax;
use swc_ecma_transforms_module::cjs::cjs;
use swc_ecma_transforms_testing::{test, test_fixture};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Fold {
    cjs()
}

test!(
    syntax(),
    |_| tr(),
    strip,
    r#"
    import "./mod_a";
    import a, { b, c as d, "1" as e } from "./mod_b";
    import * as f from "./mod_c";

    export function g() {}
    export const h = 42;

    export default class {}

    a(c);
    a.b(d);
    f(e(b), a);

    b(e(b));
    b.c(f);

    export { a, b as "1", e as "2" };
    export { c as d, e, "2" as f, "3" as "4" } from "./mod_d";
    export * as c from "./mod_e";
    export * from "./mod_f";
"#,
    r#"
    "use strict";
    __export(exports, {
        "1": function() { return _modB.b; },
        "2": function() { return _modB["1"]; },
        "4": function() { return _modD["3"]; },
        a: function() { return _modB.default; },
        c: function() { return _modE; },
        d: function() { return _modD.c; },
        default: function() { return _default; },
        e: function() { return _modD.e; },
        f: function() { return _modD["2"]; },
        g: function() { return g; },
        h: function() { return h; }
    });
    module.exports = __toCJS(exports);
    require("./mod_a");
    var _modB = __toESM(require("./mod_b"));
    var _modC = __toESM(require("./mod_c"));
    var _modD = require("./mod_d");
    var _modE = __toESM(require("./mod_e"));
    __reExport(exports, require("./mod_f"), module.exports);
    function g() {}
    const h = 42;
    class _default {}
    (0, _modB.default)(c);
    _modB.default.b(_modB.c);
    (0, _modC)((0, _modB["1"])(_modB.b), _modB.default);
    (0, _modB.b)((0, _modB["1"])(_modB.b));
    _modB.b.c(_modC);
"#
);

#[testing::fixture("tests/fixture/common/**/input.js")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.cjs");

    test_fixture(Default::default(), &|_| tr(), &input, &output);
}
