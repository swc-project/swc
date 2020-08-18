#![feature(test)]

extern crate test;

#[global_allocator]
static GLOBAL: System = System;

use std::alloc::System;
use swc_common::{chain, FileName, Mark};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_transforms::{compat, helpers};
use test::Bencher;

static SOURCE: &str = r#"
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
};"#;

/// Benchmark a folder
macro_rules! tr {
    ($b:expr, $tr:expr) => {
        use swc_ecma_visit::FoldWith;
        $b.bytes = SOURCE.len() as _;

        let _ = ::testing::run_test(false, |cm, _| {
            let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                StringInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let module = parser.parse_module().map_err(|_| ()).unwrap();
            helpers::HELPERS.set(&Default::default(), || {
                let mut tr = $tr();

                $b.iter(|| {
                    let module = module.clone();
                    test::black_box(module.fold_with(&mut tr))
                });
                Ok(())
            })
        });
    };
}

#[bench]
fn all(b: &mut Bencher) {
    tr!(b, || chain!(
        compat::es2017(),
        compat::es2016(),
        compat::es2015(Mark::fresh(Mark::root()), Default::default()),
        compat::es3(Default::default()),
    ));
}

#[bench]
fn es2018(b: &mut Bencher) {
    tr!(b, || compat::es2018());
}

#[bench]
fn es2018_object_rest_spread(b: &mut Bencher) {
    tr!(b, || compat::es2018::object_rest_spread());
}

#[bench]
fn es2017(b: &mut Bencher) {
    tr!(b, || compat::es2017());
}

#[bench]
fn es2017_async_to_generator(b: &mut Bencher) {
    tr!(b, || compat::es2017::async_to_generator());
}

#[bench]
fn es2016(b: &mut Bencher) {
    tr!(b, || compat::es2016());
}

#[bench]
fn es2016_exponentation(b: &mut Bencher) {
    tr!(b, || compat::es2016::exponentation());
}

#[bench]
fn es2015(b: &mut Bencher) {
    tr!(b, || compat::es2015(
        Mark::fresh(Mark::root()),
        Default::default()
    ));
}

#[bench]
fn es2015_arrow(b: &mut Bencher) {
    tr!(b, || compat::es2015::arrow());
}

#[bench]
fn es2015_block_scoped_fn(b: &mut Bencher) {
    tr!(b, || compat::es2015::block_scoped_functions());
}

#[bench]
fn es2015_block_scoping(b: &mut Bencher) {
    tr!(b, || compat::es2015::block_scoping());
}

#[bench]
fn es2015_classes(b: &mut Bencher) {
    tr!(b, || compat::es2015::classes());
}

#[bench]
fn es2015_computed_props(b: &mut Bencher) {
    tr!(b, compat::es2015::computed_properties);
}

#[bench]
fn es2015_destructuring(b: &mut Bencher) {
    tr!(b, || compat::es2015::destructuring(Default::default()));
}

#[bench]
fn es2015_duplicate_keys(b: &mut Bencher) {
    tr!(b, || compat::es2015::duplicate_keys());
}

#[bench]
fn es2015_parameters(b: &mut Bencher) {
    tr!(b, || compat::es2015::parameters());
}

#[bench]
fn es2015_fn_name(b: &mut Bencher) {
    tr!(b, || compat::es2015::function_name());
}

#[bench]
fn es2015_for_of(b: &mut Bencher) {
    tr!(b, || compat::es2015::for_of(Default::default()));
}

#[bench]
fn es2015_instanceof(b: &mut Bencher) {
    tr!(b, || compat::es2015::instance_of());
}

#[bench]
fn es2015_shorthand_property(b: &mut Bencher) {
    tr!(b, || compat::es2015::shorthand());
}

#[bench]
fn es2015_spread(b: &mut Bencher) {
    tr!(b, || compat::es2015::spread(
        compat::es2015::spread::Config {
            ..Default::default()
        }
    ));
}

#[bench]
fn es2015_sticky_regex(b: &mut Bencher) {
    tr!(b, || compat::es2015::sticky_regex());
}

#[bench]
fn es2015_typeof_symbol(b: &mut Bencher) {
    tr!(b, || compat::es2015::typeof_symbol());
}

#[bench]
fn es3(b: &mut Bencher) {
    tr!(b, || compat::es3(Default::default()));
}
