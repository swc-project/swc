#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate slog;
extern crate slog_envlogger;
extern crate slog_term;

use slog::{Drain, Logger};
use std::io::{self, Write};

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
