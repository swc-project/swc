mod common;

use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2020::nullish_coalescing::{nullish_coalescing, Config};
use swc_ecma_transforms_testing::{compare_stdout, test_exec};

fn tr(c: Config) -> impl Pass {
    nullish_coalescing(c)
}

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
}

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    runtime_semantics_exec,
    r#"
expect(null ?? undefined).toBeUndefined(undefined);
expect(undefined ?? null).toBeNull();
expect(false ?? true).toBe(false);
expect(0 ?? 1).toBe(0);
expect("" ?? "foo").toBe("");

var obj = { exists: true };
expect(obj.exists ?? false).toBe(true);
expect(obj.doesNotExist ?? "foo").toBe("foo");

var counter = 0;
function sideEffect() { return counter++; }
expect(sideEffect() ?? -1).toBe(0);

var counter2 = 0;
var obj2 = {
    get foo() { return counter2++; }
};
expect(obj2.foo ?? -1).toBe(0);
"#
);

test_exec!(
    Default::default(),
    |_| tr(Default::default()),
    issue_1570_2,
    "
    const a = {}
    a.b ??= '1'
    expect(a.b).toBe('1')
    "
);

compare_stdout!(
    syntax(),
    |_| tr(Default::default()),
    issue_7290_1,
    "
    var filter = {
        start_point: 1
    };

    filter.start_point ??= {
        location: null,
        radius: null
    }
    
    filter.end_point ??= {
        location: null,
        radius: null
    }

    console.log(filter.start_point)
    console.log(filter.end_point)
    "
);

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "nullish-coalescing")]
    NullishCoalescing,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/nullish-coalescing/nullish-coalescing/**/input.js")]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::NullishCoalescing => Box::new(tr(Default::default())),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
