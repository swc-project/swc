#![recursion_limit = "4096"]

extern crate inflector;
extern crate rayon;
extern crate swc_common;
#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
#[macro_use]
extern crate quote;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;
extern crate swc_macros_common;
extern crate syn;

use inflector::Inflector;
use pmutil::Quote;
use proc_macro2::Span;
use std::{fs::read_dir, path::Path, sync::Arc};
use swc_common::{
    comments::Comments,
    errors::{ColorConfig, Handler},
    FilePathMapping, SourceMap,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use swc_macros_common::print;
use syn::{punctuated::Punctuated, LitStr, Token};

#[proc_macro]
pub fn builtin(_: proc_macro::TokenStream) -> proc_macro::TokenStream {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        let session = Session { handler: &handler };

        // Real usage
        // let fm = cm
        //     .load_file(Path::new("test.js"))
        //     .expect("failed to load test.js");

        let dir_str =
            ::std::env::var("CARGO_MANIFEST_DIR").expect("failed to read CARGO_MANIFEST_DIR");
        let dir = Path::new(&dir_str).join("lib");
        let mut tokens = q();

        let files = read_dir(&dir)
            .expect("failed to read $CARGO_MANIFEST_DIR/lib")
            .filter_map(|entry| {
                let entry = entry.expect("failed to read file of directory");
                let file_name = entry
                    .file_name()
                    .into_string()
                    .expect("OsString.into_string()");
                if !file_name.ends_with(".d.ts") {
                    return None;
                }

                Some((entry.path(), file_name))
            })
            .collect::<Vec<_>>();

        let mut names = vec![];

        for (path, file_name) in files {
            println!("Processing file: {}", file_name);
            let name = syn::Ident::new(&file_name.to_camel_case(), Span::call_site());
            names.push(name.clone());

            let comments = Comments::default();

            let fm = cm.load_file(&path).expect("failed to load file");

            let mut parser = Parser::new(
                session,
                Syntax::Typescript(Default::default()),
                SourceFileInput::from(&*fm),
                Some(&comments), // Disable comments
            );

            // We cannot use parse_module because of `eval`
            let script = parser
                .parse_script()
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .expect("failed to parse module");

            println!("\tParsed",);

            let tts = quote_namespace_decl(&script.body);
            tokens = tokens.quote_with(smart_quote!(Vars { name: &name, tts }, {
                lazy_static! {
                    static ref name: TsNamespaceDecl = { tts };
                }
            }));
        }
        let names = names.iter().cloned().collect::<Punctuated<_, Token![,]>>();
        tokens = tokens.quote_with(smart_quote!(Vars { names: &names }, {
            pub enum Lib {
                names,
            }
        }));

        print("builtin", tokens)
    })
}

