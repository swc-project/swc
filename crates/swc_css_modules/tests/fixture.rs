use std::path::PathBuf;

use indexmap::IndexMap;
use serde::Serialize;
use swc_atoms::JsWord;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType},
    CodeGenerator, Emit,
};
use swc_css_modules::CssClassName;
use swc_css_parser::parser::ParserConfig;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/*.css", exclude("compiled\\.css"))]
fn imports(input: PathBuf) {
    testing::run_test(false, |cm, _| {
        let fm = cm.load_file(&input).unwrap();
        let mut errors = Vec::new();
        let ss = swc_css_parser::parse_file(
            &fm,
            None,
            ParserConfig {
                css_modules: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();
        let result = swc_css_modules::imports::analyze_imports(&ss);

        if result.is_empty() {
            return Ok(());
        }

        NormalizedOutput::compare_json_to_file(
            &result,
            &input.with_file_name(format!(
                "{}.imports.json",
                input.file_stem().unwrap().to_string_lossy()
            )),
        );

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/*.css", exclude("compiled\\.css"))]
fn compile(input: PathBuf) {
    testing::run_test(false, |cm, _| {
        let fm = cm.load_file(&input).unwrap();
        let mut errors = Vec::new();
        let mut ss = swc_css_parser::parse_file(
            &fm,
            None,
            ParserConfig {
                css_modules: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        let _result = swc_css_modules::imports::analyze_imports(&ss);

        let transform_result = swc_css_modules::compile(&mut ss, TestConfig {});

        let mut buf = String::new();
        {
            let wr = BasicCssWriter::new(
                &mut buf,
                None,
                BasicCssWriterConfig {
                    indent_type: IndentType::Space,
                    indent_width: 2,
                    ..Default::default()
                },
            );
            let mut g = CodeGenerator::new(wr, Default::default());

            g.emit(&ss).unwrap();
        }

        NormalizedOutput::from(buf)
            .compare_to_file(input.with_file_name(format!(
                "{}.compiled.css",
                input.file_stem().unwrap().to_string_lossy()
            )))
            .unwrap();

        if !transform_result.renamed.is_empty() {
            let mut transformed_classes = transform_result
                .renamed
                .into_iter()
                .map(|(k, v)| {
                    (
                        k,
                        v.into_iter()
                            .map(|v| match v {
                                CssClassName::Global { name } => {
                                    CssClassNameForTest::Global { name: name.value }
                                }
                                CssClassName::Local { name } => {
                                    CssClassNameForTest::Local { name: name.value }
                                }
                                CssClassName::Import { name, from } => {
                                    CssClassNameForTest::Import {
                                        name: name.value,
                                        from,
                                    }
                                }
                            })
                            .collect::<Vec<_>>(),
                    )
                })
                .collect::<IndexMap<_, _>>();

            transformed_classes.sort_keys();

            NormalizedOutput::compare_json_to_file(
                &transformed_classes,
                &input.with_file_name(format!(
                    "{}.transform.json",
                    input.file_stem().unwrap().to_string_lossy()
                )),
            );
        }
        Ok(())
    })
    .unwrap();
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
enum CssClassNameForTest {
    Local {
        /// Tranformed css class name
        name: JsWord,
    },
    Global {
        name: JsWord,
    },
    Import {
        /// The exported class name. This is the value specified by the user.
        name: JsWord,
        /// The module specifier.
        from: JsWord,
    },
}

struct TestConfig {}

impl swc_css_modules::TransformConfig for TestConfig {
    fn new_name_for(&self, local: &JsWord) -> JsWord {
        format!("__local__{}", local).into()
    }
}
