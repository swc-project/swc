use swc_sourcemap::SourceMapHermes;

#[test]
fn test_react_native_hermes() {
    let input: &[_] = include_bytes!("./fixtures/react-native-hermes/output.map");
    let sm = SourceMapHermes::from_reader(input).unwrap();
    let sm = sm.rewrite(&Default::default()).unwrap();

    //    at foo (address at unknown:1:11939)
    assert_eq!(
        sm.lookup_token(0, 11939).unwrap().to_tuple(),
        ("module.js", 1, 10, None)
    );
    assert_eq!(
        sm.get_original_function_name(11939).map(|v| &**v),
        Some("foo")
    );

    // at anonymous (address at unknown:1:11857)
    assert_eq!(
        sm.lookup_token(0, 11857).unwrap().to_tuple(),
        ("input.js", 2, 0, None)
    );
    assert_eq!(
        sm.get_original_function_name(11857).map(|v| &**v),
        Some("<global>")
    );

    assert_eq!(
        sm.lookup_token(0, 11947).unwrap().to_tuple(),
        ("module.js", 1, 4, None)
    );
    assert_eq!(
        sm.get_original_function_name(11947).map(|v| &**v),
        Some("foo")
    );
}

#[test]
fn test_react_native_metro() {
    let input: &[_] = include_bytes!("./fixtures/react-native-metro/output.js.map");
    let sm = SourceMapHermes::from_reader(input).unwrap();
    // The given map has a bogus `__prelude__` first source, which is being
    // dropped (as its not referenced) by rewriting the sourcemap, and thus
    // the internal hermes mappings also need to be rewritten accordingly
    let sm = sm.rewrite(&Default::default()).unwrap();

    //    at foo (output.js:1289:11)
    let token = sm.lookup_token(1288, 10).unwrap();
    assert_eq!(token.to_tuple(), ("module.js", 1, 10, None));
    assert_eq!(sm.get_scope_for_token(token).map(|v| &**v), Some("foo"));

    // at output.js:1280:19
    let token = sm.lookup_token(1279, 18).unwrap();
    assert_eq!(token.to_tuple(), ("input.js", 2, 0, None));
    assert_eq!(
        sm.get_scope_for_token(token).map(|v| &**v),
        Some("<global>")
    );
}
