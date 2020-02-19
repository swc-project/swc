use darling::FromField;
use pmutil::{smart_quote, Quote, ToTokensExt};
use swc_macros_common::prelude::*;
use syn::*;

#[derive(Debug, FromField)]
#[darling(attributes(fold))]
pub struct FieldAttrs {
    ///
    #[darling(default)]
    pub ignore: bool,

    /// Should we add bound for the field's type?
    #[darling(default)]
    pub bound: bool,
}

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
                    (Type: swc_common::FoldWith<__Fold>)
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

                    let field_name: TokenStream = binding
                        .field()
                        .ident
                        .as_ref()
                        .map(|s| s.dump())
                        .unwrap_or_else(|| {
                            // Use index

                            // call_site is important for unexported tuple fields.
                            Index {
                                index: binding.idx() as _,
                                span: call_site(),
                            }
                            .dump()
                        });

                    let value = if should_skip_field(binding.field()) {
                        Quote::new(def_site::<Span>()).quote_with(smart_quote!(
                            Vars {
                                binded_field: binding.name(),
                            },
                            { binded_field }
                        ))
                    } else {
                        Quote::new(def_site::<Span>()).quote_with(smart_quote!(
                            Vars {
                                FieldType: &binding.field().ty,
                                binded_field: binding.name(),
                            },
                            { swc_common::Fold::<FieldType>::fold(_f, binded_field,) }
                        ))
                    };

                    let v = Quote::new(def_site::<Span>())
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
                // Handle unit-like structs separately
                Fields::Unit => Box::new(
                    Quote::new(def_site::<Span>())
                        .quote_with(smart_quote!(Vars { Name: qual_name }, {
                            {
                                return Name;
                            }
                        }))
                        .parse(),
                ),
                _ => Box::new(
                    Quote::new(def_site::<Span>())
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
                .quote_with(smart_quote!(Vars {}, { self }))
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
                impl<__Fold> swc_common::FoldWith<__Fold> for Type {
                    #[inline]
                    #[allow(clippy::needless_return)]
                    fn fold_children(self, _f: &mut __Fold) -> Self {
                        body
                    }
                }
            }
        ))
        .parse();
    derive_generics.append_to(item)
}

pub fn should_skip_field(field: &Field) -> bool {
    let attrs = FieldAttrs::from_field(field).expect("#[derive(Fold)]: failed to parse attribute");
    if attrs.ignore {
        return true;
    }

    let ty_str = field.ty.dump().to_string();
    match &*ty_str {
        "bool" | "usize" | "u128" | "u64" | "u32" | "u16" | "u8" | "isize" | "i128" | "i64"
        | "i32" | "i16" | "i8" | "f64" | "f32" | "String" => return true,
        _ => {}
    }

    false
}

pub fn normalize_type_for_bound(ty: Type) -> Type {
    use syn::fold::Fold;

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
                        if let GenericArgument::Type(ref ty) = *args.args.last().unwrap() {
                            if let Type::Path(TypePath { ref path, .. }) = *ty {
                                return self.fold_path(path.clone());
                            }
                        }
                    }
                }
            }

            fold::fold_path(self, path)
        }
    }

    Norm.fold_type(ty)
}
