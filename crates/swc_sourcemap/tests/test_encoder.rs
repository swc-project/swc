use swc_sourcemap::SourceMap;

#[test]
fn test_basic_sourcemap() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": ["coolstuff.js"],
        "names": ["x","alert"],
        "mappings": "AAAA,GAAIA,GAAI,EACR,IAAIA,GAAK,EAAG,CACVC,MAAM"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut out: Vec<u8> = vec![];
    sm.to_writer(&mut out).unwrap();

    let sm2 = SourceMap::from_reader(&out[..]).unwrap();

    for (tok1, tok2) in sm.tokens().zip(sm2.tokens()) {
        assert_eq!(tok1, tok2);
    }
}

#[test]
fn test_sourcemap_data_url() {
    let input: &[_] = br#"{"version":3,"file":"build/foo.min.js","sources":["src/foo.js"],"names":[],"mappings":"AAAA","sourceRoot":"/"}"#;
    let sm = SourceMap::from_reader(input).unwrap();
    assert_eq!(sm.to_data_url().unwrap(), "data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQvZm9vLm1pbi5qcyIsInNvdXJjZXMiOlsic3JjL2Zvby5qcyJdLCJzb3VyY2VSb290IjoiLyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIn0=");
}

#[test]
fn test_basic_range() {
    let input: &[_] = br#"{
        "version": 3,
        "sources": [null],
        "names": ["console","log","ab"],
        "mappings": "AACAA,QAAQC,GAAG,CAAC,OAAM,OAAM,QACxBD,QAAQC,GAAG,CAAC,QAEZD,QAAQC,GAAG,CAJD;IAACC,IAAI;AAAI,IAKnBF,QAAQC,GAAG,CAAC,YACZD,QAAQC,GAAG,CAAC",
        "rangeMappings": "AAB;;g"
    }"#;
    let sm = SourceMap::from_reader(input).unwrap();
    let mut out: Vec<u8> = vec![];
    sm.to_writer(&mut out).unwrap();

    let sm2 = SourceMap::from_reader(&out[..]).unwrap();

    for (tok1, tok2) in sm.tokens().zip(sm2.tokens()) {
        assert_eq!(tok1, tok2);
    }
}

#[test]
fn test_empty_range() {
    let input = r#"{
        "version": 3,
        "sources": [null],
        "names": ["console","log","ab"],
        "mappings": "AACAA,QAAQC,GAAG,CAAC,OAAM,OAAM,QACxBD,QAAQC,GAAG,CAAC,QAEZD,QAAQC,GAAG,CAJD;IAACC,IAAI;AAAI,IAKnBF,QAAQC,GAAG,CAAC,YACZD,QAAQC,GAAG,CAAC",
        "rangeMappings": ""
    }"#;
    let sm = SourceMap::from_reader(input.as_bytes()).unwrap();
    let mut out: Vec<u8> = vec![];
    sm.to_writer(&mut out).unwrap();

    let out = String::from_utf8(out).unwrap();
    assert!(!out.contains("rangeMappings"));
}
