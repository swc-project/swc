extern crate rayon;
extern crate slog;
pub extern crate swc_atoms;
pub extern crate swc_common;
pub extern crate swc_ecmascript;
pub extern crate swc_macros;
use slog::Logger;
use swc_common::errors::Handler;
use swc_ecmascript::ast::Module;
use swc_ecmascript::parser::{CharIndices, PResult, Parser, Session as ParseSess};

#[derive(Debug)]
pub struct Compiler {
    threads: rayon::ThreadPool,
    logger: Logger,
    handler: Handler,
}

impl Compiler {
    pub fn new(logger: Logger, threads: rayon::ThreadPool) -> Self {
        Compiler { threads, logger }
    }

    /// TODO
    pub fn parse_js(&self, src: &str) -> PResult<Module> {
        Parser::new(
            ParseSess {
                handler: &self.handler,
                logger: &self.logger,
                cfg: Default::default(),
            },
            CharIndices(src.char_indices()),
        ).parse_module()
    }
}
