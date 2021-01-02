use std::path::PathBuf;

#[testing::fixture("dce/from-to/**/input.js")]
fn dce_from_to(path: PathBuf) {}

#[testing::fixture("dce/optimized-out/**/*.js")]
fn dce_optimzed_out(path: PathBuf) {}

#[testing::fixture("dce/noop/**/*.js")]
fn dce_noop(path: PathBuf) {}
