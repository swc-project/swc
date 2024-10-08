//! Utilities for testing.
use std::path::PathBuf;

use anyhow::Error;
use indexmap::IndexMap;
use swc_common::{collections::ARandomState, sync::Lrc, FileName, SourceMap, Span, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_loader::resolve::Resolution;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::VisitMutWith;

use super::{load::TransformedModule, Bundler, Config};
use crate::{load::ModuleData, util::HygieneRemover, Load, ModuleRecord, Resolve};

pub(crate) struct Tester<'a> {
    pub cm: Lrc<SourceMap>,
    pub bundler: Bundler<'a, Loader, Resolver>,
}

pub struct Loader {
    cm: Lrc<SourceMap>,
    files: IndexMap<String, String, ARandomState>,
}

impl Load for Loader {
    fn load(&self, f: &FileName) -> Result<ModuleData, Error> {
        eprintln!("load: {}", f);
        let v = self.files.get(&f.to_string());
        let v = v.unwrap();

        let fm = self.cm.new_source_file(f.clone().into(), v.to_string());

        let lexer = Lexer::new(
            Default::default(),
            EsVersion::Es2020,
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().unwrap();

        Ok(ModuleData {
            fm,
            module,
            helpers: Default::default(),
        })
    }
}

#[derive(Debug, Default)]
pub struct Resolver;

impl Resolve for Resolver {
    fn resolve(&self, _: &FileName, s: &str) -> Result<Resolution, Error> {
        assert!(s.starts_with("./"));

        let path = PathBuf::from(s.to_string())
            .with_extension("js")
            .strip_prefix("./")
            .unwrap()
            .into();

        Ok(Resolution {
            filename: FileName::Real(path),
            slug: None,
        })
    }
}

impl Tester<'_> {
    pub fn module(&self, name: &str) -> TransformedModule {
        self.bundler
            .scope
            .get_module_by_path(&FileName::Real(name.to_string().into()))
            .unwrap_or_else(|| panic!("failed to find module named {}", name))
    }

    #[allow(dead_code)]
    pub fn parse(&self, s: &str) -> Module {
        let fm = self
            .cm
            .new_source_file(FileName::Real(PathBuf::from("input.js")).into(), s.into());

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        parser.parse_module().unwrap()
    }

    #[allow(dead_code)]
    pub fn assert_eq(&self, m: &Module, expected: &str) {
        let expected = self.parse(expected);

        let mut m = m.clone();
        m.visit_mut_with(&mut HygieneRemover);

        let m = drop_span(m);
        let expected = drop_span(expected);

        assert_eq!(m, expected)
    }
}
pub(crate) fn suite() -> TestBuilder {
    TestBuilder::default()
}

#[derive(Default)]
pub(crate) struct TestBuilder {
    files: IndexMap<String, String, ARandomState>,
}

impl TestBuilder {
    pub fn file(mut self, name: &str, src: &str) -> Self {
        self.files.insert(name.to_string(), src.to_string());
        self
    }

    pub fn run<F>(self, op: F)
    where
        F: FnOnce(&mut Tester) -> Result<(), Error>,
    {
        testing::run_test2(true, |cm, _| {
            GLOBALS.with(|globals| {
                let bundler = Bundler::new(
                    globals,
                    cm.clone(),
                    Loader {
                        cm: cm.clone(),
                        files: self.files.clone(),
                    },
                    Default::default(),
                    Config {
                        require: true,
                        disable_inliner: true,
                        disable_hygiene: false,
                        disable_fixer: false,
                        disable_dce: false,
                        external_modules: Vec::new(),
                        module: Default::default(),
                    },
                    Box::new(Hook),
                );

                for (name, _) in self.files {
                    bundler
                        .load_transformed(&FileName::Real(name.clone().into()))
                        .unwrap();
                }

                let mut t = Tester {
                    cm: cm.clone(),
                    bundler,
                };

                op(&mut t).unwrap();

                Ok(())
            })
        })
        .expect("WTF?");
    }
}

struct Hook;

impl crate::Hook for Hook {
    fn get_import_meta_props(&self, _: Span, _: &ModuleRecord) -> Result<Vec<KeyValueProp>, Error> {
        unreachable!()
    }
}
