use pmutil::ToTokensExt;
use quote::quote_spanned;
use swc_macros_common::prelude::*;
use syn::{
    fold::{self, Fold},
    parse::{Parse, Parser},
    spanned::Spanned,
    token::Token,
    *,
};

pub fn expand(_attr: TokenStream, item: Item) -> Item {
    InjectSelf { parser: None }.fold_item(item)
}

struct InjectSelf {
    parser: Option<Ident>,
}

#[cfg(procmacro2_semver_exempt)]
fn get_joinned_span(t: &dyn ToTokens) -> Span {
    let tts: TokenStream = t.dump().into();
    let (mut first, mut last) = (None, None);
    for tt in tts {
        match first {
            None => first = Some(tt.span()),
            _ => {}
        }

        last = Some(tt.span());
    }
    let cs = Span::call_site();
    first.unwrap_or(cs).join(last.unwrap_or(cs)).unwrap_or(cs)
}

#[cfg(not(procmacro2_semver_exempt))]
fn get_joinned_span(t: &dyn ToTokens) -> Span {
    let tts: TokenStream = t.dump();
    let mut first = None;
    for tt in tts {
        if first.is_none() {
            first = Some(tt.span());
        }

        // last = Some(tt.span());
    }
    let cs = Span::call_site();
    // first.unwrap_or(cs).join(last.unwrap_or(cs)).unwrap_or(cs)
    first.unwrap_or(cs)
}

fn parse_args<T, P>(t: TokenStream) -> Punctuated<T, P>
where
    T: Parse,
    P: Parse + Token,
{
    if t.is_empty() {
        return Punctuated::new();
    }
    let parser = Punctuated::parse_separated_nonempty;
    parser.parse2(t).expect("failed parse args")
}

impl Fold for InjectSelf {
    fn fold_expr_method_call(&mut self, i: ExprMethodCall) -> ExprMethodCall {
        /// Extract `p` from `self.parse_with(|p|{})`
        fn get_parser_arg(call: &ExprMethodCall) -> Ident {
            //            assert_eq!(call.args.len(), 1);
            let expr = &call.args[if call.method == "parse_fn_args_body" {
                2
            } else {
                0
            }];

            let inputs = match *expr {
                Expr::Closure(ref c) => &c.inputs,
                _ => unreachable!(
                    "Parser.parse_with and Parser.spanned accepts a closure\n{:?}",
                    expr
                ),
            };
            assert_eq!(inputs.len(), 1);

            let p = inputs.clone().into_iter().next().unwrap();
            match p {
                Pat::Type(PatType { pat, .. }) => match *pat {
                    Pat::Ident(PatIdent { ident, .. }) => ident.clone(),
                    _ => unreachable!("ident: Expected (|p| {{..}})\nGot {:?}", pat),
                },
                Pat::Ident(PatIdent { ident, .. }) => ident.clone(),
                _ => unreachable!("Expected (|p| {{..}})\nGot {:?}", p),
            }
        }

        if i.method == "parse_with"
            || i.method == "make_method"
            || i.method == "parse_fn_args_body"
            || i.method == "spanned"
            || i.method == "try_parse_ts"
            || i.method == "ts_in_no_context"
            || i.method == "ts_look_ahead"
        {
            //TODO
            let parser = get_parser_arg(&i);
            return fold::fold_expr_method_call(
                &mut InjectSelf {
                    parser: Some(parser),
                },
                i,
            );
        }

        fold::fold_expr_method_call(self, i)
    }

    fn fold_signature(&mut self, i: Signature) -> Signature {
        self.parser = match i.inputs.first().cloned().and_then(|arg| match arg {
            FnArg::Receiver(Receiver { self_token, .. }) => {
                Some(Ident::new("self", self_token.span()))
            }
            _ => None,
        }) {
            Some(i) => Some(i),
            None => return i,
        };

        i
    }

    fn fold_macro(&mut self, i: Macro) -> Macro {
        let name = i.path.dump().to_string();
        let span = get_joinned_span(&i.path);

        match &*name {
            "smallvec" | "vec" | "unreachable" | "tok" | "op" | "js_word" => i,
            "println" | "print" | "format" | "assert" | "assert_eq" | "assert_ne"
            | "debug_assert" | "debug_assert_eq" | "debug_assert_ne" | "dbg" => {
                let mut args: Punctuated<Expr, token::Comma> = parse_args(i.tokens.clone());
                if &*name == "dbg" && i.tokens.is_empty() {
                    return Macro { ..i };
                }

                args = args
                    .into_pairs()
                    .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                    .collect();
                Macro {
                    tokens: args.dump(),
                    ..i
                }
            }

            "trace" | "debug" | "info" | "warn" | "error" | "macro_rules" | "wrap" => i,
            //TODO
            "unimplemented" => i,

            "spanned" => {
                let parser = match self.parser {
                    Some(ref s) => s.clone(),
                    _ => {
                        // If we are not in parser, don't do anything.
                        unreachable!("spanned() from outside of #[parser]");
                    }
                };

                let block: Block =
                    parse(i.tokens.into()).expect("failed to parse input to spanned as a block");
                let block = self.fold_block(block);
                Macro {
                    tokens: quote_spanned!(span => #parser, )
                        .into_iter()
                        .chain(block.dump())
                        .collect(),
                    ..i
                }
            }

            //TODO: Collect expect and give that list to unexpected
            "trace_cur" | "assert_and_bump" | "bump" | "cur" | "cur_pos" | "eat" | "eof"
            | "eat_exact" | "expect" | "expect_exact" | "into_spanned" | "is" | "is_exact"
            | "is_one_of" | "peeked_is" | "peek" | "peek_ahead" | "last_pos"
            | "return_if_arrow" | "span" | "syntax_error" | "make_error" | "emit_error"
            | "unexpected" | "store" => {
                let parser = match self.parser {
                    Some(ref s) => s.clone(),
                    _ => {
                        unreachable!("outside of #[parser]");
                    }
                };
                let tokens = if i.tokens.is_empty() {
                    quote_spanned!(span => #parser)
                } else {
                    let args: Punctuated<Expr, token::Comma> = parse_args(i.tokens);
                    let args = args
                        .into_pairs()
                        .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                        .map(|arg| arg.dump())
                        .flatten();

                    let tokens = quote_spanned!(span => #parser,)
                        .into_iter()
                        .chain(args)
                        .collect();
                    tokens
                };

                Macro { tokens, ..i }
            }
            _ => {
                unimplemented!("Macro: {:#?}", i);
            }
        }
    }
}
