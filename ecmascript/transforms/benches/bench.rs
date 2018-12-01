#![feature(test)]
#![feature(specialization)]
use std::alloc::System;

#[global_allocator]
static GLOBAL: System = System;

extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;
extern crate swc_ecma_transforms;
extern crate test;
extern crate testing;

use std::sync::Arc;
use swc_common::{FileName, FoldWith};
use swc_ecma_parser::{Parser, Session, SourceFileInput};
use swc_ecma_transforms::compat;
use test::Bencher;

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
};"#;

/// Benchmark a folder
macro_rules! tr {
    ($b:expr, $tr:expr) => {
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
            let module = parser.parse_module().unwrap();
            let helpers = Arc::new(compat::helpers::Helpers::default());
            let mut tr = $tr(helpers);

            $b.iter(|| {
                let module = module.clone();
                test::black_box(module.fold_with(&mut tr))
            });
            Ok(())
        });
    };
}

#[bench]
fn es2015(b: &mut Bencher) {
    tr!(b, |helpers| compat::es2015(&helpers));
}

#[bench]
fn es2015_arrow(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::arrow());
}

#[bench]
fn es2015_classes(b: &mut Bencher) {
    tr!(b, |helpers| compat::es2015::Classes { helpers });
}

#[bench]
fn es2015_computed_props(b: &mut Bencher) {
    tr!(b, compat::es2015::computed_properties);
}

#[bench]
fn es2015_destructuring(b: &mut Bencher) {
    tr!(b, compat::es2015::destructuring);
}

#[bench]
fn es2015_duplicate_keys(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::duplicate_keys());
}

#[bench]
fn es2015_parameters(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::parameters());
}

#[bench]
fn es2015_block_scoped_fn(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::BlockScopedFns);
}

#[bench]
fn es2015_block_scoping(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::block_scoping());
}

#[bench]
fn es2015_fn_name(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::function_name());
}

#[bench]
fn es2015_instanceof(b: &mut Bencher) {
    tr!(b, |helpers| compat::es2015::InstanceOf { helpers });
}

#[bench]
fn es2015_shorthand_property(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::Shorthand);
}

#[bench]
fn es2015_spread(b: &mut Bencher) {
    tr!(b, |helpers| compat::es2015::Spread { helpers });
}

#[bench]
fn es2015_sticky_regex(b: &mut Bencher) {
    tr!(b, |_| compat::es2015::StickyRegex);
}

#[bench]
fn es2015_typeof_symbol(b: &mut Bencher) {
    tr!(b, |helpers| compat::es2015::TypeOfSymbol { helpers });
}
