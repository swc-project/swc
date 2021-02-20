extern crate proc_macro;

use inflector::Inflector;
use pmutil::{q, Quote};
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
    Visit,
    VisitAll,
    VisitMut,
    Fold,
}

impl Mode {
    fn trait_name(self) -> &'static str {
        match self {
            Mode::Fold => "Fold",
            Mode::VisitAll => "VisitAll",
            Mode::Visit => "Visit",
            Mode::VisitMut => "VisitMut",
        }
    }

    fn prefix(self) -> &'static str {
        match self {
            Mode::Fold => "fold",
            Mode::Visit | Mode::VisitAll => "visit",
            Mode::VisitMut => "visit_mut",
        }
    }
}

/// This creates `Visit`. This is extensible visitor generator, and it
///
///  - works with stable rustc
///
///  - highly extensible and used to create Visitor for any types
///
///  - create `Visit`, `VisitAll`, `VisitMut`, `Fold`
#[proc_macro]
pub fn define(tts: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let block: Block = parse(tts.into());

    let mut q = Quote::new_call_site();
    q.push_tokens(&make(Mode::Fold, &block.stmts));
    q.push_tokens(&make(Mode::Visit, &block.stmts));
    q.push_tokens(&make(Mode::VisitAll, &block.stmts));
    q.push_tokens(&make(Mode::VisitMut, &block.stmts));

    proc_macro2::TokenStream::from(q).into()
}

