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
    ($emitter:expr, $pattern:expr) => {{
        let span = $pattern.span();
        let pos = if span.is_dummy() {
            swc_common::BytePos::SYNTHESIZED
        } else {
            let delimiter_offset = swc_common::BytePos(if $pattern.optional { 2 } else { 1 });
            match $pattern.type_ann.as_ref() {
                Some(type_ann) if !type_ann.span.is_dummy() => {
                    type_ann.span.lo() - delimiter_offset
                }
                // Replacing the annotation discards the exact delimiter
                // position, so retain the real pattern's mapping instead.
                Some(_) => span.lo(),
                None => span.hi() - delimiter_offset,
            }
        };
        $emitter.wr.add_srcmap(pos)?;
    }};
}

macro_rules! emit_node_inner {
    ($emitter:expr, true, $n:expr) => {
        crate::Node::emit_with(&$n, $emitter)?
    };
}
