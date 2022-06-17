use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_transforms_module::cjs::cjs;
use swc_ecma_transforms_testing::{test, test_fixture};
use swc_ecma_transforms_typescript::{strip::strip_with_config, Config};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsConfig::default())
}

fn tr() -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        cjs(unresolved_mark, Default::default()),
        hygiene(),
        fixer(None)
    )
}

fn ts_tr() -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, true),
        strip_with_config(
            Config {
                preserve_import_equals: true,
                ..Default::default()
            },
            top_level_mark
        ),
        cjs(unresolved_mark, Default::default()),
        hygiene(),
        fixer(None)
    )
}

test!(
    syntax(),
    |_| tr(),
    test_1,
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
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
    require("./mod_a");
    var _modB = _interopRequireWildcard(require("./mod_b"));
    var _modC = _interopRequireWildcard(require("./mod_c"));
    var _modD = require("./mod_d");
    var _modE = _interopRequireWildcard(require("./mod_e"));
    _reExport(exports, require("./mod_f"));
    function g() {}
    const h = 42;
    class _default {}
    (0, _modB.default)(c);
    _modB.default.b(_modB.c);
    _modC((0, _modB["1"])(_modB.b), _modB.default);
    (0, _modB.b)((0, _modB["1"])(_modB.b));
    _modB.b.c(_modC);
"#
);

#[testing::fixture("tests/fixture/common/**/input.js")]
fn esm_to_cjs(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.cjs");

    test_fixture(syntax(), &|_| tr(), &input, &output);
}

#[testing::fixture("tests/fixture/common/**/input.ts")]
fn ts_to_cjs(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.cjs");

    test_fixture(ts_syntax(), &|_| ts_tr(), &input, &output);
}
