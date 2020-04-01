use inflector::Inflector;
use pmutil::{q, IdentExt};
use proc_macro2::Ident;
use swc_macros_common::{call_site, def_site};
use syn::{
    parse_quote::parse, punctuated::Punctuated, spanned::Spanned, Arm, Block, Expr, ExprBlock,
    ExprMatch, FieldValue, Fields, GenericArgument, Index, Item, ItemTrait, Member, Path,
    PathArguments, ReturnType, Signature, Stmt, Token, TraitItem, TraitItemMethod, Type, TypePath,
    VisPublic, Visibility,
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
    let mut types = vec![];
    let mut methods = vec![];

    for stmts in block.stmts {
        let item = match stmts {
            Stmt::Item(item) => item,
            _ => unimplemented!("error reporting for something other than Item"),
        };

        let mtd = make_method(item, &mut types);
        methods.push(mtd);
    }

    let mut tokens = q!({});

    for ty in types {
        let name = method_name(&ty);
        let s = name.to_string();
        if methods.iter().any(|m| m.sig.ident == &*s) {
            continue;
        }

        methods.push(TraitItemMethod {
            attrs: vec![],
            sig: create_method_sig(&ty),
            default: Some(create_method_body(&ty)),
            semi_token: None,
        });
    }

    methods.sort_by_cached_key(|v| v.sig.ident.to_string());

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
        items: methods.into_iter().map(TraitItem::Method).collect(),
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

        if !skip(ty) {
            let stmt = q!(
                Vars {
                    binding_ident: &binding_ident,
                    visit_name
                },
                {
                    self.visit_name(&*binding_ident, n as _);
                }
            )
            .parse();
            stmts.push(stmt);
        }

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

fn method_sig(ty: &Type) -> Signature {
    Signature {
        constness: None,
        asyncness: None,
        unsafety: None,
        abi: None,
        fn_token: def_site(),
        ident: method_name(ty),
        generics: Default::default(),
        paren_token: def_site(),
        inputs: {
            let mut p = Punctuated::default();
            p.push_value(q!(Vars {}, { &self }).parse());
            p.push_punct(def_site());
            p.push_value(q!(Vars { Type: ty }, { n: &Type }).parse());
            p.push_punct(def_site());
            p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());

            p
        },
        variadic: None,
        output: ReturnType::Default,
    }
}

fn method_sig_from_ident(v: &Ident) -> Signature {
    method_sig(&Type::Path(TypePath {
        qself: None,
        path: v.clone().into(),
    }))
}

