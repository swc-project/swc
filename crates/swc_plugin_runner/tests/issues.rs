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
use swc_common::{
    collections::AHashMap, plugin::metadata::TransformPluginMetadataContext, sync::Lazy, FileName,
    Mark,
};
use swc_ecma_ast::{CallExpr, Callee, EsVersion, Expr, Lit, MemberExpr, Program, Str};
use swc_ecma_parser::{parse_file_as_program, EsConfig, Syntax};
use swc_ecma_visit::Visit;
use swc_plugin_runner::cache::PluginModuleCache;

/// Returns the path to the built plugin
fn build_plugin(dir: &Path, crate_name: &str) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
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

    for entry in fs::read_dir(&dir.join("target").join("wasm32-wasi").join("release"))? {
        let entry = entry?;

        let s = entry.file_name().to_string_lossy().into_owned();
        if s.eq_ignore_ascii_case(&format!("{}.wasm", crate_name)) {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

struct TestVisitor {
    pub plugin_transform_found: bool,
}

impl Visit for TestVisitor {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Member(MemberExpr { obj, .. }) = &**expr {
                if let Expr::Ident(ident) = &**obj {
                    if ident.sym == *"console" {
                        let args = &*(call.args[0].expr);
                        if let Expr::Lit(Lit::Str(Str { value, .. })) = args {
                            self.plugin_transform_found = value == "changed_via_plugin";
                        }
                    }
                }
            }
        }
    }
}

#[cfg(feature = "__rkyv")]
#[test]
fn issue_6404() -> Result<(), Error> {
    let plugin_path = build_plugin(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("tests")
            .join("fixture")
            .join("issue_6404"),
        "swc_issue_6404",
    )?;

    dbg!("Built!");

    // run single plugin
    testing::run_test(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, "console.log(foo)".into());

        let program = parse_file_as_program(
            &fm,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .unwrap();

        let program = PluginSerializedBytes::try_serialize(&program).expect("Should serializable");
        let experimental_metadata: AHashMap<String, String> = [
            (
                "TestExperimental".to_string(),
                "ExperimentalValue".to_string(),
            ),
            ("OtherTest".to_string(), "OtherVal".to_string()),
        ]
        .into_iter()
        .collect();

        let cache: Lazy<PluginModuleCache> = Lazy::new(PluginModuleCache::new);
        let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
            &plugin_path,
            &cache,
            &cm,
            &Arc::new(TransformPluginMetadataContext::new(
                None,
                "development".to_string(),
                Some(experimental_metadata),
            )),
            Some(json!({ "pluginConfig": "testValue" })),
        )
        .expect("Should load plugin");

        assert!(!plugin_transform_executor
            .plugin_core_diag
            .pkg_version
            .is_empty());

        let program_bytes = plugin_transform_executor
            .transform(&program, Mark::new(), false)
            .expect("Plugin should apply transform");

        let _: Program = program_bytes
            .deserialize()
            .expect("Should able to deserialize");

        Ok(())
    })
    .expect("Should able to run single plugin transform");

    Ok(())
}
