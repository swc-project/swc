#![cfg_attr(not(feature = "__rkyv"), allow(warnings))]

use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{anyhow, Error};
use serde_json::json;
#[cfg(feature = "__rkyv")]
use swc_common::plugin::serialized::PluginSerializedBytes;
use swc_common::{collections::AHashMap, plugin::metadata::TransformPluginMetadataContext, Mark};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{parse_file_as_program, Syntax};
use testing::CARGO_TARGET_DIR;

/// Returns the path to the built plugin
fn build_plugin(dir: &Path, crate_name: &str) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.env("CARGO_TARGET_DIR", &*CARGO_TARGET_DIR);
        cmd.current_dir(dir);
        cmd.args(["build", "--release", "--target=wasm32-wasi"])
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

    for entry in fs::read_dir(CARGO_TARGET_DIR.join("wasm32-wasi").join("release"))? {
        let entry = entry?;

        let s = entry.file_name().to_string_lossy().into_owned();
        if s.eq_ignore_ascii_case(&format!("{}.wasm", crate_name)) {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

#[cfg(feature = "__rkyv")]
#[test]
fn issue_6404() -> Result<(), Error> {
    use swc_common::plugin::serialized::VersionedSerializable;

    let plugin_path = build_plugin(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("tests")
            .join("fixture")
            .join("issue_6404"),
        "swc_issue_6404",
    )?;

    tokio::runtime::Runtime::new().unwrap().block_on(async {
        dbg!("Built!");

        // run single plugin
        testing::run_test(false, |cm, _handler| {
            let fm = cm
                .load_file("../swc_ecma_minifier/benches/full/typescript.js".as_ref())
                .unwrap();

            let program = parse_file_as_program(
                &fm,
                Syntax::Es(Default::default()),
                EsVersion::latest(),
                None,
                &mut Vec::new(),
            )
            .unwrap();

            let program =
                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
                    .expect("Should serializable");
            let experimental_metadata: AHashMap<String, String> = [
                (
                    "TestExperimental".to_string(),
                    "ExperimentalValue".to_string(),
                ),
                ("OtherTest".to_string(), "OtherVal".to_string()),
            ]
            .into_iter()
            .collect();

            let raw_module_bytes =
                std::fs::read(&plugin_path).expect("Should able to read plugin bytes");
            let store = wasmer::Store::default();
            let module = wasmer::Module::new(&store, raw_module_bytes).unwrap();

            let plugin_module =
                swc_plugin_runner::plugin_module_bytes::CompiledPluginModuleBytes::new(
                    plugin_path
                        .as_os_str()
                        .to_str()
                        .expect("Should able to get path")
                        .to_string(),
                    module,
                    store,
                );

            let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
                &cm,
                &Mark::new(),
                &Arc::new(TransformPluginMetadataContext::new(
                    None,
                    "development".to_string(),
                    Some(experimental_metadata),
                )),
                Box::new(plugin_module),
                Some(json!({ "pluginConfig": "testValue" })),
                None,
            );

            /* [TODO]: reenable this test
            assert!(!plugin_transform_executor
                .plugin_core_diag
                .pkg_version
                .is_empty());
             */

            let program_bytes = plugin_transform_executor
                .transform(&program, Some(false))
                .expect("Plugin should apply transform");

            let _: Program = program_bytes
                .deserialize()
                .expect("Should able to deserialize")
                .into_inner();

            Ok(())
        })
        .expect("Should able to run single plugin transform");
    });

    Ok(())
}
