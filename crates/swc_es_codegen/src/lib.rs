//! High-performance code generator for `swc_es_ast`.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![deny(missing_docs)]

use swc_es_ast::{AstStore, ProgramId};

pub use crate::{
    config::{CodegenConfig, OutputFormat},
    error::{CodegenError, NodeKind},
};

mod config;
mod emitter;
mod error;
mod writer;

/// Emits a program in canonical format.
#[inline]
pub fn emit_program(store: &AstStore, program: ProgramId) -> Result<String, CodegenError> {
    emit_program_with_config(store, program, CodegenConfig::default())
}

/// Emits a program with explicit codegen configuration.
#[inline]
pub fn emit_program_with_config(
    store: &AstStore,
    program: ProgramId,
    config: CodegenConfig,
) -> Result<String, CodegenError> {
    emitter::Emitter::new(store, config).emit_program(program)
}
