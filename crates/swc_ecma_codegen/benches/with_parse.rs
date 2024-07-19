extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_allocator::maybe::vec::Vec;
use swc_common::FileName;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{Parser, StringInput, Syntax};

const COLORS_JS: &str = r#"
'use strict';
/**
 * Extract red color out of a color integer:
 *
 * 0x00DEAD -> 0x00
 *
 * @param  {Number} color
 * @return {Number}
 */
function red( color )
{
    let foo = 3.14;
    return color >> 16;
}
/**
 * Extract green out of a color integer:
 *
 * 0x00DEAD -> 0xDE
 *
 * @param  {Number} color
 * @return {Number}
 */
function green( color )
{
    return ( color >> 8 ) & 0xFF;
}
/**
 * Extract blue color out of a color integer:
 *
 * 0x00DEAD -> 0xAD
 *
 * @param  {Number} color
 * @return {Number}
 */
function blue( color )
{
    return color & 0xFF;
}
/**
 * Converts an integer containing a color such as 0x00DEAD to a hex
 * string, such as '#00DEAD';
 *
 * @param  {Number} int
 * @return {String}
 */
function intToHex( int )
{
    const mask = '#000000';
    const hex = int.toString( 16 );
    return mask.substring( 0, 7 - hex.length ) + hex;
}
/**
 * Converts a hex string containing a color such as '#00DEAD' to
 * an integer, such as 0x00DEAD;
 *
 * @param  {Number} num
 * @return {String}
 */
function hexToInt( hex )
{
    return parseInt( hex.substring( 1 ), 16 );
}
module.exports = {
    red,
    green,
    blue,
    intToHex,
    hexToInt,
};
"#;

const LARGE_PARTIAL_JS: &str = include_str!("large-partial.js");

fn bench_emitter(b: &mut Bencher, s: &str) {
    let _ = ::testing::run_test(true, |cm, handler| {
        b.iter(|| {
            let fm = cm.new_source_file(FileName::Anon.into(), s.into());
            let mut parser = Parser::new(Syntax::default(), StringInput::from(&*fm), None);
            let module = parser
                .parse_module()
                .map_err(|e| e.into_diagnostic(handler).emit())
                .unwrap();

            for err in parser.take_errors() {
                err.into_diagnostic(handler).emit();
            }

            let mut src_map_buf = Vec::new();
            let mut buf = Vec::new();
            {
                let mut emitter = Emitter {
                    cfg: Default::default(),
                    comments: None,
                    cm: cm.clone(),
                    wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                        cm.clone(),
                        "\n",
                        &mut buf,
                        Some(&mut src_map_buf),
                    )),
                };

                let _ = emitter.emit_module(&module);
            }
            black_box(buf);
            let srcmap = cm.build_source_map(&src_map_buf);
            black_box(srcmap);
        });
        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("es/codegen/with-parser/colors", |b| {
        bench_emitter(b, COLORS_JS)
    });
    c.bench_function("es/codegen/with-parser/large", |b| {
        bench_emitter(b, LARGE_PARTIAL_JS)
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
