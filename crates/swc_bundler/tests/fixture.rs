use std::{
    collections::HashMap,
    fs::read_dir,
    io,
    path::{Path, PathBuf},
};

use anyhow::Error;
use swc_bundler::{BundleKind, Bundler, Config, ModuleRecord};
use swc_common::{errors::HANDLER, FileName, Globals, Span};
use swc_ecma_ast::{
    Bool, Expr, IdentName, KeyValueProp, Lit, MemberExpr, MemberProp, MetaPropExpr, MetaPropKind,
    Program, PropName, Str,
};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_loader::NODE_BUILTINS;
use swc_ecma_transforms_base::fixer::fixer;
use testing::NormalizedOutput;

use self::common::*;

#[path = "common/mod.rs"]
mod common;

fn do_test(entry: &Path, entries: HashMap<String, FileName>, inline: bool) {
    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let globals = Globals::default();
            let mut bundler = Bundler::new(
                &globals,
                cm.clone(),
                Loader { cm: cm.clone() },
                NodeResolver,
                Config {
                    require: true,
                    disable_inliner: !inline,
                    external_modules: NODE_BUILTINS.iter().copied().map(From::from).collect(),
                    module: Default::default(),
                    ..Default::default()
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
                    let mut buf = Vec::new();

                    {
                        let mut emitter = Emitter {
                            cfg: Default::default(),
                            cm: cm.clone(),
                            comments: None,
                            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
                        };

                        emitter
                            .emit_program(&Program::Module(bundled.module).apply(fixer(None)))
                            .unwrap();
                    }

                    String::from_utf8_lossy(&buf).to_string()
                };

                let name = match bundled.kind {
                    BundleKind::Named { name } | BundleKind::Lib { name } => PathBuf::from(name),
                    BundleKind::Dynamic => format!("dynamic.{}.js", bundled.id).into(),
                };

                let output_dir = entry.join("output");

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
    })
    .expect("failed to process a module");
}

#[testing::fixture("tests/fixture/**/input")]
fn pass(entry: PathBuf) {
    let entries = read_dir(&entry)
        .unwrap()
        .filter(|e| match e {
            Ok(e) => e
                .path()
                .file_name()
                .unwrap()
                .to_string_lossy()
                .starts_with("entry"),
            _ => false,
        })
        .map(|e| -> Result<_, io::Error> {
            let e = e?;
            Ok((
                e.file_name().to_string_lossy().to_string(),
                FileName::Real(e.path()),
            ))
        })
        .collect::<Result<HashMap<_, _>, _>>()
        .unwrap();

    do_test(entry.parent().unwrap(), entries.clone(), true);
    do_test(entry.parent().unwrap(), entries, false);
}

struct Hook;

impl swc_bundler::Hook for Hook {
    fn get_import_meta_props(
        &self,
        span: Span,
        module_record: &ModuleRecord,
    ) -> Result<Vec<KeyValueProp>, Error> {
        let file_name = module_record.file_name.to_string();

        Ok(vec![
            KeyValueProp {
                key: PropName::Ident(IdentName::new("url".into(), span)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    raw: None,
                    value: file_name.into(),
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(IdentName::new("main".into(), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: Box::new(Expr::MetaProp(MetaPropExpr {
                            span,
                            kind: MetaPropKind::ImportMeta,
                        })),
                        prop: MemberProp::Ident(IdentName::new("main".into(), span)),
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}