fn quote_decl(decl: &Decl) -> syn::Stmt {
    let mut tokens = q();

    match decl {
        Decl::Var(var) => {
            assert_eq!(var.decls.len(), 1);

            tokens = tokens.quote_with(smart_quote!(
                Vars {
                    kind_v: match var.kind {
                        VarDeclKind::Const => quote!(VarDeclKind::Const),
                        VarDeclKind::Let => quote!(VarDeclKind::Let),
                        VarDeclKind::Var => quote!(VarDeclKind::Var),
                    },
                    decls_v: match var.decls.iter().next().unwrap().name {
                        Pat::Ident(ref i) => id_to_str(&i),
                        _ => unreachable!(),
                    },
                    type_ann_v: quote_opt_type_ann(match var.decls.iter().next().unwrap().name {
                        Pat::Ident(ref i) => i.type_ann.as_ref(),
                        _ => unreachable!(),
                    })
                },
                {
                    body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        declare: true,
                        kind: kind_v,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(Ident {
                                span: DUMMY_SP,
                                sym: decls_v.into(),
                                type_ann: type_ann_v,
                                optional: false,
                            }),
                            definite: false,
                            init: None,
                        }],
                    }))));
                }
            ));
        }

        Decl::Fn(f) => {
            tokens = tokens.quote_with(smart_quote!(
                Vars {
                    is_async_value: f.function.is_async,
                    is_generator_value: f.function.is_generator,
                    ident_v: id_to_str(&f.ident),
                    type_params_v: quote_type_params(f.function.type_params.as_ref()),
                    return_type_v: quote_opt_type_ann(f.function.return_type.as_ref()),
                    params_v: quote_params(&f.function.params)
                },
                {
                    body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                        declare: true,
                        ident: Ident::new(ident_v.into(), DUMMY_SP),
                        function: Function {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            params: vec![params_v],
                            is_async: is_async_value,
                            is_generator: is_generator_value,
                            body: None,
                            return_type: return_type_v,
                            type_params: type_params_v,
                        },
                    }))));
                }
            ));
        }

        Decl::Class(ClassDecl {
            ref ident,
            ref class,
            ..
        }) => {
            tokens = tokens.quote_with(smart_quote!(
                Vars {
                    sym: id_to_str(ident),
                    class_v: quote_class(class),
                },
                {
                    body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                        ident: Ident::new(sym.into(), DUMMY_SP),
                        class: class_v,
                        declare: true,
                    }))));
                }
            ));
        }

        Decl::TsInterface(i) => {
            tokens = tokens.quote_with(smart_quote!(
                Vars {
                    id_v: id_to_str(&i.id),
                    extends_v: quote_exprs_with_type_args(&i.extends),
                    type_params_v: quote_type_params(i.type_params.as_ref()),
                    declare_v: i.declare,
                    body_v: quote_ts_interface_body(&i.body),
                },
                {
                    body.push(ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(
                        TsInterfaceDecl {
                            span: DUMMY_SP,
                            id: Ident::new(id_v.into(), DUMMY_SP),
                            extends: vec![extends_v],
                            type_params: type_params_v,
                            declare: declare_v,
                            body: body_v,
                        },
                    ))));
                }
            ));
        }

        Decl::TsTypeAlias(a) => {
            tokens = tokens.quote_with(smart_quote!(
                Vars {
                    id_v: id_to_str(&a.id),
                    type_params_v: quote_type_params(a.type_params.as_ref()),
                    type_ann_v: quote_ty(&a.type_ann),
                },
                {
                    body.push(ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(
                        TsTypeAliasDecl {
                            span: DUMMY_SP,
                            id: Ident::new(id_v.into(), DUMMY_SP),
                            declare: true,
                            type_params: type_params_v,
                            type_ann: box type_ann_v,
                        },
                    ))));
                }
            ));
        }

        Decl::TsEnum(..) => {
            tokens = tokens.quote_with(smart_quote!(Vars {}, {
                body.push(ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(TsEnumDecl {
                    span: DUMMY_SP,
                    declare: true,
                }))));
            }));
        }

        Decl::TsModule(m) => {
            tokens = tokens.quote_with(smart_quote!(
                Vars {
                    id_v: {
                        match m.id {
                            TsModuleName::Ident(ref i) => id_to_str(i),
                            TsModuleName::Str(_) => unimplemented!("TsModuleName::Str"),
                        }
                    },
                    declare_v: m.declare,
                    body_v: quote_ts_namespace_body(m.body.as_ref()),
                },
                {
                    body.push(ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(TsModuleDecl {
                        span: DUMMY_SP,
                        id: TsModuleName::Ident(Ident::new(id_v.into(), DUMMY_SP)),
                        declare: declare_v,
                        global: false,
                        body: body_v,
                    }))));
                }
            ));
        }
    }

    tokens.parse()
}

fn quote_class(c: &Class) -> syn::Expr {
    q().quote_with(smart_quote!(
        Vars {
            body_v: quote_class_members(&c.body),
            super_class_v: quote_option(c.super_class.as_ref(), |expr| quote_expr(expr)),
            is_abstract_v: c.is_abstract,
            type_params_v: quote_type_params(c.type_params.as_ref()),
            super_type_params: quote_type_params_instantiation(c.super_type_params.as_ref()),
            implements_v: quote_exprs_with_type_args(&c.implements),
        },
        {
            Class {
                span: DUMMY_SP,
                decorators: vec![],
                body: vec![body_v],
                super_class: super_class_v.map(Box::new),
                is_abstract: is_abstract_v,
                type_params: type_params_v,
                super_type_params: super_type_params_v,
                implements: vec![implements_v],
            }
        }
    ))
    .parse()
}

fn quote_class_members(ms: &[ClassMember]) -> Punctuated<syn::Expr, Token![,]> {
    ms.iter().map(quote_class_member).collect()
}

fn quote_class_member(ms: &ClassMember) -> syn::Expr {
    match ms {
        ClassMember::Constructor(Constructor {
            key,
            params,
            body,
            accessibility,
            is_optional,
            ..
        }) => {
            assert!(body.is_none());
            q().quote_with(smart_quote!(
                Vars {
                    key_v: quote_prop_name(&key),
                    params_v: quote_pat_or_ts_fn_params(&params),
                    accessibility_v: quote_accessibility(accessibility.clone()),
                    is_optional_v: is_optional,
                },
                {
                    ClassMember::Constructor(Constructor {
                        span: DUMMY_SP,
                        key: key_v,
                        params: vec![params_v],
                        body: None,
                        accessibility: accessibility_v,
                        is_optional: is_optional_v,
                    })
                }
            ))
            .parse()
        }

        _ => unimplemented!("quote_class_member({:#?})", ms),
    }
}

fn id_to_str(ident: &Ident) -> syn::Lit {
    syn::Lit::Str(LitStr::new(&*ident.sym, Span::call_site()))
}

