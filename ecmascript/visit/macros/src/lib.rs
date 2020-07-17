extern crate proc_macro;

use inflector::Inflector;
use pmutil::{q, IdentExt, Quote};
use proc_macro2::Ident;
use std::{collections::HashSet, mem::replace};
use swc_macros_common::{call_site, def_site};
use syn::{
    parse_quote::parse, punctuated::Punctuated, spanned::Spanned, Arm, AttrStyle, Attribute, Block,
    Expr, ExprBlock, ExprMatch, FieldValue, Fields, FnArg, GenericArgument, ImplItem,
    ImplItemMethod, Index, Item, ItemImpl, ItemTrait, Member, Path, PathArguments, ReturnType,
    Signature, Stmt, Token, TraitItem, TraitItemMethod, Type, TypePath, TypeReference, VisPublic,
    Visibility,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Mode {
    Visitor,
    Folder,
}

impl Mode {
    fn trait_name(self) -> &'static str {
        match self {
            Mode::Folder => "Fold",
            Mode::Visitor => "Visit",
        }
    }

    fn prefix(self) -> &'static str {
        match self {
            Mode::Folder => "fold",
            Mode::Visitor => "visit",
        }
    }
}

/// This creates `Visit`. This is extensible visitor generator, and it
///
///  - works with stable rustc
///
///  - highly extensible and used to create Visitor for any types
///
/// If there's a need, I'll publish the macro with generic name.
///
///  - will be extended to create `VisitMut` and `Fold` in future
///
/// (If there's a request)
#[proc_macro]
pub fn define(tts: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let block: Block = parse(tts.into());

    let mut q = Quote::new_call_site();
    q.push_tokens(&make(Mode::Visitor, &block.stmts));
    q.push_tokens(&make(Mode::Folder, &block.stmts));

    proc_macro2::TokenStream::from(q).into()
}

