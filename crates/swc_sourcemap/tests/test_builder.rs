use swc_sourcemap::SourceMapBuilder;

#[test]
fn test_builder_into_sourcemap() {
    let mut builder = SourceMapBuilder::new(None);
    builder.set_source_root(Some("/foo/bar"));
    builder.add_source("baz.js".into());
    builder.add_name("x".into());
    builder.add_to_ignore_list(0);

    let sm = builder.into_sourcemap();
    assert_eq!(sm.get_source_root().map(|v| &**v), Some("/foo/bar"));
    assert_eq!(sm.get_source(0).map(|v| &**v), Some("/foo/bar/baz.js"));
    assert_eq!(sm.get_name(0).map(|v| &**v), Some("x"));

    let expected = br#"{"version":3,"sources":["baz.js"],"sourceRoot":"/foo/bar","names":["x"],"mappings":"","ignoreList":[0]}"#;
    let mut output: Vec<u8> = vec![];
    sm.to_writer(&mut output).unwrap();
    assert_eq!(output, expected);
}
