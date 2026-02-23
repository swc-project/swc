use swc_sourcemap::{is_sourcemap_slice, locate_sourcemap_reference, SourceMapRef};

#[test]
fn test_basic_locate() {
    let input: &[_] = b"foo();\nbar();\n//# sourceMappingURL=foo.js";
    assert_eq!(
        locate_sourcemap_reference(input).unwrap(),
        Some(SourceMapRef::Ref("foo.js".into()))
    );
    assert_eq!(
        locate_sourcemap_reference(input)
            .unwrap()
            .unwrap()
            .get_url(),
        "foo.js"
    );
}

#[test]
fn test_legacy_locate() {
    let input: &[_] = b"foo();\nbar();\n//@ sourceMappingURL=foo.js";
    assert_eq!(
        locate_sourcemap_reference(input).unwrap(),
        Some(SourceMapRef::LegacyRef("foo.js".into()))
    );
    assert_eq!(
        locate_sourcemap_reference(input)
            .unwrap()
            .unwrap()
            .get_url(),
        "foo.js"
    );
}

#[test]
fn test_no_ref() {
    let input: &[_] = b"foo();\nbar();\n// whatever";
    assert_eq!(locate_sourcemap_reference(input).unwrap(), None);
}

#[test]
fn test_detect_basic_sourcemap() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": ["coolstuff.js"],
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,IAAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    assert!(is_sourcemap_slice(input));
}

#[test]
fn test_detect_bad_sourcemap() {
    let input: &[_] = br#"{
        "sources": ["coolstuff.js"],
        "names": ["x","alert"]
    }"#;
    assert!(!is_sourcemap_slice(input));
}

#[test]
fn test_detect_basic_sourcemap_with_junk_header() {
    let input: &[_] = br#")]}garbage\n
    {
        "version": 3,
        "sources": ["coolstuff.js"],
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,IAAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    assert!(is_sourcemap_slice(input));
}
