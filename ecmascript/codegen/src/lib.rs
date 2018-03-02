#![feature(box_syntax)]

pub extern crate sourcemap;
extern crate swc_ecma_ast;

use sourcemap::SourceMapBuilder;
use std::io::{self, Write};
use text_writer::TextWriter;

pub mod config;
pub mod text_writer;

pub type Result = io::Result<()>;

pub struct Emitter {
    pub srcmap: SourceMapBuilder,
    pub writer: Box<TextWriter>,
}

impl Emitter {}
