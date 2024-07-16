use proc_macro2::{Span, TokenStream};
use quote::quote;
use syn::{parse_quote, Attribute, File, Ident, Item, ItemTrait, TraitItem, Visibility};

pub fn generate(node_types: &[&Item]) -> File {
    let mut output = File {
        shebang: None,
        attrs: Vec::new(),
        items: Vec::new(),
    };

    for &kind in [TraitKind::Visit, TraitKind::VisitMut, TraitKind::Fold].iter() {
        for &variant in [Variant::Normal, Variant::AstPath].iter() {
            output
                .items
                .push(declare_visit_trait(kind, variant, node_types));

            output
                .items
                .extend(declare_visit_with_trait(kind, variant, node_types));
        }
    }

    output
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum TraitKind {
    Visit,
    VisitMut,
    Fold,
}

impl TraitKind {
    pub fn method_prefix(self) -> &'static str {
        match self {
            TraitKind::Visit => "visit",
            TraitKind::VisitMut => "visit_mut",
            TraitKind::Fold => "fold",
        }
    }

    pub fn trait_prefix(self) -> &'static str {
        match self {
            TraitKind::Visit => "Visit",
            TraitKind::VisitMut => "VisitMut",
            TraitKind::Fold => "Fold",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Variant {
    Normal,
    AstPath,
}

fn parameter_type_token(kind: TraitKind, ty: TokenStream) -> TokenStream {
    match kind {
        TraitKind::Visit => quote!(&#ty),
        TraitKind::VisitMut => quote!(&mut #ty),
        TraitKind::Fold => ty,
    }
}

/// This includes `->`
fn return_type_token(kind: TraitKind, ty: TokenStream) -> TokenStream {
    match kind {
        TraitKind::Visit => quote!(),
        TraitKind::VisitMut => quote!(),
        TraitKind::Fold => quote!(-> #ty),
    }
}

fn param_extra_token(kind: TraitKind, variant: Variant) -> TokenStream {
    match variant {
        Variant::Normal => quote!(),
        Variant::AstPath => quote!(, ast_path: &mut AstPath),
    }
}

fn trait_name(kind: TraitKind, variant: Variant, with: bool) -> Ident {
    let name = kind.trait_prefix();

    let name = if with {
        format!("{}With", name)
    } else {
        name.to_string()
    };

    match variant {
        Variant::Normal => Ident::new(&name, Span::call_site()),
        Variant::AstPath => Ident::new(&format!("{}AstPath", name), Span::call_site()),
    }
}

fn base_trait_attrs(kind: TraitKind, variant: Variant) -> Vec<Attribute> {
    let mut attrs = vec![];

    if variant == Variant::AstPath {
        attrs.push(parse_quote!(#[cfg(any(docsrs, feature = "path"))]));
        attrs.push(parse_quote!(#[cfg_attr(docsrs, doc(cfg(feature = "path")))]));
    }

    attrs
}

fn visit_method_name(kind: TraitKind, variant: Variant, with: bool) -> Ident {
    let name = kind.method_prefix();

    let name = if with {
        format!("{}_with", name)
    } else {
        name.to_string()
    };

    if variant == Variant::AstPath {
        Ident::new(&format!("{}_ast_path", name), Span::call_site())
    } else {
        Ident::new(&name, Span::call_site())
    }
}

fn declare_visit_trait(kind: TraitKind, variant: Variant, node_types: &[&Item]) -> Item {
    let trait_name = trait_name(kind, variant, false);
    let attrs = base_trait_attrs(kind, variant);
    let mut trait_methods: Vec<TraitItem> = vec![];

    parse_quote! {
        /// A visitor trait for traversing the AST.
        #(#attrs)*
        pub trait #trait_name {
            #(#trait_methods)*
        }
    }
}

fn declare_visit_with_trait(kind: TraitKind, variant: Variant, node_types: &[&Item]) -> Vec<Item> {
    let visitor_trait_name = trait_name(kind, variant, false);
    let trait_name = trait_name(kind, variant, true);
    let attrs = base_trait_attrs(kind, variant);
    let mut visit_with_trait_methods: Vec<TraitItem> = vec![];

    {
        let ast_path_extra = param_extra_token(kind, variant);
        let return_type = return_type_token(kind, quote!(Self));

        let visit_with_name = Ident::new(
            &format!(
                "{}_with{}",
                kind.method_prefix(),
                if variant == Variant::AstPath {
                    "_ast_path"
                } else {
                    ""
                }
            ),
            Span::call_site(),
        );
        let visit_with_children_name = Ident::new(
            &format!(
                "{}_children_with{}",
                kind.method_prefix(),
                if variant == Variant::AstPath {
                    "_ast_path"
                } else {
                    ""
                }
            ),
            Span::call_site(),
        );

        visit_with_trait_methods.push(parse_quote!(
            /// Calls a visitor method (visitor.fold_xxx) with self.
            fn #visit_with_name(&mut self, visitor: &mut V #ast_path_extra) #return_type;
        ));

        visit_with_trait_methods.push(parse_quote!(
            /// Visit children nodes of `self`` with `visitor`.
            fn #visit_with_children_name(&mut self, visitor: &mut V #ast_path_extra) #return_type;
        ));
    }

    let mut items: Vec<Item> = vec![];
    items.push(parse_quote!(
        /// A trait implemented for types that can be visited using a visitor.
        #(#attrs)*
        pub trait #trait_name<V: ?Sized + #visitor_trait_name> {
            #(#visit_with_trait_methods)*
        }
    ));

    items
}
