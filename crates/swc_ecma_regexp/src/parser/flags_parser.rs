use rustc_hash::FxHashSet;

use crate::{
    diagnostics::{self, Result},
    parser::{reader::Reader, span_factory::SpanFactory},
};

pub struct FlagsParser<'a> {
    reader: Reader<'a>,
    span_factory: SpanFactory,
}

impl<'a> FlagsParser<'a> {
    pub fn new(reader: Reader<'a>, span_offset: u32) -> Self {
        Self {
            reader,
            span_factory: SpanFactory::new(span_offset),
        }
    }

    /// Returns: (is_unicode_mode, is_unicode_sets_mode)
    pub fn parse(mut self) -> Result<(bool, bool)> {
        let mut is_unicode_mode = false;
        let mut is_unicode_sets_mode = false;
        let mut unique_flags = FxHashSet::default();

        while let Some(cp) = self.reader.peek() {
            let span_start = self.reader.offset();
            self.reader.advance();
            let span_end = self.reader.offset();

            if unique_flags.contains(&cp) {
                return Err(diagnostics::duplicated_flags(
                    self.span_factory.create(span_start, span_end),
                    &self.reader.atom(span_start, span_end),
                ));
            }
            if char::try_from(cp).map_or(true, |c| {
                !matches!(c, 'd' | 'g' | 'i' | 'm' | 's' | 'u' | 'v' | 'y')
            }) {
                return Err(diagnostics::unknown_flag(
                    self.span_factory.create(span_start, span_end),
                    &self.reader.atom(span_start, span_end),
                ));
            }

            if cp == 'u' as u32 {
                if unique_flags.contains(&('v' as u32)) {
                    return Err(diagnostics::invalid_unicode_flags(
                        self.span_factory.create(span_start, span_end),
                    ));
                }
                is_unicode_mode = true;
            }
            if cp == 'v' as u32 {
                if unique_flags.contains(&('u' as u32)) {
                    return Err(diagnostics::invalid_unicode_flags(
                        self.span_factory.create(span_start, span_end),
                    ));
                }
                is_unicode_mode = true;
                is_unicode_sets_mode = true;
            }

            unique_flags.insert(cp);
        }

        Ok((is_unicode_mode, is_unicode_sets_mode))
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn should_pass() {
        for (flags_text, expected) in &[
            ("", (false, false)),
            ("i", (false, false)),
            ("u", (true, false)),
            ("v", (true, true)),
            ("vg", (true, true)),
        ] {
            let reader = Reader::initialize(flags_text, true, false).unwrap();
            let result = FlagsParser::new(reader, 0).parse().unwrap();
            assert_eq!(result, *expected);
        }
    }

    #[test]
    fn should_fail() {
        for flags_text in &["uv", "vu", "uu", "vv", "gg", "$"] {
            let reader = Reader::initialize(flags_text, true, false).unwrap();
            let err = FlagsParser::new(reader, 0).parse();
            assert!(err.is_err());
            // println!("{:?}", err.unwrap_err().with_source_code(*flags_text));
        }
        for flags_text in &[r#""uv""#, "'V'", "\"-\"", r#""\162""#] {
            let reader = Reader::initialize(flags_text, true, true).unwrap();
            let err = FlagsParser::new(reader, 0).parse();
            assert!(err.is_err());
            // println!("{:?}", err.unwrap_err().with_source_code(*flags_text));
        }
    }

    #[test]
    fn string_literal() {
        for reader in [
            Reader::initialize("u", true, false).unwrap(),
            Reader::initialize("'u'", true, true).unwrap(),
            Reader::initialize(r#""\165""#, true, true).unwrap(),
            Reader::initialize(r#""\x75""#, true, true).unwrap(),
            Reader::initialize(r#""\u0075""#, true, true).unwrap(),
            Reader::initialize(r#""\u{0075}""#, true, true).unwrap(),
        ] {
            let result = FlagsParser::new(reader, 0).parse().unwrap();
            assert_eq!(result, (true, false));
        }
    }
}
