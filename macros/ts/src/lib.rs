extern crate proc_macro;

use syn::{self, DeriveInput, *};

mod interface;

/// Creates a typescript interface which is `export default`.
#[proc_macro_derive(Interface)]
pub fn interface(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = syn::parse(input).expect("failed to parse derive input");
    self::interface::create(input);

    proc_macro::TokenStream::new()
}
