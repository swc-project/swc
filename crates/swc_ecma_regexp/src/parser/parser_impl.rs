use super::{
    flags_parser::FlagsParser, pattern_parser::PatternParser, reader::Reader,
    span_factory::SpanFactory,
};
use crate::{
    ast,
    diagnostics::{self, Result},
    options::Options,
};

/// Regular expression parser for `/literal/` usage.
/// - `pattern_text`: the text between `/` and `/`
/// - `flags_text`: the text after the second `/`
pub struct LiteralParser<'a> {
    pattern_text: &'a str,
    flags_text: Option<&'a str>,
    options: Options,
}

impl<'a> LiteralParser<'a> {
    pub fn new(pattern_text: &'a str, flags_text: Option<&'a str>, options: Options) -> Self {
        Self {
            pattern_text,
            flags_text,
            options,
        }
    }

    pub fn parse(self) -> Result<ast::Pattern> {
        let parse_string_literal = false;
        let Options {
            pattern_span_offset,
            flags_span_offset,
        } = self.options;

        let (unicode_mode, unicode_sets_mode) = if let Some(flags_text) = self.flags_text {
            let reader = Reader::initialize(flags_text, true, parse_string_literal)?; // For literal, never expect to throw

            FlagsParser::new(reader, flags_span_offset).parse()?
        } else {
            (false, false)
        };

        let pattern_text = if self.pattern_text.is_empty() {
            "(?:)"
        } else {
            self.pattern_text
        };
        let reader = Reader::initialize(pattern_text, unicode_mode, parse_string_literal)?; // For literal, never expect to throw

        PatternParser::new(
            reader,
            (unicode_mode, unicode_sets_mode),
            pattern_span_offset,
        )
        .parse()
    }
}

/// Regular expression parser for `new RegExp("constrocutor")` usage.
/// - `pattern_text`: the string literal text as 1st argument of `RegExp`
///   constructor
/// - `flags_text`: the string literal text as 2nd argument of `RegExp`
///   constructor
///
/// String literal text should be in the form of `'...'` or `"..."` and may
/// contain escape sequences.
pub struct ConstructorParser<'a> {
    pattern_text: &'a str,
    flags_text: Option<&'a str>,
    options: Options,
}

impl<'a> ConstructorParser<'a> {
    pub fn new(pattern_text: &'a str, flags_text: Option<&'a str>, options: Options) -> Self {
        Self {
            pattern_text,
            flags_text,
            options,
        }
    }

    pub fn parse(self) -> Result<ast::Pattern> {
        let parse_string_literal = true;
        let Options {
            pattern_span_offset,
            flags_span_offset,
        } = self.options;

        let (unicode_mode, unicode_sets_mode) = if let Some(flags_text) = self.flags_text {
            let reader =
                Reader::initialize(flags_text, true, parse_string_literal).map_err(|_| {
                    let span_start = flags_span_offset;
                    #[expect(clippy::cast_possible_truncation)]
                    let span_end = flags_span_offset + flags_text.len() as u32;
                    diagnostics::invalid_input(SpanFactory::span_from_u32(span_start, span_end))
                })?;

            FlagsParser::new(reader, self.options.flags_span_offset).parse()?
        } else {
            (false, false)
        };

        let pattern_text = if matches!(self.pattern_text, r#""""# | "''") {
            r#""(?:)""#
        } else {
            self.pattern_text
        };
        let reader =
            Reader::initialize(pattern_text, unicode_mode, parse_string_literal).map_err(|_| {
                let span_start = pattern_span_offset;
                #[expect(clippy::cast_possible_truncation)]
                let span_end = pattern_span_offset + pattern_text.len() as u32;
                diagnostics::invalid_input(SpanFactory::span_from_u32(span_start, span_end))
            })?;

        PatternParser::new(
            reader,
            (unicode_mode, unicode_sets_mode),
            pattern_span_offset,
        )
        .parse()
    }
}