fn quote_param(param: &Pat) -> syn::Expr {
    match *param {
        Pat::Ident(ref i) => q()
            .quote_with(smart_quote!(
                Vars {
                    s: syn::Lit::Str(LitStr::new(&i.sym, Span::call_site())),
                },
                { Pat::Ident(Ident::new(s.into(), DUMMY_SP)) }
            ))
            .parse::<syn::Expr>(),

        Pat::Rest(RestPat {
            ref arg,
            ref type_ann,
            ..
        }) => q()
            .quote_with(smart_quote!(
                Vars {
                    arg_v: quote_param(&arg),
                    type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                },
                {
                    Pat::Rest(RestPat {
                        dot3_token: DUMMY_SP,
                        arg: box arg_v,
                        type_ann: type_ann_v,
                    })
                }
            ))
            .parse(),
        _ => unimplemented!("quote_param({:#?})", param),
    }
}
fn quote_params(params: &[Pat]) -> Punctuated<syn::Expr, Token![,]> {
    params
        .iter()
        .map(quote_param)
        .collect::<Punctuated<_, Token![,]>>()
}

fn quote_type_params(params: Option<&TsTypeParamDecl>) -> syn::Expr {
    let params = match params {
        Some(params) => params,
        None => return q().quote_with(smart_quote!(Vars {}, { None })).parse(),
    };

    q().quote_with(smart_quote!(
        Vars {
            params_v: params
                .params
                .iter()
                .map(|type_param| quote_type_param(type_param))
                .collect::<Punctuated<_, Token![,]>>(),
        },
        {
            Some(TsTypeParamDecl {
                span: DUMMY_SP,
                params: vec![params_v],
            })
        }
    ))
    .parse()
}

fn quote_type_param(param: &TsTypeParam) -> syn::Expr {
    q().quote_with(smart_quote!(
        Vars {
            name_v: id_to_str(&param.name),
            constraint_v: quote_option(param.constraint.as_ref(), |ty| quote_box_ty(&ty)),
            default_v: quote_option(param.default.as_ref(), |ty| quote_box_ty(&ty))
        },
        {
            TsTypeParam {
                span: DUMMY_SP,
                name: Ident::new(name_v.into(), DUMMY_SP),
                constraint: constraint_v,
                default: default_v,
            }
        }
    ))
    .parse()
}

fn quote_option<T, F>(opt: Option<&T>, op: F) -> syn::Expr
where
    F: FnOnce(&T) -> syn::Expr,
{
    match opt {
        Some(v) => q()
            .quote_with(smart_quote!(Vars { v: op(v) }, { Some(v) }))
            .parse(),
        None => q().quote_with(smart_quote!(Vars {}, { None })).parse(),
    }
}

fn quote_type_ann(ty: &TsTypeAnn) -> syn::Expr {
    q().quote_with(smart_quote!(
        Vars {
            type_ann_v: quote_ty(&ty.type_ann)
        },
        {
            TsTypeAnn {
                span: DUMMY_SP,
                type_ann: Box::new(type_ann_v),
            }
        }
    ))
    .parse()
}

fn quote_opt_type_ann(ty: Option<&TsTypeAnn>) -> Quote {
    let ty = match ty {
        Some(ty) => ty,
        None => return q().quote_with(smart_quote!(Vars {}, { None })),
    };

    q().quote_with(smart_quote!(
        Vars {
            type_ann_v: quote_ty(&ty.type_ann)
        },
        {
            Some(TsTypeAnn {
                span: DUMMY_SP,
                type_ann: Box::new(type_ann_v),
            })
        }
    ))
}

fn quote_box_ty(ty: &TsType) -> syn::Expr {
    q().quote_with(smart_quote!(Vars { ty: quote_ty(ty) }, { Box::new(ty) }))
        .parse()
}

fn quote_exprs_with_type_args(exprs: &[TsExprWithTypeArgs]) -> Punctuated<Quote, Token![,]> {
    exprs
        .iter()
        .map(|expr| {
            q().quote_with(smart_quote!(
                Vars {
                    name: quote_ts_entity_name(&expr.expr),
                    type_params_v: quote_type_params_instantiation(expr.type_params.as_ref()),
                },
                {
                    TsExprWithTypeArgs {
                        span: DUMMY_SP,
                        expr: name,
                        type_params: type_params_v,
                    }
                }
            ))
        })
        .collect()
}

fn quote_type_params_instantiation(i: Option<&TsTypeParamInstantiation>) -> Quote {
    match i {
        Some(i) => q().quote_with(smart_quote!(
            Vars {
                params_v: i
                    .params
                    .iter()
                    .map(|ty| q().quote_with(smart_quote!(Vars { v: quote_ty(&ty) }, { box v })))
                    .collect::<Punctuated<_, Token![,]>>(),
            },
            {
                Some(TsTypeParamInstantiation {
                    span: DUMMY_SP,
                    params: vec![params_v],
                })
            }
        )),
        None => q().quote_with(smart_quote!(Vars {}, { None })),
    }
}

