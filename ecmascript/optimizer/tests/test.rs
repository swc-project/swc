use std::path::PathBuf;

use swc_ecma_optimizer::OptimizerConfig;

#[testing::fixture("dce/from-to/**/input.js")]
fn dce_from_to(path: PathBuf) {}

#[testing::fixture("dce/optimized-out/**/*.js")]
fn dce_optimzed_out(path: PathBuf) {
    run_test(
        path,
        Mode::OptimziedOut,
        OptimizerConfig {
            dce: true,
            ..Default::default()
        },
    );
}

#[testing::fixture("dce/noop/**/*.js")]
fn dce_noop(path: PathBuf) {
    run_test(
        path,
        Mode::Noop,
        OptimizerConfig {
            dce: true,
            ..Default::default()
        },
    );
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Mode {
    /// `from-to`
    Match(PathBuf),
    Noop,
    OptimziedOut,
}

fn run_test(input: PathBuf, mode: Mode, config: OptimizerConfig) {}
