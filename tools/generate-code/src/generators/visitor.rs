use proc_macro2::Span;
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Variant {
    Normal,
    AstPath,
}

fn visit_trait_name(kind: TraitKind, variant: Variant, with: bool) -> Ident {
    let name = match kind {
        TraitKind::Visit => "Visit",
        TraitKind::VisitMut => "VisitMut",
        TraitKind::Fold => "Fold",
    };

    let name = if with {
        format!("{}With", name)
    } else {
        name.to_string()
    };

    match variant {
        Variant::Normal => Ident::new(&name, Span::call_site()),
        Variant::AstPath => Ident::new(&format!("{}Path", name), Span::call_site()),
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

fn declare_visit_trait(kind: TraitKind, variant: Variant, node_types: &[&Item]) -> Item {
    let trait_name = visit_trait_name(kind, variant, false);
    let attrs = base_trait_attrs(kind, variant);
    let mut trait_methods: Vec<TraitItem> = vec![];

    parse_quote! {
        /// A visitor trait for traversing the AST.
        ///
        #(#attrs)*
        pub trait #trait_name {
            #(#trait_methods)*
        }
    }
}

fn declare_visit_with_trait(kind: TraitKind, variant: Variant, node_types: &[&Item]) -> Vec<Item> {
    let trait_name = visit_trait_name(kind, variant, true);
    let attrs = base_trait_attrs(kind, variant);
    let mut trait_methods: Vec<TraitItem> = vec![];

    let mut items: Vec<Item> = vec![];
    items.push(parse_quote!(
        /// A visitor trait for traversing the AST.
        ///
        #(#attrs)*
        pub trait #trait_name {
            #(#trait_methods)*
        }
    ));

    items
}
