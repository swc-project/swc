extern crate proc_macro;

use proc_macro2::TokenStream;
use swc_macros_common::prelude::*;
use syn::*;

mod fold;

#[proc_macro_attribute]
pub fn node_impl(
    _attr: proc_macro::TokenStream,
    item: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let item: ItemImpl = syn::parse(item).expect("failed to parse input as an item");

    let mut output = TokenStream::new();

    for i in item.items {
        match i {
            ImplItem::Fn(i) => {
                let item = expand_method(i);

                output.extend(item.to_token_stream());
            }

            _ => {
                panic!("Unexpected item: {:?}", i);
            }
        }
    }

    output.into()
}

/// Returns `(emitter_method, adjuster_method)`
fn expand_method(src: ImplItemFn) -> ItemImpl {
    let method_name = src.sig.ident.clone();
    let block = src.block;

    parse_quote!(
        impl crate::Node for #node_type {
            fn emit_with<W, S>(&self, e: &mut crate::Emitter<'_, W, S>) -> Result
            where
                W: crate::text_writer::WriteJs,
                S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt,
            {
            }

            fn adjust_span<W, S>(&mut self, wr: &mut crate::SpanWriter<'_, W, S>) -> Result
            where
                W: crate::text_writer::SpannedWriteJs,
                S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt,
            {
            }
        }
    )
}
