#![deny(warnings)]
#![cfg(feature = "node")]

use std::{
    env::{current_dir, set_current_dir},
    path::PathBuf,
    sync::{Arc, Mutex},
};

use lazy_static::lazy_static;
use swc_common::FileName;
extern crate swc_ecma_loader;
use swc_ecma_loader::{resolve::Resolve, resolvers::node::NodeModulesResolver, TargetEnv};

lazy_static! {
    static ref UPDATE_DIR_MUTEX: Arc<Mutex<()>> = Arc::new(Mutex::new(()));
}

fn inside_directory(dir: &str, callback: fn()) {
    let arc = Arc::clone(&UPDATE_DIR_MUTEX);
    let _lock = arc.lock().expect("could not lock");

    let initial_current_dir = current_dir().unwrap();
    let new_current_dir = format!("{}{}", initial_current_dir.display(), dir);

    set_current_dir(new_current_dir).unwrap();
    callback();
    set_current_dir(initial_current_dir).unwrap();
}

#[test]
fn basic_import() {
    inside_directory("/tests/basic_import", || {
        // Given
        let node_resolver = NodeModulesResolver::new(TargetEnv::Node, Default::default(), true);

        // When
        let resolved = node_resolver
            .resolve(&FileName::Real(PathBuf::from("jquery")), "jquery")
            .expect("should resolve");

        // Expect
        assert_eq!(
            resolved.filename,
            FileName::Real(PathBuf::from("node_modules/jquery/index.js"))
        );
    });
}

#[test]
fn hoisting() {
    inside_directory("/tests/hoisting/packages/app", || {
        // Given
        let node_resolver = NodeModulesResolver::new(TargetEnv::Node, Default::default(), true);

        // When
        let resolved = node_resolver
            .resolve(&FileName::Real(PathBuf::from("jquery")), "jquery")
            .expect("should resolve");

        // Expect
        assert_eq!(
            resolved.filename,
            FileName::Real(PathBuf::from("../../node_modules/jquery/index.js"))
        );
    });
}

#[test]
fn builtin_modules() {
    let node_resolver = NodeModulesResolver::new(TargetEnv::Node, Default::default(), true);

    // When
    let resolved = node_resolver
        .resolve(&FileName::Real(PathBuf::from("index.js")), "path")
        .expect("should resolve");

    // Expect
    assert_eq!(resolved.filename, FileName::Custom("node:path".to_string()));

    // When
    let resolved = node_resolver
        .resolve(&FileName::Real(PathBuf::from("index.js")), "node:path")
        .expect("should resolve");

    // Expect
    assert_eq!(resolved.filename, FileName::Custom("node:path".to_string()));
}

#[test]
fn browser_overwrite() {
    inside_directory("/tests/browser_overwrite", || {
        // Given
        let node_resolver = NodeModulesResolver::new(TargetEnv::Browser, Default::default(), true);

        // When
        let resolved = node_resolver
            .resolve(&FileName::Real(PathBuf::from("jquery")), "jquery")
            .expect("should resolve");

        // Expect
        assert_eq!(
            resolved.filename,
            FileName::Real(PathBuf::from("node_modules/jquery/browser.js"))
        );
    });
}
