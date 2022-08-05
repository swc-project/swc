use proc_macro2::Span;
use syn::{punctuated::Punctuated, Expr, ExprStruct, FieldValue, Ident, Member, Token};

pub(crate) struct Builder {
    type_name: syn::Ident,
    fields: Punctuated<FieldValue, Token![,]>,
}

impl Builder {
    pub fn new(ident: &str) -> Self {
        Self {
            type_name: Ident::new(ident, Span::call_site()),
            fields: Default::default(),
        }
    }

    pub fn add(&mut self, name: &str, value: Expr) {
        self.fields.push(FieldValue {
            attrs: Default::default(),
            member: Member::Named(Ident::new(name, Span::call_site())),
            colon_token: Some(Default::default()),
            expr: value,
        });
    }

    pub fn build(self) -> ExprStruct {
        let type_name = self.type_name;

        ExprStruct {
            attrs: Default::default(),
            brace_token: Default::default(),
            path: syn::parse_quote!(swc_core::ast::#type_name),
            fields: self.fields,
            dot2_token: Default::default(),
            rest: Default::default(),
        }
    }
}
