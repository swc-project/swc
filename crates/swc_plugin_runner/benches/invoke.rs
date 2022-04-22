use std::{
    env,
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use once_cell::sync::Lazy;
use swc_common::{plugin::Serialized, FileName, FilePathMapping, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::parse_file_as_program;
use swc_plugin_runner::cache::PluginModuleCache;

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
    let cache: Lazy<PluginModuleCache> = Lazy::new(PluginModuleCache::new);

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

        let program_ser = Serialized::serialize(&program).unwrap();

        let res = swc_plugin_runner::apply_transform_plugin(
            "test",
            &plugin_dir
                .join("target")
                .join("wasm32-unknown-unknown")
                .join("release")
                .join("swc_internal_plugin.wasm"),
            &cache,
            program_ser,
            Serialized::serialize(&String::from("{}")).unwrap(),
            Serialized::serialize(&String::from("{}")).unwrap(),
            true,
            &cm,
        )
        .unwrap();

        let _ = black_box(res);
    })
}

criterion_group!(benches, plugin_group);
criterion_main!(benches);
