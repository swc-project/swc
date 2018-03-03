use swc_macros_common::prelude::*;

pub fn derive(input: DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(&input)
        .variants()
        .into_iter()
        .map(|v| {
            let (pat, bindings) = v.bind("_", Some(def_site()), None);

            let body = make_body_for_variant(&v, bindings);

            Arm {
                body,
                attrs: v.attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pats: vec![Element::End(pat)].into_iter().collect(),
                guard: None,
                rocket_token: def_site(),
                comma: Some(def_site()),
            }
        })
        .collect();

    let body = Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: def_site(),
        brace_token: def_site(),
        expr: box Quote::new(Span::def_site())
            .quote_with(smart_quote!(Vars {}, { self }))
            .parse(),
        arms,
    });

    Quote::new(Span::def_site())
        .quote_with(smart_quote!(
            Vars {
                Type: &input.ident,
                body,
            },
            {
                impl swc_common::Spanned for Type {
                    fn span(&self) -> swc_common::Span {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(input.generics)
}

fn make_body_for_variant(v: &VariantBinder, bindings: Vec<BindedField>) -> Box<Expr> {
    if bindings.len() == 0 {
        panic!("#[derive(Spanned)] requires a field to get span from")
    }

    if bindings.len() == 1 {
        match *v.data() {
            Fields::Unnamed(..) => {
                // Call self.0.span()
                return box Quote::new(Span::def_site())
                    .quote_with(smart_quote!(
                        Vars {
                            field: &bindings[0],
                        },
                        { swc_common::Spanned::span(field) }
                    ))
                    .parse();
            }
            _ => {}
        }
    }

    // TODO: Handle #[span] attribute.

    let span_field = bindings
        .iter()
        .find(|b| {
            let s = b.field().ident.as_ref().map(|ident| ident.as_ref());
            Some("span") == s
        })
        .unwrap_or_else(|| {
            panic!(
                "#[derive(Spanned)]: cannot determine span field to use for {}",
                v.qual_path().dump()
            )
        });

    box Quote::new(Span::def_site())
        .quote_with(smart_quote!(Vars { span_field }, { span_field }))
        .parse()
}
