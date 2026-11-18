use std::path::PathBuf;

use swc::{config::JsMinifyOptions, BoolOrDataConfig, Compiler};
use testing::NormalizedOutput;

#[testing::fixture("tests/minify/**/input.js")]
fn minify(input_js: PathBuf) {
    let input_dir = input_js.parent().unwrap();
    let config_json_path = input_dir.join("config.json");

    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm);
        let fm = c.cm.load_file(&input_js).unwrap();

        let config_str = std::fs::read_to_string(&config_json_path).unwrap();
        let mut config: JsMinifyOptions = serde_json::from_str(&config_str).unwrap();

        if config.source_map.inner().is_none() {
            config.source_map = BoolOrDataConfig::from_bool(true);
        }

        let output = c.minify(fm, &handler, &config, Default::default()).unwrap();

        NormalizedOutput::from(output.code)
            .compare_to_file(input_dir.join("output.js"))
            .unwrap();

        let map = output.map.map(|json| {
            let json: serde_json::Value = serde_json::from_str(&json).unwrap();
            serde_json::to_string_pretty(&json).unwrap()
        });

        NormalizedOutput::from(map.unwrap())
            .compare_to_file(input_dir.join("output.map"))
            .unwrap();

        let extracted_comments_path = input_dir.join("extracted-comments.json");
        let extracted_comments = output.extracted_comments.unwrap_or_default();

        if extracted_comments_path.exists() || !extracted_comments.is_empty() {
            let extracted_comments = serde_json::to_string_pretty(&extracted_comments).unwrap();

            NormalizedOutput::from(extracted_comments)
                .compare_to_file(extracted_comments_path)
                .unwrap();
        }

        Ok(())
    })
    .unwrap()
}