fn make_method(e: Item, types: &mut Vec<Type>) -> TraitItemMethod {
    match e {
        Item::Struct(s) => {
            let type_name = &s.ident;
            types.push(Type::Path(TypePath {
                qself: None,
                path: type_name.clone().into(),
            }));
            for f in &s.fields {
                types.push(f.ty.clone());
            }

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
                sig: method_sig_from_ident(type_name),
                default: Some(block),
                semi_token: None,
            }
        }
        Item::Enum(e) => {
            //
            let type_name = &e.ident;
            types.push(
                TypePath {
                    qself: None,
                    path: e.ident.clone().into(),
                }
                .into(),
            );

            //

            let block = {
                let mut arms = vec![];

                for variant in &e.variants {
                    for f in &variant.fields {
                        types.push(f.ty.clone());
                    }

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
                sig: method_sig_from_ident(type_name),
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
    create_method_sig(v).ident
}

fn create_method_sig(ty: &Type) -> Signature {
    fn mk(ident: Ident, ty: &Type) -> Signature {
        Signature {
            constness: None,
            asyncness: None,
            unsafety: None,
            abi: None,
            fn_token: def_site(),
            ident,
            generics: Default::default(),
            paren_token: def_site(),
            inputs: {
                let mut p = Punctuated::default();
                p.push_value(q!(Vars {}, { &self }).parse());
                p.push_punct(def_site());
                p.push_value(q!(Vars { Type: ty }, { n: &Type }).parse());
                p.push_punct(def_site());
                p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());

                p
            },
            variadic: None,
            output: ReturnType::Default,
        }
    }

    match ty {
        Type::Array(_) => unimplemented!("type: array type"),
        Type::BareFn(_) => unimplemented!("type: fn type"),
        Type::Group(_) => unimplemented!("type: group type"),
        Type::ImplTrait(_) => unimplemented!("type: impl trait"),
        Type::Infer(_) => unreachable!("infer type"),
        Type::Macro(_) => unimplemented!("type: macro"),
        Type::Never(_) => unreachable!("never type"),
        Type::Paren(ty) => return create_method_sig(&ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();
            let ident = last.ident.new_ident_with(prefix_method_name);

            if !last.arguments.is_empty() {
                if last.ident == "Box" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(&arg);
                                    return mk(ident, &q!(Vars { arg }, { arg }).parse());
                                }
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
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(arg)
                                        .new_ident_with(|v| v.replace("visit_", "visit_opt_"));

                                    return mk(ident, ty);
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
                                GenericArgument::Type(arg) => {
                                    let orig_name = method_name(arg);
                                    let mut ident = orig_name.new_ident_with(|v| v.to_plural());

                                    if orig_name == ident.to_string() {
                                        ident = ident.new_ident_with(|v| format!("{}_vec", v));
                                    }

                                    return mk(ident, &q!(Vars { arg }, { [arg] }).parse());
                                }
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Vec() -> Ret or Vec without a type parameter"),
                    }
                }
            }

            return mk(ident, ty);
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => {
            return create_method_sig(&ty.elem);
        }
        Type::Slice(_) => unimplemented!("type: slice"),
        Type::TraitObject(_) => unimplemented!("type: trait object"),
        Type::Tuple(_) => unimplemented!("type: trait tuple"),
        Type::Verbatim(_) => unimplemented!("type: verbatim"),
        _ => unimplemented!("Unknown type: {:?}", ty),
    }
}

fn create_method_body(ty: &Type) -> Block {
    match ty {
        Type::Array(_) => unimplemented!("type: array type"),
        Type::BareFn(_) => unimplemented!("type: fn type"),
        Type::Group(_) => unimplemented!("type: group type"),
        Type::ImplTrait(_) => unimplemented!("type: impl trait"),
        Type::Infer(_) => unreachable!("infer type"),
        Type::Macro(_) => unimplemented!("type: macro"),
        Type::Never(_) => unreachable!("never type"),
        Type::Paren(ty) => return create_method_body(&ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if last.ident == "Box" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => {
                                    return create_method_body(arg);
                                }
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
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(arg);

                                    return q!(
                                        Vars { ident },
                                        ({
                                            match n {
                                                Some(n) => self.ident(n, _parent),
                                                None => {}
                                            }
                                        })
                                    )
                                    .parse();
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
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(arg);

                                    return q!(
                                        Vars { ident },
                                        ({ n.iter().for_each(|v| { self.ident(v, _parent) }) })
                                    )
                                    .parse();
                                }
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Vec() -> Ret or Vec without a type parameter"),
                    }
                }
            }

            q!(({})).parse()
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => {
            return create_method_body(&ty.elem);
        }
        Type::Slice(_) => unimplemented!("type: slice"),
        Type::TraitObject(_) => unimplemented!("type: trait object"),
        Type::Tuple(_) => unimplemented!("type: trait tuple"),
        Type::Verbatim(_) => unimplemented!("type: verbatim"),
        _ => unimplemented!("Unknown type: {:?}", ty),
    }
}

fn skip(ty: &Type) -> bool {
    match ty {
        Type::Path(p) => {
            if !p.path.segments.last().unwrap().arguments.is_empty() {
                return false;
            }
            let i = &p.path.segments.last().as_ref().unwrap().ident;

            if i == "bool"
                || i == "u128"
                || i == "u128"
                || i == "u64"
                || i == "u32"
                || i == "u16"
                || i == "u8"
                || i == "isize"
                || i == "i128"
                || i == "i128"
                || i == "i64"
                || i == "i32"
                || i == "i16"
                || i == "i8"
                || i == "isize"
                || i == "f64"
                || i == "f32"
            {
                return true;
            }

            false
        }
        _ => false,
    }
}
