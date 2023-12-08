#![allow(non_snake_case)]

use proc_macro2::{Span, TokenStream};
use syn::{parse_quote, Expr, Ident, ImplItem, ImplItemFn, ItemImpl, Meta, Type};

use crate::common::Mode;

pub fn expand(attr: TokenStream, mut item: ItemImpl) -> ItemImpl {
    let mode = {
        let p = &item.trait_.as_ref().unwrap().1;
        if p.is_ident("Fold") {
            Mode::Fold
        } else if p.is_ident("VisitMut") {
            Mode::VisitMut
        } else {
            unimplemented!("Unknown visitor type: {:?}", p)
        }
    };
    let meta = if attr.is_empty() {
        None
    } else {
        Some(syn::parse2::<Meta>(attr).expect("failed to parse meta"))
    };
    let explode = meta
        .as_ref()
        .map(|v| v.path().is_ident("explode"))
        .unwrap_or(false);

    item.items.push(ImplItem::Fn(make_par_visit_method(
        mode,
        "module_items",
        explode,
    )));
    item.items
        .push(ImplItem::Fn(make_par_visit_method(mode, "stmts", explode)));

    item
}

fn node_type(suffix: &str) -> Type {
    match suffix {
        "module_items" => parse_quote!(ModuleItem),
        "stmts" => parse_quote!(Stmt),
        _ => {
            unimplemented!("Unknown suffix `{}`", suffix)
        }
    }
}

fn post_visit_hook(mode: Mode, suffix: &str) -> Option<Expr> {
    match suffix {
        "module_items" => Some(match mode {
            Mode::Fold => parse_quote!(
                swc_ecma_transforms_base::perf::Parallel::after_module_items(self, &mut nodes)
            ),

            Mode::VisitMut => parse_quote!(
                swc_ecma_transforms_base::perf::Parallel::after_module_items(self, nodes)
            ),
        }),
        "stmts" => Some(match mode {
            Mode::Fold => parse_quote!(swc_ecma_transforms_base::perf::Parallel::after_stmts(
                self, &mut nodes
            )),

            Mode::VisitMut => parse_quote!(swc_ecma_transforms_base::perf::Parallel::after_stmts(
                self, nodes
            )),
        }),
        _ => None,
    }
}

fn explode_hook_method_name(explode: bool, suffix: &str) -> Option<Ident> {
    if !explode {
        return None;
    }
    match suffix {
        "module_items" => Some(Ident::new("after_one_module_item", Span::call_site())),
        "stmts" => Some(Ident::new("after_one_stmt", Span::call_site())),
        _ => None,
    }
}

fn make_par_visit_method(mode: Mode, suffix: &str, explode: bool) -> ImplItemFn {
    let method_name = Ident::new(&format!("{}_{}", mode.prefix(), suffix), Span::call_site());
    let hook = post_visit_hook(mode, suffix);
    let explode_method_name = explode_hook_method_name(explode, suffix);
    let node_type = node_type(suffix);

    match (mode, explode_method_name) {
        (Mode::Fold, Some(explode_method_name)) => parse_quote!(
            fn #method_name(&mut self, mut nodes: Vec<#node_type>) -> Vec<#node_type> {
                use swc_common::errors::HANDLER;
                use swc_ecma_transforms_base::perf::{ParExplode, Parallel};
                use swc_ecma_visit::FoldWith;

                let mut buf = Vec::with_capacity(nodes.len());

                for node in nodes {
                    let mut visitor = Parallel::create(&*self);
                    let node = node.fold_with(&mut visitor);
                    ParExplode::#explode_method_name(&mut visitor, &mut buf);
                    buf.push(node);
                }

                let mut nodes = buf;
                {
                    #hook;
                }

                nodes
            }
        ),
        (Mode::Fold, None) => parse_quote!(
            fn #method_name(&mut self, nodes: Vec<#node_type>) -> Vec<#node_type> {
                use swc_common::errors::HANDLER;
                use swc_ecma_transforms_base::perf::Parallel;
                use swc_ecma_visit::FoldWith;

                let mut nodes = nodes.fold_children_with(self);
                {
                    #hook;
                }

                nodes
            }
        ),
        (Mode::VisitMut, Some(explode_method_name)) => parse_quote!(
            fn #method_name(&mut self, nodes: &mut Vec<#node_type>) {
                use std::mem::take;

                use swc_common::errors::HANDLER;
                use swc_ecma_transforms_base::perf::{ParExplode, Parallel};
                use swc_ecma_visit::VisitMutWith;

                let mut buf = Vec::with_capacity(nodes.len());

                for mut node in take(nodes) {
                    let mut visitor = Parallel::create(&*self);
                    node.visit_mut_with(&mut visitor);
                    ParExplode::#explode_method_name(&mut visitor, &mut buf);
                    buf.push(node);
                }

                *nodes = buf;

                {
                    #hook;
                }
            }
        ),
        (Mode::VisitMut, None) => parse_quote!(
            fn #method_name(&mut self, nodes: &mut Vec<#node_type>) {
                use swc_common::errors::HANDLER;
                use swc_ecma_transforms_base::perf::Parallel;
                use swc_ecma_visit::VisitMutWith;

                nodes.visit_mut_children_with(self);
                {
                    #hook;
                }
            }
        ),
    }
}
