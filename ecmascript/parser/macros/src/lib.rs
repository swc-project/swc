//! Simulates unhygienic macro to make parser's code cleaner.
//! It lives here because it's not a generic purpose macro (at all).
//!
//! This can't be implemented with macro_rule! because
//! rust does not support token munching (destructing `$b:block` into `{
//! $($t:tt)* }`).

extern crate proc_macro;

#[macro_use]
extern crate quote;

use syn;

use pmutil::ToTokensExt;
use proc_macro::TokenStream;
use swc_macros_common::prelude::*;

mod expand;

/// This attribute macro injects first argument of function (typically `self`)
/// to all **known** macros invocation in a function.
#[proc_macro_attribute]
pub fn parser(attr: TokenStream, item: TokenStream) -> TokenStream {
    let item = syn::parse(item).expect("failed to parse input as an item");
    let item = expand::expand(attr.into(), item);

    print("parser", item.dump())
}
