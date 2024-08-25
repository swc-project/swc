#![allow(clippy::needless_update)]

/// Use memory allocator
extern crate swc_malloc;

use std::{
    collections::HashMap,
    env, fs,
    path::Path,
    time::{Duration, Instant},
};

use anyhow::Error;
use swc_bundler::{Bundle, Bundler, Load, ModuleData, ModuleRecord};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Mark, SourceMap, Span, GLOBALS,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_loader::{
    resolvers::{lru::CachingResolver, node::NodeModulesResolver},
    TargetEnv,
};
use swc_ecma_minifier::option::{
    CompressOptions, ExtraOptions, MangleOptions, MinifyOptions, TopLevelOptions,
};
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;

fn print_bundles(cm: Lrc<SourceMap>, modules: Vec<Bundle>, minify: bool) {
    for bundled in modules {
        let code = {
            let mut buf = Vec::new();

            {
                let wr = JsWriter::new(cm.clone(), "\n", &mut buf, None);
                let mut emitter = Emitter {
                    cfg: swc_ecma_codegen::Config::default().with_minify(true),
                    cm: cm.clone(),
                    comments: None,
                    wr: if minify {
                        Box::new(omit_trailing_semi(wr)) as Box<dyn WriteJs>
                    } else {
                        Box::new(wr) as Box<dyn WriteJs>
                    },
                };

                emitter.emit_module(&bundled.module).unwrap();
            }

            String::from_utf8_lossy(&buf).to_string()
        };

        #[cfg(feature = "concurrent")]
        rayon::spawn(move || drop(bundled));

        println!("Created output.js ({}kb)", code.len() / 1024);
        fs::write("output.js", &code).unwrap();
    }
}

fn do_test(_entry: &Path, entries: HashMap<String, FileName>, inline: bool, minify: bool) {
    testing::run_test2(false, |cm, _| {
        let start = Instant::now();

        let globals = Box::leak(Box::default());
        let mut bundler = Bundler::new(
            globals,
            cm.clone(),
            Loader { cm: cm.clone() },
            CachingResolver::new(
                4096,
                NodeModulesResolver::new(TargetEnv::Node, Default::default(), true),
            ),
            swc_bundler::Config {
                require: false,
                disable_inliner: !inline,
                external_modules: Default::default(),
                disable_fixer: minify,
                disable_hygiene: minify,
                disable_dce: false,
                module: Default::default(),
            },
            Box::new(Hook),
        );

        let mut modules = bundler
            .bundle(entries)
            .map_err(|err| println!("{:?}", err))?;
        println!("Bundled as {} modules", modules.len());

        #[cfg(feature = "concurrent")]
        rayon::spawn(move || {
            drop(bundler);
        });

        {
            let dur = start.elapsed();
            println!("Bundler.bundle() took {}", to_ms(dur));
        }

        let error = false;
        if minify {
            let start = Instant::now();

            modules = modules
                .into_iter()
                .map(|mut b| {
                    GLOBALS.set(globals, || {
                        b.module = swc_ecma_minifier::optimize(
                            b.module.into(),
                            cm.clone(),
                            None,
                            None,
                            &MinifyOptions {
                                compress: Some(CompressOptions {
                                    top_level: Some(TopLevelOptions { functions: true }),
                                    ..Default::default()
                                }),
                                mangle: Some(MangleOptions {
                                    top_level: Some(true),
                                    ..Default::default()
                                }),
                                ..Default::default()
                            },
                            &ExtraOptions {
                                unresolved_mark: Mark::new(),
                                top_level_mark: Mark::new(),
                                mangle_name_cache: None,
                            },
                        )
                        .expect_module();
                        b.module.visit_mut_with(&mut fixer(None));
                        b
                    })
                })
                .collect();

            let dur = start.elapsed();
            println!("Minification took {}", to_ms(dur));
        }

        {
            let cm = cm;
            print_bundles(cm, modules, minify);
        }

        if error {
            return Err(());
        }

        Ok(())
    })
    .expect("failed to process a module");
}

fn to_ms(dur: Duration) -> String {
    format!("{}ms", dur.as_millis())
}

fn main() -> Result<(), Error> {
    let minify = env::var("MINIFY").unwrap_or_else(|_| "0".to_string()) == "1";

    let main_file = env::args().nth(1).unwrap();
    let mut entries = HashMap::default();
    entries.insert("main".to_string(), FileName::Real(main_file.clone().into()));

    let start = Instant::now();
    do_test(Path::new(&main_file), entries, false, minify);
    let dur = start.elapsed();
    println!("Took {}", to_ms(dur));

    Ok(())
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

pub struct Loader {
    pub cm: Lrc<SourceMap>,
}

impl Load for Loader {
    fn load(&self, f: &FileName) -> Result<ModuleData, Error> {
        let fm = match f {
            FileName::Real(path) => self.cm.load_file(path)?,
            _ => unreachable!(),
        };

        let module = parse_file_as_module(
            &fm,
            Syntax::Es(Default::default()),
            EsVersion::Es2020,
            None,
            &mut Vec::new(),
        )
        .unwrap_or_else(|err| {
            let handler =
                Handler::with_tty_emitter(ColorConfig::Always, false, false, Some(self.cm.clone()));
            err.into_diagnostic(&handler).emit();
            panic!("failed to parse")
        });

        Ok(ModuleData {
            fm,
            module,
            helpers: Default::default(),
        })
    }
}
