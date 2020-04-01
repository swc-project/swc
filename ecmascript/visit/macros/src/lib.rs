use inflector::Inflector;
use pmutil::{q, smart_quote, IdentExt, ToTokensExt};
use proc_macro2::Ident;
use swc_macros_common::{call_site, def_site};
use syn::{
    parse::{Parse, ParseBuffer, ParseStream},
    parse_quote::parse,
    punctuated::Punctuated,
    spanned::Spanned,
    token::Token,
    Arm, Block, Error, Expr, ExprBlock, ExprCall, ExprMatch, ExprStruct, FieldPat, FieldValue,
    Fields, GenericArgument, ImplItem, ImplItemMethod, Index, Item, ItemEnum, ItemImpl, ItemMod,
    ItemStruct, ItemTrait, Member, Pat, PatStruct, Path, PathArguments, ReturnType, Signature,
    Stmt, Token, TraitItem, TraitItemMacro, TraitItemMethod, Type, Variant, VisPublic, Visibility,
};

/// This creates `Visit`. This is extensible visitor generator, and it
///
///  - works with stable rustc
///
///  - highly extensible and used to create Visitor for any types
///
/// If there's a need, I'll publish the macro with generic name.
///
///  - will be extended create `VisitMut` and `Fold` in future
///
/// (If there's a request)
///
///
/// # Basic
///
///  - Method name is determined based on type's name.
///  - All arguments follow the syntax of argument. (This makes rustfmt happy)
///
///
/// # Struct
///
/// ```ignore
/// pub struct Struct {
///     pub field: String,
/// }
///
/// define!(Struct { field }, String);
/// ```
///
/// generates (code which behaves like)
///
/// ```
/// pub trait Visit {
///     fn visit_struct(&mut self, n: &Struct) {
///         self.visit_string(&n.field)
///     }
///
///     fn visit_string(&mut self, n: &String) {}
/// }
/// ```
///
///
///
/// # Enum
///
/// ```ignore
/// pub enum Enum {
///     StructLike { field: String },
///     TupleLike(String, u64),
///     UnitLike,
/// }
///
/// define!(
///     Value(StructLike { field }, TupleLike(a, b), UnitLike),
///     String,
///     u64
/// );
/// ```
///
/// generates (code which behaves like)
///
/// ```
/// pub trait Visit {
///     fn visit_enum(&mut self, n: &Enum) {
///         match n {
///             Enum::StructLike { field } => self.visit_string(field),
///             Enum::TupleLike(_0, _1) => {
///                 self.visit_string(_0);
///                 self.visit_u64(_1);
///             }
///             Enum::UnitLike => {}
///         }
///     }
///     fn visit_string(&mut self, n: &String) {}
///     fn visit_u64(&mut self, n: &u64) {}
/// }
/// ```
#[proc_macro]
pub fn define(tts: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let block: Block = parse(tts.into());

    // Required to generate specialization code.
    let mut type_names = vec![];
    let mut methods = vec![];

    for stmts in block.stmts {
        let item = match stmts {
            Stmt::Item(item) => item,
            _ => unimplemented!("error reporting for something other than Item"),
        };

        let mtd = make_method(item, &mut type_names);
        methods.push(TraitItem::Method(mtd));
    }

    let mut tokens = q!({});

    tokens.push_tokens(&ItemTrait {
        attrs: vec![],
        vis: Visibility::Public(VisPublic {
            pub_token: def_site(),
        }),
        unsafety: None,
        auto_token: None,
        trait_token: def_site(),
        ident: Ident::new("Visit", def_site()),
        generics: Default::default(),
        colon_token: None,
        supertraits: Default::default(),
        brace_token: def_site(),
        items: methods,
    });

    tokens.into()
}

