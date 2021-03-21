//! This benchmark lives here because I don't want to implement `Resolve` again
//! and again.
#![feature(test)]

extern crate test;

#[cfg(all(unix, not(target_env = "musl")))]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[cfg(windows)]
#[global_allocator]
static ALLOC: mimalloc::MiMalloc = mimalloc::MiMalloc;

use anyhow::Error;
use spack::resolvers::NodeResolver;
use std::{
    collections::HashMap,
    hint::black_box,
    path::{Path, PathBuf},
};
use swc_atoms::js_word;
use swc_bundler::{Bundler, Load, ModuleData, ModuleRecord};
use swc_common::{sync::Lrc, FileName, SourceMap, Span, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::typescript::strip;
use swc_ecma_visit::FoldWith;
use test::Bencher;

#[bench]
fn three_js(b: &mut Bencher) {
    let dir = PathBuf::new()
        .join("..")
        .join("integration-tests")
        .join("three-js")
        .join("repo");
    run_bench(b, &dir.join("src").join("Three.js"));
}

fn run_bench(b: &mut Bencher, entry: &Path) {
    ::testing::run_test2(false, |cm, _| {
        b.iter(|| {
            GLOBALS.with(|globals| {
                let bundler = Bundler::new(
                    globals,
                    cm.clone(),
                    Loader { cm: cm.clone() },
                    NodeResolver::new(),
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
                self.cm.load_file(&path)?
            }
            _ => unreachable!(),
        };

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                decorators: true,
                tsx,
                ..Default::default()
            }),
            JscTarget::Es2020,
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().unwrap();
        let module = module.fold_with(&mut strip());
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
