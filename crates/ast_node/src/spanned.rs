#![allow(dead_code)]

use pmutil::{smart_quote, Quote, ToTokensExt};
use swc_macros_common::prelude::*;
use syn::{parse::Parse, *};

struct MyField {
    /// Name of the field.
    pub ident: Option<Ident>,
    /// Type of the field.
    pub ty: Type,

    /// `#[span(lo)]`
    pub lo: bool,
    /// `#[span(hi)]`
    pub hi: bool,
}

struct InputFieldAttr {
    kinds: Punctuated<Ident, Token![,]>,
}

impl Parse for InputFieldAttr {
    fn parse(input: parse::ParseStream) -> Result<Self> {
        let kinds = input.call(Punctuated::parse_terminated)?;

        Ok(Self { kinds })
    }
}

impl MyField {
    fn from_field(f: &Field) -> Self {
        let mut lo = false;
        let mut hi = false;

        for attr in &f.attrs {
            if !is_attr_name(attr, "span") {
                continue;
            }

            match &attr.meta {
                Meta::Path(..) => {}
                Meta::List(list) => {
                    let input = parse2::<InputFieldAttr>(list.tokens.clone())
                        .expect("failed to parse as `InputFieldAttr`");

                    for kind in input.kinds {
                        if kind == "lo" {
                            lo = true
                        } else if kind == "hi" {
                            hi = true
                        } else {
                            panic!("Unknown span attribute: {:?}", kind)
                        }
                    }
                }
                _ => panic!("Unknown span attribute"),
            }
        }

        Self {
            ident: f.ident.clone(),
            ty: f.ty.clone(),
            lo,
            hi,
        }
    }
}

pub fn derive(input: DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(&input)
        .variants()
        .into_iter()
        .map(|v| {
            let (pat, bindings) = v.bind("_", Some(def_site()), None);

            let body = make_body_for_variant(&v, bindings);

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
                Type: &input.ident,
                body,
            },
            {
                impl swc_common::Spanned for Type {
                    #[inline]
                    fn span(&self) -> swc_common::Span {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(input.generics)
}

fn make_body_for_variant(v: &VariantBinder<'_>, bindings: Vec<BindedField<'_>>) -> Box<Expr> {
    /// `swc_common::Spanned::span(#field)`
    fn simple_field(field: &dyn ToTokens) -> Box<Expr> {
        Box::new(
            Quote::new(def_site::<Span>())
                .quote_with(smart_quote!(Vars { field }, {
                    swc_common::Spanned::span(field)
                }))
                .parse(),
        )
    }

    if bindings.is_empty() {
        panic!("#[derive(Spanned)] requires a field to get span from")
    }

    if bindings.len() == 1 {
        if let Fields::Unnamed(..) = *v.data() {
            // Call self.0.span()
            return simple_field(&bindings[0]);
        }
    }

    //  Handle #[span] attribute.
    if let Some(f) = bindings
        .iter()
        .find(|b| has_empty_span_attr(&b.field().attrs))
    {
        //TODO: Verify that there's no more #[span]
        return simple_field(f);
    }

    // If all fields do not have `#[span(..)]`, check for field named `span`.
    let has_any_span_attr = bindings
        .iter()
        .map(|b| {
            b.field()
                .attrs
                .iter()
                .any(|attr| is_attr_name(attr, "span"))
        })
        .any(|b| b);
    if !has_any_span_attr {
        let span_field = bindings
            .iter()
            .find(|b| {
                b.field()
                    .ident
                    .as_ref()
                    .map(|ident| ident == "span")
                    .unwrap_or(false)
            })
            .unwrap_or_else(|| {
                panic!(
                    "#[derive(Spanned)]: cannot determine span field to use for {}",
                    v.qual_path().dump()
                )
            });

        return simple_field(span_field);
    }

    let fields: Vec<_> = bindings
        .iter()
        .map(|b| (b, MyField::from_field(b.field())))
        .collect();

    // TODO: Only one field should be `#[span(lo)]`.
    let lo = fields.iter().find(|&(_, f)| f.lo);
    let hi = fields.iter().find(|&(_, f)| f.hi);

    match (lo, hi) {
        (Some((lo_field, _)), Some((hi_field, _))) => {
            // Create a new span from lo_field.lo(), hi_field.hi()
            Box::new(
                Quote::new(def_site::<Span>())
                    .quote_with(smart_quote!(Vars { lo_field, hi_field }, {
                        swc_common::Spanned::span(lo_field)
                            .with_hi(swc_common::Spanned::span(hi_field).hi())
                    }))
                    .parse(),
            )
        }
        _ => panic!("#[derive(Spanned)]: #[span(lo)] and #[span(hi)] is required"),
    }
}

/// Search for `#[span]`
fn has_empty_span_attr(attrs: &[Attribute]) -> bool {
    attrs.iter().any(|attr| {
        if !is_attr_name(attr, "span") {
            return false;
        }

        match &attr.meta {
            Meta::Path(..) => true,
            Meta::List(t) => t.tokens.is_empty(),
            _ => false,
        }
    })
}
