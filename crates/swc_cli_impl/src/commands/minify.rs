use clap::Parser;

#[derive(Parser)]
pub struct MinifyOptions {}

impl super::CommandRunner for MinifyOptions {
    fn execute(&self) -> anyhow::Result<()> {
        unimplemented!("Minify command is not yet implemented")
    }
}
