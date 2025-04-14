#![allow(unused)]

macro_rules! opt_leading_space {
    ($emitter:expr, $e:expr) => {
        if let Some(ref e) = $e {
            formatting_space!($emitter);
            emit!(emitter, $emitter, e);
        }
    };
}

macro_rules! opt {
    ($emitter:expr, $e:expr) => {{
        if let Some(ref expr) = $e {
            emit!(emitter, $emitter, expr);
        }
    }};
    ($emitter:expr, $e:expr,) => {{
        opt!($emitter, $e)
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

macro_rules! punct {
    ($emitter:expr, $sp:expr, ";") => {
        $emitter.wr.write_semi(Some($sp))?;
    };
    ($emitter:expr, $sp:expr, $s:expr) => {
        $emitter.wr.write_punct(Some($sp), $s)?;
    };

    ($emitter:expr, ";") => {
        $emitter.wr.write_semi(None)?
    };
    ($emitter:expr, $s:expr) => {
        $emitter.wr.write_punct(None, $s)?
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
        let lo = $n.span_lo();
        if !lo.is_dummy() {
            $emitter.wr.add_srcmap(lo)?;
        }
    }};
    ($emitter:expr, $n:expr, false) => {
        srcmap!($emitter, $n, false, false)
    };
    ($emitter:expr, $n:expr, false, $subtract:expr) => {
        let hi = $n.span_hi();
        if !hi.is_dummy() {
            if $subtract {
                // hi is exclusive
                $emitter.wr.add_srcmap(hi - swc_common::BytePos(1))?;
            } else {
                // TODO(kdy1): Remove this branch.
                $emitter.wr.add_srcmap(hi)?;
            }
        }
    };
}

macro_rules! emit {
    (true, $emitter:expr, $n:ident) => {
        crate::Node::emit_with($n, $emitter)?
    };
    (true, $emitter:expr, $n:expr) => {
        crate::Node::emit_with(&$n, $emitter)?
    };

    (false, $emitter:expr, $n:ident) => {
        crate::Node::with_new_span($n, $emitter)?
    };

    (false, $emitter:expr, $n:expr) => {
        crate::Node::with_new_span(&$n, $emitter)?
    };
}

macro_rules! only_new {
    (true, $n:expr) => {
        ()
    };

    (false, $n:expr) => {
        $n
    };
}
