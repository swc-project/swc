#![feature(box_syntax)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
#[macro_use]
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
    let body = expand_method_body(&input.ident, input.body);

    Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                CONST_NAME: type_name.new_ident_with(|n| format!("_IMPL_EQ_IGNORE_SPAN_FOR_{}", n)),
                Type: type_name,
                body,
            },
            {
                #[allow(non_upper_case_globals)]
                const CONST_NAME: () = {
                    extern crate swc_common as _swc_common;
                    impl _swc_common::EqIgnoreSpan for Type {
                        fn eq_ignore_span(&self, __rhs: &Self) -> bool {
                            body
                        }
                    }
                    ()
                };
            }
        ))
        .parse()
}

/// Bind variants.
/// name is Some(EnumName) for enum, and none for struct.
fn bind_variant(
    qual_name: Path,
    v: &VariantData,
    prefix: &str,
    field_binding_mode: BindingMode,
) -> (Pat, Vec<Ident>) {
    match *v {
        VariantData::Unit => {
            // EnumName::VariantName
            let pat = Pat::Path(PatPath {
                qself: None,
                path: qual_name,
            });
            let pat = Pat::Ref(PatRef {
                pat: box pat,
                and_token: Span::call_site().as_token(),
                mutbl: Mutability::Immutable,
            });

            // Unit tuple does not have field bindings
            (pat, vec![])
        }
        VariantData::Struct(ref fields, brace_token) => {
            let mut bindings = vec![];

            let fields = fields
                .iter()
                .map(Element::into_item)
                .map(|f| f.ident.expect("struct field must have ident"))
                .map(|ident| {
                    let binded_ident = ident.new_ident_with(|s| format!("{}{}", prefix, s));
                    bindings.push(binded_ident.clone());
                    FieldPat {
                        ident,
                        pat: box PatIdent {
                            mode: field_binding_mode,
                            ident: binded_ident,
                            subpat: None,
                            at_token: None,
                        }.into(),
                        is_shorthand: false,
                        colon_token: Some(ident.span.as_token()),
                        attrs: Default::default(),
                    }
                })
                .collect();
            // EnumName::VariantName { fields }
            let pat = Pat::Struct(PatStruct {
                path: qual_name,
                fields,
                brace_token,
                dot2_token: None,
            });
            let pat = Pat::Ref(PatRef {
                pat: box pat,
                and_token: Span::call_site().as_token(),
                mutbl: Mutability::Immutable,
            });
            (pat, bindings)
        }
        VariantData::Tuple(ref fields, paren_token) => {
            // TODO
            let mut bindings = vec![];

            let pats = fields
                .iter()
                .map(Element::into_item)
                .enumerate()
                .map(|(i, _)| {
                    let binded_ident = Span::call_site().new_ident(format!("{}{}", prefix, i));
                    bindings.push(binded_ident.clone());
                    Pat::Ident(PatIdent {
                        mode: field_binding_mode,
                        ident: binded_ident,
                        subpat: None,
                        at_token: None,
                    })
                })
                .collect();
            // EnumName::VariantName { fields }
            let pat = Pat::TupleStruct(PatTupleStruct {
                path: qual_name,
                pat: PatTuple {
                    pats,
                    paren_token,
                    dots_pos: None,
                    dot2_token: None,
                    comma_token: None,
                },
            });
            let pat = Pat::Ref(PatRef {
                pat: box pat,
                and_token: Span::call_site().as_token(),
                mutbl: Mutability::Immutable,
            });
            (pat, bindings)
        }
    }
}

/// Creates method "eq_ignore_span"
fn expand_method_body(name: &Ident, body: Body) -> Expr {
    /// qual_name: EnumName::VariantName for enum,
    /// StructName for struct
    fn arm_for_variant(qual_name: Path, data: &VariantData) -> Arm {
        let span = Span::call_site();

        let binding_mode = BindingMode::ByRef(span.as_token(), Mutability::Immutable);
        let (lhs_pat, lhs_bindings) = bind_variant(qual_name.clone(), data, "lhs_", binding_mode);
        let (rhs_pat, rhs_bindings) = bind_variant(qual_name, data, "rhs_", binding_mode);

        let guard = (lhs_bindings.into_iter().zip(rhs_bindings))
            .map(|(lhs, rhs)| -> Box<Expr> {
                box Quote::from_tokens(&lhs)
                    .quote_with(smart_quote!(Vars { lhs, rhs }, {
                        _swc_ast_common::EqIgnoreSpan::eq_ignore_span(lhs, rhs)
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

    /// match *self + delegate to variants
    fn body_for_enum(name: &Ident, BodyEnum { variants, .. }: BodyEnum) -> Expr {
        let span = Span::call_site();

        let arms = variants
            .into_iter()
            .map(syn::delimited::Element::into_item)
            .map(|v| {
                arm_for_variant(
                    // EnumName::VariantName
                    Path {
                        leading_colon: None,
                        segments: vec![name.clone(), v.ident]
                            .into_iter()
                            .map(PathSegment::from)
                            .collect(),
                    },
                    &v.data,
                )
            })
            .chain(iter::once({
                // _ => false,
                Arm {
                    attrs: Default::default(),
                    pats: vec![
                        Pat::Wild(PatWild {
                            underscore_token: span.as_token(),
                        }),
                    ].into(),
                    if_token: None,
                    guard: None,
                    rocket_token: span.as_token(),
                    body: box ExprKind::Lit(Lit {
                        span: span.as_syn_span(),
                        value: LitKind::Bool(false),
                    }).into(),
                    comma: Some(span.as_token()),
                }
            }))
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

    fn body_for_struct(name: &Ident, BodyStruct { data, .. }: BodyStruct) -> Expr {
        let span = Span::call_site();

        let arms = iter::once(arm_for_variant(name.clone().into(), &data))
            .chain(iter::once({
                // _ => false,
                Arm {
                    attrs: Default::default(),
                    pats: vec![
                        Pat::Wild(PatWild {
                            underscore_token: span.as_token(),
                        }),
                    ].into(),
                    if_token: None,
                    guard: None,
                    rocket_token: span.as_token(),
                    body: box ExprKind::Lit(Lit {
                        span: span.as_syn_span(),
                        value: LitKind::Bool(false),
                    }).into(),
                    comma: Some(span.as_token()),
                }
            }))
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

    match body {
        Body::Enum(e) => body_for_enum(name, e),
        Body::Struct(s) => body_for_struct(name, s),
    }
}
