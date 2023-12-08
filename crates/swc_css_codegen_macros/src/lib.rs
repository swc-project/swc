#![deny(clippy::all)]

extern crate proc_macro;

use quote::ToTokens;
use syn::{parse_quote, FnArg, ImplItemFn, Type, TypeReference};

#[proc_macro_attribute]
pub fn emitter(
    _attr: proc_macro::TokenStream,
    item: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let item: ImplItemFn = syn::parse(item).expect("failed to parse input as an item");
    let item = expand(item);

    item.into_token_stream().into()
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
            impl<W> crate::Emit<#node_type> for crate::CodeGenerator<W>
            where
                W: crate::writer::CssWriter,
            {
                fn emit(&mut self, n: &#node_type) -> crate::Result {
                    self.#mtd_name(n)
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