fn make(mode: Mode, stmts: &[Stmt]) -> Quote {
    // Required to generate specialization code.
    let mut types = vec![];
    let mut methods = vec![];
    let mut optional_methods = vec![];

    for stmts in stmts {
        let item = match stmts {
            Stmt::Item(item) => item,
            _ => unimplemented!("error reporting for something other than Item"),
        };

        let mtd = make_method(mode, item, &mut types, false);
        methods.push(mtd);

        if cfg!(feature = "optional") {
            let mtd = make_method(mode, item, &mut types, true);

            optional_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: Signature { ..mtd.sig },
                block: mtd.default.unwrap(),
            });
        }
    }

    let mut tokens = q!({});

    {
        let mut new = vec![];
        for ty in &types {
            add_required(&mut new, ty);
        }
        types.extend(new);
    }

    methods.dedup_by_key(|v| v.sig.ident.to_string());
    methods.sort_by_cached_key(|v| v.sig.ident.to_string());

    for ty in &types {
        let name = method_name(mode, &ty);
        let s = name.to_string();
        if methods.iter().any(|m| m.sig.ident == &*s) {
            continue;
        }

        methods.push(TraitItemMethod {
            attrs: vec![],
            sig: create_method_sig(mode, &ty),
            default: Some(create_method_body(mode, &ty)),
            semi_token: None,
        });
    }

    methods.iter_mut().for_each(|v| {
        v.attrs.push(Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ allow }).parse(),
            tokens: q!({ (unused_variables) }).parse(),
        });

        let fn_name = v.sig.ident.clone();
        let default_body = replace(
            &mut v.default,
            Some(match mode {
                Mode::Folder => q!(Vars { fn_name: &fn_name }, {
                    {
                        fn_name(self, n)
                    }
                })
                .parse(),
                Mode::Visitor => q!(Vars { fn_name: &fn_name }, {
                    {
                        fn_name(self, n, _parent)
                    }
                })
                .parse(),
            }),
        )
        .clone();

        let arg_ty = v
            .sig
            .inputs
            .iter()
            .skip(1)
            .next()
            .map(|v| match *v {
                FnArg::Typed(ref pat) => &pat.ty,
                _ => unreachable!(),
            })
            .unwrap();

        match mode {
            Mode::Folder => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    #[allow(unused_variables)]
                    pub fn fn_name<V: ?Sized + Trait>(_visitor: &mut V, n: Type) -> Type {
                        default_body
                    }
                }
            )),

            Mode::Visitor => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    #[allow(unused_variables)]
                    pub fn fn_name<V: ?Sized + Trait>(
                        _visitor: &mut V,
                        n: Type,
                        _parent: &dyn Node,
                    ) {
                        default_body
                    }
                }
            )),
        }
    });

    tokens.push_tokens(&ItemTrait {
        attrs: vec![],
        vis: Visibility::Public(VisPublic {
            pub_token: def_site(),
        }),
        unsafety: None,
        auto_token: None,
        trait_token: def_site(),
        ident: Ident::new(mode.trait_name(), call_site()),
        generics: Default::default(),
        colon_token: None,
        supertraits: Default::default(),
        brace_token: def_site(),
        items: methods.into_iter().map(TraitItem::Method).collect(),
    });

    if !optional_methods.is_empty() {
        //
        let mut item = q!(
            Vars {
                Trait: Ident::new(mode.trait_name(), call_site()),
            },
            {
                impl<V> Trait for Optional<V> where V: Trait {}
            }
        )
        .parse::<ItemImpl>();

        item.items
            .extend(optional_methods.into_iter().map(ImplItem::Method));

        tokens.push_tokens(&item);
    }

    {
        // FoldWith, VisitWith

        let trait_decl = match mode {
            Mode::Visitor => q!({
                pub trait VisitWith<V> {
                    fn visit_with(&self, parent: &dyn Node, v: &mut V);
                }
            })
            .parse::<ItemTrait>(),
            Mode::Folder => q!({
                pub trait FoldWith<V> {
                    fn fold_with(self, v: &mut V) -> Self;
                }
            })
            .parse::<ItemTrait>(),
        };

        tokens.push_tokens(&trait_decl);

        let mut names = HashSet::new();

        for ty in &types {
            let method_name = method_name(mode, ty);

            // Prevent duplicate implementations.
            let s = method_name.to_string();
            if names.contains(&s) {
                continue;
            }
            names.insert(s);

            match mode {
                Mode::Visitor => {
                    tokens.push_tokens(&q!(
                        Vars {
                            method_name,
                            Type: ty,
                        },
                        {
                            impl<V: Visit> VisitWith<V> for Type {
                                fn visit_with(&self, parent: &dyn Node, v: &mut V) {
                                    v.method_name(self, parent)
                                }
                            }
                        }
                    ));
                }
                Mode::Folder => {
                    tokens.push_tokens(&q!(
                        Vars {
                            method_name,
                            Type: ty,
                        },
                        {
                            impl<V: Fold> FoldWith<V> for Type {
                                fn fold_with(self, v: &mut V) -> Self {
                                    v.method_name(self)
                                }
                            }
                        }
                    ));
                }
            }
        }
    }

    tokens
}

