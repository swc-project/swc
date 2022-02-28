#![allow(unused)]

use std::cell::RefCell;

use pmutil::q;
use swc_common::collections::AHashMap;
use syn::{parse_quote, punctuated::Punctuated, ExprPath, ExprReference, Token};

use crate::{ast::ToCode, input::QuoteVar};

#[derive(Debug)]
pub(crate) struct Ctx {
    pub(crate) vars: Vars,
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
                true
            } else {
                false
            }
        };

        if use_clone {
            let var_ref_expr = self.expr_for_var_ref();

            parse_quote!(swc_ecma_quote::ImplicitClone::clone_quote_var(#var_ref_expr))
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

pub fn prepare_vars(src: &dyn ToCode, vars: Punctuated<QuoteVar, Token![,]>) -> Vars {
    let mut init_map = Vars::default();
}
