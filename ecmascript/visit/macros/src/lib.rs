use pmutil::{q, IdentExt, ToTokensExt};
use proc_macro2::Ident;
use swc_macros_common::def_site;
use syn::{
    parse::{Parse, ParseBuffer, ParseStream},
    parse_quote::parse,
    punctuated::Punctuated,
    Arm, Block, Error, Expr, ExprBlock, ExprCall, ExprMatch, ExprStruct, ImplItem, ImplItemMethod,
    ItemImpl, ItemTrait, Member, Pat, PatStruct, Path, ReturnType, Signature, Stmt, Token,
    TraitItem, TraitItemMacro, TraitItemMethod, VisPublic, Visibility,
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
    let input: Input = parse(tts.into());
    let args = input.args;

    // Required to generate specialization code.
    let mut type_names = vec![];

    let methods = args
        .iter()
        .map(|v| make_method(v, &mut type_names))
        .map(TraitItem::Method)
        .collect::<Vec<_>>();

    ItemTrait {
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
    }
    .dump()
    .into()
}

fn handle_struct_expr(e: &ExprStruct) -> Block {
    // We use auto(de)ref specialization

    let mut body = vec![];

    for field in &e.fields {
        match &field.member {
            Member::Named(ref f) => {
                body.push(
                    q!(Vars { field: f }, {
                        __visit(self, n.field);
                    })
                    .parse(),
                );
            }

            Member::Unnamed(_) => unimplemented!("unnamed member?"),
        }
    }

    Block {
        brace_token: def_site(),
        stmts: body,
    }
}

fn make_arm(e: &Expr) -> Arm {
    fn make_arm_from_struct(e: &ExprStruct) -> Arm {
        let mut stmts = vec![];
        for field in &e.fields {
            match &field.member {
                Member::Named(ref f) => {
                    let stmt = q!(Vars { field: f }, {
                        __visit(self, field);
                    })
                    .parse();
                    stmts.push(stmt);
                }

                Member::Unnamed(_) => unimplemented!("unnamed member?"),
            }
        }

        let block = Block {
            brace_token: def_site(),
            stmts,
        };

        Arm {
            attrs: vec![],
            pat: q!((n)).parse(),
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

    fn make_arm_from_call(e: &ExprCall) -> Arm {
        let mut stmts = vec![];

        for field in &e.args {}

        let block = Block {
            brace_token: def_site(),
            stmts,
        };

        Arm {
            attrs: vec![],
            pat: q!(Vars { Enum: &e.func }, { Enum::Variant }).parse(),
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

    match e {
        Expr::Struct(s) => make_arm_from_struct(s),
        Expr::Call(c) => make_arm_from_call(c),
        _ => unimplemented!("make_arg for {:?}", e),
    }
}

fn make_method(e: &Expr, type_names: &mut Vec<Ident>) -> TraitItemMethod {
    match e {
        Expr::Struct(s) => {
            let type_name = s.path.get_ident().as_ref().unwrap().clone();
            type_names.push(type_name.clone());

            let block = handle_struct_expr(s);

            TraitItemMethod {
                attrs: vec![],
                sig: method_sig(type_name),
                default: Some(block),
                semi_token: None,
            }
        }
        Expr::Call(e) => match *e.func {
            Expr::Path(ref callee) => {
                let type_name = callee.path.get_ident().as_ref().unwrap().clone();
                type_names.push(type_name.clone());
                //

                let block = {
                    let mut arms = vec![];

                    for variant in &e.args {
                        arms.push(make_arm(variant));
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
                "proper error reporting for CallExpression with callee other than ident"
            ),
        },
        _ => unimplemented!("proper error reporting expressions other than struct / call"),
    }
}

struct Input {
    ///
    /// ```
    /// Struct{ fields }
    /// ```
    ///
    /// ```
    /// Enum([Variant1, StructLike { fields }])
    /// ```
    args: Punctuated<Expr, Token![,]>,
}

impl Parse for Input {
    fn parse(input: ParseStream) -> Result<Self, syn::Error> {
        Ok(Self {
            args: Punctuated::parse_separated_nonempty(input)?,
        })
    }
}

fn method_sig(type_name: &Ident) -> Signature {
    Signature {
        constness: None,
        asyncness: None,
        unsafety: None,
        abi: None,
        fn_token: def_site(),
        ident: type_name.new_ident_with(|v| format!("visit_{}", v)),
        generics: Default::default(),
        paren_token: def_site(),
        inputs: {
            let mut p = Punctuated::default();
            p.push_value(q!(Vars {}, { &self }).parse());
            p.push_punct(def_site());
            p.push_value(q!(Vars { Type: type_name }, { n: &Type }).parse());

            p
        },
        variadic: None,
        output: ReturnType::Default,
    }
}
