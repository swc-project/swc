extern crate proc_macro;

use proc_macro::TokenStream;
use swc_macros_common::prelude::*;
use syn::{fold::Fold, *};

mod fold;

#[proc_macro_attribute]
pub fn emitter(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let item: ImplItemFn = syn::parse(item).expect("failed to parse input as an item");
    let item = fold::InjectSelf { parser: None }.fold_impl_item_fn(item);
    let item = expand(item);

    print("emitter", item.into_token_stream())
}

fn expand(i: ImplItemFn) -> ImplItemFn {
    let mtd_name = i.sig.ident.clone();
    assert!(
        format!("{}", i.sig.ident).starts_with("emit_"),
        "#[emitter] methods should start with `emit_`"
    );
    let block = {
        let node_type = {
            i.sig
                .inputs
                .clone()
                .into_iter()
                .nth(1)
                .and_then(|arg| match arg {
                    FnArg::Typed(ty) => Some(ty.ty),
                    _ => None,
                })
                .map(|ty| {
                    // &Ident -> Ident
                    match *ty {
                        Type::Reference(TypeReference { elem, .. }) => *elem,
                        _ => panic!(
                            "Type of node parameter should be reference but got {}",
                            ty.into_token_stream()
                        ),
                    }
                })
                .expect(
                    "#[emitter] methods should have signature of
fn (&mut self, node: Node) -> Result;
    ",
                )
        };

        let block = &i.block;

        parse_quote!({
            impl crate::Node for #node_type {
                fn emit_with<W, S: swc_common::SourceMapper>(&self, e: &mut crate::Emitter<'_, W, S>) -> Result
                where
                    W: crate::text_writer::WriteJs,
                    S: swc_ecma_ast::SourceMapperExt
                {
                    e.#mtd_name(self)
                }
            }

            #block

            // Emitter methods return Result<_, _>
            // We inject this to avoid writing Ok(()) every time.
            #[allow(unreachable_code)]
            {
                return Ok(());
            }
        })
    };

    ImplItemFn { block, ..i }
}
