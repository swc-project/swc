#![cfg_attr(not(feature = "__rkyv"), allow(warnings))]

extern crate swc_malloc;

use std::{
    env,
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
#[cfg(feature = "__rkyv")]
use swc_common::plugin::serialized::{PluginSerializedBytes, VersionedSerializable};
use swc_common::{
    collections::AHashMap, plugin::metadata::TransformPluginMetadataContext, FileName,
    FilePathMapping, Globals, Mark, SourceMap, GLOBALS,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::parse_file_as_program;

static SOURCE: &str = include_str!("../../swc_ecma_minifier/benches/full/typescript.js");

fn plugin_group(c: &mut Criterion) {
    let plugin_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
        .join("tests")
        .join("fixture")
        .join("swc_noop_plugin");

    {
        let mut cmd = Command::new("cargo");

        cmd.current_dir(&plugin_dir);
        cmd.arg("build")
            .arg("--release")
            .arg("--target=wasm32-wasi");

        let status = cmd.status().unwrap();
        assert!(status.success());
    }

    c.bench_function("es/plugin/invoke/1", |b| bench_transform(b, &plugin_dir));
}

fn bench_transform(b: &mut Bencher, plugin_dir: &Path) {
    let path = &plugin_dir
        .join("target")
        .join("wasm32-wasi")
        .join("release")
        .join("swc_noop_plugin.wasm");
    let raw_module_bytes = std::fs::read(path).expect("Should able to read plugin bytes");

    let store = wasmer::Store::default();
    let module = wasmer::Module::new(&store, raw_module_bytes).unwrap();

    let plugin_module = swc_plugin_runner::plugin_module_bytes::CompiledPluginModuleBytes::new(
        path.as_os_str()
            .to_str()
            .expect("Should able to get path")
            .to_string(),
        module,
        store,
    );

    #[cfg(feature = "__rkyv")]
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
                        Box::new(plugin_module.clone()),
                        None,
                        None,
                    );

                let experimental_metadata: VersionedSerializable<AHashMap<String, String>> =
                    VersionedSerializable::new(AHashMap::default());
                let _experimental_metadata =
                    PluginSerializedBytes::try_serialize(&experimental_metadata)
                        .expect("Should be a hashmap");

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