fn quote_ts_entity_name(n: &TsEntityName) -> Quote {
    match *n {
        TsEntityName::Ident(Ident { ref sym, .. }) => q().quote_with(smart_quote!(
            Vars {
                i: {
                    let s = &**sym;
                    quote!(#s)
                }
            },
            { TsEntityName::Ident(Ident::new(i.into(), DUMMY_SP)) }
        )),
        _ => unimplemented!(),
    }
}

fn quote_ts_interface_body(body: &TsInterfaceBody) -> Quote {
    q().quote_with(smart_quote!(
        Vars {
            body_v: body
                .body
                .iter()
                .map(|type_el| quote_type_element(type_el))
                .collect::<Punctuated<_, Token![,]>>(),
        },
        {
            TsInterfaceBody {
                span: DUMMY_SP,
                body: vec![body_v],
            }
        }
    ))
}

fn quote_ty(ty: &TsType) -> syn::Expr {
    let mut q = q();
    match *ty {
        TsType::TsTypeQuery(TsTypeQuery { ref expr_name, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    expr_name_v: quote_ts_entity_name(expr_name),
                },
                {
                    TsType::TsTypeQuery(TsTypeQuery {
                        span: DUMMY_SP,
                        expr_name: expr_name_v,
                    })
                }
            ));
        }

        TsType::TsLitType(TsLitType { ref lit, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    lit_v: match lit {
                        TsLit::Bool(Bool { value, .. }) => {
                            quote!(TsLit::Bool(Bool { span: DUMMY_SP, value: #value }))
                        }
                        TsLit::Number(Number { value, .. }) => {
                            quote!(TsLit::Number(Number { span: DUMMY_SP, value: #value }))
                        }
                        TsLit::Str(Str { value, .. }) => {
                            let value = &**value;
                            quote!(TsLit::Str(Str { span: DUMMY_SP, has_escape: false ,value: #value }))
                        }
                    },
                },
                {
                    TsType::TsLitType(TsLitType {
                        span: DUMMY_SP,
                        lit: lit_v,
                    })
                }
            ));
        }

        TsType::TsTupleType(TsTupleType { ref elem_types, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    elem_types_v: quote_types(&elem_types),
                },
                {
                    TsType::TsTupleType(TsTupleType {
                        span: DUMMY_SP,
                        elem_types: vec![elem_types_v],
                    })
                }
            ));
        }

        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(
            TsIntersectionType { ref types, .. },
        )) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    types_v: quote_types(&types),
                },
                {
                    TsType::TsUnionOrIntersectionType(
                        TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                            span: DUMMY_SP,
                            types: vec![types_v],
                        }),
                    )
                }
            ));
        }

        TsType::TsThisType(..) => {
            q = q.quote_with(smart_quote!(Vars {}, {
                TsType::TsThisType(TsThisType { span: DUMMY_SP })
            }));
        }

        TsType::TsTypeLit(TsTypeLit { ref members, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    members_v: quote_type_elements(members),
                },
                {
                    TsType::TsTypeLit(TsTypeLit {
                        span: DUMMY_SP,
                        members: vec![members_v],
                    })
                }
            ));
        }

        TsType::TsTypePredicate(TsTypePredicate {
            ref param_name,
            ref type_ann,
            ..
        }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    param_name_v: quote_this_or_ident(param_name),
                    type_ann_v: quote_type_ann(type_ann)
                },
                {
                    TsType::TsTypePredicate(TsTypePredicate {
                        span: DUMMY_SP,
                        param_name: param_name_v,
                        type_ann: type_ann_v,
                    })
                }
            ));
        }

        TsType::TsParenthesizedType(TsParenthesizedType { ref type_ann, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    type_ann_v: quote_ty(&type_ann),
                },
                {
                    TsType::TsParenthesizedType(TsParenthesizedType {
                        span: DUMMY_SP,
                        type_ann: box type_ann_v,
                    })
                }
            ));
        }

        TsType::TsKeywordType(TsKeywordType { kind, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    kind_v: match kind {
                        TsKeywordTypeKind::TsAnyKeyword => quote!(TsKeywordTypeKind::TsAnyKeyword),
                        TsKeywordTypeKind::TsUnknownKeyword => {
                            quote!(TsKeywordTypeKind::TsUnknownKeyword)
                        }
                        TsKeywordTypeKind::TsNumberKeyword => {
                            quote!(TsKeywordTypeKind::TsNumberKeyword)
                        }
                        TsKeywordTypeKind::TsObjectKeyword => {
                            quote!(TsKeywordTypeKind::TsObjectKeyword)
                        }
                        TsKeywordTypeKind::TsBooleanKeyword => {
                            quote!(TsKeywordTypeKind::TsBooleanKeyword)
                        }
                        TsKeywordTypeKind::TsBigIntKeyword => {
                            quote!(TsKeywordTypeKind::TsBigIntKeyword)
                        }
                        TsKeywordTypeKind::TsStringKeyword => {
                            quote!(TsKeywordTypeKind::TsStringKeyword)
                        }
                        TsKeywordTypeKind::TsSymbolKeyword => {
                            quote!(TsKeywordTypeKind::TsSymbolKeyword)
                        }
                        TsKeywordTypeKind::TsVoidKeyword => {
                            quote!(TsKeywordTypeKind::TsVoidKeyword)
                        }
                        TsKeywordTypeKind::TsUndefinedKeyword => {
                            quote!(TsKeywordTypeKind::TsUndefinedKeyword)
                        }
                        TsKeywordTypeKind::TsNullKeyword => {
                            quote!(TsKeywordTypeKind::TsNullKeyword)
                        }
                        TsKeywordTypeKind::TsNeverKeyword => {
                            quote!(TsKeywordTypeKind::TsNeverKeyword)
                        }
                    }
                },
                {
                    TsType::TsKeywordType(TsKeywordType {
                        span: DUMMY_SP,
                        kind: kind_v,
                    })
                }
            ));
        }

        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
            TsUnionType { ref types, .. },
        )) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    types_v: types
                        .iter()
                        .map(|ty| quote_box_ty(ty))
                        .collect::<Punctuated<_, Token![,]>>(),
                },
                {
                    TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                        TsUnionType {
                            span: DUMMY_SP,
                            types: vec![types_v],
                        },
                    ))
                }
            ));
        }

        TsType::TsArrayType(TsArrayType { ref elem_type, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    elem_type_v: quote_box_ty(elem_type)
                },
                {
                    TsType::TsArrayType(TsArrayType {
                        span: DUMMY_SP,
                        elem_type: elem_type_v,
                    })
                }
            ));
        }

        TsType::TsTypeRef(TsTypeRef {
            ref type_name,
            ref type_params,
            ..
        }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    type_name_v: quote_ts_entity_name(type_name),
                    type_params_v: quote_type_params_instantiation(type_params.as_ref()),
                },
                {
                    TsType::TsTypeRef(TsTypeRef {
                        span: DUMMY_SP,
                        type_name: type_name_v,
                        type_params: type_params_v,
                    })
                }
            ));
        }

        TsType::TsConditionalType(TsConditionalType {
            ref check_type,
            ref extends_type,
            ref true_type,
            ref false_type,
            ..
        }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    check_type_v: quote_box_ty(check_type),
                    extends_type_v: quote_box_ty(extends_type),
                    true_type_v: quote_box_ty(true_type),
                    false_type_v: quote_box_ty(false_type),
                },
                {
                    TsType::TsConditionalType(TsConditionalType {
                        span: DUMMY_SP,
                        check_type: check_type_v,
                        extends_type: extends_type_v,
                        true_type: true_type_v,
                        false_type: false_type_v,
                    })
                }
            ));
        }

        TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
            ref params,
            ref type_ann,
            ref type_params,
            ..
        })) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    params_v: quote_ts_fn_params(params),
                    type_ann_v: quote_type_ann(type_ann),
                    type_params_v: quote_type_params(type_params.as_ref()),
                },
                {
                    TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
                        span: DUMMY_SP,
                        params: vec![params_v],
                        type_ann: type_ann_v,
                        type_params: type_params_v,
                    }))
                }
            ));
        }

        TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsConstructorType(
            TsConstructorType {
                ref params,
                ref type_ann,
                ref type_params,
                ..
            },
        )) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    params_v: quote_ts_fn_params(params),
                    type_ann_v: quote_type_ann(type_ann),
                    type_params_v: quote_type_params(type_params.as_ref()),
                },
                {
                    TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsConstructorType(
                        TsConstructorType {
                            span: DUMMY_SP,
                            params: vec![params_v],
                            type_ann: type_ann_v,
                            type_params: type_params_v,
                        },
                    ))
                }
            ));
        }

        TsType::TsMappedType(TsMappedType {
            readonly,
            ref type_param,
            optional,
            ref type_ann,
            ..
        }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    readonly_v: quote_true_plus_minus(readonly),
                    type_param_v: quote_type_param(type_param),
                    optional_v: quote_true_plus_minus(optional),
                    type_ann_v: quote_option(type_ann.as_ref(), |type_ann| quote_box_ty(type_ann)),
                },
                {
                    TsType::TsMappedType(TsMappedType {
                        span: DUMMY_SP,
                        type_param: type_param_v,
                        optional: optional_v,
                        type_ann: type_ann_v,
                        readonly: readonly_v,
                    })
                }
            ));
        }

        TsType::TsTypeOperator(TsTypeOperator {
            op, ref type_ann, ..
        }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    type_ann_v: quote_box_ty(&type_ann),
                    op_v: match op {
                        TsTypeOperatorOp::KeyOf => quote!(TsTypeOperatorOp::KeyOf),
                        TsTypeOperatorOp::Unique => quote!(TsTypeOperatorOp::Unique),
                    }
                },
                {
                    TsType::TsTypeOperator(TsTypeOperator {
                        span: DUMMY_SP,
                        type_ann: type_ann_v,
                        op: op_v,
                    })
                }
            ));
        }

        TsType::TsInferType(TsInferType { ref type_param, .. }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    type_param_v: quote_type_param(type_param),
                },
                {
                    TsType::TsInferType(TsInferType {
                        span: DUMMY_SP,
                        type_param: type_param_v,
                    })
                }
            ));
        }

        TsType::TsIndexedAccessType(TsIndexedAccessType {
            ref obj_type,
            ref index_type,
            readonly,
            ..
        }) => {
            q = q.quote_with(smart_quote!(
                Vars {
                    readonly_v: readonly,
                    obj_type_v: quote_box_ty(&obj_type),
                    index_type_v: quote_box_ty(&index_type),
                },
                {
                    TsType::TsIndexedAccessType(TsIndexedAccessType {
                        span: DUMMY_SP,
                        readonly: readonly_v,
                        obj_type: obj_type_v,
                        index_type: index_type_v,
                    })
                }
            ));
        }

        _ => {
            //     q = q.quote_with(smart_quote!(
            //     Vars {
            //     },
            //     {
            //         TsType::TsKeywordType(TsKeywordType {
            //             span: DUMMY_SP,
            //         })
            //     }
            // ));
            unimplemented!("quote_ty({:#?})", ty);
        }
    }
    q.parse()
}

