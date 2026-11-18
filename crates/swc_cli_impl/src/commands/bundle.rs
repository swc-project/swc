use clap::Parser;

#[derive(Parser)]
pub struct BundleOptions {}

impl super::CommandRunner for BundleOptions {
    fn execute(&self) -> anyhow::Result<()> {
        unimplemented!("Bundle command is not yet implemented")
    }
}