fn make(mode: Mode, stmts: &[Stmt]) -> Quote {
    let mut types = vec![];
    let mut methods = vec![];

    for stmts in stmts {
        let item = match stmts {
            Stmt::Item(item) => item,
            _ => unimplemented!("error reporting for something other than Item"),
        };

        let mtd = make_method(mode, item, &mut types);
        let mtd = match mtd {
            Some(v) => v,
            None => continue,
        };

        methods.push(mtd);
    }

    let mut tokens = q!({});
    let mut ref_methods = vec![];
    let mut optional_methods = vec![];
    let mut either_methods = vec![];
    let mut visit_all_methods = vec![];
    {
        let mut new = vec![];
        for ty in &types {
            add_required(&mut new, ty);
        }
        types.extend(new);
    }

    // Remove `Box`
    types.retain(|ty| as_box(ty).is_none());
    types.sort_by_cached_key(|ty| method_name_as_str(mode, &ty));
    types.dedup_by_key(|ty| method_name_as_str(mode, &ty));

    let types = types;

    methods.sort_by_cached_key(|v| v.sig.ident.to_string());
    methods.dedup_by_key(|v| v.sig.ident.to_string());

    for ty in &types {
        let sig = create_method_sig(mode, ty);
        let name = sig.ident.clone();
        let s = name.to_string();
        if methods.iter().any(|m| m.sig.ident == &*s) {
            continue;
        }

        methods.push(TraitItemMethod {
            attrs: vec![],
            sig,
            default: Some(create_method_body(mode, &ty)),
            semi_token: None,
        });
    }

    methods.sort_by_cached_key(|v| v.sig.ident.to_string());

    for ty in &types {
        let sig = create_method_sig(mode, ty);
        let name = sig.ident.clone();

        {
            // &'_ mut V, Box<V>
            let block = match mode {
                Mode::Visit | Mode::VisitAll => {
                    q!(Vars { visit: &name }, ({ (**self).visit(n, _parent) })).parse()
                }
                Mode::Fold | Mode::VisitMut => {
                    q!(Vars { visit: &name }, ({ (**self).visit(n) })).parse()
                }
            };

            ref_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: sig.clone(),
                block,
            });
        }

        {
            // Either

            either_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: sig.clone(),
                block: match mode {
                    Mode::Visit | Mode::VisitAll => q!(
                        Vars { visit: &name },
                        ({
                            match self {
                                swc_visit::Either::Left(v) => v.visit(n, _parent),
                                swc_visit::Either::Right(v) => v.visit(n, _parent),
                            }
                        })
                    )
                    .parse(),
                    Mode::Fold | Mode::VisitMut => q!(
                        Vars { fold: &name },
                        ({
                            match self {
                                swc_visit::Either::Left(v) => v.fold(n),
                                swc_visit::Either::Right(v) => v.fold(n),
                            }
                        })
                    )
                    .parse(),
                },
            });
        }

        {
            // Optional

            optional_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: sig.clone(),
                block: match mode {
                    Mode::VisitAll | Mode::Visit => q!(
                        Vars { visit: &name },
                        ({
                            if self.enabled {
                                self.visitor.visit(n, _parent)
                            }
                        })
                    )
                    .parse(),
                    Mode::VisitMut => q!(
                        Vars { visit: &name },
                        ({
                            if self.enabled {
                                self.visitor.visit(n)
                            }
                        })
                    )
                    .parse(),
                    Mode::Fold => q!(
                        Vars { fold: &name },
                        ({
                            if self.enabled {
                                self.visitor.fold(n)
                            } else {
                                n
                            }
                        })
                    )
                    .parse(),
                },
            });
        }

        {
            // Visit <-> VisitAll using swc_visit::All

            visit_all_methods.push(ImplItemMethod {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: sig.clone(),
                block: q!(
                    Vars { visit: &name },
                    ({
                        self.visitor.visit(n, _parent);
                        visit(self, n, _parent);
                    })
                )
                .parse(),
            });
        }
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
                Mode::VisitAll => Block {
                    brace_token: def_site(),
                    stmts: Default::default(),
                },
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

            Mode::VisitAll => {}
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

    // impl Visit for swc_visit::All<V> where V: VisitAll
    if mode == Mode::VisitAll {
        let mut item = q!(
            Vars {
                Trait: Ident::new(mode.trait_name(), call_site()),
            },
            {
                impl<V> Visit for ::swc_visit::All<V> where V: VisitAll {}
            }
        )
        .parse::<ItemImpl>();

        item.items
            .extend(visit_all_methods.into_iter().map(ImplItem::Method));

        tokens.push_tokens(&item);
        tokens.push_tokens(&q!({
            pub use swc_visit::All;
        }));
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
            Mode::VisitAll => q!({
                pub trait VisitAllWith<V: VisitAll> {
                    fn visit_all_with(&self, _parent: &dyn Node, v: &mut V);

                    /// Visit children nodes of self with `v`
                    fn visit_all_children_with(&self, v: &mut V);
                }

                impl<V, T> VisitAllWith<V> for Box<T>
                where
                    V: VisitAll,
                    T: 'static + VisitAllWith<V>,
                {
                    fn visit_all_with(&self, _parent: &dyn Node, v: &mut V) {
                        (**self).visit_all_with(_parent, v)
                    }

                    /// Visit children nodes of self with `v`
                    fn visit_all_children_with(&self, v: &mut V) {
                        let _parent = self as &dyn Node;
                        (**self).visit_all_children_with(v)
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
                        swc_visit::util::map::Map::map(self, |value| value.fold_with(v))
                    }

                    /// Visit children nodes of self with `v`
                    fn fold_children_with(self, v: &mut V) -> Self {
                        swc_visit::util::map::Map::map(self, |value| value.fold_children_with(v))
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

                Mode::VisitAll => {
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
                            impl<V: VisitAll> VisitAllWith<V> for Type {
                                fn visit_all_with(&self, _parent: &dyn Node, v: &mut V) {
                                    let mut all = ::swc_visit::All { visitor: v };
                                    let mut v = &mut all;
                                    expr
                                }

                                fn visit_all_children_with(&self, _visitor: &mut V) {
                                    let _parent = self as &dyn Node;
                                    let mut all = ::swc_visit::All { visitor: _visitor };
                                    let mut _visitor = &mut all;
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
                            Type: ty,
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
                Mode::VisitMut => expr,
                Mode::Visit | Mode::VisitAll => {
                    q!(Vars { expr }, { expr.as_ref().map(|v| &**v) }).parse()
                }
            }
        } else {
            match mode {
                Mode::Fold => expr,
                Mode::VisitMut => expr,
                Mode::Visit | Mode::VisitAll => q!(Vars { expr }, { expr.as_ref() }).parse(),
            }
        };
    }

    if as_box(ty).is_some() {
        expr = match mode {
            Mode::Visit | Mode::VisitAll => expr,
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
            Mode::Visit | Mode::VisitAll => expr,
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

        Mode::Visit | Mode::VisitAll => q!(
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
                Mode::VisitAll | Mode::Visit | Mode::VisitMut => Stmt::Semi(expr, call_site()),
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
        Mode::VisitAll | Mode::Visit | Mode::VisitMut => {}
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

                Mode::Visit | Mode::VisitAll => {
                    p.push_value(q!(Vars { Type: ty }, { n: &Type }).parse());
                }
            }
            match mode {
                Mode::Fold | Mode::VisitMut => {
                    // We can not provide parent node because it's child node is
                    // part of the parent node.
                }
                Mode::Visit | Mode::VisitAll => {
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
fn make_method(mode: Mode, e: &Item, types: &mut Vec<Type>) -> Option<TraitItemMethod> {
    Some(match e {
        Item::Struct(s) => {
            let type_name = &s.ident;
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

            let block = {
                let arm = make_arm_from_struct(mode, &s.ident.clone().into(), &s.fields);

                let mut match_expr: ExprMatch = q!((match n {})).parse();
                match_expr.arms.push(arm);

                Block {
                    brace_token: def_site(),
                    stmts: vec![q!(Vars { match_expr }, { match_expr }).parse()],
                }
            };

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
                    Mode::Visit | Mode::VisitAll => {
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
            let ident = method_name(mode, ty);

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

                        Mode::Visit | Mode::VisitAll => {
                            return mk_ref(mode, ident, &arg, false);
                        }
                    }
                }

                if let Some(arg) = extract_generic("Option", ty) {
                    let ident = method_name(mode, ty);

                    if let Some(item) = extract_vec(arg) {
                        match mode {
                            Mode::Fold => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &q!(Vars { item }, { Option<Vec<item>> }).parse(),
                                );
                            }
                            Mode::VisitMut => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &q!(Vars { item }, { &mut Option<Vec<item>> }).parse(),
                                );
                            }
                            Mode::Visit | Mode::VisitAll => {
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
                                &q!(Vars { arg }, { &mut Option<arg> }).parse(),
                            );
                        }
                        Mode::Visit | Mode::VisitAll => {
                            return mk_exact(
                                mode,
                                ident,
                                &q!(Vars { arg }, { Option<&arg> }).parse(),
                            );
                        }
                    }
                }

                if last.ident == "Vec" {
                    match &last.arguments {
                        PathArguments::AngleBracketed(tps) => {
                            let arg = tps.args.first().unwrap();

                            match arg {
                                GenericArgument::Type(arg) => {
                                    let ident = method_name(mode, ty);

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
                                        Mode::Visit | Mode::VisitAll => {
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
                Mode::Visit | Mode::VisitAll => {
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
    if let Some(ty) = extract_generic("Arc", ty) {
        match mode {
            Mode::Visit | Mode::VisitAll => {
                let visit = method_name(mode, ty);

                return q!(Vars { visit }, ({ _visitor.visit(n, _parent) })).parse();
            }
            Mode::VisitMut => {
                return Block {
                    brace_token: def_site(),
                    stmts: vec![],
                }
            }
            Mode::Fold => return q!(({ n })).parse(),
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
        Type::Paren(ty) => return create_method_body(mode, &ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if let Some(arg) = as_box(ty) {
                    match mode {
                        Mode::Fold => {
                            let ident = method_name(mode, arg);

                            return q!(
                                Vars { ident },
                                ({ swc_visit::util::map::Map::map(n, |n| _visitor.ident(*n)) })
                            )
                            .parse();
                        }
                        Mode::VisitAll | Mode::Visit | Mode::VisitMut => {
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
                                                            Some(n) => Some(
                                                                swc_visit::util::map::Map::map(
                                                                    n,
                                                                    |n| _visitor.ident(n),
                                                                ),
                                                            ),
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

                                        Mode::Visit | Mode::VisitAll => q!(
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
                                                        swc_visit::util::move_map::MoveMap::move_map(
                                                            n,
                                                            |v| swc_visit::util::map::Map::map(v, |v|_visitor.ident(v)),
                                                        )
                                                    })
                                                )
                                                .parse();
                                            }
                                        }
                                        Mode::Visit | Mode::VisitAll => {}
                                        Mode::VisitMut => {}
                                    }

                                    return if is_option(arg) {
                                        match mode {
                                            Mode::Fold => q!(
                                                Vars { ident },
                                                ({
                                                    swc_visit::util::move_map::MoveMap::move_map(
                                                        n,
                                                        |v| _visitor.ident(v),
                                                    )
                                                })
                                            )
                                            .parse(),
                                            Mode::VisitMut => q!(
                                                Vars { ident },
                                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                                            )
                                            .parse(),
                                            Mode::Visit | Mode::VisitAll => q!(
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
                                                    swc_visit::util::move_map::MoveMap::move_map(
                                                        n,
                                                        |v| _visitor.ident(v),
                                                    )
                                                })
                                            )
                                            .parse(),

                                            Mode::VisitMut => q!(
                                                Vars { ident },
                                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                                            )
                                            .parse(),

                                            Mode::Visit | Mode::VisitAll => q!(
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
                Mode::VisitAll | Mode::Visit | Mode::VisitMut => q!(({})).parse(),
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
    if let Some(ty) = extract_generic("Option", ty) {
        add_required(types, ty);
        types.push(ty.clone());
        return;
    }
    if let Some(ty) = extract_generic("Vec", ty) {
        add_required(types, ty);
        types.push(ty.clone());
        return;
    }
    if let Some(ty) = extract_generic("Arc", ty) {
        add_required(types, ty);
        types.push(ty.clone());
        return;
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

fn method_name_as_str(mode: Mode, ty: &Type) -> String {
    fn suffix(ty: &Type) -> String {
        // Box<T> has same name as T
        if let Some(ty) = extract_generic("Box", ty) {
            return suffix(ty);
        }

        if let Some(ty) = extract_generic("Arc", ty) {
            return format!("arc_{}", suffix(ty));
        }
        if let Some(ty) = extract_generic("Option", ty) {
            return format!("opt_{}", suffix(ty));
        }
        if let Some(ty) = extract_generic("Vec", ty) {
            if let Some(ty) = extract_generic("Option", ty) {
                return format!("opt_vec_{}", suffix(ty).to_plural());
            }
            if suffix(ty).to_plural() == suffix(ty) {
                return format!("{}_vec", suffix(ty).to_plural());
            }
            return format!("{}", suffix(ty).to_plural());
        }
        type_to_name(&ty).to_snake_case()
    }

    format!("{}_{}", mode.prefix(), suffix(ty))
}

fn method_name(mode: Mode, ty: &Type) -> Ident {
    let span = ty.span();
    Ident::new(&method_name_as_str(mode, ty), span)
}

fn type_to_name(ty: &Type) -> String {
    match ty {
        Type::Path(ty) => ty.path.segments.last().unwrap().ident.to_string(),
        _ => unimplemented!("type_to_name for type other than path: {:?}", ty),
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
