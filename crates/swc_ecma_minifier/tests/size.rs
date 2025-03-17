use std::{
    fmt::Write,
    path::{Path, PathBuf},
};

use flate2::{write::GzEncoder, Compression};
use humansize::format_size;
use indexmap::IndexMap;
use rustc_hash::FxBuildHasher;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, Mark, SourceMap, GLOBALS};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_program;
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_utils::parallel::{Parallel, ParallelExt};
use testing::NormalizedOutput;
use walkdir::WalkDir;

struct FileSize {
    original_size: usize,
    compressed_size: usize,
    gzipped_size: usize,
}

#[test]
fn bench_libs() {
    let dir = PathBuf::from("benches/full");

    let files = expand_dirs(&dir);

    let result = calc_size_par(&files);
    let output = format_result(result);

    NormalizedOutput::from(output)
        .compare_to_file("tests/libs-size.snapshot.md")
        .unwrap();
}

#[test]
fn test_projects() {
    let dir = PathBuf::from("tests/projects/files");

    let files = expand_dirs(&dir);

    let result = calc_size_par(&files);
    let output = format_result(result);

    NormalizedOutput::from(output)
        .compare_to_file("tests/projects-size.snapshot.md")
        .unwrap();
}

fn format_result(mut result: IndexMap<String, FileSize, FxBuildHasher>) -> String {
    let mut output = String::new();

    // Sort by file name
    result.sort_by_cached_key(|file_name, _| file_name.clone());

    writeln!(
        output,
        "| File | Original Size | Compressed Size | Gzipped Size |"
    )
    .unwrap();
    writeln!(output, "| --- | --- | --- | --- |").unwrap();

    for (file_name, file_size) in result {
        writeln!(
            output,
            "| {} | {} | {} | {} |",
            file_name,
            format_size(file_size.original_size, humansize::BINARY),
            format_size(file_size.compressed_size, humansize::BINARY),
            format_size(file_size.gzipped_size, humansize::BINARY)
        )
        .unwrap();
    }

    output
}

fn calc_size_par(files: &[PathBuf]) -> IndexMap<String, FileSize, FxBuildHasher> {
    GLOBALS.set(&Default::default(), || {
        let mut worker = Worker::default();

        worker.maybe_par(0, files, |worker, path| {
            let file_name = path.file_name().unwrap().to_str().unwrap();
            let src = std::fs::read_to_string(path).unwrap();
            let file_size = run(&src);

            worker.result.insert(file_name.to_string(), file_size);
        });

        worker.result
    })
}

/// Return the whole input files as abolute path.
fn expand_dirs(dir: &Path) -> Vec<PathBuf> {
    WalkDir::new(dir)
        .into_iter()
        .filter_map(Result::ok)
        .filter_map(|entry| {
            if entry.metadata().map(|v| v.is_file()).unwrap_or(false) {
                Some(entry.into_path())
            } else {
                None
            }
        })
        .filter(|path| path.extension().map(|ext| ext == "js").unwrap_or(false))
        .collect::<Vec<_>>()
}

#[derive(Default)]
struct Worker {
    result: IndexMap<String, FileSize, FxBuildHasher>,
}

impl Parallel for Worker {
    fn create(&self) -> Self {
        Worker {
            ..Default::default()
        }
    }

    fn merge(&mut self, other: Self) {
        self.result.extend(other.result);
    }
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
            original_size: src.len(),
            compressed_size: code.len(),
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
