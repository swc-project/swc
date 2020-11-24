extern crate proc_macro;

mod interface;

/// Creates a typescript interface which is `export default`.
///
///```rust,ignore
/// 
/// #[derive(ts_macros::Interface)]
/// #[interface(path = "path/to/file.ts")]
/// pub struct Swcrc {
///     #[interface(path = "path/to/file/of/jsc/option.ts")]
///     jsc: JscOption,
/// }
/// ```
#[proc_macro_derive(Interface, attributes(interface))]
pub fn interface(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = syn::parse(input).expect("failed to parse derive input");
    self::interface::create(input);

    proc_macro::TokenStream::new()
}
