#![feature(specialization, proc_macro)]

extern crate eq_ignore_span;
extern crate swc_common;
use eq_ignore_span::EqIgnoreSpan;

#[derive(PartialEq, EqIgnoreSpan)]
pub struct Struct {}

#[derive(PartialEq, EqIgnoreSpan)]
pub enum Enum {
}
