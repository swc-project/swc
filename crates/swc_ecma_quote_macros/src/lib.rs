#![deny(missing_docs)]

extern crate proc_macro;

use std::iter::once;

use quote::ToTokens;
use syn::{Block, ExprBlock};

use crate::{
    ast::ToCode,
    ctxt::{prepare_vars, Ctx},
    input::QuoteInput,
    ret_type::parse_input_type,
};

mod ast;
mod builder;
mod ctxt;
mod input;
mod ret_type;

/// Don't invoke this macro directly, use the `quote!` macro from
/// `swc_ecma_quote` instead.
#[proc_macro]
pub fn internal_quote(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let QuoteInput {
        src,
        as_token: _,
        output_type,
        vars,
    } = syn::parse::<QuoteInput>(input).expect("failed to parse input to quote!()");

    let ret_type =
        parse_input_type(&src.value(), &output_type).expect("failed to parse input type");

    let vars = vars.map(|v| v.1);

    let (stmts, vars) = if let Some(vars) = vars {
        prepare_vars(&ret_type, vars)
    } else {
        Default::default()
    };

    let cx = Ctx { vars };

    let expr_for_ast_creation = ret_type.to_code(&cx);

    syn::Expr::Block(ExprBlock {
        attrs: Default::default(),
        label: Default::default(),
        block: Block {
            brace_token: Default::default(),
            stmts: stmts
                .into_iter()
                .chain(once(syn::Stmt::Expr(expr_for_ast_creation)))
                .collect(),
        },
    })
    .to_token_stream()
    .into()
}
