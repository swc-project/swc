use clap::{Parser, Subcommand};

mod compile;
mod plugin;

pub use compile::*;
pub use plugin::{PluginScaffoldOptions, PluginSubcommand};

// Set of subcommands supported by the `swc` command.
#[derive(Subcommand)]
pub enum Command {
    /// Commandline utilities for creating, building plugins.
    #[clap(subcommand)]
    Plugin(PluginSubcommand),
    /// Run SWC's transformer.
    Compile(Box<CompileOptions>),
}

#[derive(Parser)]
#[clap(name = "SWC", version, propagate_version = true)]
pub struct SwcCliOptions {
    #[clap(subcommand)]
    pub command: Command,
}

pub trait CommandRunner {
    fn execute(&self) -> anyhow::Result<()>;
    fn execute_inner(&self) -> anyhow::Result<()>;
}
