use common::prelude::*;
use input::*;
use util::{is_attr_name, is_bool};

pub fn expand(
    Input {
        attrs,
        name,
        variants,
        generics,
        vis,
    }: Input,
) -> Item {
    let items = attrs
        .fns
        .into_iter()
        .map(|f| f.expand(&name, vis.clone(), &variants))
        .map(ImplItem::Method)
        .fold(Tokens::new(), |mut t, i| {
            i.to_tokens(&mut t);
            t
        });

    let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();

    Quote::new_call_site()
        .quote_with(smart_quote!(
        Vars {
            impl_generics,
            name,
            ty_generics,
            where_clause,
            items,
        },
        {
            impl impl_generics name ty_generics where_clause {
                items
            }
        }
    ))
        .parse()
}

impl FnDef {
    fn expand(self, enum_name: &Ident, vis: Visibility, variants: &[EnumVar]) -> ImplItemMethod {
        let FnDef {
            name,
            return_type,
            default_value,
        } = self;

        let name_span = name.span;

        let arms = variants
            .iter()
            .map(|v| -> Arm {
                // Pattern for this variant.
                let pat = match v.data {
                    VariantData::Struct(ref _fields, _) => Quote::new_call_site()
                        .quote_with(smart_quote!(
                        Vars {
                            EnumName: enum_name,
                            VariantName: v.name,
                        },
                        { &EnumName::VariantName {..} }
                    ))
                        .parse::<Pat>(),
                    VariantData::Tuple(ref _fields, _) => Quote::new_call_site()
                        .quote_with(smart_quote!(
                            Vars {
                                EnumName: enum_name,
                                VariantName: v.name,
                            },
                            { &EnumName::VariantName(..) }
                        ))
                        .parse::<Pat>(),
                    VariantData::Unit => Quote::new_call_site()
                        .quote_with(smart_quote!(
                            Vars {
                                EnumName: enum_name,
                                VariantName: v.name,
                            },
                            { &EnumName::VariantName }
                        ))
                        .parse::<Pat>(),
                };

                let body = {
                    let value = match v.attrs
                        .fn_values
                        .iter()
                        .find(|fn_val| fn_val.fn_name == name)
                        .map(|attr| attr.value.clone())
                    {
                        Some(Some(value)) => Some(value),

                        // if return type is bool and attribute is specified, it return true.
                        Some(None) if is_bool(&return_type) => Some(
                            ExprKind::Lit(Lit {
                                value: LitKind::Bool(true),
                                span: SynSpan(Span::call_site()),
                            }).into(),
                        ),
                        _ => None,
                    };

                    value
                        .or_else(|| default_value.clone())
                        .map(Box::new)
                        .unwrap_or_else(|| {
                            panic!(
                                "value of {fn_name} for {variant} is not specified.",
                                fn_name = name,
                                variant = v.name
                            );
                        })
                };

                Arm {
                    pats: vec![pat].into(),
                    body,

                    // Forward cfg attributes.
                    attrs: v.attrs
                        .extras
                        .iter()
                        .filter(|attr| is_attr_name(attr, "cfg"))
                        .cloned()
                        .collect(),
                    rocket_token: call_site(),
                    comma: Some(call_site()),
                    guard: None,
                    if_token: None,
                }
            })
            .collect();

        // match self {}
        let match_expr = ExprKind::Match(ExprMatch {
            match_token: call_site(),
            brace_token: call_site(),

            expr: Quote::new_call_site()
                .quote_with(smart_quote!(Vars {}, { self }))
                .parse::<Expr>()
                .into(),

            arms,
        }).into();

        ImplItemMethod {
            sig: MethodSig {
                constness: Constness::NotConst,
                unsafety: Unsafety::Normal,
                abi: None,
                ident: name,
                // fn (&self) -> ReturnTpe
                decl: FnDecl {
                    fn_token: name.span.as_token(),
                    paren_token: name.span.as_token(),
                    inputs: vec![
                        // TODO
                        FnArg::SelfRef(ArgSelfRef {
                            and_token: name_span.as_token(),
                            self_token: name_span.as_token(),
                            lifetime: None,
                            mutbl: Mutability::Immutable,
                        }),
                    ].into(),
                    output: ReturnType::Type(return_type, name_span.as_token()),
                    generics: Default::default(),
                    variadic: false,
                    dot_tokens: None,
                },
            },

            block: Block {
                brace_token: call_site(),
                stmts: vec![Stmt::Expr(Box::new(match_expr))],
            },

            // TODO
            vis,

            attrs: Default::default(),
            defaultness: Defaultness::Final,
        }
    }
}
