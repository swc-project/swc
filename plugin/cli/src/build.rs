use structopt::StructOpt;

#[derive(Debug, StructOpt)]
pub struct BuildCommand {
    /// Build for production.
    #[structopt(long)]
    pub release: bool,
}