fn quote_types(tys: &[Box<TsType>]) -> Punctuated<syn::Expr, Token![,]> {
    tys.iter().map(|e| quote_box_ty(e)).collect()
}

fn quote_type_elements(els: &[TsTypeElement]) -> Punctuated<syn::Expr, Token![,]> {
    els.iter().map(|e| quote_type_element(e)).collect()
}

fn quote_type_element(e: &TsTypeElement) -> syn::Expr {
    match *e {
        TsTypeElement::TsPropertySignature(TsPropertySignature {
            readonly,
            ref key,
            computed,
            optional,
            ref init,
            ref params,
            ref type_params,
            ref type_ann,
            ..
        }) => {
            //
            q().quote_with(smart_quote!(
                Vars {
                    readonly_v: readonly,
                    key_v: quote_expr(&key),
                    computed_v: computed,
                    optional_v: optional,
                    init_v: quote_option(init.as_ref(), |expr| quote_expr(expr)),
                    params_v: quote_ts_fn_params(&params),
                    type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                    type_params_v: quote_type_params(type_params.as_ref())
                },
                {
                    TsTypeElement::TsPropertySignature(TsPropertySignature {
                        span: DUMMY_SP,
                        readonly: readonly_v,
                        key: box key_v,
                        computed: computed_v,
                        optional: optional_v,
                        init: init_v,
                        params: vec![params_v],
                        type_ann: type_ann_v,
                        type_params: type_params_v,
                    })
                }
            ))
            .parse()
        }
        TsTypeElement::TsMethodSignature(TsMethodSignature {
            readonly,
            ref key,
            computed,
            optional,
            ref params,
            ref type_params,
            ref type_ann,
            ..
        }) => {
            //
            q().quote_with(smart_quote!(
                Vars {
                    readonly_v: readonly,
                    key_v: quote_expr(&key),
                    computed_v: computed,
                    optional_v: optional,
                    params_v: quote_ts_fn_params(&params),
                    type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                    type_params_v: quote_type_params(type_params.as_ref())
                },
                {
                    TsTypeElement::TsMethodSignature(TsMethodSignature {
                        span: DUMMY_SP,
                        readonly: readonly_v,
                        key: box key_v,
                        computed: computed_v,
                        optional: optional_v,
                        params: vec![params_v],
                        type_ann: type_ann_v,
                        type_params: type_params_v,
                    })
                }
            ))
            .parse()
        }

        TsTypeElement::TsIndexSignature(TsIndexSignature {
            readonly,
            ref params,
            ref type_ann,
            ..
        }) => q()
            .quote_with(smart_quote!(
                Vars {
                    readonly_v: readonly,
                    params_v: quote_ts_fn_params(&params),
                    type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                },
                {
                    TsTypeElement::TsIndexSignature(TsIndexSignature {
                        span: DUMMY_SP,
                        readonly: readonly_v,
                        params: vec![params_v],
                        type_ann: type_ann_v,
                    })
                }
            ))
            .parse(),

        TsTypeElement::TsConstructSignatureDecl(TsConstructSignatureDecl {
            ref params,
            ref type_params,
            ref type_ann,
            ..
        }) => q()
            .quote_with(smart_quote!(
                Vars {
                    params_v: quote_ts_fn_params(params),
                    type_params_v: quote_type_params(type_params.as_ref()),
                    type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                },
                {
                    TsTypeElement::TsConstructSignatureDecl(TsConstructSignatureDecl {
                        span: DUMMY_SP,
                        params: vec![params_v],
                        type_params: type_params_v,
                        type_ann: type_ann_v,
                    })
                }
            ))
            .parse(),

        TsTypeElement::TsCallSignatureDecl(TsCallSignatureDecl {
            ref params,
            ref type_params,
            ref type_ann,
            ..
        }) => q()
            .quote_with(smart_quote!(
                Vars {
                    params_v: quote_ts_fn_params(params),
                    type_params_v: quote_type_params(type_params.as_ref()),
                    type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                },
                {
                    TsTypeElement::TsCallSignatureDecl(TsCallSignatureDecl {
                        span: DUMMY_SP,
                        params: vec![params_v],
                        type_params: type_params_v,
                        type_ann: type_ann_v,
                    })
                }
            ))
            .parse(),
    }
}

