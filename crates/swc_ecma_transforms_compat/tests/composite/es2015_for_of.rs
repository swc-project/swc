use std::{fs::read_to_string, path::PathBuf};

use swc_common::{comments::NoopComments, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{
    self,
    for_of::{for_of, Config},
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture};

fn syntax() -> Syntax {
    Default::default()
}

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_let,
    include_str!("inline-inputs/es2015_for_of/spec_let/input.js")
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_member_expr,
    include_str!("inline-inputs/es2015_for_of/spec_member_expr/input.js")
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_multiple,
    include_str!("inline-inputs/es2015_for_of/spec_multiple/input.js")
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_nested_label_for_of,
    include_str!("inline-inputs/es2015_for_of/spec_nested_label_for_of/input.js")
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_var,
    include_str!("inline-inputs/es2015_for_of/spec_var/input.js")
);

// for_of_as_array_for_of
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of/input.js")
);

// for_of_as_array_for_of_array_pattern
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_array_pattern,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of_array_pattern/input.js")
);

// regression_redeclare_array_8913
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    regression_redeclare_array_8913,
    include_str!("inline-inputs/es2015_for_of/regression_redeclare_array_8913/input.js")
);

// for_of_as_array_for_of_declaration_array_pattern
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_declaration_array_pattern,
    include_str!(
        "inline-inputs/es2015_for_of/for_of_as_array_for_of_declaration_array_pattern/input.js"
    )
);

test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_expression,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of_expression/input.js")
);

// for_of_as_array_for_of_declaration
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_declaration,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of_declaration/input.js")
);

// regression_scope_9696
test_exec!(
    syntax(),
    |_| for_of(Default::default()),
    regression_scope_9696_exec,
    r#"
var arr = [1, 2, 3];
var results = [];

for (let v of arr) {
  results.push(v);
  arr = null;
}

expect(results).toEqual([1, 2, 3]);

"#
);

// for_of_as_array_for_of_static_declaration
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_static_declaration,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of_static_declaration/input.js")
);

// for_of_as_array_for_of_static
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_static,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of_static/input.js")
);

// for_of_as_array_for_of_import_es2015
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_import_es2015,
    include_str!("inline-inputs/es2015_for_of/for_of_as_array_for_of_import_es2015/input.js")
);

// regression_label_object_with_comment_4995
test!(
    syntax(),
    |_| for_of(Default::default()),
    regression_label_object_with_comment_4995,
    include_str!("inline-inputs/es2015_for_of/regression_label_object_with_comment_4995/input.js")
);

// regression_if_label_3858
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    regression_if_label_3858,
    include_str!("inline-inputs/es2015_for_of/regression_if_label_3858/input.js")
);

#[testing::fixture("tests/composite/for-of/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(input).unwrap();

    compare_stdout(
        Syntax::default(),
        |_| {
            let top_level_mark = Mark::new();

            (
                resolver(Mark::new(), top_level_mark, false),
                for_of(Config {
                    assume_array: false,
                    ..Default::default()
                }),
            )
        },
        &input,
    );
}

#[testing::fixture("tests/composite/for-of/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::default(),
        &|_| {
            let top_level_mark = Mark::new();

            (
                resolver(Mark::new(), top_level_mark, false),
                for_of(Config {
                    assume_array: false,
                    ..Default::default()
                }),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}

#[testing::fixture("tests/composite/for-of/issue-12433/modes/input.js")]
fn fixture_modes(input: PathBuf) {
    for (config, output) in [
        (
            Config {
                loose: true,
                ..Default::default()
            },
            "output.loose.js",
        ),
        (
            Config {
                assume_array: true,
                ..Default::default()
            },
            "output.array.js",
        ),
    ] {
        test_fixture(
            Syntax::default(),
            &|_| (resolver(Mark::new(), Mark::new(), false), for_of(config)),
            &input,
            &input.with_file_name(output),
            Default::default(),
        );
    }
}

#[testing::fixture("tests/composite/for-of/issue-12433/modes/exec.js")]
fn exec_modes(input: PathBuf) {
    let input = read_to_string(input).unwrap();
    for config in [
        Config {
            loose: true,
            ..Default::default()
        },
        Config {
            assume_array: true,
            ..Default::default()
        },
    ] {
        compare_stdout(
            Syntax::default(),
            |_| (resolver(Mark::new(), Mark::new(), false), for_of(config)),
            &input,
        );
    }
}

#[testing::fixture("tests/composite/for-of/**/exec.js")]
fn exec_es2015(input: PathBuf) {
    let input = read_to_string(input).unwrap();

    compare_stdout(
        Syntax::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                es2015::es2015(unresolved_mark, Some(NoopComments), Default::default()),
            )
        },
        &input,
    );
}
