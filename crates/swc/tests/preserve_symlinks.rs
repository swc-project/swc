//! Integration test for `jsc.preserveSymlinks`.
//!
//! Exercises the full `swc::Options` pipeline against a symlinked source file,
//! mirroring the low-level check in
//! `swc_ecma_transforms_module::tests::path_node::symlink_paths_are_preserved_only_when_opted_in`.
use std::{
    fs::{create_dir_all, write},
    path::Path,
};

use swc::{
    config::{Config, IsModule, JscConfig, ModuleConfig, Options},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_parser::{Syntax, TsSyntax};
use tempfile::tempdir;
use testing::Tester;

fn create_symlink(target: &Path, link: &Path) {
    #[cfg(unix)]
    {
        std::os::unix::fs::symlink(target, link).unwrap();
    }

    #[cfg(windows)]
    {
        std::os::windows::fs::symlink_file(target, link).unwrap();
    }
}

fn setup_symlink_fixture(root: &Path) {
    create_dir_all(root.join("src")).unwrap();
    create_dir_all(root.join("shared")).unwrap();
    create_dir_all(root.join("server")).unwrap();

    write(root.join("src/index.ts"), "import \"../server/source\";\n").unwrap();
    write(root.join("shared/source.ts"), "export const value = 1;\n").unwrap();

    create_symlink(
        &root.join("shared/source.ts"),
        &root.join("server/source.ts"),
    );
}

fn options_for(root: &Path, preserve_symlinks: bool) -> Options {
    Options {
        swcrc: false,
        filename: root.join("src/index.ts").display().to_string(),
        config: Config {
            jsc: JscConfig {
                syntax: Some(Syntax::Typescript(TsSyntax::default())),
                base_url: root.to_path_buf(),
                preserve_symlinks: preserve_symlinks.into(),
                ..Default::default()
            },
            module: Some(ModuleConfig::Es6(Default::default())),
            is_module: Some(IsModule::Bool(true)),
            ..Default::default()
        },
        ..Default::default()
    }
}

fn compile(index_path: &Path, options: Options) -> String {
    let source = std::fs::read_to_string(index_path).unwrap();
    let index_path = index_path.to_path_buf();

    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(FileName::Real(index_path.clone()).into(), source.clone());
            let result = c.process_js_file(fm, &handler, &options);

            match result {
                Ok(v) if !handler.has_errors() => Ok(v.code),
                _ => Err(()),
            }
        })
        .unwrap()
}

#[test]
fn preserve_symlinks_default_canonicalizes_import() {
    let sandbox = tempdir().unwrap();
    let root = sandbox.path().canonicalize().unwrap();

    setup_symlink_fixture(&root);

    let options = options_for(&root, false);
    let code = compile(&root.join("src/index.ts"), options);

    assert!(
        code.contains("../shared/source"),
        "default should canonicalize to the real path; got:\n{code}"
    );
    assert!(
        !code.contains("../server/source"),
        "default must not leave the symlink path in the output; got:\n{code}"
    );
}

#[test]
fn preserve_symlinks_opt_in_keeps_symlink_import() {
    let sandbox = tempdir().unwrap();
    let root = sandbox.path().canonicalize().unwrap();

    setup_symlink_fixture(&root);

    let options = options_for(&root, true);
    let code = compile(&root.join("src/index.ts"), options);

    assert!(
        code.contains("../server/source"),
        "preserveSymlinks=true should keep the symlink path; got:\n{code}"
    );
    assert!(
        !code.contains("../shared/source"),
        "preserveSymlinks=true must not canonicalize the target; got:\n{code}"
    );
}
