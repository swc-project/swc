extern crate proc_macro;

use std::{collections::HashSet, iter::once, mem::replace};

use inflector::Inflector;
use pmutil::{q, Quote, SpanExt};
use proc_macro2::Ident;
use swc_macros_common::{call_site, def_site};
use syn::{
    parse_quote::parse, punctuated::Punctuated, spanned::Spanned, Arm, AttrStyle, Attribute, Block,
    Expr, ExprBlock, ExprMatch, ExprMethodCall, Field, FieldValue, Fields, FieldsUnnamed, FnArg,
    GenericArgument, GenericParam, Generics, ImplItem, ImplItemMethod, ImplItemType, Index, Item,
    ItemEnum, ItemImpl, ItemTrait, Lifetime, LifetimeDef, Member, Path, PathArguments, Receiver,
    ReturnType, Signature, Stmt, Token, TraitItem, TraitItemMethod, Type, TypePath, TypeReference,
    Variant, VisPublic, Visibility,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum VisitorVariant {
    Normal,
    WithPath,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Mode {
    VisitAll,
    Visit(VisitorVariant),
    VisitMut(VisitorVariant),
    Fold(VisitorVariant),
}

impl Mode {
    fn trait_name(self) -> &'static str {
        match self {
            Mode::VisitAll => "VisitAll",
            Mode::Fold(VisitorVariant::Normal) => "Fold",
            Mode::Visit(VisitorVariant::Normal) => "Visit",
            Mode::VisitMut(VisitorVariant::Normal) => "VisitMut",
            Mode::Visit(VisitorVariant::WithPath) => "VisitAstPath",
            Mode::VisitMut(VisitorVariant::WithPath) => "VisitMutAstPath",
            Mode::Fold(VisitorVariant::WithPath) => "FoldAstPath",
        }
    }

    fn prefix(self) -> &'static str {
        match self {
            Mode::Fold { .. } => "fold",
            Mode::Visit { .. } | Mode::VisitAll => "visit",
            Mode::VisitMut { .. } => "visit_mut",
        }
    }

    fn visitor_variant(self) -> Option<VisitorVariant> {
        match self {
            Mode::Fold(v) | Mode::Visit(v) | Mode::VisitMut(v) => Some(v),
            Mode::VisitAll => None,
        }
    }

    fn name_of_trait_for_ast(self) -> Option<&'static str> {
        Some(match self {
            Mode::VisitAll => return None,
            Mode::Fold(VisitorVariant::Normal) => "FoldWith",
            Mode::Visit(VisitorVariant::Normal) => "VisitWiht",
            Mode::VisitMut(VisitorVariant::Normal) => "VisitMutWith",
            Mode::Visit(VisitorVariant::WithPath) => "VisitWithPath",
            Mode::VisitMut(VisitorVariant::WithPath) => "VisitMutWithPath",
            Mode::Fold(VisitorVariant::WithPath) => "FoldWithPath",
        })
    }

    fn name_of_trait_children_method_for_ast(self) -> Option<&'static str> {
        Some(match self {
            Mode::VisitAll => return None,
            Mode::Fold(VisitorVariant::Normal) => "fold_children_with",
            Mode::Fold(VisitorVariant::WithPath) => "fold_children_with_path",

            Mode::Visit(VisitorVariant::Normal) => "visit_children_with",
            Mode::Visit(VisitorVariant::WithPath) => "visit_children_with_path",

            Mode::VisitMut(VisitorVariant::Normal) => "visit_mut_children_with",
            Mode::VisitMut(VisitorVariant::WithPath) => "visit_mut_children_with_path",
        })
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
    q.push_tokens(&q!({
        pub type AstKindPath = swc_visit::AstKindPath<AstParentKind>;
        pub type AstNodePath<'ast> = swc_visit::AstNodePath<AstNodeRef<'ast>>;

        impl swc_visit::NodeRef for AstNodeRef<'_> {
            type ParentKind = AstParentKind;

            #[inline]
            fn parent_kind(&self) -> Self::ParentKind {
                self.kind()
            }
        }
    }));

    {
        let mut types = vec![];

        for stmts in block.stmts.iter() {
            let item = match stmts {
                Stmt::Item(item) => item,
                _ => unimplemented!("error reporting for something other than Item"),
            };

            make_method(Mode::VisitMut(VisitorVariant::Normal), item, &mut types);
        }
        let mut types = types
            .into_iter()
            .flat_map(expand_visitor_types)
            .collect::<Vec<_>>();

        types.retain(|ty| ast_enum_variant_name(ty, true).is_some());
        types.sort_by_cached_key(|ty| ast_enum_variant_name(ty, true));
        types.dedup_by_key(|ty| ast_enum_variant_name(ty, true));

        q.push_tokens(&make_ast_enum(&types, true));
        q.push_tokens(&make_ast_enum(&types, false));

        q.push_tokens(&make_impl_kind_for_node_ref(&types));
    }
    q.push_tokens(&make(Mode::Fold(VisitorVariant::WithPath), &block.stmts));
    q.push_tokens(&make(Mode::Fold(VisitorVariant::Normal), &block.stmts));

    q.push_tokens(&make(Mode::Visit(VisitorVariant::WithPath), &block.stmts));
    q.push_tokens(&make(Mode::Visit(VisitorVariant::Normal), &block.stmts));

    q.push_tokens(&make(
        Mode::VisitMut(VisitorVariant::WithPath),
        &block.stmts,
    ));
    q.push_tokens(&make(Mode::VisitMut(VisitorVariant::Normal), &block.stmts));

    q.push_tokens(&make(Mode::VisitAll, &block.stmts));

    proc_macro2::TokenStream::from(q).into()
}

