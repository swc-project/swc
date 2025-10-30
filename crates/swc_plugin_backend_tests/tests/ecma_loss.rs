use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{anyhow, Error};
use serde_json::json;
use swc_common::{
    ast_node,
    plugin::{metadata::TransformPluginMetadataContext, serialized::PluginSerializedBytes},
    sync::Lazy,
    BytePos, EqIgnoreSpan, FileName, Mark, Span,
};
use swc_ecma_ast::{Module, Script};
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

        if entry
            .file_name()
            .eq_ignore_ascii_case("swc_noop_plugin.wasm")
        {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

// Fake Program
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
enum Program2 {
    #[tag("Module")]
    Module(Module),
    #[tag("Script")]
    Script(Script),
    #[tag("Source")]
    Source(SourceString),
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
struct SourceString {
    span: Span,
    #[not_spanned]
    buf: String,
}

fn internal(rt: Arc<dyn Runtime>, module: &'static CompiledPluginModuleBytes) {
    use swc_common::plugin::serialized::VersionedSerializable;
    use swc_transform_common::output::capture;

    // run single plugin
    testing::run_test(false, |cm, _handler| {
        eprint!("First run start");

        let buf = "console.log(foo)";
        let _fm = cm.new_source_file(FileName::Anon.into(), buf);

        let span = Span::from((BytePos(0), BytePos(buf.len() as u32)));
        let program = Program2::Source(SourceString {
            span,
            buf: buf.to_string(),
        });

        let program = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(program))
            .expect("Should serializable");

        let mut plugin_transform_executor = swc_plugin_runner::create_plugin_transform_executor(
            &cm,
            &Mark::new(),
            &Arc::new(TransformPluginMetadataContext::new(
                None,
                "development".to_string(),
                None,
            )),
            None,
            Box::new(module.clone_module(&*rt)),
            Some(json!({ "pluginConfig": "testValue" })),
            rt.clone(),
        );

        let (program_bytes, _captured_output) = capture(|| {
            plugin_transform_executor
                .transform(&program, Some(false))
                .expect("Plugin should apply transform")
        });

        let program: Program2 = program_bytes
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();
        eprintln!("First run retured");

        match program {
            Program2::Module(_) | Program2::Script(_) => panic!(),
            Program2::Source(source) => {
                assert_eq!(source.span, span);
                assert_eq!(source.buf, buf);
            }
        }

        Ok(())
    })
    .expect("Should able to run single plugin transform");
}

#[test]
fn wasmer() {
    use swc_plugin_backend_wasmer::WasmerRuntime;

    static PLUGIN_BYTES: Lazy<CompiledPluginModuleBytes> = Lazy::new(|| {
        let path = build_plugin(
            &PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
                .join("tests")
                .join("fixture")
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
                .join("swc_noop_plugin"),
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
