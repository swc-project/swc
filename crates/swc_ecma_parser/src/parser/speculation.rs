//! Reuse discarded speculative work without caching ASTs or committed
//! diagnostics.
//!
//! Entries survive ordinary input rewinds and function-local `State`
//! replacement. Whole-program retries restore the memo together with their
//! grammar checkpoint.

use swc_common::{BytePos, Span};

/// Closure inputs which can change a probe's result belong in its site
/// identity.
#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
#[cfg_attr(not(feature = "typescript"), allow(dead_code))]
pub(super) enum TsSpeculationKind {
    Postfix {
        context: super::expr::LhsContext,
        possible_async: bool,
    },
    Arrow {
        is_async: bool,
        params_start: Option<BytePos>,
        trailing_comma: Option<Span>,
    },
    InferConstraint,
}

#[cfg(feature = "typescript")]
mod memo {
    use rustc_hash::FxHashMap;

    use super::*;
    use crate::{input::Tokens, Context, PResult, Parser};

    /// Keep the lexical and parser contexts in sync with `ParserCheckpoint`.
    /// Syntax options and the language target are immutable within a parser.
    #[derive(Clone, Debug, Eq, Hash, PartialEq)]
    pub(in crate::parser) struct SpeculationKey {
        position: BytePos,
        token_end: BytePos,
        previous_end: BytePos,
        token: u8,
        token_flags: u8,
        line_break: bool,
        lexical_context: u8,
        grammar_context: u8,
        boundary_context: u8,
        syntax_context: u8,
        statement_context: u8,
        type_context: u8,
        program_parse_mode: u8,
        potential_arrow_start: BytePos,
        collect_await: bool,
        pending_await: Option<Span>,
        found_module_item: bool,
        ambiguous_script_different_ast: bool,
        #[cfg(feature = "flow")]
        allow_super_call: bool,
    }

    /// Nontransactional scalar effects must also occur when a probe is skipped.
    /// Cover-AST trailing commas are reconstructed by the committed parse; no
    /// discarded AST is reused. Label scopes restore themselves on failure.
    #[derive(Clone)]
    struct Effects {
        // Unlike the lexer state, these flags are not restored by an ordinary
        // checkpoint. Preserve the exact post-probe flags on a memo hit too.
        token_flags: crate::lexer::TokenFlags,
        potential_arrow_start: BytePos,
        pending_await: Option<Span>,
        found_module_item: bool,
        ambiguous_script_different_ast: bool,
    }

    #[derive(Clone, Debug, Eq, Hash, PartialEq)]
    pub(in crate::parser) struct TsSpeculationKey {
        kind: TsSpeculationKind,
        context: SpeculationKey,
    }

    #[derive(Clone, Default)]
    pub(in crate::parser) struct TsRejectedSpeculations {
        entries: FxHashMap<TsSpeculationKey, Effects>,
    }

    impl<I: Tokens> Parser<I> {
        pub(in crate::parser) fn speculation_key(&self) -> Option<SpeculationKey> {
            // The template extension has additional mutable state and is not a
            // TypeScript/Flow speculation entry point.
            #[cfg(feature = "tsrx")]
            if self.syntax().tsrx() {
                return None;
            }
            let ctx = self.ctx() | Context::IgnoreError;
            Some(SpeculationKey {
                position: self.cur_pos(),
                token_end: self.input.cur_span().hi,
                previous_end: self.input.prev_span.hi,
                token: self.input.cur() as u8,
                token_flags: self.input.token_flags().bits(),
                line_break: self.input.had_line_break_before_cur(),
                lexical_context: ctx.bits(),
                grammar_context: self.grammar_context.bits(),
                boundary_context: self.boundary_context.bits(),
                syntax_context: self.syntax_context as u8,
                statement_context: self.statement_context.bits(),
                type_context: self.type_context.bits(),
                program_parse_mode: self.program_parse_mode as u8,
                potential_arrow_start: self.state.potential_arrow_start,
                collect_await: self.state.collect_async_arrow_param_await,
                pending_await: self.state.pending_async_arrow_param_await,
                found_module_item: self.found_module_item,
                ambiguous_script_different_ast: self.ambiguous_script_different_ast,
                #[cfg(feature = "flow")]
                allow_super_call: self.allow_super_call,
            })
        }

        pub(in crate::parser) fn ts_speculation_key(
            &self,
            kind: TsSpeculationKind,
        ) -> Option<TsSpeculationKey> {
            self.speculation_key()
                .map(|context| TsSpeculationKey { kind, context })
        }

        pub(in crate::parser) fn has_rejected_ts_speculation(
            &mut self,
            key: &TsSpeculationKey,
        ) -> bool {
            let Some(entry) = self.ts_rejected_speculations.entries.get(key) else {
                return false;
            };
            let token_flags = entry.token_flags;
            self.input
                .iter
                .update_token_flags(|flags| *flags = token_flags);
            self.state.potential_arrow_start = entry.potential_arrow_start;
            self.state.pending_async_arrow_param_await = entry.pending_await;
            self.found_module_item |= entry.found_module_item;
            self.ambiguous_script_different_ast |= entry.ambiguous_script_different_ast;
            true
        }

        pub(in crate::parser) fn reject_ts_speculation(&mut self, key: Option<TsSpeculationKey>) {
            let Some(key) = key else { return };
            let effects = Effects {
                token_flags: self.input.token_flags(),
                potential_arrow_start: self.state.potential_arrow_start,
                pending_await: self.state.pending_async_arrow_param_await,
                found_module_item: self.found_module_item,
                ambiguous_script_different_ast: self.ambiguous_script_different_ast,
            };
            self.ts_rejected_speculations.entries.insert(key, effects);
        }

        pub(in crate::parser) fn try_parse_arrow<T>(
            &mut self,
            is_async: bool,
            params_start: Option<BytePos>,
            trailing_comma: Option<Span>,
            parse: impl FnOnce(&mut Self) -> PResult<Option<T>>,
        ) -> Option<T> {
            self.try_parse_ts_speculation(
                TsSpeculationKind::Arrow {
                    is_async,
                    params_start,
                    trailing_comma,
                },
                parse,
            )
        }

        /// Remember failures only: success must parse again to commit ASTs,
        /// comments, diagnostics, and the token source's observable effects.
        pub(in crate::parser) fn try_parse_ts_speculation<T>(
            &mut self,
            kind: TsSpeculationKind,
            op: impl FnOnce(&mut Self) -> PResult<Option<T>>,
        ) -> Option<T> {
            if !self.syntax().typescript() {
                return None;
            }
            let key = self.ts_speculation_key(kind);
            if key
                .as_ref()
                .is_some_and(|key| self.has_rejected_ts_speculation(key))
            {
                return None;
            }
            let result = self.try_parse_ts(op);
            if result.is_none() {
                self.reject_ts_speculation(key);
            }
            result
        }
    }
}

#[cfg(feature = "typescript")]
pub(super) use memo::{SpeculationKey, TsRejectedSpeculations};
