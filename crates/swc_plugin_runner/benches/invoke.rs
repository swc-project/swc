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
use swc_common::plugin::serialized::PluginSerializedBytes;
use swc_common::{
    collections::AHashMap, plugin::metadata::TransformPluginMetadataContext, FileName,
    FilePathMapping, Mark, SourceMap,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::parse_file_as_program;

static SOURCE: &str = include_str!("./assets/input.js");

fn plugin_group(c: &mut Criterion) {
    let plugin_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
        .join("..")
        .join("..")
        .join("tests")
        .join("rust-plugins")
        .join("swc_internal_plugin");

    {
        let mut cmd = Command::new("cargo");

        cmd.current_dir(&plugin_dir);
        cmd.arg("build")
            .arg("--release")
            .arg("--target=wasm32-unknown-unknown");

        let status = cmd.status().unwrap();
        assert!(status.success());
    }

    c.bench_function("es/plugin/invoke/1", |b| bench_transform(b, &plugin_dir));
}

fn bench_transform(b: &mut Bencher, plugin_dir: &Path) {
    #[cfg(feature = "__rkyv")]
    b.iter(|| {
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

        let program_ser = PluginSerializedBytes::try_serialize(&program).unwrap();

        let mut transform_plugin_executor = swc_plugin_runner::create_plugin_transform_executor(
            &plugin_dir
                .join("target")
                .join("wasm32-unknown-unknown")
                .join("release")
                .join("swc_internal_plugin.wasm"),
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

        let experimental_metadata: AHashMap<String, String> = AHashMap::default();
        let _experimental_metadata = PluginSerializedBytes::try_serialize(&experimental_metadata)
            .expect("Should be a hashmap");

        let res = transform_plugin_executor
            .transform(&program_ser, Mark::new(), true)
            .unwrap();

        let _ = black_box(res);
    })
}

criterion_group!(benches, plugin_group);
criterion_main!(benches);
