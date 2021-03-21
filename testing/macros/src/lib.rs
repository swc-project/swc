use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::ToTokens;
use syn::ItemFn;

mod fixture;

/// Create tests from files.
///
/// # Why
///
/// If you create test dynamically, running a specific test become very
/// cumbersome.
///
/// For example, if you use `test` crate with nightly, you can't use `cargo test
/// foo` to run tests with name containing `foo`. Instead, you have to implement
/// your own ignoring logic
///
///
/// # Usage
///
/// If you want to load all typescript files from `pass`
///
/// ```rust,ignore
/// 
/// #[fixture("pass/**/*.{ts,tsx}")]
/// fn pass(file: PathBuf) {
///     // test by reading file
/// }
/// ```
///
/// # Return value
///
/// The function is allowed to return `Result` on error. If it's the case
///
///
/// ## Ignoreing a test
///
/// If the path to the file contains a component starts with `.` (dot), it will
/// be ignore. This convention is widely used in many projects (including other
/// languages), as a file or a directory starting with `.` means hidden file in
/// unix system.
///
/// Note that they are added as a test `#[ignore]`, so you can use
/// `cargo test -- --ignored` or `cargo test -- --include-ignored` to run those
/// tests.
///
///
/// # Roadmap
///
/// - Support async function
#[proc_macro_attribute]
pub fn fixture(attr: TokenStream, item: TokenStream) -> TokenStream {
    let item: ItemFn = syn::parse(item).expect("failed to parse input as a function item");
    let config: self::fixture::Config =
        syn::parse(attr).expect("failed to parse input passed to #[fixture]");

    let file = Span::call_site().source_file();

    let cases = self::fixture::expand(&file, &item.sig.ident, config).unwrap();

    let mut output = proc_macro2::TokenStream::new();

    for case in cases {
        case.to_tokens(&mut output);
    }

    item.to_tokens(&mut output);

    output.into()
}
