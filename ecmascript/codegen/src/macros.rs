macro_rules! opt_leading_space {
    ($e:expr) => {
        if let Some(ref e) = $e {
            space!();
            emit!(e);
        }
    };
}

macro_rules! opt {
    ($e:expr) => {{
        if let Some(ref expr) = $e {
            emit!(expr);
        }
    }};
}

macro_rules! emit {
    ($e:expr) => {{
        ::Node::emit_with(&$e, __cur_emitter!())?;
    }};
}

macro_rules! keyword {
    ($span:expr, $s:expr) => {
        __cur_emitter!().wr.write_keyword(Some($span), $s)?;
    };
    ($s:expr) => {
        __cur_emitter!().wr.write_keyword(None, $s)?;
    };
}

macro_rules! punct {
    (";") => {
        __cur_emitter!().wr.write_semi()?;
    };
    ($s:expr) => {
        __cur_emitter!().wr.write_punct($s)?;
    };
}

macro_rules! operator {
    ($s:expr) => {
        __cur_emitter!().wr.write_operator($s)?;
    };
}

macro_rules! space {
    () => {
        __cur_emitter!().wr.write_space()?;
    };
}

macro_rules! formatting_space {
    () => {
        __cur_emitter!().wr.write_space()?;
    };
}

macro_rules! semi {
    () => {
        punct!(";")
    };
}
