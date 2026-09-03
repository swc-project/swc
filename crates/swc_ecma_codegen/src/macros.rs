#![allow(unused)]

macro_rules! opt_leading_space {
    ($emitter:expr, $e:expr) => {
        if let Some(ref e) = $e {
            formatting_space!($emitter);
            emit!($emitter, e);
        }
    };
}

macro_rules! opt {
    ($emitter:expr, $e:expr) => {{
        if let Some(ref expr) = $e {
            emit!($emitter, expr);
        }
    }};
    ($emitter:expr, $e:expr,) => {{
        opt!($emitter, $e)
    }};
}

macro_rules! emit {
    ($emitter:expr, $e:expr) => {{
        crate::Node::emit_with(&$e, $emitter)?;
    }};
}

macro_rules! keyword {
    ($emitter:expr, $span:expr, $s:expr) => {
        $emitter.wr.write_keyword(Some($span), $s)?
    };
    ($emitter:expr, $s:expr) => {
        $emitter.wr.write_keyword(None, $s)?
    };
}

/// Returns true if the punctuation character requires committing a pending
/// semicolon before it (to avoid ASI issues).
#[inline(always)]
pub const fn punct_requires_semi_commit(s: &'static str) -> bool {
    let bytes = s.as_bytes();
    if bytes.len() == 1 {
        let c = bytes[0];
        matches!(
            c,
            b'"' | b'\''
                | b'['
                | b'!'
                | b'/'
                | b'{'
                | b'('
                | b'~'
                | b'-'
                | b'+'
                | b'#'
                | b'`'
                | b'*'
        )
    } else {
        false
    }
}

macro_rules! punct {
    ($emitter:expr, $sp:expr, ";") => {
        $emitter.wr.write_semi(Some($sp))?;
    };
    ($emitter:expr, $sp:expr, $s:expr) => {
        $emitter
            .wr
            .write_punct(Some($sp), $s, crate::macros::punct_requires_semi_commit($s))?;
    };

    ($emitter:expr, ";") => {
        $emitter.wr.write_semi(None)?
    };
    ($emitter:expr, $s:expr) => {
        $emitter
            .wr
            .write_punct(None, $s, crate::macros::punct_requires_semi_commit($s))?
    };
}

macro_rules! operator {
    ($emitter:expr, $sp:expr, $s:expr) => {
        $emitter.wr.write_operator(Some($sp), $s)?;
    };

    ($emitter:expr, $s:expr) => {
        $emitter.wr.write_operator(None, $s)?;
    };
}

macro_rules! space {
    ($emitter:expr) => {
        $emitter.wr.write_space()?
    };
    ($emitter:expr,) => {
        space!($emitter)
    };
}

macro_rules! formatting_space {
    ($emitter:expr) => {
        if !$emitter.cfg.minify {
            $emitter.wr.write_space()?;
        }
    };
    ($emitter:expr,) => {
        formatting_space!($emitter)
    };
}

/// This macro *may* emit a semicolon, if it's required in this context.
macro_rules! formatting_semi {
    ($emitter:expr) => {
        punct!($emitter, ";")
    };
    ($emitter:expr, ) => {
        punct!($emitter, ";")
    };
}

/// This macro *always* emits a semicolon, as it's required by the structure we
/// emit.
macro_rules! semi {
    ($emitter:expr, $sp:expr) => {
        $emitter.wr.write_semi(Some($sp))?;
    };
    ($emitter:expr) => {
        $emitter.wr.write_semi(None)?;
    };
}

///
/// - `srcmap!(true)` for start (span.lo)
/// - `srcmap!(false)` for end (span.hi)
macro_rules! srcmap {
    ($emitter:expr, $n:expr, true) => {{
        let span = $n.span();
        // A synthesized node has no source location, so its boundary is
        // recorded as an explicitly source-less segment instead.
        let pos = if span.is_dummy() {
            swc_common::BytePos::SYNTHESIZED
        } else {
            span.lo()
        };
        $emitter.wr.add_srcmap(pos)?;
    }};
    ($emitter:expr, $n:expr, false) => {
        srcmap!($emitter, $n, false, false)
    };
    ($emitter:expr, $n:expr, false, $subtract:expr) => {
        let span = $n.span();
        // Token writers also use DUMMY_SP when an enclosing real node already
        // supplied the mapping. Only node boundaries convert it to an
        // explicitly source-less segment.
        let pos = if span.is_dummy() {
            swc_common::BytePos::SYNTHESIZED
        } else if $subtract {
            // hi is exclusive
            span.hi() - swc_common::BytePos(1)
        } else {
            span.hi()
        };
        $emitter.wr.add_srcmap(pos)?;
    };
}

