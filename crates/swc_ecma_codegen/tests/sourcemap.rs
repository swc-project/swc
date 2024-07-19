use std::{fs::read_to_string, path::PathBuf};

use base64::prelude::{Engine, BASE64_STANDARD};
use sourcemap::SourceMap;
use swc_allocator::{collections::FxHashSet, maybe::vec::Vec};
use swc_common::{comments::SingleThreadedComments, source_map::SourceMapGenConfig};
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};

static IGNORED_PASS_TESTS: &[&str] = &[
    // Temporally ignored
    "16c7073c546fdd58.js",
    "369fd0a1e40030d8.js",
    "3df03e7e138b7760.js",
    "5333f04581124314.js",
    "a157424306915066.js",
    "ce5f3bc27d5ccaac.js",
    "d4e81043d808dc31.js",
    // Stack size (Stupid parens)
    "6b5e7e125097d439.js",
    "714be6d28082eaa7.js",
    "882910de7dd1aef9.js",
    "dd3c63403db5c06e.js",
    // Wrong tests (variable name or value is different)
    "0339fa95c78c11bd.js",
    "0426f15dac46e92d.js",
    "0b4d61559ccce0f9.js",
    "0f88c334715d2489.js",
    "1093d98f5fc0758d.js",
    "15d9592709b947a0.js",
    "2179895ec5cc6276.js",
    "247a3a57e8176ebd.js",
    "441a92357939904a.js",
    "47f974d6fc52e3e4.js",
    "4e1a0da46ca45afe.js",
    "5829d742ab805866.js",
    "589dc8ad3b9aa28f.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "7b72d7b43bedc895.js",
    "7dab6e55461806c9.js",
    "82c827ccaecbe22b.js",
    "87a9b0d1d80812cc.js",
    "8c80f7ee04352eba.js",
    "96f5d93be9a54573.js",
    "988e362ed9ddcac5.js",
    "9bcae7c7f00b4e3c.js",
    "a8a03a88237c4e8f.js",
    "ad06370e34811a6a.js",
    "b0fdc038ee292aba.js",
    "b62c6dd890bef675.js",
    "cb211fadccb029c7.js",
    "ce968fcdf3a1987c.js",
    "db3c01738aaf0b92.js",
    "e1387fe892984e2b.js",
    "e71c1d5f0b6b833c.js",
    "e8ea384458526db0.js",
    // We don't implement Annex B fully.
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
    // swc_common issue - `\r` should be treated as a newline
    "be2c3fff6426873e.js",
    "db66e1e8f3f1faef.js",
    "a7b8ce1d4c0f0bc2.js",
    "6498dcc494193cb4.js",
    "6a240463b40550d2.js",
    // TODO: (maybe) fix span of `,`
    "641ac9060a206183.js",
    "e4cef19dab44335a.js",
    "a6806d6fedbf6759.js",
    "2dc0ded5a1bff643.js",
    "547fa50af16beca7.js",
    "547fa50af16beca7.js",
    "8c8a7a2941fb6d64.js",
    "9e98dbfde77e3dfe.js",
    "d9eb39b11bc766f4.js",
    "f9888fa1a1e366e7.js",
    "78cf02220fb0937c.js",
    // TODO(kdy1): Non-ascii char count
    "58cb05d17f7ec010.js",
    "4d2c7020de650d40.js",
    "dafb7abe5b9b44f5.js",
    // Our one is better
    "1efde9ddd9d6e6ce.module.js",
    "d010d377bcfd5565.js",
    "ce0aaec02d5d4465.js",
    "edd1f39f90576180.js",
    "290fdc5a2f826ead.js",
    "e71a91c61343cdb1.js",
    "409f30dc7efe75d5.js",
    "03608b6e222ae700.js",
    "e54c1a2fc15cd4b8.js",
    "e08e181172bad2b1.js",
    "cc793d44a11617e7.js",
    "54e70df597a4f9a3.js",
    "efef19e06f58fdd9.js",
    "e0fc2148b455a6be.js",
    "10857a84ed2962f1.js",
    "d7c7ff252e84e81d.js",
    "0aa6aab640155051.js",
    "c80d9415dde647cd.js",
    "09e84f25af85b836.js",
    "ce8c443eb361e1a2.js",
    "affd557fd820e1f2.js",
    "ec99a663d6f3983d.js",
    "01fd8e8a0a42307b.js",
    "e01c7172cf204b92.js",
    "12d5bedf1812952a.js",
    "df20c9b7a7d534cb.js",
    "c767fa4d683aa3ce.js",
    "bf8ffad512a5f568.js",
    "c8513472857eae9c.js",
    "b86b0122e80c330e.js",
    "aa7e721756949024.js",
    "a830df7cf2e74c9f.js",
    "845631d1a33b3409.js",
    "066b76285ce79182.js",
    "fe2d3b945530c806.js",
    "bd28a7d19ac0d50b.js",
    "06c7efc128ce74a0.js",
    "075c7204d0b0af60.js",
    "0827a8316cca777a.js",
    "b9a0cb6df76a73d2.js",
    "bf210a4f0cf9e352.js",
    "6edc155d463535cb.js",
    "b8f8dfc41df97add.js",
    "b549d045fc8e93bf.js",
    "e42f306327c0f578.js",
    "9a9cb616daadf90a.js",
    "d2ae1c7b6e55143f.js",
    "a445a478b4ce0c58.js",
    "0d137e8a97ffe083.js",
    "b7a6a807ae6db312.js",
    "bb8b546cf9db5996.js",
    "50ac15a08f7c812f.js",
    "a2cb5a14559c6a50.js",
    "bbff5671643cc2ea.js",
    "c2f12d66ce17d5ab.js",
    "13045bfdda0434e0.js",
    "10d6486502949e74.js",
    "119e9dce4feae643.js",
    "1223609b0f7a2129.js",
    "177fef3d002eb873.js",
    "19ffea7e9e887e08.js",
    "1c6c67fcd71f2d08.js",
    "1cdce2d337e64b4f.js",
    "1f039e0eeb1bc271.js",
    "227118dffd2c9935.js",
    "250ced8c8e83b389.js",
    "a2798917405b080b.js",
    "ad6bf12aa7eda975.js",
    "24fa28a37061a18f.js",
    "252bb992a448270e.js",
    "285648c16156804f.js",
    "2d10fed2af94fbd1.js",
    "3097f73926c93640.js",
    "30aee1020fc69090.js",
    "312f85fecc352681.js",
    "317532451c2ce8ff.js",
    "32b635a9667a9fb1.js",
    "36224cf8215ad8e4.js",
    "37e4a6eca1ece7e5.js",
    "38284ea2d9914d86.js",
    "3b57183c81070eec.js",
    "3bbd75d597d54fe6.js",
    "3c1e2ada0ac2b8e3.js",
    "3e1a6f702041b599.js",
    "3e3a99768a4a1502.js",
    "3e69c5cc1a7ac103.js",
    "3eac36e29398cdc5.js",
    "3ff52d86c77678bd.js",
    "43023cd549deee77.js",
    "44af28febe2288cc.js",
    "478ede4cfe7906d5.js",
    "4869454dd215468e.js",
    "48b6f8ce65d3b3ee.js",
    "4c71e11fbbc56349.js",
    "4d833cbc56caaaf9.js",
    "4e7c58761e24d77c.js",
    "4e7c58761e24d77c.js",
    "5641ad33abcd1752.js",
    "587400d1c019785a.js",
    "58ed6ffb30191684.js",
    "5b8d2b991d2c1f5b.js",
    "5f730961df66e8e8.js",
    "597108fd45a6e79b.js",
    "60dcd48a3f6af44f.js",
    "62d7c1ee4e1626c4.js",
    "665f4940c7cf30c9.js",
    "64cc57f82a54b7fb.js",
    "66d2dbcb692491ec.module.js",
    "697b3d30c1d06918.js",
    "698a8cfb0705c277.js",
    "69bbdc7c34ed23cc.js",
    "6a323491fe75918a.js",
    "6b76b8761a049c19.js",
    "70bf2c409480ae10.js",
    "74c5ebda713c8bd7.js",
    "75172741c27c7703.js",
    "753a8b016a700975.js",
    "77c661b2fbe3dd3a.js",
    "784a059faa166072.js",
    "7855fbf5ea10e622.js",
    "7cd7c68a6131f816.js",
    "7df2a606ecc6cd84.js",
    "7dfb625b91c5c879.js",
    "7fdf990c6f42edcd.module.js",
    "80d2351a5ae68524.js",
    "84250e15785d8a9e.js",
    "85263ecacc7a4dc5.js",
    "8628cd459b39ffe8.js",
    "870a0b8d891753e9.js",
    "8d14286a8cc6ee9d.js",
    "8d67ad04bfc356c9.js",
    "8ecaef2617d8c6a7.js",
    "918e105a2ff6c64a.js",
    "92fd8e24864fde0a.js",
    "94b8a654a87039b9.js",
    "94cb828d5dcfd136.js",
    "98df58b0c40fac90.js",
    "9949a2e1a6844836.module.js",
    "99cdfc40e20af6f5.js",
    "9a666205cafd530f.js",
    "a454d2e2ab3484e6.js",
    "a54cca69085ad35a.js",
    "a86a29773d1168d3.js",
    "b205355de22689d1.js",
    "b93d116fd0409637.js",
    "c85bc4de504befc7.js",
    "c8689b6da6fd227a.js",
    "cda499c521ff60c7.js",
    "d4b898b45172a637.js",
    "e2ac0bea41202dc9.js",
    "f01d9f3c7b2b2717.js",
    "f15772354efa5ecf.js",
    "f17ec9517a3339d9.js",
    "fa5b398eeef697a6.js",
    "fa9eaf58f51d6926.js",
    "faa4a026e1e86145.js",
    "fada2c7bbfabe14a.js",
    "fb8db7a71f3755fc.js",
    "fbde237f11796df9.js",
    "fd5ea844fcc07d3d.js",
    "6c5f0dd83c417a5a.js",
    "78eb22badc114b6f.js",
    "7afd38d79e6795a8.js",
    "80950061e291542b.js",
    "8a0fc8ea31727188.module.js",
    "af97a3752e579223.js",
    "bbffb851469a3f0e.js",
    "bc302492d441d561.js",
    "be2fd5888f434cbd.js",
    "f3260491590325af.js",
    // Unicode 14 vs 15
    "046a0bb70d03d0cc.js",
    "08a39e4289b0c3f3.js",
    "300a638d978d0f2c.js",
    "44f31660bd715f05.js",
];

