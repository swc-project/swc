use std::fmt::Result;

use auto_impl::auto_impl;
use swc_common::Span;

pub mod basic;

#[auto_impl(&mut, Box)]
pub trait CssWriter {
    fn write_space(&mut self) -> Result;

    fn write_newline(&mut self) -> Result;

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result;

    fn write_raw_char(&mut self, span: Option<Span>, c: char) -> Result;

    fn increase_indent(&mut self);

    fn decrease_indent(&mut self);
}
