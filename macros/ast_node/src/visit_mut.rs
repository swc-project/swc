use crate::fold::{normalize_type_for_bound, should_skip_field};
use pmutil::{smart_quote, Quote};
use swc_macros_common::prelude::*;
use syn::*;

pub fn derive(input: DeriveInput) -> ItemImpl {
    let mut derive_generics = Derive::new(&input);

    let preds = derive_generics
        .all_generic_fields()
        .into_iter()
        .filter(|f| {
            f.attrs.iter().any(|attr| {
                is_attr_name(attr, "fold") && (attr.tokens.to_string().contains("bound"))
            })
        })
        .map(|f| f.ty.clone())
        .map(normalize_type_for_bound)
        .map(|ty| {
            Quote::new(def_site::<Span>())
                .quote_with(smart_quote!(
                    Vars { Type: &ty },
                    (Type: swc_common::VisitWith<__V>)
                ))
                .parse()
        });
    derive_generics.add_where_predicates(preds);

    let arms = Binder::new_from(&input)
        .variants()
        .into_iter()
        .map(|v| {
            let (pat, bindings) = v.bind("_", Some(def_site()), Some(def_site()));

            let fields: Punctuated<Stmt, token::Semi> = bindings
                .into_iter()
                .filter_map(|binding| {
                    // This closure will not be called for unit-like struct.

                    let value = if should_skip_field(binding.field()) {
                        None
                    } else {
                        Some(
                            Quote::new(def_site::<Span>())
                                .quote_with(smart_quote!(
                                    Vars {
                                        FieldType: &binding.field().ty,
                                        binded_field: binding.name(),
                                    },
                                    {
                                        swc_common::VisitMut::<FieldType>::visit_mut(
                                            _v,
                                            binded_field,
                                        );
                                    }
                                ))
                                .parse::<Stmt>(),
                        )
                    };

                    let _attrs = binding
                        .field()
                        .attrs
                        .iter()
                        .filter(|attr| is_attr_name(attr, "cfg"))
                        .cloned()
                        .collect::<Vec<_>>();

                    value
                })
                .map(|t| Element::Punctuated(t, def_site()))
                .collect();

            let body = match *v.data() {
                // Handle unit-like structs separately
                Fields::Unit => Box::new(
                    Quote::new(def_site::<Span>())
                        .quote_with(smart_quote!(Vars {}, {
                            {
                                // no-op
                            }
                        }))
                        .parse(),
                ),
                _ => Box::new(
                    Quote::new(def_site::<Span>())
                        .quote_with(smart_quote!(Vars { fields }, {
                            {
                                fields
                            }
                        }))
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
                .quote_with(smart_quote!(Vars {}, { *self }))
                .parse(),
        ),
        arms,
    });

    let item = Quote::new(def_site::<Span>())
        .quote_with(smart_quote!(
            Vars {
                Type: &input.ident,
                body,
            },
            {
                impl<__V> swc_common::VisitMutWith<__V> for Type {
                    #[inline]
                    fn visit_mut_children(&mut self, _v: &mut __V) {
                        body
                    }
                }
            }
        ))
        .parse();
    derive_generics.append_to(item)
}