fn make_arm_from_struct(mode: Mode, path: &Path, variant: &Fields) -> Arm {
    let mut stmts = vec![];
    let mut fields: Punctuated<FieldValue, Token![,]> = Default::default();

    for (i, field) in variant.iter().enumerate() {
        let ty = &field.ty;

        let visit_name = method_name(mode, &ty);
        let binding_ident = field
            .ident
            .clone()
            .unwrap_or_else(|| Ident::new(&format!("_{}", i), call_site()));

        if !skip(ty) {
            let mut expr: Expr = match mode {
                Mode::Folder => q!(
                    Vars {
                        binding_ident: &binding_ident
                    },
                    { binding_ident }
                )
                .parse(),
                Mode::Visitor => q!(
                    Vars {
                        binding_ident: &binding_ident
                    },
                    { &*binding_ident }
                )
                .parse(),
            };
            if is_option(&ty) {
                expr = if is_opt_vec(ty) {
                    match mode {
                        Mode::Folder => q!(
                            Vars {
                                binding_ident: &binding_ident
                            },
                            { binding_ident }
                        )
                        .parse(),

                        Mode::Visitor => q!(
                            Vars {
                                binding_ident: &binding_ident
                            },
                            { binding_ident.as_ref().map(|v| &**v) }
                        )
                        .parse(),
                    }
                } else {
                    match mode {
                        Mode::Folder => q!(
                            Vars {
                                binding_ident: &binding_ident
                            },
                            { binding_ident }
                        )
                        .parse(),
                        Mode::Visitor => q!(
                            Vars {
                                binding_ident: &binding_ident
                            },
                            { binding_ident.as_ref() }
                        )
                        .parse(),
                    }
                };
            }

            let stmt = match mode {
                Mode::Folder => {
                    if let Some(..) = as_box(ty) {
                        q!(
                            Vars {
                                name: &binding_ident,
                                expr,
                                visit_name
                            },
                            {
                                let name = Box::new(_visitor.visit_name(*expr));
                            }
                        )
                        .parse()
                    } else {
                        q!(
                            Vars {
                                name: &binding_ident,
                                expr,
                                visit_name
                            },
                            {
                                let name = _visitor.visit_name(expr);
                            }
                        )
                        .parse()
                    }
                }

                Mode::Visitor => q!(Vars { expr, visit_name }, {
                    _visitor.visit_name(expr, n as _);
                })
                .parse(),
            };
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

    match mode {
        Mode::Folder => {
            // Append return statement
            stmts.push(
                q!(
                    Vars {
                        Path: &path,
                        fields: &fields
                    },
                    {
                        //
                        return Path { fields };
                    }
                )
                .parse(),
            )
        }
        Mode::Visitor => {}
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

fn method_sig(mode: Mode, ty: &Type) -> Signature {
    Signature {
        constness: None,
        asyncness: None,
        unsafety: None,
        abi: None,
        fn_token: def_site(),
        ident: method_name(mode, ty),
        generics: Default::default(),
        paren_token: def_site(),
        inputs: {
            let mut p = Punctuated::default();
            p.push_value(q!(Vars {}, { &mut self }).parse());
            p.push_punct(def_site());
            match mode {
                Mode::Folder => {
                    p.push_value(q!(Vars { Type: ty }, { n: Type }).parse());
                }

                Mode::Visitor => {
                    p.push_value(q!(Vars { Type: ty }, { n: &Type }).parse());
                }
            }
            match mode {
                Mode::Folder => {
                    // We can not provide parent node because it's child node is
                    // part of the parent ndoe.
                }
                Mode::Visitor => {
                    p.push_punct(def_site());
                    p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());
                }
            }

            p
        },
        variadic: None,
        output: match mode {
            Mode::Folder => q!(Vars { ty }, { -> ty }).parse(),
            _ => ReturnType::Default,
        },
    }
}

fn method_sig_from_ident(mode: Mode, v: &Ident) -> Signature {
    method_sig(
        mode,
        &Type::Path(TypePath {
            qself: None,
            path: v.clone().into(),
        }),
    )
}

fn make_method(
    mode: Mode,
    e: &Item,
    types: &mut Vec<Type>,
    is_for_optional: bool,
) -> TraitItemMethod {
    fn wrap_optional(mode: Mode, ty: &Ident) -> Block {
        let ty = Type::Path(TypePath {
            qself: None,
            path: Path::from(ty.clone()),
        });
        let ident = method_name(mode, &ty);

        match mode {
            Mode::Visitor => q!(
                Vars { visit: &ident },
                ({
                    if self.enabled {
                        self.inner.visit(n, _parent)
                    }
                })
            )
            .parse(),
            Mode::Folder => q!(
                Vars { fold: &ident },
                ({
                    if self.enabled {
                        self.inner.fold(n)
                    } else {
                        n
                    }
                })
            )
            .parse(),
        }
    }

    match e {
        Item::Struct(s) => {
            let type_name = &s.ident;
            if !is_for_optional {
                types.push(Type::Path(TypePath {
                    qself: None,
                    path: type_name.clone().into(),
                }));
                for f in &s.fields {
                    types.push(f.ty.clone());
                }
            }

            let mut block = {
                let arm = make_arm_from_struct(mode, &s.ident.clone().into(), &s.fields);

                let mut match_expr: ExprMatch = q!((match n {})).parse();
                match_expr.arms.push(arm);

                Block {
                    brace_token: def_site(),
                    stmts: vec![q!(Vars { match_expr }, { match_expr }).parse()],
                }
            };

            if is_for_optional {
                block = wrap_optional(mode, &s.ident);
            }

            let sig = method_sig_from_ident(mode, type_name);

            TraitItemMethod {
                attrs: vec![],
                sig,
                default: Some(block),
                semi_token: None,
            }
        }
        Item::Enum(e) => {
            //
            let type_name = &e.ident;

            if !is_for_optional {
                types.push(
                    TypePath {
                        qself: None,
                        path: e.ident.clone().into(),
                    }
                    .into(),
                );
            }

            //

            let mut block = {
                let mut arms = vec![];

                for variant in &e.variants {
                    for f in &variant.fields {
                        types.push(f.ty.clone());
                    }

                    let arm = make_arm_from_struct(
                        mode,
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

            if is_for_optional {
                block = wrap_optional(mode, &e.ident);
            }

            TraitItemMethod {
                attrs: vec![],
                sig: method_sig_from_ident(mode, type_name),
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

fn prefix_method_name(mode: Mode, v: &str) -> String {
    format!("{}_{}", mode.prefix(), v.to_snake_case())
}

fn method_name(mode: Mode, v: &Type) -> Ident {
    create_method_sig(mode, v).ident
}

fn create_method_sig(mode: Mode, ty: &Type) -> Signature {
    fn mk_exact(mode: Mode, ident: Ident, ty: &Type) -> Signature {
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
                p.push_value(q!(Vars {}, { &mut self }).parse());
                p.push_punct(def_site());
                p.push_value(q!(Vars { Type: ty }, { n: Type }).parse());
                match mode {
                    Mode::Folder => {}
                    Mode::Visitor => {
                        p.push_punct(def_site());
                        p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());
                    }
                }

                p
            },
            variadic: None,
            output: match mode {
                Mode::Folder => q!(Vars { ty }, { -> ty }).parse(),
                _ => ReturnType::Default,
            },
        }
    }

    fn mk_ref(mode: Mode, ident: Ident, ty: &Type) -> Signature {
        mk_exact(
            mode,
            ident,
            &Type::Reference(TypeReference {
                and_token: def_site(),
                lifetime: None,
                mutability: None,
                elem: Box::new(ty.clone()),
            }),
        )
    }

    match ty {
        Type::Array(_) => unimplemented!("type: array type"),
        Type::BareFn(_) => unimplemented!("type: fn type"),
        Type::Group(_) => unimplemented!("type: group type"),
        Type::ImplTrait(_) => unimplemented!("type: impl trait"),
        Type::Infer(_) => unreachable!("infer type"),
        Type::Macro(_) => unimplemented!("type: macro"),
        Type::Never(_) => unreachable!("never type"),
        Type::Paren(ty) => return create_method_sig(mode, &ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();
            let ident = last
                .ident
                .new_ident_with(|name| prefix_method_name(mode, name));

            if !last.arguments.is_empty() {
                if let Some(arg) = as_box(&ty) {
                    let ident = method_name(mode, &arg);
                    match mode {
                        Mode::Folder => {
                            return mk_exact(mode, ident, &arg);
                        }

                        Mode::Visitor => {
                            return mk_ref(mode, ident, &arg);
                        }
                    }
                }

                if last.ident == "Option" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(mode, arg).new_ident_with(|v| {
                                        v.replace(
                                            &format!("{}_", mode.prefix()),
                                            &format!("{}_opt_", mode.prefix()),
                                        )
                                    });

                                    if let Some(item) = extract_vec(arg) {
                                        match mode {
                                            Mode::Folder => {
                                                return mk_exact(
                                                    mode,
                                                    ident,
                                                    &q!(Vars { item}, { Option<Vec<item>> })
                                                        .parse(),
                                                );
                                            }
                                            Mode::Visitor => {
                                                return mk_exact(
                                                    mode,
                                                    ident,
                                                    &q!(Vars { item}, { Option<&[item]> }).parse(),
                                                );
                                            }
                                        }
                                    }

                                    match mode {
                                        Mode::Folder => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Option<arg> }).parse(),
                                            );
                                        }
                                        Mode::Visitor => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Option<&arg> }).parse(),
                                            );
                                        }
                                    }
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
                                    let orig_name = method_name(mode, arg);
                                    let mut ident = orig_name.new_ident_with(|v| {
                                        let v = v.to_plural();
                                        if is_option(arg) {
                                            return v
                                                .replace("visit_opt_", "visit_opt_vec_")
                                                .replace("fold_opt_", "fold_opt_vec_");
                                        }
                                        return v;
                                    });

                                    // Rename if name conflicts
                                    if orig_name == ident.to_string() {
                                        ident = ident.new_ident_with(|v| format!("{}_vec", v));
                                    }

                                    match mode {
                                        Mode::Folder => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Vec<arg> }).parse(),
                                            );
                                        }
                                        Mode::Visitor => {
                                            return mk_ref(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { [arg] }).parse(),
                                            );
                                        }
                                    }
                                }
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Vec() -> Ret or Vec without a type parameter"),
                    }
                }
            }

            match mode {
                Mode::Folder => return mk_exact(mode, ident, ty),
                Mode::Visitor => {
                    return mk_ref(mode, ident, ty);
                }
            }
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => {
            return create_method_sig(mode, &ty.elem);
        }
        Type::Slice(_) => unimplemented!("type: slice"),
        Type::TraitObject(_) => unimplemented!("type: trait object"),
        Type::Tuple(_) => unimplemented!("type: trait tuple"),
        Type::Verbatim(_) => unimplemented!("type: verbatim"),
        _ => unimplemented!("Unknown type: {:?}", ty),
    }
}

