#![allow(dead_code)]

use std::{
    cmp::Ordering,
    env,
    fs::File,
    io,
    io::Read,
    path::{Path, PathBuf},
};

use pretty_assertions::assert_eq;
use serde::Deserialize;
use serde_json::Value;
use swc_common::{
    collections::AHashMap, comments::SingleThreadedComments, errors::HANDLER, input::StringInput,
    FromVariant, Mark,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, Syntax};
use swc_ecma_preset_env::{preset_env, Config, FeatureOrModule, Mode, Targets, Version};
use swc_ecma_transforms::{fixer, helpers};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::{visit_mut_pass, VisitMut};
use testing::{NormalizedOutput, Tester};

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
    pub targets: Option<Targets>,

    #[serde(default)]
    pub include: Vec<FeatureOrModule>,

    #[serde(default)]
    pub exclude: Vec<FeatureOrModule>,

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
    Ver(Version),
    Val(AHashMap<String, Value>),
}

impl Default for CoreJs {
    fn default() -> Self {
        Self::Ver(Version {
            major: 2,
            minor: 0,
            patch: 0,
        })
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
    Json(serde_json::Error),
    Msg(String),
}

fn exec(c: PresetConfig, dir: PathBuf) -> Result<(), Error> {
    println!("Config: {:?}", c);

    Tester::new()
        .print_errors(|cm, handler| {
            let pass = (
                preset_env(
                    Mark::fresh(Mark::root()),
                    Some(SingleThreadedComments::default()),
                    Config {
                        debug: c.debug,
                        mode: match c.use_built_ins {
                            UseBuiltIns::Bool(false) => None,
                            UseBuiltIns::Str(ref s) if s == "usage" => Some(Mode::Usage),
                            UseBuiltIns::Str(ref s) if s == "entry" => Some(Mode::Entry),
                            v => unreachable!("invalid: {:?}", v),
                        },
                        skip: Vec::new(),
                        loose: true,
                        // TODO
                        dynamic_import: true,
                        bugfixes: false,
                        include: c.include,
                        exclude: c.exclude,
                        core_js: match c.corejs {
                            CoreJs::Ver(v) => Some(v),
                            ref s => unimplemented!("Unknown core js version: {:?}", s),
                        },
                        force_all_transforms: c.force_all_transforms,
                        shipped_proposals: c.shipped_proposals,
                        targets: c.targets,
                        path: std::env::current_dir().unwrap(),
                    },
                    Default::default(),
                    &mut Default::default(),
                ),
                fixer(None),
            );

            let print = |m: &Program| {
                let mut buf = Vec::new();
                {
                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::Config::default(),
                        comments: None,
                        cm: cm.clone(),
                        wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                            cm.clone(),
                            "\n",
                            &mut buf,
                            None,
                        )),
                    };

                    emitter.emit_program(m).expect("failed to emit module");
                }
                String::from_utf8(buf).expect("invalid utf8 character detected")
            };

            let fm = cm
                .load_file(&dir.join("input.mjs"))
                .expect("failed to load file");
            let mut p = Parser::new(
                Syntax::Es(Default::default()),
                StringInput::from(&*fm),
                None,
            );

            let module = p
                .parse_module()
                .map_err(|e| e.into_diagnostic(&handler).emit())?;

            for e in p.take_errors() {
                e.into_diagnostic(&handler).emit()
            }

            let actual = helpers::HELPERS.set(&Default::default(), || {
                HANDLER.set(&handler, || Program::Module(module).apply(pass))
            });

            // debug mode?
            if dir.join("stdout.txt").exists() {
                let mut out = read(&dir.join("stdout.txt"));

                if dir.join("stderr.txt").exists() {
                    out.push_str("\n\n");
                    out.push_str(&read(&dir.join("stderr.txt")));
                }

                return Ok(());
            };

            let actual_src = print(&actual);
            if env::var("UPDATE").is_ok() {
                NormalizedOutput::from(actual_src.clone())
                    .compare_to_file(dir.join("output.mjs"))
                    .unwrap();
            }

            // It's normal transform test.
            let expected = {
                let fm = cm
                    .load_file(&dir.join("output.mjs"))
                    .expect("failed to load output file");

                let mut p = Parser::new(
                    Syntax::Es(Default::default()),
                    StringInput::from(&*fm),
                    None,
                );

                let mut m = p
                    .parse_module()
                    .map_err(|e| e.into_diagnostic(&handler).emit())?;

                for e in p.take_errors() {
                    e.into_diagnostic(&handler).emit()
                }

                m.body.sort_by(|a, b| match *a {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        ref specifiers,
                        ref src,
                        ..
                    })) if specifiers.is_empty() && src.value.starts_with("core-js/modules") => {
                        match *b {
                            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                                specifiers: ref rs,
                                src: ref rsrc,
                                ..
                            })) if rs.is_empty() && rsrc.value.starts_with("core-js/modules") => {
                                src.value.cmp(&rsrc.value)
                            }

                            _ => Ordering::Equal,
                        }
                    }
                    _ => Ordering::Equal,
                });

                Program::Module(m)
            };

            let expected_src = print(&expected);

            if drop_span(actual.apply(&mut visit_mut_pass(Normalizer)))
                == drop_span(expected.apply(&mut visit_mut_pass(Normalizer)))
            {
                return Ok(());
            }

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

#[testing::fixture("tests/fixtures/**/input.mjs")]
fn fixture(input: PathBuf) {
    let entry_dir = input.parent().unwrap().to_path_buf();
    println!("File: {}", entry_dir.display());

    let cfg: BabelOptions =
        serde_json::from_reader(File::open(entry_dir.join("options.json")).unwrap())
            .map_err(|err| Error::Msg(format!("failed to parse options.json: {}", err)))
            .unwrap();
    assert_eq!(cfg.presets.len(), 1);
    let cfg = cfg.presets.into_iter().map(|v| v.1).next().unwrap();

    exec(cfg, entry_dir).expect("failed to run test")
}

struct Normalizer;

impl VisitMut for Normalizer {}
