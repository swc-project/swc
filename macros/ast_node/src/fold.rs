use common::prelude::*;

pub fn derive(input: DeriveInput) -> ItemImpl {
    let mut derive_generics = Derive::new(&input);

    let preds = derive_generics
        .all_generic_fields()
        .into_iter()
        .filter(|f| {
            f.attrs
                .iter()
                .any(|attr| is_attr_name(attr, "fold") && attr.tts.to_string() == "( bound )")
        })
        .map(|f| f.ty.clone())
        .map(normalize_type_for_bound)
        .map(|ty| {
            Quote::new(Span::def_site())
                .quote_with(smart_quote!(
                    Vars { Type: &ty },
                    (Type: swc_common::FoldWith<__Folder>)
                ))
                .parse()
        });
    derive_generics.add_where_predicates(preds);

    let arms = Binder::new_from(&input)
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
                                span: def_site(),
                            }.dump()
                        });

                    let value = match should_skip_field(binding.field()) {
                        true => Quote::new(Span::def_site()).quote_with(smart_quote!(
                            Vars {
                                binded_field: binding.name(),
                            },
                            { binded_field }
                        )),
                        false => Quote::new(Span::def_site()).quote_with(smart_quote!(
                            Vars {
                                FieldType: &binding.field().ty,
                                binded_field: binding.name(),
                            },
                            { swc_common::Folder::<FieldType>::fold(__folder, binded_field,) }
                        )),
                    };

                    let v = Quote::new(Span::def_site())
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
                .map(|t| Element::Punctuated(t, def_site()))
                .collect();

            let body = match *v.data() {
                // Handle unit like structs separately
                Fields::Unit => box Quote::new(Span::def_site())
                    .quote_with(smart_quote!(Vars { Name: qual_name }, {
                        {
                            return Name;
                        }
                    }))
                    .parse(),
                _ => box Quote::new(Span::def_site())
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

    let item = Quote::new(Span::def_site())
        .quote_with(smart_quote!(
            Vars {
                Type: &input.ident,
                body,
            },
            {
                impl<__Folder> swc_common::FoldWith<__Folder> for Type {
                    fn fold_children(self, __folder: &mut __Folder) -> Self {
                        body
                    }
                }
            }
        ))
        .parse();
    let item = derive_generics.append_to(item);

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

fn normalize_type_for_bound(ty: Type) -> Type {
    use syn::fold::{self, Fold};

    struct Norm;
    impl Fold for Norm {
        fn fold_path(&mut self, path: Path) -> Path {
            if path.segments.len() == 1 {
                let seg = &path.segments[0];
                if seg.ident != "Box" && seg.ident != "Option" && seg.ident != "Vec" {
                    return path.clone();
                }

                if let PathArguments::AngleBracketed(ref args) = seg.arguments {
                    if args.args.len() == 1 {
                        if let GenericArgument::Type(ref ty) =
                            *args.args.last().unwrap().into_value()
                        {
                            match *ty {
                                Type::Path(TypePath { ref path, .. }) => {
                                    return self.fold_path(path.clone())
                                }
                                _ => {}
                            }
                        }
                    }
                }
            }

            fold::fold_path(self, path)
        }
    }

    let out = Norm.fold_type(ty);
    out
}
