use syn::*;
use syn::punctuated::Element;

/// Extension trait for `ItemImpl` (impl block).
pub trait ItemImplExt {
    /// Instead of
    ///
    /// ```rust,ignore
    /// let (impl_generics, ty_generics, where_clause) = input.generics.split_for_impl();
    ///
    /// let item: Item = Quote::new_call_site()
    ///     .quote_with(smart_quote!(
    ///         Vars {
    ///             Type: type_name,
    ///             impl_generics,
    ///             ty_generics,
    ///             where_clause,
    ///         },
    ///         {
    ///             impl impl_generics ::swc_common::AstNode for Type ty_generics
    ///                     where_clause {}
    ///         }
    ///     ))
    ///     .parse();
    /// ```
    ///
    /// You can use this like
    ///
    /// ```rust,ignore
    // let item = Quote::new_call_site()
    ///     .quote_with(smart_quote!(Vars { Type: type_name }, {
    ///         impl ::swc_common::AstNode for Type {}
    ///     }))
    ///     .parse::<ItemImpl>()
    ///     .with_generics(input.generics);
    /// ```
    ///
    fn with_generics(self, generics: Generics) -> Self;
}

impl ItemImplExt for ItemImpl {
    fn with_generics(self, generics: Generics) -> Self {
        assert_eq!(
            self.generics,
            Generics::default(),
            "currently with_generics only works for ItemImpl without generic"
        );

        let ItemImpl {
            self_ty: ty,
            trait_,
            ..
        } = self;

        let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();

        let tokens = match trait_ {
            Some((polarity, trait_path, for_token)) => {
                quote!{
                    impl #impl_generics #polarity #trait_path #for_token
                        #ty #ty_generics #where_clause {}
                }
            }
            None => {
                quote!{
                    impl #impl_generics #ty #ty_generics #where_clause {}
                }
            }
        };

        // new impl item
        let new_item: ItemImpl = parse(tokens.into()).unwrap();

        let ItemImpl {
            attrs,
            defaultness,
            unsafety,
            impl_token,
            brace_token,
            items,
            ..
        } = self;

        ItemImpl {
            attrs,
            defaultness,
            unsafety,
            impl_token,
            brace_token,
            items,
            ..new_item
        }
    }
}

pub trait ElementExt<T, P>: Sized + Into<Element<T, P>> {
    fn map_item<F, NewItem>(self, op: F) -> Element<NewItem, P>
    where
        F: FnOnce(T) -> NewItem,
    {
        match self.into() {
            Element::Punctuated(t, p) => Element::Punctuated(op(t), p),
            Element::End(t) => Element::End(op(t)),
        }
    }
}

impl<T, P> ElementExt<T, P> for Element<T, P> {}
