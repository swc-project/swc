use logos::Logos;

use crate::LogosError;

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(error = LogosError)]
pub enum JsxToken {}
