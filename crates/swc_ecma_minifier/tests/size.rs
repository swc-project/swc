use std::{fmt::Write, path::PathBuf};

use flate2::{write::GzEncoder, Compression};
use humansize::format_size;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_program;
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use testing::NormalizedOutput;

struct FileSize {
    size: usize,
    gzipped_size: usize,
}

#[test]
fn bench_libs() {
    let dir = PathBuf::from("benches/full");

    let mut output = String::new();
    // Create a markdown table

    writeln!(output, "| File | Size | Gzipped Size |").unwrap();
    writeln!(output, "| --- | --- | --- |").unwrap();

    for entry in dir.read_dir().unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let file_name = path.file_name().unwrap().to_str().unwrap();
        let src = std::fs::read_to_string(&path).unwrap();
        let file_size = run(&src);

        writeln!(
            output,
            "| {} | {} | {} |",
            file_name,
            format_size(file_size.size, humansize::BINARY),
            format_size(file_size.gzipped_size, humansize::BINARY)
        )
        .unwrap();
    }

    NormalizedOutput::from(output)
        .compare_to_file("tests/libs-size.snapshot.md")
        .unwrap();
}

fn run(src: &str) -> FileSize {
    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let Ok(program) = parse_file_as_program(
            &fm,
            Default::default(),
            Default::default(),
            Some(&comments),
            &mut Vec::new(),
        )
        .map_err(|err| {
            err.into_diagnostic(&handler).emit();
        })
        .map(|program| program.apply(resolver(unresolved_mark, top_level_mark, false))) else {
            panic!("Failed to parse");
        };

        let output = optimize(
            program,
            cm.clone(),
            Some(&comments),
            None,
            &MinifyOptions {
                rename: false,
                compress: Some(Default::default()),
                mangle: Some(MangleOptions {
                    props: None,
                    top_level: Some(true),
                    keep_class_names: false,
                    keep_fn_names: false,
                    keep_private_props: false,
                    ie8: false,
                    ..Default::default()
                }),
                wrap: false,
                enclose: false,
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let output = output.apply(fixer(None));

        let code = print(cm, &[output], true);
        let gzipped_size = gzip_size(code.as_bytes());

        Ok(FileSize {
            size: code.len(),
            gzipped_size,
        })
    })
    .unwrap()
}

fn gzip_size(data: &[u8]) -> usize {
    use std::io::Write;

    let mut encoder = GzEncoder::new(Vec::new(), Compression::best());
    encoder.write_all(data).unwrap();
    encoder.finish().unwrap().len()
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = Vec::new();

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
