use proc_macro::TokenStream;
use quote::quote;
use syn;

/// Derives `swc_babel_compat::SerializeUnion`.
/// The `SerializeUnion` macro automatically generates a `serde::Serialize`
/// implementation for enums used to represent TypeScript style union types.
///
/// # Example
/// ```rust
/// use serde::Serialize;
/// use ser_union::SerializeUnion;
///
/// #[derive(Serialize)]
/// struct A {}
///
/// #[derive(Serialize)]
/// struct B {}
///
/// #[derive(SerializeUnion)]
/// enum X {
///     A(A),
///     B(B),
/// }
/// ```
#[proc_macro_derive(SerializeUnion)]
pub fn serialize_union_derive(input: TokenStream) -> TokenStream {
    let ast = syn::parse(input).unwrap();
    impl_serialize_union(&ast)
}

fn impl_serialize_union(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let data = match &ast.data {
        syn::Data::Enum(e) => e,
        _ => panic!("SerializeUnion can only be applied to enums"),
    };

    /// Note that `SerializeUnion` only works with enum variants that wrap another type.
    /// 
    /// ```rust
    /// #[derive(SerializeUnion)]
    /// enum X {
    ///     A, // panic!
    ///     B { value: usize }, // panic!
    ///     C(C), // ok
    /// }
    /// ```
    let vars: Vec<&syn::Ident> = data.variants.iter().map(|var| {
        match var.fields {
            syn::Fields::Unit => panic!("SerializeUnion cannot be applied to enum variant without data {}", &var.ident),j
            syn::Fields::Named(_) => panic!("SerializeUnion cannot be applied to enum variant with anonymous struct {}", &var.ident),
            syn::Fields::Unnamed(_) => &var.ident,
        }
    })
    .collect();


    let gen = quote! {
        impl serde::Serialize for #name {
            fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
            where
                S: serde::Serializer,
            {
                match self {
                    #(#name::#vars(t) => serializer.serialize_some(&t)),*
                }
            }
        }
    };
    gen.into()
}

