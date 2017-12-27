#![feature(box_syntax)]

extern crate ecma_base;
extern crate lalrpop_util;
extern crate swc_atoms;
extern crate swc_common;

use ecma_base::*;
use ecma_base::token::Token;
use swc_common::BytePos;

#[allow(dead_code, unused_imports)]
#[cfg_attr(rustfmt, rustfmt_skip)]
mod grammar;

pub type Errors = Vec<ParseError>;
pub type ParseError = lalrpop_util::ParseError<BytePos, Token, Error>;

#[derive(Debug, Clone, PartialEq)]
pub enum Error {

}
