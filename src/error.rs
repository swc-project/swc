use failure::Fail;
use lazy_static::lazy_static;
use regex;
use serde_json;
use sourcemap;
use std::{io, string::FromUtf8Error};

#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "failed to read config file: {}", err)]
    FailedToReadConfigFile { err: io::Error },

    #[fail(display = "failed to parse config file: {}", err)]
    FailedToParseConfigFile { err: serde_json::error::Error },

    #[fail(display = "failed to parse module")]
    FailedToParseModule {},

    #[fail(display = "failed to read module: {}", err)]
    FailedToReadModule { err: io::Error },

    #[fail(display = "failed to emit module: {}", err)]
    FailedToEmitModule { err: io::Error },

    #[fail(display = "failed to write sourcemap: {}", err)]
    FailedToWriteSourceMap { err: sourcemap::Error },

    #[fail(display = "sourcemap is not utf8: {}", err)]
    SourceMapNotUtf8 { err: FromUtf8Error },

    #[fail(display = "invalid regexp: {}: {}", regex, err)]
    InvalidRegex { regex: String, err: regex::Error },

    /* #[fail(display = "generated code is not utf8: {}", err)]
     * GeneratedCodeNotUtf8 { err: FromUtf8Error }, */
    /// This means `test` field in .swcrc file did not matched the compiling
    /// file.
    #[fail(display = "unmatched")]
    Unmatched,
}

/// Returns true if `SWC_DEBUG` environment is set to `1` or `true`.
pub(crate) fn debug() -> bool {
    lazy_static! {
        static ref DEBUG: bool = {
            match ::std::env::var("SWC_DEBUG") {
                Ok(ref v) if v == "1" || v.eq_ignore_ascii_case("true") => true,
                _ => false,
            }
        };
    };

    *DEBUG
}
