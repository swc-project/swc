#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(const_fn)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
#[macro_use]
extern crate quote;
extern crate syn;
use pmutil::SpanExt;
use pmutil::synom_ext::FromSpan;
use proc_macro2::Span;
use syn::*;

pub mod derive;
pub mod prelude;
mod syn_ext;
pub mod binder;

pub fn call_site<T: FromSpan>() -> T {
    Span::call_site().as_token()
}

/// `attr` - tokens inside `#[]`. e.g. `derive(EqIgnoreSpan)`, ast_node
pub fn print<T: Into<proc_macro2::TokenStream>>(
    attr: &'static str,
    t: T,
) -> proc_macro::TokenStream {
    use std::env;

    let tokens = t.into();

    match env::var("PRINT_GENERATED") {
        Ok(ref s) if s == "1" || attr == s => {}
        _ => return tokens.into(),
    }

    println!("\n\tOutput of #[{}]:\n\t {}", attr, tokens);
    tokens.into()
}

pub fn is_attr_name(attr: &Attribute, name: &str) -> bool {
    match *attr {
        Attribute {
            path:
                Path {
                    leading_colon: None,
                    ref segments,
                },
            is_sugared_doc: false,
            ..
        } if segments.len() == 1 =>
        {
            segments.first().unwrap().into_value().ident == name
        }
        _ => false,
    }
}

/// fail! is a panic! with location reporting.
#[macro_export]
macro_rules! fail {
    ($($args:tt)+) => {{
        panic!("{}\n --> {}:{}:{}", format_args!($($args)*), file!(), line!(), column!());
    }};
}

#[macro_export]
macro_rules! unimplemented {
    ($($args:tt)+) => {{
        fail!("not yet implemented: {}", format_args!($($args)*));
    }};
}

#[macro_export]
macro_rules! unreachable {
    () => {{
        fail!("internal error: unreacable");
    }};
    ($($args:tt)+) => {{
        fail!("internal error: unreacable\n{}", format_args!($($args)*));
    }};
}
