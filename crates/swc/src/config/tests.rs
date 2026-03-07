#[cfg(feature = "module")]
use swc_common::FileName;

#[cfg(feature = "module")]
use super::ModuleConfig;
use crate::parse_swcrc;

#[test]
fn object() {
    let rc = parse_swcrc(include_str!("object.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn array() {
    let rc = parse_swcrc(include_str!("array.json")).expect("failed to parse");

    dbg!(&rc);
}

#[test]
fn issue_4390() {
    let rc = parse_swcrc(include_str!("issue-4390.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn jsonc() {
    let rc = parse_swcrc(include_str!("jsonc.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn issue_6996() {
    let rc = parse_swcrc(include_str!("issue-6996.json")).expect("failed to parse");
    dbg!(&rc);
}

#[cfg(feature = "module")]
#[test]
fn issue_11584_relative_base_is_rebased_against_base_url() {
    use std::{
        env, fs,
        path::PathBuf,
        time::{SystemTime, UNIX_EPOCH},
    };

    let uniq = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("clock should be monotonic")
        .as_nanos();
    let tmp_root = env::temp_dir().join(format!("swc-issue-11584-{}-{}", std::process::id(), uniq));
    let base_url = tmp_root.join("project");

    fs::create_dir_all(base_url.join("src")).expect("should create fixture directories");
    fs::write(
        base_url.join("src").join("foo.ts"),
        "export const foo = 1;\n",
    )
    .expect("should create fixture file");

    let base = FileName::Real(PathBuf::from("virtual/index.ts"));
    let paths = vec![("@app/*".to_string(), vec!["src/*".to_string()])];

    let (normalized_base, resolver) = ModuleConfig::get_resolver(&base_url, paths, &base, None)
        .expect("resolver should be created");

    let base_path = match &normalized_base {
        FileName::Real(path) => path,
        other => panic!("unexpected base filename: {other:?}"),
    };
    assert!(
        !base_path.is_absolute(),
        "relative input filename should stay relative so resolver can rebase against jsc.baseUrl"
    );

    let resolved = resolver
        .resolve_import(&normalized_base, "@app/foo")
        .expect("import should resolve");
    assert_eq!(
        &*resolved, "../src/foo",
        "resolved import should stay in the jsc.baseUrl path space"
    );

    let _ = fs::remove_dir_all(&tmp_root);
}

#[cfg(all(feature = "module", target_os = "windows"))]
#[test]
fn issue_11584_windows_absolute_base_is_unc() {
    use std::{
        env, fs,
        time::{SystemTime, UNIX_EPOCH},
    };

    let uniq = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("clock should be monotonic")
        .as_nanos();
    let tmp_root = env::temp_dir().join(format!(
        "swc-issue-11584-win-{}-{}",
        std::process::id(),
        uniq
    ));
    let base_url = tmp_root.join("project");
    let src_dir = base_url.join("src");
    let entry = src_dir.join("index.ts");

    fs::create_dir_all(&src_dir).expect("should create fixture directories");
    fs::write(&entry, "export const value = 1;\n").expect("should create fixture file");

    let base = FileName::Real(entry);
    let paths = vec![("@app/*".to_string(), vec!["src/*".to_string()])];
    let (normalized_base, _) = ModuleConfig::get_resolver(&base_url, paths, &base, None)
        .expect("resolver should be created");

    let normalized_path = match &normalized_base {
        FileName::Real(path) => path,
        other => panic!("unexpected base filename: {other:?}"),
    };

    let is_unc = matches!(
        normalized_path.components().next(),
        Some(std::path::Component::Prefix(prefix))
            if matches!(
                prefix.kind(),
                std::path::Prefix::Verbatim(_)
                    | std::path::Prefix::VerbatimDisk(_)
                    | std::path::Prefix::VerbatimUNC(_, _)
            )
    );
    assert!(
        is_unc,
        "normalized Windows base path should be UNC, got: {}",
        normalized_path.display()
    );

    let _ = fs::remove_dir_all(&tmp_root);
}
