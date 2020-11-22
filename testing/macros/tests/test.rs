use std::path::PathBuf;
use testing_macros::fixture;

#[fixture("simple/*.ts")]
fn simple(_path: PathBuf) {}

#[fixture("ignore/**/*.ts")]
fn ignored(_path: PathBuf) {}

#[fixture("simple/**/*.ts")]
#[fixture("simple/**/*.tsx")]
fn multiple(_path: PathBuf) {}

#[fixture("simple/**/*", exclude(".*\\.tsx", ".*.d\\.ts"))]
fn exlucde(_path: PathBuf) {}
