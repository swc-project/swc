//! Disposable lookahead boundaries for computed keys and ambiguous loop heads.

use rustc_hash::FxHashMap;
use swc_common::BytePos;

use crate::{input::Tokens, lexer::Token, Parser};

#[derive(Clone, Copy)]
enum ForHeadKind {
    Ordinary,
    ForOf,
    Inconclusive,
}

#[derive(Clone, Default)]
pub(super) struct ForHeadLookahead {
    scanned_parens: FxHashMap<BytePos, ForHeadKind>,
}

impl<I: Tokens> Parser<I> {
    /// A top-level semicolon proves an ordinary initializer. Scan all nested
    /// groups once, so an enclosing function body does not make inner heads
    /// rescan the same suffix. Ambiguous lexical goals stay with the grammar.
    pub(super) fn is_ordinary_for_head(&mut self) -> bool {
        let start = self.input.prev_span.lo;
        if let Some(kind) = self.for_head_lookahead.scanned_parens.get(&start) {
            return matches!(kind, ForHeadKind::Ordinary);
        }
        let flags = self.input.token_flags();
        let ordinary = self.ts_look_ahead(|p| {
            let mut groups = vec![(Token::LParen, start, ForHeadKind::ForOf)];
            let mut previous = Token::LParen;
            let mut before_previous = Token::LParen;
            loop {
                if p.input().is(Token::RBrace)
                    && groups
                        .last()
                        .is_some_and(|(open, _, _)| *open == Token::TemplateHead)
                {
                    p.input_mut().rescan_template_token(false);
                }
                let token = p.input().cur();
                let pos = p.cur_pos();
                if matches!(token, Token::Slash | Token::DivEq) {
                    // Token roles that need expression grammar remain
                    // inconclusive; never guess between division and regexp.
                    let contextual = matches!(
                        previous,
                        Token::Await
                            | Token::Yield
                            | Token::Of
                            | Token::Bang
                            | Token::PlusPlus
                            | Token::MinusMinus
                            | Token::Lt
                            | Token::Gt
                            | Token::LShift
                            | Token::RShift
                            | Token::ZeroFillRShift
                    );
                    let property = previous.is_word() && before_previous == Token::Dot;
                    if !contextual
                        && !property
                        && (previous.before_expr()
                            || matches!(previous, Token::TemplateHead | Token::TemplateMiddle))
                    {
                        p.input_mut().set_next_regexp(Some(pos));
                        p.bump();
                        p.input_mut().set_next_regexp(None);
                        continue;
                    }
                    if !contextual
                        && (property
                            || previous.is_word()
                            || matches!(
                                previous,
                                Token::Num
                                    | Token::BigInt
                                    | Token::Str
                                    | Token::Regex
                                    | Token::RBracket
                                    | Token::NoSubstitutionTemplateLiteral
                                    | Token::TemplateTail
                            ))
                    {
                        before_previous = previous;
                        previous = token;
                        p.bump();
                        continue;
                    }
                }
                if matches!(
                    token,
                    Token::Eof | Token::Error | Token::Slash | Token::DivEq | Token::BackQuote
                ) || (p.syntax().jsx() && matches!(token, Token::Lt | Token::JSXTagStart))
                {
                    for (open, pos, kind) in groups {
                        if open == Token::LParen {
                            p.for_head_lookahead.scanned_parens.entry(pos).or_insert(
                                if matches!(kind, ForHeadKind::Ordinary) {
                                    kind
                                } else {
                                    ForHeadKind::Inconclusive
                                },
                            );
                        }
                    }
                    return false;
                }
                match token {
                    Token::TemplateHead => groups.push((token, pos, ForHeadKind::ForOf)),
                    Token::TemplateTail
                        if !matches!(groups.pop(), Some((Token::TemplateHead, _, _))) =>
                    {
                        return false;
                    }
                    Token::LParen | Token::LBracket | Token::LBrace => {
                        groups.push((token, pos, ForHeadKind::ForOf))
                    }
                    Token::Semi => {
                        if let Some((Token::LParen, _, kind)) = groups.last_mut() {
                            *kind = ForHeadKind::Ordinary;
                        }
                        if groups.len() == 1 {
                            p.for_head_lookahead
                                .scanned_parens
                                .insert(start, ForHeadKind::Ordinary);
                            return true;
                        }
                    }
                    Token::RParen | Token::RBracket | Token::RBrace => {
                        let Some((open, pos, kind)) = groups.pop() else {
                            return false;
                        };
                        if !matches!(
                            (open, token),
                            (Token::LParen, Token::RParen)
                                | (Token::LBracket, Token::RBracket)
                                | (Token::LBrace, Token::RBrace)
                        ) {
                            return false;
                        }
                        if open == Token::LParen {
                            p.for_head_lookahead.scanned_parens.insert(pos, kind);
                        }
                        if groups.is_empty() {
                            return matches!(kind, ForHeadKind::Ordinary);
                        }
                    }
                    _ => {}
                }
                before_previous = previous;
                previous = token;
                p.bump();
            }
        });
        self.input
            .iter
            .update_token_flags(|current| *current = flags);
        ordinary
    }
}

