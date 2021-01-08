#![feature(test)]

extern crate test;

use crate::common::with_ts_parser;
use std::{fs::File, io::Read, path::PathBuf};

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("typescript-errors/**/*.ts")]
fn errors(file: PathBuf) {
    let file_name = file.display().to_string();

    {
        let input = {
            let mut buf = String::new();
            File::open(&file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!(
            "\n\n========== Running reference test {}\nSource:\n{}\n",
            file_name, input
        );
    }

    let module = with_ts_parser(false, &file, false, |p| p.parse_typescript_module());

    let err = module.expect_err("should fail, but parsed as");
    if err
        .compare_to_file(format!("{}.stderr", file.display()))
        .is_err()
    {
        panic!()
    }
}
