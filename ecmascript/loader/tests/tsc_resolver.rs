#![cfg(feature = "tsc")]

use anyhow::{anyhow, Error};
use std::collections::HashMap;
use swc_common::{collections::AHashMap, FileName};
use swc_ecma_loader::{resolve::Resolve, resolvers::tsc::TsConfigResolver};

#[test]
fn base_dir_exact() {}

#[test]
fn base_dir_wildcard() {}

#[test]
fn exact() {
    let mut map = HashMap::default();
    map.insert("jquery".to_string(), "fail".to_string());
    map.insert(
        "./node_modules/jquery/dist/jquery".to_string(),
        "success".to_string(),
    );
    let r = TsConfigResolver::new(
        TestResolver(map),
        ".".into(),
        vec![(
            "jquery".into(),
            vec!["node_modules/jquery/dist/jquery".into()],
        )],
    );

    {
        let resolved = r
            .resolve(&FileName::Anon, "jquery")
            .expect("should resolve");

        assert_eq!(resolved, FileName::Custom("success".into()));
    }

    {
        let err = r
            .resolve(&FileName::Anon, "unrelated")
            .expect_err("should not touch error");

        assert!(
            err.source().is_none(),
            "should not touch error if src is not related"
        );
    }
}

#[test]
fn pattern_1() {
    let mut map = HashMap::default();
    map.insert("./folder1/file1".to_string(), "success-1".to_string());
    map.insert("./folder1/file2".to_string(), "success-2".to_string());
    map.insert(
        "./generated/folder2/file3".to_string(),
        "success-3".to_string(),
    );

    let r = TsConfigResolver::new(
        TestResolver(map),
        ".".into(),
        vec![("*".into(), vec!["*".into(), "generated/*".into()])],
    );

    {
        let resolved = r
            .resolve(&FileName::Anon, "folder1/file2")
            .expect("should resolve");

        assert_eq!(resolved, FileName::Custom("success-2".into()));
    }

    {
        let resolved = r
            .resolve(&FileName::Anon, "folder2/file3")
            .expect("should resolve");

        assert_eq!(resolved, FileName::Custom("success-3".into()));
    }
}

struct TestResolver(AHashMap<String, String>);

impl Resolve for TestResolver {
    fn resolve(&self, _: &FileName, src: &str) -> Result<FileName, Error> {
        self.0
            .get(src)
            .cloned()
            .map(FileName::Custom)
            .ok_or_else(|| anyhow!("failed to resolve `{}`", src))
    }
}
