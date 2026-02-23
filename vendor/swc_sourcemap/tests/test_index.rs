use std::collections::HashMap;
use swc_sourcemap::{DecodedMap, SourceMapIndex};

#[test]
fn test_basic_indexed_sourcemap() {
    let input: &[_] = br#"{
        "version": 3,
        "file": "min.js",
        "sections": [
            {
                "offset": {
                    "line": 0,
                    "column": 0
                },
                "map": {
                    "version":3,
                    "sources":["file1.js"],
                    "names":["add","a","b"],
                    "mappings":"AAAA,QAASA,KAAIC,EAAGC,GACf,YACA,OAAOD,GAAIC",
                    "file":"file1.min.js"
                }
            },
            {
                "offset": {
                    "line": 1,
                    "column": 1
                },
                "map": {
                    "version":3,
                    "sources":["file2.js"],
                    "names":["multiply","a","b","divide","add","c","e","Raven","captureException"],
                    "mappings":"AAAA,QAASA,UAASC,EAAGC,GACpB,YACA,OAAOD,GAAIC,EAEZ,QAASC,QAAOF,EAAGC,GAClB,YACA,KACC,MAAOF,UAASI,IAAIH,EAAGC,GAAID,EAAGC,GAAKG,EAClC,MAAOC,GACRC,MAAMC,iBAAiBF",
                    "file":"file2.min.js"
                }
            }
        ]
    }"#;

    let f1 = "function add(a, b) {\n \"use strict\";\n \
              return a + b; // fôo\n}";
    let f2 = "function multiply(a, b) {\n \"use strict\";\n return a * b;\n}\nfunction divide(a, \
              b) {\n \"use strict\";\n try {\n  return multiply(add(a, b), a, b) / c;\n } catch \
              (e) {\n  Raven.captureException(e);\n }\n}";

    let mut raw_files = HashMap::new();
    raw_files.insert("file1.js", f1);
    raw_files.insert("file2.js", f2);

    let mut files: HashMap<_, Vec<_>> = HashMap::new();
    files.insert("file1.js", f1.lines().collect());
    files.insert("file2.js", f2.lines().collect());

    let mut ism = SourceMapIndex::from_reader(input).unwrap();
    assert!(!ism.is_for_ram_bundle());

    for section_id in 0..ism.get_section_count() {
        let section = ism.get_section_mut(section_id).unwrap();
        let map = match section.get_sourcemap_mut().unwrap() {
            DecodedMap::Regular(sm) => sm,
            _ => panic!("Invalid section type!"),
        };
        let contents = {
            let filename = map.get_source(0).unwrap();
            raw_files[&**filename]
        };
        map.set_source_contents(0, Some(contents.into()));
    }
    let flat_map = ism.flatten().unwrap();

    let mut out: Vec<u8> = vec![];
    flat_map.to_writer(&mut out).ok();
    println!("{}", String::from_utf8(out).unwrap());

    for token in flat_map.tokens() {
        let src = &files[&**token.get_source().unwrap()];
        if let Some(name) = token.get_name() {
            let line = src[token.get_src_line() as usize];
            let idx = token.get_src_col() as usize;
            let span = &line[idx..idx + name.len()];
            assert_eq!(span, name);
        }
    }

    for (src_id, filename) in flat_map.sources().enumerate() {
        let ref_contents = &files[&**filename];
        let contents: Vec<_> = flat_map
            .get_source_contents(src_id as u32)
            .unwrap_or_else(|| panic!("no source for {}", filename))
            .lines()
            .collect();
        assert_eq!(&contents, ref_contents);

        let view = flat_map
            .get_source_view(src_id as u32)
            .unwrap_or_else(|| panic!("no source for {}", filename));
        assert_eq!(&view.lines().collect::<Vec<_>>(), ref_contents);
    }

    assert_eq!(
        ism.lookup_token(0, 0).unwrap().to_tuple(),
        ("file1.js", 0, 0, None)
    );
    assert_eq!(
        ism.lookup_token(1, 0).unwrap().to_tuple(),
        ("file1.js", 2, 12, Some("b"))
    );
    assert_eq!(
        ism.lookup_token(1, 1).unwrap().to_tuple(),
        ("file2.js", 0, 0, None)
    );
    assert_eq!(
        ism.lookup_token(1, 8).unwrap().to_tuple(),
        ("file2.js", 0, 0, None)
    );
    assert_eq!(
        ism.lookup_token(1, 9).unwrap().to_tuple(),
        ("file2.js", 0, 9, Some("multiply"))
    );
}

#[test]
fn test_indexed_sourcemap_for_react_native() {
    let input: &[_] = br#"{
        "version": 3,
        "file": "bla",
        "sections": [
            {
                "offset": {
                    "line": 0,
                    "column": 0
                },
                "map": {
                    "version":3,
                    "sources":["file1.js"],
                    "names":["add","a","b"],
                    "mappings":"AAAA,QAASA,KAAIC,EAAGC,GACf,YACA,OAAOD,GAAIC",
                    "file":"file1.min.js"
                }
            },
            {
                "offset": {
                    "line": 1,
                    "column": 0
                },
                "map": {
                    "version":3,
                    "sources":["file2.js"],
                    "names":["multiply","a","b","divide","add","c","e","Raven","captureException"],
                    "mappings":"AAAA,QAASA,UAASC,EAAGC,GACpB,YACA,OAAOD,GAAIC,EAEZ,QAASC,QAAOF,EAAGC,GAClB,YACA,KACC,MAAOF,UAASI,IAAIH,EAAGC,GAAID,EAAGC,GAAKG,EAClC,MAAOC,GACRC,MAAMC,iBAAiBF",
                    "file":"file2.min.js"
                }
            }
        ],
        "x_facebook_offsets": [],
        "x_metro_module_paths": []
    }"#;

    let ism = SourceMapIndex::from_reader(input).unwrap();
    assert!(ism.is_for_ram_bundle());
}

#[test]
fn test_flatten_indexed_sourcemap_with_ignore_list() {
    let input: &[_] = br#"{
        "version": 3,
        "file": "bla",
        "sections": [
            {
                "offset": {
                    "line": 0,
                    "column": 0
                },
                "map": {
                    "version":3,
                    "sources":["file1.js"],
                    "names":["add","a","b"],
                    "mappings":"AAAA,QAASA,KAAIC,EAAGC,GACf,YACA,OAAOD,GAAIC",
                    "file":"file1.min.js"
                }
            },
            {
                "offset": {
                    "line": 1,
                    "column": 0
                },
                "map": {
                    "version":3,
                    "sources":["file2.js"],
                    "names":["multiply","a","b","divide","add","c","e","Raven","captureException"],
                    "mappings":"AAAA,QAASA,UAASC,EAAGC,GACpB,YACA,OAAOD,GAAIC,EAEZ,QAASC,QAAOF,EAAGC,GAClB,YACA,KACC,MAAOF,UAASI,IAAIH,EAAGC,GAAID,EAAGC,GAAKG,EAClC,MAAOC,GACRC,MAAMC,iBAAiBF",
                    "file":"file2.min.js",
                    "ignoreList": [0]
                }
            }
        ]
    }"#;

    let ism = SourceMapIndex::from_reader(input).unwrap();
    assert_eq!(
        ism.flatten()
            .unwrap()
            .ignore_list()
            .copied()
            .collect::<Vec<u32>>(),
        vec![1]
    );
}
