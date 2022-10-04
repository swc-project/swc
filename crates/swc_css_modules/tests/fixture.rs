use std::path::PathBuf;

use swc_atoms::JsWord;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType},
    CodeGenerator, CodegenConfig, Emit,
};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/*.css", exclude("compiled\\.css"))]
fn imports(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let mut errors = vec![];
        let ss = swc_css_parser::parse_file(&fm, Default::default(), &mut errors).unwrap();
        let result = swc_css_modules::imports::analyze_imports(&ss);

        if result.is_empty() {
            return Ok(());
        }

        let s = serde_json::to_string_pretty(&result).unwrap();
        NormalizedOutput::from(s)
            .compare_to_file(input.with_file_name(format!(
                "{}.imports.json",
                input.file_stem().unwrap().to_string_lossy()
            )))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/*.css", exclude("compiled\\.css"))]
fn compile(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let mut errors = vec![];
        let mut ss = swc_css_parser::parse_file(&fm, Default::default(), &mut errors).unwrap();
        let result = swc_css_modules::imports::analyze_imports(&ss);

        let transform_result = swc_css_modules::compile(&mut ss, TestConfig {});

        let mut buf = String::new();
        {
            let mut wr = BasicCssWriter::new(
                &mut buf,
                None,
                BasicCssWriterConfig {
                    indent_type: IndentType::Space,
                    indent_width: 2,
                    ..Default::default()
                },
            );
            let mut g = CodeGenerator::new(
                wr,
                CodegenConfig {
                    ..Default::default()
                },
            );

            g.emit(&ss).unwrap();
        }

        NormalizedOutput::from(buf)
            .compare_to_file(input.with_file_name(format!(
                "{}.compiled.css",
                input.file_stem().unwrap().to_string_lossy()
            )))
            .unwrap();

        if !transform_result.classes.is_empty() {
            let transformed_classes =
                serde_json::to_string_pretty(&transform_result.classes).unwrap();

            NormalizedOutput::from(transformed_classes)
                .compare_to_file(input.with_file_name(format!(
                    "{}.transform.json",
                    input.file_stem().unwrap().to_string_lossy()
                )))
                .unwrap();
        }
        Ok(())
    })
    .unwrap();
}

struct TestConfig {}

impl swc_css_modules::TransformConfig for TestConfig {
    fn get_class_name(&self, local: &JsWord) -> JsWord {
        format!("__local__{}", local).into()
    }
}
