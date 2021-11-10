#![recursion_limit = "1024"]

extern crate proc_macro;

use pmutil::{smart_quote, Quote};
use quote::quote_spanned;
use swc_macros_common::prelude::*;
use syn::{self, *};

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
///  - `impl serde::Serialize`
///  - `impl serde::Deserialize`
///  - `impl FromStr`
///  - `impl Debug`
///  - `impl Display`
///
///# Example
///
///
///```
/// #[macro_use]
/// extern crate string_enum;
/// extern crate serde;
///
/// #[derive(StringEnum)]
/// pub enum Tokens {
///     /// `a`
///     A,
///     /// `bar`
///     B,
/// }
/// # fn main() {
///
/// assert_eq!(Tokens::A.as_str(), "a");
/// assert_eq!(Tokens::B.as_str(), "bar");
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
    make_from_str(&input).to_tokens(&mut tts);

    make_serialize(&input).to_tokens(&mut tts);
    make_deserialize(&input).to_tokens(&mut tts);

    derive_fmt(&input, quote_spanned!(call_site() => std::fmt::Debug)).to_tokens(&mut tts);
    derive_fmt(&input, quote_spanned!(call_site() => std::fmt::Display)).to_tokens(&mut tts);

    print("derive(StringEnum)", tts)
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
}

fn get_str_value(attrs: &[Attribute]) -> String {
    // TODO: Accept multiline string
    let docs: Vec<_> = attrs.iter().map(doc_str).filter_map(|o| o).collect();
    for raw_line in docs {
        let line = raw_line.trim();
        if line.starts_with('`') && line.ends_with('`') {
            let mut s: String = line.split_at(1).1.into();
            let new_len = s.len() - 1;
            s.truncate(new_len);
            return s;
        }
    }

    panic!("StringEnum: Cannot determine string value of this variant")
}

fn make_from_str(i: &DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(&i)
        .variants()
        .into_iter()
        .map(|v| {
            // Qualified path of variant.
            let qual_name = v.qual_path();

            let str_value = get_str_value(&v.attrs());

            let pat: Pat = Quote::new(def_site::<Span>())
                .quote_with(smart_quote!(Vars { str_value }, { str_value }))
                .parse();

            let body = match *v.data() {
                Fields::Unit => Box::new(
                    Quote::new(def_site::<Span>())
                        .quote_with(smart_quote!(Vars { qual_name }, { return Ok(qual_name) }))
                        .parse(),
                ),
                _ => unreachable!("StringEnum requires all variants not to have fields"),
            };

            Arm {
                body,
                attrs: v
                    .attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pat,
                guard: None,
                fat_arrow_token: def_site(),
                comma: Some(def_site()),
            }
        })
        .chain(::std::iter::once({
            Quote::new_call_site()
                .quote_with(smart_quote!(Vars{}, {
                    _ => Err(())
                }))
                .parse()
        }))
        .collect();

    let body = Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: def_site(),
        brace_token: def_site(),
        expr: Box::new(
            Quote::new_call_site()
                .quote_with(smart_quote!(Vars {}, { s }))
                .parse(),
        ),
        arms,
    });

    Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                Type: &i.ident,
                body,
            },
            {
                impl ::std::str::FromStr for Type {
                    type Err = ();
                    fn from_str(s: &str) -> Result<Self, ()> {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(i.generics.clone())
}

fn make_as_str(i: &DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(&i)
        .variants()
        .into_iter()
        .map(|v| {
            // Qualified path of variant.
            let qual_name = v.qual_path();

            let str_value = get_str_value(&v.attrs());

            let body = Box::new(
                Quote::new(def_site::<Span>())
                    .quote_with(smart_quote!(Vars { str_value }, { return str_value }))
                    .parse(),
            );

            let pat = match *v.data() {
                Fields::Unit => Box::new(Pat::Path(PatPath {
                    qself: None,
                    path: qual_name,
                    attrs: Default::default(),
                })),
                _ => Box::new(
                    Quote::new(def_site::<Span>())
                        .quote_with(smart_quote!(Vars { qual_name }, { qual_name { .. } }))
                        .parse(),
                ),
            };

            Arm {
                body,
                attrs: v
                    .attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pat: Pat::Reference(PatReference {
                    and_token: def_site(),
                    mutability: None,
                    pat,
                    attrs: Default::default(),
                }),
                guard: None,
                fat_arrow_token: def_site(),
                comma: Some(def_site()),
            }
        })
        .collect();

    let body = Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: def_site(),
        brace_token: def_site(),
        expr: Box::new(
            Quote::new(def_site::<Span>())
                .quote_with(smart_quote!(Vars {}, { self }))
                .parse(),
        ),
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
}

fn make_as_str_ident() -> Ident {
    Ident::new("as_str", call_site())
}

fn make_serialize(i: &DeriveInput) -> ItemImpl {
    Quote::new_call_site()
        .quote_with(smart_quote!(Vars { Type: &i.ident }, {
            impl ::serde::Serialize for Type {
                fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
                where
                    S: ::serde::Serializer,
                {
                    serializer.serialize_str(self.as_str())
                }
            }
        }))
        .parse::<ItemImpl>()
        .with_generics(i.generics.clone())
}

fn make_deserialize(i: &DeriveInput) -> ItemImpl {
    Quote::new_call_site()
        .quote_with(smart_quote!(Vars { Type: &i.ident }, {
            impl<'de> ::serde::Deserialize<'de> for Type {
                fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
                where
                    D: ::serde::Deserializer<'de>,
                {
                    struct StrVisitor;

                    impl<'de> ::serde::de::Visitor<'de> for StrVisitor {
                        type Value = Type;

                        fn expecting(&self, f: &mut ::std::fmt::Formatter) -> ::std::fmt::Result {
                            // TODO: List strings
                            write!(f, "one of (TODO)")
                        }

                        fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
                        where
                            E: ::serde::de::Error,
                        {
                            // TODO
                            value.parse().map_err(|()| E::unknown_variant(value, &[]))
                        }
                    }

                    deserializer.deserialize_str(StrVisitor)
                }
            }
        }))
        .parse::<ItemImpl>()
        .with_generics(i.generics.clone())
}
