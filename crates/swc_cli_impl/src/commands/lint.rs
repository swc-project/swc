use clap::Parser;

#[derive(Parser)]
pub struct LintOptions {}

impl super::CommandRunner for LintOptions {
    fn execute(&self) -> anyhow::Result<()> {
        unimplemented!("Lint command is not yet implemented")
    }
}
