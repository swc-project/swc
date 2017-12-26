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
    let body = expand_method_body(&input.ident, &input.body, &input.attrs);

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
fn expand_method_body(ident: &Ident, body: &Body, attrs: &[Attribute]) -> Expr {
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

        let binding_mode = BindingMode::ByRef(span.as_token(), Mutability::Immutable);
        let (lhs_pat, lhs_bindings) = v.bind("lhs_", binding_mode);
        let (rhs_pat, rhs_bindings) = v.bind("rhs_", binding_mode);

        let guard = (lhs_bindings.into_iter().zip(rhs_bindings))
            .map(|(lhs, rhs)| -> Box<Expr> {
                box Quote::from_tokens(&lhs)
                    .quote_with(smart_quote!(Vars { lhs, rhs }, {
                        ::swc_common::EqIgnoreSpan::eq_ignore_span(lhs, rhs)
                    }))
                    .parse()
            })
            .fold(None, |orig, additional_guard| match orig {
                Some(orig) => Some(box Quote::new_call_site()
                    .quote_with(smart_quote!(
                        Vars {
                            orig,
                            additional_guard,
                        },
                        { orig && additional_guard }
                    ))
                    .parse()),
                None => Some(additional_guard),
            });

        // (lhs_pat, rhs_pat) if guard => true
        Arm {
            attrs: Default::default(),
            pats: vec![
                Pat::Tuple(PatTuple {
                    pats: vec![lhs_pat, rhs_pat].into(),
                    comma_token: None,
                    dots_pos: None,
                    dot2_token: None,
                    paren_token: span.as_token(),
                }),
            ].into(),
            if_token: if guard.is_some() {
                Some(span.as_token())
            } else {
                None
            },
            guard,
            rocket_token: span.as_token(),
            body: box ExprKind::Lit(Lit {
                span: span.as_syn_span(),
                value: LitKind::Bool(true),
            }).into(),
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

    ExprKind::Match(ExprMatch {
        match_token: span.as_token(),
        expr: box Quote::new(span)
            .quote_with(smart_quote!(Vars {}, { (&*self, &*__rhs) }))
            .parse(),
        brace_token: span.as_token(),
        arms,
    }).into()
}
