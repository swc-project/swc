use logos::Logos;

use crate::UnknownChar;

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(error = UnknownChar)]
pub enum JsxToken {}
