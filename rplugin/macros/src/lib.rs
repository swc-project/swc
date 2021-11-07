extern crate proc_macro;

use pmutil::{q, Quote, ToTokensExt};
use swc_macros_common::call_site;
use syn::{parse, Attribute, Fields, Item, ItemImpl, ItemMod, ItemStruct, Lit, Path, Type};

#[proc_macro_attribute]
pub fn ast_for_plugin(
    input: proc_macro::TokenStream,
    module: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let normal_crate_path: Lit = parse(input).expect("failed to parse argument as path");

    let module: ItemMod = parse(module).expect("failed to parse input as a module");
    let content = module.content.expect("module should have content").1;

    let mut mod_items = vec![];

    for mut item in content {
        match &mut item {
            Item::Struct(s) => {
                add_stable_abi(&mut s.attrs);
                patch_fields(&mut s.fields);
                // q.push_tokens(&make_unstable_ast_impl_for_struct(&
                // normal_crate_path, &s));
            }

            Item::Enum(s) => {
                add_stable_abi(&mut s.attrs);

                for v in s.variants.iter_mut() {
                    patch_fields(&mut v.fields);
                }
            }

            _ => {
                todo!("Support: {:?}", item)
            }
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
                f.ty = patch_field_type(&f.ty);
            });
        }
        Fields::Unnamed(f) => {
            f.unnamed.iter_mut().for_each(|f| {
                f.ty = patch_field_type(&f.ty);
            });
        }
        Fields::Unit => panic!("#[ast_for_plugin] does not support unit field"),
    }
}

// fn make_unstable_ast_impl_for_struct(normal_crate_path: &Path, src:
// &ItemStruct) -> ItemImpl {}

fn patch_field_type(ty: &Type) -> Type {
    if let Some(ty) = get_generic(&ty, "Box") {
        return q!(
            Vars {
                ty: patch_field_type(ty),
            },
            (abi_stable::RBox<ty>)
        )
        .parse();
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
