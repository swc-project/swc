macro_rules! opt_leading_space {
    ($e:expr) => {
        if let Some(ref e) = $e {
            space!();
            emit!(e);
        }
    };
}

macro_rules! emit {
    ($e:expr) => {{
        ::Node::emit_with(&$e, __cur_emitter!())?;
    }};
}

macro_rules! keyword {
    ($s:expr) => {
        __cur_emitter!().wr.write_keyword($s)?;
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

macro_rules! semi {
    () => {
        punct!(";")
    };
}
