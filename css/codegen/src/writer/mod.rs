use auto_impl::auto_impl;
use std::fmt::Result;
use swc_common::Span;

pub mod basic;

#[auto_impl(&mut, Box)]
pub trait CssWriter {
    fn write_ident(&mut self, span: Option<Span>, s: &str) -> Result;

    fn write_punct(&mut self, span: Option<Span>, punct: &str) -> Result;

    fn write_space(&mut self) -> Result;

    fn write_raw(&mut self, span: Option<Span>, text: &str) -> Result;

    fn increase_indent(&mut self);

    fn decrease_indent(&mut self);

    fn write_newline(&mut self) -> Result;
}
