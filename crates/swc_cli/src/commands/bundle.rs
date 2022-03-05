use clap::Parser;
use swc_trace_macro::swc_trace;

#[derive(Parser)]
pub struct BundleOptions {}

#[swc_trace]
impl super::CommandRunner for BundleOptions {
    fn execute(&self) -> anyhow::Result<()> {
        unimplemented!("Bundle command is not yet implemented")
    }
}
