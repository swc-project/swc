use proc_macro2::TokenStream;
use quote::quote;
use swc_macros_common::call_site;
use syn::{parse_quote, FnArg, Ident, ImplItem, ImplItemFn, ItemImpl, Pat, Path};

use crate::common::Mode;

pub fn expand(attr: TokenStream, item: ItemImpl) -> ItemImpl {
    let expander = Expander {
        handler: syn::parse2(attr).expect("Usage should be like #[fast_path(ArrowVisitor)]"),
        mode: detect_mode(&item),
    };
    let items = expander.inject_default_methods(item.items);

    ItemImpl {
        items: items
            .into_iter()
            .map(|item| match item {
                ImplItem::Fn(m) => ImplItem::Fn(expander.patch_method(m)),
                _ => item,
            })
            .collect(),
        ..item
    }
}

fn detect_mode(i: &ItemImpl) -> Mode {
    if i.items.iter().any(|item| match item {
        ImplItem::Fn(m) => m.sig.ident.to_string().starts_with("fold"),
        _ => false,
    }) {
        return Mode::Fold;
    }

    Mode::VisitMut
}

struct Expander {
    mode: Mode,
    handler: Path,
}

impl Expander {
    fn inject_default_methods(&self, mut items: Vec<ImplItem>) -> Vec<ImplItem> {
        let list = &[
            ("stmt", quote!(swc_ecma_ast::Stmt)),
            ("stmts", quote!(Vec<swc_ecma_ast::Stmt>)),
            ("module_decl", quote!(swc_ecma_ast::ModuleDecl)),
            ("module_item", quote!(swc_ecma_ast::ModuleItem)),
            ("module_items", quote!(Vec<swc_ecma_ast::ModuleItem>)),
            ("expr", quote!(swc_ecma_ast::Expr)),
            ("exprs", quote!(Vec<Box<swc_ecma_ast::Expr>>)),
            ("decl", quote!(swc_ecma_ast::Decl)),
            ("pat", quote!(swc_ecma_ast::Pat)),
        ];

        for (name, ty) in list {
            let has = items.iter().any(|item| match item {
                ImplItem::Fn(i) => i.sig.ident.to_string().ends_with(name),
                _ => false,
            });
            if has {
                continue;
            }
            let name = Ident::new(&format!("{}_{}", self.mode.prefix(), name), call_site());

            let method = match self.mode {
                Mode::Fold => parse_quote!(
                    fn #name(&mut self, node: #ty) -> #ty {
                        node.fold_children_with(self)
                    }
                ),
                Mode::VisitMut => parse_quote!(
                    fn #name(&mut self, node: &mut #ty) {
                        node.visit_mut_children_with(self)
                    }
                ),
            };

            items.push(method);
        }

        items
    }

    /// Add fast path to a method
    fn patch_method(&self, mut m: ImplItemFn) -> ImplItemFn {
        let ty_arg = m
            .sig
            .inputs
            .last()
            .expect("method of Fold / VisitMut must accept two parameters");
        let ty_arg = match ty_arg {
            FnArg::Receiver(_) => unreachable!(),
            FnArg::Typed(ty) => ty,
        };
        if m.sig.ident == "visit_mut_ident" || m.sig.ident == "fold_ident" {
            return m;
        }
        if m.block.stmts.is_empty() {
            return m;
        }

        let arg = match &*ty_arg.pat {
            Pat::Ident(i) => &i.ident,
            _ => unimplemented!(
                "Fast-path injection for Fold / VisitMut where pattern is not an ident"
            ),
        };

        let checker = &self.handler;

        let fast_path = match self.mode {
            Mode::Fold => parse_quote!(
                if !swc_ecma_transforms_base::perf::should_work::<#checker, _>(&#arg) {
                    return #arg;
                }
            ),
            Mode::VisitMut => parse_quote!(
                if !swc_ecma_transforms_base::perf::should_work::<#checker, _>(&*#arg) {
                    return;
                }
            ),
        };
        let mut stmts = vec![fast_path];
        stmts.extend(m.block.stmts);

        m.block.stmts = stmts;
        m
    }
}
