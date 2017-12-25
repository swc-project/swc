#![feature(box_syntax)]

extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
extern crate quote;
extern crate syn;
use pmutil::{IdentExt, SpanExt};
use pmutil::synom_ext::FromSpan;
use proc_macro2::Span;
use syn::*;
use syn::delimited::Element;

pub mod prelude;

pub fn call_site<T: FromSpan>() -> T {
    Span::call_site().as_token()
}

/// `attr` - tokens inside `#[]`. e.g. `derive(EqIgnoreSpan)`, ast_node
pub fn print<T: Into<proc_macro2::TokenStream>>(
    attr: &'static str,
    t: T,
) -> proc_macro::TokenStream {
    use std::env;

    let tokens = t.into();

    match env::var("PRINT_GENERATED") {
        Ok(ref s) if s == "1" || attr == s => {}
        _ => return tokens.into(),
    }

    println!("\n\tOutput of #[{}]:\n\t {}", attr, tokens);
    tokens.into()
}

/// Bind fields of variant.
/// name is Some(EnumName) for enum, and none for struct.
///
/// Returns pattern for variant and idents of binded fields.
pub fn bind_variant(
    qual_name: Path,
    v: &VariantData,
    prefix: &str,
    field_binding_mode: BindingMode,
) -> (Pat, Vec<Ident>) {
    match v {
        &VariantData::Unit => {
            // EnumName::VariantName
            let pat = Pat::Path(PatPath {
                qself: None,
                path: qual_name,
            });
            let pat = Pat::Ref(PatRef {
                pat: box pat,
                and_token: Span::call_site().as_token(),
                mutbl: Mutability::Immutable,
            });

            // Unit tuple does not have field bindings
            (pat, vec![])
        }
        &VariantData::Struct(ref fields, brace_token) => {
            let mut bindings = vec![];

            let fields = fields
                .iter()
                .map(Element::into_item)
                .map(|f| f.ident.expect("struct field must have ident"))
                .map(|ident| {
                    let binded_ident = ident.new_ident_with(|s| format!("{}{}", prefix, s));
                    bindings.push(binded_ident.clone());
                    FieldPat {
                        ident,
                        pat: box PatIdent {
                            mode: field_binding_mode,
                            ident: binded_ident,
                            subpat: None,
                            at_token: None,
                        }.into(),
                        is_shorthand: false,
                        colon_token: Some(ident.span.as_token()),
                        attrs: Default::default(),
                    }
                })
                .collect();
            // EnumName::VariantName { fields }
            let pat = Pat::Struct(PatStruct {
                path: qual_name,
                fields,
                brace_token,
                dot2_token: None,
            });
            let pat = Pat::Ref(PatRef {
                pat: box pat,
                and_token: Span::call_site().as_token(),
                mutbl: Mutability::Immutable,
            });
            (pat, bindings)
        }
        &VariantData::Tuple(ref fields, paren_token) => {
            // TODO
            let mut bindings = vec![];

            let pats = fields
                .iter()
                .map(Element::into_item)
                .enumerate()
                .map(|(i, _)| {
                    let binded_ident = Span::call_site().new_ident(format!("{}{}", prefix, i));
                    bindings.push(binded_ident.clone());
                    Pat::Ident(PatIdent {
                        mode: field_binding_mode,
                        ident: binded_ident,
                        subpat: None,
                        at_token: None,
                    })
                })
                .collect();
            // EnumName::VariantName { fields }
            let pat = Pat::TupleStruct(PatTupleStruct {
                path: qual_name,
                pat: PatTuple {
                    pats,
                    paren_token,
                    dots_pos: None,
                    dot2_token: None,
                    comma_token: None,
                },
            });
            let pat = Pat::Ref(PatRef {
                pat: box pat,
                and_token: Span::call_site().as_token(),
                mutbl: Mutability::Immutable,
            });
            (pat, bindings)
        }
    }
}

pub fn is_attr_name(attr: &Attribute, name: &str) -> bool {
    match *attr {
        Attribute {
            path:
                Path {
                    leading_colon: None,
                    ref segments,
                },
            is_sugared_doc: false,
            ..
        } if segments.len() == 1 =>
        {
            segments.first().unwrap().into_item().ident == name
        }
        _ => false,
    }
}

/// fail! is a panic! with location reporting.
#[macro_export]
macro_rules! fail {
    ($($args:tt)+) => {{
        panic!("{}\n --> {}:{}:{}", format_args!($($args)*), file!(), line!(), column!());
    }};
}

#[macro_export]
macro_rules! unimplemented {
    ($($args:tt)+) => {{
        fail!("not yet implemented: {}", format_args!($($args)*));
    }};
}

#[macro_export]
macro_rules! unreachable {
    () => {{
        fail!("internal error: unreacable");
    }};
    ($($args:tt)+) => {{
        fail!("internal error: unreacable\n{}", format_args!($($args)*));
    }};
}
