//! Utilities for testing.
use super::Bundler;
use crate::{util::HygieneRemover, Load, Resolve};
use anyhow::Error;
use std::path::PathBuf;
use swc_common::{sync::Lrc, FileName, SourceFile, SourceMap, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::FoldWith;

pub struct Tester<'a> {
    pub cm: Lrc<SourceMap>,
    pub bundler: Bundler<'a, Loader, Resolver>,
}

#[derive(Debug, Default)]
pub struct Loader;

impl Load for Loader {
    fn load(&self, _: &FileName) -> Result<(Lrc<SourceFile>, Module), Error> {
        unreachable!("swc_bundler: tester.load")
    }
}

#[derive(Debug, Default)]
pub struct Resolver;

impl Resolve for Resolver {
    fn resolve(&self, _: &FileName, _: &str) -> Result<FileName, Error> {
        unreachable!("swc_bundler: tester.resolve")
    }
}

impl<'a> Tester<'a> {
    pub fn parse(&self, s: &str) -> Module {
        let fm = self
            .cm
            .new_source_file(FileName::Real(PathBuf::from("input.js")), s.into());

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        parser.parse_module().unwrap()
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
    testing::run_test2(true, |cm, _| {
        GLOBALS.with(|globals| {
            let bundler = Bundler::new(
                globals,
                cm.clone(),
                Default::default(),
                Default::default(),
                vec![],
            );

            let mut t = Tester {
                cm: cm.clone(),
                bundler,
            };

            op(&mut t);

            Ok(())
        })
    })
    .expect("WTF?");
}
