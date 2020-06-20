//! Utilities for testing.
use super::Bundler;
use crate::{loaders::swc::SwcLoader, resolve::NodeResolver, util::HygieneRemover};
use pretty_assertions::assert_eq;
use std::{path::PathBuf, sync::Arc};
use swc_common::{fold::FoldWith, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, Syntax};
use testing::drop_span;

pub struct Tester<'a> {
    pub bundler: Bundler<'a>,
}

impl<'a> Tester<'a> {
    pub fn parse(&self, s: &str) -> Module {
        let fm = self
            .bundler
            .swc
            .cm
            .new_source_file(FileName::Real(PathBuf::from("input.js")), s.into());
        let p = self
            .bundler
            .swc
            .parse_js(
                fm,
                Default::default(),
                Syntax::Es(EsConfig {
                    dynamic_import: true,
                    ..Default::default()
                }),
                true,
                true,
            )
            .expect("failed to parse");

        match p {
            Program::Module(m) => m,
            Program::Script(_) => unreachable!(),
        }
    }

    pub fn assert_eq(&self, m: &Module, expected: &str) {
        let expected = self.parse(expected);

        let m = drop_span(m.clone().fold_with(&mut HygieneRemover));
        let expected = drop_span(expected);

        assert_eq!(m, expected)
    }
}

pub fn test_bundler<F>(op: F)
where
    F: FnOnce(&mut Tester),
{
    testing::run_test2(true, |cm, handler| {
        let compiler = Arc::new(swc::Compiler::new(cm.clone(), Arc::new(handler)));
        let loader = SwcLoader::new(compiler.clone(), Default::default());
        let bundler = Bundler::new(
            compiler.clone(),
            swc::config::Options {
                swcrc: true,
                ..Default::default()
            },
            &NodeResolver,
            &loader,
        );

        let mut t = Tester { bundler };

        op(&mut t);

        Ok(())
    })
    .expect("WTF?");
}
