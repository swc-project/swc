extern crate rayon;
extern crate slog;
pub extern crate swc_atoms;
pub extern crate swc_common;
pub extern crate swc_ecmascript;
pub extern crate swc_macros;
use slog::Logger;
use swc_ecmascript::ast::Module;
use swc_ecmascript::parser::{CharIndices, Config, PResult, Parser};

#[derive(Debug)]
pub struct Compiler {
    threads: rayon::ThreadPool,
    logger: Logger,
}

impl Compiler {
    pub fn new(logger: Logger, threads: rayon::ThreadPool) -> Self {
        Compiler { threads, logger }
    }

    /// TODO
    pub fn parse_js(&mut self, src: &str) -> PResult<Module> {
        Parser::new(
            &self.logger,
            Config {
                module: true,
                ..Default::default()
            },
            CharIndices(src.char_indices()),
        ).parse_module()
    }
}
