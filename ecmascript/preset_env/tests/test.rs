#![feature(box_syntax)]
#![feature(try_blocks)]
#![feature(test)]

extern crate test;

use pretty_assertions::assert_eq;
use serde::Deserialize;
use serde_json::Value;
use std::{
    cmp::Ordering,
    collections::HashMap,
    env,
    fs::File,
    io,
    io::Read,
    path::{Path, PathBuf},
    process::Command,
};
use swc_common::{fold::FoldWith, input::SourceFileInput, FromVariant};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Session};
use swc_ecma_preset_env::{parse_version, preset_env, BrowserData, Config, Mode, Target};
use test::{test_main, ShouldPanic, TestDesc, TestDescAndFn, TestFn, TestName, TestType};
use testing::Tester;
use walkdir::WalkDir;

/// options.json file
#[derive(Debug, Deserialize)]
struct BabelOptions {
    presets: Vec<(String, PresetConfig)>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
struct PresetConfig {
    #[serde(default)]
    pub use_built_ins: UseBuiltIns,

    #[serde(default)]
    pub corejs: CoreJs,

    #[serde(default)]
    pub modules: ModulesConfig,

    #[serde(default)]
    pub targets: HashMap<String, Value>,

    #[serde(default)]
    pub include: Vec<String>,

    #[serde(default)]
    pub exclude: Vec<String>,

    #[serde(default)]
    pub force_all_transforms: bool,

    #[serde(default)]
    pub shipped_proposals: bool,

    #[serde(default)]
    pub config_path: String,

    #[serde(default)]
    pub debug: bool,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
#[serde(untagged)]
pub enum CoreJs {
    Ver(usize),
    VerWithMinor(String),
    Val(HashMap<String, Value>),
}

impl Default for CoreJs {
    fn default() -> Self {
        Self::Ver(2)
    }
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum ModulesConfig {
    Bool(bool),
}

impl Default for ModulesConfig {
    fn default() -> Self {
        ModulesConfig::Bool(false)
    }
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum UseBuiltIns {
    Bool(bool),
    Str(String),
}

impl Default for UseBuiltIns {
    fn default() -> Self {
        UseBuiltIns::Bool(false)
    }
}

#[derive(Debug, FromVariant)]
enum Error {
    Io(io::Error),
    Var(env::VarError),
    WalkDir(walkdir::Error),
    Json(serde_json::Error),
    Msg(String),
}

fn load() -> Result<Vec<TestDescAndFn>, Error> {
    let mut tests = vec![];
    let mut dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
    dir.push("tests");
    dir.push("fixtures");

    for entry in WalkDir::new(&dir) {
        let e = entry?;

        if e.metadata()?.is_file() {
            continue;
        }

        match e.path().join("input.mjs").metadata() {
            Ok(e) if e.is_file() => {}
            _ => continue,
        }

        let cfg: BabelOptions =
            serde_json::from_reader(File::open(e.path().join("options.json"))?)?;
        assert_eq!(cfg.presets.len(), 1);
        let cfg = cfg.presets.into_iter().map(|v| v.1).next().unwrap();

        let name = e
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .display()
            .to_string();
        tests.push(TestDescAndFn {
            desc: TestDesc {
                test_type: TestType::IntegrationTest,
                ignore: env::var("TEST")
                    .map(|s| !name.contains(&s))
                    .unwrap_or(false),
                name: TestName::DynTestName(name),
                allow_fail: false,
                should_panic: ShouldPanic::No,
            },
            testfn: TestFn::DynTestFn(box move || {
                //
                exec(cfg, e.path().to_path_buf()).expect("failed to run test")
            }),
        });
    }

    Ok(tests)
}

fn exec(c: PresetConfig, dir: PathBuf) -> Result<(), Error> {
    let output = {
        if c.targets.is_empty() {
            b"[]".to_vec()
        } else {
            let mut qjs = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?);
            qjs.push("tests");
            qjs.push("query.js");

            let output = Command::new("node")
                .arg(&qjs)
                .arg(serde_json::to_string(&c.targets)?)
                .output()?;

            if !output.status.success() {
                println!(
                    "{}\n{}",
                    String::from_utf8_lossy(&output.stdout),
                    String::from_utf8_lossy(&output.stderr),
                );
                return Err(Error::Msg(format!("query.js: Status {:?}", output.status,)));
            }

            output.stdout
        }
    };

