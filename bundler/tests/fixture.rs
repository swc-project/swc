#![feature(test)]

extern crate test;

use self::common::*;
use anyhow::Error;
use std::{
    self,
    collections::HashMap,
    env,
    fs::{create_dir_all, read_dir},
    io,
    path::{Path, PathBuf},
};
use swc_atoms::js_word;
use swc_bundler::{BundleKind, Bundler, Config, ModuleRecord};
use swc_common::{FileName, Globals, Span};
use swc_ecma_ast::{
    Bool, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, MetaPropExpr, PropName, Str,
};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_transforms::fixer;
use swc_ecma_visit::FoldWith;
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::NormalizedOutput;
use walkdir::DirEntry;
use walkdir::WalkDir;

#[path = "common/mod.rs"]
mod common;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name.replace("-", "_").replace("/", "::")),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn reference_tests(tests: &mut Vec<TestDescAndFn>, errors: bool) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(if errors { "error" } else { "fixture" });
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        if !entry.path().join("input").exists() {
            continue;
        }

        let ignore = entry
            .path()
            .file_name()
            .unwrap()
            .to_string_lossy()
            .starts_with(".");

        let dir_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let _ = create_dir_all(entry.path().join("output"));

        let entries = read_dir(entry.path().join("input"))?
            .filter(|e| match e {
                Ok(e) => {
                    if e.path()
                        .file_name()
                        .unwrap()
                        .to_string_lossy()
                        .starts_with("entry")
                    {
                        true
                    } else {
                        false
                    }
                }
                _ => false,
            })
            .map(|e| -> Result<_, io::Error> {
                let e = e?;
                Ok((
                    e.file_name().to_string_lossy().to_string(),
                    FileName::Real(e.path()),
                ))
            })
            .collect::<Result<HashMap<_, _>, _>>()?;

        let name = format!(
            "fixture::{}::{}",
            if errors { "error" } else { "pass" },
            dir_name
        );

        let ignore = ignore
            || !name.contains(
                &env::var("TEST")
                    .ok()
                    .unwrap_or("".into())
                    .replace("::", "/")
                    .replace("_", "-"),
            );

        add_test(tests, name, ignore, move || {
            eprintln!("\n\n========== Running reference test {}\n", dir_name);

            do_test(&entry, entries.clone(), true);
            do_test(&entry, entries, false);
        });
    }

    Ok(())
}

fn do_test(entry: &DirEntry, entries: HashMap<String, FileName>, inline: bool) {
    testing::run_test2(false, |cm, _| {
        let globals = Globals::default();
        let bundler = Bundler::new(
            &globals,
            cm.clone(),
            Loader { cm: cm.clone() },
            NodeResolver,
            Config {
                require: true,
                disable_inliner: !inline,
                external_modules: vec![
                    "assert",
                    "buffer",
                    "child_process",
                    "console",
                    "cluster",
                    "crypto",
                    "dgram",
                    "dns",
                    "events",
                    "fs",
                    "http",
                    "http2",
                    "https",
                    "net",
                    "os",
                    "path",
                    "perf_hooks",
                    "process",
                    "querystring",
                    "readline",
                    "repl",
                    "stream",
                    "string_decoder",
                    "timers",
                    "tls",
                    "tty",
                    "url",
                    "util",
                    "v8",
                    "vm",
                    "wasi",
                    "worker",
                    "zlib",
                ]
                .into_iter()
                .map(From::from)
                .collect(),
                module: Default::default(),
            },
            Box::new(Hook),
        );

        let modules = bundler
            .bundle(entries)
            .map_err(|err| println!("{:?}", err))?;
        println!("Bundled as {} modules", modules.len());

        let mut error = false;

        for bundled in modules {
            let code = {
                let mut buf = vec![];

                {
                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::Config {
                            ..Default::default()
                        },
                        cm: cm.clone(),
                        comments: None,
                        wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
                    };

                    emitter
                        .emit_module(&bundled.module.fold_with(&mut fixer(None)))
                        .unwrap();
                }

                String::from_utf8_lossy(&buf).to_string()
            };

            let name = match bundled.kind {
                BundleKind::Named { name } | BundleKind::Lib { name } => PathBuf::from(name),
                BundleKind::Dynamic => format!("dynamic.{}.js", bundled.id).into(),
            };

            let output_dir = entry.path().join("output");

            let output_path = if inline {
                output_dir
                    .join(name.file_name().unwrap())
                    .with_file_name(format!(
                        "{}.inlined.{}",
                        name.file_stem().unwrap().to_string_lossy(),
                        name.extension().unwrap().to_string_lossy()
                    ))
            } else {
                output_dir.join(name.file_name().unwrap())
            };

            println!("Printing {}", output_path.display());

            let s = NormalizedOutput::from(code.to_string());

            match s.compare_to_file(&output_path) {
                Ok(_) => {}
                Err(err) => {
                    println!("Diff: {:?}", err);
                    error = true;
                }
            }
        }

        if error {
            return Err(());
        }

        Ok(())
    })
    .expect("failed to process a module");
}

#[test]
fn pass() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, false).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

struct Hook;

impl swc_bundler::Hook for Hook {
    fn get_import_meta_props(
        &self,
        span: Span,
        module_record: &ModuleRecord,
    ) -> Result<Vec<KeyValueProp>, Error> {
        Ok(vec![
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("url"), span)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    value: module_record.file_name.to_string().into(),
                    has_escape: false,
                    kind: Default::default(),
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("main"), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(Box::new(Expr::MetaProp(MetaPropExpr {
                            meta: Ident::new(js_word!("import"), span),
                            prop: Ident::new(js_word!("meta"), span),
                        }))),
                        prop: Box::new(Expr::Ident(Ident::new(js_word!("main"), span))),
                        computed: false,
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}