#[derive(Clone, Eq, Hash, PartialEq)]
struct ComputedKeyContext {
    grammar: super::speculation::SpeculationKey,
}

struct ComputedKeyBoundary<I: Tokens> {
    checkpoint: super::ParserCheckpoint<I>,
    result: crate::PResult<swc_common::Span>,
    token_flags: crate::lexer::TokenFlags,
    potential_arrow_start: BytePos,
}

pub(super) struct ComputedKeyLookahead<I: Tokens> {
    pub(super) active: bool,
    expressions: FxHashMap<ComputedKeyContext, ComputedKeyBoundary<I>>,
}

impl<I: Tokens> Default for ComputedKeyLookahead<I> {
    fn default() -> Self {
        Self {
            active: false,
            expressions: FxHashMap::default(),
        }
    }
}

impl<I: Tokens> Clone for ComputedKeyLookahead<I> {
    fn clone(&self) -> Self {
        // Lexer checkpoints need not be Clone. A cloned parser can rebuild
        // these disposable boundaries without sharing mutable lexical state.
        Self {
            active: self.active,
            expressions: FxHashMap::default(),
        }
    }
}

impl<I: Tokens> Parser<I> {
    pub(super) fn with_computed_key_lookahead<R>(
        &mut self,
        parse: impl FnOnce(&mut Self) -> R,
    ) -> R {
        let active = std::mem::replace(&mut self.computed_key_lookahead.active, true);
        let defer_comments = self.input.iter.swap_defer_comments(true);
        let result = parse(self);
        if let Some(defer) = defer_comments {
            self.input.iter.set_defer_comments(defer);
        }
        self.computed_key_lookahead.active = active;
        result
    }

    /// Reuse an expression's lexical boundary and outcome, never its AST.
    /// Nested types reached by a disposable binding probe share these entries;
    /// committed keys parse normally.
    pub(super) fn parse_computed_key_lookahead(
        &mut self,
        parse: impl FnOnce(&mut Self) -> crate::PResult<Box<swc_ecma_ast::Expr>>,
    ) -> crate::PResult<Box<swc_ecma_ast::Expr>> {
        use swc_common::Spanned;
        use swc_ecma_ast::{Expr, Ident};

        debug_assert!(self.computed_key_lookahead.active);
        debug_assert!(self.ctx().contains(crate::Context::IgnoreError));
        let Some(grammar) = self.speculation_key() else {
            return parse(self);
        };
        let key = ComputedKeyContext { grammar };
        if let Some(cached) = self.computed_key_lookahead.expressions.remove(&key) {
            let checkpoint = cached.checkpoint;
            if self.input.iter.try_load_lookahead(checkpoint.lexer) {
                self.input.cur = checkpoint.buffer_cur;
                self.input.next = checkpoint.buffer_next;
                self.input.prev_span = checkpoint.buffer_prev_span;
                self.grammar_context = checkpoint.grammar_context;
                self.boundary_context = checkpoint.boundary_context;
                self.syntax_context = checkpoint.syntax_context;
                self.statement_context = checkpoint.statement_context;
                self.type_context = checkpoint.type_context;
                #[cfg(feature = "flow")]
                {
                    self.allow_super_call = checkpoint.allow_super_call;
                }
                self.input
                    .iter
                    .update_token_flags(|flags| *flags = cached.token_flags);
                self.state.potential_arrow_start = cached.potential_arrow_start;
                self.computed_key_lookahead.expressions.insert(
                    key,
                    ComputedKeyBoundary {
                        checkpoint: self.checkpoint_save(),
                        result: cached.result.clone(),
                        token_flags: cached.token_flags,
                        potential_arrow_start: cached.potential_arrow_start,
                    },
                );
                return cached.result.map(|span| {
                    Box::new(Expr::Ident(Ident::new_no_ctxt(swc_atoms::atom!(""), span)))
                });
            }
        }
        let diagnostics = self.input.iter.diagnostic_checkpoint_save();
        let module_detection = (self.found_module_item, self.ambiguous_script_different_ast);
        let pending_await = self.state.pending_async_arrow_param_await;
        let collect_await = self.state.collect_async_arrow_param_await;
        let labels = self.state.labels.len();
        let result = parse(self);
        // Diagnostics from failed probes are discarded by the surrounding
        // lookahead. Retain their failure boundary too, including lexer errors,
        // so nested malformed keys do not repeatedly expand the same subtree.
        if (result.is_err() || diagnostics == self.input.iter.diagnostic_checkpoint_save())
            && module_detection == (self.found_module_item, self.ambiguous_script_different_ast)
            && pending_await == self.state.pending_async_arrow_param_await
            && collect_await == self.state.collect_async_arrow_param_await
            && labels == self.state.labels.len()
        {
            self.computed_key_lookahead.expressions.insert(
                key,
                ComputedKeyBoundary {
                    checkpoint: self.checkpoint_save(),
                    result: result
                        .as_ref()
                        .map(|expr| expr.span())
                        .map_err(Clone::clone),
                    token_flags: self.input.token_flags(),
                    potential_arrow_start: self.state.potential_arrow_start,
                },
            );
        }
        result
    }
}
