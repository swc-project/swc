extern crate proc_macro;

use pmutil::{q, ToTokensExt};
use swc_macros_common::{
    call_site,
    prelude::{BindedField, VariantBinder},
};
use syn::{
    parse, punctuated::Punctuated, Arm, Attribute, Expr, ExprMatch, ExprStruct, Field, FieldValue,
    Fields, Index, Item, ItemEnum, ItemImpl, ItemMod, ItemStruct, Member, Path, Token, Type,
    Visibility,
};

#[proc_macro_attribute]
pub fn ast_for_plugin(
    input: proc_macro::TokenStream,
    module: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let normal_crate_path: Path = parse(input).expect("failed to parse argument as path");

    let module: ItemMod = parse(module).expect("failed to parse input as a module");
    let content = module.content.expect("module should have content").1;

    let mut mod_items = vec![];

    for mut item in content {
        match &mut item {
            Item::Struct(s) => {
                add_stable_abi(&mut s.attrs);
                patch_fields(&mut s.fields);

                mod_items.push(Item::Impl(make_unstable_ast_impl_for_struct(
                    &normal_crate_path,
                    &s,
                )));
            }

            Item::Enum(s) => {
                add_stable_abi(&mut s.attrs);

                for v in s.variants.iter_mut() {
                    patch_fields(&mut v.fields);
                }

                mod_items.push(Item::Impl(make_unstable_ast_impl_for_enum(
                    &normal_crate_path,
                    &s,
                )));
            }

            _ => {}
        }

        mod_items.push(item);
    }

    ItemMod {
        content: Some((call_site(), mod_items)),
        ..module
    }
    .dump()
    .into()
}

fn patch_fields(f: &mut Fields) {
    match f {
        Fields::Named(f) => {
            f.named.iter_mut().for_each(|f| {
                patch_field(f);
            });
        }
        Fields::Unnamed(f) => {
            f.unnamed.iter_mut().for_each(|f| {
                patch_field(f);
            });
        }
        Fields::Unit => {}
    }
}

fn patch_field(f: &mut Field) {
    f.vis = Visibility::Inherited;
    f.ty = patch_field_type(&f.ty);
}

fn patch_field_type(ty: &Type) -> Type {
    if let Some(ty) = get_generic(&ty, "Box") {
        return q!(
            Vars {
                ty: patch_field_type(ty),
            },
            (abi_stable::std_types::RBox<ty>)
        )
        .parse();
    }

    if let Some(ty) = get_generic(ty, "Vec") {
        return q!(
            Vars {
                ty: patch_field_type(ty),
            },
            (abi_stable::std_types::RVec<ty>)
        )
        .parse();
    }

    if let Some(ty) = get_generic(ty, "Option") {
        return q!(
            Vars {
                ty: patch_field_type(ty),
            },
            (abi_stable::std_types::ROption<ty>)
        )
        .parse();
    }

    match ty {
        Type::Path(p) => {
            if p.path.is_ident("String") {
                return q!((abi_stable::std_types::RString)).parse();
            }
        }
        _ => {}
    }

    ty.clone()
}

fn get_generic<'a>(ty: &'a Type, wrapper_name: &str) -> Option<&'a Type> {
    match ty {
        Type::Path(ty) => {
            let ident = ty.path.segments.first().unwrap();

            if ident.ident != wrapper_name {
                return None;
            }

            match &ident.arguments {
                syn::PathArguments::None => None,
                syn::PathArguments::AngleBracketed(generic) => generic
                    .args
                    .iter()
                    .filter_map(|arg| match arg {
                        syn::GenericArgument::Type(ty) => Some(ty),
                        _ => None,
                    })
                    .next(),
                syn::PathArguments::Parenthesized(_) => todo!(),
            }
        }
        _ => None,
    }
}

fn add_stable_abi(attrs: &mut Vec<Attribute>) {
    let s = q!({
        #[repr(C)]
        #[derive(abi_stable::StableAbi)]
        struct Dummy;
    })
    .parse::<ItemStruct>();

    attrs.extend(s.attrs)
}

