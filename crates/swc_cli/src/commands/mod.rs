use clap::{Parser, Subcommand};

mod bundle;
mod compile;
mod lint;
mod minify;
mod plugin;

pub use bundle::*;
pub use compile::*;
pub use lint::*;
pub use minify::*;
pub use plugin::{PluginScaffoldOptions, PluginSubcommand};

// Set of subcommands supported by the `swc` command.
#[derive(Subcommand)]
pub enum Command {
    /// Commandline utilities for creating, building plugins.
    #[clap(subcommand)]
    Plugin(PluginSubcommand),
    /// Run SWC's transformer.
    Compile(Box<CompileOptions>),
    Bundle(BundleOptions),
    Minify(MinifyOptions),
    Lint(LintOptions),
}

#[derive(Parser)]
#[clap(name = "SWC", version, propagate_version = true)]
pub struct SwcCliOptions {
    #[clap(subcommand)]
    pub command: Command,
}

pub trait CommandRunner {
    fn execute(&self) -> anyhow::Result<()>;
}
