use common::prelude::*;

pub fn derive(input: DeriveInput) -> ItemImpl {
    let type_name = &input.ident;
    match input.data {
        Data::Enum(..) => {}
        _ => panic!("Cannot derive ToCode for non-emum types"),
    }

    let arms = Binder::new_from(&input)
        .variants()
        .into_iter()
        .map(|v| {
            let (pat, bindings) = v.bind("_", Some(call_site()), None);
            if bindings.len() != 1 {
                panic!("cannot derive ToCode for enum if fields.len() != 1")
            }
            let binding = bindings.into_iter().next().unwrap();
            let body = box Quote::new_call_site()
                .quote_with(smart_quote!(
                    Vars { binding },
                    (return swc_common::ToCode::to_code(binding, __w))
                ))
                .parse();

            Arm {
                body,
                attrs: v.attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pats: vec![Element::End(pat)].into_iter().collect(),
                guard: None,
                rocket_token: call_site(),
                comma: Some(call_site()),
            }
        })
        .collect();
    let body = Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: call_site(),
        brace_token: call_site(),
        expr: box Quote::new_call_site()
            .quote_with(smart_quote!(Vars {}, { self }))
            .parse(),
        arms,
    });

    let item = Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                Type: type_name,
                body,
            },
            {
                impl swc_common::ToCode for Type {
                    fn to_code<W: ::std::io::Write>(&self, __w: W) -> ::std::io::Result<()> {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(input.generics.clone());

    item
}
