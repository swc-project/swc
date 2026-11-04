use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2021;
use swc_ecma_transforms_testing::test_exec;

fn tr() -> impl Pass {
    es2021::logical_assignments()
}

fn syntax() -> Syntax {
    Syntax::Typescript(Default::default())
}

test_exec!(
    syntax(),
    |_| tr(),
    null_coalescing,
    "var x = undefined;
    var sets = 0;
    var obj = {
      get x() {
        return x;
      },
    
      set x(value) {
        sets++;
        x = value;
      },
    };
    
    expect(obj.x ??= 1).toBe(1);
    expect(sets).toBe(1);
    expect(obj.x ??= 2).toBe(1);
    expect(sets).toBe(1);
    
    var gets = 0;
    var deep = {
      get obj() {
        gets++;
        return obj;
      },
    };
    
    obj.x = undefined;
    expect(deep.obj.x ??= 1).toBe(1);
    expect(gets).toBe(1);
    expect(deep.obj.x ??= 2).toBe(1);
    expect(gets).toBe(2);
    
    var key = 0;
    obj.x = undefined;
    expect(obj[++key] ??= 1).toBe(1);
    expect(key).toBe(1);
    key = 0;
    expect(obj[++key] ??= 2).toBe(1);
    expect(key).toBe(1);
    
    obj.x = undefined;
    key = 0;
    expect(deep.obj[++key] ??= 1).toBe(1);
    expect(gets).toBe(3);
    expect(key).toBe(1);
    key = 0;
    expect(deep.obj[++key] ??= 2).toBe(1);
    expect(gets).toBe(4);
    expect(key).toBe(1);"
);

/// Named transform pipelines for the composite output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "logical-assignments")]
    LogicalAssignments,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/composite/logical-assignments/logical-assignments/**/input.js")]
fn composite_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = crate::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::LogicalAssignments => Box::new(tr()),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
