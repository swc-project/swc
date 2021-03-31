use pmutil::ToTokensExt;
use quote::quote_spanned;
use swc_macros_common::prelude::*;
use syn::{
    fold::Fold,
    parse::{Parse, Parser},
    spanned::Spanned,
    token::Token,
    *,
};

pub(crate) struct InjectSelf {
    pub parser: Option<Ident>,
}

#[cfg(procmacro2_semver_exempt)]
fn get_joined_span(t: &dyn ToTokens) -> Span {
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
fn get_joined_span(t: &dyn ToTokens) -> Span {
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

fn parse_args<T, P>(tokens: TokenStream) -> Punctuated<T, P>
where
    T: Parse,
    P: Parse + Token,
{
    let parser = Punctuated::parse_separated_nonempty;
    parser.parse2(tokens).expect("failed parse args")
}

impl Fold for InjectSelf {
    fn fold_signature(&mut self, i: Signature) -> Signature {
        self.parser = i.inputs.first().cloned().and_then(|arg| match arg {
            FnArg::Receiver(Receiver {
                self_token,
                mutability: Some(..),
                ..
            })
            | FnArg::Receiver(Receiver { self_token, .. }) => {
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
        let span = get_joined_span(&i.path);

        match &*name {
            "smallvec" | "vec" | "unreachable" | "tok" | "op" | "js_word" => i,
            "println" | "print" | "format" | "assert" | "assert_eq" | "assert_ne"
            | "debug_assert" | "debug_assert_eq" | "debug_assert_ne" | "dbg" => {
                let mut args: Punctuated<Expr, token::Comma> = parse_args(i.tokens);
                args = args
                    .into_pairs()
                    .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                    .collect();
                Macro {
                    tokens: args.dump(),
                    ..i
                }
            }

            "trace" | "debug" | "info" | "warn" | "error" => i,
            //TODO
            "unimplemented" => i,

            //TODO: Collect expect and give that list to unexpected
            "keyword" | "emit" | "punct" | "semi" | "formatting_semi" | "space"
            | "formatting_space" | "operator" | "opt" | "opt_leading_space" => {
                let tokens = if i.tokens.is_empty() {
                    quote_spanned!(span => #parser)
                } else {
                    let args: Punctuated<Expr, token::Comma> = parse_args(i.tokens);
                    let args = args
                        .into_pairs()
                        .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                        .map(|arg| arg.dump())
                        .flatten();

                    quote_spanned!(span => #parser,)
                        .into_iter()
                        .chain(args)
                        .collect()
                };

                Macro { tokens, ..i }
            }
            _ => {
                unimplemented!("Macro: {:#?}", i);
            }
        }
    }
}
