#![deny(clippy::all)]

use swc_es_ast::{AstStore, ProgramId};

pub use crate::{
    config::Config,
    emitter::Emitter,
    writer::{basic::BasicJsWriter, WriteJs},
};

mod config;
mod emitter;
mod precedence;
mod token_spacing;
pub mod writer;

pub type Result = std::fmt::Result;

/// Generates source text from an arena-backed program.
#[inline]
pub fn to_code(store: &AstStore, program: ProgramId, cfg: Config) -> String {
    let mut output = String::new();

    {
        let writer = BasicJsWriter::new(&mut output);
        let mut emitter = Emitter::new(cfg, store, writer);
        emitter
            .emit_program(program)
            .expect("swc_es_codegen: failed to emit program");
    }

    output
}

/// Generates source text using the default configuration.
#[inline]
pub fn to_code_default(store: &AstStore, program: ProgramId) -> String {
    to_code(store, program, Config::default())
}