fn make_arm_from_struct(path: &Path, variant: &Fields) -> Arm {
    let mut stmts = vec![];
    let mut fields: Punctuated<FieldValue, Token![,]> = Default::default();

    for (i, field) in variant.iter().enumerate() {
        let ty = &field.ty;
        let visit_name = method_name(&ty);
        let binding_ident = field
            .ident
            .clone()
            .unwrap_or_else(|| Ident::new(&format!("_{}", i), call_site()));

        let stmt = q!(
            Vars {
                binding_ident: &binding_ident,
                visit_name
            },
            {
                self.visit_name(binding_ident, n as _);
            }
        )
        .parse();
        stmts.push(stmt);

        if field.ident.is_some() {
            fields.push(
                q!(
                    Vars {
                        field: &binding_ident
                    },
                    { field }
                )
                .parse(),
            );
        } else {
            fields.push(FieldValue {
                attrs: vec![],
                member: Member::Unnamed(Index {
                    index: i as _,
                    span: path.span(),
                }),
                colon_token: Some(def_site()),
                expr: q!(Vars { binding_ident }, { binding_ident }).parse(),
            });
        }
    }

    let block = Block {
        brace_token: def_site(),
        stmts,
    };

    Arm {
        attrs: vec![],
        pat: q!(Vars { Path: path, fields }, { Path { fields } }).parse(),
        guard: None,
        fat_arrow_token: def_site(),
        body: Box::new(Expr::Block(ExprBlock {
            attrs: vec![],
            label: None,
            block,
        })),
        comma: None,
    }
}

// fn make_arm_from_call(e: Option<&ItemEnum>, variant: &ExprCall) -> Arm {
//     let mut stmts = vec![];
//     let mut bindings: Punctuated<_, Token![,]> = Default::default();
//
//     for (i, ty) in variant.args.iter().enumerate() {
//         let ty = match ty {
//             Expr::Path(ty) => ty.path.segments.last().unwrap().ident.clone(),
//             _ => unimplemented!("proper error reporting for non-path
// expressions is tuple structs"),         };
//         let field_name = Ident::new(&format!("_{}", i), ty.span());
//         let visit_name = ty.new_ident_with(method_name);
//         let stmt = q!(
//             Vars {
//                 field_name: &field_name,
//                 visit_name,
//             },
//             {
//                 self.visit_name(field_name, n as _);
//             }
//         )
//         .parse();
//         stmts.push(stmt);
//
//         bindings.push(field_name.clone());
//     }
//
//     let block = Block {
//         brace_token: def_site(),
//         stmts,
//     };
//
//     Arm {
//         attrs: vec![],
//         pat: match e {
//             Some(e) => q!(
//                 Vars {
//                     Enum: e,
//                     Variant: &variant.func,
//                     bindings,
//                 },
//                 { Enum::Variant(bindings) }
//             )
//             .parse(),
//             None => q!(
//                 Vars {
//                     Variant: &variant.func,
//                     bindings,
//                 },
//                 { Variant(bindings) }
//             )
//             .parse(),
//         },
//         guard: None,
//         fat_arrow_token: def_site(),
//         body: Box::new(Expr::Block(ExprBlock {
//             attrs: vec![],
//             label: None,
//             block,
//         })),
//         comma: None,
//     }
// }

