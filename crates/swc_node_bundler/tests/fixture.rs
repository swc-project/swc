use anyhow::Error;
use std::{
    collections::HashMap,
    fs::{create_dir_all, read_dir},
    io::{self},
    path::PathBuf,
    sync::Arc,
};
use swc::{config::SourceMapsConfig, resolver::environment_resolver};
use swc_atoms::js_word;
use swc_bundler::{BundleKind, Bundler, Config, ModuleRecord};
use swc_common::{FileName, Span, GLOBALS};
use swc_ecma_ast::{
    Bool, EsVersion, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, MetaPropExpr,
    PropName, Str,
};
use swc_ecma_loader::{TargetEnv, NODE_BUILTINS};
use swc_ecma_transforms::fixer;
use swc_ecma_visit::FoldWith;
use swc_node_bundler::loaders::swc::SwcLoader;
use testing::NormalizedOutput;

#[testing::fixture("tests/pass/**/input")]
fn pass(input_dir: PathBuf) {
    let _ = pretty_env_logger::try_init();

    let entry = input_dir.parent().unwrap().to_path_buf();

    let _ = create_dir_all(entry.join("output"));

    let entries = read_dir(&input_dir)
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

    testing::run_test2(false, |cm, _handler| {
        let compiler = Arc::new(swc::Compiler::new(cm.clone()));

        GLOBALS.set(compiler.globals(), || {
            let loader = SwcLoader::new(
                compiler.clone(),
                swc::config::Options {
                    swcrc: true,
                    ..Default::default()
                },
            );
            let mut bundler = Bundler::new(
                compiler.globals(),
                cm.clone(),
                &loader,
                environment_resolver(TargetEnv::Node, Default::default()),
                Config {
                    require: true,
                    disable_inliner: true,
                    module: Default::default(),
                    external_modules: NODE_BUILTINS.to_vec().into_iter().map(From::from).collect(),
                },
                Box::new(Hook),
            );

            let modules = bundler
                .bundle(entries)
                .map_err(|err| println!("{:?}", err))?;
            println!("Bundled as {} modules", modules.len());

            let mut error = false;

            for bundled in modules {
                let code = compiler
                    .print(
                        &bundled.module.fold_with(&mut fixer(None)),
                        None,
                        None,
                        false,
                        EsVersion::Es2020,
                        SourceMapsConfig::Bool(false),
                        &Default::default(),
                        None,
                        false,
                        Some(true.into()),
                    )
                    .expect("failed to print?")
                    .code;

                let name = match bundled.kind {
                    BundleKind::Named { name } | BundleKind::Lib { name } => PathBuf::from(name),
                    BundleKind::Dynamic => format!("dynamic.{}.js", bundled.id).into(),
                };

                let output_path = entry
                    .join("output")
                    .join(name.file_name().unwrap())
                    .with_extension("js");

                println!("Printing {}", output_path.display());

                // {
                //     let status = Command::new("node")
                //         .arg(&output_path)
                //         .stdout(Stdio::inherit())
                //         .stderr(Stdio::inherit())
                //         .status()
                //         .unwrap();
                //     assert!(status.success());
                // }

                let s = NormalizedOutput::from(code);

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
