use std::path::PathBuf;

use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/*.css")]
fn imports(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let mut errors = vec![];
        let ss = swc_css_parser::parse_file(&fm, Default::default(), &mut errors).unwrap();
        let result = swc_css_modules::analyzer::analyze_imports(&ss);

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
