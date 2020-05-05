#![feature(box_patterns)]
#![deny(unused_variables)]
#![recursion_limit = "4096"]

#[macro_use]
extern crate pmutil;
extern crate proc_macro;

use pmutil::{Quote, ToTokensExt};
use swc_macros_common::prelude::*;
use syn::{
    ExprTryBlock, GenericArgument, Ident, ImplItemMethod, Item, ItemImpl, PathArguments,
    PathSegment, ReturnType,
};

/// Macros which should be attached to `Validate<T>` impls.
///
/// This macro implements `Visit<T>` for the type, to prevent mistakenly
/// implementing `Visit<T>` in a wrong way.
#[proc_macro_attribute]
pub fn validator(
    _: proc_macro::TokenStream,
    item: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    fn expand(item: ItemImpl) -> Vec<Item> {
        let mut items = vec![];

        // Validated type
        let ty = {
            let (_, path, _) = item
                .trait_
                .clone()
                .expect("#[validator] should be applied to Validate<T>");

            let mut segments = path.segments;

            segments[0] = PathSegment {
                ident: Ident::new("VisitMut", call_site()),
                arguments: segments[0].arguments.clone(),
            };

            let arg = match segments[0].arguments {
                PathArguments::AngleBracketed(ref args) => args.args[0].clone(),
                _ => unimplemented!("error reporting for invalid implementation of Validator<T>"),
            };
            let ty = match arg {
                GenericArgument::Type(ty) => ty,
                _ => unimplemented!("error reporting for invalid implementation of Validator<T>"),
            };

            ty
        };

        items.push(Item::Impl(
            Quote::new_call_site()
                .quote_with(smart_quote!(
                    Vars {
                        T: &ty,
                        Folder: &item.self_ty
                    },
                    {
                        #[automatically_derived]
                        /// Delegates to `Validate<T>`.
                        impl ::swc_common::VisitMut<T> for Folder {
                            #[inline]
                            fn visit_mut(&mut self, node: &mut T) {
                                let res: ::std::result::Result<_, crate::Error> =
                                    self.validate(node);

                                match res {
                                    Ok(..) => {}
                                    Err(err) => self.info.errors.push(err),
                                }
                            }
                        }
                    }
                ))
                .parse::<ItemImpl>()
                .with_generics(item.generics.clone()),
        ));

        items.push(item.clone().into());
        items
    }

    let item = syn::parse(item).expect("failed to parse input as an item");
    let items = expand(item);
    let mut buf = Quote::new_call_site();
    for item in items {
        buf.push_tokens(&item)
    }
    print("validator", buf.dump())
}

/// This macro converts
///
/// ```ignore
/// 
/// impl Foo {
///     #[validator]
///     fn validate_foo(&mut self, arg: Arg1) -> Result<Ret, ()> {
///         // body
///         Err(err)?;
///     }
/// }
/// ```
///
/// to
///
///
/// ```ignore
/// 
/// impl Foo {
///     fn validate_foo(&mut self, arg: Arg1) -> Result<Ret, ()> {
///         let res: Result<Ret, Error> = try {
///             // body
///             Err(err)?
///         };
///
///         match res {
///             Ok(v) => Ok(v),
///             Err(err) => {
///                 self.info.errors.push(err);
///                 Err(())
///             }
///         }
///     }
/// }
/// ```
#[proc_macro_attribute]
pub fn validator_method(
    _: proc_macro::TokenStream,
    item: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    fn expand_validator_method(i: ImplItemMethod) -> ImplItemMethod {
        let should_return = match i.sig.output {
            ReturnType::Default => false,
            _ => true,
        };

        let try_block = ExprTryBlock {
            attrs: Default::default(),
            try_token: call_site(),
            block: i.block,
        };

        let block = if should_return {
            Quote::new_call_site()
                .quote_with(smart_quote!(
                    Vars {
                        try_block: &try_block
                    },
                    {
                        {
                            let res: Result<_, Error> = try_block;

                            match res {
                                Ok(v) => Ok(v),
                                Err(err) => {
                                    self.info.errors.push(err);
                                    Err(())
                                }
                            }
                        }
                    }
                ))
                .parse()
        } else {
            Quote::new_call_site()
                .quote_with(smart_quote!(
                    Vars {
                        try_block: &try_block
                    },
                    {
                        {
                            let res: Result<_, Error> = try_block;

                            match res {
                                Err(err) => {
                                    self.info.errors.push(err);
                                }
                                _ => {}
                            }
                        }
                    }
                ))
                .parse()
        };

        ImplItemMethod { block, ..i }
    }

    let item = syn::parse(item).expect("failed to parse input as an item");
    let item = expand_validator_method(item);
    print("validator_method", item.dump())
}