fn create_method_body(mode: Mode, ty: &Type) -> Block {
    match ty {
        Type::Array(_) => unimplemented!("type: array type"),
        Type::BareFn(_) => unimplemented!("type: fn type"),
        Type::Group(_) => unimplemented!("type: group type"),
        Type::ImplTrait(_) => unimplemented!("type: impl trait"),
        Type::Infer(_) => unreachable!("infer type"),
        Type::Macro(_) => unimplemented!("type: macro"),
        Type::Never(_) => unreachable!("never type"),
        Type::Paren(ty) => return create_method_body(mode, &ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if let Some(arg) = as_box(ty) {
                    match mode {
                        Mode::Folder => {
                            let ident = method_name(mode, arg);

                            return q!(Vars { ident }, ({ Box::new(_visitor.ident(*n)) })).parse();
                        }
                        Mode::Visitor => {
                            return create_method_body(mode, arg);
                        }
                    }
                }

                if last.ident == "Option" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(mode, arg);

                                    match mode {
                                        Mode::Folder => {
                                            if let Some(..) = as_box(arg) {
                                                return q!(
                                                    Vars { ident },
                                                    ({
                                                        match n {
                                                            Some(n) => {
                                                                Some(Box::new(_visitor.ident(*n)))
                                                            }
                                                            None => None,
                                                        }
                                                    })
                                                )
                                                .parse();
                                            }
                                        }
                                        _ => {}
                                    }

                                    return match mode {
                                        Mode::Folder => q!(
                                            Vars { ident },
                                            ({
                                                match n {
                                                    Some(n) => Some(_visitor.ident(n)),
                                                    None => None,
                                                }
                                            })
                                        )
                                        .parse(),
                                        Mode::Visitor => q!(
                                            Vars { ident },
                                            ({
                                                match n {
                                                    Some(n) => _visitor.ident(n, _parent),
                                                    None => {}
                                                }
                                            })
                                        )
                                        .parse(),
                                    };
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
                                    let ident = method_name(mode, arg);

                                    if mode == Mode::Folder {
                                        if let Some(..) = as_box(arg) {
                                            return q!(
                                                Vars { ident },
                                                ({
                                                    n.into_iter()
                                                        .map(|v| Box::new(_visitor.ident(*v)))
                                                        .collect()
                                                })
                                            )
                                            .parse();
                                        }
                                    }

                                    return if is_option(arg) {
                                        match mode {
                                            Mode::Folder => q!(
                                                Vars { ident },
                                                ({
                                                    n.into_iter()
                                                        .map(|v| _visitor.ident(v))
                                                        .collect()
                                                })
                                            )
                                            .parse(),
                                            Mode::Visitor => q!(
                                                Vars { ident },
                                                ({
                                                    n.iter().for_each(|v| {
                                                        _visitor.ident(v.as_ref(), _parent)
                                                    })
                                                })
                                            )
                                            .parse(),
                                        }
                                    } else {
                                        match mode {
                                            Mode::Folder => q!(
                                                Vars { ident },
                                                ({
                                                    n.into_iter()
                                                        .map(|v| _visitor.ident(v))
                                                        .collect()
                                                })
                                            )
                                            .parse(),
                                            Mode::Visitor => q!(
                                                Vars { ident },
                                                ({
                                                    n.iter()
                                                        .for_each(|v| _visitor.ident(v, _parent))
                                                })
                                            )
                                            .parse(),
                                        }
                                    };
                                }
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Vec() -> Ret or Vec without a type parameter"),
                    }
                }
            }

            match mode {
                Mode::Folder => q!(({ return n })).parse(),
                Mode::Visitor => q!(({})).parse(),
            }
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => {
            return create_method_body(mode, &ty.elem);
        }
        Type::Slice(_) => unimplemented!("type: slice"),
        Type::TraitObject(_) => unimplemented!("type: trait object"),
        Type::Tuple(_) => unimplemented!("type: trait tuple"),
        Type::Verbatim(_) => unimplemented!("type: verbatim"),
        _ => unimplemented!("Unknown type: {:?}", ty),
    }
}

