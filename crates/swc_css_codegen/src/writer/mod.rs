use std::fmt::Result;

use auto_impl::auto_impl;
use swc_common::{BytePos, Span};

pub mod basic;

#[auto_impl(&mut, Box)]
pub trait CssWriter {
    fn write_space(&mut self) -> Result;

    fn write_newline(&mut self) -> Result;

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result;

    fn write_str(&mut self, span: Span, s: &str) -> Result;

    fn write_comment(&mut self, s: &str) -> Result;

    fn add_srcmap(&mut self, pos: BytePos) -> Result;

    fn increase_indent(&mut self);

    fn decrease_indent(&mut self);
}
