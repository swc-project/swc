use clap::Parser;
use swc_trace_macro::swc_trace;

#[derive(Parser)]
pub struct MinifyOptions {}

#[swc_trace]
impl super::CommandRunner for MinifyOptions {
    fn execute(&self) -> anyhow::Result<()> {
        unimplemented!("Minify command is not yet implemented")
    }
}
