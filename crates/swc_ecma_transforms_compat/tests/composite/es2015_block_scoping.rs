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
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture, Tester};
use swc_ecma_visit::{visit_mut_obj_and_computed, visit_mut_pass, VisitMut, VisitMutWith};

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    (
        resolver(unresolved_mark, Mark::new(), false),
        block_scoping(unresolved_mark),
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    for_loop,
    include_str!("inline-inputs/es2015_block_scoping/for_loop/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    for_let_loop,
    include_str!("inline-inputs/es2015_block_scoping/for_let_loop/input.js")
);

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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_662,
    include_str!("inline-inputs/es2015_block_scoping/issue_662/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_686,
    include_str!("inline-inputs/es2015_block_scoping/issue_686/input.js")
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

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            es2015::es2015(unresolved_mark, Some(comments.clone()), Default::default()),
        )
    },
    issue_1022_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_1022_1/input.js")
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            es2015::es2015(unresolved_mark, Some(comments.clone()), Default::default()),
        )
    },
    issue_1022_2,
    include_str!("inline-inputs/es2015_block_scoping/issue_1022_2/input.js")
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            es2015::es2015(unresolved_mark, Some(comments.clone()), Default::default()),
        )
    },
    issue_1022_3,
    include_str!("inline-inputs/es2015_block_scoping/issue_1022_3/input.js")
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(mark, Some(comments.clone()), Default::default())
    },
    issue_1021_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_1021_1/input.js")
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(mark, Some(comments.clone()), Default::default())
    },
    issue_1036_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_1036_1/input.js")
);

test!(
    Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), mark),
            es2015::es2015(mark, Some(comments.clone()), Default::default()),
        )
    },
    issue_1036_2,
    include_str!("inline-inputs/es2015_block_scoping/issue_1036_2/input.js")
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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_1231_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_1231_1/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_1415_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_1415_1/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::new();
        (
            resolver(mark, Mark::new(), false),
            es2015::es2015(mark, Some(comments.clone()), Default::default()),
        )
    },
    arguments_loop,
    include_str!("inline-inputs/es2015_block_scoping/arguments_loop/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(mark, Some(comments.clone()), Default::default())
    },
    arguments_loop_member,
    include_str!("inline-inputs/es2015_block_scoping/arguments_loop_member/input.js")
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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |Tester { comments, .. }| {
        let mark = Mark::fresh(Mark::root());
        es2015::es2015(mark, Some(comments.clone()), Default::default())
    },
    arguments_function,
    include_str!("inline-inputs/es2015_block_scoping/arguments_function/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_1462_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_1462_1/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_2027_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_2027_1/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |t| {
        let mark = Mark::fresh(Mark::root());

        es2015(mark, Some(t.comments.clone()), Default::default())
    },
    issue_2027_2,
    include_str!("inline-inputs/es2015_block_scoping/issue_2027_2/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_2998_1,
    include_str!("inline-inputs/es2015_block_scoping/issue_2998_1/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_2998_2,
    include_str!("inline-inputs/es2015_block_scoping/issue_2998_2/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    issue_4196,
    include_str!("inline-inputs/es2015_block_scoping/issue_4196/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| block_scoping(Mark::new()),
    labeled_break,
    include_str!("inline-inputs/es2015_block_scoping/labeled_break/input.js")
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

#[testing::fixture("tests/composite/block-scoping/**/exec.js")]
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

#[testing::fixture("tests/composite/block-scoping/**/input.js")]
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
