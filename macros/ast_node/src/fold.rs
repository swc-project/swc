use common::prelude::*;

pub fn derive_fold(input: &DeriveInput) -> ItemImpl {
    let arms = Binder::new_from(input)
        .variants()
        .into_iter()
        .map(|v| {
            // Qualified path of variant.
            let qual_name = v.qual_path();

            let (pat, bindings) = v.bind("_", None, None);

            let fields: Punctuated<FieldValue, token::Comma> = bindings
                .into_iter()
                .map(|binding| {
                    // This closure will not be called for unit-like struct.

                    let field_name: Tokens = binding
                        .field()
                        .ident
                        .as_ref()
                        .map(|s| s.dump())
                        .unwrap_or_else(|| {
                            Index {
                                index: binding.idx() as _,
                                span: call_site(),
                            }.dump()
                        });

                    let value = match should_skip_field(binding.field()) {
                        true => Quote::new_call_site().quote_with(smart_quote!(
                            Vars {
                                binded_field: binding.name(),
                            },
                            { binded_field }
                        )),
                        false => Quote::new_call_site().quote_with(smart_quote!(
                            Vars {
                                FieldType: &binding.field().ty,
                                binded_field: binding.name(),
                            },
                            {
                                ::swc_common::fold::Folder::<FieldType>::fold(
                                    __folder,
                                    binded_field,
                                )
                            }
                        )),
                    };

                    let v = Quote::new_call_site()
                        .quote_with(smart_quote!(
                            Vars { field_name, value },
                            (field_name: value)
                        ))
                        .parse::<FieldValue>();
                    FieldValue {
                        attrs: binding
                            .field()
                            .attrs
                            .iter()
                            .filter(|attr| is_attr_name(attr, "cfg"))
                            .cloned()
                            .collect(),
                        ..v
                    }
                })
                .map(|t| Element::Punctuated(t, call_site()))
                .collect();

            let body = match *v.data() {
                // Handle unit like structs separately
                Fields::Unit => box Quote::new_call_site()
                    .quote_with(smart_quote!(Vars { Name: qual_name }, {
                        {
                            return Name;
                        }
                    }))
                    .parse(),
                _ => box Quote::new_call_site()
                    .quote_with(smart_quote!(
                        Vars {
                            Name: qual_name,
                            fields,
                        },
                        {
                            {
                                return Name { fields };
                            }
                        }
                    ))
                    .parse(),
            };

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
                Type: &input.ident,
                body,
            },
            {
                #[automatically_derived]
                impl<__Folder> ::swc_common::fold::FoldWith<__Folder> for Type {
                    fn fold_children(self, __folder: &mut __Folder) -> Self {
                        body
                    }
                }
            }
        ))
        .parse::<ItemImpl>();

    let item = item.with_generics(input.generics.clone());

    // println!("Expaned:\n {}\n\n", item.dump());

    item
}

fn should_skip_field(field: &Field) -> bool {
    let ty_str = field.ty.dump().to_string();
    match &*ty_str {
        "bool" | "usize" | "u128" | "u64" | "u32" | "u16" | "u8" | "isize" | "i128" | "i64"
        | "i32" | "i16" | "i8" | "f64" | "f32" | "String" => return true,
        _ => {}
    }

    false
}
