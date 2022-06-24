#![deny(clippy::all)]

extern crate proc_macro;

use pmutil::{smart_quote, Quote, ToTokensExt};
use syn::{FnArg, ImplItemMethod, Type, TypeReference};

#[proc_macro_attribute]
pub fn emitter(
    _attr: proc_macro::TokenStream,
    item: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let item: ImplItemMethod = syn::parse(item).expect("failed to parse input as an item");
    let item = expand(item);

    item.dump().into()
}

fn expand(i: ImplItemMethod) -> ImplItemMethod {
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
                            ty.dump()
                        ),
                    }
                })
                .expect(
                    "#[emitter] methods should have signature of
fn (&mut self, node: Node) -> Result;
    ",
                )
        };

        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    block: &i.block,
                    NodeType: &node_type,
                    mtd_name,
                },
                {
                    {
                        impl<W> crate::Emit<NodeType> for crate::CodeGenerator<'_, W>
                        where
                            W: crate::writer::HtmlWriter,
                        {
                            fn emit(&mut self, n: &NodeType) -> crate::Result {
                                self.mtd_name(n)
                            }
                        }

                        block

                        // Emitter methods return Result<_, _>
                        // We inject this to avoid writing Ok(()) every time.
                        #[allow(unreachable_code)]
                        {
                            return Ok(());
                        }
                    }
                }
            ))
            .parse()
    };

    ImplItemMethod { block, ..i }
}
