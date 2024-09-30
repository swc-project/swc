#![cfg(feature = "tsc")]

use std::collections::HashMap;

use anyhow::{anyhow, Error};
use swc_common::{collections::AHashMap, FileName};
use swc_ecma_loader::{
    resolve::{Resolution, Resolve},
    resolvers::tsc::TsConfigResolver,
};

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

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("success".into()),
                slug: Some("jquery".into())
            }
        );
    }

    {
        r.resolve(&FileName::Anon, "unrelated")
            .expect_err("should not touch error");
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

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("success-2".into()),
                slug: None
            }
        );
    }

    {
        let resolved = r
            .resolve(&FileName::Anon, "folder2/file3")
            .expect("should resolve");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("success-3".into()),
                slug: None
            }
        );
    }
}

#[test]
fn base_url_works_for_resolves_full_filenames_with_dot_suffix() {
    let mut map = HashMap::default();
    map.insert(
        "./common/folder1/file1.suffix1.ts".to_string(),
        "suffix1".to_string(),
    );
    map.insert(
        "./common/folder2/file2-suffix2.ts".to_string(),
        "suffix2".to_string(),
    );

    let r = TsConfigResolver::new(
        TestResolver(map),
        ".".into(),
        vec![
            (
                "@common/file1-suffix1".into(),
                vec!["common/folder1/file1.suffix1.ts".into()],
            ),
            (
                "@common/file2-suffix2".into(),
                vec!["common/folder2/file2-suffix2.ts".into()],
            ),
        ],
    );

    {
        let resolved = r
            .resolve(&FileName::Anon, "@common/file1-suffix1")
            .expect("should resolve");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("suffix1".into()),
                slug: Some("file1.suffix1".into())
            }
        );
    }

    {
        let resolved = r
            .resolve(&FileName::Anon, "@common/file2-suffix2")
            .expect("should resolve");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("suffix2".into()),
                slug: Some("file2-suffix2".into())
            }
        );
    }
}

#[test]
fn base_url_works_for_bare_specifier() {
    let mut map = HashMap::default();
    map.insert("./src/common/helper".to_string(), "helper".to_string());

    let r = TsConfigResolver::new(
        TestResolver(map),
        ".".into(),
        vec![("@common/*".into(), vec!["src/common/*".into()])],
    );

    {
        let resolved = r
            .resolve(&FileName::Anon, "@common/helper")
            .expect("should resolve");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("helper".into()),
                slug: None
            }
        );
    }

    {
        let resolved = r
            .resolve(&FileName::Anon, "src/common/helper")
            .expect("should resolve");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("helper".into()),
                slug: None
            }
        );
    }

    {
        let resolved = r
            .resolve(&FileName::Anon, "./src/common/helper")
            .expect("should resolve");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("helper".into()),
                slug: None
            }
        );
    }
}

#[test]
fn base_url_precedence() {
    let mut map = HashMap::default();
    map.insert("./jquery".to_string(), "jq in base url".to_string());
    map.insert("jquery".to_string(), "jq in node module".to_string());
    map.insert("react".to_string(), "react in node module".to_string());

    let r = TsConfigResolver::new(TestResolver(map), ".".into(), Vec::new());

    {
        let resolved = r
            .resolve(&FileName::Anon, "jquery")
            .expect("should resolve from base url");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("jq in base url".into()),
                slug: None
            }
        );
    }

    {
        let resolved = r
            .resolve(&FileName::Anon, "react")
            .expect("should resolve from node modules");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("react in node module".into()),
                slug: None
            }
        );
    }
}

#[test]
fn pattern_length_precedence() {
    let mut map = HashMap::default();
    map.insert(
        "./packages/helpers/src/hello".to_string(),
        "good".to_string(),
    );

    let r = TsConfigResolver::new(
        TestResolver(map),
        ".".into(),
        vec![
            ("@app/*".into(), vec!["./packages/*/src".into()]),
            (
                "@app/helpers/*".into(),
                vec!["./packages/helpers/src/*".into()],
            ),
        ],
    );

    {
        let resolved = r
            .resolve(&FileName::Anon, "@app/helpers/hello")
            .expect("should resolve @app/helpers/hello");

        assert_eq!(
            resolved,
            Resolution {
                filename: FileName::Custom("good".into()),
                slug: None
            }
        );
    }
}

struct TestResolver(AHashMap<String, String>);

impl Resolve for TestResolver {
    fn resolve(&self, _: &FileName, src: &str) -> Result<Resolution, Error> {
        let src = src.replace('\\', "/");

        self.0
            .get(&src)
            .cloned()
            .map(FileName::Custom)
            .map(|v| Resolution {
                filename: v,
                slug: None,
            })
            .ok_or_else(|| anyhow!("failed to resolve `{}`", src))
    }
}