fn add_required(types: &mut Vec<Type>, ty: &Type) {
    match ty {
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if last.ident == "Option" || last.ident == "Vec" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();
                            match arg {
                                GenericArgument::Type(arg) => {
                                    types.push(arg.clone());
                                }
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Box() -> T or Box without a type parameter"),
                    }
                }
            }
        }
        _ => {}
    }
}

fn is_option(ty: &Type) -> bool {
    match ty {
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if last.ident == "Option" {
                    return true;
                }
            }
        }
        _ => {}
    }

    false
}

fn as_box(ty: &Type) -> Option<&Type> {
    extract_generic("Box", ty)
}

fn extract_generic<'a>(name: &str, ty: &'a Type) -> Option<&'a Type> {
    match ty {
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if last.ident == name {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => return Some(arg),
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Box() -> T or Box without a type parameter"),
                    }
                }
            }
        }
        _ => {}
    }

    None
}

fn extract_vec(ty: &Type) -> Option<&Type> {
    extract_generic("Vec", ty)
}

fn is_opt_vec(ty: &Type) -> bool {
    match ty {
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if last.ident == "Option" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => return extract_vec(arg).is_some(),
                                _ => {}
                            }
                        }
                        _ => {}
                    }
                }
            }
        }

        _ => {}
    }

    false
}

fn skip(ty: &Type) -> bool {
    match ty {
        Type::Path(p) => {
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
