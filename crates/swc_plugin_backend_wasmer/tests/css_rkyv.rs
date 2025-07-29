use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{anyhow, Error};
use rustc_hash::FxHashMap;
use serde_json::json;
use swc_common::{
    plugin::{metadata::TransformPluginMetadataContext, serialized::PluginSerializedBytes},
    sync::Lazy,
    FileName, Mark,
};
use swc_plugin_backend_wasmer::WasmerRuntime;
use swc_plugin_runner::runtime::Runtime;
use testing::CARGO_TARGET_DIR;
use tracing::info;

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.env("CARGO_TARGET_DIR", &*CARGO_TARGET_DIR);

        cmd.current_dir(dir);
        cmd.args(["build", "--target=wasm32-wasip1", "--release"])
            .stderr(Stdio::inherit());
        cmd.output()?;

        if !cmd
            .status()
            .expect("Exit code should be available")
            .success()
        {
            return Err(anyhow!("Failed to build plugin"));
        }
    }

    for entry in fs::read_dir(CARGO_TARGET_DIR.join("wasm32-wasip1").join("release"))? {
        let entry = entry?;

        let s = entry.file_name().to_string_lossy().into_owned();
        if s.eq_ignore_ascii_case("swc_noop_plugin.wasm") {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

static PLUGIN_BYTES: Lazy<swc_plugin_runner::plugin_module_bytes::CompiledPluginModuleBytes> =
    Lazy::new(|| {
        let path = build_plugin(
            &PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
                .join("tests")
                .join("css-plugins")
                .join("swc_noop_plugin"),
        )
        .unwrap();

        let raw_module_bytes = std::fs::read(&path).expect("Should able to read plugin bytes");
        let module = WasmerRuntime.prepare_module(&raw_module_bytes).unwrap();

        swc_plugin_runner::plugin_module_bytes::CompiledPluginModuleBytes::new(
            path.as_os_str()
                .to_str()
                .expect("Should able to get path")
                .to_string(),
            module,
        )
    });

#[testing::fixture("../swc_css_parser/tests/fixture/**/input.css")]
fn invoke(input: PathBuf) {
    use swc_css_ast::Stylesheet;

    tokio::runtime::Runtime::new().unwrap().block_on(async {
        // run single plugin
        testing::run_test(false, |cm, _handler| {
            let fm = cm.load_file(&input).unwrap();

            let parsed: Stylesheet =
                swc_css_parser::parse_file(&fm, None, Default::default(), &mut Vec::new()).unwrap();

            let program = PluginSerializedBytes::try_serialize(
                &swc_common::plugin::serialized::VersionedSerializable::new(parsed.clone()),
            )
            .expect("Should serializable");
            let experimental_metadata: FxHashMap<String, String> = [
                (
                    "TestExperimental".to_string(),
                    "ExperimentalValue".to_string(),
                ),
                ("OtherTest".to_string(), "OtherVal".to_string()),
            ]
            .into_iter()
            .collect();

            let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
                &cm,
                &Mark::new(),
                &Arc::new(TransformPluginMetadataContext::new(
                    None,
                    "development".to_string(),
                    Some(experimental_metadata),
                )),
                None,
                Box::new(PLUGIN_BYTES.clone_module(&WasmerRuntime)),
                Some(json!({ "pluginConfig": "testValue" })),
                Arc::new(WasmerRuntime),
            );

            info!("Created transform executor");

            let program_bytes = plugin_transform_executor
                .transform(&program, Some(false))
                .expect("Plugin should apply transform");

            let program: Stylesheet = program_bytes
                .deserialize()
                .expect("Should able to deserialize")
                .into_inner();

            assert_eq!(parsed, program);

            Ok(())
        })
        .expect("Should able to run single plugin transform");

        // Run multiple plugins.
        testing::run_test(false, |cm, _handler| {
            let fm = cm.new_source_file(FileName::Anon.into(), "console.log(foo)");

            let parsed: Stylesheet =
                swc_css_parser::parse_file(&fm, None, Default::default(), &mut Vec::new()).unwrap();

            let mut serialized_program = PluginSerializedBytes::try_serialize(
                &swc_common::plugin::serialized::VersionedSerializable::new(parsed.clone()),
            )
            .expect("Should serializable");

            let experimental_metadata: FxHashMap<String, String> = [
                (
                    "TestExperimental".to_string(),
                    "ExperimentalValue".to_string(),
                ),
                ("OtherTest".to_string(), "OtherVal".to_string()),
            ]
            .into_iter()
            .collect();

            let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
                &cm,
                &Mark::new(),
                &Arc::new(TransformPluginMetadataContext::new(
                    None,
                    "development".to_string(),
                    Some(experimental_metadata.clone()),
                )),
                None,
                Box::new(PLUGIN_BYTES.clone_module(&WasmerRuntime)),
                Some(json!({ "pluginConfig": "testValue" })),
                Arc::new(WasmerRuntime),
            );

            serialized_program = plugin_transform_executor
                .transform(&serialized_program, Some(false))
                .expect("Plugin should apply transform");

            // TODO: we'll need to apply 2 different plugins
            let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
                &cm,
                &Mark::new(),
                &Arc::new(TransformPluginMetadataContext::new(
                    None,
                    "development".to_string(),
                    Some(experimental_metadata),
                )),
                None,
                Box::new(PLUGIN_BYTES.clone_module(&WasmerRuntime)),
                Some(json!({ "pluginConfig": "testValue" })),
                Arc::new(WasmerRuntime),
            );

            serialized_program = plugin_transform_executor
                .transform(&serialized_program, Some(false))
                .expect("Plugin should apply transform");

            let program: Stylesheet = serialized_program
                .deserialize()
                .expect("Should able to deserialize")
                .into_inner();

            assert_eq!(parsed, program);

            Ok(())
        })
        .expect("Should able to run multiple plugins transform");
    });
}
