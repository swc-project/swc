extern crate proc_macro;

use proc_macro2::TokenStream;
use swc_macros_common::prelude::*;
use syn::{visit_mut::VisitMut, *};

mod fold;

/// # `emit!()`.
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
    let mut emit_block = src.block.clone();
    let mut adjust_block = src.block;

    let last_argument = src.sig.inputs.last().unwrap();
    let node_type = unref_type(fn_arg_to_type(last_argument));

    ReplaceEmit { emit: true }.visit_block_mut(&mut emit_block);
    ReplaceEmit { emit: false }.visit_block_mut(&mut adjust_block);

    parse_quote!(
        impl crate::Node for #node_type {
            fn emit_with<W, S>(&self, e: &mut crate::Emitter<'_, W, S>) -> Result
            where
                W: crate::text_writer::WriteJs,
                S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt,
            {
                #emit_block
            }

            fn adjust_span<W, S>(&mut self, wr: &mut crate::SpanWriter<'_, W, S>) -> Result
            where
                W: crate::text_writer::SpannedWriteJs,
                S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt,
            {
                #adjust_block
            }
        }
    )
}

fn fn_arg_to_type(arg: &FnArg) -> &Type {
    match arg {
        FnArg::Typed(ty) => ty.ty.as_ref(),
        _ => panic!("Unexpected argument: {:?}", arg),
    }
}

/// &T -> T;
/// &mut T -> T;
fn unref_type(ty: &Type) -> Type {
    match ty {
        Type::Reference(r) => unref_type(r.elem.as_ref()),
        other => other.clone(),
    }
}

struct ReplaceEmit {
    emit: bool,
}

impl VisitMut for ReplaceEmit {}
