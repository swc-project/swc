#![feature(box_syntax, proc_macros)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
extern crate swc_macros_common as common;
extern crate syn;

use common::prelude::*;
use std::iter;

#[proc_macro_derive(EqIgnoreSpan)]
pub fn derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = syn::parse(input).expect("failed to parse derive input");

    print("derive(EqIgnoreSpan)", expand(input).into_tokens())
}

fn expand(input: DeriveInput) -> Item {
    let type_name = &input.ident;
    let body = expand_method_body(&input.ident, &input.data, &input.attrs);

    Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                Type: type_name,
                body,
            },
            {
                impl ::swc_common::EqIgnoreSpan for Type {
                    #[allow(unused_attributes, unreachable_patterns)]
                    fn eq_ignore_span(&self, __rhs: &Self) -> bool {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(input.generics)
        .into()
}

/// Creates method "eq_ignore_span"
fn expand_method_body(ident: &Ident, body: &Data, attrs: &[Attribute]) -> Expr {
    /// Creates `_ => false,`
    fn make_default_arm() -> Arm {
        Quote::new_call_site()
            .quote_with(smart_quote!(Vars {}, {
                _ => false,
            }))
            .parse()
    }

    /// qual_name: EnumName::VariantName for enum,
    /// StructName for struct
    fn arm_for_variant(v: VariantBinder) -> Arm {
        let span = Span::call_site();

        let (lhs_pat, lhs_bindings) = v.bind("lhs_", Some(span.as_token()), None);
        let (rhs_pat, rhs_bindings) = v.bind("rhs_", Some(span.as_token()), None);

        let guard = (lhs_bindings.into_iter().zip(rhs_bindings))
            .map(|(lhs, rhs)| -> Box<Expr> {
                box Quote::from_tokens(&lhs)
                    .quote_with(smart_quote!(Vars { lhs, rhs }, {
                        ::swc_common::EqIgnoreSpan::eq_ignore_span(lhs, rhs)
                    }))
                    .parse()
            })
            .fold(None, |orig, additional_guard| match orig {
                Some((if_token, orig)) => Some((
                    if_token,
                    box Quote::new_call_site()
                        .quote_with(smart_quote!(
                            Vars {
                                orig,
                                additional_guard,
                            },
                            { orig && additional_guard }
                        ))
                        .parse(),
                )),
                None => Some((span.as_token(), additional_guard)),
            });

        // (lhs_pat, rhs_pat) if guard => true
        Arm {
            attrs: Default::default(),
            pats: vec![
                Element::End(Pat::Tuple(PatTuple {
                    front: vec![
                        Element::Punctuated(lhs_pat, call_site()),
                        Element::End(rhs_pat),
                    ].into_iter()
                        .collect(),
                    comma_token: None,
                    dot2_token: None,
                    paren_token: span.as_token(),
                    back: Default::default(),
                })),
            ].into_iter()
                .collect(),
            guard,
            rocket_token: span.as_token(),
            body: box Expr::Lit(ExprLit {
                attrs: Default::default(),
                lit: Lit {
                    span,
                    value: LitKind::Bool(true),
                },
            }),
            comma: Some(span.as_token()),
        }
    }

    let span = Span::call_site();
    let arms = Binder::new(ident, body, attrs)
        .variants()
        .into_iter()
        .map(arm_for_variant)
        .chain(iter::once(make_default_arm()))
        .collect();

    Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: span.as_token(),
        expr: box Quote::new(span)
            .quote_with(smart_quote!(Vars {}, { (&*self, &*__rhs) }))
            .parse(),
        brace_token: span.as_token(),
        arms,
    })
}
