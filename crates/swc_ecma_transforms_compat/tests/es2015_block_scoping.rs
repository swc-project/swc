mod common;

use std::{fs::read_to_string, path::PathBuf};

use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::{Ident, Pass, PropName, TsQualifiedName};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015,
    es2015::{block_scoping, for_of::for_of},
    es2017::async_to_generator,
};
use swc_ecma_transforms_testing::{compare_stdout, test_exec, test_fixture, Tester};
use swc_ecma_visit::{visit_mut_obj_and_computed, visit_mut_pass, VisitMut, VisitMutWith};

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    (
        resolver(unresolved_mark, Mark::new(), false),
        block_scoping(unresolved_mark),
    )
}

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
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
    |_| block_scoping(Mark::new()),
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
    |_| (for_of(Default::default()), block_scoping(Mark::new())),
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

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
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
        es2015::es2015(mark, Some(comments.clone()), Default::default())
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

test_exec!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), mark),
            es2015::es2015(mark, Some(comments.clone()), Default::default()),
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

compare_stdout!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        (
            resolver(mark, Mark::new(), false),
            es2015::es2015(mark, Some(comments.clone()), Default::default()),
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

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_2998_3,
    "let a = 5;
const expected = [];
for (let b = 0; b < a; b++) {
    let c = 0, b = 10, d = 100;
    expected.push(b);
}
expect(expected).toEqual([10,10,10,10,10]);
"
);

#[testing::fixture("tests/block-scoping/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(input).unwrap();
    compare_stdout(
        Default::default(),
        |_| {
            let unresolved_mark = Mark::new();
            (
                resolver(unresolved_mark, Mark::new(), false),
                block_scoping(unresolved_mark),
            )
        },
        &input,
    );

    compare_stdout(
        Default::default(),
        |t| {
            let unresolved_mark = Mark::new();
            (
                resolver(unresolved_mark, Mark::new(), false),
                es2015(
                    unresolved_mark,
                    Some(t.comments.clone()),
                    Default::default(),
                ),
            )
        },
        &input,
    );
}

// Pipeline directories have their own runner; update this exclusion when adding
// one.
#[testing::fixture(
    "tests/block-scoping/**/input.js",
    exclude(
        "/tests/block-scoping/\
         (async-to-generator-es2015-fresh-mark|block-scoping|es2015-fresh-mark|resolver-es2015)/"
    )
)]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            (
                resolver(unresolved_mark, Mark::new(), false),
                block_scoping(unresolved_mark),
                visit_mut_pass(TsHygiene { unresolved_mark }),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}

struct TsHygiene {
    unresolved_mark: Mark,
}

impl VisitMut for TsHygiene {
    visit_mut_obj_and_computed!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if SyntaxContext::empty().apply_mark(self.unresolved_mark) == i.ctxt {
            println!("ts_hygiene: {} is unresolved", i.sym);
            return;
        }

        let ctxt = format!("{:?}", i.ctxt).replace('#', "");
        i.sym = format!("{}__{}", i.sym, ctxt).into();
        i.ctxt = SyntaxContext::empty();
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(n) = n {
            n.visit_mut_with(self);
        }
    }

    fn visit_mut_ts_qualified_name(&mut self, q: &mut TsQualifiedName) {
        q.left.visit_mut_with(self);
    }
}

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "es2015-fresh-mark")]
    Es2015FreshMark,
    #[serde(rename = "async-to-generator-es2015-fresh-mark")]
    AsyncToGeneratorEs2015FreshMark,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/block-scoping/async-to-generator-es2015-fresh-mark/**/input.js")]
#[testing::fixture("tests/block-scoping/es2015-fresh-mark/**/input.js")]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        swc_ecma_parser::Syntax::default(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::Es2015FreshMark => Box::new({
                    let Tester { comments, .. } = t;
                    {
                        let mark = Mark::fresh(Mark::root());
                        es2015::es2015(mark, Some(comments.clone()), Default::default())
                    }
                }),
                CasePipeline::AsyncToGeneratorEs2015FreshMark => Box::new({
                    let Tester { comments, .. } = t;
                    {
                        let mark = Mark::fresh(Mark::root());
                        (
                            async_to_generator(Default::default(), mark),
                            es2015::es2015(mark, Some(comments.clone()), Default::default()),
                        )
                    }
                }),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
