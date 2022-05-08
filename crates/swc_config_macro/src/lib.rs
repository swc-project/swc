extern crate proc_macro;

#[proc_macro_derive(Merge)]
pub fn derive_spanned(input: proc_macro::TokenStream) -> proc_macro::TokenStream {}