fn make_unstable_ast_impl_for_struct(normal_crate_path: &Path, src: &ItemStruct) -> ItemImpl {
    let binder = [VariantBinder::new(
        None,
        &src.ident,
        &src.fields,
        &src.attrs,
    )];

    q!(
        Vars {
            normal_crate_path,
            Type: &src.ident,
            from_unstable_body: make_from_unstable_impl_body(normal_crate_path, &binder),
            into_unstable_body: make_into_unstable_impl_body(normal_crate_path, &binder),
        },
        {
            impl rplugin::StableAst for Type {
                type Unstable = normal_crate_path::Type;

                fn from_unstable(unstable_node: Self::Unstable) -> Self {
                    from_unstable_body
                }

                fn into_unstable(self) -> Self::Unstable {
                    into_unstable_body
                }
            }
        }
    )
    .parse()
}

fn make_unstable_ast_impl_for_enum(normal_crate_path: &Path, src: &ItemEnum) -> ItemImpl {
    let binder = src
        .variants
        .iter()
        .map(|v| VariantBinder::new(Some(&src.ident), &v.ident, &v.fields, &v.attrs))
        .collect::<Vec<_>>();

    q!(
        Vars {
            normal_crate_path,
            Type: &src.ident,
            from_unstable_body: make_from_unstable_impl_body(normal_crate_path, &binder),
            into_unstable_body: make_into_unstable_impl_body(normal_crate_path, &binder),
        },
        {
            impl rplugin::StableAst for Type {
                type Unstable = normal_crate_path::Type;

                fn from_unstable(unstable_node: Self::Unstable) -> Self {
                    from_unstable_body
                }

                fn into_unstable(self) -> Self::Unstable {
                    into_unstable_body
                }
            }
        }
    )
    .parse()
}

fn make_field_values<F>(fields: Vec<BindedField>, mut op: F) -> Punctuated<FieldValue, Token![,]>
where
    F: FnMut(&BindedField) -> Expr,
{
    fields
        .into_iter()
        .map(|f| {
            // Call from_unstable for each field
            FieldValue {
                attrs: Default::default(),
                member: f
                    .field()
                    .ident
                    .clone()
                    .map(Member::Named)
                    .unwrap_or_else(|| Member::Unnamed(Index::from(f.idx()))),
                colon_token: Some(call_site()),
                expr: op(&f),
            }
        })
        .collect()
}

fn make_from_unstable_impl_body(normal_crate_path: &Path, variants: &[VariantBinder]) -> Expr {
    let mut arms = vec![];

    for v in variants {
        let (pat, fields) = v.bind("_", None, None);

        let fields = make_field_values(fields, |f| {
            q!(Vars { name: &f.name() }, {
                rplugin::StableAst::from_unstable(name)
            })
            .parse()
        });

        let pat = q!(
            Vars {
                pat,
                normal_crate_path
            },
            { normal_crate_path::pat }
        )
        .parse();

        arms.push(Arm {
            attrs: Default::default(),
            pat,
            guard: Default::default(),
            fat_arrow_token: call_site(),
            body: Box::new(Expr::Struct(ExprStruct {
                attrs: Default::default(),
                path: v.qual_path(),
                fields,
                dot2_token: None,
                brace_token: call_site(),
                rest: None,
            })),
            comma: Some(call_site()),
        });
    }

    Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: call_site(),
        expr: q!((unstable_node)).parse(),
        brace_token: call_site(),
        arms,
    })
}

fn make_into_unstable_impl_body(normal_crate_path: &Path, variants: &[VariantBinder]) -> Expr {
    let mut arms = vec![];

    for v in variants {
        let (pat, fields) = v.bind("_", None, None);

        let fields = make_field_values(fields, |f| {
            q!(Vars { name: &f.name() }, {
                rplugin::StableAst::into_unstable(name)
            })
            .parse()
        });

        arms.push(Arm {
            attrs: Default::default(),
            pat,
            guard: Default::default(),
            fat_arrow_token: call_site(),
            body: Box::new(Expr::Struct(ExprStruct {
                attrs: Default::default(),
                path: q!(
                    Vars {
                        normal_crate_path,
                        Type: v.qual_path()
                    },
                    { normal_crate_path::Type }
                )
                .parse(),
                fields,
                dot2_token: None,
                brace_token: call_site(),
                rest: None,
            })),
            comma: Some(call_site()),
        });
    }

    Expr::Match(ExprMatch {
        attrs: Default::default(),
        match_token: call_site(),
        expr: q!((self)).parse(),
        brace_token: call_site(),
        arms,
    })
}
