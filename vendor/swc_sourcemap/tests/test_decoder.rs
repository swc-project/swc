use std::io;
use std::io::BufRead;

use swc_sourcemap::{decode_data_url, DecodedMap, SourceMap, Token};

#[test]
fn test_no_header() {
    let input: &[_] = br#"[1, 2, 3]"#;
    let mut reader = io::BufReader::new(input);
    let mut text = String::new();
    reader.read_line(&mut text).ok();
    assert_eq!(text, "[1, 2, 3]");
}

#[test]
fn test_no_header_object() {
    let input: &[_] = br#"{"x": [1, 2, 3]}"#;
    let mut reader = io::BufReader::new(input);
    let mut text = String::new();
    reader.read_line(&mut text).ok();
    assert_eq!(text, r#"{"x": [1, 2, 3]}"#);
}

#[test]
fn test_basic_sourcemap() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": ["coolstuff.js"],
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,IAAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut iter = sm.tokens().filter(Token::has_name);
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("coolstuff.js", 0, 4, Some("x"))
    );
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("coolstuff.js", 1, 4, Some("x"))
    );
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("coolstuff.js", 2, 2, Some("alert"))
    );
    assert!(iter.next().is_none());
}

#[test]
fn test_basic_sourcemap_with_root() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": ["coolstuff.js"],
        "sourceRoot": "x",
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,IAAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut iter = sm.tokens().filter(Token::has_name);
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("x/coolstuff.js", 0, 4, Some("x"))
    );
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("x/coolstuff.js", 1, 4, Some("x"))
    );
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("x/coolstuff.js", 2, 2, Some("alert"))
    );
    assert!(iter.next().is_none());
}

#[test]
fn test_basic_sourcemap_with_absolute_uri_root() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": ["coolstuff.js", "./evencoolerstuff.js"],
        "sourceRoot": "webpack:///",
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,ICAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut iter = sm.tokens().filter(Token::has_name);
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("webpack:///coolstuff.js", 0, 4, Some("x"))
    );
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("webpack:///./evencoolerstuff.js", 1, 4, Some("x"))
    );
    assert_eq!(
        iter.next().unwrap().to_tuple(),
        ("webpack:///./evencoolerstuff.js", 2, 2, Some("alert"))
    );
    assert!(iter.next().is_none());
}

#[test]
fn test_basic_sourcemap_source_root_logic() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": ["coolstuff.js", "/evencoolerstuff.js", "https://awesome.js"],
        "sourceRoot": "webpack:///",
        "mappings": ""
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut iter = sm.sources();
    assert_eq!(iter.next().unwrap(), "webpack:///coolstuff.js");
    assert_eq!(iter.next().unwrap(), "/evencoolerstuff.js");
    assert_eq!(iter.next().unwrap(), "https://awesome.js");
    assert!(iter.next().is_none());
}

#[test]
fn test_sourcemap_data_url() {
    let url = "data:application/json;base64,\
               eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb2xzdHVmZi5qcyJdLCJzb3VyY2VSb290I\
               joieCIsIm5hbWVzIjpbIngiLCJhbGVydCJdLCJtYXBwaW5ncyI6IkFBQUEsR0FBSUEsR0\
               FBSSxFQUNSLElBQUlBLEdBQUssRUFBRyxDQUNWQyxNQUFNIn0=";
    match decode_data_url(url).unwrap() {
        DecodedMap::Regular(sm) => {
            let mut iter = sm.tokens().filter(Token::has_name);
            assert_eq!(
                iter.next().unwrap().to_tuple(),
                ("x/coolstuff.js", 0, 4, Some("x"))
            );
            assert_eq!(
                iter.next().unwrap().to_tuple(),
                ("x/coolstuff.js", 1, 4, Some("x"))
            );
            assert_eq!(
                iter.next().unwrap().to_tuple(),
                ("x/coolstuff.js", 2, 2, Some("alert"))
            );
            assert!(iter.next().is_none());
        }
        _ => {
            panic!("did not get sourcemap");
        }
    }
}

#[test]
fn test_sourcemap_nofiles() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": [null],
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,IAAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut iter = sm.tokens().filter(Token::has_name);
    assert_eq!(iter.next().unwrap().to_tuple(), ("", 0, 4, Some("x")));
    assert_eq!(iter.next().unwrap().to_tuple(), ("", 1, 4, Some("x")));
    assert_eq!(iter.next().unwrap().to_tuple(), ("", 2, 2, Some("alert")));
    assert!(iter.next().is_none());
}

#[test]
fn test_sourcemap_range_mappings() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": [null],
        "names": ["console","log","ab"],
        "mappings": "AACAA,QAAQC,GAAG,CAAC,OAAM,OAAM,QACxBD,QAAQC,GAAG,CAAC,QAEZD,QAAQC,GAAG,CAJD;IAACC,IAAI;AAAI,IAKnBF,QAAQC,GAAG,CAAC,YACZD,QAAQC,GAAG,CAAC",
        "rangeMappings": "AAB;;g"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();

    let mut iter = sm.tokens().filter(Token::is_range);

    assert_eq!(sm.tokens().filter(Token::is_range).count(), 2);

    assert_eq!(iter.next().unwrap().to_tuple(), ("", 4, 11, None));

    assert_eq!(iter.next().unwrap().to_tuple(), ("", 6, 0, Some("console")));
    assert!(iter.next().is_none());
}
