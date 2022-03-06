use std::{
    fmt::{self, Debug},
    sync::Arc,
};

use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, BytePos, SourceMap, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{match_quote_type, QuotesType},
};

const NEW_LINE: char = '\n';
const CARRIAGE_RETURN: char = '\r';
const TAB: char = '\t';
const DEFAULT_CODE_LEN: usize = 80;

#[derive(Debug, PartialEq, Eq)]
enum CommentType {
    SingleLine,
    MultiLine,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MaxLengthConfig {
    code: Option<usize>,
    comments: Option<usize>,
    tab_width: Option<usize>,
    ignore_comments: Option<bool>,
    ignore_trailing_comments: Option<bool>,
    ignore_strings: Option<bool>,
    ignore_template_literals: Option<bool>,
    // Cases below are unsupported
    // ignore_urls: Option<bool>,
    // ignore_regexp_literals: Option<bool>,
    // ignore_pattern: Option<bool>,
}

pub fn max_length(
    source_map: &Arc<SourceMap>,
    top_level_ctxt: SyntaxContext,
    config: &RuleConfig<MaxLengthConfig>,
) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(MaxLength::new(
            source_map.clone(),
            top_level_ctxt,
            config,
        ))),
    }
}

#[derive(Default)]
struct MaxLength {
    expected_reaction: LintRuleReaction,
    source_map: Arc<SourceMap>,
    top_level_ctxt: SyntaxContext,

    max_line_length: usize,
    max_comment_length: usize,
    tab_width: usize,
    ignore_comments: bool,
    ignore_strings: bool,
    ignore_template_literals: bool,
    ignore_trailing_comments: bool,

    bytes_offset: usize,
    lo: usize,
    line_len: usize,
    inside_string: Option<QuotesType>,
    inside_comment: Option<CommentType>,
    is_trailing_comment: bool,
    inside_regex: bool,
}

impl Debug for MaxLength {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("MaxLength")
            .field("expected_reaction", &self.expected_reaction)
            .field("top_level_ctxt", &self.top_level_ctxt)
            .field("max_line_length", &self.max_line_length)
            .field("max_comment_length", &self.max_comment_length)
            .field("tab_width", &self.tab_width)
            .field("ignore_strings", &self.ignore_strings)
            .field("ignore_template_literals", &self.ignore_template_literals)
            .field("ignore_trailing_comments", &self.ignore_trailing_comments)
            .finish()
    }
}

impl MaxLength {
    fn new(
        source_map: Arc<SourceMap>,
        top_level_ctxt: SyntaxContext,
        config: &RuleConfig<MaxLengthConfig>,
    ) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            source_map,
            top_level_ctxt,

            max_line_length: rule_config.code.unwrap_or(DEFAULT_CODE_LEN),
            max_comment_length: rule_config
                .comments
                .or(rule_config.code)
                .unwrap_or(DEFAULT_CODE_LEN),
            tab_width: rule_config.tab_width.unwrap_or(4),
            ignore_comments: rule_config.ignore_comments.unwrap_or(false),
            ignore_strings: rule_config.ignore_strings.unwrap_or(false),
            ignore_template_literals: rule_config.ignore_template_literals.unwrap_or(false),
            ignore_trailing_comments: rule_config.ignore_trailing_comments.unwrap_or(false),

            bytes_offset: 0,
            lo: 0,
            line_len: 0,
            inside_string: None,
            inside_comment: None,
            is_trailing_comment: false,
            inside_regex: false,
        }
    }

    fn check_file_source(&mut self, span: Span) {
        let source = &self.source_map.lookup_byte_offset(span.lo).sf.src;

        let mut prev_char: char = '\0';

        for ch in source.as_str().chars() {
            self.bytes_offset += ch.len_utf8();

            match ch {
                NEW_LINE => {
                    self.check();

                    self.line_len = 0;
                    self.lo = self.bytes_offset;

                    if let Some(CommentType::SingleLine) = self.inside_comment {
                        self.inside_comment = None;
                        self.is_trailing_comment = false;
                    }
                }
                CARRIAGE_RETURN => {
                    // just skip \r symbol
                }
                TAB => {
                    self.line_len += self.tab_width;
                }
                _ => {
                    // Check is string entry
                    if let Some(quote) = match_quote_type(ch) {
                        if let Some(string_quote_type) = self.inside_string {
                            if string_quote_type == quote && prev_char != '\\' {
                                self.inside_string = None;
                            }
                        } else {
                            self.inside_string = Some(quote);
                        }
                    }

                    if self.inside_string.is_none() {
                        // Check is comment entry
                        match (prev_char, ch) {
                            ('/', '*') => {
                                self.inside_comment = Some(CommentType::MultiLine);
                            }
                            ('*', '/') => {
                                self.inside_comment = None;
                            }
                            ('/', '/') => {
                                self.inside_comment = Some(CommentType::SingleLine);

                                if self.line_len > 1 {
                                    self.is_trailing_comment = true;
                                }
                            }
                            _ => {
                                if prev_char != '/' && prev_char != '\\' && ch == '/' {
                                    self.inside_regex = !self.inside_regex;
                                }
                            }
                        }
                    }

                    self.line_len += 1;
                }
            };

            prev_char = ch
        }
    }

    fn emit_report(&self) {
        let message = format!(
            "This line has a length of {}. Maximum allowed is {}",
            self.line_len, self.max_line_length,
        );

        let hi = (self.bytes_offset - 1) as u32;

        let span = Span::new(BytePos(self.lo as u32), BytePos(hi), self.top_level_ctxt);

        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, &message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, &message).emit();
            }
            _ => {}
        });
    }

    fn check(&self) {
        if self.inside_comment.is_some() && !self.is_trailing_comment {
            if self.ignore_comments {
                return;
            }

            if self.line_len > self.max_comment_length {
                self.emit_report();

                return;
            }

            return;
        }

        if self.is_trailing_comment && self.ignore_trailing_comments {
            return;
        }

        match self.inside_string {
            Some(QuotesType::Double) | Some(QuotesType::Single) => {
                if self.ignore_strings {
                    return;
                }
            }
            Some(QuotesType::Backtick) => {
                if self.ignore_template_literals {
                    return;
                }
            }
            _ => {}
        }

        if self.line_len > self.max_line_length {
            self.emit_report();
        }
    }
}

impl Visit for MaxLength {
    noop_visit_type!();

    fn visit_module(&mut self, module: &Module) {
        self.check_file_source(module.span);
    }

    fn visit_script(&mut self, script: &Script) {
        self.check_file_source(script.span);
    }
}
