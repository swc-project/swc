#![allow(non_snake_case)]

extern crate proc_macro;

use std::{collections::HashSet, mem::replace};

use inflector::Inflector;
use pmutil::{q, Quote, SpanExt};
use proc_macro2::Ident;
use quote::quote;
use swc_macros_common::{call_site, def_site, make_doc_attr};
use syn::{
    parse_macro_input, parse_quote, punctuated::Punctuated, spanned::Spanned, Arm, AttrStyle,
    Attribute, Block, Expr, ExprBlock, ExprCall, ExprMatch, ExprMethodCall, ExprPath, ExprUnary,
    Field, FieldMutability, FieldPat, Fields, FieldsUnnamed, FnArg, GenericArgument, GenericParam,
    Generics, ImplItem, ImplItemFn, Index, Item, ItemEnum, ItemImpl, ItemMod, ItemStruct,
    ItemTrait, ItemUse, Lifetime, LifetimeParam, Member, Pat, PatIdent, PatStruct, PatTupleStruct,
    PatType, PatWild, Path, PathArguments, ReturnType, Signature, Stmt, Token, TraitItem,
    TraitItemFn, Type, TypePath, TypeReference, UnOp, UseTree, Variant, Visibility,
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
            Mode::Visit(VisitorVariant::Normal) => "VisitWith",
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
    let block = parse_macro_input!(tts as Block);

    let mut q = Quote::new_call_site();
    q.push_tokens(&q!({
        use swc_visit::ParentKind;

        pub type AstKindPath = swc_visit::AstKindPath<AstParentKind>;
        pub type AstNodePath<'ast> = swc_visit::AstNodePath<AstParentNodeRef<'ast>>;

        /// Not a public API
        #[doc(hidden)]
        impl swc_visit::NodeRef for AstParentNodeRef<'_> {
            type ParentKind = AstParentKind;

            #[inline]
            fn kind(&self) -> Self::ParentKind {
                self.kind()
            }

            #[inline]
            fn set_index(&mut self, index: usize) {
                self.set_index(index)
            }
        }
    }));

    let mut field_module_body = vec![];
    {
        for stmts in block.stmts.iter() {
            let item = match stmts {
                Stmt::Item(item) => item,
                _ => unimplemented!("error reporting for something other than Item"),
            };

            field_module_body.extend(make_field_enum(item));
        }

        q.push_tokens(&make_ast_enum(&block.stmts, true));
        q.push_tokens(&make_ast_enum(&block.stmts, false));

        q.push_tokens(&make_impl_kind_for_node_ref(&block.stmts));
        q.push_tokens(&make_impl_parent_kind(&block.stmts));
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

    q.push_tokens(&ItemMod {
        attrs: vec![make_doc_attr(
            "This module contains enums representing fields of each types",
        )],
        vis: Visibility::Public(Token![pub](def_site())),
        mod_token: Default::default(),
        ident: Ident::new("fields", call_site()),
        content: Some((Default::default(), field_module_body)),
        semi: None,
        unsafety: None,
    });

    proc_macro2::TokenStream::from(q).into()
}

fn make_field_enum_variant_from_named_field(type_name: &Ident, f: &Field) -> Variant {
    let fields = if is_vec_or_opt_vec(&f.ty) {
        let mut v = Punctuated::new();

        v.push(Field {
            attrs: Default::default(),
            vis: Visibility::Inherited,
            ident: None,
            colon_token: None,
            ty: parse_quote!(usize),
            mutability: FieldMutability::None,
        });

        Fields::Unnamed(FieldsUnnamed {
            paren_token: f.span().as_token(),
            unnamed: v,
        })
    } else {
        Fields::Unit
    };

    let field_name = f.ident.as_ref().unwrap();
    let doc_attr = make_doc_attr(&format!(
        "This represents [{field_name}](`crate::{type_name}::{field_name}`)",
        type_name = type_name,
        field_name = field_name,
    ));
    Variant {
        attrs: vec![doc_attr],
        ident: Ident::new(&field_name.to_string().to_pascal_case(), f.ident.span()),
        discriminant: Default::default(),
        fields,
    }
}

