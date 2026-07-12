use std::path::Path;

use swc_ecma_ast::{Module, Program};
use swc_ecma_parser::{Parser, SourceType};
use testing::NormalizedOutput;

fn with_module<F, Ret>(file_name: &str, f: F) -> Result<Ret, NormalizedOutput>
where
    F: FnOnce(Module) -> Ret,
{
    ::testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(Path::new(file_name))
            .unwrap_or_else(|e| panic!("failed to load {file_name}: {e}"));

        let source_type = if file_name.ends_with(".ts") {
            SourceType::typescript()
        } else {
            SourceType::module()
        };
        let result = Parser::new(&fm.src, source_type)
            .with_start_pos(fm.start_pos)
            .parse();
        for error in result.diagnostics {
            error.into_diagnostic(handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }
        let Program::Module(module) = result.program else {
            unreachable!("module source type must produce a module")
        };
        Ok(f(module))
    })
}

#[test]
fn color_js() {
    with_module("tests/serde/colors.js", |m| {
        let s = serde_json::to_string(&m).expect("failed to serialize");
        let _: Module = serde_json::from_str(&s).expect("failed to deserialize");
    })
    .expect("failed");
}

#[test]
fn color_ts() {
    with_module("tests/serde/colors.ts", |m| {
        let s = serde_json::to_string(&m).expect("failed to serialize");
        let _: Module = serde_json::from_str(&s).expect("failed to deserialize");
    })
    .expect("failed");
}

#[test]
fn super_js() {
    with_module("tests/serde/supers.js", |m| {
        let s = serde_json::to_string(&m).expect("failed to serialize");
        let _: Module = serde_json::from_str(&s).expect("failed to deserialize");
    })
    .expect("failed");
}