    let browsers: Vec<String> = serde_json::from_slice(&output)?;
    let browsers: HashMap<_, _> = browsers
        .into_iter()
        .map(|v| {
            let mut v = v.split(' ');
            (v.next().unwrap().to_string(), v.next().unwrap().to_string())
        })
        .collect();

    let versions =
        BrowserData::<()>::default().map(|k, ()| browsers.get(&*k).map(|s| parse_version(s)));

    let mut pass = preset_env(Config {
        debug: c.debug,
        mode: match c.use_built_ins {
            UseBuiltIns::Bool(false) => None,
            UseBuiltIns::Str(s) if s == "usage" => Some(Mode::Usage),
            UseBuiltIns::Str(s) if s == "entry" => Some(Mode::Entry),
            v => unreachable!("invalid: {:?}", v),
        },
        skip: vec![],
        // TODO
        loose: true,
        // TODO
        dynamic_import: true,
        include: c.include.into_iter().map(|v| v.parse().unwrap()).collect(),
        exclude: c.exclude.into_iter().map(|v| v.parse().unwrap()).collect(),
        core_js: 2,
        targets: Some(Target::Versions(versions)),
    });

    println!("Browsers: {:?}", browsers);

    Tester::new()
        .print_errors(|cm, handler| {
            let print = |m: &Module| {
                let mut buf = vec![];
                {
                    let handlers = box MyHandlers;
                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::Config { minify: false },
                        comments: None,
                        cm: cm.clone(),
                        wr: box swc_ecma_codegen::text_writer::JsWriter::new(
                            cm.clone(),
                            "\n",
                            &mut buf,
                            None,
                        ),
                        handlers,
                        pos_of_leading_comments: Default::default(),
                    };

                    emitter.emit_module(m).expect("failed to emit module");
                }
                unsafe { String::from_utf8_unchecked(buf) }
            };

            let fm = cm
                .load_file(&dir.join("input.mjs"))
                .expect("failed to load file");
            let mut p = Parser::new(
                Session { handler: &handler },
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );

            let module = p.parse_module().map_err(|mut e| e.emit())?;
            let actual = module.fold_with(&mut pass);

            // debug mode?
            if dir.join("stdout.txt").exists() {
                let mut out = read(&dir.join("stdout.txt"));

                if dir.join("stderr.txt").exists() {
                    out.push_str("\n\n");
                    out.push_str(&read(&dir.join("stderr.txt")));
                }

                return Ok(());
            };

            // It's normal transform test.
            let expected = {
                let fm = cm
                    .load_file(&dir.join("output.mjs"))
                    .expect("failed to load output file");

                let mut p = Parser::new(
                    Session { handler: &handler },
                    Default::default(),
                    SourceFileInput::from(&*fm),
                    None,
                );

                let mut m = p.parse_module().map_err(|mut e| e.emit())?;

                m.body.sort_by(|a, b| match *a {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        ref specifiers,
                        ref src,
                        ..
                    })) if specifiers.is_empty() && src.value.starts_with("core-js") => match *b {
                        ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                            specifiers: ref rs,
                            src: ref rsrc,
                            ..
                        })) if rs.is_empty() && rsrc.value.starts_with("core-js") => {
                            src.value.cmp(&rsrc.value)
                        }

                        _ => Ordering::Equal,
                    },
                    _ => Ordering::Equal,
                });

                m
            };

            let actual_src = print(&actual);
            let expected_src = print(&expected);

            if actual_src != expected_src {
                panic!(
                    r#"assertion failed: `(left == right)`
            {}"#,
                    ::testing::diff(&actual_src, &expected_src),
                );
            }

            Ok(())
        })
        .expect("failed to execute");

    Ok(())
}

fn read(p: &Path) -> String {
    let mut buf = String::new();
    let mut f = File::open(p).expect("failed to open file");
    f.read_to_string(&mut buf).expect("failed to read file");

    buf
}

#[test]
fn fixtures() {
    let tests = load().expect("failed to load fixtures");

    let args: Vec<_> = env::args().collect();
    test_main(&args, tests, Some(test::Options::new()));
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}
