#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(test)]

extern crate test;

use fxhash::FxHashMap;
use spack::{
    config::{Config, EntryConfig},
    loaders::swc::SwcLoader,
    BundleKind, Bundler,
};
use std::{
    env,
    fs::{create_dir_all, read_dir},
    io::{self},
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::config::SourceMapsConfig;
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::NormalizedOutput;
use walkdir::WalkDir;

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
        testfn: DynTestFn(box f),
    });
}

fn reference_tests(tests: &mut Vec<TestDescAndFn>, errors: bool) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(if errors { "error" } else { "pass" });
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
                Ok((e.file_name().to_string_lossy().to_string(), e.path()))
            })
            .collect::<Result<FxHashMap<_, _>, _>>()?;

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

            testing::run_test2(false, |cm, handler| {
                let compiler = Arc::new(swc::Compiler::new(cm.clone(), Arc::new(handler)));
                let loader = SwcLoader::new(
                    compiler.clone(),
                    swc::config::Options {
                        swcrc: true,
                        ..Default::default()
                    },
                );
                let config = Config {
                    working_dir: Default::default(),
                    mode: Default::default(),
                    entry: EntryConfig::Files(entries),
                    output: None,
                    module: Default::default(),
                    optimization: None,
                    resolve: None,
                    options: None,
                };
                let bundler = Bundler::new(
                    &config,
                    compiler.clone(),
                    swc::config::Options {
                        swcrc: true,
                        ..Default::default()
                    },
                    &spack::resolve::NodeResolver,
                    &loader,
                );

                let modules = bundler.bundle().expect("failed to bundle module");
                log::info!("Bundled as {} modules", modules.len());

                let mut error = false;

                for bundled in modules {
                    let code = bundler
                        .swc()
                        .print(&bundled.module, SourceMapsConfig::Bool(false), None, false)
                        .expect("failed to emit bundle")
                        .code;

                    let name = match bundled.kind {
                        BundleKind::Named { name } | BundleKind::Lib { name } => {
                            PathBuf::from(name)
                        }
                        BundleKind::Dynamic => format!("dynamic.{}.js", bundled.id).into(),
                    };

                    let output_path = entry.path().join("output").join(name.file_name().unwrap());

                    log::info!("Printing {}", output_path.display());

                    let s = NormalizedOutput::from(code);

                    match s.compare_to_file(&output_path) {
                        Ok(_) => {}
                        Err(err) => {
                            println!("{:?}", err);
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
        });
    }

    Ok(())
}

#[test]
fn pass() {
    let _ = pretty_env_logger::try_init();

    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, false).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

#[test]
#[ignore]
fn errors() {
    let _ = pretty_env_logger::try_init();

    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, true).unwrap();
    test_main(&args, tests, Some(Options::new()));
}
