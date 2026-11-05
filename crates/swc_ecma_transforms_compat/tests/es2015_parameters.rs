mod common;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{
        arrow, block_scoping, classes, destructuring, parameters, parameters::Config, spread,
    },
    es2017::async_to_generator,
};
use swc_ecma_transforms_testing::test_exec;

fn syntax() -> Syntax {
    Default::default()
}

fn tr(c: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        parameters(c, unresolved_mark),
        destructuring(destructuring::Config { loose: false }),
        block_scoping(unresolved_mark),
    )
}

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_destructuring,
    r#"function required(msg) {
  throw new Error(msg);
}

function sum(
  { arr = required('arr is required') } = { arr: arr = [] },
  length = arr.length
) {
  let i = 0;
  let acc = 0;
  for (let item of arr) {
    if (i >= length) return acc;
    acc += item;
    i++;
  }
  return acc;
}

expect(sum({arr:[1,2]})).toBe(3);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_earlier_params,
    r#"function f(a, b = a, c = b) { return c; }

expect(3).toBe(f(3));"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_iife_1128,
    r#"const bar = true;

function foo(a = bar, ...b) {
  const bar = false;
  expect(b[0]).toBe(2);
  expect(b[1]).toBe(3);
}

foo(1, 2, 3);"#
);

test_exec!(
    ignore,
    syntax(),
    // Stage0
    |_| tr(Default::default()),
    default_iife_4253_exec,
    r#"class Ref {
  static nextId = 0
  constructor(id = ++Ref.nextId, n = id) {
    this.id = n
  }
}

expect(new Ref().id).toBe(1);
expect(new Ref().id).toBe(2);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_iife_self_exec,
    r#"class Ref {
  constructor(ref = Ref) {
    this.ref = ref
  }
}

expect(new Ref().ref).toBe(Ref);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_exec,
    r#"const a = 1;
function rest(b = a, ...a) {
  expect(b).toBe(1);
}
rest(undefined, 2)

function rest2(b = a, ...a) {
  expect(a[0]).toBe(2);
}
rest2(undefined, 2)

function rest3(b = a, ...a) {
  expect(a).toHaveLength(1);
}
rest3(undefined, 2)"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_setter_exec,
    r#"const defaultValue = 1;
const obj = {
  set field(num = defaultValue) {
    this.num = num;
  }
};
obj.field = void 0;

expect(obj.num).toBe(defaultValue);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    regression_5787_exec,
    r#"function f1(a, ...rest) {
  let b = rest[rest.length - 3];
  let c = rest[rest.length - 2];
  let d = rest[rest.length - 1];
  return [a, b, c, d];
}
expect(f1(1, 2)).toEqual([1, undefined, undefined, 2]);

function f2(a, ...rest) {
  return rest[-1];
}
expect(f2(1, 2)).toBeUndefined();"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    rest_length_exec,
    r#"var length = function (a, b, ...items) {
  return items.length;
};

expect(length()).toBe(0);
expect(length(1)).toBe(0);
expect(length(1, 2)).toBe(0);
expect(length(1, 2, 3)).toBe(1);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    rest_patterns_exec,
    r#"
function foo(...{ length }) {
  return length;
}

expect(foo(1, 2, 3)).toEqual(3);"#
);

// parameters_rest_async_arrow_functions

// parameters_rest_async_arrow_functions

// regression_6057_simple

// parameters_regression_4333

test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    issue_12084_exec,
    r#"
class Scope {
  static units(defs) {
    return defs;
  }

  static module = ((...defs) => this.units(defs));
  instance = ((...defs) => this.units(defs));

  units(defs) {
    return defs;
  }
}

expect(Scope.module(1, 2)).toEqual([1, 2]);
expect(new Scope().instance(3, 4)).toEqual([3, 4]);
"#
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_array_destructuring_exec,
    "function t([,,a] = [1,2,3]) { return a }

  expect(t()).toBe(3);
  expect(t([4,5,6])).toBe(6);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_earlier_params,
    "function f(a, b = a, c = b) { return c; }

    expect(f(3)).toBe(3);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_iife_1128,
    "const bar = true;

  function foo(a = bar, ...b) {
    const bar = false;
    expect(b[0]).toBe(2);
    expect(b[1]).toBe(3);
  }

  foo(1, 2, 3);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_iife_4253,
    "class Ref {
      static nextId = 0
      constructor(id = ++Ref.nextId, n = id) {
        this.id = n
      }
    }

    expect(new Ref().id).toBe(1);
    expect(new Ref().id).toBe(2);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_iife_self,
    "class Ref {
      constructor(ref = Ref) {
        this.ref = ref
      }
    }

    expect(new Ref().ref).toBe(Ref);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_object_destructuring,
    "function required(msg) {
      throw new Error(msg);
    }

    function sum(
      { arr = required('arr is required') } = { arr: arr = [] },
      length = arr.length
    ) {
      let i = 0;
      let acc = 0;
      for (let item of arr) {
        if (i >= length) return acc;
        acc += item;
        i++;
      }
      return acc;
    }

    expect(sum({arr:[1,2]})).toBe(3);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_rest,
    "const a = 1;
    function rest(b = a, ...a) {
      expect(b).toBe(1);
    }
    rest(undefined, 2)

    function rest2(b = a, ...a) {
      expect(a[0]).toBe(2);
    }
    rest2(undefined, 2)

    function rest3(b = a, ...a) {
      expect(a).toHaveLength(1);
    }
    rest3(undefined, 2)"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_overwrite_undefined,
    "function t(undefined = 17, a = 3) {
      return a;
    }

    expect(t()).toBe(3);"
);

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "classes-resolver-parameters-destructuring-block-scoping")]
    ClassesResolverParametersDestructuringBlockScoping,
    #[serde(rename = "resolver-parameters-destructuring-block-scoping-classes-spread")]
    ResolverParametersDestructuringBlockScopingClassesSpread,
    #[serde(rename = "resolver-async-to-generator-arrow-parameters")]
    ResolverAsyncToGeneratorArrowParameters,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture(
    "tests/parameters/classes-resolver-parameters-destructuring-block-scoping/**/input.js"
)]
#[testing::fixture("tests/parameters/resolver-async-to-generator-arrow-parameters/**/input.js")]
#[testing::fixture(
    "tests/parameters/resolver-parameters-destructuring-block-scoping-classes-spread/**/input.js"
)]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::ClassesResolverParametersDestructuringBlockScoping => {
                    Box::new((classes(Default::default()), tr(Default::default())))
                }
                CasePipeline::ResolverParametersDestructuringBlockScopingClassesSpread => {
                    Box::new((
                        tr(Default::default()),
                        classes(Default::default()),
                        spread(Default::default(), Mark::new()),
                    ))
                }
                CasePipeline::ResolverAsyncToGeneratorArrowParameters => Box::new({
                    let unresolved_mark = Mark::new();
                    let top_level_mark = Mark::new();
                    (
                        resolver(unresolved_mark, top_level_mark, false),
                        async_to_generator(Default::default(), unresolved_mark),
                        arrow(unresolved_mark),
                        parameters(Default::default(), unresolved_mark),
                    )
                }),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
