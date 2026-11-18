//! Fixed-width edit planning and rendering.

use std::borrow::Cow;

use swc_common::{BytePos, Span};

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum FixedSubstitution {
    Semicolon,
    LeftParenthesis,
    RightParenthesis,
}

impl FixedSubstitution {
    fn character(self) -> char {
        match self {
            Self::Semicolon => ';',
            Self::LeftParenthesis => '(',
            Self::RightParenthesis => ')',
        }
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum Operation {
    Blank(Span),
    Substitute {
        span: Span,
        replacement: FixedSubstitution,
    },
}

impl Operation {
    fn span(self) -> Span {
        match self {
            Self::Blank(span) | Self::Substitute { span, .. } => span,
        }
    }
}

#[derive(Debug, Default)]
pub(crate) struct EditPlan {
    operations: Vec<Operation>,
}

impl EditPlan {
    pub(crate) fn blank(&mut self, span: Span) {
        assert!(span.lo <= span.hi, "invalid edit span: {span:?}");
        if span.lo != span.hi {
            self.operations.push(Operation::Blank(span));
        }
    }

    pub(crate) fn substitute(&mut self, span: Span, replacement: FixedSubstitution) {
        assert!(span.lo < span.hi, "invalid substitution span: {span:?}");
        self.operations
            .push(Operation::Substitute { span, replacement });
    }

    #[cfg(test)]
    fn substitute_byte(&mut self, offset: BytePos, replacement: FixedSubstitution) {
        self.substitute(Span::new(offset, offset + BytePos(1)), replacement);
    }

    pub(crate) fn render<'source>(
        mut self,
        source_start: BytePos,
        source: &'source str,
    ) -> Cow<'source, str> {
        if self.operations.is_empty() {
            return Cow::Borrowed(source);
        }

        let operations = normalize_operations(&mut self.operations);
        let mut output = String::with_capacity(source.len());
        let mut copied_until = 0;

        for operation in operations {
            let span = operation.span();
            let start = (span.lo - source_start).0 as usize;
            let end = (span.hi - source_start).0 as usize;
            assert!(
                end <= source.len(),
                "edit span is outside the source: {span:?}"
            );
            assert!(
                source.is_char_boundary(start) && source.is_char_boundary(end),
                "edit span does not follow UTF-8 character boundaries: {span:?}"
            );

            output.push_str(&source[copied_until..start]);
            match operation {
                Operation::Blank(_) => push_blank(&mut output, &source[start..end]),
                Operation::Substitute { replacement, .. } => {
                    push_substitution(&mut output, &source[start..end], replacement);
                }
            }
            copied_until = end;
        }

        output.push_str(&source[copied_until..]);
        Cow::Owned(output)
    }
}

fn normalize_operations(operations: &mut [Operation]) -> Vec<Operation> {
    operations.sort_unstable_by_key(|operation| {
        let span = operation.span();
        let is_substitution = matches!(operation, Operation::Substitute { .. });
        (span.lo, is_substitution, span.hi)
    });

    let mut normalized = Vec::with_capacity(operations.len());
    let mut active_blank: Option<Span> = None;
    let mut previous_substitution: Option<(Span, FixedSubstitution)> = None;

    for operation in operations.iter().copied() {
        match operation {
            Operation::Blank(mut span) => {
                if let Some((substitution, _)) =
                    previous_substitution.filter(|(substitution, _)| {
                        span.lo < substitution.hi && span.hi > substitution.lo
                    })
                {
                    if span.hi <= substitution.hi {
                        continue;
                    }
                    span.lo = substitution.hi;
                }

                if let Some(active) = &mut active_blank {
                    if span.lo <= active.hi {
                        active.hi = active.hi.max(span.hi);
                    } else {
                        normalized.push(Operation::Blank(*active));
                        *active = span;
                    }
                } else {
                    active_blank = Some(span);
                }
            }
            Operation::Substitute { span, replacement } => {
                if let Some((previous_span, previous_replacement)) = previous_substitution {
                    if previous_span.lo == span.lo {
                        assert_eq!(previous_span, span, "conflicting substitution spans");
                        assert_eq!(
                            previous_replacement, replacement,
                            "conflicting substitutions"
                        );
                        continue;
                    }
                    assert!(
                        previous_span.hi <= span.lo,
                        "overlapping substitutions are not supported"
                    );
                }

                if let Some(blank) = active_blank {
                    if blank.hi <= span.lo {
                        normalized.push(Operation::Blank(blank));
                        active_blank = None;
                    } else {
                        if blank.lo < span.lo {
                            normalized.push(Operation::Blank(Span::new(blank.lo, span.lo)));
                        }
                        active_blank = (blank.hi > span.hi)
                            .then(|| Span::new(blank.lo.max(span.hi), blank.hi));
                    }
                }

                normalized.push(operation);
                previous_substitution = Some((span, replacement));
            }
        }
    }

    if let Some(blank) = active_blank {
        normalized.push(Operation::Blank(blank));
    }

    normalized
}

const HIGH_BITS: u64 = 0x8080_8080_8080_8080;