fn quote_ts_namespace_body(e: Option<&TsNamespaceBody>) -> syn::Expr {
    quote_option(e, |ty| match ty {
        TsNamespaceBody::TsModuleBlock(ref m) => {
            let mut tokens = q().quote_with(smart_quote!(Vars {}, {
                let mut body = vec![];
            }));

            for v in m.body.iter().map(|v| match v {
                ModuleItem::Stmt(Stmt::Decl(ref decl)) => quote_decl(&decl),
                _ => unimplemented!(),
            }) {
                tokens = tokens.quote_with(smart_quote!(Vars { v }, { v }));
            }
            q().quote_with(smart_quote!(Vars { tokens }, {
                {
                    tokens

                    TsNamespaceBody::TsModuleBlock(TsModuleBlock {
                        span: DUMMY_SP,
                        body,
                    })
                }
            }))
            .parse()
        }
        TsNamespaceBody::TsNamespaceDecl(..) => unimplemented!("TsNamespaceDecl"),
    })
}

fn quote_ts_fn_params(param: &[TsFnParam]) -> Punctuated<syn::Expr, Token![,]> {
    param
        .iter()
        .map(|param| match *param {
            TsFnParam::Ident(ref i) => q()
                .quote_with(smart_quote!(Vars { s: id_to_str(&i) }, {
                    TsFnParam::Ident(Ident::new(s.into(), DUMMY_SP))
                }))
                .parse::<syn::Expr>(),

            TsFnParam::Rest(RestPat {
                ref arg,
                ref type_ann,
                ..
            }) => q()
                .quote_with(smart_quote!(
                    Vars {
                        arg_v: quote_param(arg),
                        type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                    },
                    {
                        TsFnParam::Rest(RestPat {
                            dot3_token: DUMMY_SP,
                            arg: box arg_v,
                            type_ann: type_ann_v,
                        })
                    }
                ))
                .parse(),

            TsFnParam::Object(ObjectPat {
                ref props,
                ref type_ann,
                ..
            }) => q()
                .quote_with(smart_quote!(
                    Vars {
                        props_v: quote_object_pat_props(props),
                        type_ann_v: quote_opt_type_ann(type_ann.as_ref()),
                    },
                    {
                        TsFnParam::Object(ObjectPat {
                            span: DUMMY_SP,
                            props: vec![props_v],
                            type_ann: type_ann_v,
                        })
                    }
                ))
                .parse(),

            _ => unimplemented!("TsFnParam other than Ident and Rest\n{:?}", param),
        })
        .collect()
}