fn make_method(e: Item, type_names: &mut Vec<Ident>) -> TraitItemMethod {
    fn method_sig(type_name: &Ident) -> Signature {
        Signature {
            constness: None,
            asyncness: None,
            unsafety: None,
            abi: None,
            fn_token: def_site(),
            ident: type_name.clone().new_ident_with(prefix_method_name),
            generics: Default::default(),
            paren_token: def_site(),
            inputs: {
                let mut p = Punctuated::default();
                p.push_value(q!(Vars {}, { &self }).parse());
                p.push_punct(def_site());
                p.push_value(q!(Vars { Type: type_name }, { n: &Type }).parse());
                p.push_punct(def_site());
                p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());

                p
            },
            variadic: None,
            output: ReturnType::Default,
        }
    }

    match e {
        Item::Struct(s) => {
            let type_name = &s.ident;
            type_names.push(type_name.clone());

            let block = {
                let arm = make_arm_from_struct(&s.ident.clone().into(), &s.fields);

                let mut match_expr: ExprMatch = q!((match n {})).parse();
                match_expr.arms.push(arm);

                Block {
                    brace_token: def_site(),
                    stmts: vec![q!(Vars { match_expr }, { match_expr }).parse()],
                }
            };

            TraitItemMethod {
                attrs: vec![],
                sig: method_sig(type_name),
                default: Some(block),
                semi_token: None,
            }
        }
        Item::Enum(e) => {
            //
            let type_name = &e.ident;
            type_names.push(e.ident.clone());
            //

            let block = {
                let mut arms = vec![];

                for variant in &e.variants {
                    let arm = make_arm_from_struct(
                        &q!(
                            Vars {
                                Enum: &e.ident,
                                Variant: &variant.ident
                            },
                            { Enum::Variant }
                        )
                        .parse(),
                        &variant.fields,
                    );
                    arms.push(arm);
                }

                Block {
                    brace_token: def_site(),
                    stmts: vec![Stmt::Expr(Expr::Match(ExprMatch {
                        attrs: vec![],
                        match_token: def_site(),
                        expr: q!((n)).parse(),
                        brace_token: def_site(),
                        arms,
                    }))],
                }
            };

            TraitItemMethod {
                attrs: vec![],
                sig: method_sig(type_name),
                default: Some(block),
                semi_token: None,
            }
        }

        _ => unimplemented!(
            "proper error reporting for item other than struct / enum: {:?}",
            e
        ),
    }
}

fn prefix_method_name(v: &str) -> String {
    format!("visit_{}", v.to_snake_case())
}

fn method_name(v: &Type) -> Ident {
    match v {
        Type::Array(_) => unimplemented!("type: array type"),
        Type::BareFn(_) => unimplemented!("type: fn type"),
        Type::Group(_) => unimplemented!("type: group type"),
        Type::ImplTrait(_) => unimplemented!("type: impl trait"),
        Type::Infer(_) => unreachable!("infer type"),
        Type::Macro(_) => unimplemented!("type: macro"),
        Type::Never(_) => unreachable!("never type"),
        Type::Paren(ty) => return method_name(&ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();
            let ident = last.ident.new_ident_with(prefix_method_name);

            if last.arguments.is_empty() {
                return ident;
            }

            if last.ident == "Box" {
                match &last.arguments {
                    PathArguments::AngleBracketed(tps) => {
                        let arg = tps.args.first().unwrap();

                        match arg {
                            GenericArgument::Type(ty) => return method_name(ty),
                            _ => unimplemented!("generic parameter other than type"),
                        }
                    }
                    _ => unimplemented!("Box() -> T or Box without a type parameter"),
                }
            }

            if last.ident == "Option" {
                match &last.arguments {
                    PathArguments::AngleBracketed(tps) => {
                        let arg = tps.args.first().unwrap();

                        match arg {
                            GenericArgument::Type(ty) => {
                                let i = method_name(ty);
                                return i.new_ident_with(|v| v.replace("visit_", "visit_opt_"));
                            }
                            _ => unimplemented!("generic parameter other than type"),
                        }
                    }
                    _ => unimplemented!("Box() -> T or Box without a type parameter"),
                }
            }

            if last.ident == "Vec" {
                match &last.arguments {
                    PathArguments::AngleBracketed(tps) => {
                        let arg = tps.args.first().unwrap();

                        match arg {
                            GenericArgument::Type(ty) => {
                                let i = method_name(ty);
                                return i.new_ident_with(|v| format!("{}s", v));
                            }
                            _ => unimplemented!("generic parameter other than type"),
                        }
                    }
                    _ => unimplemented!("Vec() -> Ret or Vec without a type parameter"),
                }
            }

            return ident;
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => {
            return method_name(&ty.elem);
        }
        Type::Slice(_) => unimplemented!("type: slice"),
        Type::TraitObject(_) => unimplemented!("type: trait object"),
        Type::Tuple(_) => unimplemented!("type: trait tuple"),
        Type::Verbatim(_) => unimplemented!("type: verbatim"),
        _ => unimplemented!("Unknown type: {:?}", v),
    }
}
