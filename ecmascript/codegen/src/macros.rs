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
        $emitter.wr.write_keyword(Some($span), $s)?;
    };
    ($emitter:expr, $s:expr) => {
        $emitter.wr.write_keyword(None, $s)?;
    };
}

macro_rules! punct {
    ($emitter:expr, ";") => {
        $emitter.wr.write_semi()?;
    };
    ($emitter:expr, $s:expr) => {
        $emitter.wr.write_punct($s)?;
    };
}

macro_rules! operator {
    ($emitter:expr, $s:expr) => {
        $emitter.wr.write_operator($s)?;
    };
}

macro_rules! space {
    ($emitter:expr) => {
        $emitter.wr.write_space()?;
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
    ($emitter:expr) => {
        $emitter.wr.write_punct(";")?;
    };
    ($emitter:expr, ) => {
        $emitter.wr.write_punct(";")?;
    };
}
