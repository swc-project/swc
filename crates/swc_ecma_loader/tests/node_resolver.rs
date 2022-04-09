#![cfg(feature = "node")]

use std::{
    collections::HashMap,
    env::{current_dir, set_current_dir},
    path::PathBuf,
};

use anyhow::{anyhow, Error};
use swc_common::{collections::AHashMap, FileName};
extern crate swc_ecma_loader;
use swc_ecma_loader::{resolve::Resolve, resolvers::node::NodeModulesResolver, TargetEnv};

fn set_test_directory(dir: &str) {
    if let Ok(current_directory) = current_dir() {
        let path = format!("{}{}", current_directory.display(), dir);
        set_current_dir(path);
    }
}

#[test]
fn basic_import() {
    // Given
    set_test_directory("/tests/basic_import");
    let node_resolver = NodeModulesResolver::new(TargetEnv::Node, Default::default(), true);

    // When
    let resolved = node_resolver
        .resolve(&FileName::Real(PathBuf::from(&"jquery")), &"jquery")
        .expect("should resolve");

    // Expect
    assert_eq!(
        resolved,
        FileName::Real(PathBuf::from("node_modules/jquery/index.js"))
    );
}

#[test]
fn hoisting() {
    // Given
    set_test_directory("/tests/hoisting/packages/app");
    let node_resolver = NodeModulesResolver::new(TargetEnv::Node, Default::default(), true);

    // When
    let resolved = node_resolver
        .resolve(&FileName::Real(PathBuf::from(&"jquery")), &"jquery")
        .expect("should resolve");

    // Expect
    assert_eq!(
        resolved,
        FileName::Real(PathBuf::from("../../node_modules/jquery/index.js"))
    );
}
