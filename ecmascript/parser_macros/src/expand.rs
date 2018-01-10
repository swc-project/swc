use swc_macros_common::prelude::*;
use syn::fold::{self, Fold};
use syn::synom::Synom;

pub fn expand(_attr: TokenStream, item: Item) -> Item {
    MyFolder { parser: None }.fold_item(item)
}

struct MyFolder {
    parser: Option<Ident>,
}

fn get_joinned_span(t: &ToTokens) -> Span {
    let tts: TokenStream = t.dump().into();
    let (mut first, mut last) = (None, None);
    for tt in tts {
        match first {
            None => first = Some(tt.span),
            _ => {}
        }

        last = Some(tt.span);
    }
    let cs = Span::call_site();
    first.unwrap_or(cs).join(last.unwrap_or(cs)).unwrap_or(cs)
}

fn parse_args<T, P>(t: TokenStream) -> Punctuated<T, P>
where
    T: Synom,
    P: Synom,
{
    let buf = ::syn::buffer::TokenBuffer::new(t.into());
    Punctuated::parse_separated(buf.begin())
        .expect("failed parse args")
        .0
}

impl Fold for MyFolder {
    fn fold_expr_method_call(&mut self, i: ExprMethodCall) -> ExprMethodCall {
        match i.method.as_ref() {
            "parse_with" => {
                //TODO
                return fold::fold_expr_method_call(&mut MyFolder { parser: None }, i);
            }
            _ => {}
        }

        fold::fold_expr_method_call(self, i)
    }
    fn fold_method_sig(&mut self, i: MethodSig) -> MethodSig {
        self.parser = i.decl
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
                    Some(Ident::new("self", self_token.0))
                }
                _ => None,
            });
        i
    }

    fn fold_expr_closure(&mut self, i: ExprClosure) -> ExprClosure {
        if self.parser.is_none() {
            // if we don't know what closure is this, don't do anything.
            i
        } else {
            fold::fold_expr_closure(self, i)
        }
    }

    fn fold_macro(&mut self, i: Macro) -> Macro {
        let name = i.path.dump().to_string();
        let span = get_joinned_span(&i.path);

        match &*name {
            "vec" | "unreachable" | "tok" | "js_word" => return i,
            "println" | "print" | "format" | "assert" | "assert_eq" | "assert_ne"
            | "debug_assert" | "debug_assert_eq" | "debug_assert_ne" => {
                let mut args: Punctuated<Expr, token::Comma> = parse_args(i.tts.into());
                args = args.into_pairs()
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
                    tts: TokenStream::from(quote_spanned!(span => self,))
                        .into_iter()
                        .chain(TokenStream::from(block.dump()))
                        .collect(),
                    ..i
                };
            }

            //TODO: Collect expect and give that list to unexpected
            "assert_and_bump" | "bump" | "cur" | "cur_pos" | "eat" | "eof" | "eat_exact"
            | "expect" | "expect_exact" | "into_spanned" | "is" | "is_one_of" | "peeked_is"
            | "peek" | "last_pos" | "return_if_arrow" | "span" | "syntax_error" | "unexpected" => {
                let tts = if i.tts.is_empty() {
                    quote_spanned!(span => self).into()
                } else {
                    let mut args: Punctuated<Expr, token::Comma> = parse_args(i.tts.into());
                    let args = args.into_pairs()
                        .map(|el| el.map_item(|expr| self.fold_expr(expr)))
                        .map(|arg| arg.dump())
                        .flat_map(|t| TokenStream::from(t));

                    TokenStream::from(quote_spanned!(span => self,))
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
