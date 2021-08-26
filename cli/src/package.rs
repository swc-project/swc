use structopt::StructOpt;

#[derive(Debug, StructOpt)]
pub struct PackageCommand {
    /// Build for production.
    #[structopt(long)]
    pub release: bool,
}
