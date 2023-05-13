#![cfg_attr(not(feature = "__rkyv"), allow(warnings))]

extern crate swc_node_base;

use std::{
    env,
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
#[cfg(feature = "__rkyv")]
use swc_common::plugin::serialized::{PluginSerializedBytes, VersionedSerializable};
use swc_common::{
    collections::AHashMap, plugin::metadata::TransformPluginMetadataContext, FileName,
    FilePathMapping, Globals, Mark, SourceMap, GLOBALS,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::parse_file_as_program;
use swc_plugin_runner::cache::init_plugin_module_cache_once;

static SOURCE: &str = include_str!("./assets/input.js");

fn plugin_group(c: &mut Criterion) {
    init_plugin_module_cache_once(&None);

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
    #[cfg(feature = "__rkyv")]
    b.iter(|| {
        GLOBALS.set(&Globals::new(), || {
            let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

            let fm = cm.new_source_file(FileName::Real("src/test.ts".into()), SOURCE.to_string());

            let program = parse_file_as_program(
                &fm,
                Default::default(),
                EsVersion::latest(),
                None,
                &mut vec![],
            )
            .unwrap();

            let program = VersionedSerializable::new(program);
            let program_ser = PluginSerializedBytes::try_serialize(&program).unwrap();

            let mut transform_plugin_executor =
                swc_plugin_runner::create_plugin_transform_executor(
                    &plugin_dir
                        .join("target")
                        .join("wasm32-wasi")
                        .join("release")
                        .join("swc_noop_plugin.wasm"),
                    &swc_plugin_runner::cache::PLUGIN_MODULE_CACHE,
                    &cm,
                    &Arc::new(TransformPluginMetadataContext::new(
                        None,
                        "development".to_string(),
                        None,
                    )),
                    None,
                )
                .unwrap();

            let experimental_metadata: VersionedSerializable<AHashMap<String, String>> =
                VersionedSerializable::new(AHashMap::default());
            let _experimental_metadata =
                PluginSerializedBytes::try_serialize(&experimental_metadata)
                    .expect("Should be a hashmap");

            let res = transform_plugin_executor
                .transform(&program_ser, Mark::new(), true)
                .unwrap();

            let _ = black_box(res);
        });
    })
}

criterion_group!(benches, plugin_group);
criterion_main!(benches);
