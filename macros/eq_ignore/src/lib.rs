use pmutil::q;
use pmutil::IdentExt;
use pmutil::SpanExt;
use proc_macro2::Span;
use syn::parse;
use syn::punctuated::Punctuated;
use syn::spanned::Spanned;
use syn::Arm;
use syn::BinOp;
use syn::Block;
use syn::Data;
use syn::DeriveInput;
use syn::Expr;
use syn::ExprBinary;
use syn::ExprBlock;
use syn::Field;
use syn::FieldPat;
use syn::Fields;
use syn::Ident;
use syn::Index;
use syn::Member;
use syn::Pat;
use syn::PatIdent;
use syn::PatStruct;
use syn::PatTuple;
use syn::Path;
use syn::Stmt;
use syn::Token;

/// Derives `swc_common::TypeEq`.
///
/// - Field annotated with `#[use_eq]` will be compared using `==`.
/// - Field annotated with `#[not_type]` will be ignored
#[proc_macro_derive(TypeEq, attributes(not_type, use_eq, use_eq_ignore_span))]
pub fn derive_type_eq(item: proc_macro::TokenStream) -> proc_macro::TokenStream {
    Deriver {
        trait_name: Ident::new("TypeEq", Span::call_site()),
        method_name: Ident::new("type_eq", Span::call_site()),
        ignore_field: Box::new(|field| {
            // Search for `#[not_type]`.
            for attr in &field.attrs {
                if attr.path.is_ident("not_type") {
                    return true;
                }
            }

            false
        }),
    }
    .derive(item)
}

/// Derives `swc_common::EqIgnoreSpan`.
///
///
/// Fields annotated with `#[not_spanned]` or `#[use_eq]` will use` ==` instead
/// of `eq_ignore_span`.
#[proc_macro_derive(EqIgnoreSpan, attributes(not_spanned, use_eq))]
pub fn derive_eq_ignore_span(item: proc_macro::TokenStream) -> proc_macro::TokenStream {
    Deriver {
        trait_name: Ident::new("EqIgnoreSpan", Span::call_site()),
        method_name: Ident::new("eq_ignore_span", Span::call_site()),
        ignore_field: Box::new(|_field| {
            // We call eq_ignore_span for all fields.
            false
        }),
    }
    .derive(item)
}

struct Deriver {
    trait_name: Ident,
    method_name: Ident,
    ignore_field: Box<dyn Fn(&Field) -> bool>,
}

impl Deriver {
    fn derive(&self, item: proc_macro::TokenStream) -> proc_macro::TokenStream {
        let input: DeriveInput = parse(item).unwrap();

        let body = self.make_body(&input.data);

        q!(
            Vars {
                TraitName: &self.trait_name,
                Type: &input.ident,
                method_name: &self.method_name,
                body,
            },
            {
                #[automatically_derived]
                impl ::swc_common::TraitName for Type {
                    #[allow(non_snake_case)]
                    fn method_name(&self, other: &Self) -> bool {
                        body
                    }
                }
            }
        )
        .into()
    }

    fn make_body(&self, data: &Data) -> Expr {
        match data {
            Data::Struct(s) => {
                let arm = self.make_arm_from_fields(q!({ Self }).parse(), &s.fields);

                q!(Vars { arm }, (match (self, other) { arm })).parse()
            }
            Data::Enum(e) => {
                //
                let mut arms = Punctuated::<_, Token![,]>::default();
                for v in &e.variants {
                    let arm = self.make_arm_from_fields(
                        q!(Vars { Variant: &v.ident }, { Self::Variant }).parse(),
                        &v.fields,
                    );

                    arms.push(arm);
                }

                arms.push(
                    q!({
                        _ => false
                    })
                    .parse(),
                );

                q!(Vars { arms }, (match (self, other) { arms })).parse()
            }
            Data::Union(_) => unimplemented!("union"),
        }
    }

    fn make_arm_from_fields(&self, pat_path: Path, fields: &Fields) -> Arm {
        let mut l_pat_fields = Punctuated::<_, Token![,]>::default();
        let mut r_pat_fields = Punctuated::<_, Token![,]>::default();
        let mut exprs = vec![];

        for (i, field) in fields
            .iter()
            .enumerate()
            .filter(|(_, f)| !(self.ignore_field)(f))
        {
            let method_name = if field
                .attrs
                .iter()
                .any(|attr| attr.path.is_ident("not_spanned") || attr.path.is_ident("use_eq"))
            {
                Ident::new("eq", Span::call_site())
            } else if field
                .attrs
                .iter()
                .any(|attr| attr.path.is_ident("use_eq_ignore_span"))
            {
                Ident::new("eq_ignore_span", Span::call_site())
            } else {
                self.method_name.clone()
            };

            let base = field
                .ident
                .clone()
                .unwrap_or_else(|| Ident::new(&format!("_{}", i), field.ty.span()));
            //
            let l_binding_ident = base.new_ident_with(|base| format!("_l_{}", base));
            let r_binding_ident = base.new_ident_with(|base| format!("_r_{}", base));

            let make_pat_field = |ident: &Ident| FieldPat {
                attrs: Default::default(),
                member: match &field.ident {
                    Some(v) => Member::Named(v.clone()),
                    None => Member::Unnamed(Index {
                        index: i as _,
                        span: field.ty.span(),
                    }),
                },
                colon_token: Some(ident.span().as_token()),
                pat: Box::new(Pat::Ident(PatIdent {
                    attrs: Default::default(),
                    by_ref: Some(field.ident.span().as_token()),
                    mutability: None,
                    ident: ident.clone(),
                    subpat: None,
                })),
            };

            l_pat_fields.push(make_pat_field(&l_binding_ident));
            r_pat_fields.push(make_pat_field(&r_binding_ident));

            exprs.push(
                q!(
                    Vars {
                        method_name: &method_name,
                        l: &l_binding_ident,
                        r: &r_binding_ident
                    },
                    { l.method_name(r) }
                )
                .parse::<Expr>(),
            );
        }

        // true && a.type_eq(&other.a) && b.type_eq(&other.b)
        let mut expr: Expr = q!({ true }).parse();

        for expr_el in exprs {
            expr = Expr::Binary(ExprBinary {
                attrs: Default::default(),
                left: Box::new(expr),
                op: BinOp::And(Span::call_site().as_token()),
                right: Box::new(expr_el),
            });
        }

        Arm {
            attrs: Default::default(),
            pat: Pat::Tuple(PatTuple {
                attrs: Default::default(),
                paren_token: Span::call_site().as_token(),
                elems: {
                    let mut elems = Punctuated::default();
                    elems.push(Pat::Struct(PatStruct {
                        attrs: Default::default(),
                        path: pat_path.clone(),
                        brace_token: Span::call_site().as_token(),
                        fields: l_pat_fields,
                        dot2_token: Some(Span::call_site().as_token()),
                    }));
                    elems.push(Pat::Struct(PatStruct {
                        attrs: Default::default(),
                        path: pat_path,
                        brace_token: Span::call_site().as_token(),
                        fields: r_pat_fields,
                        dot2_token: Some(Span::call_site().as_token()),
                    }));
                    elems
                },
            }),
            guard: Default::default(),
            fat_arrow_token: Span::call_site().as_token(),
            body: Box::new(Expr::Block(ExprBlock {
                attrs: Default::default(),
                label: Default::default(),
                block: Block {
                    brace_token: Span::call_site().as_token(),
                    stmts: vec![Stmt::Expr(expr)],
                },
            })),
            comma: Default::default(),
        }
    }
}
