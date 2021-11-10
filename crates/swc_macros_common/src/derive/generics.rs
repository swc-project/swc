use super::*;
use quote::quote;
use std::collections::BTreeSet;
use syn::visit::{self, Visit};

impl<'a> Derive<'a> {
    pub fn all_generic_fields(&self) -> Vec<&'a Field> {
        struct TypeVisitor<'a> {
            params: &'a BTreeSet<Ident>,
            is_generic: bool,
        }

        impl<'a, 'b> Visit<'a> for TypeVisitor<'b> {
            fn visit_path(&mut self, path: &Path) {
                if let Some(seg) = path.segments.last() {
                    if seg.ident == "PhantomData" {
                        // Hardcoded exception.
                        // This assumes name of the associated type is not PhantomData.
                        return;
                    }
                }

                if path.leading_colon.is_none() {
                    if let Some(seg) = path.segments.first() {
                        let id = &seg.ident;
                        if self.params.contains(id) {
                            self.is_generic = true;
                        }
                    }
                }

                visit::visit_path(self, path)
            }
            fn visit_macro(&mut self, _: &Macro) {}
        }

        struct FieldVisitor<'a> {
            /// Type parameters defined on type.
            params: BTreeSet<Ident>,
            fields: Vec<&'a Field>,
        }

        impl<'a: 'b, 'b> Visit<'a> for FieldVisitor<'b> {
            fn visit_field(&mut self, field: &'a Field) {
                let mut vis = TypeVisitor {
                    params: &self.params,
                    is_generic: false,
                };
                vis.visit_type(&field.ty);
                if vis.is_generic {
                    self.fields.push(field);
                }
            }
        }

        let mut vis = FieldVisitor {
            params: self
                .input
                .generics
                .params
                .iter()
                .filter_map(|p| match *p {
                    GenericParam::Type(TypeParam { ref ident, .. }) => Some(ident.clone()),
                    _ => None,
                })
                .collect(),
            fields: vec![],
        };

        vis.visit_derive_input(self.input);
        vis.fields
    }

    pub fn add_where_predicates<I>(&mut self, preds: I)
    where
        I: IntoIterator<Item = WherePredicate>,
    {
        let preds = preds.into_iter().map(|t| Pair::Punctuated(t, def_site()));

        match self.out.generics.where_clause {
            Some(WhereClause {
                ref mut predicates, ..
            }) => {
                if !predicates.empty_or_trailing() {
                    predicates.push_punct(def_site());
                }

                predicates.extend(preds)
            }
            None => {
                self.out.generics.where_clause = Some(WhereClause {
                    where_token: def_site(),
                    predicates: preds.collect(),
                })
            }
        }
    }

    /// Add `Self: #trait_`.
    pub fn bound_self(&mut self, trait_: Path) {
        let self_ty: Type = parse(quote!(Self).into()).unwrap();

        let bound = WherePredicate::Type(PredicateType {
            lifetimes: None,
            bounded_ty: self_ty,
            colon_token: def_site(),
            // `Trait` in `Self: Trait`
            bounds: iter::once(Pair::End(TypeParamBound::Trait(TraitBound {
                modifier: TraitBoundModifier::None,
                lifetimes: None,
                path: trait_,
                paren_token: None,
            })))
            .collect(),
        });

        self.add_where_predicates(iter::once(bound))
    }
}
