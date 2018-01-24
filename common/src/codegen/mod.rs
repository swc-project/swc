use std::io::{self, Write};

pub trait ToCode {
    fn to_code<W: Write>(&self, w: W) -> io::Result<()>;
}
