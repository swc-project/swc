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
    fn with_generics(mut self, generics: Generics) -> Self {
        // TODO: Check conflicting name

        match generics.lt_token {
            Some(t) => self.generics.lt_token = Some(t),
            None => {}
        }
        match generics.gt_token {
            Some(t) => self.generics.gt_token = Some(t),
            None => {}
        }

        self.generics.params.extend(generics.params.into_elements());
        match self.generics.where_clause {
            Some(WhereClause {
                ref mut predicates, ..
            }) => predicates.extend(
                generics
                    .where_clause
                    .into_iter()
                    .flat_map(|wc| wc.predicates.into_elements()),
            ),
            ref mut opt @ None => *opt = generics.where_clause,
        }

        self
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
