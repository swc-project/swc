use self::common::*;
use anyhow::Error;
use std::{
    self,
    collections::HashMap,
    fs::read_dir,
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
use swc_ecma_loader::NODE_BUILTINS;
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::FoldWith;
use testing::NormalizedOutput;

#[path = "common/mod.rs"]
mod common;

fn do_test(entry: &Path, entries: HashMap<String, FileName>, inline: bool) {
    testing::run_test2(false, |cm, _| {
        let globals = Globals::default();
        let mut bundler = Bundler::new(
            &globals,
            cm.clone(),
            Loader { cm: cm.clone() },
            NodeResolver,
            Config {
                require: true,
                disable_inliner: !inline,
                external_modules: NODE_BUILTINS.to_vec().into_iter().map(From::from).collect(),
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
    .expect("failed to process a module");
}

#[testing::fixture("tests/fixture/**/input")]
fn pass(entry: PathBuf) {
    let entries = read_dir(&entry)
        .unwrap()
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