/// Blank edited text without changing UTF-16 offsets or line terminators.
fn push_blank(output: &mut String, mut source: &str) {
    while !source.is_empty() {
        if let Some(bytes) = source.as_bytes().get(..8) {
            let word = u64::from_le_bytes(bytes.try_into().expect("eight-byte slice"));
            if word & HIGH_BITS == 0 {
                // Each lane is ASCII, so these additions cannot carry between bytes.
                let below = !(word + 0x7777_7777_7777_7777) & HIGH_BITS;
                let above = (word + 0x7272_7272_7272_7272) & HIGH_BITS;
                let blank = ((below | above) >> 7) * 0xff;
                let bytes = ((word & !blank) | (0x2020_2020_2020_2020 & blank)).to_le_bytes();
                // SAFETY: Each byte is preserved ASCII whitespace or an ASCII space.
                output.push_str(unsafe { std::str::from_utf8_unchecked(&bytes) });
                source = &source[8..];
                continue;
            }
        }
        let character = source.chars().next().expect("nonempty source");
        if is_ecmascript_whitespace_or_line_terminator(character) {
            output.push(character);
        } else {
            output.extend(std::iter::repeat(' ').take(character.len_utf16()));
        }
        source = &source[character.len_utf8()..];
    }
}

fn push_substitution(output: &mut String, source: &str, replacement: FixedSubstitution) {
    let replaced_width = source.encode_utf16().count();
    assert!(replaced_width > 0, "cannot substitute an empty span");
    output.push(replacement.character());
    output.extend(std::iter::repeat(' ').take(replaced_width - 1));
}

fn is_ecmascript_whitespace_or_line_terminator(character: char) -> bool {
    matches!(
        character,
        '\u{0009}'
            | '\u{000A}'
            | '\u{000B}'
            | '\u{000C}'
            | '\u{000D}'
            | '\u{0020}'
            | '\u{00A0}'
            | '\u{1680}'
            | '\u{2000}'
            ..='\u{200A}'
                | '\u{2028}'
                | '\u{2029}'
                | '\u{202F}'
                | '\u{205F}'
                | '\u{3000}'
                | '\u{FEFF}'
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    fn span(start: u32, end: u32) -> Span {
        Span::new(BytePos(start), BytePos(end))
    }

    #[test]
    fn no_edits_returns_borrowed_source() {
        let source = "const value = 1;";
        let output = EditPlan::default().render(BytePos(0), source);

        assert!(matches!(output, Cow::Borrowed(value) if value == source));
    }

    #[test]
    fn blank_replaces_code_with_spaces() {
        let source = "let value: number = 1;";
        let mut edits = EditPlan::default();
        edits.blank(span(9, 17));
        let output = edits.render(BytePos(0), source);

        assert_eq!(output, "let value         = 1;");
    }

    #[test]
    fn blank_preserves_ecmascript_whitespace_and_line_terminators() {
        let source = ":\tA\r\nB\u{2028}C\u{2029}D\u{00A0}";
        let mut edits = EditPlan::default();
        edits.blank(span(0, source.len() as u32));
        let output = edits.render(BytePos(0), source);

        assert_eq!(output, " \t \r\n \u{2028} \u{2029} \u{00A0}");
    }

    #[test]
    fn blank_preserves_ascii_whitespace_in_vector_chunks() {
        let source: String = (0u8..=127).map(char::from).collect();
        let mut output = String::with_capacity(source.len());
        push_blank(&mut output, &source);
        let expected: String = source
            .chars()
            .map(|character| match character {
                '\t'..='\r' | ' ' => character,
                _ => ' ',
            })
            .collect();

        assert_eq!(output, expected);
    }

    #[test]
    fn blank_preserves_ascii_whitespace_in_word_tail() {
        let source: String = (0u8..=127).map(char::from).collect();
        let mut output = String::with_capacity(source.len());
        for chunk in source.as_bytes().chunks(11) {
            push_blank(&mut output, std::str::from_utf8(chunk).unwrap());
        }
        let expected: String = source
            .chars()
            .map(|character| match character {
                '\t'..='\r' | ' ' => character,
                _ => ' ',
            })
            .collect();

        assert_eq!(output, expected);
    }

    #[test]
    fn blank_preserves_utf16_width_for_bmp_and_astral_code_points() {
        let source = ": 文𐀀";
        let mut edits = EditPlan::default();
        edits.blank(span(0, source.len() as u32));
        let output = edits.render(BytePos(0), source);

        assert_eq!(output, "     ");
        assert_eq!(output.encode_utf16().count(), source.encode_utf16().count());
    }

    #[test]
    fn overlapping_blanks_are_merged() {
        let source = "abcdef";
        let mut edits = EditPlan::default();
        edits.blank(span(1, 4));
        edits.blank(span(3, 5));
        let output = edits.render(BytePos(0), source);

        assert_eq!(output, "a    f");
    }

    #[test]
    fn substitution_wins_over_overlapping_blanks() {
        let source = "abstract [key]: Type";
        let mut edits = EditPlan::default();
        edits.blank(span(0, 8));
        edits.blank(span(4, 15));
        edits.substitute_byte(BytePos(0), FixedSubstitution::Semicolon);
        let output = edits.render(BytePos(0), source);

        assert_eq!(output, ";               Type");
    }

    #[test]
    fn substitution_preserves_utf16_width() {
        let source = "value as 类型𝒳";
        let start = source.len() - "𝒳".len();
        let mut edits = EditPlan::default();
        edits.blank(span(5, source.len() as u32));
        edits.substitute(
            span(start as u32, source.len() as u32),
            FixedSubstitution::RightParenthesis,
        );
        let output = edits.render(BytePos(0), source);

        assert_eq!(output, "value      ) ");
        assert_eq!(output.encode_utf16().count(), source.encode_utf16().count());
    }
}