fn quote_true_plus_minus(tpm: Option<TruePlusMinus>) -> syn::Expr {
    quote_option(tpm.as_ref(), |tpm| {
        q().quote_with(smart_quote!(
            Vars {
                v: match tpm {
                    TruePlusMinus::Minus => quote!(TruePlusMinus::Minus),
                    TruePlusMinus::Plus => quote!(TruePlusMinus::Plus),
                    TruePlusMinus::True => quote!(TruePlusMinus::True),
                }
            },
            { v }
        ))
        .parse()
    })
}

fn quote_namespace_decl(stmts: &[Stmt]) -> Quote {
    q().quote_with(smart_quote!(
        Vars {
            v: quote_module_block(&stmts)
        },
        {
            TsNamespaceDecl {
                span: DUMMY_SP,
                declare: false,
                global: true,
                id: Ident::new(::swc_atoms::js_word!(""), DUMMY_SP),
                body: box TsNamespaceBody::TsModuleBlock(v),
            }
        }
    ))
}

fn quote_module_block(stmts: &[Stmt]) -> syn::Expr {
    let mut tokens = q().quote_with(smart_quote!(Vars {}, {
        let mut body = vec![];
    }));

    for stmt in stmts {
        match stmt {
            Stmt::Decl(ref decl) => {
                //
                tokens.push_tokens(&quote_decl(&decl));
            }

            stmt => unimplemented!("Stmt: {:?}", stmt),
        }
    }

    q().quote_with(smart_quote!(Vars { tokens: &tokens }, {
        TsModuleBlock {
            span: DUMMY_SP,
            body: {
                tokens

                body
            },
        }
    }))
    .parse()
}

