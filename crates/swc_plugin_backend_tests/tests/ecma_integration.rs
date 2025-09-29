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
    errors::HANDLER,
    plugin::{metadata::TransformPluginMetadataContext, serialized::PluginSerializedBytes},
    sync::Lazy,
    FileName, Mark,
};
use swc_ecma_ast::{CallExpr, Callee, EsVersion, Expr, Lit, MemberExpr, Program, Str};
use swc_ecma_parser::{parse_file_as_program, Syntax};
use swc_ecma_visit::{Visit, VisitWith};
use swc_plugin_runner::{plugin_module_bytes::CompiledPluginModuleBytes, runtime::Runtime};
use testing::CARGO_TARGET_DIR;

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.env("CARGO_TARGET_DIR", &*CARGO_TARGET_DIR);
        cmd.current_dir(dir);
        cmd.args(["build", "--target=wasm32-wasip1"])
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

    for entry in fs::read_dir(CARGO_TARGET_DIR.join("wasm32-wasip1").join("debug"))? {
        let entry = entry?;

        let s = entry.file_name().to_string_lossy().into_owned();
        if s.eq_ignore_ascii_case("swc_internal_plugin.wasm") {
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

fn internal(rt: Arc<dyn Runtime>, module: &'static CompiledPluginModuleBytes) {
    use swc_common::plugin::serialized::VersionedSerializable;
    use swc_transform_common::output::capture;

    // run single plugin
    testing::run_test(false, |cm, _handler| {
        eprint!("First run start");

        let fm = cm.new_source_file(FileName::Anon.into(), "console.log(foo)");

        let program = parse_file_as_program(
            &fm,
            Syntax::Es(Default::default()),
            EsVersion::latest(),
            None,
            &mut Vec::new(),
        )
        .unwrap();

        let program = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
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
            Box::new(module.clone_module(&*rt)),
            Some(json!({ "pluginConfig": "testValue" })),
            rt.clone(),
        );

        /* [TODO]: reenable this later
        assert!(!plugin_transform_executor
            .plugin_core_diag
            .pkg_version
            .is_empty());
         */

        let (program_bytes, captured_output) = capture(|| {
            plugin_transform_executor
                .transform(&program, Some(false))
                .expect("Plugin should apply transform")
        });
        let captured_output = serde_json::to_string(&captured_output).unwrap();
        assert_eq!(captured_output, "{\"foo\":\"bar\"}");

        let program: Program = program_bytes
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();
        eprintln!("First run retured");
        let mut visitor = TestVisitor {
            plugin_transform_found: false,
        };
        program.visit_with(&mut visitor);

        visitor
            .plugin_transform_found
            .then_some(visitor.plugin_transform_found)
            .ok_or(())
    })
    .expect("Should able to run single plugin transform");

    // run single plugin with handler
    testing::run_test2(false, |cm, handler| {
        eprintln!("Second run start");
        let fm = cm.new_source_file(FileName::Anon.into(), "console.log(foo)");

        let program = parse_file_as_program(
            &fm,
            Syntax::Es(Default::default()),
            EsVersion::latest(),
            None,
            &mut Vec::new(),
        )
        .unwrap();

        let program = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
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

        let _res = HANDLER.set(&handler, || {
            let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
                &cm,
                &Mark::new(),
                &Arc::new(TransformPluginMetadataContext::new(
                    None,
                    "development".to_string(),
                    Some(experimental_metadata),
                )),
                None,
                Box::new(module.clone_module(&*rt)),
                Some(json!({ "pluginConfig": "testValue" })),
                rt.clone(),
            );

            capture(|| {
                plugin_transform_executor
                    .transform(&program, Some(false))
                    .expect("Plugin should apply transform")
            })
            .1
        });

        eprintln!("Second run retured");

        Ok(())
    })
    .expect("Should able to run single plugin transform with handler");
}

#[test]
fn wasmer() {
    use swc_plugin_backend_wasmer::WasmerRuntime;

    static PLUGIN_BYTES: Lazy<CompiledPluginModuleBytes> = Lazy::new(|| {
        let path = build_plugin(
            &PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
                .join("tests")
                .join("fixture")
                .join("swc_internal_plugin"),
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

    tokio::runtime::Runtime::new().unwrap().block_on(async {
        internal(Arc::new(WasmerRuntime), &PLUGIN_BYTES);
    });
}

#[test]
fn wasmtime() {
    use swc_plugin_backend_wasmtime::WasmtimeRuntime;

    static PLUGIN_BYTES: Lazy<CompiledPluginModuleBytes> = Lazy::new(|| {
        let path = build_plugin(
            &PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
                .join("tests")
                .join("fixture")
                .join("swc_internal_plugin"),
        )
        .unwrap();

        let raw_module_bytes = std::fs::read(&path).expect("Should able to read plugin bytes");
        let module = WasmtimeRuntime.prepare_module(&raw_module_bytes).unwrap();

        swc_plugin_runner::plugin_module_bytes::CompiledPluginModuleBytes::new(
            path.as_os_str()
                .to_str()
                .expect("Should able to get path")
                .to_string(),
            module,
        )
    });

    tokio::runtime::Runtime::new().unwrap().block_on(async {
        internal(Arc::new(WasmtimeRuntime), &PLUGIN_BYTES);
    });
}
