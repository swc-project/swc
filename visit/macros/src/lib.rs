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

#[derive(Debug, Clone, Copy)]
enum Mode {
    Visit,
    VisitMut,
    Fold,
}

impl Mode {
    fn trait_name(self) -> &'static str {
        match self {
            Mode::Fold => "Fold",
            Mode::Visit => "Visit",
            Mode::VisitMut => "VisitMut",
        }
    }

    fn prefix(self) -> &'static str {
        match self {
            Mode::Fold => "fold",
            Mode::Visit => "visit",
            Mode::VisitMut => "visit_mut",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum MethodMode {
    Normal,
    Optional,
    Either,
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
    q.push_tokens(&make(Mode::Fold, &block.stmts));
    q.push_tokens(&make(Mode::Visit, &block.stmts));
    q.push_tokens(&make(Mode::VisitMut, &block.stmts));

    proc_macro2::TokenStream::from(q).into()
}

fn make(mode: Mode, stmts: &[Stmt]) -> Quote {
    let mut types = vec![];
    let mut methods = vec![];
    let mut ref_methods = vec![];
    let mut optional_methods = vec![];
    let mut either_methods = vec![];

    for stmts in stmts {
        let item = match stmts {
            Stmt::Item(item) => item,
            _ => unimplemented!("error reporting for something other than Item"),
        };

        let mtd = make_method(mode, item, &mut types, MethodMode::Normal);
        let mtd = match mtd {
            Some(v) => v,
            None => continue,
        };

        methods.push(mtd.clone());

        {
            // &'_ mut V, Box<V>
            let block = match mode {
                Mode::Visit => q!(
                    Vars {
                        visit: &mtd.sig.ident,
                    },
                    ({ (**self).visit(n, _parent) })
                )
                .parse(),
                Mode::Fold | Mode::VisitMut => q!(
                    Vars {
                        visit: &mtd.sig.ident,
                    },
                    ({ (**self).visit(n) })
                )
                .parse(),
            };

            ref_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: mtd.sig.clone(),
                block,
            });
        }

        {
            // Optional

            let mtd = make_method(mode, item, &mut types, MethodMode::Optional).unwrap();

            optional_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: Signature { ..mtd.sig },
                block: mtd.default.unwrap(),
            });
        }

        {
            // Either

            let mtd = make_method(mode, item, &mut types, MethodMode::Either).unwrap();

            either_methods.push(ImplItemMethod {
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
        let sig = create_method_sig(mode, ty);
        let name = sig.ident.clone();
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
                Mode::Fold | Mode::VisitMut => q!(Vars { fn_name: &fn_name }, {
                    {
                        fn_name(self, n)
                    }
                })
                .parse(),
                Mode::Visit => q!(Vars { fn_name: &fn_name }, {
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
            Mode::Fold => tokens.push_tokens(&q!(
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

            Mode::VisitMut => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    #[allow(unused_variables)]
                    pub fn fn_name<V: ?Sized + Trait>(_visitor: &mut V, n: Type) {
                        default_body
                    }
                }
            )),

            Mode::Visit => tokens.push_tokens(&q!(
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

    {
        // impl Visit for &'_ mut V

        let mut item = q!(
            Vars {
                Trait: Ident::new(mode.trait_name(), call_site()),
            },
            {
                impl<'a, V> Trait for &'a mut V where V: ?Sized + Trait {}
            }
        )
        .parse::<ItemImpl>();

        item.items
            .extend(ref_methods.clone().into_iter().map(ImplItem::Method));
        tokens.push_tokens(&item);
    }
    {
        // impl Visit for Box<V>

        let mut item = q!(
            Vars {
                Trait: Ident::new(mode.trait_name(), call_site()),
            },
            {
                impl<V> Trait for Box<V> where V: ?Sized + Trait {}
            }
        )
        .parse::<ItemImpl>();

        item.items
            .extend(ref_methods.into_iter().map(ImplItem::Method));
        tokens.push_tokens(&item);
    }

    {
        // impl Trait for Optional
        let mut item = q!(
            Vars {
                Trait: Ident::new(mode.trait_name(), call_site()),
            },
            {
                impl<V> Trait for ::swc_visit::Optional<V> where V: Trait {}
            }
        )
        .parse::<ItemImpl>();

        item.items
            .extend(optional_methods.into_iter().map(ImplItem::Method));

        tokens.push_tokens(&item);
    }

    {
        // impl Trait for Either
        let mut item = q!(
            Vars {
                Trait: Ident::new(mode.trait_name(), call_site()),
            },
            {
                impl<A, B> Trait for ::swc_visit::Either<A, B>
                where
                    A: Trait,
                    B: Trait,
                {
                }
            }
        )
        .parse::<ItemImpl>();

        item.items
            .extend(either_methods.into_iter().map(ImplItem::Method));

        tokens.push_tokens(&item);
    }

    {
        // Add FoldWith, VisitWith

        let trait_decl = match mode {
            Mode::Visit => q!({
                pub trait VisitWith<V: Visit> {
                    fn visit_with(&self, _parent: &dyn Node, v: &mut V);

                    /// Visit children nodes of self with `v`
                    fn visit_children_with(&self, v: &mut V);
                }

                impl<V, T> VisitWith<V> for Box<T>
                where
                    V: Visit,
                    T: 'static + VisitWith<V>,
                {
                    fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
                        (**self).visit_with(_parent, v)
                    }

                    /// Visit children nodes of self with `v`
                    fn visit_children_with(&self, v: &mut V) {
                        let _parent = self as &dyn Node;
                        (**self).visit_children_with(v)
                    }
                }
            }),
            Mode::Fold => q!({
                pub trait FoldWith<V: Fold> {
                    fn fold_with(self, v: &mut V) -> Self;

                    /// Visit children nodes of self with `v`
                    fn fold_children_with(self, v: &mut V) -> Self;
                }

                impl<V, T> FoldWith<V> for Box<T>
                where
                    V: Fold,
                    T: 'static + FoldWith<V>,
                {
                    fn fold_with(self, v: &mut V) -> Self {
                        Box::new((*self).fold_with(v))
                    }

                    /// Visit children nodes of self with `v`
                    fn fold_children_with(self, v: &mut V) -> Self {
                        Box::new((*self).fold_children_with(v))
                    }
                }
            }),
            Mode::VisitMut => q!({
                pub trait VisitMutWith<V: VisitMut> {
                    fn visit_mut_with(&mut self, v: &mut V);

                    fn visit_mut_children_with(&mut self, v: &mut V);
                }

                impl<V, T> VisitMutWith<V> for Box<T>
                where
                    V: VisitMut,
                    T: 'static + VisitMutWith<V>,
                {
                    fn visit_mut_with(&mut self, v: &mut V) {
                        (**self).visit_mut_with(v);
                    }

                    fn visit_mut_children_with(&mut self, v: &mut V) {
                        (**self).visit_mut_children_with(v);
                    }
                }
            }),
        };
        tokens.push_tokens(&trait_decl);

        let mut names = HashSet::new();

        for ty in &types {
            if as_box(ty).is_some() {
                continue;
            }

            // Signature of visit_item / fold_item
            let method_sig = method_sig(mode, ty);
            let method_name = method_sig.ident;
            let node_arg = method_sig
                .inputs
                .iter()
                .nth(1)
                .expect("visit/fold should accept self as first parameter");
            let node_type = match node_arg {
                FnArg::Receiver(_) => unreachable!(),
                FnArg::Typed(pat) => &pat.ty,
            };

            // Prevent duplicate implementations.
            let s = method_name.to_string();
            if names.contains(&s) {
                continue;
            }
            names.insert(s);

            let expr = visit_expr(mode, ty, &q!({ v }).parse(), q!({ self }).parse());

            match mode {
                Mode::Visit => {
                    let default_body = adjust_expr(mode, ty, q!({ self }).parse(), |expr| {
                        q!(
                            Vars {
                                expr,
                                method_name: &method_name
                            },
                            { method_name(_visitor, expr, _parent) }
                        )
                        .parse()
                    });

                    tokens.push_tokens(&q!(
                        Vars {
                            method_name,
                            Type: ty,
                            expr,
                            default_body,
                        },
                        {
                            impl<V: Visit> VisitWith<V> for Type {
                                fn visit_with(&self, _parent: &dyn Node, v: &mut V) {
                                    expr
                                }

                                fn visit_children_with(&self, _visitor: &mut V) {
                                    let _parent = self as &dyn Node;
                                    default_body
                                }
                            }
                        }
                    ));
                }
                Mode::VisitMut => {
                    let default_body = adjust_expr(mode, ty, q!({ self }).parse(), |expr| {
                        q!(
                            Vars {
                                expr,
                                method_name: &method_name
                            },
                            { method_name(_visitor, expr) }
                        )
                        .parse()
                    });

                    tokens.push_tokens(&q!(
                        Vars {
                            default_body,
                            Type: ty,
                            expr,
                        },
                        {
                            impl<V: VisitMut> VisitMutWith<V> for Type {
                                fn visit_mut_with(&mut self, v: &mut V) {
                                    expr
                                }

                                fn visit_mut_children_with(&mut self, _visitor: &mut V) {
                                    default_body
                                }
                            }
                        }
                    ));
                }

                Mode::Fold => {
                    tokens.push_tokens(&q!(
                        Vars {
                            method_name,
                            Type: node_type,
                            expr,
                        },
                        {
                            impl<V: Fold> FoldWith<V> for Type {
                                fn fold_with(self, v: &mut V) -> Self {
                                    expr
                                }

                                fn fold_children_with(self, v: &mut V) -> Self {
                                    method_name(v, self)
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

fn adjust_expr<F>(mode: Mode, ty: &Type, mut expr: Expr, visit: F) -> Expr
where
    F: FnOnce(Expr) -> Expr,
{
    if is_option(&ty) {
        expr = if is_opt_vec(ty) {
            match mode {
                Mode::Fold => expr,

                Mode::VisitMut => q!(Vars { expr }, { expr.as_mut() }).parse(),

                Mode::Visit => q!(Vars { expr }, { expr.as_ref().map(|v| &**v) }).parse(),
            }
        } else {
            match mode {
                Mode::Fold => expr,
                Mode::VisitMut => q!(Vars { expr }, { expr.as_mut() }).parse(),
                Mode::Visit => q!(Vars { expr }, { expr.as_ref() }).parse(),
            }
        };
    }

    if as_box(ty).is_some() {
        expr = match mode {
            Mode::Visit => expr,
            Mode::VisitMut => {
                // TODO
                expr
            }
            Mode::Fold => q!(Vars { expr }, { *expr }).parse(),
        };
    }

    expr = visit(expr);

    if as_box(ty).is_some() {
        expr = match mode {
            Mode::Visit => expr,
            Mode::VisitMut => {
                // TODO
                expr
            }
            Mode::Fold => q!(Vars { expr }, { Box::new(expr) }).parse(),
        };
    }

    expr
}

///
///
/// - `Box<Expr>` => visit(&node) or Box::new(visit(*node))
/// - `Vec<Expr>` => &*node or
fn visit_expr(mode: Mode, ty: &Type, visitor: &Expr, expr: Expr) -> Expr {
    let visit_name = method_name(mode, ty);

    adjust_expr(mode, ty, expr, |expr| match mode {
        Mode::Fold | Mode::VisitMut => q!(
            Vars {
                visitor,
                expr,
                visit_name
            },
            { visitor.visit_name(expr) }
        )
        .parse(),

        Mode::Visit => q!(
            Vars {
                visitor,
                expr,
                visit_name
            },
            { visitor.visit_name(expr, _parent as _) }
        )
        .parse(),
    })
}

fn make_arm_from_struct(mode: Mode, path: &Path, variant: &Fields) -> Arm {
    let mut stmts = vec![];
    let mut fields: Punctuated<FieldValue, Token![,]> = Default::default();

    for (i, field) in variant.iter().enumerate() {
        let ty = &field.ty;

        let binding_ident = field
            .ident
            .clone()
            .unwrap_or_else(|| Ident::new(&format!("_{}", i), call_site()));

        if !skip(ty) {
            let expr = q!(
                Vars {
                    binding_ident: &binding_ident
                },
                { binding_ident }
            )
            .parse();

            let expr = visit_expr(mode, ty, &q!({ _visitor }).parse(), expr);
            stmts.push(match mode {
                Mode::Visit | Mode::VisitMut => Stmt::Semi(expr, call_site()),
                Mode::Fold => q!(
                    Vars {
                        name: &binding_ident,
                        expr
                    },
                    {
                        let name = expr;
                    }
                )
                .parse(),
            });
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
        Mode::Fold => {
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
        Mode::Visit | Mode::VisitMut => {}
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
                Mode::Fold => {
                    p.push_value(q!(Vars { Type: ty }, { n: Type }).parse());
                }

                Mode::VisitMut => {
                    p.push_value(q!(Vars { Type: ty }, { n: &mut Type }).parse());
                }

                Mode::Visit => {
                    p.push_value(q!(Vars { Type: ty }, { n: &Type }).parse());
                }
            }
            match mode {
                Mode::Fold | Mode::VisitMut => {
                    // We can not provide parent node because it's child node is
                    // part of the parent ndoe.
                }
                Mode::Visit => {
                    p.push_punct(def_site());
                    p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());
                }
            }

            p
        },
        variadic: None,
        output: match mode {
            Mode::Fold => q!(Vars { ty }, { -> ty }).parse(),
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

/// Returns None if it's skipped.
fn make_method(
    mode: Mode,
    e: &Item,
    types: &mut Vec<Type>,
    method_mode: MethodMode,
) -> Option<TraitItemMethod> {
    fn wrap_optional(mode: Mode, ty: &Ident) -> Block {
        let ty = Type::Path(TypePath {
            qself: None,
            path: Path::from(ty.clone()),
        });
        let ident = method_name(mode, &ty);

        match mode {
            Mode::Visit => q!(
                Vars { visit: &ident },
                ({
                    if self.enabled {
                        self.visitor.visit(n, _parent)
                    }
                })
            )
            .parse(),
            Mode::VisitMut => q!(
                Vars { visit: &ident },
                ({
                    if self.enabled {
                        self.visitor.visit(n)
                    }
                })
            )
            .parse(),
            Mode::Fold => q!(
                Vars { fold: &ident },
                ({
                    if self.enabled {
                        self.visitor.fold(n)
                    } else {
                        n
                    }
                })
            )
            .parse(),
        }
    }

    fn wrap_either(mode: Mode, ty: &Ident) -> Block {
        let ty = Type::Path(TypePath {
            qself: None,
            path: Path::from(ty.clone()),
        });
        let ident = method_name(mode, &ty);

        match mode {
            Mode::Visit => q!(
                Vars { visit: &ident },
                ({
                    match self {
                        swc_visit::Either::Left(v) => v.visit(n, _parent),
                        swc_visit::Either::Right(v) => v.visit(n, _parent),
                    }
                })
            )
            .parse(),
            Mode::Fold | Mode::VisitMut => q!(
                Vars { fold: &ident },
                ({
                    match self {
                        swc_visit::Either::Left(v) => v.fold(n),
                        swc_visit::Either::Right(v) => v.fold(n),
                    }
                })
            )
            .parse(),
        }
    }

    Some(match e {
        Item::Struct(s) => {
            let type_name = &s.ident;
            if method_mode == MethodMode::Normal {
                types.push(Type::Path(TypePath {
                    qself: None,
                    path: type_name.clone().into(),
                }));
                for f in &s.fields {
                    if skip(&f.ty) {
                        continue;
                    }

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

            if method_mode == MethodMode::Optional {
                block = wrap_optional(mode, &s.ident);
            } else if method_mode == MethodMode::Either {
                block = wrap_either(mode, &s.ident);
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

            if method_mode == MethodMode::Normal {
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
                        if skip(&f.ty) {
                            continue;
                        }
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

            if method_mode == MethodMode::Optional {
                block = wrap_optional(mode, &e.ident);
            } else if method_mode == MethodMode::Either {
                block = wrap_either(mode, &e.ident);
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
    })
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
                    Mode::Fold | Mode::VisitMut => {}
                    Mode::Visit => {
                        p.push_punct(def_site());
                        p.push_value(q!(Vars {}, { _parent: &dyn Node }).parse());
                    }
                }

                p
            },
            variadic: None,
            output: match mode {
                Mode::Fold => q!(Vars { ty }, { -> ty }).parse(),
                _ => ReturnType::Default,
            },
        }
    }

    fn mk_ref(mode: Mode, ident: Ident, ty: &Type, mutable: bool) -> Signature {
        mk_exact(
            mode,
            ident,
            &Type::Reference(TypeReference {
                and_token: def_site(),
                lifetime: None,
                mutability: if mutable { Some(def_site()) } else { None },
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
                        Mode::Fold => {
                            return mk_exact(mode, ident, &arg);
                        }

                        Mode::VisitMut => {
                            return mk_ref(mode, ident, &arg, true);
                        }

                        Mode::Visit => {
                            return mk_ref(mode, ident, &arg, false);
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
                                            Mode::Fold => {
                                                return mk_exact(
                                                    mode,
                                                    ident,
                                                    &q!(Vars { item }, { Option<Vec<item>> })
                                                        .parse(),
                                                );
                                            }
                                            Mode::VisitMut => {
                                                return mk_exact(
                                                    mode,
                                                    ident,
                                                    &q!(Vars { item }, { Option<&mut Vec<item>> })
                                                        .parse(),
                                                );
                                            }
                                            Mode::Visit => {
                                                return mk_exact(
                                                    mode,
                                                    ident,
                                                    &q!(Vars { item }, { Option<&[item]> }).parse(),
                                                );
                                            }
                                        }
                                    }

                                    match mode {
                                        Mode::Fold => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Option<arg> }).parse(),
                                            );
                                        }
                                        Mode::VisitMut => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Option<&mut arg> }).parse(),
                                            );
                                        }
                                        Mode::Visit => {
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
                                                .replace("visit_mut_opt_", "visit_mut_opt_vec_")
                                                .replace("fold_opt_", "fold_opt_vec_");
                                        }
                                        return v;
                                    });

                                    // Rename if name conflicts
                                    if orig_name == ident.to_string() {
                                        ident = ident.new_ident_with(|v| format!("{}_vec", v));
                                    }

                                    match mode {
                                        Mode::Fold => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Vec<arg> }).parse(),
                                            );
                                        }
                                        Mode::VisitMut => {
                                            return mk_ref(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Vec<arg> }).parse(),
                                                true,
                                            );
                                        }
                                        Mode::Visit => {
                                            return mk_ref(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { [arg] }).parse(),
                                                false,
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
                Mode::Fold => return mk_exact(mode, ident, ty),
                Mode::VisitMut => {
                    return mk_ref(mode, ident, ty, true);
                }
                Mode::Visit => {
                    return mk_ref(mode, ident, ty, false);
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
                        Mode::Fold => {
                            let ident = method_name(mode, arg);

                            return q!(Vars { ident }, ({ Box::new(_visitor.ident(*n)) })).parse();
                        }
                        Mode::Visit | Mode::VisitMut => {
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
                                        Mode::Fold => {
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
                                        Mode::Fold => q!(
                                            Vars { ident },
                                            ({
                                                match n {
                                                    Some(n) => Some(_visitor.ident(n)),
                                                    None => None,
                                                }
                                            })
                                        )
                                        .parse(),

                                        Mode::VisitMut => q!(
                                            Vars { ident },
                                            ({
                                                match n {
                                                    Some(n) => _visitor.ident(n),
                                                    None => {}
                                                }
                                            })
                                        )
                                        .parse(),

                                        Mode::Visit => q!(
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

                                    match mode {
                                        Mode::Fold => {
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
                                        Mode::Visit => {}
                                        Mode::VisitMut => {}
                                    }

                                    return if is_option(arg) {
                                        match mode {
                                            Mode::Fold => q!(
                                                Vars { ident },
                                                ({
                                                    n.into_iter()
                                                        .map(|v| _visitor.ident(v))
                                                        .collect()
                                                })
                                            )
                                            .parse(),
                                            Mode::VisitMut => q!(
                                                Vars { ident },
                                                ({
                                                    n.iter_mut()
                                                        .for_each(|v| _visitor.ident(v.as_mut()))
                                                })
                                            )
                                            .parse(),
                                            Mode::Visit => q!(
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
                                            Mode::Fold => q!(
                                                Vars { ident },
                                                ({
                                                    n.into_iter()
                                                        .map(|v| _visitor.ident(v))
                                                        .collect()
                                                })
                                            )
                                            .parse(),

                                            Mode::VisitMut => q!(
                                                Vars { ident },
                                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                                            )
                                            .parse(),

                                            Mode::Visit => q!(
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
                Mode::Fold => q!(({ return n })).parse(),
                Mode::Visit | Mode::VisitMut => q!(({})).parse(),
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
    if let Some(inner) = extract_generic("Option", ty) {
        extract_vec(inner).is_some()
    } else {
        false
    }
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
