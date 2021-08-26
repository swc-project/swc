use structopt::StructOpt;

/// Build your plugin using `cargo`.
#[derive(Debug, StructOpt)]
pub struct BuildCommand {
    /// Build for production.
    #[structopt(long)]
    pub release: bool,
}
