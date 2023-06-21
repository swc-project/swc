extern crate proc_macro;

use quote::ToTokens;
use syn::{parse_quote, AttrStyle, Attribute, ImplItem, ItemImpl};

/// Utility proc macro to add `#[tracing::instrument(level = "info",
/// skip_all)]` to all methods in an impl block.
///
/// This attribute macro is typically applied on an `VisitMut` impl block.
/// If this is applied, all implemented methods will annotated with the
/// instrument annotation from `tracing`.
#[proc_macro_attribute]
pub fn swc_trace(
    _args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let mut item = syn::parse::<ItemImpl>(input).expect("#[swc_trace] expects an impl block");

    item.items.iter_mut().for_each(|item| {
        // We only handle methods
        if let ImplItem::Fn(m) = item {
            // #[tracing::instrument(level = "info", skip_all)]
            let attr = Attribute {
                pound_token: Default::default(),
                style: AttrStyle::Outer,
                bracket_token: Default::default(),
                meta: parse_quote!(tracing::instrument(level = "info", skip_all)),
            };
            m.attrs.push(attr);
        }
    });

    item.to_token_stream().into()
}
