#![feature(test)]

extern crate swc_common;
extern crate swc_ecma_parser;
extern crate test;
extern crate testing;

use swc_common::FileName;
use swc_ecma_parser::{Parser, Session, SourceFileInput};
use test::Bencher;

/// Copied from ratel-rust
static SOURCE: &'static str = r#"
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

#[bench]
fn bench_parse_module(b: &mut Bencher) {
    let _ = ::testing::run_test(|logger, cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let mut parser = Parser::new(
            Session {
                logger: &logger,
                handler: &handler,
                cfg: Default::default(),
            },
            SourceFileInput::from(&*fm),
        );

        b.iter(|| parser.parse_module().unwrap());
        Ok(())
    });
}
