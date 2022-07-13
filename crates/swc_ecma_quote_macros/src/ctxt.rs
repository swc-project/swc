#![allow(unused)]

use std::cell::RefCell;

use pmutil::q;
use swc_common::collections::AHashMap;
use syn::{parse_quote, punctuated::Punctuated, ExprPath, ExprReference, Token};

use crate::{ast::ToCode, input::QuoteVar};

#[derive(Debug)]
pub(crate) struct Ctx {
    pub(crate) vars: AHashMap<VarPos, Vars>,
}

impl Ctx {
    pub fn var(&self, ty: VarPos, var_name: &str) -> Option<&VarData> {
        self.vars.get(&ty)?.get(var_name)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum VarPos {
    Ident,
    Expr,
    Pat,
}

#[derive(Debug)]
pub struct VarData {
    is_counting: bool,

    /// How many times this variable should be cloned. 0 for variables used only
    /// once.
    clone: RefCell<usize>,

    ident: syn::Ident,
}

impl VarData {
    pub fn get_expr(&self) -> syn::Expr {
        if self.is_counting {
            *self.clone.borrow_mut() += 1;
            return self.expr_for_var_ref();
        }

        let use_clone = {
            let mut b = self.clone.borrow_mut();
            let val = *b;
            if val > 0 {
                *b -= 1;
                val != 1
            } else {
                false
            }
        };

        if use_clone {
            let var_ref_expr = self.expr_for_var_ref();

            parse_quote!(swc_ecma_quote::ImplicitClone::clone_quote_var(&#var_ref_expr))
        } else {
            self.expr_for_var_ref()
        }
    }

    fn expr_for_var_ref(&self) -> syn::Expr {
        syn::Expr::Path(ExprPath {
            attrs: Default::default(),
            qself: Default::default(),
            path: self.ident.clone().into(),
        })
    }
}

pub type Vars = AHashMap<String, VarData>;

pub(super) fn prepare_vars(
    src: &dyn ToCode,
    vars: Punctuated<QuoteVar, Token![,]>,
) -> (Vec<syn::Stmt>, AHashMap<VarPos, Vars>) {
    let mut stmts = vec![];
    let mut init_map = AHashMap::default();

    for var in vars {
        let value = var.value;

        let ident = var.name.clone();
        let ident_str = ident.to_string();

        let var_ident = syn::Ident::new(&format!("quote_var_{}", ident), ident.span());

        let old = init_map.insert(
            ident_str.clone(),
            VarData {
                is_counting: true,
                clone: Default::default(),
                ident: var_ident.clone(),
            },
        );

        if let Some(old) = old {
            panic!("Duplicate variable name: {}", ident_str);
        }

        stmts.push(parse_quote! {
            let #var_ident = #value;
        });
    }

    // Use `ToCode` to count how many times each variable is used.
    let mut cx = Ctx { vars: init_map };

    src.to_code(&cx);

    // We are done
    cx.vars
        .iter_mut()
        .for_each(|(k, v)| v.iter_mut().for_each(|(_, v)| v.is_counting = false));

    (stmts, cx.vars)
}