fn quote_expr(e: &Expr) -> syn::Expr {
    match *e {
        Expr::Ident(ref i) => q()
            .quote_with(smart_quote!(Vars { v: id_to_str(i) }, {
                Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    has_escape: false,
                    value: v.into(),
                }))
            }))
            .parse(),

        Expr::Lit(Lit::Str(Str { ref value, .. })) => q()
            .quote_with(smart_quote!(Vars { v: &**value }, {
                Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    has_escape: false,
                    value: v.into(),
                }))
            }))
            .parse(),

        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(ref obj),
            ref prop,
            ref computed,
            ..
        }) => q()
            .quote_with(smart_quote!(
                Vars {
                    obj_v: quote_expr(&obj),
                    prop_v: quote_expr(prop),
                    computed_v: computed,
                },
                {
                    Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        computed: computed_v,
                        obj: ExprOrSuper::Expr(box obj_v),
                        prop: box prop_v,
                    })
                }
            ))
            .parse(),

        _ => unimplemented!("Expr: {:#?}", e),
    }
}

fn quote_this_or_ident(t: &TsThisTypeOrIdent) -> syn::Expr {
    match *t {
        TsThisTypeOrIdent::TsThisType(..) => q()
            .quote_with(smart_quote!(Vars {}, {
                TsThisTypeOrIdent::TsThisType(TsThisType { span: DUMMY_SP })
            }))
            .parse(),
        TsThisTypeOrIdent::Ident(ref i) => q()
            .quote_with(smart_quote!(Vars { v: id_to_str(i) }, {
                TsThisTypeOrIdent::Ident(Ident::new(v.into(), DUMMY_SP))
            }))
            .parse(),
    }
}

fn quote_object_pat_props(props: &[ObjectPatProp]) -> Punctuated<syn::Expr, Token![,]> {
    props.iter().map(|p| quote_object_pat_prop(p)).collect()
}

fn quote_object_pat_prop(p: &ObjectPatProp) -> syn::Expr {
    match *p {
        ObjectPatProp::KeyValue(KeyValuePatProp { ref key, ref value }) => q()
            .quote_with(smart_quote!(
                Vars {
                    key_v: quote_prop_name(key),
                    value_v: quote_param(value),
                },
                {
                    ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: key_v,
                        value: box value_v,
                    })
                }
            ))
            .parse(),

        ObjectPatProp::Assign(AssignPatProp {
            ref key, ref value, ..
        }) => q()
            .quote_with(smart_quote!(
                Vars {
                    key_v: id_to_str(key),
                    value_v: quote_option(value.as_ref(), |expr| quote_expr(&expr))
                },
                {
                    ObjectPatProp::Assign(AssignPatProp {
                        span: DUMMY_SP,
                        key: Ident::new(key_v.into(), DUMMY_SP),
                        value: box value_v,
                    })
                }
            ))
            .parse(),

        _ => unimplemented!("quote_object_pat_prop({:#?})", p),
    }
}

fn quote_prop_name(n: &PropName) -> Quote {
    match *n {
        PropName::Ident(ref i) => q().quote_with(smart_quote!(Vars { sym: id_to_str(i) }, {
            PropName::Ident(Ident::new(sym.into(), DUMMY_SP))
        })),
        _ => unimplemented!("quote_prop_name({:#?})", n),
    }
}

fn quote_pat_or_ts_fn_params(p: &[PatOrTsParamProp]) -> Punctuated<syn::Expr, Token![,]> {
    p.iter().map(quote_pat_or_ts_fn_param).collect()
}

fn quote_pat_or_ts_fn_param(p: &PatOrTsParamProp) -> syn::Expr {
    match *p {
        PatOrTsParamProp::Pat(ref p) => q()
            .quote_with(smart_quote!(Vars { q: quote_param(p) }, {
                PatOrTsParamProp::Pat(q)
            }))
            .parse(),
        PatOrTsParamProp::TsParamProp(ref p) => q()
            .quote_with(smart_quote!(
                Vars {
                    q: quote_ts_param_prop(p)
                },
                { PatOrTsParamProp::TsParamProp(q) }
            ))
            .parse(),
    }
}

fn quote_ts_param_prop(p: &TsParamProp) -> syn::Expr {
    q().quote_with(smart_quote!(
        Vars {
            accessibility_v: quote_accessibility(p.accessibility),
            readonly_v: p.readonly,
            param_v: quote_ts_param_prop_param(&p.param),
        },
        {
            TsParamProp {
                span: DUMMY_SP,
                decorators: vec![],
                accessibility: accessibility_v,
                readonly: readonly_v,
                param: param_v,
            }
        }
    ))
    .parse()
}

fn quote_accessibility(opt: Option<Accessibility>) -> syn::Expr {
    match opt {
        // TODO
        Some(v) => q().quote_with(smart_quote!(Vars {}, { Some() })).parse(),
        None => q().quote_with(smart_quote!(Vars {}, { None })).parse(),
    }
}

fn quote_ts_param_prop_param(p: &TsParamPropParam) -> syn::Expr {
    match p {
        TsParamPropParam::Ident(i) => q()
            .quote_with(smart_quote!(Vars {}, { TsParamPropParam::Ident() }))
            .parse(),

        _ => unimplemented!("quote_ts_param_prop_param({:?})", p),
    }
}

fn q() -> Quote {
    Quote::new_call_site()
}
