use common::prelude::*;
use std::iter;

pub fn derive_caniuse(input: &DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(input)
        .variants()
        .into_iter()
        .map(|v| {
            let (pat, bindings) = v.bind("_", Some(call_site()), None);

            let mut stmts = vec![];
            match extract(v.attrs()) {
                Some(s) => stmts.push(s),
                _ => {}
            }

            for b in &bindings {
                // #[caniuse] on field
                let report = match extract(&b.field().attrs) {
                    Some(report) => report,
                    None => continue,
                };
                if !is_bool(&b.field().ty) {
                    panic!(
                        "#[caniuse] can be applied to bool field. {} isn't supported",
                        b.field().ty.dump()
                    )
                }

                stmts.push(
                    Quote::from_tokens(&b.field().ty)
                        .quote_with(smart_quote!(Vars { field: b, report }, {
                            if *field {
                                report
                            }
                        }))
                        .parse(),
                );
            }

            let body = box Expr::Block(ExprBlock {
                attrs: Default::default(),
                block: Block {
                    brace_token: call_site(),
                    stmts,
                },
            });

            Arm {
                attrs: v.attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pats: vec![Element::End(pat)].into_iter().collect(),
                guard: None,
                rocket_token: call_site(),
                body,
                comma: Some(call_site()),
            }
        })
        .chain(iter::once(#[cfg_attr(rustfmt, rustfmt_skip)]
            Quote::new_call_site()
                .quote_with(smart_quote!(Vars {}, {
                    _ => {},
                }))
                .parse::<Arm>()))
        .collect();

    let match_expr = Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: call_site(),
        brace_token: call_site(),
        expr: box Quote::new_call_site()
            .quote_with(smart_quote!(Vars {}, { &*self }))
            .parse(),
        arms,
    });

    Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                Type: &input.ident,
                match_expr,
            },
            {
                impl ::swc_common::compat::CanIUse for Type {
                    #[allow(unreachable_patterns, unused_attributes)]
                    fn report_used_features(
                        &self,
                        __used_features: &mut ::swc_common::compat::UsedFeatures,
                    ) {
                        match_expr
                    }
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(input.generics.clone())
}

/// Extract caniuse feature from `attrs`.
fn extract(attrs: &[Attribute]) -> Option<Stmt> {
    let lit = {
        let mut found = None;

        for attr in attrs.iter().filter(|attr| is_attr_name(attr, "caniuse")) {
            if found.is_some() {
                panic!("#[caniuse] cannot be specified multiple time on one node")
            }

            let tts: Vec<_> = attr.tts.clone().into_iter().collect();

            assert_eq!(tts.len(), 2, "expected `= 'feature'`");
            match tts[0].kind {
                TokenNode::Op('=', _) => {}
                _ => panic!("expected `= 'feature'`"),
            }
            match tts[1].kind {
                TokenNode::Literal(ref lit) => found = Some(lit.clone()),
                _ => panic!("expected `= 'feature'`"),
            }
        }

        if let Some(found) = found {
            found
        } else {
            return None;
        }
    };

    let feat = Lit::Str(LitStr::new(&lit.to_string(), call_site()));

    Some(
        Quote::new_call_site()
            .quote_with(smart_quote!(Vars { feat }, {
                *__used_features += ::swc_common::caniuse_feature!(feat);
            }))
            .parse(),
    )
}

fn is_bool(ty: &Type) -> bool {
    match *ty {
        Type::Path(TypePath {
            qself: None,
            path:
                Path {
                    leading_colon: None,
                    ref segments,
                },
        }) => {
            // check for bool
            if segments.len() == 1 && segments.first().unwrap().value().ident.as_ref() == "bool" {
                return true;
            }
        }
        _ => {}
    }

    false
}
