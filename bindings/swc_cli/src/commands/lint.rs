use clap::Parser;
use swc_core::trace_macro::swc_trace;

#[derive(Parser)]
pub struct LintOptions {}

#[swc_trace]
impl super::CommandRunner for LintOptions {
    fn execute(&self) -> anyhow::Result<()> {
        unimplemented!("Lint command is not yet implemented")
    }
}