/// Emits a source-less boundary only when the owning AST node is synthesized.
///
/// This is used for delimiters that are not at the end of a real node's span,
/// where mapping to `span.hi` would be inaccurate for parsed source.
macro_rules! srcmap_if_dummy {
    ($emitter:expr, $n:expr) => {{
        if $n.span().is_dummy() {
            $emitter.wr.add_srcmap(swc_common::BytePos::SYNTHESIZED)?;
        }
    }};
}

/// Maps a token at a fixed byte offset before a node's exclusive high bound.
///
/// Synthesized nodes retain the source-less behavior of other node boundaries.
macro_rules! srcmap_at_hi_offset {
    ($emitter:expr, $n:expr, $offset:expr) => {{
        let span = $n.span();
        let pos = if span.is_dummy() {
            swc_common::BytePos::SYNTHESIZED
        } else {
            span.hi() - swc_common::BytePos($offset)
        };
        $emitter.wr.add_srcmap(pos)?;
    }};
}

/// Maps a JSX spread attribute's closing brace to its source delimiter.
///
/// The spread expression's span excludes trailing trivia and the closing
/// brace, so a fixed offset from its high bound is not sufficient.
macro_rules! srcmap_for_jsx_spread_close {
    ($emitter:expr, $spread:expr) => {{
        if $emitter.wr.care_about_srcmap() {
            let expr_span = $spread.expr.span();
            let pos = if expr_span.is_dummy() {
                // The expression supplies `SpreadElement`'s high bound, so
                // fall back to the remaining real spread-token span.
                let spread_span = $spread.dot3_token;
                if spread_span.is_dummy() {
                    swc_common::BytePos::SYNTHESIZED
                } else {
                    spread_span.hi()
                }
            } else {
                $crate::macros::jsx_spread_close_pos($emitter.cm.get_code_map(), expr_span.hi())
                    .unwrap_or_else(|| expr_span.hi())
            };
            $emitter.wr.add_srcmap(pos)?;
        }
    }};
}

/// Maps the opening bracket of a TypeScript array type from its source text.
///
/// Trivia is permitted between the brackets, so the opening position cannot be
/// derived from a fixed offset relative to the node's high position.
macro_rules! srcmap_for_array_type_open {
    ($emitter:expr, $array_type:expr) => {{
        if $emitter.wr.care_about_srcmap() {
            let span = $array_type.span();
            let pos = if span.is_dummy() {
                swc_common::BytePos::SYNTHESIZED
            } else {
                let elem_span = $array_type.elem_type.span();
                let search_span = if !elem_span.is_dummy()
                    && span.lo() <= elem_span.hi()
                    && elem_span.hi() <= span.hi()
                {
                    span.with_lo(elem_span.hi())
                } else {
                    span
                };
                $emitter
                    .cm
                    .span_to_snippet(search_span)
                    .ok()
                    .and_then(|snippet| $crate::macros::array_type_open_offset(&snippet))
                    .map_or(span.lo(), |offset| {
                        search_span.lo() + swc_common::BytePos(offset as u32)
                    })
            };
            $emitter.wr.add_srcmap(pos)?;
        }
    }};
}

/// Restores a real owner's mapping when the current output is source-less.
///
/// This is useful for suffixes whose final child is optional or varies by node.
macro_rules! srcmap_for_owner {
    ($emitter:expr, $owner:expr) => {{
        $emitter.wr.add_srcmap_for_owner($owner.span(), false)?;
    }};
}

/// Restores the mapping owned by a separator after an unmapped child.
///
/// A synthesized owner keeps the separator source-less, while a real owner
/// resumes its mapping after the child or one of its descendants cleared it.
macro_rules! srcmap_for_separator {
    ($emitter:expr, $owner:expr, $child:expr) => {{
        let owner_span = $owner.span();
        $emitter
            .wr
            .add_srcmap_for_owner(owner_span, $child.span().is_dummy())?;
    }};
}

