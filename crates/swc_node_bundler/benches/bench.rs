//! This benchmark lives here because I don't want to implement `Resolve` again
//! and again.
#![feature(test)]
#![feature(bench_black_box)]

extern crate test;

use std::{
    collections::HashMap,
    hint::black_box,
    path::{Path, PathBuf},
};

use anyhow::Error;
use swc::resolver::NodeResolver;
use swc_atoms::js_word;
use swc_bundler::{Bundler, Load, ModuleData, ModuleRecord};
use swc_common::{sync::Lrc, FileName, Mark, SourceMap, Span, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_module, Syntax, TsConfig};
use swc_ecma_transforms::{resolver_with_mark, typescript::strip};
use swc_ecma_visit::FoldWith;
use test::Bencher;

#[bench]
#[ignore]
fn three_js(b: &mut Bencher) {
    let dir = PathBuf::new()
        .join("..")
        .join("tests")
        .join("integration")
        .join("three-js")
        .join("repo");
    run_bench(b, &dir.join("src").join("Three.js"));
}

fn run_bench(b: &mut Bencher, entry: &Path) {
    ::testing::run_test2(false, |cm, _| {
        b.iter(|| {
            GLOBALS.with(|globals| {
                let mut bundler = Bundler::new(
                    globals,
                    cm.clone(),
                    Loader { cm: cm.clone() },
                    NodeResolver::default(),
                    swc_bundler::Config {
                        ..Default::default()
                    },
                    Box::new(Hook),
                );

                let mut entries = HashMap::new();
                entries.insert("main".to_string(), FileName::Real(entry.to_path_buf()));

                black_box(bundler.bundle(entries).unwrap());
            });
        });

        Ok(())
    })
    .unwrap();
}

struct Loader {
    cm: Lrc<SourceMap>,
}

impl Load for Loader {
    fn load(&self, f: &FileName) -> Result<ModuleData, Error> {
        let tsx;
        let fm = match f {
            FileName::Real(path) => {
                tsx = path.to_string_lossy().ends_with(".tsx");
                self.cm.load_file(path)?
            }
            _ => unreachable!(),
        };

        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsConfig {
                decorators: true,
                tsx,
                ..Default::default()
            }),
            EsVersion::Es2020,
            None,
            &mut vec![],
        )
        .unwrap();

        let mark = Mark::fresh(Mark::root());
        let module = module
            .fold_with(&mut resolver_with_mark(mark))
            .fold_with(&mut strip(mark));
        Ok(ModuleData {
            fm,
            module,
            helpers: Default::default(),
        })
    }
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
                key: PropName::Ident(Ident::new(js_word!("url"), span)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    raw: None,
                    value: file_name.into(),
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("main"), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: Box::new(Expr::MetaProp(MetaPropExpr {
                            span,
                            kind: MetaPropKind::ImportMeta,
                        })),
                        prop: MemberProp::Ident(Ident::new(js_word!("main"), span)),
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}
