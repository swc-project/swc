use pmutil::{q, SpanExt};
use proc_macro2::TokenStream;
use quote::ToTokens;
use swc_macros_common::{access_field, join_stmts};
use syn::{DeriveInput, Expr, Field, Fields, Stmt};

pub fn expand(input: DeriveInput) -> TokenStream {
    match &input.data {
        syn::Data::Struct(s) => {
            let body = call_merge_for_fields(&q!({ self }), &s.fields);
            let body = join_stmts(&body);

            q!(
                Vars {
                    Type: &input.ident,
                    body
                },
                {
                    #[automatically_derived]
                    impl swc_config::merge::Merge for Type {
                        fn merge(&mut self, _other: Self) {
                            body
                        }
                    }
                }
            )
            .into()
        }
        syn::Data::Enum(_) => unimplemented!("derive(Merge) does not support an enum"),
        syn::Data::Union(_) => unimplemented!("derive(Merge) does not support a union"),
    }
}

fn call_merge_for_fields(obj: &dyn ToTokens, fields: &Fields) -> Vec<Stmt> {
    fn call_merge(obj: &dyn ToTokens, idx: usize, f: &Field) -> Expr {
        let r = q!({ _other });
        q!(
            Vars {
                l: access_field(obj, idx, f),
                r: access_field(&r, idx, f),
            },
            { swc_config::merge::Merge::merge(&mut l, r) }
        )
        .parse()
    }

    match fields {
        Fields::Named(fs) => fs
            .named
            .iter()
            .enumerate()
            .map(|(idx, f)| call_merge(obj, idx, f))
            .map(|expr| Stmt::Semi(expr, fs.brace_token.span.as_token()))
            .collect(),
        Fields::Unnamed(fs) => fs
            .unnamed
            .iter()
            .enumerate()
            .map(|(idx, f)| call_merge(obj, idx, f))
            .map(|expr| Stmt::Semi(expr, fs.paren_token.span.as_token()))
            .collect(),
        Fields::Unit => unimplemented!("derive(Merge) does not support a unit struct"),
    }
}