/// Maps the closing delimiter of an array or object binding pattern.
///
/// A pattern span also covers its optional marker and type annotation, so its
/// high position does not necessarily point just after the closing delimiter.
macro_rules! srcmap_for_pattern_close {
    ($emitter:expr, $pattern:expr, $delimiter:expr) => {{
        if $emitter.wr.care_about_srcmap() {
            let span = $pattern.span();
            let pos = if span.is_dummy() {
                swc_common::BytePos::SYNTHESIZED
            } else {
                match $pattern.type_ann.as_ref() {
                    Some(type_ann) if !type_ann.span.is_dummy() => {
                        let search_span = span.with_hi(type_ann.span.lo());
                        $emitter
                            .cm
                            .span_to_snippet(search_span)
                            .ok()
                            .and_then(|snippet| {
                                $crate::macros::pattern_close_offset(
                                    &snippet,
                                    $delimiter,
                                    $pattern.optional,
                                )
                            })
                            .map_or(span.lo(), |offset| {
                                span.lo() + swc_common::BytePos(offset as u32)
                            })
                    }
                    // Replacing the annotation discards the suffix boundary,
                    // so retain the real pattern's mapping instead of scanning
                    // into the annotation's original source.
                    Some(_) => span.lo(),
                    None if $pattern.optional => $emitter
                        .cm
                        .span_to_snippet(span)
                        .ok()
                        .and_then(|snippet| {
                            $crate::macros::pattern_close_offset(&snippet, $delimiter, true)
                        })
                        .map_or(span.lo(), |offset| {
                            span.lo() + swc_common::BytePos(offset as u32)
                        }),
                    None => span.hi() - swc_common::BytePos(1),
                }
            };
            $emitter.wr.add_srcmap(pos)?;
        }
    }};
}

/// Finds a pattern's closing delimiter when it is followed only by trivia and
/// an optional marker. Validating the suffix avoids mistaking delimiters inside
/// trailing comments for the pattern delimiter.
pub(crate) fn pattern_close_offset(
    snippet: &str,
    delimiter: char,
    optional: bool,
) -> Option<usize> {
    snippet.match_indices(delimiter).find_map(|(offset, _)| {
        let suffix = &snippet[offset + delimiter.len_utf8()..];
        pattern_suffix_is_trivia(suffix, optional).then_some(offset)
    })
}

/// Finds the opening bracket of the final array-type suffix.
///
/// Validating the remainder avoids treating brackets inside comments or a
/// nested element type as the suffix delimiter.
pub(crate) fn array_type_open_offset(snippet: &str) -> Option<usize> {
    snippet.match_indices('[').find_map(|(offset, _)| {
        let suffix = strip_source_trivia(&snippet[offset + 1..])?;
        let suffix = suffix.strip_prefix(']')?;
        strip_source_trivia(suffix)?.is_empty().then_some(offset)
    })
}

/// Finds a JSX spread attribute's closing brace after expression trivia.
pub(crate) fn jsx_spread_close_pos(
    cm: &dyn swc_common::SourceMapper,
    expr_hi: swc_common::BytePos,
) -> Option<swc_common::BytePos> {
    let file = cm.lookup_char_pos(expr_hi).file;
    let local_offset = (expr_hi - file.start_pos).0 as usize;
    let suffix = file.src.get(local_offset..)?;
    let stripped = strip_source_trivia(suffix)?;

    stripped
        .starts_with('}')
        .then(|| expr_hi + swc_common::BytePos((suffix.len() - stripped.len()) as u32))
}

fn pattern_suffix_is_trivia(mut suffix: &str, optional: bool) -> bool {
    let Some(stripped) = strip_source_trivia(suffix) else {
        return false;
    };
    suffix = stripped;

    if optional {
        let Some(stripped) = suffix.strip_prefix('?') else {
            return false;
        };
        let Some(stripped) = strip_source_trivia(stripped) else {
            return false;
        };
        suffix = stripped;
    }

    suffix.is_empty()
}

fn strip_source_trivia(mut suffix: &str) -> Option<&str> {
    loop {
        suffix = suffix.trim_start_matches(char::is_whitespace);

        if let Some(comment) = suffix.strip_prefix("//") {
            suffix = comment.find(['\r', '\n']).map_or("", |end| &comment[end..]);
            continue;
        }

        if let Some(comment) = suffix.strip_prefix("/*") {
            let end = comment.find("*/")?;
            suffix = &comment[end + 2..];
            continue;
        }

        return Some(suffix);
    }
}

macro_rules! emit_node_inner {
    ($emitter:expr, true, $n:expr) => {
        crate::Node::emit_with(&$n, $emitter)?
    };
}

#[cfg(test)]
mod tests {
    use super::array_type_open_offset;

    #[test]
    fn finds_array_type_opener_before_trivia() {
        assert_eq!(array_type_open_offset("[ ]"), Some(0));
        assert_eq!(array_type_open_offset("[][ /* [ */ ]"), Some(2));
    }
}
