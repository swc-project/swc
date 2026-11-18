use clap::Parser;

/// Command line options for the SWC AST explorer.
#[derive(Debug, Parser)]
#[clap(author, version, about, long_about = None)]
pub struct Args {
    /// Whether to keep Span (location) markers.
    #[clap(long, value_parser, default_value_t = false)]
    pub spans: bool,
}
