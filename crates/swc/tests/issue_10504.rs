//! Test for issue #10504 - Source map merging with input source map
//!
//! This test verifies that when SWC processes code that was already transformed
//! by TypeScript with a source map, the resulting merged source map correctly
//! points to the original TypeScript source.
//!
//! The fix for this issue is in the swc_sourcemap crate's `adjust_mappings` function.
//! It needs to deduplicate tokens that have the same destination position but different
//! source lines:
//!
//! ```rust
//! new_tokens.dedup_by(|a, b| {
//!     a.dst_line == b.dst_line && a.dst_col == b.dst_col && a.src_line != b.src_line
//! });
//! ```
//!
//! See: https://github.com/swc-project/swc/issues/10504

use swc::{
    config::{Config, InputSourceMap, JscConfig, Options, SourceMapsConfig},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use testing::Tester;

/// This test is ignored until swc_sourcemap is updated with the fix.
/// The issue is that when minification collapses multiple lines into one,
/// duplicate destination positions can be created in the source map,
/// causing incorrect line mappings.
#[test]
#[ignore = "Requires fix in swc_sourcemap crate - see https://github.com/swc-project/swc/issues/10504"]
fn issue_10504_sourcemap_merge() {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            // This is the TypeScript-compiled JavaScript with inline source map
            // The source map maps to test.ts which has:
            // Line 0-3: interface
            // Line 4: exports.foo = 'foo';
            // Line 5: exports.boo = 'boo';
            // Line 6: exports.bar = 'bar';
            // Line 7: exports.baz = 'baz';
            let typescript_js = r#""use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foo = 'foo';
exports.boo = 'boo';
exports.bar = 'bar';
exports.baz = 'baz';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNwQixPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNwQixPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNwQixPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyJ9
"#;

            let fm = cm.new_source_file(
                FileName::Custom("test.js".into()).into(),
                typescript_js,
            );

            let result = c
                .process_js_file(
                    fm,
                    &handler,
                    &Options {
                        config: Config {
                            jsc: JscConfig {
                                target: Some(EsVersion::Es2020),
                                minify: Some(swc::config::JsMinifyOptions {
                                    compress: swc_config::types::BoolOrDataConfig::from_bool(true),
                                    mangle: swc_config::types::BoolOrDataConfig::from_bool(false),
                                    format: swc_ecma_minifier::js::JsMinifyFormatOptions {
                                        ..Default::default()
                                    },
                                    ..Default::default()
                                }),
                                ..Default::default()
                            },
                            input_source_map: Some(InputSourceMap::Str("inline".into())),
                            emit_source_map_columns: true.into(),
                            minify: true.into(),
                            ..Default::default()
                        },
                        source_maps: Some(SourceMapsConfig::Bool(true)),
                        ..Default::default()
                    },
                )
                .expect("processing failed");

            println!("Minified code: {}", result.code);

            if let Some(ref map_str) = result.map {
                println!("Source map: {}", map_str);

                let source_map = swc_sourcemap::SourceMap::from_slice(map_str.as_bytes())
                    .expect("failed to parse source map");

                // Check that we don't have duplicate destination positions with different source
                // positions (different source lines)
                let mut seen_positions: std::collections::HashMap<(u32, u32), (u32, u32)> =
                    std::collections::HashMap::new();

                for token in source_map.tokens() {
                    let dst = (token.get_dst_line(), token.get_dst_col());
                    let src = (token.get_src_line(), token.get_src_col());

                    if let Some(prev_src) = seen_positions.insert(dst, src) {
                        // Allow same source positions for same destination (dedupe)
                        // Also allow different columns on the same line (valid for name mappings)
                        if prev_src.0 != src.0 {
                            panic!(
                                "Duplicate destination position {:?} maps to different source \
                                 lines: {:?} and {:?}",
                                dst, prev_src, src
                            );
                        }
                    }
                }

                // Verify that key tokens map to expected source lines
                // "foo" should map to line 4 (0-indexed) in the TypeScript source
                // "boo" should map to line 5
                // etc.

                // Find the position of "foo" in the minified output
                if let Some(foo_pos) = result.code.find("foo=") {
                    let token = source_map.lookup_token(0, foo_pos as u32);
                    if let Some(token) = token {
                        println!(
                            "Token for 'foo=': src_line={}, src_col={}",
                            token.get_src_line(),
                            token.get_src_col()
                        );
                        // TypeScript source line 4 (0-indexed) is `exports.foo = 'foo';`
                        assert_eq!(
                            token.get_src_line(),
                            4,
                            "Expected 'foo' to map to source line 4"
                        );
                    }
                }

                // Find the position of "boo" in the minified output
                if let Some(boo_pos) = result.code.find("boo=") {
                    let token = source_map.lookup_token(0, boo_pos as u32);
                    if let Some(token) = token {
                        println!(
                            "Token for 'boo=': src_line={}, src_col={}",
                            token.get_src_line(),
                            token.get_src_col()
                        );
                        // TypeScript source line 5 (0-indexed) is `exports.boo = 'boo';`
                        assert_eq!(
                            token.get_src_line(),
                            5,
                            "Expected 'boo' to map to source line 5"
                        );
                    }
                }
            }

            Ok(())
        })
        .unwrap();
}
