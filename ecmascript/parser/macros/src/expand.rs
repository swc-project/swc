use swc_macros_common::prelude::*;
use syn::{
    fold::{self, Fold},
    parse::{Parse, Parser},
    spanned::Spanned,
    token::Token,
};

pub fn expand(_attr: TokenStream, item: Item) -> Item {
    let item = InjectSelf { parser: None }.fold_item(item);

    item
}

struct InjectSelf {
    parser: Option<Ident>,
}

#[cfg(procmacro2_semver_exempt)]
fn get_joinned_span(t: &ToTokens) -> Span {
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
fn get_joinned_span(t: &ToTokens) -> Span {
    let tts: TokenStream = t.dump().into();
    let mut first = None;
    for tt in tts {
        match first {
            None => first = Some(tt.span()),
            _ => {}
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
    let parser = Punctuated::parse_separated_nonempty;
    parser.parse2(t).expect("failed parse args")
}

impl Fold for InjectSelf {
    fn fold_expr_method_call(&mut self, i: ExprMethodCall) -> ExprMethodCall {
        /// Extract `p` from `self.parse_with(|p|{})`
        fn get_parser_arg(call: &ExprMethodCall) -> Ident {
            assert_eq!(call.args.len(), 1);
            let expr = call.args.iter().next().unwrap();

            let inputs = match expr {
                &Expr::Closure(ref c) => &c.inputs,
                _ => unreachable!("Parser.parse_with and Parser.spanned accepts a closure"),
            };
            assert_eq!(inputs.len(), 1);

            let p = inputs.clone().into_iter().next().unwrap();
            match p {
                FnArg::Inferred(Pat::Ident(PatIdent { ident, .. })) => ident,
                _ => unreachable!("Expected (|p| {..})"),
            }
        }

        if i.method == "parse_with"
            || i.method == "spanned"
            || i.method == "try_parse_ts"
            || i.method == "ts_in_no_context"
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
    fn fold_method_sig(&mut self, i: MethodSig) -> MethodSig {
        self.parser = i
            .decl
            .inputs
            .first()
            .map(Pair::into_value)
            .cloned()
            .and_then(|arg| match arg {
                FnArg::SelfRef(ArgSelfRef {
                    self_token,
                    mutability: Some(..),
                    ..
                })
                | FnArg::SelfValue(ArgSelf { self_token, .. }) => {
                    Some(Ident::new("self", self_token.span()))
                }
                _ => None,
            });
        i
    }

    fn fold_macro(&mut self, i: Macro) -> Macro {
        let parser = match self.parser {
            Some(ref s) => s.clone(),
            _ => {
                // If we are not in parser, don't do anything.
                return i;
            }
        };

        let name = i.path.dump().to_string();
        let span = get_joinned_span(&i.path);

        match &*name {
            "smallvec" | "vec" | "unreachable" | "tok" | "op" | "js_word" => return i,
            "println" | "print" | "format" | "assert" | "assert_eq" | "assert_ne"
            | "debug_assert" | "debug_assert_eq" | "debug_assert_ne" => {
                let mut args: Punctuated<Expr, token::Comma> = parse_args(i.tts.into());
                args = args
                    .into_pairs()
                    .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                    .collect();
                return Macro {
                    tts: args.dump().into(),
                    ..i
                };
            }

            "trace" | "debug" | "info" | "warn" | "error" => return i,
            //TODO
            "unimplemented" => return i,

            "spanned" => {
                let block: Block =
                    parse(i.tts.into()).expect("failed to parse input to spanned as a block");
                let block = self.fold_block(block);
                return Macro {
                    tts: TokenStream::from(quote_spanned!(span => #parser, ))
                        .into_iter()
                        .chain(TokenStream::from(block.dump()))
                        .collect(),
                    ..i
                };
            }

            //TODO: Collect expect and give that list to unexpected
            "assert_and_bump" | "bump" | "cur" | "cur_pos" | "eat" | "eof" | "eat_exact"
            | "expect" | "expect_exact" | "into_spanned" | "is" | "is_one_of" | "peeked_is"
            | "peek" | "peek_ahead" | "last_pos" | "return_if_arrow" | "span" | "syntax_error"
            | "unexpected" => {
                let tts = if i.tts.is_empty() {
                    quote_spanned!(span => #parser).into()
                } else {
                    let mut args: Punctuated<Expr, token::Comma> = parse_args(i.tts.into());
                    let args = args
                        .into_pairs()
                        .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                        .map(|arg| arg.dump())
                        .flat_map(|t| TokenStream::from(t));

                    TokenStream::from(quote_spanned!(span => #parser,))
                        .into_iter()
                        .chain(args)
                        .collect()
                };

                return Macro { tts, ..i };
            }
            _ => {
                unimplemented!("Macro: {:#?}", i);
            }
        }
    }
}
