#![cfg_attr(not(feature = "__rkyv"), allow(warnings))]

extern crate swc_malloc;

use std::sync::Arc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
#[cfg(feature = "__rkyv")]
use swc_common::plugin::serialized::{PluginSerializedBytes, VersionedSerializable};
use swc_common::{FileName, FilePathMapping, Globals, SourceMap, GLOBALS};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::parse_file_as_program;

static SOURCE: &str = include_str!("../../swc_ecma_minifier/benches/full/typescript.js");

fn serde_group(c: &mut Criterion) {
    c.bench_function("es/plugin/serde/1", bench_rmp_serde);
}

fn bench_rmp_serde(b: &mut Bencher) {
    #[cfg(feature = "__rkyv")]
    b.iter(|| {
        GLOBALS.set(&Globals::new(), || {
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
            let program_ser = black_box(program_ser);

            let res = program_ser.deserialize::<Program>().unwrap();

            let _ = black_box(res);
        });
    })
}

criterion_group!(benches, serde_group);
criterion_main!(benches);
