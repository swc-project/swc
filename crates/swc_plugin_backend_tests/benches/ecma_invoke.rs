extern crate swc_malloc;

use std::{
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{
    plugin::{
        metadata::TransformPluginMetadataContext,
        serialized::{PluginSerializedBytes, VersionedSerializable},
    },
    FileName, FilePathMapping, Globals, Mark, SourceMap, GLOBALS,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::parse_file_as_program;
use swc_plugin_runner::runtime::Runtime;

static SOURCE: &str = include_str!("../../swc_ecma_minifier/benches/full/typescript.js");

fn plugin_group(c: &mut Criterion) {
    let plugin_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixture")
        .join("swc_noop_plugin");

    {
        let mut cmd = Command::new("cargo");

        cmd.current_dir(&plugin_dir);
        cmd.arg("build")
            .arg("--release")
            .arg("--target=wasm32-wasip1");

        let status = cmd.status().unwrap();
        assert!(status.success());
    }

    c.bench_function("es/plugin/invoke/1/wasmer", |b| {
        bench_transform(
            b,
            &plugin_dir,
            Arc::new(swc_plugin_backend_wasmer::WasmerRuntime),
        )
    });

    c.bench_function("es/plugin/invoke/1/wasmtime", |b| {
        bench_transform(
            b,
            &plugin_dir,
            Arc::new(swc_plugin_backend_wasmtime::WasmtimeRuntime),
        )
    });
}

fn bench_transform(b: &mut Bencher, plugin_dir: &Path, runtime: Arc<dyn Runtime>) {
    let path = &plugin_dir
        .join("target")
        .join("wasm32-wasip1")
        .join("release")
        .join("swc_noop_plugin.wasm");
    let raw_module_bytes = std::fs::read(path).expect("Should able to read plugin bytes");

    let module = runtime.prepare_module(&raw_module_bytes).unwrap();

    let plugin_module = swc_plugin_runner::plugin_module_bytes::CompiledPluginModuleBytes::new(
        path.as_os_str()
            .to_str()
            .expect("Should able to get path")
            .to_string(),
        module,
    );

    b.iter(|| {
        GLOBALS.set(&Globals::new(), || {
            tokio::runtime::Runtime::new().unwrap().block_on(async {
                let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

                let fm = cm.new_source_file(
                    FileName::Real("src/test.ts".into()).into(),
                    SOURCE.to_string(),
                );

                let program = parse_file_as_program(
                    &fm,
                    Default::default(),
                    EsVersion::latest(),
                    None,
                    &mut Vec::new(),
                )
                .unwrap();

                let program = VersionedSerializable::new(program);
                let program_ser = PluginSerializedBytes::try_serialize(&program).unwrap();

                let mut transform_plugin_executor =
                    swc_plugin_runner::create_plugin_transform_executor(
                        &cm,
                        &Mark::new(),
                        &Arc::new(TransformPluginMetadataContext::new(
                            None,
                            "development".to_string(),
                            None,
                        )),
                        None,
                        Box::new(plugin_module.clone_module(&*runtime)),
                        None,
                        runtime.clone(),
                    );

                let res = transform_plugin_executor
                    .transform(&program_ser, Some(true))
                    .unwrap();

                let _ = black_box(res);
            });
        });
    })
}

criterion_group!(benches, plugin_group);
criterion_main!(benches);