fn make_field_enum(item: &Item) -> Vec<Item> {
    let mut items = vec![];

    let name = match item {
        Item::Struct(s) => s.ident.clone(),
        Item::Enum(e) => {
            // Skip C-like enums
            if e.variants.iter().all(|v| v.fields.is_empty()) {
                return vec![];
            }

            e.ident.clone()
        }
        _ => return vec![],
    };

    let name = Ident::new(&format!("{}Field", name), name.span());
    {
        let mut attrs = vec![];

        let variants = match item {
            Item::Struct(s) => {
                let mut v = Punctuated::new();

                for f in s.fields.iter() {
                    if f.ident.is_none() {
                        continue;
                    }

                    v.push(make_field_enum_variant_from_named_field(&s.ident, f))
                }

                v
            }
            Item::Enum(e) => {
                let mut variants = Punctuated::new();

                for v in e.variants.iter() {
                    let doc_attr = make_doc_attr(&format!(
                        "This represents [{variant_name}](`crate::{type_name}::{variant_name}`)",
                        type_name = e.ident,
                        variant_name = v.ident,
                    ));

                    variants.push(Variant {
                        attrs: vec![doc_attr],
                        ident: Ident::new(&v.ident.to_string().to_pascal_case(), v.ident.span()),
                        discriminant: Default::default(),
                        fields: Fields::Unit,
                    })
                }

                variants
            }
            _ => return vec![],
        };

        attrs.push(Attribute {
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(derive(
                Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord, Hash
            )),
        });

        attrs.push(make_doc_attr(&format!(
            "This enum represents fields of [{type_name}](crate::{type_name})",
            type_name = name,
        )));

        attrs.push(Attribute {
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(cfg_attr(
                feature = "serde",
                derive(serde::Serialize, serde::Deserialize),
            )),
        });

        items.push(Item::Enum(ItemEnum {
            attrs,
            vis: Visibility::Public(Token![pub](def_site())),
            enum_token: Default::default(),
            ident: name.clone(),
            generics: Default::default(),
            brace_token: Default::default(),
            variants,
        }));
    }

    {
        let mut methods = vec![];

        methods.push(ImplItem::Fn(ImplItemFn {
            attrs: vec![make_doc_attr("This is not considered as a public API")],
            vis: Visibility::Public(Token![pub](def_site())),
            defaultness: Default::default(),
            sig: Signature {
                constness: Default::default(),
                asyncness: Default::default(),
                unsafety: Default::default(),
                abi: Default::default(),
                fn_token: name.span().as_token(),
                ident: Ident::new("set_index", name.span()),
                generics: Default::default(),
                paren_token: name.span().as_token(),
                inputs: {
                    let mut v = Punctuated::new();
                    v.push(FnArg::Receiver(parse_quote!(&mut self)));
                    v.push(FnArg::Typed(PatType {
                        attrs: Default::default(),
                        colon_token: Default::default(),
                        ty: parse_quote!(usize),
                        pat: Box::new(Pat::Ident(PatIdent {
                            attrs: Default::default(),
                            by_ref: Default::default(),
                            mutability: Default::default(),
                            ident: Ident::new("index", call_site()),
                            subpat: Default::default(),
                        })),
                    }));

                    v
                },
                variadic: Default::default(),
                output: ReturnType::Default,
            },
            block: {
                let mut arms = vec![];

                if let Item::Struct(s) = item {
                    for f in s.fields.iter() {
                        if f.ident.is_none() {
                            continue;
                        }

                        let variant_name = Ident::new(
                            &f.ident.as_ref().unwrap().to_string().to_pascal_case(),
                            f.ident.span(),
                        );

                        if is_vec_or_opt_vec(&f.ty) {
                            arms.push(Arm {
                                attrs: Default::default(),
                                pat: Pat::TupleStruct(PatTupleStruct {
                                    attrs: Default::default(),
                                    qself: None,
                                    path: parse_quote!(Self::#variant_name),
                                    paren_token: name.span().as_token(),
                                    elems: {
                                        let mut v = Punctuated::new();

                                        v.push(Pat::Ident(PatIdent {
                                            attrs: Default::default(),
                                            by_ref: None,
                                            mutability: None,
                                            ident: Ident::new("idx", name.span()),
                                            subpat: None,
                                        }));

                                        v
                                    },
                                }),
                                guard: Default::default(),
                                fat_arrow_token: name.span().as_token(),
                                body: parse_quote!({
                                    debug_assert!(
                                        *idx == usize::MAX || index == usize::MAX,
                                        "Should be usize::MAX"
                                    );
                                    *idx = index;
                                }),
                                comma: Some(name.span().as_token()),
                            });
                        }
                    }
                };

                arms.push(parse_quote!(_ => {}));

                let expr = Expr::Match(ExprMatch {
                    attrs: Default::default(),
                    match_token: name.span().as_token(),
                    expr: parse_quote!(self),
                    brace_token: name.span().as_token(),
                    arms,
                });

                Block {
                    brace_token: Default::default(),
                    stmts: vec![Stmt::Expr(expr, None)],
                }
            },
        }));

        items.push(Item::Impl(ItemImpl {
            attrs: Default::default(),
            defaultness: Default::default(),
            unsafety: Default::default(),
            impl_token: Default::default(),
            generics: Default::default(),
            trait_: Default::default(),
            self_ty: parse_quote!(#name),
            brace_token: Default::default(),
            items: methods,
        }));
    }

    items
}

fn make_ast_enum(stmts: &[Stmt], is_ref: bool) -> Item {
    let mut variants = Punctuated::new();

    for stmt in stmts {
        let item = match stmt {
            Stmt::Item(item) => item,
            _ => continue,
        };
        let name = match item {
            Item::Enum(ItemEnum {
                ident, variants, ..
            }) => {
                // Skip C-like enums
                if variants.iter().all(|v| v.fields.is_empty()) {
                    continue;
                }

                ident
            }
            Item::Struct(ItemStruct { ident, .. }) => ident,
            _ => continue,
        };

        let field_type_name = Ident::new(&format!("{}Field", name), name.span());

        let fields = {
            let mut fields = Punctuated::new();

            if is_ref {
                fields.push(Field {
                    attrs: Default::default(),
                    vis: Visibility::Inherited,
                    colon_token: None,
                    ident: None,
                    ty: Type::Reference(TypeReference {
                        and_token: name.span().as_token(),
                        lifetime: Some(Lifetime {
                            apostrophe: def_site(),
                            ident: Ident::new("ast", name.span()),
                        }),
                        mutability: Default::default(),
                        elem: Box::new(Type::Path(TypePath {
                            qself: Default::default(),
                            path: name.clone().into(),
                        })),
                    }),
                    mutability: FieldMutability::None,
                });
            }

            fields.push(Field {
                attrs: Default::default(),
                vis: Visibility::Inherited,
                colon_token: None,
                ident: None,
                ty: Type::Path(TypePath {
                    qself: Default::default(),
                    path: parse_quote!(self::fields::#field_type_name),
                }),
                mutability: FieldMutability::None,
            });

            Fields::Unnamed(FieldsUnnamed {
                paren_token: Default::default(),
                unnamed: fields,
            })
        };

        variants.push(Variant {
            attrs: Default::default(),
            ident: name.clone(),
            fields,
            discriminant: None,
        });
    }
    let mut attrs = vec![];

    attrs.push(Attribute {
        pound_token: Default::default(),
        style: AttrStyle::Outer,
        bracket_token: Default::default(),
        meta: parse_quote!(derive(Debug, Copy, Clone, PartialEq)),
    });
    if !is_ref {
        attrs.push(Attribute {
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(derive(Eq, PartialOrd, Ord, Hash)),
        });

        attrs.push(Attribute {
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(cfg_attr(
                feature = "serde",
                derive(serde::Serialize, serde::Deserialize),
            )),
        });
    }
    attrs.push(Attribute {
        pound_token: Default::default(),
        style: AttrStyle::Outer,
        bracket_token: Default::default(),
        meta: parse_quote!(allow(clippy::derive_partial_eq_without_eq)),
    });

    Item::Enum(ItemEnum {
        attrs,
        vis: Visibility::Public(Token![pub](def_site())),
        enum_token: Default::default(),
        ident: if is_ref {
            Ident::new("AstParentNodeRef", call_site())
        } else {
            Ident::new("AstParentKind", call_site())
        },
        generics: if is_ref {
            let mut g = Punctuated::new();
            g.push(GenericParam::Lifetime(LifetimeParam {
                attrs: Default::default(),
                lifetime: Lifetime {
                    apostrophe: def_site(),
                    ident: Ident::new("ast", def_site()),
                },
                colon_token: Default::default(),
                bounds: Default::default(),
            }));

            Generics {
                lt_token: Some(Token![<](def_site())),
                params: g,
                gt_token: Some(Token![>](def_site())),
                where_clause: None,
            }
        } else {
            Default::default()
        },
        brace_token: Default::default(),
        variants,
    })
}

fn make_impl_parent_kind(stmts: &[Stmt]) -> ItemImpl {
    let kind_type = Type::Path(TypePath {
        qself: None,
        path: Ident::new("AstParentKind", call_site()).into(),
    });

    let set_index_item = ImplItem::Fn(ImplItemFn {
        attrs: Default::default(),
        vis: Visibility::Inherited,
        defaultness: Default::default(),
        sig: Signature {
            constness: Default::default(),
            asyncness: Default::default(),
            unsafety: Default::default(),
            abi: Default::default(),
            fn_token: Default::default(),
            ident: Ident::new("set_index", call_site()),
            generics: Default::default(),
            paren_token: Default::default(),
            inputs: {
                let mut v = Punctuated::new();
                v.push(FnArg::Receiver(parse_quote!(&mut self)));
                v.push(FnArg::Typed(PatType {
                    attrs: Default::default(),
                    colon_token: Default::default(),
                    ty: parse_quote!(usize),
                    pat: Box::new(Pat::Ident(PatIdent {
                        attrs: Default::default(),
                        by_ref: Default::default(),
                        mutability: Default::default(),
                        ident: Ident::new("index", call_site()),
                        subpat: Default::default(),
                    })),
                }));

                v
            },
            variadic: Default::default(),
            output: ReturnType::Default,
        },
        block: Block {
            brace_token: Default::default(),
            stmts: {
                let mut arms = vec![];

                for stmt in stmts {
                    let item = match stmt {
                        Stmt::Item(item) => item,
                        _ => continue,
                    };
                    let name = match item {
                        Item::Enum(ItemEnum {
                            ident, variants, ..
                        }) => {
                            if variants.iter().all(|v| v.fields.is_empty()) {
                                continue;
                            }
                            ident
                        }
                        Item::Struct(ItemStruct { ident, .. }) => ident,
                        _ => continue,
                    };

                    arms.push(Arm {
                        attrs: Default::default(),
                        pat: Pat::TupleStruct(PatTupleStruct {
                            attrs: Default::default(),
                            path: parse_quote!(Self::#name),
                            qself: None,
                            paren_token: Default::default(),
                            elems: {
                                let mut v = Punctuated::new();
                                v.push(Pat::Ident(PatIdent {
                                    attrs: Default::default(),
                                    by_ref: Default::default(),
                                    mutability: Default::default(),
                                    ident: Ident::new("v", name.span()),
                                    subpat: Default::default(),
                                }));

                                v
                            },
                        }),
                        guard: Default::default(),
                        fat_arrow_token: name.span().as_token(),
                        body: parse_quote!(v.set_index(index)),
                        comma: Some(name.span().as_token()),
                    })
                }

                let match_expr = Expr::Match(ExprMatch {
                    attrs: Default::default(),
                    match_token: Default::default(),
                    expr: parse_quote!(self),
                    brace_token: Default::default(),
                    arms,
                });

                vec![Stmt::Expr(match_expr, None)]
            },
        },
    });

    ItemImpl {
        attrs: Default::default(),
        defaultness: Default::default(),
        unsafety: Default::default(),
        impl_token: Default::default(),
        generics: Default::default(),
        trait_: Some((None, parse_quote!(ParentKind), Token![for](def_site()))),
        self_ty: Box::new(kind_type),
        brace_token: Default::default(),
        items: vec![set_index_item],
    }
}

fn make_impl_kind_for_node_ref(stmts: &[Stmt]) -> Option<ItemImpl> {
    let kind_type = Type::Path(TypePath {
        qself: None,
        path: Ident::new("AstParentKind", call_site()).into(),
    });

    let kind_item = ImplItem::Fn(ImplItemFn {
        attrs: Default::default(),
        vis: Visibility::Public(Token![pub](def_site())),
        defaultness: Default::default(),
        sig: Signature {
            constness: Default::default(),
            asyncness: Default::default(),
            unsafety: Default::default(),
            abi: Default::default(),
            fn_token: Default::default(),
            ident: Ident::new("kind", call_site()),
            generics: Default::default(),
            paren_token: Default::default(),
            inputs: {
                let mut v = Punctuated::new();
                v.push(FnArg::Receiver(parse_quote!(&self)));

                v
            },
            variadic: Default::default(),
            output: ReturnType::Type(Token![->](def_site()), Box::new(kind_type)),
        },
        block: Block {
            brace_token: Default::default(),
            stmts: {
                let mut arms = vec![];

                for stmt in stmts {
                    let item = match stmt {
                        Stmt::Item(item) => item,
                        _ => continue,
                    };
                    let name = match item {
                        Item::Enum(ItemEnum {
                            ident, variants, ..
                        }) => {
                            if variants.iter().all(|v| v.fields.is_empty()) {
                                continue;
                            }
                            ident
                        }
                        Item::Struct(ItemStruct { ident, .. }) => ident,
                        _ => continue,
                    };

                    let field_kind = Ident::new("__field_kind", item.span());

                    let pat = Pat::TupleStruct(PatTupleStruct {
                        attrs: Default::default(),
                        path: parse_quote!(Self::#name),
                        qself: None,
                        paren_token: Default::default(),
                        elems: {
                            let mut v = Punctuated::new();

                            // Ignore node ref itself
                            v.push(Pat::Wild(PatWild {
                                attrs: Default::default(),
                                underscore_token: stmt.span().as_token(),
                            }));

                            v.push(Pat::Ident(PatIdent {
                                attrs: Default::default(),
                                ident: field_kind.clone(),
                                subpat: None,
                                by_ref: Default::default(),
                                mutability: Default::default(),
                            }));

                            v
                        },
                    });

                    let path_expr = Expr::Path(ExprPath {
                        attrs: Default::default(),
                        qself: Default::default(),
                        path: parse_quote!(AstParentKind::#name),
                    });

                    arms.push(Arm {
                        attrs: Default::default(),
                        pat,
                        guard: Default::default(),
                        fat_arrow_token: stmt.span().as_token(),
                        body: Box::new(Expr::Call(ExprCall {
                            attrs: Default::default(),
                            func: Box::new(path_expr),
                            paren_token: Default::default(),
                            args: {
                                let mut v = Punctuated::new();
                                v.push(Expr::Unary(ExprUnary {
                                    attrs: Default::default(),
                                    op: UnOp::Deref(Token![*](def_site())),
                                    expr: Box::new(Expr::Path(ExprPath {
                                        attrs: Default::default(),
                                        qself: None,
                                        path: field_kind.clone().into(),
                                    })),
                                }));
                                v
                            },
                        })),
                        comma: Some(stmt.span().as_token()),
                    });
                }

                let expr = Expr::Match(ExprMatch {
                    attrs: Default::default(),
                    match_token: Default::default(),
                    expr: parse_quote!(self),
                    brace_token: Default::default(),
                    arms,
                });

                vec![Stmt::Expr(expr, None)]
            },
        },
    });

    let set_index_item = ImplItem::Fn(ImplItemFn {
        attrs: Default::default(),
        vis: Visibility::Inherited,
        defaultness: Default::default(),
        sig: Signature {
            constness: Default::default(),
            asyncness: Default::default(),
            unsafety: Default::default(),
            abi: Default::default(),
            fn_token: Default::default(),
            ident: Ident::new("set_index", call_site()),
            generics: Default::default(),
            paren_token: Default::default(),
            inputs: {
                let mut v = Punctuated::new();
                v.push(FnArg::Receiver(parse_quote!(&mut self)));
                v.push(FnArg::Typed(PatType {
                    attrs: Default::default(),
                    colon_token: Default::default(),
                    ty: parse_quote!(usize),
                    pat: Box::new(Pat::Ident(PatIdent {
                        attrs: Default::default(),
                        by_ref: Default::default(),
                        mutability: Default::default(),
                        ident: Ident::new("index", call_site()),
                        subpat: Default::default(),
                    })),
                }));

                v
            },
            variadic: Default::default(),
            output: ReturnType::Default,
        },
        block: Block {
            brace_token: Default::default(),
            stmts: {
                let mut arms = vec![];

                for stmt in stmts {
                    let item = match stmt {
                        Stmt::Item(item) => item,
                        _ => continue,
                    };
                    let name = match item {
                        Item::Enum(ItemEnum {
                            ident, variants, ..
                        }) => {
                            if variants.iter().all(|v| v.fields.is_empty()) {
                                continue;
                            }
                            ident
                        }
                        Item::Struct(ItemStruct { ident, .. }) => ident,
                        _ => continue,
                    };

                    let field_kind = Ident::new("__field_kind", item.span());

                    let pat = Pat::TupleStruct(PatTupleStruct {
                        attrs: Default::default(),
                        qself: None,
                        path: parse_quote!(Self::#name),
                        paren_token: Default::default(),
                        elems: {
                            let mut v = Punctuated::new();

                            // Ignore node ref itself
                            v.push(Pat::Wild(PatWild {
                                attrs: Default::default(),
                                underscore_token: stmt.span().as_token(),
                            }));

                            v.push(Pat::Ident(PatIdent {
                                attrs: Default::default(),
                                ident: field_kind.clone(),
                                subpat: None,
                                by_ref: Default::default(),
                                mutability: Default::default(),
                            }));

                            v
                        },
                    });

                    arms.push(Arm {
                        attrs: Default::default(),
                        pat,
                        guard: Default::default(),
                        fat_arrow_token: stmt.span().as_token(),
                        body: parse_quote!(__field_kind.set_index(index)),
                        comma: Some(stmt.span().as_token()),
                    });
                }

                let match_expr = Expr::Match(ExprMatch {
                    attrs: Default::default(),
                    match_token: Default::default(),
                    expr: parse_quote!(self),
                    brace_token: Default::default(),
                    arms,
                });

                vec![Stmt::Expr(match_expr, None)]
            },
        },
    });

    Some(ItemImpl {
        attrs: Default::default(),
        defaultness: Default::default(),
        unsafety: Default::default(),
        impl_token: Default::default(),
        generics: Default::default(),
        trait_: None,
        self_ty: parse_quote!(AstParentNodeRef<'_>),
        brace_token: Default::default(),
        items: vec![kind_item, set_index_item],
    })
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
    types.retain(|ty| extract_box(ty).is_none());
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

        methods.push(TraitItemFn {
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
                    parse_quote!({ (**self).#name(n) })
                }
                Some(VisitorVariant::WithPath) => {
                    parse_quote!({ (**self).#name(n, __ast_path) })
                }
            };

            ref_methods.push(ImplItemFn {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: sig.clone(),
                block,
            });
        }

        {
            // Either

            either_methods.push(ImplItemFn {
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

            optional_methods.push(ImplItemFn {
                attrs: vec![],
                vis: Visibility::Inherited,
                defaultness: None,
                sig: sig.clone(),
                block: match mode {
                    Mode::VisitAll
                    | Mode::Visit(VisitorVariant::Normal)
                    | Mode::VisitMut(VisitorVariant::Normal) => parse_quote!({
                        if self.enabled {
                            self.visitor.#name(n)
                        }
                    }),

                    Mode::Visit(VisitorVariant::WithPath)
                    | Mode::VisitMut(VisitorVariant::WithPath) => parse_quote!({
                        if self.enabled {
                            self.visitor.#name(n, __ast_path)
                        }
                    }),

                    Mode::Fold(VisitorVariant::Normal) => parse_quote!({
                        if self.enabled {
                            self.visitor.#name(n)
                        } else {
                            n
                        }
                    }),

                    Mode::Fold(VisitorVariant::WithPath) => parse_quote!({
                        if self.enabled {
                            self.visitor.#name(n, __ast_path)
                        } else {
                            n
                        }
                    }),
                },
            });
        }

        {
            // Visit <-> VisitAll using swc_visit::All

            visit_all_methods.push(ImplItemFn {
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
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(allow(non_shorthand_field_patterns, unused_variables)),
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
                | Mode::Visit(VisitorVariant::Normal) => parse_quote!({#fn_name(self, n)}),

                Mode::Fold(VisitorVariant::WithPath)
                | Mode::VisitMut(VisitorVariant::WithPath)
                | Mode::Visit(VisitorVariant::WithPath) => {
                    parse_quote!({ fn_name(self, n, __ast_path) })
                }

                Mode::VisitAll => Block {
                    brace_token: Default::default(),
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
                    #[allow(non_shorthand_field_patterns, unused_variables)]
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
                    #[allow(non_shorthand_field_patterns, unused_variables)]
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
                    #[allow(non_shorthand_field_patterns, unused_variables)]
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
                    #[allow(non_shorthand_field_patterns, unused_variables)]
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
                    #[allow(non_shorthand_field_patterns, unused_variables)]
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
                        #[allow(non_shorthand_field_patterns, unused_variables)]
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
        vis: Visibility::Public(Token![pub](def_site())),
        unsafety: None,
        auto_token: None,
        trait_token: Default::default(),
        ident: Ident::new(mode.trait_name(), call_site()),
        generics: Default::default(),
        colon_token: None,
        supertraits: Default::default(),
        brace_token: Default::default(),
        items: methods.into_iter().map(TraitItem::Fn).collect(),
        restriction: None,
    });

    {
        // impl Visit for &'_ mut V

        let trait_name = Ident::new(mode.trait_name(), call_site());

        let mut item: ItemImpl =
            parse_quote!(impl<'a, V> #trait_name for &'a mut V where V: ?Sized + #trait_name {});

        item.items
            .extend(ref_methods.clone().into_iter().map(ImplItem::Fn));

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

        item.items.extend(ref_methods.into_iter().map(ImplItem::Fn));

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
            .extend(optional_methods.into_iter().map(ImplItem::Fn));

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
            .extend(either_methods.into_iter().map(ImplItem::Fn));

        if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
            item.attrs.extend(feature_path_attrs())
        }

        tokens.push_tokens(&item);
    }

    // impl Visit for swc_visit::All<V> where V: VisitAll
    if mode == Mode::VisitAll {
        let mut item: ItemImpl = parse_quote!(
            impl<V> Visit for ::swc_visit::All<V> where V: VisitAll {}
        );

        item.items
            .extend(visit_all_methods.into_iter().map(ImplItem::Fn));

        tokens.push_tokens(&item);
        tokens.push_tokens(&quote!(
            pub use swc_visit::All;
        ));
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
                    /// [AstParentNodeRef] describing `self`. The ast path will
                    /// be restored when this method returns.
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
                    /// be restored when this method returns.
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
                    /// [AstKind] of `self`. The ast path will be restored when
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
            if extract_box(ty).is_some() {
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

            let expr = visit_expr(mode, ty, &parse_quote!(v), parse_quote!(self), None);

            match mode {
                Mode::Visit(VisitorVariant::Normal) => {
                    let default_body = adjust_expr(mode, ty, parse_quote!(self), |expr| {
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
                    let default_body = adjust_expr(mode, ty, parse_quote!(self), |expr| {
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
                    let default_body = adjust_expr(mode, ty, parse_quote!(self), |expr| {
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
                    let default_body = adjust_expr(mode, ty, parse_quote!(self), |expr| {
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
                    parse_quote!(#expr.as_ref().map(|v| &**v))
                }
            }
        } else {
            match mode {
                Mode::Fold { .. } => expr,
                Mode::VisitMut { .. } => expr,
                Mode::Visit { .. } | Mode::VisitAll => parse_quote!(#expr.as_ref()),
            }
        };
    }

    if extract_box(ty).is_some() {
        expr = match mode {
            Mode::Visit { .. } | Mode::VisitAll => expr,
            Mode::VisitMut { .. } => expr,
            Mode::Fold { .. } => parse_quote!(*#expr),
        };
    }

    expr = visit(expr);

    if extract_box(ty).is_some() {
        expr = match mode {
            Mode::Visit { .. } | Mode::VisitAll => expr,
            Mode::VisitMut { .. } => expr,
            Mode::Fold { .. } => parse_quote!(Box::new(#expr)),
        };
    }

    expr
}

///
///
/// - `Box<Expr>` => visit(&node) or Box::new(visit(*node))
/// - `Vec<Expr>` => &*node or
fn visit_expr(
    mode: Mode,
    ty: &Type,
    visitor: &Expr,
    expr: Expr,
    ast_path: Option<(Ident, Ident)>,
) -> Expr {
    let visit_name = method_name(mode, ty);

    adjust_expr(mode, ty, expr, |expr| match mode {
        Mode::Fold(VisitorVariant::Normal)
        | Mode::VisitMut(VisitorVariant::Normal)
        | Mode::Visit(VisitorVariant::Normal)
        | Mode::VisitAll => parse_quote!(#visitor.#visit_name(#expr)),

        Mode::Fold(VisitorVariant::WithPath)
        | Mode::VisitMut(VisitorVariant::WithPath)
        | Mode::Visit(VisitorVariant::WithPath) => {
            if let Some((type_name, field_name)) = ast_path {
                let field_type_name = Ident::new(&format!("{}Field", type_name), type_name.span());

                let field_name =
                    Ident::new(&field_name.to_string().to_pascal_case(), field_name.span());

                let ast_path_expr: Expr = match mode {
                    Mode::Visit(..) => {
                        if is_vec_or_opt_vec(ty) {
                            q!(
                                Vars {
                                    VariantName: type_name,
                                    FieldType: field_type_name,
                                    FieldName: field_name,
                                },
                                (AstParentNodeRef::VariantName(
                                    n,
                                    self::fields::FieldType::FieldName(usize::MAX)
                                ))
                            )
                            .parse()
                        } else {
                            q!(
                                Vars {
                                    VariantName: type_name,
                                    FieldType: field_type_name,
                                    FieldName: field_name,
                                },
                                (AstParentNodeRef::VariantName(
                                    n,
                                    self::fields::FieldType::FieldName
                                ))
                            )
                            .parse()
                        }
                    }
                    _ => {
                        if is_vec_or_opt_vec(ty) {
                            q!(
                                Vars {
                                    VariantName: type_name,
                                    FieldType: field_type_name,
                                    FieldName: field_name,
                                },
                                (AstParentKind::VariantName(self::fields::FieldType::FieldName(
                                    usize::MAX
                                )))
                            )
                            .parse()
                        } else {
                            q!(
                                Vars {
                                    VariantName: type_name,
                                    FieldType: field_type_name,
                                    FieldName: field_name,
                                },
                                (AstParentKind::VariantName(self::fields::FieldType::FieldName))
                            )
                            .parse()
                        }
                    }
                };

                q!(
                    Vars {
                        visitor,
                        expr,
                        visit_name,
                        ast_path_expr,
                    },
                    {
                        {
                            let mut __ast_path = __ast_path.with_guard(ast_path_expr);
                            visitor.visit_name(expr, &mut *__ast_path)
                        }
                    }
                )
                .parse()
            } else {
                q!(
                    Vars {
                        visitor,
                        expr,
                        visit_name
                    },
                    { visitor.visit_name(expr, __ast_path) }
                )
                .parse()
            }
        }
    })
}

fn make_arm_from_struct(
    mode: Mode,
    type_name: &Ident,
    path: &Path,
    variant_name: Option<&Ident>,
    variant: &Fields,
    use_ast_path: bool,
) -> Arm {
    let mut stmts = vec![];
    let mut fields: Punctuated<FieldPat, Token![,]> = Default::default();

    for (i, field) in variant.iter().enumerate() {
        let ty = &field.ty;

        let binding_ident = field
            .ident
            .clone()
            .unwrap_or_else(|| Ident::new(&format!("_{}", i), call_site()));

        if !skip(ty) {
            let expr: Expr = parse_quote!(#binding_ident);

            let ast_path = if use_ast_path {
                Some((
                    type_name.clone(),
                    field
                        .ident
                        .clone()
                        .unwrap_or_else(|| variant_name.cloned().unwrap()),
                ))
            } else {
                None
            };

            let expr = visit_expr(mode, ty, &parse_quote!(_visitor), expr, ast_path);
            stmts.push(match mode {
                Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => {
                    Stmt::Expr(expr, Some(Token![;](call_site())))
                }
                Mode::Fold { .. } => parse_quote!(let #binding_ident = #expr;),
            });
        }

        fields.push(FieldPat {
            attrs: vec![],
            member: if field.ident.is_none() {
                Member::Unnamed(Index {
                    index: i as _,
                    span: path.span(),
                })
            } else {
                Member::Named(field.ident.clone().unwrap())
            },
            colon_token: Some(Token![:](def_site())),
            pat: Box::new(Pat::Ident(PatIdent {
                attrs: Default::default(),
                by_ref: None,
                mutability: None,
                ident: binding_ident,
                subpat: None,
            })),
        });
    }

    match mode {
        Mode::Fold { .. } => {
            // Append return statement
            stmts.push(parse_quote!(return #path { #fields };))
        }
        Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => {}
    }

    let block = Block {
        brace_token: Default::default(),
        stmts,
    };

    Arm {
        attrs: vec![],
        pat: Pat::Struct(PatStruct {
            attrs: vec![],
            qself: None,
            path: path.clone(),
            brace_token: Default::default(),
            fields,
            rest: None,
        }),
        guard: None,
        fat_arrow_token: Default::default(),
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
        fn_token: Default::default(),
        ident: method_name(mode, ty),
        generics: if let Mode::Visit(VisitorVariant::WithPath) = mode {
            parse_quote!(<'ast: 'r, 'r>)
        } else {
            Default::default()
        },
        paren_token: Default::default(),
        inputs: {
            let mut p = Punctuated::default();
            p.push_value(parse_quote!(&mut self));
            p.push_punct(Token![,](def_site()));
            match mode {
                Mode::Fold { .. } => {
                    p.push_value(parse_quote!(n: #ty));
                }

                Mode::VisitMut { .. } => {
                    p.push_value(parse_quote!(n: &mut #ty));
                }

                Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => {
                    p.push_value(parse_quote!(n: &#ty));
                }

                Mode::Visit(VisitorVariant::WithPath) => {
                    p.push_value(parse_quote!(n: &'ast #ty));
                }
            }

            if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
                p.push_punct(Token![,](def_site()));
                let ty = ast_path_type(mode);
                p.push_value(parse_quote!(__ast_path: #ty));
            }

            p
        },
        variadic: None,
        output: match mode {
            Mode::Fold { .. } => parse_quote!(-> #ty),
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
fn make_method(mode: Mode, e: &Item, types: &mut Vec<Type>) -> Option<TraitItemFn> {
    let mut attrs = vec![];

    {
        attrs.push(make_doc_attr(
            "This method can be overridden to customize the visitor behavior.",
        ));
        attrs.push(make_doc_attr(""));
    }

    if let Some(trait_name) = mode.name_of_trait_for_ast() {
        let doc_str = format!(
            "This calls [`{}::{}`] on `n` by default. The default method visit children nodes \
             with `self`.",
            trait_name,
            mode.name_of_trait_children_method_for_ast().unwrap()
        );
        attrs.push(make_doc_attr(&doc_str));
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
                let arm = make_arm_from_struct(
                    mode,
                    &s.ident,
                    &s.ident.clone().into(),
                    None,
                    &s.fields,
                    true,
                );

                let mut match_expr: ExprMatch = parse_quote!(match n {});
                match_expr.arms.push(arm);

                Block {
                    brace_token: Default::default(),
                    stmts: vec![Stmt::Expr(match_expr.into(), None)],
                }
            };

            let sig = method_sig_from_ident(mode, type_name);

            TraitItemFn {
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

                let skip_ast_path = e.variants.iter().all(|v| v.fields.is_empty());

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
                        Some(&variant.ident),
                        &variant.fields,
                        !skip_ast_path,
                    );

                    arms.push(arm);
                }

                Block {
                    brace_token: Default::default(),
                    stmts: vec![Stmt::Expr(
                        Expr::Match(ExprMatch {
                            attrs: vec![],
                            match_token: Default::default(),
                            expr: parse_quote!(n),
                            brace_token: Default::default(),
                            arms,
                        }),
                        None,
                    )],
                }
            };

            TraitItemFn {
                attrs,
                sig: method_sig_from_ident(mode, type_name),
                default: Some(block),
                semi_token: None,
            }
        }

        Item::Use(ItemUse {
            tree: UseTree::Name(tree),
            ..
        }) => {
            let type_name = &tree.ident;
            types.push(Type::Path(TypePath {
                qself: None,
                path: type_name.clone().into(),
            }));
            return None;
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
            fn_token: Default::default(),
            ident,
            generics: if let Mode::Visit(VisitorVariant::WithPath) = mode {
                parse_quote!(<'ast: 'r, 'r>)
            } else {
                Default::default()
            },
            paren_token: Default::default(),
            inputs: {
                let mut p = Punctuated::default();
                p.push_value(parse_quote!(&mut self));
                p.push_punct(Token![,](def_site()));
                p.push_value(parse_quote!(n: #ty));

                if let Some(VisitorVariant::WithPath) = mode.visitor_variant() {
                    p.push_punct(Token![,](def_site()));
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
                Mode::Fold { .. } => parse_quote!(-> #ty),
                _ => ReturnType::Default,
            },
        }
    }

    fn mk_ref(mode: Mode, ident: Ident, ty: &Type, mutable: bool) -> Signature {
        if let Mode::Visit(VisitorVariant::WithPath) = mode {
            return mk_exact(mode, ident, &parse_quote!(&'ast #ty));
        }

        mk_exact(
            mode,
            ident,
            &Type::Reference(TypeReference {
                and_token: Default::default(),
                lifetime: None,
                mutability: if mutable {
                    Some(Token![mut](def_site()))
                } else {
                    None
                },
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
                if let Some(arg) = extract_box(ty) {
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

                    if let Some(item) = extract_generic("Vec", arg) {
                        match mode {
                            Mode::Fold { .. } => {
                                return mk_exact(mode, ident, &parse_quote!(Option<Vec<#item>>));
                            }
                            Mode::VisitMut { .. } => {
                                return mk_exact(
                                    mode,
                                    ident,
                                    &parse_quote!(&mut Option<Vec<#item>>),
                                );
                            }
                            Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => {
                                return mk_exact(mode, ident, &parse_quote!(Option<&[#item]>));
                            }
                            Mode::Visit(VisitorVariant::WithPath) => {
                                return mk_exact(mode, ident, &parse_quote!(Option<&'ast [#item]>));
                            }
                        }
                    }

                    match mode {
                        Mode::Fold { .. } => {
                            return mk_exact(mode, ident, &parse_quote!(Option<#arg>));
                        }
                        Mode::VisitMut { .. } => {
                            return mk_exact(mode, ident, &parse_quote!(&mut Option<#arg>));
                        }
                        Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => {
                            return mk_exact(mode, ident, &parse_quote!(Option<&#arg>));
                        }
                        Mode::Visit(VisitorVariant::WithPath) => {
                            return mk_exact(mode, ident, &parse_quote!(Option<&'ast arg>));
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
                let visit = inject_ast_path_arg_if_required(mode, parse_quote!(_visitor.#visit(n)));

                return Block {
                    brace_token: Default::default(),
                    stmts: vec![Stmt::Expr(visit, None)],
                };
            }
            Mode::VisitMut { .. } => {
                return Block {
                    brace_token: Default::default(),
                    stmts: vec![],
                }
            }
            Mode::Fold { .. } => return parse_quote!({ n }),
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
                if let Some(arg) = extract_box(ty) {
                    match mode {
                        Mode::Fold(..) => {
                            let ident = method_name(mode, arg);
                            let inner = inject_ast_path_arg_if_required(
                                mode,
                                q!(Vars { ident }, { _visitor.ident(*n) }).parse(),
                            );

                            return parse_quote!(swc_visit::util::map::Map::map(n, |n| #inner));
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
                                        if extract_box(arg).is_some() {
                                            let inner = inject_ast_path_arg_if_required(
                                                mode,
                                                parse_quote!(_visitor.#ident(n)),
                                            );

                                            return parse_quote!({
                                                match n {
                                                    Some(n) => Some(
                                                        swc_visit::util::map::Map::map(n, |n| {
                                                            #inner
                                                        }),
                                                    ),
                                                    None => None,
                                                }
                                            });
                                        }
                                    }

                                    return match mode {
                                        Mode::Fold(..) => {
                                            let inner = inject_ast_path_arg_if_required(
                                                mode,
                                                parse_quote!(_visitor.#ident(n)),
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
                                            let inner = inject_ast_path_arg_if_required(
                                                mode,
                                                q!(Vars { ident }, { _visitor.ident(n) }).parse(),
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
                            if extract_box(arg).is_some() {
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
                                    VisitorVariant::WithPath => q!(
                                        Vars { ident },
                                        ({
                                            n.into_iter()
                                                .enumerate()
                                                .map(|(idx, v)| {
                                                    let mut __ast_path =
                                                        __ast_path.with_index_guard(idx);

                                                    swc_visit::util::map::Map::map(v, |v| {
                                                        _visitor.ident(v, &mut *__ast_path)
                                                    })
                                                })
                                                .collect()
                                        })
                                    )
                                    .parse(),
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

                            Mode::Fold(VisitorVariant::WithPath) => q!(
                                Vars { ident },
                                ({
                                    n.into_iter()
                                        .enumerate()
                                        .map(|(idx, v)| {
                                            let mut __ast_path = __ast_path.with_index_guard(idx);

                                            _visitor.ident(v, &mut *__ast_path)
                                        })
                                        .collect()
                                })
                            )
                            .parse(),

                            Mode::VisitMut(VisitorVariant::Normal) => q!(
                                Vars { ident },
                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                            )
                            .parse(),

                            Mode::VisitMut(VisitorVariant::WithPath) => q!(
                                Vars { ident },
                                ({
                                    n.iter_mut().enumerate().for_each(|(idx, v)| {
                                        let mut __ast_path = __ast_path.with_index_guard(idx);

                                        _visitor.ident(v, &mut *__ast_path)
                                    })
                                })
                            )
                            .parse(),

                            Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => q!(
                                Vars { ident },
                                ({ n.iter().for_each(|v| _visitor.ident(v.as_ref())) })
                            )
                            .parse(),

                            Mode::Visit(VisitorVariant::WithPath) => q!(
                                Vars { ident },
                                ({
                                    n.iter().enumerate().for_each(|(idx, v)| {
                                        let mut __ast_path = __ast_path.with_index_guard(idx);

                                        _visitor.ident(v.as_ref(), &mut *__ast_path)
                                    })
                                })
                            )
                            .parse(),
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

                            Mode::Fold(VisitorVariant::WithPath) => q!(
                                Vars { ident },
                                ({
                                    n.into_iter()
                                        .enumerate()
                                        .map(|(idx, v)| {
                                            let mut __ast_path = __ast_path.with_index_guard(idx);
                                            _visitor.ident(v, &mut *__ast_path)
                                        })
                                        .collect()
                                })
                            )
                            .parse(),

                            Mode::VisitMut(VisitorVariant::Normal) => q!(
                                Vars { ident },
                                ({ n.iter_mut().for_each(|v| _visitor.ident(v)) })
                            )
                            .parse(),

                            Mode::VisitMut(VisitorVariant::WithPath) => q!(
                                Vars { ident },
                                ({
                                    n.iter_mut().enumerate().for_each(|(idx, v)| {
                                        let mut __ast_path = __ast_path.with_index_guard(idx);

                                        _visitor.ident(v, &mut *__ast_path)
                                    })
                                })
                            )
                            .parse(),

                            Mode::Visit(VisitorVariant::Normal) | Mode::VisitAll => q!(
                                Vars { ident },
                                ({ n.iter().for_each(|v| _visitor.ident(v)) })
                            )
                            .parse(),

                            Mode::Visit(VisitorVariant::WithPath) => q!(
                                Vars { ident },
                                ({
                                    n.iter().enumerate().for_each(|(idx, v)| {
                                        let mut __ast_path = __ast_path.with_index_guard(idx);

                                        _visitor.ident(v, &mut *__ast_path)
                                    })
                                })
                            )
                            .parse(),
                        }
                    };
                }
            }

            match mode {
                Mode::Fold { .. } => parse_quote!({ return n }),
                Mode::VisitAll | Mode::Visit { .. } | Mode::VisitMut { .. } => parse_quote!({}),
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

fn extract_box(ty: &Type) -> Option<&Type> {
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

fn is_opt_vec(ty: &Type) -> bool {
    if let Some(inner) = extract_generic("Option", ty) {
        extract_generic("Vec", inner).is_some()
    } else {
        false
    }
}

fn is_vec_or_opt_vec(ty: &Type) -> bool {
    is_opt_vec(ty) || extract_generic("Vec", ty).is_some()
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
        Mode::Visit(_) => parse_quote!(&mut AstNodePath<'r>),
        Mode::VisitMut(_) | Mode::Fold(_) => parse_quote!(&mut AstKindPath),
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
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(cfg(any(feature = "path", docsrs))),
        },
        Attribute {
            pound_token: Default::default(),
            style: AttrStyle::Outer,
            bracket_token: Default::default(),
            meta: parse_quote!(cfg_attr(docsrs, doc(cfg(feature = "path")))),
        },
    ]
}

fn inject_ast_path_arg_if_required(mode: Mode, mut visit_expr: ExprMethodCall) -> Expr {
    match mode.visitor_variant() {
        Some(VisitorVariant::WithPath) => {}
        _ => return Expr::MethodCall(visit_expr),
    }

    visit_expr.args.push(parse_quote!(__ast_path));

    Expr::MethodCall(visit_expr)
}
