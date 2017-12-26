use common::prelude::*;
use std::iter;

pub fn derive_caniuse(input: &DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(input)
        .variants()
        .into_iter()
        .map(|v| {
            let (pat, bindings) =
                v.bind("_", BindingMode::ByRef(call_site(), Mutability::Immutable));

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

            let body = box ExprKind::Block(ExprBlock {
                block: Block {
                    brace_token: call_site(),
                    stmts,
                },
            }).into();

            Arm {
                attrs: v.attrs()
                    .iter()
                    .filter(|attr| is_attr_name(attr, "cfg"))
                    .cloned()
                    .collect(),
                pats: vec![pat].into(),
                if_token: None,
                guard: None,
                rocket_token: call_site(),
                body,
                comma: Some(call_site()),
            }
        })
        .chain(iter::once(
            Quote::new_call_site()
                .quote_with(smart_quote!(Vars {}, {
                    _ => {},
                }))
                .parse::<Arm>(),
        ))
        .collect();

    let match_expr: Expr = ExprKind::Match(ExprMatch {
        match_token: call_site(),
        brace_token: call_site(),
        expr: box Quote::new_call_site()
            .quote_with(smart_quote!(Vars {}, { &*self }))
            .parse(),
        arms,
    }).into();

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

            assert_eq!(attr.tts.len(), 2, "expected `= 'feature'`");
            match attr.tts[0].0.kind {
                TokenNode::Op('=', _) => {}
                _ => panic!("expected `= 'feature'`"),
            }
            match attr.tts[1].0.kind {
                TokenNode::Literal(ref lit) => found = Some(lit),
                _ => panic!("expected `= 'feature'`"),
            }
        }

        if let Some(found) = found {
            found
        } else {
            return None;
        }
    };

    let feat = Lit {
        span: SynSpan(Span::call_site()),
        value: LitKind::Other(lit.clone()),
    };

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
            if segments.len() == 1 && segments.first().unwrap().item().ident.sym.as_str() == "bool"
            {
                return true;
            }
        }
        _ => {}
    }

    false
}
