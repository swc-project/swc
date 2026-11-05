use super::*;

#[test]
fn jsx_text() {
    // Basic cases
    assert_eq!(jsx_text_to_str(" "), *" ");
    assert_eq!(jsx_text_to_str("Hello world"), *"Hello world");

    // Single line with whitespace at edges (should keep as-is)
    assert_eq!(jsx_text_to_str("  Hello world  "), *"  Hello world  ");

    // Empty string
    assert_eq!(jsx_text_to_str(""), *"");

    // Only whitespace (single line)
    assert_eq!(jsx_text_to_str("   "), *"   ");
    assert_eq!(jsx_text_to_str("\t\t"), *"\t\t");

    // Multi-line cases
    assert_eq!(jsx_text_to_str("Hello\nworld"), *"Hello world");
    assert_eq!(jsx_text_to_str("  Hello  \n  world  "), *"  Hello world  ");

    // Multi-line with empty lines
    assert_eq!(jsx_text_to_str("Hello\n\nworld"), *"Hello world");
    assert_eq!(jsx_text_to_str("Hello\n  \n  world"), *"Hello world");

    // Leading/trailing whitespace on multiple lines
    assert_eq!(
        jsx_text_to_str("  Hello  \n  world  \n  test  "),
        *"  Hello world test  "
    );

    // Only whitespace (multi-line) should return empty
    assert_eq!(jsx_text_to_str(" \n "), *"");
    assert_eq!(jsx_text_to_str("\n\n\n"), *"");
    assert_eq!(jsx_text_to_str("  \n  \n  "), *"");

    // Different line endings
    assert_eq!(jsx_text_to_str("Hello\rworld"), *"Hello world");
    assert_eq!(jsx_text_to_str("Hello\r\nworld"), *"Hello world");

    // Mixed whitespace types
    assert_eq!(
        jsx_text_to_str("\t Hello \t\n\t world \t"),
        *"\t Hello world \t"
    );
}

#[test]
fn jsx_attr_str_preserves_line_terminators() {
    let cases = [
        ("bruh\nbruh", "bruh\nbruh"),
        ("bruh\rbruh", "bruh\rbruh"),
        ("bruh\r\nbruh", "bruh\r\nbruh"),
    ];

    for (input, expected) in cases {
        assert_eq!(
            transform_jsx_attr_str(Wtf8::from_str(input)),
            Wtf8Buf::from_str(expected)
        );
    }
}

#[test]
fn jsx_text_with_raw_entity_whitespace_matrix() {
    fn convert(value: &str, raw: &str) -> String {
        let value: Wtf8Atom = value.into();
        let raw: Atom = raw.into();

        jsx_text_to_str_with_raw(&value, &raw)
            .to_string_lossy()
            .into_owned()
    }

    let cases = [
        // Single line keeps all whitespace.
        (" • ", " &#8226; ", " • "),
        // First line keeps plain leading whitespace (issue #11541).
        (" •\ntext", " &#8226;\ntext", " • text"),
        (" •\rtext", " &#8226;\rtext", " • text"),
        (" •\r\ntext", " &#8226;\r\ntext", " • text"),
        // Non-first line trims plain leading whitespace.
        ("\n • text", "\n &#8226; text", "• text"),
        // Non-first line keeps leading whitespace from entity.
        ("\n • text", "\n&#32;&#8226; text", " • text"),
        // Intermediate line trims plain trailing whitespace.
        ("• \ntext", "&#8226; \ntext", "• text"),
        // Intermediate line keeps trailing whitespace from entity.
        ("• \ntext", "&#8226;&#32;\ntext", "•  text"),
        // Final line trims plain leading whitespace in multiline input.
        ("foo\n •", "foo\n &#8226;", "foo •"),
        // Final line keeps leading whitespace from entity in multiline input.
        ("foo\n •", "foo\n&#32;&#8226;", "foo  •"),
        // Entity-only middle line should be preserved.
        ("\n \n", "\n&#32;\n", " "),
    ];

    for (value, raw, expected) in cases {
        assert_eq!(
            convert(value, raw),
            expected,
            "value={value:?}, raw={raw:?}"
        );
    }
}

#[test]
fn build_entity_mask_valid_invalid_and_numeric_entities() {
    assert_eq!(
        build_entity_mask(&atom!("a • b").into(), "a &#8226; b"),
        vec![false, false, true, false, false]
    );
    assert_eq!(
        build_entity_mask(&atom!("A A A").into(), "A&#32;A&#x20;A"),
        vec![false, true, false, true, false]
    );
    assert_eq!(
        build_entity_mask(&atom!("\u{00a0}").into(), "&nbsp;"),
        vec![true],
        "named entities should be marked"
    );
    assert_eq!(
        build_entity_mask(&atom!("&bogus;").into(), "&bogus;"),
        vec![false; "&bogus;".chars().count()],
        "invalid entities must not be marked"
    );

    assert_eq!(
        build_entity_mask(
            &atom!("🦀🦀🦀\u{1f4a9}").into(),
            "&#xD83E;&#xDD80;&#55358;&#56704;&#xD83E;&#56704;&#x1f4a9;"
        ),
        vec![true, true, true, true]
    );
}

#[test]
fn jsx_text_with_entity_mask_preserves_wtf8_surrogates() {
    let value = Wtf8Buf::from_ill_formed_utf16(&[0xd800, '\n' as u16, 0xd801]);
    let expected = Wtf8Buf::from_ill_formed_utf16(&[0xd800, ' ' as u16, 0xd801]);

    assert_eq!(
        jsx_text_to_str_with_entity_mask(&value, &[false, false, false]).as_wtf8(),
        &*expected
    );
}
