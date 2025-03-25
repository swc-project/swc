extern crate proc_macro;

use proc_macro2::TokenStream;
use swc_macros_common::prelude::*;
use syn::{visit_mut::VisitMut, *};

mod fold;
///
///
/// # Example
///
/// ```
/// impl MacroNode for ParamOrTsParamProp {
///     fn emit(&mut self, emitter: &mut Macro) -> Result {
///         match self {
///             ParamOrTsParamProp::Param(n) => emit!(n),
///             ParamOrTsParamProp::TsParamProp(n) => emit!(n),
///         }
///     }
/// }
/// ```
///
///
/// ## `emit!()`.
///
/// `emit!()` macro in `#[node_impl]` functions are special.
///
/// Those are replaced with `emit_with` and `adjust_span` methods, depending on
/// the context.
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
                let item = expand_method(&item.self_ty, i);

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
fn expand_method(node_type: &Type, src: ImplItemFn) -> ItemImpl {
    let mut emit_block = src.block.clone();
    let mut adjust_block = src.block;

    ReplaceEmit { emit: true }.visit_block_mut(&mut emit_block);
    ReplaceEmit { emit: false }.visit_block_mut(&mut adjust_block);

    parse_quote!(
        impl crate::Node for #node_type {
            fn emit_with<W, S>(&self, emitter: &mut crate::Emitter<'_, W, S>) -> Result
            where
                W: crate::text_writer::WriteJs,
                S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt,
            {
                #emit_block

                return Ok(());
            }

            fn adjust_span<W, S>(&mut self, wr: &mut crate::SpanWriter<'_, W, S>) -> Result
            where
                W: crate::text_writer::SpannedWriteJs,
                S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt,
            {
                #adjust_block

                return Ok(());
            }
        }
    )
}

struct ReplaceEmit {
    emit: bool,
}

impl VisitMut for ReplaceEmit {}
