#![deny(unused)]

use std::path::PathBuf;
use testing_macros::fixture;

#[fixture("tests/simple/*.ts")]
fn simple(_path: PathBuf) {}

#[fixture("tests/ignore/**/*.ts")]
fn ignored(_path: PathBuf) {}

#[fixture("tests/simple/**/*.ts")]
#[fixture("tests/simple/**/*.tsx")]
fn multiple(_path: PathBuf) {}

#[fixture("tests/simple/**/*", exclude(".*\\.tsx", ".*.d\\.ts"))]
fn exclude(_path: PathBuf) {}