#[testing::fixture("../swc_ecma_parser/tests/test262-parser/pass/*.js")]
fn identity(entry: PathBuf) {
    let file_name = entry
        .file_name()
        .unwrap()
        .to_str()
        .expect("to_str() failed")
        .to_string();

    let input = read_to_string(&entry).unwrap();

    let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

    if ignore {
        return;
    }

    let is_module = file_name.contains("module");

    let msg = format!(
        "\n\n========== Running codegen test {}\nSource:\n{}\n",
        file_name, input
    );
    let mut wr = std::vec::Vec::new();

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&entry).expect("failed to load file");
        eprintln!(
            "{}\nPos: {:?} ~ {:?} (L{})",
            msg,
            fm.start_pos,
            fm.end_pos,
            fm.count_lines()
        );
        let (expected_code, expected_map, visualizer_url_for_expected) =
            match get_expected(&fm.src, is_module) {
                Some(v) => v,
                None => return Ok(()),
            };
        println!("Expected code:\n{}", expected_code);
        let expected_tokens = print_source_map(&expected_map);

        let comments = SingleThreadedComments::default();
        let lexer = Lexer::new(
            Syntax::default(),
            Default::default(),
            (&*fm).into(),
            Some(&comments),
        );
        let mut parser: Parser<Lexer> = Parser::new_from(lexer);
        let mut src_map = Vec::new();

        {
            let mut wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut wr,
                Some(&mut src_map),
            )) as Box<dyn WriteJs>;

            wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));

            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config::default()
                    .with_minify(true)
                    .with_ascii_only(true)
                    .with_target(EsVersion::Es5),
                cm: cm.clone(),
                wr,
                comments: None,
            };

            // Parse source
            if is_module {
                emitter
                    .emit_module(
                        &parser
                            .parse_module()
                            .map_err(|e| e.into_diagnostic(handler).emit())?,
                    )
                    .unwrap();
            } else {
                emitter
                    .emit_script(
                        &parser
                            .parse_script()
                            .map_err(|e| e.into_diagnostic(handler).emit())?,
                    )
                    .unwrap();
            }
        }

        let actual_code = String::from_utf8(wr).unwrap();
        let actual_map = cm.build_source_map_with_config(&src_map, None, SourceMapConfigImpl);

        let visualizer_url_for_actual = visualizer_url(&actual_code, &actual_map);

        let actual_tokens = print_source_map(&actual_map);

        let common_tokens = actual_tokens
            .iter()
            .filter(|a| expected_tokens.contains(&**a))
            .map(|v| v.to_string())
            .collect::<FxHashSet<_>>();

        let actual_tokens_diff = actual_tokens
            .iter()
            .filter(|a| !common_tokens.contains(&**a))
            .map(|v| v.to_string())
            .collect::<Vec<_>>();
        let expected_tokens_diff = expected_tokens
            .iter()
            .filter(|a| !common_tokens.contains(&**a))
            .map(|v| v.to_string())
            .collect::<Vec<_>>();
        eprintln!("---- Actual -----");
        for s in actual_tokens_diff {
            eprintln!("{}", s);
        }
        eprintln!("---- Expected -----");
        for s in expected_tokens_diff {
            eprintln!("{}", s);
        }

        dbg!(&src_map);

        if actual_code != expected_code {
            // Generated code is different
            // We can't ensure that identical sourcemap will mean identical code
            eprintln!("Actual code:\n{}", actual_code);
            eprintln!("Expected code:\n{}", expected_code);
            return Ok(());
        }

        eprintln!(
            "----- Visualizer -----\nExpected: {}\nActual: {}",
            visualizer_url_for_expected, visualizer_url_for_actual
        );

        assert_eq_same_map(&expected_map, &actual_map);
        Ok(())
    })
    .expect("failed to run test");
}

