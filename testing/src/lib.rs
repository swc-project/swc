#![feature(specialization)]

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate slog;
extern crate slog_envlogger;
extern crate slog_term;
extern crate swc_common;

use slog::{Drain, Logger};
use std::io::{self, Write};
use swc_common::Span;
use swc_common::fold::{FoldWith, Folder};

pub fn logger() -> Logger {
    fn no_timestamp(_: &mut Write) -> io::Result<()> {
        Ok(())
    }
    fn root() -> Logger {
        let dec = slog_term::TermDecorator::new()
            .force_color()
            .stderr()
            .build();
        let drain = slog_term::FullFormat::new(dec)
            .use_custom_timestamp(no_timestamp)
            .build();
        let drain = slog_envlogger::new(drain);
        let drain = std::sync::Mutex::new(drain).fuse();
        let logger = Logger::root(drain, o!());

        logger
    }

    lazy_static! {
        static ref ROOT: Logger = { root() };
    };

    // hack for cargo test
    println!("");
    root()
    // ROOT.new(o!())
}

/// Remove all span from `t`.
pub fn drop_span<T>(t: T) -> T
where
    T: FoldWith<DropSpan>,
{
    Folder::<T>::fold(&mut DropSpan, t)
}
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DropSpan;
impl Folder<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        Span::default()
    }
}

#[macro_export]
macro_rules! assert_eq_ignore_span {
    ($l:expr, $r:expr) => {{
        assert_eq!($crate::drop_span($l), $crate::drop_span($r))
    }}
}
