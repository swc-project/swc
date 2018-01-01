//! # Example
//!
//! `_binded_a`, `_binded_b` and `_binded_0` in below example are
//! `BinededField`.
//!
//! ```rust
//! struct S {
//!   a: u8,
//!   b: u16,
//! }
//! let s = S { a: 0, b: 0, };
//! match s {
//!   S { a: _binded_a, b: _binded_b } => {}
//! }
//! enum E {
//!   V1 { a: u8 },
//!   V2(u16),
//!   V3,
//! }
//! let e = E::V1{ a: 0 };
//! match e {
//!   E::V1 { a: _binded_a } => {}
//!   E::V2(_binded_0) => {}
//!   E::V3 => {}
//! }
//! ```
//!
//!
//! -----
//!
//! Adopted from `synstructure`.
use pmutil::prelude::*;
use proc_macro2::Span;
use quote::{ToTokens, Tokens};
use syn::*;
use syn::punctuated::Element;
use syn::token::{Mut, Ref};
use syn_ext::ElementExt;

/// Used to bind whole struct or enum.
#[derive(Debug, Clone)]
pub struct Binder<'a> {
    ident: &'a Ident,
    body: &'a Data,
    attrs: &'a [Attribute],
}

impl<'a> Binder<'a> {
    /// - `attrs`: Attributes of the type.
    pub const fn new(ident: &'a Ident, body: &'a Data, attrs: &'a [Attribute]) -> Self {
        Binder { ident, body, attrs }
    }
    pub fn new_from(input: &'a DeriveInput) -> Self {
        Self::new(&input.ident, &input.data, &input.attrs)
    }

    ///
    pub fn variants(&self) -> Vec<VariantBinder<'a>> {
        match *self.body {
            Data::Enum(DataEnum { ref variants, .. }) => {
                let enum_name = &self.ident;
                variants
                    .iter()
                    .map(Element::into_item)
                    .map(|v| VariantBinder::new(Some(enum_name), &v.ident, &v.fields, &v.attrs))
                    .collect()
            }
            Data::Struct(DataStruct { ref fields, .. }) => {
                vec![VariantBinder::new(None, &self.ident, fields, self.attrs)]
            }
            Data::Union(_) => unimplemented!("Binder for union type"),
        }
    }
}

/// Variant.
#[derive(Debug, Clone)]
pub struct VariantBinder<'a> {
    /// None for struct.
    enum_name: Option<&'a Ident>,
    /// Name of variant.
    name: &'a Ident,
    data: &'a Fields,
    attrs: &'a [Attribute],
}

impl<'a> VariantBinder<'a> {
    pub const fn new(
        enum_name: Option<&'a Ident>,
        name: &'a Ident,
        data: &'a Fields,
        attrs: &'a [Attribute],
    ) -> Self {
        VariantBinder {
            enum_name,
            name,
            data,
            attrs,
        }
    }

    pub const fn variant_name(&self) -> &Ident {
        self.name
    }

    pub const fn data(&self) -> &Fields {
        self.data
    }
    pub const fn attrs(&self) -> &[Attribute] {
        self.attrs
    }

    /// `EnumName::VariantName` for enum, and `StructName` for struct.
    pub fn qual_path(&self) -> Path {
        match self.enum_name {
            Some(enum_name) => Quote::new_call_site()
                .quote_with(smart_quote!(
                    Vars {
                        EnumName: enum_name,
                        VariantName: self.name,
                    },
                    { EnumName::VariantName }
                ))
                .parse(),
            None => self.name.clone().into(),
        }
    }

    ///  - `prefix`: prefix of field binding.
    pub fn bind(
        &self,
        prefix: &str,
        by_ref: Option<Ref>,
        mutability: Option<Mut>,
    ) -> (Pat, Vec<BindedField<'a>>) {
        let path = self.qual_path();

        let (pat, bindings) = match self.data {
            &Fields::Unit => {
                // EnumName::VariantName
                let pat = Pat::Path(PatPath { qself: None, path });

                // Unit struct does not have any field to bind
                (pat, vec![])
            }
            &Fields::Named(FieldsNamed {
                ref fields,
                brace_token,
            }) => {
                let mut bindings = vec![];

                let fields = fields
                    .iter()
                    .map(|e| {
                        let (t, p) = e.into_tuple();
                        Element::new(t, p.cloned())
                    })
                    .enumerate()
                    .map(|(idx, f)| {
                        f.map_item(|f| {
                            let ident = f.ident
                                .expect("field of struct-like variants should have name");

                            let binded_ident = ident.new_ident_with(|s| format!("{}{}", prefix, s));
                            bindings.push(BindedField {
                                idx,
                                binded_ident: binded_ident.clone(),
                                field: f,
                            });
                            FieldPat {
                                attrs: Default::default(),
                                colon_token: f.colon_token,
                                member: Member::Named(ident),
                                pat: box Pat::Ident(PatIdent {
                                    by_ref,
                                    mutability,
                                    ident: binded_ident,
                                    subpat: None,
                                }),
                            }
                        })
                    })
                    .collect();
                // EnumName::VariantName { fields }
                let pat = Pat::Struct(PatStruct {
                    path,
                    fields,
                    brace_token,
                    dot2_token: None,
                });
                (pat, bindings)
            }
            &Fields::Unnamed(FieldsUnnamed {
                ref fields,
                paren_token,
            }) => {
                // TODO
                let mut bindings = vec![];

                let pats = fields
                    .iter()
                    .map(|e| {
                        let (t, p) = e.into_tuple();
                        Element::new(t, p.cloned())
                    })
                    .enumerate()
                    .map(|(idx, f)| {
                        f.map_item(|f| {
                            let binded_ident =
                                Span::call_site().new_ident(format!("{}{}", prefix, idx));
                            bindings.push(BindedField {
                                idx,
                                binded_ident: binded_ident.clone(),
                                field: f,
                            });

                            Pat::Ident(PatIdent {
                                by_ref,
                                mutability,
                                ident: binded_ident,
                                subpat: None,
                            })
                        })
                    })
                    .collect();
                // EnumName::VariantName ( fields )
                let pat = Pat::TupleStruct(PatTupleStruct {
                    path,
                    pat: PatTuple {
                        dot2_token: None,
                        front: pats,
                        back: Default::default(),
                        paren_token,
                        comma_token: None,
                    },
                });
                (pat, bindings)
            }
        };

        // if we don't need to move fields, we should match on reference to make tuple
        // work.
        let pat = match by_ref {
            Some(ref_token) => Pat::Ref(PatRef {
                pat: box pat,
                and_token: ref_token.0.as_token(),
                mutability,
            }),
            None => pat,
        };

        (pat, bindings)
    }
}

/// Binded field. Note that this struct acts like a binded variable for
/// `quote!`.
///
///
#[derive(Debug, Clone)]
pub struct BindedField<'a> {
    binded_ident: Ident,
    idx: usize,
    field: &'a Field,
}

impl<'a> BindedField<'a> {
    pub const fn idx(&self) -> usize {
        self.idx
    }

    /// Name of field binding.
    pub const fn name(&self) -> &Ident {
        &self.binded_ident
    }

    pub const fn field(&self) -> &Field {
        self.field
    }
}

impl<'a> ToTokens for BindedField<'a> {
    fn to_tokens(&self, t: &mut Tokens) {
        self.binded_ident.to_tokens(t)
    }
}