fn get_expected(code: &str, is_module: bool) -> Option<(String, SourceMap, String)> {
    let output = exec_node_js(
        include_str!("./srcmap.mjs"),
        JsExecOptions {
            cache: true,
            module: true,
            args: vec![
                code.to_string(),
                if is_module {
                    "module".into()
                } else {
                    "script".into()
                },
            ],
        },
    )
    .ok()?;

    let v = serde_json::from_str::<serde_json::Map<String, serde_json::Value>>(&output).unwrap();

    let code = v.get("code").unwrap().as_str().unwrap();
    let map = v.get("map").unwrap().as_str().unwrap();

    let map = SourceMap::from_slice(map.as_bytes()).expect("invalid sourcemap");

    let visualizer_url = visualizer_url(code, &map);

    Some((code.to_string(), map, visualizer_url))
}

fn print_source_map(map: &SourceMap) -> Vec<String> {
    let mut v = map
        .tokens()
        .map(|t| {
            format!(
                "Token: {}:{} => {}:{}",
                t.get_src_line(),
                t.get_src_col(),
                t.get_dst_line(),
                t.get_dst_col()
            )
        })
        .collect::<Vec<_>>();

    v.sort();
    v
}

fn assert_eq_same_map(expected: &SourceMap, actual: &SourceMap) {
    for expected_token in expected.tokens() {
        let actual_token = actual
            .lookup_token(expected_token.get_dst_line(), expected_token.get_dst_col())
            .unwrap_or_else(|| panic!("token not found: {:?}", expected_token));

        if expected_token.get_src_line() == 0 && expected_token.get_src_col() == 0 {
            continue;
        }

        assert_eq!(
            expected_token.get_src_line(),
            actual_token.get_src_line(),
            "line mismatch at {}:{}",
            expected_token.get_dst_line(),
            expected_token.get_dst_col()
        );
        assert_eq!(
            expected_token.get_src_col(),
            actual_token.get_src_col(),
            "col mismatch at {}:{}",
            expected_token.get_dst_line(),
            expected_token.get_dst_col()
        );
    }
}

/// Creates a url for https://evanw.github.io/source-map-visualization/
fn visualizer_url(code: &str, map: &SourceMap) -> String {
    let map = {
        let mut buf = std::vec::Vec::new();
        map.to_writer(&mut buf).unwrap();
        String::from_utf8(buf).unwrap()
    };

    let code_len = format!("{}\0", code.len());
    let map_len = format!("{}\0", map.len());
    let hash = BASE64_STANDARD.encode(format!("{}{}{}{}", code_len, code, map_len, map));

    format!("https://evanw.github.io/source-map-visualization/#{}", hash)
}

struct SourceMapConfigImpl;

impl SourceMapGenConfig for SourceMapConfigImpl {
    fn file_name_to_source(&self, f: &swc_common::FileName) -> String {
        f.to_string()
    }

    fn inline_sources_content(&self, _: &swc_common::FileName) -> bool {
        true
    }
}