fn expand_visitor_types(ty: Type) -> Vec<Type> {
    if let Some(inner) = extract_vec(&ty) {
        let new = q!(Vars { ty: &inner }, ([ty])).parse();
        return expand_visitor_types(inner.clone())
            .into_iter()
            .chain(once(ty))
            .chain(once(new))
            .collect();
    }

    if let Some(inner) = extract_generic("Arc", &ty) {
        let new = q!(Vars { ty: &inner }, (&'ast ty)).parse();
        return expand_visitor_types(inner.clone())
            .into_iter()
            .chain(once(ty))
            .chain(once(new))
            .collect();
    }

    if let Some(inner) = extract_generic("Option", &ty) {
        let new: Type = q!(Vars { ty: &inner }, (Option<&'ast ty>)).parse();
        return once(new)
            .into_iter()
            .chain(expand_visitor_types(inner.clone()))
            .into_iter()
            .chain(once(ty))
            .collect();
    }

    vec![ty]
}

fn ast_enum_variant_name(t: &Type, exclude_useless: bool) -> Option<String> {
    if skip(t) {
        return None;
    }

    if let Type::Reference(t) = t {
        // &'ast Option<&'ast Item> is useless.
        if let Some(..) = extract_generic("Option", &t.elem) {
            return None;
        }
    }

    if let Some(inner) = extract_generic("Option", t) {
        if let Some(inner) = extract_generic("Vec", inner) {
            return Some(format!(
                "OptVec{}",
                ast_enum_variant_name(inner, exclude_useless)?
            ));
        }
        if let Some(inner) = extract_generic("Box", inner) {
            return Some(format!(
                "Opt{}",
                ast_enum_variant_name(inner, exclude_useless)?
            ));
        }

        return Some(format!(
            "Opt{}",
            ast_enum_variant_name(inner, exclude_useless)?
        ));
    }

    if let Some(inner) = extract_generic("Arc", t) {
        return ast_enum_variant_name(inner, exclude_useless);
    }

    if let Some(inner) = extract_generic("Box", t) {
        if exclude_useless {
            return None;
        }

        return ast_enum_variant_name(inner, exclude_useless);
    }

    if let Some(inner) = extract_generic("Vec", t) {
        if let Some(inner) = extract_generic("Box", inner) {
            return Some(format!(
                "Vec{}",
                ast_enum_variant_name(inner, exclude_useless)?
            ));
        }

        if exclude_useless {
            return None;
        }

        return Some(format!(
            "Vec{}",
            ast_enum_variant_name(inner, exclude_useless)?
        ));
    }

    match t {
        Type::Path(p) => Some(p.path.segments.last().unwrap().ident.to_string()),
        Type::Reference(t) => ast_enum_variant_name(&t.elem, exclude_useless),
        Type::Slice(t) => Some(format!(
            "Vec{}",
            ast_enum_variant_name(&t.elem, exclude_useless)?
        )),
        _ => unimplemented!("Type: {:?}", t),
    }
}

fn unwrap_ref(ty: &Type) -> &Type {
    match ty {
        Type::Reference(t) => unwrap_ref(&t.elem),
        _ => ty,
    }
}

fn make_ast_enum(types: &[Type], is_ref: bool) -> Item {
    let mut variants = Punctuated::new();

    for ty in types {
        let name = ast_enum_variant_name(ty, true);
        let name = match name {
            Some(name) => name,
            None => continue,
        };

        let ident = Ident::new(&name, ty.span());
        let ty = process_ast_node_ref_type(unwrap_ref(ty));
        let second = if let Type::Slice(..) = unwrap_ref(&ty) {
            Some(Field {
                attrs: Default::default(),
                vis: Visibility::Inherited,
                colon_token: None,
                ident: None,
                ty: Type::Path(TypePath {
                    qself: None,
                    path: Ident::new("usize", ty.span()).into(),
                }),
            })
        } else {
            None
        };

        let fields = if !is_ref {
            match second {
                Some(index) => {
                    let mut fields = Punctuated::new();
                    fields.push(index);

                    Fields::Unnamed(FieldsUnnamed {
                        paren_token: def_site(),
                        unnamed: fields,
                    })
                }
                None => Fields::Unit,
            }
        } else {
            let mut fields = Punctuated::new();

            fields.push(Field {
                attrs: Default::default(),
                vis: Visibility::Inherited,
                colon_token: None,
                ident: None,
                ty: {
                    if extract_generic("Option", &ty).is_some() || matches!(ty, Type::Reference(..))
                    {
                        ty
                    } else {
                        Type::Reference(TypeReference {
                            and_token: ty.span().as_token(),
                            lifetime: Some(Lifetime {
                                apostrophe: call_site(),
                                ident: Ident::new("ast", ty.span()),
                            }),
                            mutability: Default::default(),
                            elem: Box::new(ty),
                        })
                    }
                },
            });

            fields.extend(second);

            Fields::Unnamed(FieldsUnnamed {
                paren_token: def_site(),
                unnamed: fields,
            })
        };

        variants.push(Variant {
            attrs: Default::default(),
            ident,
            fields,
            discriminant: None,
        });
    }
    let mut attrs = vec![];

    attrs.push(Attribute {
        pound_token: def_site(),
        style: AttrStyle::Outer,
        bracket_token: def_site(),
        path: q!({ derive }).parse(),
        tokens: q!({ (Debug, Copy, Clone, PartialEq) }).into(),
    });
    if !is_ref {
        attrs.push(Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ derive }).parse(),
            tokens: q!({ (Eq, PartialOrd, Ord, Hash) }).into(),
        });
    }
    attrs.push(Attribute {
        pound_token: def_site(),
        style: AttrStyle::Outer,
        bracket_token: def_site(),
        path: q!({ allow }).parse(),
        tokens: q!({ (clippy::derive_partial_eq_without_eq) }).into(),
    });

    Item::Enum(ItemEnum {
        attrs,
        vis: Visibility::Public(VisPublic {
            pub_token: def_site(),
        }),
        enum_token: def_site(),
        ident: if is_ref {
            Ident::new("AstNodeRef", call_site())
        } else {
            Ident::new("AstParentKind", call_site())
        },
        generics: if is_ref {
            let mut g = Punctuated::new();
            g.push(GenericParam::Lifetime(LifetimeDef {
                attrs: Default::default(),
                lifetime: Lifetime {
                    apostrophe: call_site(),
                    ident: Ident::new("ast", def_site()),
                },
                colon_token: Default::default(),
                bounds: Default::default(),
            }));

            Generics {
                lt_token: Some(def_site()),
                params: g,
                gt_token: Some(def_site()),
                where_clause: None,
            }
        } else {
            Default::default()
        },
        brace_token: def_site(),
        variants,
    })
}

fn make_impl_kind_for_node_ref(types: &[Type]) -> ItemImpl {
    let kind_type = Type::Path(TypePath {
        qself: None,
        path: Ident::new("AstParentKind", call_site()).into(),
    });

    let kind_type_item = ImplItem::Type(ImplItemType {
        attrs: Default::default(),
        vis: Visibility::Inherited,
        defaultness: Default::default(),
        type_token: def_site(),
        ident: Ident::new("Kind", call_site()),
        generics: Default::default(),
        eq_token: def_site(),
        ty: kind_type.clone(),
        semi_token: def_site(),
    });

    let kind_method_item = ImplItem::Method(ImplItemMethod {
        attrs: Default::default(),
        vis: Visibility::Inherited,
        defaultness: Default::default(),
        sig: Signature {
            constness: Default::default(),
            asyncness: Default::default(),
            unsafety: Default::default(),
            abi: Default::default(),
            fn_token: def_site(),
            ident: Ident::new("kind", call_site()),
            generics: Default::default(),
            paren_token: def_site(),
            inputs: {
                let mut v = Punctuated::new();
                v.push(FnArg::Receiver(Receiver {
                    attrs: Default::default(),
                    reference: Some((def_site(), None)),
                    mutability: None,
                    self_token: def_site(),
                }));

                v
            },
            variadic: Default::default(),
            output: ReturnType::Type(def_site(), Box::new(kind_type)),
        },
        block: Block {
            brace_token: def_site(),
            stmts: {
                let mut arms = vec![];

                for ty in types {}

                let expr = Expr::Match(ExprMatch {
                    attrs: Default::default(),
                    match_token: def_site(),
                    expr: q!({ self }).parse(),
                    brace_token: def_site(),
                    arms,
                });

                vec![Stmt::Expr(expr)]
            },
        },
    });

    ItemImpl {
        attrs: Default::default(),
        defaultness: Default::default(),
        unsafety: Default::default(),
        impl_token: def_site(),
        generics: Default::default(),
        trait_: Some((None, q!({ swc_visit::NodeRef }).parse(), def_site())),
        self_ty: q!({ AstNodeRef<'_> }).parse(),
        brace_token: def_site(),
        items: vec![kind_type_item, kind_method_item],
    }
}

fn process_ast_node_ref_type(ty: &Type) -> Type {
    if let Type::Reference(ty) = ty {
        if extract_generic("Option", &ty.elem).is_some() {
            return process_ast_node_ref_type(&ty.elem);
        }
    }

    if let Some(inner) = extract_vec(ty) {
        return q!(Vars { ty: &inner }, (&'ast [ty])).parse();
    }

    if let Some(inner) = extract_generic("Option", ty) {
        let inner = process_ast_node_ref_type(inner);
        return q!(Vars { ty: &inner }, (Option<ty>)).parse();
    }

    ty.clone()
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
    types.sort_by_cached_key(|ty| method_name_as_str(mode, ty));
    types.dedup_by_key(|ty| method_name_as_str(mode, ty));

    let types = types;

    methods.sort_by_cached_key(|v| v.sig.ident.to_string());
    methods.dedup_by_key(|v| v.sig.ident.to_string());

    for ty in &types {
        let sig = create_method_sig(mode, ty);
        let name = sig.ident.clone();
        let s = name.to_string();
        if methods.iter().any(|m| m.sig.ident == *s) {
            continue;
        }

        methods.push(TraitItemMethod {
            attrs: vec![],
            sig,
            default: Some(create_method_body(mode, ty)),
            semi_token: None,
        });
    }

    methods.sort_by_cached_key(|v| v.sig.ident.to_string());

    for ty in &types {
        let sig = create_method_sig(mode, ty);
        let name = sig.ident.clone();

        {
            // &'_ mut V, Box<V>
            let block = match mode.visitor_variant() {
                Some(VisitorVariant::Normal) | None => {
                    q!(Vars { visit: &name }, ({ (**self).visit(n) })).parse()
                }
                Some(VisitorVariant::WithPath) => {
                    q!(Vars { visit: &name }, ({ (**self).visit(n, __ast_path) })).parse()
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
                block: match mode.visitor_variant() {
                    Some(VisitorVariant::Normal) | None => q!(
                        Vars { visit: &name },
                        ({
                            match self {
                                swc_visit::Either::Left(v) => v.visit(n),
                                swc_visit::Either::Right(v) => v.visit(n),
                            }
                        })
                    )
                    .parse(),
                    Some(VisitorVariant::WithPath) => q!(
                        Vars { visit: &name },
                        ({
                            match self {
                                swc_visit::Either::Left(v) => v.visit(n, __ast_path),
                                swc_visit::Either::Right(v) => v.visit(n, __ast_path),
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
                    Mode::VisitAll
                    | Mode::Visit(VisitorVariant::Normal)
                    | Mode::VisitMut(VisitorVariant::Normal) => q!(
                        Vars { visit: &name },
                        ({
                            if self.enabled {
                                self.visitor.visit(n)
                            }
                        })
                    )
                    .parse(),

                    Mode::Visit(VisitorVariant::WithPath)
                    | Mode::VisitMut(VisitorVariant::WithPath) => q!(
                        Vars { visit: &name },
                        ({
                            if self.enabled {
                                self.visitor.visit(n, __ast_path)
                            }
                        })
                    )
                    .parse(),

                    Mode::Fold(VisitorVariant::Normal) => q!(
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

                    Mode::Fold(VisitorVariant::WithPath) => q!(
                        Vars { fold: &name },
                        ({
                            if self.enabled {
                                self.visitor.fold(n, __ast_path)
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
                        self.visitor.visit(n);
                        visit(self, n);
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

        let mut fn_name = v.sig.ident.clone();

        if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
            fn_name = Ident::new(&format!("{}_with_path", fn_name), def_site());
        }

        let default_body = replace(
            &mut v.default,
            Some(match mode {
                Mode::Fold(VisitorVariant::Normal)
                | Mode::VisitMut(VisitorVariant::Normal)
                | Mode::Visit(VisitorVariant::Normal) => q!(Vars { fn_name: &fn_name }, {
                    {
                        fn_name(self, n)
                    }
                })
                .parse(),

                Mode::Fold(VisitorVariant::WithPath)
                | Mode::VisitMut(VisitorVariant::WithPath)
                | Mode::Visit(VisitorVariant::WithPath) => q!(Vars { fn_name: &fn_name }, {
                    {
                        fn_name(self, n, __ast_path)
                    }
                })
                .parse(),

                Mode::VisitAll => Block {
                    brace_token: def_site(),
                    stmts: Default::default(),
                },
            }),
        );

        let arg_ty = v
            .sig
            .inputs
            .iter()
            .nth(1)
            .map(|v| match *v {
                FnArg::Typed(ref pat) => &pat.ty,
                _ => unreachable!(),
            })
            .unwrap();

        match mode {
            Mode::Fold(VisitorVariant::Normal) => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    /// Visits children of the nodes with the given visitor.
                    ///
                    /// This is the default implementation of a method of
                    /// [Fold].
                    #[allow(unused_variables)]
                    pub fn fn_name<V: ?Sized + Trait>(_visitor: &mut V, n: Type) -> Type {
                        default_body
                    }
                }
            )),

            Mode::VisitMut(VisitorVariant::Normal) => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    /// Visits children of the nodes with the given visitor.
                    ///
                    /// This is the default implementation of a method of
                    /// [VisitMut].
                    #[allow(unused_variables)]
                    pub fn fn_name<V: ?Sized + Trait>(_visitor: &mut V, n: Type) {
                        default_body
                    }
                }
            )),

            Mode::Visit(VisitorVariant::Normal) => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    /// Visits children of the nodes with the given visitor.
                    ///
                    /// This is the default implementation of a method of
                    /// [Visit].
                    #[allow(unused_variables)]
                    pub fn fn_name<V: ?Sized + Trait>(_visitor: &mut V, n: Type) {
                        default_body
                    }
                }
            )),

            Mode::Fold(VisitorVariant::WithPath) => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    #[cfg(any(feature = "path", docsrs))]
                    #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                    #[allow(unused_variables)]
                    fn fn_name<V: ?Sized + Trait>(
                        _visitor: &mut V,
                        n: Type,
                        __ast_path: &mut AstKindPath,
                    ) -> Type {
                        default_body
                    }
                }
            )),

            Mode::VisitMut(VisitorVariant::WithPath) => tokens.push_tokens(&q!(
                Vars {
                    fn_name,
                    default_body,
                    Type: arg_ty,
                    Trait: Ident::new(mode.trait_name(), call_site()),
                },
                {
                    #[cfg(any(feature = "path", docsrs))]
                    #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                    #[allow(unused_variables)]
                    fn fn_name<V: ?Sized + Trait>(
                        _visitor: &mut V,
                        n: Type,
                        __ast_path: &mut AstKindPath,
                    ) {
                        default_body
                    }
                }
            )),

            Mode::Visit(VisitorVariant::WithPath) => {
                tokens.push_tokens(&q!(
                    Vars {
                        fn_name,
                        default_body,
                        Type: arg_ty,
                        Trait: Ident::new(mode.trait_name(), call_site()),
                    },
                    {
                        #[cfg(any(feature = "path", docsrs))]
                        #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                        #[allow(unused_variables)]
                        fn fn_name<'ast, 'r, V: ?Sized + Trait>(
                            _visitor: &mut V,
                            n: Type,
                            __ast_path: &mut AstNodePath<'r>,
                        ) where
                            'ast: 'r,
                        {
                            default_body
                        }
                    }
                ));
            }

            Mode::VisitAll => {}
        }
    });

    let mut attrs = vec![];

    if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
        attrs.extend(feature_path_attrs())
    }

    tokens.push_tokens(&ItemTrait {
        attrs,
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

        if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
            item.attrs.extend(feature_path_attrs())
        }

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

        if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
            item.attrs.extend(feature_path_attrs())
        }

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

        if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
            item.attrs.extend(feature_path_attrs())
        }

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

        if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
            item.attrs.extend(feature_path_attrs())
        }

        tokens.push_tokens(&item);
    }

    // impl Visit for swc_visit::All<V> where V: VisitAll
    if mode == Mode::VisitAll {
        let mut item = q!(Vars {}, {
            impl<V> Visit for ::swc_visit::All<V> where V: VisitAll {}
        })
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
            Mode::Visit(VisitorVariant::Normal) => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                pub trait VisitWith<V: ?Sized + Visit> {
                    /// Calls a visitor method (v.visit_xxx) with self.
                    fn visit_with(&self, v: &mut V);

                    /// Visit children nodes of self with `v`
                    fn visit_children_with(&self, v: &mut V);
                }

                impl<V, T> VisitWith<V> for Box<T>
                where
                    V: ?Sized + Visit,
                    T: 'static + VisitWith<V>,
                {
                    fn visit_with(&self, v: &mut V) {
                        (**self).visit_with(v)
                    }

                    /// Visit children nodes of self with `v`
                    fn visit_children_with(&self, v: &mut V) {
                        (**self).visit_children_with(v)
                    }
                }
            }),

            Mode::Visit(VisitorVariant::WithPath) => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                #[cfg(any(feature = "path", docsrs))]
                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                pub trait VisitWithPath<V: ?Sized + VisitAstPath> {
                    /// Calls a visitor method (v.visit_xxx) with self and the
                    /// ast path.
                    fn visit_with_path<'ast, 'r>(
                        &'ast self,
                        v: &mut V,
                        ast_path: &mut AstNodePath<'r>,
                    ) where
                        'ast: 'r;

                    /// Visit children nodes with v and ast path appended
                    /// [AstNodeRef] describing `self`. The ast path will
                    /// be resotred when this method returns.
                    ///
                    /// This is the default implementaton of a handler method in
                    /// [VisitAstPath].
                    fn visit_children_with_path<'ast, 'r>(
                        &'ast self,
                        v: &mut V,
                        ast_path: &mut AstNodePath<'r>,
                    ) where
                        'ast: 'r;
                }

                #[cfg(any(feature = "path", docsrs))]
                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                impl<V, T> VisitWithPath<V> for Box<T>
                where
                    V: ?Sized + VisitAstPath,
                    T: 'static + VisitWithPath<V>,
                {
                    fn visit_with_path<'ast, 'r>(
                        &'ast self,
                        v: &mut V,
                        ast_path: &mut AstNodePath<'r>,
                    ) where
                        'ast: 'r,
                    {
                        (**self).visit_with_path(v, ast_path)
                    }

                    /// Visit children nodes of self with `v`
                    fn visit_children_with_path<'ast, 'r>(
                        &'ast self,
                        v: &mut V,
                        ast_path: &mut AstNodePath<'r>,
                    ) where
                        'ast: 'r,
                    {
                        (**self).visit_children_with_path(v, ast_path)
                    }
                }
            }),

            Mode::VisitAll => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                pub trait VisitAllWith<V: ?Sized + VisitAll> {
                    /// Calls a visitor method (v.visit_xxx) with self.
                    fn visit_all_with(&self, v: &mut V);

                    /// Visit children nodes of self with `v`
                    fn visit_all_children_with(&self, v: &mut V);
                }

                impl<V, T> VisitAllWith<V> for Box<T>
                where
                    V: ?Sized + VisitAll,
                    T: 'static + VisitAllWith<V>,
                {
                    fn visit_all_with(&self, v: &mut V) {
                        (**self).visit_all_with(v)
                    }

                    /// Visit children nodes of self with `v`
                    fn visit_all_children_with(&self, v: &mut V) {
                        (**self).visit_all_children_with(v)
                    }
                }
            }),
            Mode::Fold(VisitorVariant::Normal) => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                pub trait FoldWith<V: ?Sized + Fold> {
                    /// Calls a visitor method (v.fold_xxx) with self.
                    fn fold_with(self, v: &mut V) -> Self;

                    /// Visit children nodes of self with `v`
                    fn fold_children_with(self, v: &mut V) -> Self;
                }

                impl<V, T> FoldWith<V> for Box<T>
                where
                    V: ?Sized + Fold,
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
            Mode::Fold(VisitorVariant::WithPath) => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                #[cfg(any(feature = "path", docsrs))]
                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                pub trait FoldWithPath<V: ?Sized + FoldAstPath> {
                    /// Calls a visitor method (v.fold_xxx) with self and the
                    /// ast path.
                    fn fold_with_path(self, v: &mut V, ast_path: &mut AstKindPath) -> Self;

                    /// Visit children nodes with v and ast path appended
                    /// [AstKind] of `self`. The ast path will
                    /// be resotred when this method returns.
                    ///
                    /// This is the default implementaton of a handler method in
                    /// [FoldAstPath].
                    fn fold_children_with_path(self, v: &mut V, ast_path: &mut AstKindPath)
                        -> Self;
                }

                #[cfg(any(feature = "path", docsrs))]
                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                impl<V, T> FoldWithPath<V> for Box<T>
                where
                    V: ?Sized + FoldAstPath,
                    T: 'static + FoldWithPath<V>,
                {
                    fn fold_with_path(self, v: &mut V, ast_path: &mut AstKindPath) -> Self {
                        swc_visit::util::map::Map::map(self, |value| {
                            value.fold_with_path(v, ast_path)
                        })
                    }

                    /// Visit children nodes of self with `v`
                    fn fold_children_with_path(
                        self,
                        v: &mut V,
                        ast_path: &mut AstKindPath,
                    ) -> Self {
                        swc_visit::util::map::Map::map(self, |value| {
                            value.fold_children_with_path(v, ast_path)
                        })
                    }
                }
            }),
            Mode::VisitMut(VisitorVariant::Normal) => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                pub trait VisitMutWith<V: ?Sized + VisitMut> {
                    /// Calls a visitor method (v.visit_mut_xxx) with self.
                    fn visit_mut_with(&mut self, v: &mut V);

                    fn visit_mut_children_with(&mut self, v: &mut V);
                }

                impl<V, T> VisitMutWith<V> for Box<T>
                where
                    V: ?Sized + VisitMut,
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
            Mode::VisitMut(VisitorVariant::WithPath) => q!({
                /// A utility trait implemented for ast nodes, and allow to
                /// visit them with a visitor.
                #[cfg(any(feature = "path", docsrs))]
                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                pub trait VisitMutWithPath<V: ?Sized + VisitMutAstPath> {
                    /// Calls a visitor method (v.visit_mut_xxx) with self and
                    /// the ast path.
                    fn visit_mut_with_path(&mut self, v: &mut V, ast_path: &mut AstKindPath);

                    /// Visit children nodes with v and ast path appended
                    /// [AstKind] of `self`. The ast path will be resotred when
                    /// this method returns.
                    ///
                    /// This is the default implementaton of a handler method in
                    /// [VisitMutAstPath].
                    fn visit_mut_children_with_path(
                        &mut self,
                        v: &mut V,
                        ast_path: &mut AstKindPath,
                    );
                }

                #[cfg(any(feature = "path", docsrs))]
                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                #[doc = "Delegating implementation"]
                impl<V, T> VisitMutWithPath<V> for Box<T>
                where
                    V: ?Sized + VisitMutAstPath,
                    T: 'static + VisitMutWithPath<V>,
                {
                    fn visit_mut_with_path(&mut self, v: &mut V, ast_path: &mut AstKindPath) {
                        (**self).visit_mut_with_path(v, ast_path);
                    }

                    fn visit_mut_children_with_path(
                        &mut self,
                        v: &mut V,
                        ast_path: &mut AstKindPath,
                    ) {
                        (**self).visit_mut_children_with_path(v, ast_path);
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
            let mut method_name = method_sig.ident;

            if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
                method_name = Ident::new(&format!("{}_with_path", method_name), def_site());
            }

            // Prevent duplicate implementations.
            let s = method_name.to_string();
            if names.contains(&s) {
                continue;
            }
            names.insert(s);

            let expr = visit_expr(mode, ty, &q!({ v }).parse(), q!({ self }).parse());

            match mode {
                Mode::Visit(VisitorVariant::Normal) => {
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

                    if let Some(elem_ty) = extract_generic("Vec", ty) {
                        tokens.push_tokens(&q!(
                            Vars {
                                elem_ty,
                                expr,
                                default_body,
                            },
                            {
                                impl<V: ?Sized + Visit> VisitWith<V> for [elem_ty] {
                                    fn visit_with(&self, v: &mut V) {
                                        expr
                                    }

                                    fn visit_children_with(&self, _visitor: &mut V) {
                                        default_body
                                    }
                                }
                            }
                        ));

                        tokens.push_tokens(&q!(Vars { Type: ty }, {
                            impl<V: ?Sized + Visit> VisitWith<V> for Type {
                                fn visit_with(&self, v: &mut V) {
                                    (**self).visit_with(v)
                                }

                                fn visit_children_with(&self, _visitor: &mut V) {
                                    (**self).visit_children_with(_visitor)
                                }
                            }
                        }));
                    } else {
                        tokens.push_tokens(&q!(
                            Vars {
                                Type: ty,
                                expr,
                                default_body,
                            },
                            {
                                impl<V: ?Sized + Visit> VisitWith<V> for Type {
                                    fn visit_with(&self, v: &mut V) {
                                        expr
                                    }

                                    fn visit_children_with(&self, _visitor: &mut V) {
                                        default_body
                                    }
                                }
                            }
                        ));
                    }
                }

                Mode::Visit(VisitorVariant::WithPath) => {
                    let default_body = adjust_expr(mode, ty, q!({ self }).parse(), |expr| {
                        q!(
                            Vars {
                                expr,
                                method_name: &method_name
                            },
                            { method_name(_visitor, expr, __ast_path) }
                        )
                        .parse()
                    });

                    if let Some(elem_ty) = extract_generic("Vec", ty) {
                        tokens.push_tokens(&q!(
                            Vars {
                                elem_ty,
                                expr,
                                default_body,
                            },
                            {
                                #[cfg(any(feature = "path", docsrs))]
                                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                                impl<V: ?Sized + VisitAstPath> VisitWithPath<V> for [elem_ty] {
                                    fn visit_with_path<'ast, 'r>(
                                        &'ast self,
                                        v: &mut V,
                                        __ast_path: &mut AstNodePath<'r>,
                                    ) where
                                        'ast: 'r,
                                    {
                                        expr
                                    }

                                    fn visit_children_with_path<'ast, 'r>(
                                        &'ast self,
                                        _visitor: &mut V,
                                        __ast_path: &mut AstNodePath<'r>,
                                    ) where
                                        'ast: 'r,
                                    {
                                        default_body
                                    }
                                }
                            }
                        ));

                        tokens.push_tokens(&q!(Vars { Type: ty }, {
                            #[cfg(any(feature = "path", docsrs))]
                            #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                            impl<V: ?Sized + VisitAstPath> VisitWithPath<V> for Type {
                                fn visit_with_path<'ast, 'r>(
                                    &'ast self,
                                    v: &mut V,
                                    __ast_path: &mut AstNodePath<'r>,
                                ) where
                                    'ast: 'r,
                                {
                                    (**self).visit_with_path(v, __ast_path)
                                }

                                fn visit_children_with_path<'ast, 'r>(
                                    &'ast self,
                                    _visitor: &mut V,
                                    __ast_path: &mut AstNodePath<'r>,
                                ) where
                                    'ast: 'r,
                                {
                                    (**self).visit_children_with_path(_visitor, __ast_path)
                                }
                            }
                        }));
                    } else {
                        tokens.push_tokens(&q!(
                            Vars {
                                Type: ty,
                                expr,
                                default_body,
                            },
                            {
                                #[cfg(any(feature = "path", docsrs))]
                                #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                                impl<V: ?Sized + VisitAstPath> VisitWithPath<V> for Type {
                                    fn visit_with_path<'ast, 'r>(
                                        &'ast self,
                                        v: &mut V,
                                        __ast_path: &mut AstNodePath<'r>,
                                    ) where
                                        'ast: 'r,
                                    {
                                        expr
                                    }

                                    fn visit_children_with_path<'ast, 'r>(
                                        &'ast self,
                                        _visitor: &mut V,
                                        __ast_path: &mut AstNodePath<'r>,
                                    ) where
                                        'ast: 'r,
                                    {
                                        default_body
                                    }
                                }
                            }
                        ));
                    }
                }

                Mode::VisitAll => {
                    let default_body = adjust_expr(mode, ty, q!({ self }).parse(), |expr| {
                        q!(
                            Vars {
                                expr,
                                method_name: &method_name
                            },
                            { method_name(_visitor, expr,) }
                        )
                        .parse()
                    });

                    tokens.push_tokens(&q!(
                        Vars {
                            Type: ty,
                            expr,
                            default_body,
                        },
                        {
                            impl<V: ?Sized + VisitAll> VisitAllWith<V> for Type {
                                fn visit_all_with(&self, v: &mut V) {
                                    let mut all = ::swc_visit::All { visitor: v };
                                    let mut v = &mut all;
                                    expr
                                }

                                fn visit_all_children_with(&self, _visitor: &mut V) {
                                    let mut all = ::swc_visit::All { visitor: _visitor };
                                    let mut _visitor = &mut all;
                                    default_body
                                }
                            }
                        }
                    ));
                }

                Mode::VisitMut(VisitorVariant::Normal) => {
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
                            impl<V: ?Sized + VisitMut> VisitMutWith<V> for Type {
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

                Mode::VisitMut(VisitorVariant::WithPath) => {
                    let default_body = adjust_expr(mode, ty, q!({ self }).parse(), |expr| {
                        q!(
                            Vars {
                                expr,
                                method_name: &method_name
                            },
                            { method_name(_visitor, expr, __ast_path) }
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
                            #[cfg(any(feature = "path", docsrs))]
                            #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                            impl<V: ?Sized + VisitMutAstPath> VisitMutWithPath<V> for Type {
                                fn visit_mut_with_path(
                                    &mut self,
                                    v: &mut V,
                                    __ast_path: &mut AstKindPath,
                                ) {
                                    expr
                                }

                                fn visit_mut_children_with_path(
                                    &mut self,
                                    _visitor: &mut V,
                                    __ast_path: &mut AstKindPath,
                                ) {
                                    default_body
                                }
                            }
                        }
                    ));
                }

                Mode::Fold(VisitorVariant::Normal) => {
                    tokens.push_tokens(&q!(
                        Vars {
                            method_name,
                            Type: ty,
                            expr,
                        },
                        {
                            impl<V: ?Sized + Fold> FoldWith<V> for Type {
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

                Mode::Fold(VisitorVariant::WithPath) => {
                    tokens.push_tokens(&q!(
                        Vars {
                            method_name,
                            Type: ty,
                            expr,
                        },
                        {
                            #[cfg(any(feature = "path", docsrs))]
                            #[cfg_attr(docsrs, doc(cfg(feature = "path")))]
                            impl<V: ?Sized + FoldAstPath> FoldWithPath<V> for Type {
                                fn fold_with_path(
                                    self,
                                    v: &mut V,
                                    __ast_path: &mut AstKindPath,
                                ) -> Self {
                                    expr
                                }

                                fn fold_children_with_path(
                                    self,
                                    v: &mut V,
                                    __ast_path: &mut AstKindPath,
                                ) -> Self {
                                    method_name(v, self, __ast_path)
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
    if is_option(ty) {
        expr = if is_opt_vec(ty) {
            match mode {
                Mode::Fold { .. } => expr,
                Mode::VisitMut { .. } => expr,
                Mode::Visit { .. } | Mode::VisitAll => {
                    q!(Vars { expr }, { expr.as_ref().map(|v| &**v) }).parse()
                }
            }
        } else {
            match mode {
                Mode::Fold { .. } => expr,
                Mode::VisitMut { .. } => expr,
                Mode::Visit { .. } | Mode::VisitAll => q!(Vars { expr }, { expr.as_ref() }).parse(),
            }
        };
    }

    if as_box(ty).is_some() {
        expr = match mode {
            Mode::Visit { .. } | Mode::VisitAll => expr,
            Mode::VisitMut { .. } => expr,
            Mode::Fold { .. } => q!(Vars { expr }, { *expr }).parse(),
        };
    }

    expr = visit(expr);

    if as_box(ty).is_some() {
        expr = match mode {
            Mode::Visit { .. } | Mode::VisitAll => expr,
            Mode::VisitMut { .. } => expr,
            Mode::Fold { .. } => q!(Vars { expr }, { Box::new(expr) }).parse(),
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
        Mode::Fold(VisitorVariant::Normal)
        | Mode::VisitMut(VisitorVariant::Normal)
        | Mode::Visit(VisitorVariant::Normal)
        | Mode::VisitAll => q!(
            Vars {
                visitor,
                expr,
                visit_name
            },
            { visitor.visit_name(expr) }
        )
        .parse(),

        Mode::Fold(VisitorVariant::WithPath)
        | Mode::VisitMut(VisitorVariant::WithPath)
        | Mode::Visit(VisitorVariant::WithPath) => q!(
            Vars {
                visitor,
                expr,
                visit_name
            },
            { visitor.visit_name(expr, __ast_path) }
        )
        .parse(),
    })
}

fn make_arm_from_struct(mode: Mode, type_name: &Ident, path: &Path, variant: &Fields) -> Arm {
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
                Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => {
                    Stmt::Semi(expr, call_site())
                }
                Mode::Fold { .. } => q!(
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
        Mode::Fold { .. } => {
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
        Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => {}
    }

    let mut block = Block {
        brace_token: def_site(),
        stmts,
    };

    if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
        match mode {
            Mode::Visit { .. } => {
                block = q!(
                    Vars {
                        block,
                        AstKindVariant: type_name,
                    },
                    ({
                        __ast_path.with(
                            AstParentKind::AstKindVariant,
                            AstNodeRef::AstKindVariant(n),
                            |__ast_path| block,
                        )
                    })
                )
                .parse()
            }

            Mode::VisitMut { .. } | Mode::Fold { .. } => {
                block = q!(
                    Vars {
                        block,
                        AstKindVariant: type_name,
                    },
                    ({ __ast_path.with(AstParentKind::AstKindVariant, |__ast_path| block) })
                )
                .parse()
            }

            _ => {}
        }
    }

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
        generics: if let Mode::Visit(VisitorVariant::WithPath) = mode {
            q!({<'ast: 'r, 'r>}).parse()
        } else {
            Default::default()
        },
        paren_token: def_site(),
        inputs: {
            let mut p = Punctuated::default();
            p.push_value(q!(Vars {}, { &mut self }).parse());
            p.push_punct(def_site());
            match mode {
                Mode::Fold { .. } => {
                    p.push_value(q!(Vars { Type: ty }, { n: Type }).parse());
                }

                Mode::VisitMut { .. } => {
                    p.push_value(q!(Vars { Type: ty }, { n: &mut Type }).parse());
                }

                Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => {
                    p.push_value(q!(Vars { Type: ty }, { n: &Type }).parse());
                }

                Mode::Visit(VisitorVariant::WithPath) => {
                    p.push_value(q!(Vars { Type: ty }, { n: &'ast Type }).parse());
                }
            }

            if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
                p.push_punct(def_site());
                let ty = ast_path_type(mode);
                p.push_value(q!(Vars { Type: ty }, { __ast_path: Type }).parse());
            }

            p
        },
        variadic: None,
        output: match mode {
            Mode::Fold { .. } => q!(Vars { ty }, { -> ty }).parse(),
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
    let mut attrs = vec![];

    {
        let doc_str = "This method can be overriden to customize the visitor behavior.";
        attrs.push(Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ doc }).parse(),
            tokens: q!(Vars { doc_str },{ = doc_str }).into(),
        });
        attrs.push(Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ doc }).parse(),
            tokens: q!({ = "" }).into(),
        });
    }

    if let Some(trait_name) = mode.name_of_trait_for_ast() {
        let doc_str = format!(
            "This calls [`{}::{}`] on `n` by default. The default method visit children nodes \
             with `self`.",
            trait_name,
            mode.name_of_trait_children_method_for_ast().unwrap()
        );
        attrs.push(Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ doc }).parse(),
            tokens: q!(Vars { doc_str },{ = doc_str }).into(),
        });
    }

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
                let arm = make_arm_from_struct(mode, &s.ident, &s.ident.clone().into(), &s.fields);

                let mut match_expr: ExprMatch = q!((match n {})).parse();
                match_expr.arms.push(arm);

                Block {
                    brace_token: def_site(),
                    stmts: vec![q!(Vars { match_expr }, { match_expr }).parse()],
                }
            };

            let sig = method_sig_from_ident(mode, type_name);

            TraitItemMethod {
                attrs,
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
                        &e.ident,
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
                attrs,
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
            generics: if let Mode::Visit(VisitorVariant::WithPath) = mode {
                q!({<'ast: 'r, 'r>}).parse()
            } else {
                Default::default()
            },
            paren_token: def_site(),
            inputs: {
                let mut p = Punctuated::default();
                p.push_value(q!(Vars {}, { &mut self }).parse());
                p.push_punct(def_site());
                p.push_value(q!(Vars { Type: ty }, { n: Type }).parse());

                if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
                    p.push_punct(def_site());
                    p.push_value(
                        q!(
                            Vars {
                                Type: ast_path_type(mode)
                            },
                            { __ast_path: Type }
                        )
                        .parse(),
                    );
                }

                p
            },
            variadic: None,
            output: match mode {
                Mode::Fold { .. } => q!(Vars { ty }, { -> ty }).parse(),
                _ => ReturnType::Default,
            },
        }
    }

    fn mk_ref(mode: Mode, ident: Ident, ty: &Type, mutable: bool) -> Signature {
        if let Mode::Visit(VisitorVariant::WithPath) = mode {
            return mk_exact(mode, ident, &q!(Vars { ty }, (&'ast ty)).parse());
        }

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
        Type::Paren(ty) => create_method_sig(mode, &ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();
            let ident = method_name(mode, ty);

            if !last.arguments.is_empty() {
                if let Some(arg) = as_box(ty) {
                    let ident = method_name(mode, arg);
                    match mode {
                        Mode::Fold { .. } => {
                            return mk_exact(mode, ident, arg);
                        }

                        Mode::VisitMut { .. } => {
                            return mk_ref(mode, ident, arg, true);
                        }

                        Mode::Visit { .. } | Mode::VisitAll => {
                            return mk_ref(mode, ident, arg, false);
                        }
                    }
                }

                if let Some(arg) = extract_generic("Option", ty) {
                    let ident = method_name(mode, ty);

                    if let Some(item) = extract_vec(arg) {
                        match mode {
                            Mode::Fold { .. } => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &q!(Vars { item }, { Option<Vec<item>> }).parse(),
                                );
                            }
                            Mode::VisitMut { .. } => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &q!(Vars { item }, { &mut Option<Vec<item>> }).parse(),
                                );
                            }
                            Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &q!(Vars { item }, { Option<& [item]> }).parse(),
                                );
                            }
                            Mode::Visit(VisitorVariant::WithPath) => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &q!(Vars { item }, { Option<&'ast [item]> }).parse(),
                                );
                            }
                        }
                    }

                    match mode {
                        Mode::Fold { .. } => {
                            return mk_exact(
                                mode,
                                ident,
                                &q!(Vars { arg }, { Option<arg> }).parse(),
                            );
                        }
                        Mode::VisitMut { .. } => {
                            return mk_exact(
                                mode,
                                ident,
                                &q!(Vars { arg }, { &mut Option<arg> }).parse(),
                            );
                        }
                        Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => {
                            return mk_exact(
                                mode,
                                ident,
                                &q!(Vars { arg }, { Option<& arg> }).parse(),
                            );
                        }
                        Mode::Visit(VisitorVariant::WithPath) => {
                            return mk_exact(
                                mode,
                                ident,
                                &q!(Vars { arg }, { Option<&'ast arg> }).parse(),
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
                                        Mode::Fold { .. } => {
                                            return mk_exact(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Vec<arg> }).parse(),
                                            );
                                        }
                                        Mode::VisitMut { .. } => {
                                            return mk_ref(
                                                mode,
                                                ident,
                                                &q!(Vars { arg }, { Vec<arg> }).parse(),
                                                true,
                                            );
                                        }
                                        Mode::Visit { .. } | Mode::VisitAll => {
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
                Mode::Fold { .. } => mk_exact(mode, ident, ty),
                Mode::VisitMut { .. } => mk_ref(mode, ident, ty, true),
                Mode::Visit { .. } | Mode::VisitAll => mk_ref(mode, ident, ty, false),
            }
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => create_method_sig(mode, &ty.elem),
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
            Mode::Visit(..) | Mode::VisitAll => {
                let visit = method_name(mode, ty);
                let visit = wrap_call_with_ast_path(
                    mode,
                    &q! {{n}}.parse(),
                    q!(Vars { visit }, { _visitor.visit(n) }).parse(),
                    ty,
                );

                return Block {
                    brace_token: Default::default(),
                    stmts: vec![Stmt::Expr(visit)],
                };
            }
            Mode::VisitMut { .. } => {
                return Block {
                    brace_token: def_site(),
                    stmts: vec![],
                }
            }
            Mode::Fold { .. } => return q!(({ n })).parse(),
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
        Type::Paren(ty) => create_method_body(mode, &ty.elem),
        Type::Path(p) => {
            let last = p.path.segments.last().unwrap();

            if !last.arguments.is_empty() {
                if let Some(arg) = as_box(ty) {
                    match mode {
                        Mode::Fold(..) => {
                            let ident = method_name(mode, arg);
                            let inner = wrap_call_with_ast_path(
                                mode,
                                &q!({ n }).parse(),
                                q!(Vars { ident }, { _visitor.ident(*n) }).parse(),
                                arg,
                            );

                            return q!(
                                Vars { inner },
                                ({ swc_visit::util::map::Map::map(n, |n| inner) })
                            )
                            .parse();
                        }

                        Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => {
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

                                    if let Mode::Fold(..) = mode {
                                        if let Some(..) = as_box(arg) {
                                            let inner = wrap_call_with_ast_path(
                                                mode,
                                                &q!({ n }).parse(),
                                                q!(Vars { ident }, { _visitor.ident(n) }).parse(),
                                                arg,
                                            );

                                            return q!(
                                                Vars { inner },
                                                ({
                                                    match n {
                                                        Some(n) => {
                                                            Some(swc_visit::util::map::Map::map(
                                                                n,
                                                                |n| inner,
                                                            ))
                                                        }
                                                        None => None,
                                                    }
                                                })
                                            )
                                            .parse();
                                        }
                                    }

                                    return match mode {
                                        Mode::Fold(..) => {
                                            let inner = wrap_call_with_ast_path(
                                                mode,
                                                &q!({ n }).parse(),
                                                q!(Vars { ident }, { _visitor.ident(n) }).parse(),
                                                arg,
                                            );

                                            q!(
                                                Vars { inner },
                                                ({
                                                    match n {
                                                        Some(n) => Some(inner),
                                                        None => None,
                                                    }
                                                })
                                            )
                                            .parse()
                                        }

                                        Mode::VisitMut(..) | Mode::Visit(..) | Mode::VisitAll => {
                                            let inner = wrap_call_with_ast_path(
                                                mode,
                                                &q!({ n }).parse(),
                                                q!(Vars { ident }, { _visitor.ident(n) }).parse(),
                                                arg,
                                            );

                                            q!(
                                                Vars { inner },
                                                ({
                                                    match n {
                                                        Some(n) => inner,
                                                        None => {}
                                                    }
                                                })
                                            )
                                            .parse()
                                        }
                                    };
                                }
                                _ => unimplemented!("generic parameter other than type"),
                            }
                        }
                        _ => unimplemented!("Box() -> T or Box without a type parameter"),
                    }
                }

                if let Some(arg) = extract_generic("Vec", ty) {
                    let ident = method_name(mode, arg);

                    match mode {
                        Mode::Fold(v) => {
                            if let Some(boxed) = as_box(arg) {
                                return match v {
                                    VisitorVariant::Normal => q!(
                                        Vars { ident },
                                        ({
                                            swc_visit::util::move_map::MoveMap::move_map(n, |v| {
                                                swc_visit::util::map::Map::map(v, |v| {
                                                    _visitor.ident(v)
                                                })
                                            })
                                        })
                                    )
                                    .parse(),
                                    VisitorVariant::WithPath => {
                                        let ast_kind_outer =
                                            ast_enum_variant_name(ty, false).unwrap();
                                        let ast_kind_outer = Ident::new(&ast_kind_outer, ty.span());

                                        let ast_kind_inner =
                                            ast_enum_variant_name(boxed, false).unwrap();
                                        let ast_kind_inner = Ident::new(&ast_kind_inner, ty.span());

                                        q!(
                                            Vars {
                                                ident,
                                                AstKindVariantForVec: ast_kind_outer,
                                                AstKindVariantForBox: ast_kind_inner,
                                            },
                                            ({
                                                n.into_iter()
                                                    .enumerate()
                                                    .map(|(idx, v)| {
                                                        __ast_path.with(
                                                            AstParentKind::AstKindVariantForVec(
                                                                idx,
                                                            ),
                                                            |__ast_path| {
                                                                __ast_path.with(
                                                                AstParentKind::AstKindVariantForBox,
                                                                |__ast_path| {
                                                                    swc_visit::util::map::Map::map(
                                                                        v,
                                                                        |v| {
                                                                            _visitor.ident(
                                                                                v, __ast_path,
                                                                            )
                                                                        },
                                                                    )
                                                                },
                                                            )
                                                            },
                                                        )
                                                    })
                                                    .collect()
                                            })
                                        )
                                        .parse()
                                    }
                                };
                            }
                        }
                        Mode::Visit { .. } | Mode::VisitAll | Mode::VisitMut { .. } => {}
                    }

                    return if is_option(arg) {
                        match mode {
                            Mode::Fold(VisitorVariant::Normal) => q!(
                                Vars { ident },
                                ({
                                    swc_visit::util::move_map::MoveMap::move_map(n, |v| {
                                        _visitor.ident(v)
                                    })
                                })
                            )
                            .parse(),

                            Mode::Fold(VisitorVariant::WithPath) => {
                                let ast_kind = ast_enum_variant_name(ty, false).unwrap();
                                let ast_kind = Ident::new(&ast_kind, ty.span());

                                q!(
                                    Vars {
                                        ident,
                                        AstKindVariant: ast_kind,
                                    },
                                    ({
                                        n.into_iter()
                                            .enumerate()
                                            .map(|(idx, v)| {
                                                __ast_path.with(
                                                    AstParentKind::AstKindVariant(idx),
                                                    |__ast_path| _visitor.ident(v, __ast_path),
                                                )
                                            })
                                            .collect()
                                    })
                                )
                                .parse()
                            }

                            Mode::VisitMut(VisitorVariant::Normal) => q!(
                                Vars { ident },
                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                            )
                            .parse(),

                            Mode::VisitMut(VisitorVariant::WithPath) => {
                                let ast_kind = ast_enum_variant_name(ty, false).unwrap();
                                let ast_kind = Ident::new(&ast_kind, ty.span());

                                q!(
                                    Vars {
                                        ident,
                                        AstKindVariant: ast_kind,
                                    },
                                    ({
                                        n.iter_mut().enumerate().for_each(|(idx, v)| {
                                            __ast_path.with(
                                                AstParentKind::AstKindVariant(idx),
                                                |__ast_path| _visitor.ident(v, __ast_path),
                                            )
                                        })
                                    })
                                )
                                .parse()
                            }

                            Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => q!(
                                Vars { ident },
                                ({ n.iter().for_each(|v| _visitor.ident(v.as_ref())) })
                            )
                            .parse(),

                            Mode::Visit(VisitorVariant::WithPath) => {
                                let ast_kind = ast_enum_variant_name(ty, false).unwrap();
                                let ast_kind = Ident::new(&ast_kind, ty.span());

                                q!(
                                    Vars {
                                        ident,
                                        AstKindVariant: ast_kind,
                                    },
                                    ({
                                        n.iter().enumerate().for_each(|(idx, v)| {
                                            __ast_path.with(
                                                AstParentKind::AstKindVariant(idx),
                                                AstNodeRef::AstKindVariant(&n, idx),
                                                |__ast_path| _visitor.ident(v.as_ref(), __ast_path),
                                            )
                                        })
                                    })
                                )
                                .parse()
                            }
                        }
                    } else {
                        match mode {
                            Mode::Fold(VisitorVariant::Normal) => q!(
                                Vars { ident },
                                ({
                                    swc_visit::util::move_map::MoveMap::move_map(n, |v| {
                                        _visitor.ident(v)
                                    })
                                })
                            )
                            .parse(),

                            Mode::Fold(VisitorVariant::WithPath) => {
                                let ast_kind = ast_enum_variant_name(ty, false).unwrap();
                                let ast_kind = Ident::new(&ast_kind, ty.span());

                                q!(
                                    Vars {
                                        ident,
                                        AstKindVariant: ast_kind
                                    },
                                    ({
                                        n.into_iter()
                                            .enumerate()
                                            .map(|(idx, v)| {
                                                __ast_path.with(
                                                    AstParentKind::AstKindVariant(idx),
                                                    |__ast_path| _visitor.ident(v, __ast_path),
                                                )
                                            })
                                            .collect()
                                    })
                                )
                                .parse()
                            }

                            Mode::VisitMut(VisitorVariant::Normal) => q!(
                                Vars { ident },
                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                            )
                            .parse(),

                            Mode::VisitMut(VisitorVariant::WithPath) => {
                                let ast_kind = ast_enum_variant_name(ty, false).unwrap();
                                let ast_kind = Ident::new(&ast_kind, ty.span());

                                q!(
                                    Vars {
                                        ident,
                                        AstKindVariant: ast_kind,
                                    },
                                    ({
                                        n.iter_mut().enumerate().for_each(|(idx, v)| {
                                            __ast_path.with(
                                                AstParentKind::AstKindVariant(idx),
                                                |__ast_path| _visitor.ident(v, __ast_path),
                                            )
                                        })
                                    })
                                )
                                .parse()
                            }

                            Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => q!(
                                Vars { ident },
                                ({ n.iter().for_each(|v| _visitor.ident(v)) })
                            )
                            .parse(),

                            Mode::Visit(VisitorVariant::WithPath) => {
                                let ast_kind = ast_enum_variant_name(ty, false).unwrap();
                                let ast_kind = Ident::new(&ast_kind, ty.span());

                                q!(
                                    Vars {
                                        ident,
                                        AstKindVariant: ast_kind,
                                    },
                                    ({
                                        n.iter().enumerate().for_each(|(idx, v)| {
                                            __ast_path.with(
                                                AstParentKind::AstKindVariant(idx),
                                                AstNodeRef::AstKindVariant(&n, idx),
                                                |__ast_path| _visitor.ident(v, __ast_path),
                                            )
                                        })
                                    })
                                )
                                .parse()
                            }
                        }
                    };
                }
            }

            match mode {
                Mode::Fold { .. } => q!(({ return n })).parse(),
                Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => q!(({})).parse(),
            }
        }
        Type::Ptr(_) => unimplemented!("type: pointer"),
        Type::Reference(ty) => create_method_body(mode, &ty.elem),
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
    }
}

fn is_option(ty: &Type) -> bool {
    if let Type::Path(p) = ty {
        let last = p.path.segments.last().unwrap();

        if !last.arguments.is_empty() && last.ident == "Option" {
            return true;
        }
    }

    false
}

fn as_box(ty: &Type) -> Option<&Type> {
    extract_generic("Box", ty)
}

fn extract_generic<'a>(name: &str, ty: &'a Type) -> Option<&'a Type> {
    if let Type::Path(p) = ty {
        let last = p.path.segments.last().unwrap();

        if !last.arguments.is_empty() && last.ident == name {
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

    if let Type::Reference(r) = ty {
        return extract_generic(name, &r.elem);
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
            return suffix(ty).to_plural();
        }
        type_to_name(ty).to_snake_case()
    }

    format!("{}_{}", mode.prefix(), suffix(ty))
}

fn ast_path_type(mode: Mode) -> Type {
    match mode {
        Mode::Visit(_) => q!((&mut AstNodePath<'r>)).parse(),
        Mode::VisitMut(_) | Mode::Fold(_) => q!((&mut AstKindPath)).parse(),
        _ => unreachable!(),
    }
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

            p.path.segments.last().as_ref().unwrap().ident == "bool"
                || i == "u128"
                || i == "u64"
                || i == "u32"
                || i == "u16"
                || i == "u8"
                || i == "isize"
                || i == "i128"
                || i == "i64"
                || i == "i32"
                || i == "i16"
                || i == "i8"
                || i == "char"
                || i == "f32"
                || i == "f64"
        }
        Type::Reference(r) => skip(&r.elem),
        _ => false,
    }
}

fn feature_path_attrs() -> Vec<Attribute> {
    vec![
        Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ cfg }).parse(),
            tokens: q!({ (any(feature = "path", docsrs)) }).into(),
        },
        Attribute {
            pound_token: def_site(),
            style: AttrStyle::Outer,
            bracket_token: def_site(),
            path: q!({ cfg_attr }).parse(),
            tokens: q!({ (docsrs, doc(cfg(feature = "path"))) }).into(),
        },
    ]
}

fn wrap_call_with_ast_path(
    mode: Mode,
    node: &Expr,
    mut visit_expr: ExprMethodCall,
    ty: &Type,
) -> Expr {
    match mode.visitor_variant() {
        Some(VisitorVariant::WithPath) => {}
        _ => return Expr::MethodCall(visit_expr),
    }

    visit_expr.args.push(q!((__ast_path)).parse());

    // We don't store vectors
    if extract_generic("Vec", unwrap_ref(ty)).is_some() {
        return Expr::MethodCall(visit_expr);
    }

    let ast_kind_variant = ast_enum_variant_name(unwrap_ref(ty), false);

    let ast_kind_variant = match ast_kind_variant {
        Some(v) => v,
        _ => return Expr::MethodCall(visit_expr),
    };

    let ast_kind_variant = Ident::new(&ast_kind_variant, ty.span());

    match mode {
        Mode::Visit(_) => q!(
            Vars {
                visit_expr,
                node,
                AstKindVariant: ast_kind_variant
            },
            ({
                __ast_path.with(
                    AstParentKind::AstKindVariant,
                    AstNodeRef::AstKindVariant(&node),
                    |__ast_path| visit_expr,
                )
            })
        )
        .parse(),
        Mode::VisitMut(_) | Mode::Fold(_) => q!(
            Vars {
                visit_expr,
                AstKindVariant: ast_kind_variant
            },
            ({ __ast_path.with(AstParentKind::AstKindVariant, |__ast_path| visit_expr) })
        )
        .parse(),
        _ => {
            unreachable!();
        }
    }
}
