#![feature(box_syntax)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
#[macro_use]
extern crate quote;
extern crate swc_macros_common;
extern crate syn;

use swc_macros_common::prelude::*;

/// Creates `.as_str()` and then implements `Debug` and `Display` using it.
///
///# Input
/// Enum with \`str_value\`-style **doc** comment for each variant.
///
/// e.g.
///
///```no_run
/// pub enum BinOp {
///     /// `+`
///     Add,
///     /// `-`
///     Minus,
/// }
/// ```
///
/// Currently, \`str_value\` must be live in it's own line.
///
///# Output
///
///  - `pub fn as_str(&self) -> &'static str`
///  - `impl Debug`
///  - `impl Display`
///
///# Example
///
///
///```
/// #[macro_use]
/// extern crate string_enum;
///
/// #[derive(StringEnum)]
/// pub enum Tokens {
///     /// `a`
///     A,
///     ///`struct-like`
///     StructLike {},
///     /// `tuple-like`
///     TupleLike(u8),
/// }
/// # fn main() {
///
/// assert_eq!(Tokens::A.as_str(), "a");
/// assert_eq!(Tokens::StructLike {}.as_str(), "struct-like");
/// assert_eq!(Tokens::TupleLike(13).as_str(), "tuple-like");
///
/// assert_eq!(Tokens::A.to_string(), "a");
/// assert_eq!(format!("{:?}", Tokens::A), format!("{:?}", "a"));
///
/// # }
/// ```
///
///
/// All formatting flags are handled correctly.
#[proc_macro_derive(StringEnum)]
pub fn derive_string_enum(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = syn::parse::<syn::DeriveInput>(input)
        .map(From::from)
        .expect("failed to parse derive input");
    let mut tts = TokenStream::new();

    make_as_str(&input).to_tokens(&mut tts);

    derive_fmt(&input, quote_spanned!(call_site() => std::fmt::Debug)).to_tokens(&mut tts);
    derive_fmt(&input, quote_spanned!(call_site() => std::fmt::Display)).to_tokens(&mut tts);

    tts.into()
}

fn derive_fmt(i: &DeriveInput, trait_path: TokenStream) -> ItemImpl {
    Quote::new(def_site::<Span>())
        .quote_with(smart_quote!(
            Vars {
                Trait: trait_path,
                Type: &i.ident,
                as_str: make_as_str_ident(),
            },
            {
                impl Trait for Type {
                    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
                        let s = self.as_str();
                        Trait::fmt(s, f)
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(i.generics.clone())
        .into()
}

fn make_as_str(i: &DeriveInput) -> ItemImpl {
    fn get_str_value(attrs: &[Attribute]) -> String {
        // TODO: Accept multiline string
        let docs: Vec<_> = attrs.iter().map(doc_str).filter_map(|o| o).collect();
        for raw_line in docs {
            let line = raw_line.trim();
            if line.starts_with("`") && line.ends_with("`") {
                let mut s: String = line.split_at(1).1.into();
                let new_len = s.len() - 1;
                s.truncate(new_len);
                return s;
            }
        }

        panic!("Cannot determine string value of this variant")
    }

    let arms = Binder::new_from(&i)
        .variants()
        .into_iter()
        .map(|v| {
            // Qualified path of variant.
            let qual_name = v.qual_path();

            let str_value = get_str_value(&v.attrs());

            let body = box Quote::new(def_site::<Span>())
                .quote_with(smart_quote!(Vars { str_value }, { return str_value }))
                .parse();

            let pat = match *v.data() {
                Fields::Unit => box Pat::Path(PatPath {
                    qself: None,
                    path: qual_name,
                }),
                _ => box Quote::new(def_site::<Span>())
                    .quote_with(smart_quote!(Vars { qual_name }, { qual_name{..} }))
                    .parse(),
            };

            Arm {
                body,
                attrs: v
                    .attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pats: vec![Element::End(Pat::Ref(PatRef {
                    and_token: def_site(),
                    mutability: None,
                    pat,
                }))]
                .into_iter()
                .collect(),
                guard: None,
                fat_arrow_token: def_site(),
                comma: Some(def_site()),
                leading_vert: None,
            }
        })
        .collect();

    let body = Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: def_site(),
        brace_token: def_site(),
        expr: box Quote::new(def_site::<Span>())
            .quote_with(smart_quote!(Vars {}, { self }))
            .parse(),
        arms,
    });

    Quote::new(def_site::<Span>())
        .quote_with(smart_quote!(
            Vars {
                Type: &i.ident,
                body,
                as_str: make_as_str_ident(),
            },
            {
                impl Type {
                    pub fn as_str(&self) -> &'static str {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(i.generics.clone())
        .into()
}

fn make_as_str_ident() -> Ident {
    Ident::new("as_str", call_site())
}
